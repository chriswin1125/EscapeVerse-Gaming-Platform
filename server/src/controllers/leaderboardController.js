import Leaderboard from '../models/Leaderboard.js';

// @route   GET /api/leaderboard
// @desc    Get top escapes with optional room & difficulty filters
export const getLeaderboard = async (req, res, next) => {
  try {
    const { room, difficulty, sortBy = 'score', limit = 50 } = req.query;
    const filter = {};

    if (room) filter.room = room;
    if (difficulty) filter.difficulty = difficulty;

    const sortOptions = sortBy === 'time' ? { timeTakenSeconds: 1 } : { score: -1, timeTakenSeconds: 1 };

    const entries = await Leaderboard.find(filter)
      .sort(sortOptions)
      .limit(Number(limit))
      .populate('room', 'title theme');

    res.json({
      success: true,
      count: entries.length,
      leaderboard: entries
    });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/leaderboard/overview
// @desc    Get high-level leaderboard stats & podium for dashboard
export const getLeaderboardOverview = async (req, res, next) => {
  try {
    const topScorers = await Leaderboard.find()
      .sort({ score: -1 })
      .limit(5)
      .populate('room', 'title theme');

    const fastestEscapes = await Leaderboard.find()
      .sort({ timeTakenSeconds: 1 })
      .limit(5)
      .populate('room', 'title theme');

    res.json({
      success: true,
      topScorers,
      fastestEscapes
    });
  } catch (err) {
    next(err);
  }
};
