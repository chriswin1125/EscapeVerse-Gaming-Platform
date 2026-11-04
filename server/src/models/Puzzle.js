import mongoose from 'mongoose';

const puzzleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Puzzle title is required'],
      trim: true
    },
    type: {
      type: String,
      required: [true, 'Puzzle type is required'],
      enum: [
        'cipher',
        'wire_cut',
        'pattern_grid',
        'keypad',
        'slider',
        'chemical_lab',
        'memory_match',
        'hidden_object'
      ]
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    instructions: {
      type: String,
      required: true
    },
    lore: {
      type: String,
      default: ''
    },
    stageNumber: {
      type: Number,
      default: 1
    },
    rewardPoints: {
      type: Number,
      default: 250
    },
    hintPenaltySeconds: {
      type: Number,
      default: 30
    },
    answerPenaltySeconds: {
      type: Number,
      default: 15
    },
    // Configuration for the specific interactive puzzle component
    config: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    // The solution key or validator definition (handled securely server-side)
    solution: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    hints: [
      {
        text: String,
        revealed: { type: Boolean, default: false }
      }
    ],
    explanation: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const Puzzle = mongoose.model('Puzzle', puzzleSchema);
export default Puzzle;
