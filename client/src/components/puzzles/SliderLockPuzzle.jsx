import React, { useState } from 'react';
import { Sliders, Gauge, CheckCircle2 } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

const SliderLockPuzzle = ({ puzzle, onSolve, isSolved }) => {
  const { play } = useAudio();
  const sliderConfigs = puzzle.config?.sliders || [
    { id: 1, label: 'Primary Cryo Loop', target: 45, unit: 'PSI' },
    { id: 2, label: 'Heavy Water Chamber', target: 80, unit: 'BAR' },
    { id: 3, label: 'Exhaust Vent Pressure', target: 25, unit: 'kPa' }
  ];

  const [values, setValues] = useState(() => sliderConfigs.map(() => 0));

  const handleChange = (index, val) => {
    if (isSolved) return;
    const newVals = [...values];
    newVals[index] = Number(val);
    setValues(newVals);
    if (newVals[index] % 10 === 0) {
      play('click');
    }
  };

  const handleSubmit = () => {
    if (isSolved) return;
    onSolve(values);
  };

  return (
    <div className="p-4 bg-slate-900/90 rounded-xl border border-blue-500/30 text-slate-100">
      <div className="flex items-center gap-3 mb-4 border-b border-blue-500/20 pb-3">
        <Sliders className="w-6 h-6 text-blue-400" />
        <div>
          <h3 className="font-heading text-lg font-bold text-blue-300">Analog Calibration Console</h3>
          <p className="text-xs text-slate-400">Calibrate the hydraulic and pressure sliders to target values.</p>
        </div>
      </div>

      <div className="space-y-6 my-6 bg-black/60 p-5 rounded-xl border border-slate-800">
        {sliderConfigs.map((slider, idx) => {
          const currentVal = values[idx] || 0;
          const target = slider.target || 50;
          const isNear = Math.abs(currentVal - target) <= 3;

          return (
            <div key={slider.id} className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 font-semibold">{slider.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Target: {target}{slider.unit}</span>
                  <span
                    className={`px-2 py-0.5 rounded font-bold ${
                      isNear ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50' : 'bg-slate-800 text-cyan-300'
                    }`}
                  >
                    {currentVal} {slider.unit}
                  </span>
                </div>
              </div>

              {/* Slider Track */}
              <div className="relative flex items-center">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={currentVal}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  disabled={isSolved}
                  className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 disabled:opacity-50"
                />
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSolved}
        className={`w-full py-2.5 rounded-lg font-heading text-xs font-semibold tracking-wider transition ${
          isSolved
            ? 'bg-emerald-600/50 text-emerald-200 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg'
        }`}
      >
        {isSolved ? 'PRESSURE SYSTEM CALIBRATED' : 'STABILIZE PRESSURE SYSTEM'}
      </button>
    </div>
  );
};

export default SliderLockPuzzle;
