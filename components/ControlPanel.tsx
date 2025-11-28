import React from 'react';
import { SimulationParams } from '../types';

interface ControlPanelProps {
  params: SimulationParams;
  setParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ params, setParams }) => {
  
  const handleVbeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams(prev => ({ ...prev, vbe: parseFloat(e.target.value) }));
  };

  const handleVceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams(prev => ({ ...prev, vce: parseFloat(e.target.value) }));
  };

  // Determine visual state of transistor based on Vbe
  const isActive = params.vbe > 0.6;
  const saturationFactor = Math.min(100, (params.vbe - 0.6) * 200);

  return (
    <div className="p-6 flex-1 bg-slate-900">
      <h2 className="text-xl font-bold mb-6 text-white">Circuit Controls</h2>

      {/* VBE CONTROL */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <label className="font-medium text-blue-300">V_BE (Base-Emitter)</label>
          <span className="font-mono">{params.vbe.toFixed(2)} V</span>
        </div>
        <input
          type="range"
          min="0"
          max="1.2"
          step="0.01"
          value={params.vbe}
          onChange={handleVbeChange}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div className="mt-2 text-xs flex justify-between text-slate-500">
          <span>Cutoff (&lt;0.6V)</span>
          <span>Saturation (&gt;0.8V)</span>
        </div>
        {!isActive && (
          <p className="mt-2 text-red-400 text-xs animate-pulse">
            Transistor in Cutoff. Increase V_BE to start flow.
          </p>
        )}
      </div>

      {/* VCE CONTROL */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <label className="font-medium text-green-300">V_CE (Collector-Emitter)</label>
          <span className="font-mono">{params.vce.toFixed(1)} V</span>
        </div>
        <input
          type="range"
          min="0.5"
          max="10"
          step="0.5"
          value={params.vce}
          onChange={handleVceChange}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
        />
        <p className="mt-2 text-xs text-slate-400">
          Controls the strength of the electric field sweeping electrons into the collector.
        </p>
      </div>

      {/* Status Indicators */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-slate-800 p-3 rounded border border-slate-700 text-center">
          <div className="text-xs text-slate-400 uppercase">Estimated I_C</div>
          <div className={`text-xl font-mono ${isActive ? 'text-green-400' : 'text-slate-600'}`}>
            {isActive ? (Math.exp(params.vbe * 5) * 0.1).toFixed(1) : '0.0'} mA
          </div>
        </div>
        <div className="bg-slate-800 p-3 rounded border border-slate-700 text-center">
          <div className="text-xs text-slate-400 uppercase">Current Gain (β)</div>
          <div className="text-xl font-mono text-blue-400">
            ~100
          </div>
        </div>
      </div>
    </div>
  );
};