import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Lock, Trophy, Clock, Users, HelpCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

const STEPS = [
  {
    step: '01',
    icon: Search,
    title: 'Explore & Uncover Clues',
    desc: 'Look at the virtual room screen. Click on any glowing marker or object (such as clocks, books, terminals, or relief stones) to reveal secret notes, formulas, and passwords.'
  },
  {
    step: '02',
    icon: Lock,
    title: 'Crack the Interactive Puzzles',
    desc: 'Click on the active lock buttons at the top of the room. Play the interactive puzzle (enter numbers on the keypad, shift cipher letters, cut wires, or align sliders) using the clues you found.'
  },
  {
    step: '03',
    icon: Users,
    title: 'Work Together as a Team',
    desc: 'Everything is synchronized in real time! When one player uncovers a clue or solves a puzzle, it instantly updates for all teammates. Use the team chat on the right to share ideas.'
  },
  {
    step: '04',
    icon: Trophy,
    title: 'Clear 3 Stages & Escape!',
    desc: 'Each chamber has 3 security stages. Solve all puzzles in each stage to breach the door. Escape before the countdown timer hits 0 to win, earn XP, and rank on the leaderboards!'
  }
];

const HowToPlayModal = ({ isOpen, onClose }) => {
  const { play } = useAudio();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-2xl bg-[#121214] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-white max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#2189FF]/15 border border-[#2189FF]/30 flex items-center justify-center text-[#2189FF]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">How to Play EscapeVerse</h2>
              <p className="text-xs text-neutral-400">Everything you need to know in 4 simple steps.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              play('click');
              onClose();
            }}
            className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Clear Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
          {STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="p-5 rounded-2xl bg-[#18181b] border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-[#2189FF] px-2 py-0.5 rounded-full bg-[#2189FF]/10 border border-[#2189FF]/30">
                      STEP {s.step}
                    </span>
                    <Icon className="w-5 h-5 text-neutral-300" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1.5">{s.title}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pro Tips Box */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 mb-6">
          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Important Tips for Winning:</span>
          </h4>
          <ul className="text-xs text-neutral-300 space-y-1 list-disc list-inside">
            <li><strong className="text-white">Watch out for wrong answers:</strong> Each wrong submission takes 15 seconds off your team timer!</li>
            <li><strong className="text-white">Need a hint?</strong> You can request hints inside any puzzle, but it costs a 30-second penalty.</li>
            <li><strong className="text-white">Invite friends:</strong> Copy your 6-letter room code (e.g. <span className="font-mono text-[#2189FF]">7X9K2P</span>) and send it to friends to play together!</li>
          </ul>
        </div>

        {/* Close Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => {
              play('click');
              onClose();
            }}
            className="samsung-btn-primary w-full sm:w-auto"
          >
            Got It, Let's Play!
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default HowToPlayModal;
