import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Grid, RotateCcw, Cpu } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

const PatternGridPuzzle = ({ puzzle, onSolve, isSolved }) => {
  const { play } = useAudio();
  const gridSize = puzzle.config?.gridSize || 4;
  const totalCells = gridSize * gridSize;

  const [activeCells, setActiveCells] = useState([]);

  const toggleCell = (idx) => {
    if (isSolved) return;
    play('click');
    setActiveCells((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleClear = () => {
    if (isSolved) return;
    play('click');
    setActiveCells([]);
  };

  const handleSubmit = () => {
    if (isSolved || activeCells.length === 0) return;
    onSolve(activeCells);
  };

  return (
    <div className="p-4 bg-slate-900/90 rounded-xl border border-cyan-500/30 text-slate-100">
      <div className="flex items-center gap-3 mb-4 border-b border-cyan-500/20 pb-3">
        <Cpu className="w-6 h-6 text-cyan-400" />
        <div>
          <h3 className="font-heading text-lg font-bold text-cyan-300">Holographic Neural Pattern Matrix</h3>
          <p className="text-xs text-slate-400">
            Reconstruct the encrypted pathway constellation on the {gridSize}x{gridSize} matrix.
          </p>
        </div>
      </div>

      {puzzle.config?.targetShapeDescription && (
        <div className="mb-4 p-2.5 bg-cyan-950/30 border border-cyan-500/30 rounded text-xs text-cyan-300 font-mono">
          Intel Hint: {puzzle.config.targetShapeDescription}
        </div>
      )}

      {/* Grid Canvas */}
      <div className="flex justify-center my-4">
        <div
          className="grid gap-2.5 p-4 bg-black/70 border-2 border-slate-700 rounded-xl shadow-2xl"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`
          }}
        >
          {Array.from({ length: totalCells }).map((_, idx) => {
            const isActive = activeCells.includes(idx);
            return (
              <motion.button
                key={idx}
                type="button"
                whileTap={{ scale: 0.92 }}
                onClick={() => toggleCell(idx)}
                disabled={isSolved}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg font-mono text-xs font-bold transition-all relative flex flex-col items-center justify-center select-none ${
                  isActive
                    ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.8)] border-2 border-cyan-200'
                    : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-400 border border-slate-700'
                }`}
              >
                <span>{idx}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-black mt-1 animate-ping" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between gap-3 mt-4">
        <button
          type="button"
          onClick={handleClear}
          disabled={isSolved || activeCells.length === 0}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs rounded-lg border border-slate-700 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Nodes</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">{activeCells.length} Nodes Active</span>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSolved || activeCells.length === 0}
            className={`px-5 py-2 rounded-lg font-heading text-xs font-semibold tracking-wider transition ${
              isSolved
                ? 'bg-emerald-600/50 text-emerald-200 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg'
            }`}
          >
            {isSolved ? 'PATTERN SYNCHRONIZED' : 'TRANSMIT PATTERN MATRIX'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatternGridPuzzle;
