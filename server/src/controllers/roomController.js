import Room from '../models/Room.js';
import Puzzle from '../models/Puzzle.js';

// @route   GET /api/rooms
// @desc    Get all active escape rooms
export const getRooms = async (req, res, next) => {
  try {
    const { theme, difficulty } = req.query;
    const filter = { isActive: true };

    if (theme) filter.theme = theme;
    if (difficulty) filter.difficulty = difficulty;

    const rooms = await Room.find(filter)
      .populate({
        path: 'stages.puzzles',
        select: 'title type difficulty instructions rewardPoints' // exclude solution!
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: rooms.length,
      rooms
    });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/rooms/:slug
// @desc    Get single escape room by slug
export const getRoomBySlug = async (req, res, next) => {
  try {
    const room = await Room.findOne({ slug: req.params.slug, isActive: true }).populate({
      path: 'stages.puzzles',
      select: 'title type difficulty instructions lore rewardPoints config hintPenaltySeconds' // exclude solution!
    });

    if (!room) {
      return res.status(404).json({ success: false, message: 'Escape room not found.' });
    }

    res.json({
      success: true,
      room
    });
  } catch (err) {
    next(err);
  }
};
