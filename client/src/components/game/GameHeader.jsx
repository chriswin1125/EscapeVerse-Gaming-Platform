import React from 'react';
import { Clock, Volume2, VolumeX, Radio, Trophy, LogOut, HelpCircle, ShieldAlert } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const GameHeader = ({
  roomTitle,
  difficulty,
  timeRemainingSeconds,
  penaltiesAppliedSeconds,
  score,
  currentStage,
  totalStages,
  onLeaveSession,
  onOpenHowToPlay
}) => {
  const { isMuted, toggleMute, ambientEnabled, toggleAmbient } = useAudio();

  const isLowTime = timeRemainingSeconds <= 180;
  const isCriticalTime = timeRemainingSeconds <= 60;

  return (
    <header className="rounded-2xl bg-[#121214] border border-white/10 p-4 mb-5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
      {/* Room Title and Stage */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
          <Clock className="w-5 h-5 text-neutral-300" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-white tracking-tight">{roomTitle}</h1>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-white/10 text-neutral-300">
              {difficulty}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
            <span className="text-[#2189FF] font-semibold">Stage {currentStage} of {totalStages}</span>
            <span>•</span>
            <span>Score: {score} pts</span>
          </div>
        </div>
      </div>

      {/* Center Countdown Clock */}
      <div className="flex items-center gap-3">
        <div
          className={`flex items-center gap-2.5 px-6 py-2 rounded-full border transition-all ${
            isCriticalTime
              ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse'
              : isLowTime
              ? 'bg-amber-950/60 border-amber-500 text-amber-300'
              : 'bg-[#18181b] border-white/15 text-white'
          }`}
        >
          <Clock className="w-4 h-4 text-neutral-400" />
          <div className="text-xl font-mono font-bold tracking-wider">
            {formatTime(timeRemainingSeconds)}
          </div>
        </div>

        {penaltiesAppliedSeconds > 0 && (
          <div className="text-[11px] font-mono text-rose-400 bg-rose-950/50 px-2.5 py-1 rounded-full border border-rose-800 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>-{penaltiesAppliedSeconds}s Penalty</span>
          </div>
        )}
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        {onOpenHowToPlay && (
          <button
            type="button"
            onClick={onOpenHowToPlay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#2189FF]" />
            <span className="hidden sm:inline">How to Play</span>
          </button>
        )}

        <button
          type="button"
          onClick={toggleAmbient}
          className={`p-2 rounded-full border transition text-xs flex items-center gap-1 ${
            ambientEnabled
              ? 'bg-[#2189FF]/20 border-[#2189FF] text-[#2189FF]'
              : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
          }`}
          title="Toggle Ambient Soundtrack"
        >
          <Radio className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={toggleMute}
          className="p-2 bg-white/5 hover:bg-white/10 text-neutral-300 rounded-full border border-white/10 transition"
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-white" />}
        </button>

        <button
          type="button"
          onClick={onLeaveSession}
          className="p-2 bg-white/5 hover:bg-rose-950/50 text-neutral-400 hover:text-rose-400 rounded-full border border-white/10 hover:border-rose-700 transition"
          title="Leave Room"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default GameHeader;
