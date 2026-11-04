import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useAudio } from '../context/AudioContext';
import api from '../services/api';

import GameHeader from '../components/game/GameHeader';
import RoomLobby from '../components/game/RoomLobby';
import RoomEnvironment from '../components/game/RoomEnvironment';
import ClueInventory from '../components/game/ClueInventory';
import TeamChat from '../components/game/TeamChat';
import PuzzleModal from '../components/game/PuzzleModal';
import VictoryScreen from '../components/game/VictoryScreen';
import DefeatScreen from '../components/game/DefeatScreen';
import HowToPlayModal from '../components/common/HowToPlayModal';

const GameSessionPage = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { socket, isConnected } = useSocket();
  const { play } = useAudio();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePuzzle, setActivePuzzle] = useState(null);
  const [penaltyFlash, setPenaltyFlash] = useState(false);
  const [howToPlayOpen, setHowToPlayOpen] = useState(false);

  // 1. Initial REST Fetch
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Authentication required to enter game session.');
      navigate('/login');
      return;
    }

    const fetchSession = async () => {
      try {
        const res = await api.get(`/api/sessions/code/${roomCode}`);
        if (res.success && res.session) {
          setSession(res.session);
        }
      } catch (err) {
        toast.error(err.message || 'Unable to join escape session.');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [roomCode, isAuthenticated, navigate]);

  // 2. Real-Time Socket Connection & Event Handlers
  useEffect(() => {
    if (!socket || !session || !user) return;

    // Join room channel
    socket.emit('join_session', { roomCode: session.roomCode, user });

    // Listeners
    socket.on('session_updated', (updatedSession) => {
      setSession(updatedSession);
    });

    socket.on('timer_tick', ({ timeRemainingSeconds, penaltiesAppliedSeconds }) => {
      setSession((prev) => (prev ? { ...prev, timeRemainingSeconds, penaltiesAppliedSeconds } : prev));
      if (timeRemainingSeconds <= 30 && timeRemainingSeconds % 5 === 0) {
        play('tick');
      }
    });

    socket.on('game_started', () => {
      play('click');
      toast.success('Room unlocked! Timer is ticking!');
    });

    socket.on('clue_discovered', ({ clue, discoveredBy }) => {
      play('clue');
      toast.success(`${discoveredBy} discovered clue: "${clue.title || 'Secret Clue'}"!`);
    });

    socket.on('puzzle_solved', ({ puzzleId, puzzleTitle, solvedBy, pointsAwarded }) => {
      play('success');
      toast.success(`Solved! ${solvedBy} cracked "${puzzleTitle}" (+${pointsAwarded} pts)!`);
      setActivePuzzle((prev) => (prev?._id?.toString() === puzzleId?.toString() ? null : prev));
    });

    socket.on('stage_advanced', ({ newStage, stageName }) => {
      play('success');
      toast.success(`Door Unlocked! Advancing to Stage ${newStage}: ${stageName}!`, { duration: 5000 });
    });

    socket.on('penalty_applied', ({ penaltySeconds, reason }) => {
      play('error');
      setPenaltyFlash(true);
      setTimeout(() => setPenaltyFlash(false), 800);
      toast.error(`Wrong Answer! -${penaltySeconds}s time penalty.`);
    });

    socket.on('game_escaped', ({ session: escapedSession }) => {
      setSession(escapedSession);
    });

    socket.on('game_over_timeout', ({ session: failedSession }) => {
      setSession(failedSession);
    });

    socket.on('new_chat_message', (msg) => {
      setSession((prev) => {
        if (!prev) return prev;
        const chatLog = [...(prev.chatLog || []), msg];
        return { ...prev, chatLog };
      });
    });

    return () => {
      socket.off('session_updated');
      socket.off('timer_tick');
      socket.off('game_started');
      socket.off('clue_discovered');
      socket.off('puzzle_solved');
      socket.off('stage_advanced');
      socket.off('penalty_applied');
      socket.off('game_escaped');
      socket.off('game_over_timeout');
      socket.off('new_chat_message');
    };
  }, [socket, session?.roomCode, user]);

  // Socket Actions
  const handleToggleReady = (isReady) => {
    socket?.emit('toggle_ready', {
      roomCode: session.roomCode,
      username: user.username,
      isReady
    });
  };

  const handleStartGame = () => {
    socket?.emit('start_game', {
      roomCode: session.roomCode,
      username: user.username
    });
  };

  const handleHotspotClick = (spot) => {
    if (session.status !== 'in_progress') return;
    if (spot.clueRevealed) {
      socket?.emit('discover_clue', {
        roomCode: session.roomCode,
        hotspotId: spot.id,
        clue: spot.clueRevealed,
        username: user.username
      });
    }
  };

  const handleSubmitPuzzleAnswer = (puzzleId, answer) => {
    socket?.emit('submit_puzzle_answer', {
      roomCode: session.roomCode,
      puzzleId,
      answer,
      username: user.username
    });
  };

  const handleRequestHint = (puzzleId) => {
    socket?.emit('request_hint', {
      roomCode: session.roomCode,
      puzzleId,
      username: user.username
    });
  };

  const handleSendMessage = (message) => {
    socket?.emit('send_chat', {
      roomCode: session.roomCode,
      sender: user.username,
      avatar: user.avatar,
      message,
      type: 'chat'
    });
  };

  const handleLeaveSession = () => {
    if (window.confirm('Are you sure you want to exit the escape room?')) {
      navigate('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center text-neutral-400 text-sm">
        Connecting to game room...
      </div>
    );
  }

  if (!session) return null;

  // Render Based on Status:
  // 1. Lobby Waiting Lounge
  if (session.status === 'lobby') {
    return (
      <>
        <RoomLobby
          session={session}
          currentUser={user}
          onToggleReady={handleToggleReady}
          onStartGame={handleStartGame}
          onSendMessage={handleSendMessage}
          onOpenHowToPlay={() => setHowToPlayOpen(true)}
        />
        <HowToPlayModal isOpen={howToPlayOpen} onClose={() => setHowToPlayOpen(false)} />
      </>
    );
  }

  const solvedIds = (session.solvedPuzzles || []).map((sp) => sp.puzzleId?.toString() || sp.puzzleId?._id?.toString());

  return (
    <div className={`relative min-h-screen transition-colors duration-300 ${penaltyFlash ? 'bg-rose-950/40' : ''}`}>
      {/* Game HUD Header */}
      <GameHeader
        roomTitle={session.room?.title}
        difficulty={session.difficulty}
        timeRemainingSeconds={session.timeRemainingSeconds}
        penaltiesAppliedSeconds={session.penaltiesAppliedSeconds}
        score={session.score}
        currentStage={session.currentStage}
        totalStages={session.room?.totalStages || 3}
        onLeaveSession={handleLeaveSession}
        onOpenHowToPlay={() => setHowToPlayOpen(true)}
      />

      {/* Main Mission Screen: Canvas + Side Hud */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Center 3-Cols: Interactive Room Canvas */}
        <div className="lg:col-span-3 space-y-4">
          <RoomEnvironment
            room={session.room}
            currentStageNumber={session.currentStage}
            onHotspotClick={handleHotspotClick}
            onOpenPuzzle={(puz) => setActivePuzzle(puz)}
            discoveredClues={session.discoveredClues || []}
            solvedPuzzleIds={solvedIds}
          />
        </div>

        {/* Right 1-Col: Intel Dossier & Team Radio HUD */}
        <div className="space-y-4 flex flex-col justify-between">
          <ClueInventory clues={session.discoveredClues || []} />
          <TeamChat
            chatLog={session.chatLog || []}
            onSendMessage={handleSendMessage}
            currentUser={user}
          />
        </div>
      </div>

      {/* Interactive Puzzle Modal */}
      {activePuzzle && (
        <PuzzleModal
          puzzle={activePuzzle}
          isOpen={!!activePuzzle}
          onClose={() => setActivePuzzle(null)}
          onSubmitAnswer={handleSubmitPuzzleAnswer}
          onRequestHint={handleRequestHint}
          isSolved={solvedIds.includes(activePuzzle._id?.toString())}
          hintsUsed={session.hintsUsed || []}
        />
      )}

      {/* Victory Escaped Screen */}
      {session.status === 'escaped' && (
        <VictoryScreen session={session} onPlayAgain={() => navigate('/rooms')} />
      )}

      {/* Defeat Lockdown Screen */}
      {session.status === 'failed' && (
        <DefeatScreen session={session} onRetry={() => navigate(`/rooms/${session.room?.slug}`)} />
      )}

      {/* How to Play Modal */}
      <HowToPlayModal isOpen={howToPlayOpen} onClose={() => setHowToPlayOpen(false)} />
    </div>
  );
};

export default GameSessionPage;
