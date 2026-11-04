import GameSession from '../models/GameSession.js';
import Room from '../models/Room.js';

// Helper to generate readable 6-character room code
const generateRoomCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// @route   POST /api/sessions/create
// @desc    Create a new multiplayer escape room session
export const createSession = async (req, res, next) => {
  try {
    const { roomId, difficulty = 'medium' } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Selected escape room does not exist.' });
    }

    // Determine time limit in seconds
    const minutes = room.timeLimitMinutes?.[difficulty] || 20;
    const timeLimitSeconds = minutes * 60;

    // Generate unique code
    let roomCode = generateRoomCode();
    while (await GameSession.findOne({ roomCode })) {
      roomCode = generateRoomCode();
    }

    const session = await GameSession.create({
      roomCode,
      room: room._id,
      difficulty,
      host: req.user._id,
      players: [
        {
          user: req.user._id,
          username: req.user.username,
          avatar: req.user.avatar || 'cyber-ninja',
          isHost: true,
          isReady: true,
          connected: true
        }
      ],
      status: 'lobby',
      currentStage: 1,
      timeLimitSeconds,
      timeRemainingSeconds: timeLimitSeconds,
      score: 0,
      chatLog: [
        {
          id: `welcome-${Date.now()}`,
          sender: 'SYSTEM',
          avatar: 'bot',
          message: `Mission lounge created. Share invite code [${roomCode}] with your team.`,
          type: 'system',
          timestamp: new Date()
        }
      ]
    });

    const populatedSession = await GameSession.findById(session._id).populate('room');

    res.status(201).json({
      success: true,
      roomCode: session.roomCode,
      session: populatedSession
    });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/sessions/:roomCode
// @desc    Get session details by room code (with sanitized puzzles)
export const getSessionByCode = async (req, res, next) => {
  try {
    const { roomCode } = req.params;
    const session = await GameSession.findOne({ roomCode: roomCode.toUpperCase() })
      .populate({
        path: 'room',
        populate: {
          path: 'stages.puzzles',
          select: 'title type difficulty instructions lore rewardPoints config hintPenaltySeconds' // no solution
        }
      })
      .populate('players.user', 'username avatar level');

    if (!session) {
      return res.status(404).json({ success: false, message: 'Game session not found.' });
    }

    res.json({
      success: true,
      session
    });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/sessions/my/recent
// @desc    Get recent sessions for the current logged in user
export const getUserRecentSessions = async (req, res, next) => {
  try {
    const sessions = await GameSession.find({
      'players.user': req.user._id
    })
      .populate('room', 'title theme difficulty bannerImage')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      sessions
    });
  } catch (err) {
    next(err);
  }
};
