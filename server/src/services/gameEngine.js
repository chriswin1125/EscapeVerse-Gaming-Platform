import GameSession from '../models/GameSession.js';
import Puzzle from '../models/Puzzle.js';
import Room from '../models/Room.js';
import User from '../models/User.js';
import Leaderboard from '../models/Leaderboard.js';
import Achievement from '../models/Achievement.js';

/**
 * Validates a puzzle solution server-side based on its type
 */
export const validatePuzzleAnswer = (puzzle, submittedAnswer) => {
  if (!puzzle || !puzzle.solution) {
    return { isCorrect: false, reason: 'Invalid puzzle specification' };
  }

  const { type, solution } = puzzle;

  switch (type) {
    case 'cipher': {
      const cleanSubmit = String(submittedAnswer || '').trim().toUpperCase();
      const cleanTarget = String(solution.answer || '').trim().toUpperCase();
      return { isCorrect: cleanSubmit === cleanTarget };
    }

    case 'keypad': {
      const cleanSubmit = String(submittedAnswer || '').trim();
      const cleanTarget = String(solution.code || '').trim();
      return { isCorrect: cleanSubmit === cleanTarget };
    }

    case 'wire_cut': {
      // solution.cutSequence is an array of wire IDs or colors in correct order
      if (!Array.isArray(submittedAnswer)) {
        return { isCorrect: false, reason: 'Invalid cut sequence format' };
      }
      const targetSeq = solution.cutSequence;
      const isCorrect =
        submittedAnswer.length === targetSeq.length &&
        submittedAnswer.every((val, idx) => String(val) === String(targetSeq[idx]));
      return { isCorrect };
    }

    case 'pattern_grid': {
      // solution.pattern is an array of cell indices or 2D coordinates
      if (!Array.isArray(submittedAnswer)) {
        return { isCorrect: false };
      }
      const targetPattern = solution.pattern;
      const isCorrect =
        submittedAnswer.length === targetPattern.length &&
        submittedAnswer.every((val, idx) => Number(val) === Number(targetPattern[idx]));
      return { isCorrect };
    }

    case 'slider': {
      // solution.positions is an array of required values with optional tolerance
      if (!Array.isArray(submittedAnswer)) return { isCorrect: false };
      const targetPositions = solution.positions;
      const tolerance = solution.tolerance || 3;
      const isCorrect =
        submittedAnswer.length === targetPositions.length &&
        submittedAnswer.every((val, idx) => Math.abs(Number(val) - Number(targetPositions[idx])) <= tolerance);
      return { isCorrect };
    }

    case 'chemical_lab': {
      // solution.beakers is an array of liquid volumes or order of added reagents
      if (!Array.isArray(submittedAnswer)) return { isCorrect: false };
      const targetOrder = solution.order;
      const isCorrect =
        submittedAnswer.length === targetOrder.length &&
        submittedAnswer.every((val, idx) => String(val) === String(targetOrder[idx]));
      return { isCorrect };
    }

    case 'memory_match': {
      // submittedAnswer is total matched pairs or completion token
      if (typeof submittedAnswer === 'object' && submittedAnswer.matchedCount !== undefined) {
        return { isCorrect: submittedAnswer.matchedCount >= solution.totalPairs };
      }
      return { isCorrect: Boolean(submittedAnswer === true || submittedAnswer?.completed) };
    }

    case 'hidden_object': {
      // submittedAnswer is array of found item ids
      if (!Array.isArray(submittedAnswer)) return { isCorrect: false };
      const targetItems = solution.itemIds || [];
      const hasAll = targetItems.every((item) => submittedAnswer.includes(item));
      return { isCorrect: hasAll };
    }

    default:
      return { isCorrect: false, reason: 'Unknown puzzle type' };
  }
};

/**
 * Checks and awards achievements to participating players
 */
export const checkAndAwardAchievements = async (session, isVictory) => {
  try {
    for (const playerSlot of session.players) {
      if (!playerSlot.user) continue;

      const user = await User.findById(playerSlot.user);
      if (!user) continue;

      const userAchievements = new Set(user.achievements.map((a) => a.code));
      const newlyUnlocked = [];

      if (isVictory) {
        // FIRST_ESCAPE
        if (!userAchievements.has('FIRST_ESCAPE')) {
          newlyUnlocked.push({
            code: 'FIRST_ESCAPE',
            title: 'First Escape',
            icon: 'DoorOpen'
          });
        }

        // SPEED_SOLVER: finished with > 50% time left
        const halfTime = session.timeLimitSeconds / 2;
        if (session.timeRemainingSeconds >= halfTime && !userAchievements.has('SPEED_SOLVER')) {
          newlyUnlocked.push({
            code: 'SPEED_SOLVER',
            title: 'Speed Solver',
            icon: 'Zap'
          });
        }

        // PERFECT_ESCAPE: zero hints used and 0 penalties
        if (
          session.hintsUsed.length === 0 &&
          session.penaltiesAppliedSeconds === 0 &&
          !userAchievements.has('PERFECT_ESCAPE')
        ) {
          newlyUnlocked.push({
            code: 'PERFECT_ESCAPE',
            title: 'Perfect Escape',
            icon: 'ShieldCheck'
          });
        }

        // TEAM_CHAMPION: 2 or more players escaped together
        if (session.players.length >= 2 && !userAchievements.has('TEAM_CHAMPION')) {
          newlyUnlocked.push({
            code: 'TEAM_CHAMPION',
            title: 'Team Champion',
            icon: 'Users'
          });
        }

        // MASTER_DETECTIVE: discovered all clues in the room
        const roomDoc = await Room.findById(session.room);
        let totalRoomHotspots = 0;
        roomDoc?.stages?.forEach((s) => {
          totalRoomHotspots += (s.hotspots || []).length;
        });

        if (
          totalRoomHotspots > 0 &&
          session.discoveredClues.length >= totalRoomHotspots &&
          !userAchievements.has('MASTER_DETECTIVE')
        ) {
          newlyUnlocked.push({
            code: 'MASTER_DETECTIVE',
            title: 'Master Detective',
            icon: 'Search'
          });
        }

        // PUZZLE_GENIUS: user personally solved 3 or more puzzles
        const userSolvedCount = session.solvedPuzzles.filter((p) => p.solvedBy === user.username).length;
        if (userSolvedCount >= 3 && !userAchievements.has('PUZZLE_GENIUS')) {
          newlyUnlocked.push({
            code: 'PUZZLE_GENIUS',
            title: 'Puzzle Genius',
            icon: 'Cpu'
          });
        }
      }

      if (newlyUnlocked.length > 0) {
        for (const ach of newlyUnlocked) {
          user.achievements.push(ach);
          user.updateXP(200); // 200 bonus XP per achievement
        }
        await user.save();
      }
    }
  } catch (error) {
    console.error('[GameEngine] Error awarding achievements:', error);
  }
};

/**
 * Calculates final score and registers to Leaderboard
 */
export const finalizeGameSession = async (session, isVictory) => {
  session.status = isVictory ? 'escaped' : 'failed';
  session.endedAt = new Date();

  // Score calculation:
  // Base points: 1000 for escape, 0 for failure
  // Time bonus: 5 points per remaining second
  // Stage bonus: 500 per stage
  // Clue discovery bonus: 50 points per clue
  // Minus penalties
  if (isVictory) {
    const timeBonus = Math.max(0, session.timeRemainingSeconds * 5);
    const difficultyMultiplier =
      session.difficulty === 'hard' ? 1.5 : session.difficulty === 'medium' ? 1.2 : 1.0;

    let computedScore =
      (1000 +
        session.currentStage * 300 +
        timeBonus +
        session.discoveredClues.length * 50 -
        session.penaltiesAppliedSeconds * 2) *
      difficultyMultiplier;

    session.score = Math.max(100, Math.round(computedScore));
  } else {
    session.score = Math.max(50, session.solvedPuzzles.length * 150 + session.discoveredClues.length * 25);
  }

  await session.save();

  // Populate room title
  const room = await Room.findById(session.room);
  const timeTaken = Math.max(1, session.timeLimitSeconds - session.timeRemainingSeconds);

  // If victory, record in Leaderboard
  if (isVictory && room) {
    await Leaderboard.create({
      session: session._id,
      room: room._id,
      roomTitle: room.title,
      theme: room.theme,
      difficulty: session.difficulty,
      teamName: `${session.players[0]?.username || 'Alpha'}'s Team`,
      players: session.players.map((p) => ({
        user: p.user,
        username: p.username,
        avatar: p.avatar
      })),
      timeTakenSeconds: timeTaken,
      timeRemainingSeconds: session.timeRemainingSeconds,
      score: session.score,
      hintsUsedCount: session.hintsUsed.length,
      escapedAt: new Date()
    });
  }

  // Update user stats
  for (const playerSlot of session.players) {
    if (!playerSlot.user) continue;
    const user = await User.findById(playerSlot.user);
    if (!user) continue;

    user.stats.gamesPlayed += 1;
    if (isVictory) {
      user.stats.escapes += 1;
      user.stats.winStreak += 1;
      user.stats.totalScore += session.score;

      if (!user.stats.fastestEscapeSeconds || timeTaken < user.stats.fastestEscapeSeconds) {
        user.stats.fastestEscapeSeconds = timeTaken;
      }
      user.updateXP(Math.round(session.score / 2));
    } else {
      user.stats.failures += 1;
      user.stats.winStreak = 0;
      user.updateXP(50); // effort XP
    }

    user.stats.puzzlesSolved += session.solvedPuzzles.filter((p) => p.solvedBy === user.username).length;
    await user.save();
  }

  // Trigger achievement evaluations
  await checkAndAwardAchievements(session, isVictory);

  return session;
};
