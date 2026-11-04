import { Server } from 'socket.io';
import GameSession from '../models/GameSession.js';
import Puzzle from '../models/Puzzle.js';
import Room from '../models/Room.js';
import { validatePuzzleAnswer, finalizeGameSession } from '../services/gameEngine.js';

// In-memory registry for active countdown intervals
// Key: roomCode -> { intervalId, sessionRef }
const activeTimers = new Map();

export const setupSocketServer = (server, clientUrl) => {
  const io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (
          !origin ||
          origin === clientUrl ||
          origin.includes('localhost') ||
          origin.includes('127.0.0.1') ||
          origin.includes('escape-verse-gaming.vercel.app') ||
          origin.endsWith('.vercel.app') ||
          origin.endsWith('.onrender.com')
        ) {
          return callback(null, true);
        }
        return callback(null, true);
      },
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  const broadcastSessionUpdate = async (roomCode) => {
    try {
      const session = await GameSession.findOne({ roomCode })
        .populate('room')
        .populate('solvedPuzzles.puzzleId', 'title type stageNumber rewardPoints');
      if (session) {
        io.to(`session:${roomCode}`).emit('session_updated', session);
      }
    } catch (err) {
      console.error('[Socket] Failed to broadcast session update:', err);
    }
  };

  const startSessionTimer = (roomCode) => {
    if (activeTimers.has(roomCode)) {
      clearInterval(activeTimers.get(roomCode).intervalId);
    }

    const intervalId = setInterval(async () => {
      try {
        const session = await GameSession.findOne({ roomCode, status: 'in_progress' });
        if (!session) {
          clearInterval(intervalId);
          activeTimers.delete(roomCode);
          return;
        }

        if (session.timeRemainingSeconds <= 1) {
          session.timeRemainingSeconds = 0;
          clearInterval(intervalId);
          activeTimers.delete(roomCode);

          // Game failed due to timeout
          await finalizeGameSession(session, false);
          io.to(`session:${roomCode}`).emit('game_over_timeout', {
            session,
            message: 'CRITICAL FAILURE: Countdown reached zero. Containment breached!'
          });
          await broadcastSessionUpdate(roomCode);
          return;
        }

        session.timeRemainingSeconds -= 1;
        await session.save();

        // Broadcast tick every 2 seconds to reduce socket traffic, or whenever under 60 seconds
        if (session.timeRemainingSeconds % 2 === 0 || session.timeRemainingSeconds <= 60) {
          io.to(`session:${roomCode}`).emit('timer_tick', {
            timeRemainingSeconds: session.timeRemainingSeconds,
            penaltiesAppliedSeconds: session.penaltiesAppliedSeconds
          });
        }
      } catch (err) {
        console.error(`[Timer Error for ${roomCode}]`, err);
      }
    }, 1000);

    activeTimers.set(roomCode, { intervalId });
  };

  io.on('connection', (socket) => {
    // 1. Join game session
    socket.on('join_session', async ({ roomCode, user }) => {
      try {
        if (!roomCode || !user) return;
        const normalizedCode = roomCode.toUpperCase().trim();
        socket.join(`session:${normalizedCode}`);

        const session = await GameSession.findOne({ roomCode: normalizedCode }).populate('room');
        if (!session) {
          socket.emit('error_notification', { message: 'Escape session not found.' });
          return;
        }

        // Check if player is already in room or add them
        const existingPlayer = session.players.find(
          (p) => (p.user && p.user.toString() === user._id) || p.username === user.username
        );

        if (existingPlayer) {
          existingPlayer.connected = true;
          existingPlayer.socketId = socket.id;
          existingPlayer.avatar = user.avatar || existingPlayer.avatar;
          existingPlayer.lastActive = new Date();
        } else {
          if (session.players.length >= 6) {
            socket.emit('error_notification', { message: 'Game room is at full capacity (6 players).' });
            return;
          }
          if (session.status !== 'lobby') {
            socket.emit('error_notification', { message: 'Game session has already started.' });
            return;
          }
          session.players.push({
            user: user._id,
            username: user.username,
            avatar: user.avatar || 'cyber-ninja',
            isHost: session.players.length === 0,
            isReady: false,
            connected: true,
            socketId: socket.id
          });
        }

        await session.save();
        await broadcastSessionUpdate(normalizedCode);

        // System greeting
        io.to(`session:${normalizedCode}`).emit('new_chat_message', {
          id: `sys-${Date.now()}`,
          sender: 'SYSTEM',
          avatar: 'bot',
          message: `${user.username} has entered the room.`,
          type: 'system',
          timestamp: new Date()
        });
      } catch (err) {
        console.error('[Socket:join_session]', err);
      }
    });

    // 2. Toggle ready status
    socket.on('toggle_ready', async ({ roomCode, username, isReady }) => {
      try {
        const session = await GameSession.findOne({ roomCode: roomCode.toUpperCase() });
        if (!session || session.status !== 'lobby') return;

        const player = session.players.find((p) => p.username === username);
        if (player) {
          player.isReady = isReady;
          await session.save();
          await broadcastSessionUpdate(roomCode.toUpperCase());
        }
      } catch (err) {
        console.error('[Socket:toggle_ready]', err);
      }
    });

    // 3. Start game (Host only)
    socket.on('start_game', async ({ roomCode, username }) => {
      try {
        const normalizedCode = roomCode.toUpperCase();
        const session = await GameSession.findOne({ roomCode: normalizedCode }).populate('room');
        if (!session) return;

        const player = session.players.find((p) => p.username === username);
        if (!player || !player.isHost) {
          socket.emit('error_notification', { message: 'Only the mission host can initiate the escape.' });
          return;
        }

        session.status = 'in_progress';
        session.startedAt = new Date();
        session.currentStage = 1;
        await session.save();

        startSessionTimer(normalizedCode);

        io.to(`session:${normalizedCode}`).emit('game_started', {
          currentStage: 1,
          timeLimitSeconds: session.timeLimitSeconds,
          message: 'Containment sequence engaged! Timer is ticking!'
        });

        await broadcastSessionUpdate(normalizedCode);
      } catch (err) {
        console.error('[Socket:start_game]', err);
      }
    });

    // 4. Discover room clue hotspot
    socket.on('discover_clue', async ({ roomCode, hotspotId, clue, username }) => {
      try {
        const normalizedCode = roomCode.toUpperCase();
        const session = await GameSession.findOne({ roomCode: normalizedCode });
        if (!session || session.status !== 'in_progress') return;

        // Check if clue already discovered
        const alreadyDiscovered = session.discoveredClues.some((c) => c.id === hotspotId);
        if (!alreadyDiscovered) {
          session.discoveredClues.push({
            id: hotspotId,
            title: clue.title || 'Hidden Clue',
            content: clue.content || 'A cryptic cipher inscription discovered.',
            type: clue.type || 'note',
            discoveredBy: username,
            discoveredAt: new Date()
          });

          session.score += 50;
          await session.save();

          io.to(`session:${normalizedCode}`).emit('clue_discovered', {
            hotspotId,
            clue,
            discoveredBy: username,
            newScore: session.score
          });

          io.to(`session:${normalizedCode}`).emit('new_chat_message', {
            id: `clue-${Date.now()}`,
            sender: 'INTEL',
            avatar: 'bot',
            message: `🔍 ${username} discovered intel: "${clue.title || 'Secret Clue'}"!`,
            type: 'clue',
            timestamp: new Date()
          });

          await broadcastSessionUpdate(normalizedCode);
        }
      } catch (err) {
        console.error('[Socket:discover_clue]', err);
      }
    });

    // 5. Submit puzzle answer
    socket.on('submit_puzzle_answer', async ({ roomCode, puzzleId, answer, username }) => {
      try {
        const normalizedCode = roomCode.toUpperCase();
        const session = await GameSession.findOne({ roomCode: normalizedCode }).populate('room');
        if (!session || session.status !== 'in_progress') return;

        const puzzle = await Puzzle.findById(puzzleId);
        if (!puzzle) {
          socket.emit('puzzle_result', { isCorrect: false, message: 'Puzzle target not found' });
          return;
        }

        // Check if puzzle already solved
        const isAlreadySolved = session.solvedPuzzles.some((p) => p.puzzleId.toString() === puzzleId);
        if (isAlreadySolved) {
          socket.emit('puzzle_result', { isCorrect: true, alreadySolved: true, message: 'Already decrypted!' });
          return;
        }

        const validation = validatePuzzleAnswer(puzzle, answer);

        if (validation.isCorrect) {
          // Solved!
          session.solvedPuzzles.push({
            puzzleId: puzzle._id,
            solvedBy: username,
            solvedAt: new Date(),
            pointsAwarded: puzzle.rewardPoints || 250
          });
          session.score += puzzle.rewardPoints || 250;

          // Check if all puzzles in current stage are solved
          const currentStageObj = session.room.stages.find((s) => s.stageNumber === session.currentStage);
          const stagePuzzleIds = (currentStageObj?.puzzles || []).map((p) => p.toString());

          const solvedStagePuzzles = session.solvedPuzzles.filter((sp) =>
            stagePuzzleIds.includes(sp.puzzleId.toString())
          );

          let stageAdvanced = false;
          let gameEscaped = false;

          if (stagePuzzleIds.length > 0 && solvedStagePuzzles.length >= stagePuzzleIds.length) {
            // Stage completed!
            if (session.currentStage < session.room.totalStages) {
              session.currentStage += 1;
              stageAdvanced = true;
            } else {
              // Final stage finished! Team escapes!
              gameEscaped = true;
            }
          }

          await session.save();

          io.to(`session:${normalizedCode}`).emit('puzzle_solved', {
            puzzleId,
            puzzleTitle: puzzle.title,
            solvedBy: username,
            pointsAwarded: puzzle.rewardPoints || 250,
            newScore: session.score
          });

          io.to(`session:${normalizedCode}`).emit('new_chat_message', {
            id: `solve-${Date.now()}`,
            sender: 'SECURITY OVERRIDE',
            avatar: 'bot',
            message: `⚡ ${username} cracked "${puzzle.title}" (+${puzzle.rewardPoints} pts)!`,
            type: 'solve',
            timestamp: new Date()
          });

          if (stageAdvanced) {
            io.to(`session:${normalizedCode}`).emit('stage_advanced', {
              newStage: session.currentStage,
              stageName: session.room.stages[session.currentStage - 1]?.name,
              lore: session.room.stages[session.currentStage - 1]?.lore
            });

            io.to(`session:${normalizedCode}`).emit('new_chat_message', {
              id: `stage-${Date.now()}`,
              sender: 'SYSTEM',
              avatar: 'bot',
              message: `🚪 Sector breached! Entering Stage ${session.currentStage}: ${
                session.room.stages[session.currentStage - 1]?.name
              }!`,
              type: 'stage',
              timestamp: new Date()
            });
          }

          if (gameEscaped) {
            if (activeTimers.has(normalizedCode)) {
              clearInterval(activeTimers.get(normalizedCode).intervalId);
              activeTimers.delete(normalizedCode);
            }

            await finalizeGameSession(session, true);

            io.to(`session:${normalizedCode}`).emit('game_escaped', {
              session,
              message: 'MISSION ACCOMPLISHED! All security protocols breached. You successfully escaped!'
            });
          }

          await broadcastSessionUpdate(normalizedCode);
        } else {
          // Failed attempt: Apply time penalty
          const penalty = puzzle.answerPenaltySeconds || 15;
          session.penaltiesAppliedSeconds += penalty;
          session.timeRemainingSeconds = Math.max(0, session.timeRemainingSeconds - penalty);
          await session.save();

          io.to(`session:${normalizedCode}`).emit('penalty_applied', {
            penaltySeconds: penalty,
            reason: `Incorrect answer by ${username} on ${puzzle.title}`,
            timeRemainingSeconds: session.timeRemainingSeconds,
            penaltiesAppliedSeconds: session.penaltiesAppliedSeconds
          });

          io.to(`session:${normalizedCode}`).emit('new_chat_message', {
            id: `pen-${Date.now()}`,
            sender: 'ALARM',
            avatar: 'alert',
            message: `⚠️ Security tripwire! Incorrect input by ${username}. -${penalty}s penalty!`,
            type: 'alert',
            timestamp: new Date()
          });

          socket.emit('puzzle_result', {
            isCorrect: false,
            message: 'Access Denied. Incorrect override sequence.'
          });
        }
      } catch (err) {
        console.error('[Socket:submit_puzzle_answer]', err);
      }
    });

    // 6. Request puzzle hint
    socket.on('request_hint', async ({ roomCode, puzzleId, username }) => {
      try {
        const normalizedCode = roomCode.toUpperCase();
        const session = await GameSession.findOne({ roomCode: normalizedCode });
        if (!session || session.status !== 'in_progress') return;

        const puzzle = await Puzzle.findById(puzzleId);
        if (!puzzle || !puzzle.hints || puzzle.hints.length === 0) return;

        // Count how many hints already used for this puzzle
        const usedHintsForThisPuzzle = session.hintsUsed.filter((h) => h.puzzleId.toString() === puzzleId);
        const nextHintIdx = usedHintsForThisPuzzle.length;

        if (nextHintIdx >= puzzle.hints.length) {
          socket.emit('error_notification', { message: 'All available hints have already been decrypted.' });
          return;
        }

        const hintText = puzzle.hints[nextHintIdx]?.text || puzzle.hints[nextHintIdx];
        const penalty = puzzle.hintPenaltySeconds || 30;

        session.hintsUsed.push({
          puzzleId: puzzle._id,
          hintIndex: nextHintIdx,
          hintText,
          penaltySeconds: penalty,
          requestedBy: username,
          requestedAt: new Date()
        });

        session.penaltiesAppliedSeconds += penalty;
        session.timeRemainingSeconds = Math.max(0, session.timeRemainingSeconds - penalty);
        await session.save();

        io.to(`session:${normalizedCode}`).emit('hint_revealed', {
          puzzleId,
          hintIndex: nextHintIdx,
          hintText,
          penaltySeconds: penalty,
          requestedBy: username,
          timeRemainingSeconds: session.timeRemainingSeconds
        });

        io.to(`session:${normalizedCode}`).emit('new_chat_message', {
          id: `hint-${Date.now()}`,
          sender: 'INTEL DECRYPTOR',
          avatar: 'bot',
          message: `💡 ${username} acquired a hint for "${puzzle.title}" (-${penalty}s penalty).`,
          type: 'alert',
          timestamp: new Date()
        });

        await broadcastSessionUpdate(normalizedCode);
      } catch (err) {
        console.error('[Socket:request_hint]', err);
      }
    });

    // 7. Team tactical chat & pings
    socket.on('send_chat', async ({ roomCode, sender, avatar, message, type = 'chat' }) => {
      try {
        if (!roomCode || !message?.trim()) return;
        const normalizedCode = roomCode.toUpperCase();

        const chatMessage = {
          id: `chat-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          sender,
          avatar: avatar || 'cyber-ninja',
          message: message.trim(),
          type,
          timestamp: new Date()
        };

        const session = await GameSession.findOne({ roomCode: normalizedCode });
        if (session) {
          session.chatLog.push(chatMessage);
          if (session.chatLog.length > 100) session.chatLog.shift(); // keep last 100
          await session.save();
        }

        io.to(`session:${normalizedCode}`).emit('new_chat_message', chatMessage);
      } catch (err) {
        console.error('[Socket:send_chat]', err);
      }
    });

    // 8. Disconnect handler
    socket.on('disconnect', async () => {
      try {
        const session = await GameSession.findOne({ 'players.socketId': socket.id });
        if (session) {
          const player = session.players.find((p) => p.socketId === socket.id);
          if (player) {
            player.connected = false;
            await session.save();
            io.to(`session:${session.roomCode}`).emit('player_disconnected', {
              username: player.username
            });
            await broadcastSessionUpdate(session.roomCode);
          }
        }
      } catch (err) {
        console.error('[Socket:disconnect]', err);
      }
    });
  });

  return io;
};
