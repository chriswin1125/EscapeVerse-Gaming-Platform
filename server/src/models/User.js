import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [20, 'Username cannot exceed 20 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    role: {
      type: String,
      enum: ['player', 'admin'],
      default: 'player'
    },
    avatar: {
      type: String,
      default: 'cyber-ninja'
    },
    title: {
      type: String,
      default: 'Novice Escapist'
    },
    xp: {
      type: Number,
      default: 0
    },
    level: {
      type: Number,
      default: 1
    },
    stats: {
      gamesPlayed: { type: Number, default: 0 },
      escapes: { type: Number, default: 0 },
      failures: { type: Number, default: 0 },
      totalScore: { type: Number, default: 0 },
      fastestEscapeSeconds: { type: Number, default: null },
      winStreak: { type: Number, default: 0 },
      puzzlesSolved: { type: Number, default: 0 }
    },
    achievements: [
      {
        code: { type: String, required: true },
        title: { type: String, required: true },
        icon: { type: String, default: 'Trophy' },
        unlockedAt: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Calculate level based on XP
userSchema.methods.updateXP = function (earnedXP) {
  this.xp += earnedXP;
  // Level formula: Level = Math.floor(Math.sqrt(xp / 100)) + 1
  const newLevel = Math.floor(Math.sqrt(this.xp / 100)) + 1;
  this.level = newLevel;

  if (newLevel >= 15) this.title = 'Grandmaster Escapist';
  else if (newLevel >= 10) this.title = 'Cyber Illusionist';
  else if (newLevel >= 7) this.title = 'Master Cryptographer';
  else if (newLevel >= 4) this.title = 'Elite Infiltrator';
  else if (newLevel >= 2) this.title = 'Adept Sleuth';
  else this.title = 'Novice Escapist';
};

const User = mongoose.model('User', userSchema);
export default User;
