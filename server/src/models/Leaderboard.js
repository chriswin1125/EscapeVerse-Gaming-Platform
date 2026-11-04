import mongoose from 'mongoose';

const leaderboardSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GameSession'
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true
    },
    roomTitle: {
      type: String,
      required: true
    },
    theme: {
      type: String,
      required: true
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    teamName: {
      type: String,
      default: 'Alpha Squadron'
    },
    players: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        username: String,
        avatar: String
      }
    ],
    timeTakenSeconds: {
      type: Number,
      required: true
    },
    timeRemainingSeconds: {
      type: Number,
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    hintsUsedCount: {
      type: Number,
      default: 0
    },
    escapedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

leaderboardSchema.index({ score: -1, timeTakenSeconds: 1 });
leaderboardSchema.index({ room: 1, difficulty: 1, score: -1 });

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);
export default Leaderboard;
