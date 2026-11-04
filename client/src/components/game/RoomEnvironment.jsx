import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Key,
  Clock,
  BookOpen,
  FlaskConical,
  Cpu,
  Zap,
  Lock,
  Eye,
  Sliders,
  Terminal,
  FileText,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

const ICON_LOOKUP = {
  Search,
  Key,
  Clock,
  BookOpen,
  FlaskConical,
  Cpu,
  Zap,
  Lock,
  Eye,
  Sliders,
  Terminal,
  FileText
};

const THEME_GRADIENTS = {
  'haunted-mansion': 'from-[#0d071a] via-[#120a24] to-[#080410]',
  'secret-laboratory': 'from-[#041410] via-[#071f19] to-[#020d0a]',
  'cyber-prison': 'from-[#040e1f] via-[#061833] to-[#020710]',
  'ancient-temple': 'from-[#170e03] via-[#241605] to-[#0e0802]',
  'bank-heist': 'from-[#160408] via-[#26070e] to-[#0d0205]'
};

const RoomEnvironment = ({
  room,
  currentStageNumber,
  onHotspotClick,
  onOpenPuzzle,
  discoveredClues = [],
  solvedPuzzleIds = []
}) => {
  const { play } = useAudio();
  const currentStage = room?.stages?.find((s) => s.stageNumber === currentStageNumber) || room?.stages?.[0];
  const [inspectedHotspot, setInspectedHotspot] = useState(null);

  const themeBg = THEME_GRADIENTS[room?.theme] || 'from-[#121214] to-black';

  const handleSpotClick = (spot) => {
    play('click');
    setInspectedHotspot(spot);
    onHotspotClick(spot);
  };

  return (
    <div className="relative w-full h-[530px] rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex flex-col justify-between">
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b ${themeBg}`} />

      {/* Subtle modern room grid texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Top HUD: Stage info & Active Puzzle Lock Buttons */}
      <div className="relative z-10 p-4 bg-black/60 backdrop-blur-md border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-white">
              Stage {currentStageNumber} of {room?.totalStages || 3}
            </span>
            <h2 className="text-sm font-bold text-white tracking-tight">
              {currentStage?.name}
            </h2>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">{currentStage?.lore}</p>
        </div>

        {/* Puzzle Lock Buttons */}
        <div className="flex items-center gap-2">
          {currentStage?.puzzles?.map((puz, i) => {
            const isSolved = solvedPuzzleIds.includes(puz._id?.toString());
            return (
              <button
                key={puz._id || i}
                onClick={() => onOpenPuzzle(puz)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition shadow-md ${
                  isSolved
                    ? 'bg-emerald-500 text-black font-bold'
                    : 'bg-white text-black hover:bg-neutral-200'
                }`}
              >
                <Lock className={`w-3.5 h-3.5 ${isSolved ? 'text-black' : 'text-neutral-700'}`} />
                <span>{puz.title}</span>
                {isSolved ? (
                  <span className="text-[10px] ml-1 bg-black text-white px-1.5 py-0.5 rounded-full font-bold">SOLVED</span>
                ) : (
                  <span className="text-[10px] ml-1 bg-neutral-200 text-neutral-800 px-1.5 py-0.5 rounded-full font-bold">CLICK TO SOLVE</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive 2.5D Room Canvas with Hotspots */}
      <div className="relative flex-1 w-full h-full">
        {currentStage?.hotspots?.map((spot) => {
          const isDiscovered = discoveredClues.some((c) => c.id === spot.id);
          const IconComp = ICON_LOOKUP[spot.icon] || Search;

          return (
            <div
              key={spot.id}
              style={{
                position: 'absolute',
                left: `${spot.x}%`,
                top: `${spot.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              className="z-20 group"
            >
              {/* Pulsing ring if undiscovered */}
              {!isDiscovered && (
                <span className="absolute -inset-2 rounded-full bg-[#2189FF]/30 animate-ping pointer-events-none" />
              )}

              {/* Hotspot Target Button */}
              <button
                type="button"
                onClick={() => handleSpotClick(spot)}
                className={`relative w-12 h-12 rounded-full flex items-center justify-center transition shadow-xl ${
                  isDiscovered
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'bg-[#2189FF] text-white hover:scale-110 shadow-[0_0_20px_rgba(33,137,255,0.6)]'
                }`}
                title={spot.name}
              >
                <IconComp className="w-5 h-5" />

                {/* Exclamation badge if not inspected yet */}
                {!isDiscovered && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white text-black text-[10px] font-bold flex items-center justify-center shadow">
                    !
                  </span>
                )}
              </button>

              {/* Hover label */}
              <div className="absolute left-1/2 -bottom-7 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap bg-black/90 px-3 py-1 rounded-full border border-white/15 text-[11px] font-medium text-white shadow-xl z-30">
                {spot.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Room Walkthrough Guide Strip */}
      <div className="relative z-10 px-4 py-3 bg-black/60 backdrop-blur-md border-t border-white/10 flex items-center justify-between text-xs text-neutral-300">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-[#2189FF]" />
          <span>
            <strong>Step 1:</strong> Click the glowing pins on the screen to uncover secret clues. 
            <strong className="ml-2">Step 2:</strong> Click the puzzle buttons at the top to enter solutions.
          </span>
        </div>
      </div>

      {/* Clue Inspection Modal */}
      <AnimatePresence>
        {inspectedHotspot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#121214] border border-white/15 rounded-3xl p-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-[#2189FF]" />
                  <h3 className="text-base font-bold text-white">{inspectedHotspot.name}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setInspectedHotspot(null)}
                  className="text-xs text-neutral-400 hover:text-white px-2.5 py-1 bg-white/5 rounded-full"
                >
                  Close
                </button>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                {inspectedHotspot.description}
              </p>

              {inspectedHotspot.clueRevealed && (
                <div className="p-4 rounded-2xl bg-[#18181b] border border-[#2189FF]/30 text-white mb-5 space-y-1">
                  <div className="text-[11px] font-bold text-[#2189FF] uppercase tracking-wider">
                    [Clue Discovered: {inspectedHotspot.clueRevealed.title}]
                  </div>
                  <div className="text-xs text-neutral-200 leading-relaxed font-mono">
                    {inspectedHotspot.clueRevealed.content}
                  </div>
                </div>
              )}

              {/* If associated puzzle */}
              {inspectedHotspot.associatedPuzzleId ? (
                <button
                  type="button"
                  onClick={() => {
                    const puz = currentStage?.puzzles?.find(
                      (p) => p._id?.toString() === inspectedHotspot.associatedPuzzleId?.toString()
                    );
                    setInspectedHotspot(null);
                    if (puz) onOpenPuzzle(puz);
                  }}
                  className="samsung-btn-primary w-full"
                >
                  <span>Open Connected Puzzle Lock</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setInspectedHotspot(null)}
                  className="samsung-btn-secondary w-full"
                >
                  Got It
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoomEnvironment;
