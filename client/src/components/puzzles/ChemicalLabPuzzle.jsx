import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, RotateCcw, TestTube, Sparkles } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

const ChemicalLabPuzzle = ({ puzzle, onSolve, isSolved }) => {
  const { play } = useAudio();
  const reagents = puzzle.config?.reagents || [
    { id: 'AZ-4', name: 'Cobalt Azide', color: '#3b82f6' },
    { id: 'NT-9', name: 'Nitric Hydride', color: '#10b981' },
    { id: 'VX-2', name: 'Polymer Catalyst', color: '#a855f7' },
    { id: 'SL-7', name: 'Sulfur Reagent', color: '#f59e0b' }
  ];

  const [addedSequence, setAddedSequence] = useState([]);

  const handleAddReagent = (id) => {
    if (isSolved || addedSequence.length >= 4) return;
    play('click');
    setAddedSequence((prev) => [...prev, id]);
  };

  const handleReset = () => {
    if (isSolved) return;
    play('click');
    setAddedSequence([]);
  };

  const handleSubmit = () => {
    if (isSolved || addedSequence.length === 0) return;
    onSolve(addedSequence);
  };

  return (
    <div className="p-4 bg-slate-900/90 rounded-xl border border-emerald-500/30 text-slate-100">
      <div className="flex items-center gap-3 mb-4 border-b border-emerald-500/20 pb-3">
        <FlaskConical className="w-6 h-6 text-emerald-400" />
        <div>
          <h3 className="font-heading text-lg font-bold text-emerald-300">Chemical Titration Centrifuge</h3>
          <p className="text-xs text-slate-400">Dispense the correct reagents into the stabilization chamber.</p>
        </div>
      </div>

      {puzzle.config?.hintClue && (
        <div className="mb-4 p-2 bg-emerald-950/40 border border-emerald-500/30 rounded text-xs text-emerald-300 font-mono">
          Intel Note: {puzzle.config.hintClue}
        </div>
      )}

      {/* Centrifuge Reaction Vessel & Dispenser Rack */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 bg-black/60 p-5 rounded-xl border border-slate-800 items-center">
        {/* Reagents Rack */}
        <div className="space-y-2.5">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Available Reagents:</div>
          <div className="grid grid-cols-2 gap-2">
            {reagents.map((item) => (
              <motion.button
                key={item.id}
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAddReagent(item.id)}
                disabled={isSolved || addedSequence.length >= 4}
                className="p-3 bg-slate-800/80 hover:bg-slate-700/80 rounded-lg border border-slate-700 flex flex-col items-center gap-1.5 transition disabled:opacity-40 text-center"
              >
                <div
                  className="w-5 h-5 rounded-full shadow-lg"
                  style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}99` }}
                />
                <span className="text-xs font-bold text-slate-200">{item.name}</span>
                <span className="text-[10px] font-mono text-slate-400">[{item.id}]</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Reaction Beaker Chamber */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-950/70 rounded-xl border border-slate-800 relative">
          <div className="w-28 h-40 border-b-4 border-x-4 border-slate-600 rounded-b-3xl relative flex flex-col-reverse p-2 bg-black/40 overflow-hidden shadow-inner">
            {/* Fluid fill levels */}
            {addedSequence.map((rId, i) => {
              const reagent = reagents.find((r) => r.id === rId);
              return (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: '25%' }}
                  className="w-full relative rounded-b"
                  style={{
                    backgroundColor: reagent?.color || '#3b82f6',
                    opacity: 0.85
                  }}
                />
              );
            })}
            {addedSequence.length === 0 && (
              <div className="h-full flex items-center justify-center text-[10px] text-slate-600 font-mono text-center">
                CHAMBER EMPTY
              </div>
            )}
          </div>

          <div className="text-xs text-slate-400 font-mono mt-3">
            Dispensed: [{addedSequence.join(' → ') || 'NONE'}]
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between gap-3 mt-4">
        <button
          type="button"
          onClick={handleReset}
          disabled={isSolved || addedSequence.length === 0}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs rounded-lg border border-slate-700 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Drain Vessel</span>
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSolved || addedSequence.length === 0}
          className={`px-5 py-2 rounded-lg font-heading text-xs font-semibold tracking-wider transition ${
            isSolved
              ? 'bg-emerald-600/50 text-emerald-200 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg'
          }`}
        >
          {isSolved ? 'TITRATION STABILIZED' : 'SYNTHESIZE TITRATION'}
        </button>
      </div>
    </div>
  );
};

export default ChemicalLabPuzzle;
