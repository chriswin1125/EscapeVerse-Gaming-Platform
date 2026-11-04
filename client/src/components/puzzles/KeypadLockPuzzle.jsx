import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Delete, CornerDownLeft, ShieldAlert } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

const KeypadLockPuzzle = ({ puzzle, onSolve, isSolved }) => {
  const { play } = useAudio();
  const [code, setCode] = useState('');
  const codeLength = puzzle.config?.codeLength || 4;

  const handleKeyPress = (num) => {
    if (isSolved || code.length >= codeLength) return;
    play('click');
    setCode((prev) => prev + num);
  };

  const handleClear = () => {
    if (isSolved) return;
    play('click');
    setCode('');
  };

  const handleSubmit = () => {
    if (isSolved || code.length === 0) return;
    onSolve(code);
  };

  return (
    <div className="p-4 bg-slate-900/90 rounded-xl border border-amber-500/30 text-slate-100 max-w-sm mx-auto">
      <div className="flex items-center gap-3 mb-4 border-b border-amber-500/20 pb-3">
        <Lock className="w-6 h-6 text-amber-400" />
        <div>
          <h3 className="font-heading text-lg font-bold text-amber-300">Biometric Access Keypad</h3>
          <p className="text-xs text-slate-400">Punch in the 4-digit security code.</p>
        </div>
      </div>

      {puzzle.config?.clueNote && (
        <div className="mb-4 p-2 bg-amber-950/40 border border-amber-500/30 rounded text-xs text-amber-300 font-mono">
          Intel Note: {puzzle.config.clueNote}
        </div>
      )}

      {/* LCD Screen Display */}
      <div className="bg-black/90 p-4 rounded-lg border-2 border-slate-700 mb-5 text-center shadow-inner relative">
        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1 flex items-center justify-between">
          <span>SECURE TERMINAL</span>
          <span className={code.length === codeLength ? 'text-amber-400 animate-pulse' : 'text-slate-600'}>
            {code.length}/{codeLength} DIGITS
          </span>
        </div>
        <div className="text-3xl font-mono font-bold tracking-[0.5em] text-amber-400 min-h-[44px] flex items-center justify-center">
          {code.padEnd(codeLength, '_')}
        </div>
      </div>

      {/* Numeric Button Grid */}
      <div className="grid grid-cols-3 gap-2.5 mb-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
          <motion.button
            key={digit}
            type="button"
            whileTap={{ scale: 0.94 }}
            onClick={() => handleKeyPress(digit.toString())}
            disabled={isSolved}
            className="py-3 bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-heading font-bold text-lg rounded-lg border border-slate-700 shadow-md transition disabled:opacity-50"
          >
            {digit}
          </motion.button>
        ))}

        <motion.button
          type="button"
          whileTap={{ scale: 0.94 }}
          onClick={handleClear}
          disabled={isSolved || code.length === 0}
          className="py-3 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 font-mono text-sm rounded-lg border border-rose-700/50 flex items-center justify-center transition disabled:opacity-40"
        >
          <Delete className="w-5 h-5" />
        </motion.button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.94 }}
          onClick={() => handleKeyPress('0')}
          disabled={isSolved}
          className="py-3 bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-heading font-bold text-lg rounded-lg border border-slate-700 shadow-md transition disabled:opacity-50"
        >
          0
        </motion.button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.94 }}
          onClick={handleSubmit}
          disabled={isSolved || code.length !== codeLength}
          className="py-3 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 font-mono text-sm rounded-lg border border-emerald-700/50 flex items-center justify-center transition disabled:opacity-40"
        >
          <CornerDownLeft className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Master Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSolved || code.length !== codeLength}
        className={`w-full py-2.5 rounded-lg font-heading text-xs font-semibold tracking-wider transition ${
          isSolved
            ? 'bg-emerald-600/50 text-emerald-200 cursor-not-allowed'
            : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-lg'
        }`}
      >
        {isSolved ? 'CODE ACCEPTED - UNLOCKED' : 'ENGAGE SECURITY UNLOCK'}
      </button>
    </div>
  );
};

export default KeypadLockPuzzle;
