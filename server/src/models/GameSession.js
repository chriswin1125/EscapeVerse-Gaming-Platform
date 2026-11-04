import mongoose from 'mongoose';

const gameSessionSchema = new mongoose.Schema(
  {
    roomCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    players: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        username: String,
        avatar: String,
        isHost: { type: Boolean, default: false },
        isReady: { type: Boolean, default: false },
        connected: { type: Boolean, default: true },
        socketId: String,
        lastActive: { type: Date, default: Date.now }
      }
    ],
    status: {
      type: String,
      enum: ['lobby', 'in_progress', 'escaped', 'failed', 'abandoned'],
      default: 'lobby'
    },
    currentStage: {
      type: Number,
      default: 1
    },
    timeLimitSeconds: {
      type: Number,
      default: 1200 // 20 mins default
    },
    timeRemainingSeconds: {
      type: Number,
      default: 1200
    },
    penaltiesAppliedSeconds: {
      type: Number,
      default: 0
    },
    score: {
      type: Number,
      default: 0
    },
    startedAt: {
      type: Date
    },
    endedAt: {
      type: Date
    },
    discoveredClues: [
      {
        id: String,
        title: String,
        content: String,
        type: { type: String, default: 'note' },
        discoveredBy: String,
        discoveredAt: { type: Date, default: Date.now }
      }
    ],
    solvedPuzzles: [
      {
        puzzleId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Puzzle'
        },
        solvedBy: String,
        solvedAt: { type: Date, default: Date.now },
        attempts: { type: Number, default: 1 },
        pointsAwarded: { type: Number, default: 250 }
      }
    ],
    hintsUsed: [
      {
        puzzleId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Puzzle'
        },
        hintIndex: Number,
        hintText: String,
        penaltySeconds: Number,
        requestedBy: String,
        requestedAt: { type: Date, default: Date.now }
      }
    ],
    chatLog: [
      {
        id: String,
        sender: String,
        avatar: String,
        message: String,
        type: {
          type: String,
          enum: ['chat', 'system', 'clue', 'solve', 'alert', 'stage'],
          default: 'chat'
        },
        timestamp: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true
  }
);

const GameSession = mongoose.model('GameSession', gameSessionSchema);
export default GameSession;
