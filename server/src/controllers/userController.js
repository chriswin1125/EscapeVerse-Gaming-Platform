import User from '../models/User.js';
import GameSession from '../models/GameSession.js';
import Achievement from '../models/Achievement.js';

// @route   GET /api/users/profile/:username
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Fetch user recent sessions
    const sessions = await GameSession.find({
      'players.user': user._id
    })
      .populate('room', 'title theme difficulty')
      .sort({ createdAt: -1 })
      .limit(10);

    const allAchievements = await Achievement.find();

    res.json({
      success: true,
      user,
      sessions,
      allAchievements
    });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/users/achievements
export const getAllAchievements = async (req, res, next) => {
  try {
    const achievements = await Achievement.find().sort({ tier: 1 });
    res.json({ success: true, achievements });
  } catch (err) {
    next(err);
  }
};
