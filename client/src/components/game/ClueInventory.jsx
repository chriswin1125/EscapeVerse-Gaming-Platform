import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, FileText, Key, FlaskConical, Search, X, Sparkles } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

const TYPE_ICONS = {
  note: FileText,
  cipher_sheet: Sparkles,
  blueprint: Search,
  formula: FlaskConical,
  keycard: Key
};

const ClueInventory = ({ clues = [] }) => {
  const { play } = useAudio();
  const [selectedClue, setSelectedClue] = useState(null);

  const handleOpen = (clue) => {
    play('click');
    setSelectedClue(clue);
  };

  return (
    <div className="samsung-card p-5 flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#2189FF]" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Team Clue Dossier</h3>
        </div>
        <span className="text-[11px] font-semibold bg-white/10 text-white px-2.5 py-0.5 rounded-full">
          {clues.length} Found
        </span>
      </div>

      {clues.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-neutral-400 text-xs">
          <Search className="w-8 h-8 text-neutral-600 mb-2" />
          <p className="font-semibold text-neutral-300">No clues collected yet</p>
          <p className="text-[11px] text-neutral-500 mt-1">
            Click glowing pins on the room screen to uncover secret notes and blueprints.
          </p>
        </div>
      ) : (
        <div className="space-y-2 overflow-y-auto max-h-[280px] pr-1">
          {clues.map((clue, idx) => {
            const IconComp = TYPE_ICONS[clue.type] || FileText;
            return (
              <div
                key={clue.id || idx}
                onClick={() => handleOpen(clue)}
                className="p-3 bg-[#18181b] hover:bg-[#202024] rounded-2xl border border-white/10 hover:border-white/20 cursor-pointer transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-neutral-300">
                    <IconComp className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white group-hover:text-[#2189FF] transition">
                      {clue.title}
                    </h4>
                    <span className="text-[10px] text-neutral-400">Found by {clue.discoveredBy || 'Team'}</span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-[#2189FF]">View</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Clue Details Modal */}
      <AnimatePresence>
        {selectedClue && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#121214] border border-white/15 rounded-3xl p-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#2189FF]" />
                  <h3 className="text-sm font-bold text-white">{selectedClue.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedClue(null)}
                  className="p-1 text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 bg-[#18181b] rounded-2xl border border-white/10 text-xs text-neutral-200 leading-relaxed font-mono my-4">
                {selectedClue.content}
              </div>

              <div className="text-[11px] text-neutral-400 flex items-center justify-between">
                <span>Discovered by {selectedClue.discoveredBy || 'Player'}</span>
                <button
                  type="button"
                  onClick={() => setSelectedClue(null)}
                  className="samsung-btn-primary !py-1 !px-4 !text-xs"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClueInventory;
