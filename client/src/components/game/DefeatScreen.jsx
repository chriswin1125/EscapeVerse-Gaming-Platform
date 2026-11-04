import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertOctagon, RotateCcw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAudio } from '../../context/AudioContext';

const DefeatScreen = ({ session, onRetry }) => {
  const { play } = useAudio();

  useEffect(() => {
    play('error');
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg bg-[#121214] border border-rose-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl text-center relative overflow-hidden"
      >
        <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-4">
          <AlertOctagon className="w-8 h-8" />
        </div>

        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Time Ran Out!
        </h1>
        <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
          The countdown timer reached zero before all room puzzles could be unlocked. Don't worry, you can retry anytime!
        </p>

        <div className="p-4 bg-[#18181b] rounded-2xl border border-white/5 my-6 text-xs text-neutral-300 text-left space-y-1.5">
          <div className="font-semibold text-white mb-2">Game Summary:</div>
          <div>• Puzzles Solved: {session?.solvedPuzzles?.length || 0}</div>
          <div>• Clues Discovered: {session?.discoveredClues?.length || 0}</div>
          <div>• Consolation XP Awarded: +50 XP</div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="samsung-btn-secondary w-full sm:w-auto"
          >
            <Home className="w-4 h-4 mr-1.5" />
            <span>Dashboard</span>
          </Link>
          <button
            type="button"
            onClick={onRetry}
            className="samsung-btn-primary w-full sm:w-auto flex items-center justify-center"
          >
            <RotateCcw className="w-4 h-4 mr-1.5" />
            <span>Try Again</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DefeatScreen;
