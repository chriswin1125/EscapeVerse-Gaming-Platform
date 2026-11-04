import Room from '../models/Room.js';
import Puzzle from '../models/Puzzle.js';
import User from '../models/User.js';
import GameSession from '../models/GameSession.js';
import Leaderboard from '../models/Leaderboard.js';

// @route   GET /api/admin/stats
export const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRooms = await Room.countDocuments();
    const totalPuzzles = await Puzzle.countDocuments();
    const totalSessions = await GameSession.countDocuments();
    const activeSessionsCount = await GameSession.countDocuments({ status: 'in_progress' });
    const escapedCount = await GameSession.countDocuments({ status: 'escaped' });
    const failedCount = await GameSession.countDocuments({ status: 'failed' });

    const recentSessions = await GameSession.find()
      .populate('room', 'title theme')
      .sort({ createdAt: -1 })
      .limit(8);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalRooms,
        totalPuzzles,
        totalSessions,
        activeSessionsCount,
        escapedCount,
        failedCount,
        escapeRate: totalSessions > 0 ? Math.round((escapedCount / totalSessions) * 100) : 0
      },
      recentSessions
    });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/admin/rooms
export const getAdminRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find().populate('stages.puzzles').sort({ createdAt: -1 });
    res.json({ success: true, rooms });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/admin/rooms
export const createRoom = async (req, res, next) => {
  try {
    const { title, slug, theme, tagline, description, difficulty, timeLimitMinutes, themeColors, stages } = req.body;

    const room = await Room.create({
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      theme,
      tagline,
      description,
      difficulty,
      timeLimitMinutes,
      themeColors,
      stages: stages || [],
      totalStages: stages ? stages.length : 3
    });

    res.status(201).json({ success: true, room });
  } catch (err) {
    next(err);
  }
};

// @route   PUT /api/admin/rooms/:id
export const updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    res.json({ success: true, room });
  } catch (err) {
    next(err);
  }
};

// @route   DELETE /api/admin/rooms/:id
export const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    res.json({ success: true, message: 'Room deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/admin/puzzles
export const getAdminPuzzles = async (req, res, next) => {
  try {
    const puzzles = await Puzzle.find().sort({ createdAt: -1 });
    res.json({ success: true, puzzles });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/admin/puzzles
export const createPuzzle = async (req, res, next) => {
  try {
    const { title, type, difficulty, instructions, lore, rewardPoints, config, solution, hints, explanation } =
      req.body;

    const puzzle = await Puzzle.create({
      title,
      type,
      difficulty,
      instructions,
      lore,
      rewardPoints,
      config,
      solution,
      hints: hints || [],
      explanation
    });

    res.status(201).json({ success: true, puzzle });
  } catch (err) {
    next(err);
  }
};

// @route   PUT /api/admin/puzzles/:id
export const updatePuzzle = async (req, res, next) => {
  try {
    const puzzle = await Puzzle.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!puzzle) {
      return res.status(404).json({ success: false, message: 'Puzzle not found' });
    }
    res.json({ success: true, puzzle });
  } catch (err) {
    next(err);
  }
};

// @route   DELETE /api/admin/puzzles/:id
export const deletePuzzle = async (req, res, next) => {
  try {
    const puzzle = await Puzzle.findByIdAndDelete(req.params.id);
    if (!puzzle) {
      return res.status(404).json({ success: false, message: 'Puzzle not found' });
    }
    res.json({ success: true, message: 'Puzzle deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/admin/users
export const getAdminUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    next(err);
  }
};

// @route   PUT /api/admin/users/:id/role
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.role = role;
    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};
