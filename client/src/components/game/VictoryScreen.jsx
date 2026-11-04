import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, Clock, Zap, ArrowRight, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAudio } from '../../context/AudioContext';

const formatSeconds = (sec) => {
  const mins = Math.floor(sec / 60);
  const remainingSecs = sec % 60;
  return `${mins}m ${remainingSecs}s`;
};

const VictoryScreen = ({ session, onPlayAgain }) => {
  const { play } = useAudio();

  useEffect(() => {
    play('victory');
    // Launch fireworks confetti
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const timeTaken = session?.timeLimitSeconds
    ? Math.max(1, session.timeLimitSeconds - (session.timeRemainingSeconds || 0))
    : 300;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-xl bg-[#121214] border border-white/15 rounded-3xl p-8 sm:p-10 shadow-2xl text-center relative overflow-hidden"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Congratulations, You Escaped!
        </h1>
        <p className="text-sm text-neutral-400 mt-2">
          Your team successfully solved all room puzzles and escaped before the timer hit zero.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 my-6">
          <div className="p-4 bg-[#18181b] rounded-2xl border border-white/5">
            <Clock className="w-4 h-4 text-neutral-400 mx-auto mb-1" />
            <div className="text-[10px] text-neutral-400 uppercase font-medium">Time Taken</div>
            <div className="text-base font-bold text-white mt-0.5">
              {formatSeconds(timeTaken)}
            </div>
          </div>

          <div className="p-4 bg-[#18181b] rounded-2xl border border-white/5">
            <Trophy className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <div className="text-[10px] text-neutral-400 uppercase font-medium">Final Score</div>
            <div className="text-base font-bold text-amber-300 mt-0.5">
              {session?.score || 1250} pts
            </div>
          </div>

          <div className="p-4 bg-[#18181b] rounded-2xl border border-white/5">
            <Zap className="w-4 h-4 text-[#2189FF] mx-auto mb-1" />
            <div className="text-[10px] text-neutral-400 uppercase font-medium">XP Earned</div>
            <div className="text-base font-bold text-[#2189FF] mt-0.5">
              +{Math.round((session?.score || 1000) / 2)} XP
            </div>
          </div>
        </div>

        {/* Team Players */}
        {session?.players && (
          <div className="p-4 bg-[#18181b] rounded-2xl border border-white/5 mb-6">
            <div className="text-xs text-neutral-400 mb-2 flex items-center justify-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-neutral-400" />
              <span>Escaped Team:</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {session.players.map((p, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white"
                >
                  {p.username}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="samsung-btn-secondary w-full sm:w-auto"
          >
            Back to Dashboard
          </Link>
          <Link
            to="/leaderboard"
            className="samsung-btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <span>View Leaderboards</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default VictoryScreen;
