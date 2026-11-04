import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { KeyRound, RotateCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

const CipherDecoderPuzzle = ({ puzzle, onSolve, isSolved }) => {
  const { play } = useAudio();
  const [shift, setShift] = useState(0);
  const [inputAnswer, setInputAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const cipherText = puzzle.config?.cipherText || 'UDYHQ';
  const cluePrompt = puzzle.config?.cluePrompt || 'Decrypt the cipher key:';

  // Live Caesar preview helper
  const decodeCaesar = (str, s) => {
    return str
      .toUpperCase()
      .split('')
      .map((char) => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) {
          return String.fromCharCode(((code - 65 - s + 26) % 26) + 65);
        }
        return char;
      })
      .join('');
  };

  const previewDecryption = decodeCaesar(cipherText, shift);

  const handleShiftChange = (delta) => {
    play('click');
    setShift((prev) => (prev + delta + 26) % 26);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputAnswer.trim()) {
      setErrorMsg('Please enter your decrypted solution.');
      return;
    }
    setErrorMsg('');
    onSolve(inputAnswer.trim().toUpperCase());
  };

  return (
    <div className="p-4 bg-slate-900/90 rounded-xl border border-purple-500/30 text-slate-100">
      <div className="flex items-center gap-3 mb-4 border-b border-purple-500/20 pb-3">
        <KeyRound className="w-6 h-6 text-purple-400" />
        <div>
          <h3 className="font-heading text-lg font-bold text-purple-300">Rotary Cipher Decryption Terminal</h3>
          <p className="text-xs text-slate-400">Shift the frequency ring to align the alphabetic transposition.</p>
        </div>
      </div>

      {/* Cipher Display Box */}
      <div className="my-5 p-4 rounded-lg bg-black/60 border border-purple-500/40 text-center relative overflow-hidden">
        <div className="absolute top-2 left-3 text-[10px] text-purple-400/80 font-mono tracking-widest uppercase">
          Encrypted Inscription
        </div>
        <div className="text-3xl font-mono font-bold tracking-[0.4em] text-cyan-400 my-2 select-all">
          {cipherText}
        </div>
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-2">
          <span>Current Shift Offset:</span>
          <span className="font-mono text-purple-300 font-bold bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/40">
            {shift}
          </span>
        </div>
      </div>

      {/* Rotary Shift Dial Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-purple-950/30 rounded-lg border border-purple-500/20 mb-5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleShiftChange(-1)}
            disabled={isSolved}
            className="px-3 py-1.5 bg-slate-800 hover:bg-purple-600 text-white rounded font-mono text-sm border border-slate-700 transition"
          >
            -1 Shift
          </button>
          <button
            type="button"
            onClick={() => handleShiftChange(1)}
            disabled={isSolved}
            className="px-3 py-1.5 bg-slate-800 hover:bg-purple-600 text-white rounded font-mono text-sm border border-slate-700 transition"
          >
            +1 Shift
          </button>
          <button
            type="button"
            onClick={() => setShift(0)}
            disabled={isSolved}
            className="p-1.5 text-slate-400 hover:text-white transition"
            title="Reset Dial"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-400">Dial Preview:</div>
          <div className="font-mono text-lg font-bold text-emerald-400 tracking-wider">
            {previewDecryption}
          </div>
        </div>
      </div>

      {/* Submission Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">{cluePrompt}</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputAnswer}
              onChange={(e) => setInputAnswer(e.target.value.toUpperCase())}
              placeholder="e.g. RAVEN"
              disabled={isSolved}
              maxLength={20}
              className="flex-1 px-4 py-2 bg-black/60 border border-slate-700 rounded-lg text-slate-100 font-mono tracking-widest uppercase focus:outline-none focus:border-cyan-400 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setInputAnswer(previewDecryption)}
              disabled={isSolved}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs rounded-lg border border-cyan-500/30 transition"
            >
              Use Preview
            </button>
          </div>
          {errorMsg && (
            <p className="flex items-center gap-1.5 text-xs text-rose-400 mt-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {errorMsg}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSolved}
          className={`w-full py-2.5 rounded-lg font-heading text-sm font-semibold tracking-wider transition ${
            isSolved
              ? 'bg-emerald-600/50 text-emerald-200 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white shadow-lg shadow-purple-900/40'
          }`}
        >
          {isSolved ? 'DECRYPTED & UNLOCKED' : 'TRANSMIT DECRYPTION OVERRIDE'}
        </button>
      </form>
    </div>
  );
};

export default CipherDecoderPuzzle;
