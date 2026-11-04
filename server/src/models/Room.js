import mongoose from 'mongoose';

const hotspotSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  x: { type: Number, required: true }, // percentage 0-100
  y: { type: Number, required: true }, // percentage 0-100
  icon: { type: String, default: 'Search' },
  description: { type: String, required: true },
  clueRevealed: {
    title: String,
    content: String,
    type: { type: String, default: 'note' } // note, cipher_sheet, keycard, blueprint, formula
  },
  associatedPuzzleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Puzzle',
    default: null
  }
});

const stageSchema = new mongoose.Schema({
  stageNumber: { type: Number, required: true },
  name: { type: String, required: true },
  lore: { type: String, required: true },
  environmentImage: { type: String, default: '' },
  hotspots: [hotspotSchema],
  puzzles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Puzzle'
    }
  ]
});

const roomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Room title is required'],
      unique: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    theme: {
      type: String,
      required: true,
      enum: [
        'haunted-mansion',
        'secret-laboratory',
        'cyber-prison',
        'ancient-temple',
        'bank-heist'
      ]
    },
    tagline: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    timeLimitMinutes: {
      easy: { type: Number, default: 30 },
      medium: { type: Number, default: 20 },
      hard: { type: Number, default: 15 }
    },
    minPlayers: {
      type: Number,
      default: 1
    },
    maxPlayers: {
      type: Number,
      default: 6
    },
    themeColors: {
      primary: { type: String, default: '#8b5cf6' },
      accent: { type: String, default: '#06b6d4' },
      background: { type: String, default: '#0f172a' }
    },
    audioTheme: {
      type: String,
      default: 'ambient_synth'
    },
    stages: [stageSchema],
    totalStages: {
      type: Number,
      default: 3
    },
    isActive: {
      type: Boolean,
      default: true
    },
    popularity: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Room = mongoose.model('Room', roomSchema);
export default Room;
