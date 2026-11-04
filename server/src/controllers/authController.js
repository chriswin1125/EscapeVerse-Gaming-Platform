import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'escapeverse_super_secret_jwt_key_9988_xyz!', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// @route   POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { username, email, password, avatar } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide username, email and password' });
    }

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.trim() }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email.toLowerCase() ? 'Email is already registered' : 'Username is taken'
      });
    }

    const user = await User.create({
      username: username.trim(),
      email: email.toLowerCase(),
      password,
      avatar: avatar || 'cyber-ninja'
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        title: user.title,
        xp: user.xp,
        level: user.level,
        stats: user.stats,
        achievements: user.achievements
      }
    });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        title: user.title,
        xp: user.xp,
        level: user.level,
        stats: user.stats,
        achievements: user.achievements
      }
    });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      user
    });
  } catch (err) {
    next(err);
  }
};

// @route   PUT /api/auth/profile
export const updateProfile = async (req, res, next) => {
  try {
    const { avatar, username } = req.body;
    const user = await User.findById(req.user._id);

    if (username && username.trim() !== user.username) {
      const taken = await User.findOne({ username: username.trim() });
      if (taken) {
        return res.status(400).json({ success: false, message: 'Username is already in use.' });
      }
      user.username = username.trim();
    }

    if (avatar) {
      user.avatar = avatar;
    }

    await user.save();

    res.json({
      success: true,
      user
    });
  } catch (err) {
    next(err);
  }
};
