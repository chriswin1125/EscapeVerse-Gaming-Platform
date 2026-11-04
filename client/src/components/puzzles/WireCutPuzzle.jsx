import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scissors, AlertTriangle, RotateCcw, Zap } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

const WireCutPuzzle = ({ puzzle, onSolve, isSolved }) => {
  const { play } = useAudio();
  const wires = puzzle.config?.wires || [
    { id: 'yellow', label: 'Ground Loop (Yellow)', color: '#eab308' },
    { id: 'blue', label: 'Data Bus (Blue)', color: '#3b82f6' },
    { id: 'purple', label: 'Logic Gate (Purple)', color: '#a855f7' },
    { id: 'red', label: 'Power Bus (Red)', color: '#ef4444' },
    { id: 'green', label: 'Sensory Bus (Green)', color: '#22c55e' }
  ];

  const [cutWires, setCutWires] = useState([]);

  const handleCutWire = (wireId) => {
    if (isSolved || cutWires.includes(wireId)) return;
    play('click');
    setCutWires((prev) => [...prev, wireId]);
  };

  const handleReset = () => {
    if (isSolved) return;
    play('click');
    setCutWires([]);
  };

  const handleSubmit = () => {
    if (isSolved || cutWires.length === 0) return;
    onSolve(cutWires);
  };

  return (
    <div className="p-4 bg-slate-900/90 rounded-xl border border-rose-500/30 text-slate-100">
      <div className="flex items-center justify-between border-b border-rose-500/20 pb-3 mb-4">
        <div className="flex items-center gap-3">
          <Zap className="w-6 h-6 text-yellow-400 animate-pulse" />
          <div>
            <h3 className="font-heading text-lg font-bold text-rose-300">High-Voltage Circuit Defusal</h3>
            <p className="text-xs text-slate-400">Sever the relay circuits in the exact required bypass sequence.</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-950/60 border border-rose-500/40 rounded text-rose-300 text-xs font-mono">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>ARMED</span>
        </div>
      </div>

      {/* Circuit Box Canvas */}
      <div className="relative bg-black/80 rounded-xl border-2 border-slate-700 p-6 my-4 shadow-inner overflow-hidden">
        {/* Sparking background lines */}
        <div className="absolute inset-0 opacity-10 bg-grid-cyber pointer-events-none" />

        <div className="space-y-4">
          {wires.map((wire, idx) => {
            const isCut = cutWires.includes(wire.id);
            const cutIndex = cutWires.indexOf(wire.id);

            return (
              <div
                key={wire.id}
                onClick={() => handleCutWire(wire.id)}
                className={`group relative flex items-center justify-between p-3 rounded-lg border transition cursor-pointer select-none ${
                  isCut
                    ? 'border-slate-800 bg-black/40 opacity-50'
                    : 'border-slate-700/80 bg-slate-900/60 hover:border-cyan-400 hover:bg-slate-800/80'
                }`}
              >
                {/* Left Terminal Contact */}
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-slate-600 border-2 border-slate-400 shadow" />
                  <span className="font-mono text-xs font-semibold tracking-wider text-slate-300">
                    {wire.label}
                  </span>
                </div>

                {/* The Visual Wire Cable */}
                <div className="flex-1 mx-4 relative h-3 flex items-center">
                  {!isCut ? (
                    <div
                      className="w-full h-2 rounded-full shadow-md transition-all group-hover:scale-y-125"
                      style={{
                        backgroundColor: wire.color,
                        boxShadow: `0 0 10px ${wire.color}88`
                      }}
                    />
                  ) : (
                    <div className="w-full flex items-center justify-between px-2">
                      <div
                        className="w-[45%] h-2 rounded-l-full"
                        style={{ backgroundColor: wire.color }}
                      />
                      <span className="text-[10px] font-mono text-rose-400 px-1 font-bold">SNIPPED</span>
                      <div
                        className="w-[45%] h-2 rounded-r-full"
                        style={{ backgroundColor: wire.color }}
                      />
                    </div>
                  )}
                </div>

                {/* Right Terminal Contact / Action */}
                <div className="flex items-center gap-3">
                  {isCut ? (
                    <span className="w-5 h-5 rounded-full bg-rose-600/80 text-white text-[10px] font-mono flex items-center justify-center font-bold">
                      #{cutIndex + 1}
                    </span>
                  ) : (
                    <Scissors className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition transform group-hover:-rotate-45" />
                  )}
                  <div className="w-4 h-4 rounded-full bg-slate-600 border-2 border-slate-400 shadow" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-between gap-3 mt-4">
        <button
          type="button"
          onClick={handleReset}
          disabled={isSolved || cutWires.length === 0}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs rounded-lg border border-slate-700 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Wires</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Cut Order: [{cutWires.join(' → ') || 'NONE'}]</span>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSolved || cutWires.length === 0}
            className={`px-5 py-2 rounded-lg font-heading text-xs font-semibold tracking-wider transition ${
              isSolved
                ? 'bg-emerald-600/50 text-emerald-200 cursor-not-allowed'
                : 'bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white shadow-lg'
            }`}
          >
            {isSolved ? 'CIRCUIT BYPASS OK' : 'ENGAGE CIRCUIT OVERRIDE'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WireCutPuzzle;
