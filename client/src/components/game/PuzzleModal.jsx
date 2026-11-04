import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, AlertTriangle, ShieldCheck, Clock, Award, Info } from 'lucide-react';
import CipherDecoderPuzzle from '../puzzles/CipherDecoderPuzzle';
import WireCutPuzzle from '../puzzles/WireCutPuzzle';
import PatternGridPuzzle from '../puzzles/PatternGridPuzzle';
import KeypadLockPuzzle from '../puzzles/KeypadLockPuzzle';
import SliderLockPuzzle from '../puzzles/SliderLockPuzzle';
import ChemicalLabPuzzle from '../puzzles/ChemicalLabPuzzle';
import MemoryMatchPuzzle from '../puzzles/MemoryMatchPuzzle';

const PuzzleModal = ({
  puzzle,
  isOpen,
  onClose,
  onSubmitAnswer,
  onRequestHint,
  isSolved,
  hintsUsed = []
}) => {
  const [showHintConfirm, setShowHintConfirm] = useState(false);
  const [showHelpGuide, setShowHelpGuide] = useState(false);

  if (!isOpen || !puzzle) return null;

  const usedForThis = hintsUsed.filter((h) => h.puzzleId?.toString() === puzzle._id?.toString());

  const handleHintClick = () => {
    setShowHintConfirm(true);
  };

  const confirmHint = () => {
    setShowHintConfirm(false);
    onRequestHint(puzzle._id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-2xl bg-[#121214] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-black/40 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-white/10 text-neutral-300">
              {puzzle.difficulty}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">{puzzle.title}</h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#2189FF] px-2.5 py-1 rounded-full bg-[#2189FF]/10 border border-[#2189FF]/20">
              +{puzzle.rewardPoints || 250} pts
            </span>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Plain English Objective */}
          <div className="p-4 bg-[#18181b] rounded-2xl border border-white/10 space-y-2">
            <div className="text-xs text-neutral-300 leading-relaxed">
              <strong className="text-white">Goal: </strong>
              {puzzle.instructions}
            </div>

            <button
              type="button"
              onClick={() => setShowHelpGuide(!showHelpGuide)}
              className="text-[11px] font-semibold text-[#2189FF] hover:underline flex items-center gap-1 pt-1"
            >
              <Info className="w-3.5 h-3.5" />
              <span>{showHelpGuide ? 'Hide Instructions Helper' : 'Need help understanding this puzzle?'}</span>
            </button>

            {showHelpGuide && (
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs text-neutral-300 space-y-1">
                <p>• <strong>Check your team's dossier:</strong> The answer is hidden in the clues found around the room.</p>
                <p>• <strong>Incorrect penalty:</strong> Wrong submissions deduct {puzzle.answerPenaltySeconds || 15} seconds from the timer.</p>
                <p>• <strong>Hints:</strong> If completely stuck, click the "Request Hint" button below.</p>
              </div>
            )}
          </div>

          {/* Render Puzzle Type Engine */}
          {puzzle.type === 'cipher' && (
            <CipherDecoderPuzzle
              puzzle={puzzle}
              onSolve={(ans) => onSubmitAnswer(puzzle._id, ans)}
              isSolved={isSolved}
            />
          )}

          {puzzle.type === 'wire_cut' && (
            <WireCutPuzzle
              puzzle={puzzle}
              onSolve={(ans) => onSubmitAnswer(puzzle._id, ans)}
              isSolved={isSolved}
            />
          )}

          {puzzle.type === 'pattern_grid' && (
            <PatternGridPuzzle
              puzzle={puzzle}
              onSolve={(ans) => onSubmitAnswer(puzzle._id, ans)}
              isSolved={isSolved}
            />
          )}

          {puzzle.type === 'keypad' && (
            <KeypadLockPuzzle
              puzzle={puzzle}
              onSolve={(ans) => onSubmitAnswer(puzzle._id, ans)}
              isSolved={isSolved}
            />
          )}

          {puzzle.type === 'slider' && (
            <SliderLockPuzzle
              puzzle={puzzle}
              onSolve={(ans) => onSubmitAnswer(puzzle._id, ans)}
              isSolved={isSolved}
            />
          )}

          {puzzle.type === 'chemical_lab' && (
            <ChemicalLabPuzzle
              puzzle={puzzle}
              onSolve={(ans) => onSubmitAnswer(puzzle._id, ans)}
              isSolved={isSolved}
            />
          )}

          {puzzle.type === 'memory_match' && (
            <MemoryMatchPuzzle
              puzzle={puzzle}
              onSolve={(ans) => onSubmitAnswer(puzzle._id, ans)}
              isSolved={isSolved}
            />
          )}

          {/* Revealed Hints */}
          {usedForThis.length > 0 && (
            <div className="space-y-2 p-3 bg-amber-950/20 border border-amber-500/30 rounded-2xl">
              <div className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Unlocked Hints ({usedForThis.length}):</span>
              </div>
              {usedForThis.map((h, i) => (
                <div key={i} className="text-xs text-neutral-300 pl-3 border-l-2 border-amber-400">
                  {h.hintText}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-black/40 border-t border-white/10 flex items-center justify-between">
          <div className="text-xs text-neutral-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            <span>Wrong answer penalty: -{puzzle.answerPenaltySeconds || 15}s</span>
          </div>

          <button
            type="button"
            onClick={handleHintClick}
            disabled={isSolved}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/15 transition disabled:opacity-40"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Need a Hint? (-{puzzle.hintPenaltySeconds || 30}s)</span>
          </button>
        </div>
      </motion.div>

      {/* Hint Confirmation Prompt Modal */}
      {showHintConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-[#18181b] border border-white/15 rounded-3xl p-6 max-w-sm text-center shadow-2xl">
            <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white mb-2">Request a Hint?</h4>
            <p className="text-xs text-neutral-400 mb-5 leading-relaxed">
              Revealing a hint will deduct <span className="text-rose-400 font-bold">{puzzle.hintPenaltySeconds || 30} seconds</span> from your team’s countdown timer.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowHintConfirm(false)}
                className="samsung-btn-secondary !py-2 !px-4 !text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmHint}
                className="samsung-btn-primary !py-2 !px-4 !text-xs"
              >
                Reveal Hint
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PuzzleModal;
