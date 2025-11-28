import React, { useState } from 'react';
import { TransistorCanvas } from './components/TransistorCanvas';
import { ControlPanel } from './components/ControlPanel';
import { InfoOverlay } from './components/InfoOverlay';
import { SimulationParams } from './types';

const App: React.FC = () => {
  // Initial state representing active region operation
  const [params, setParams] = useState<SimulationParams>({
    vbe: 0.75, // Sufficiently forward biased
    vce: 5.0,  // Reverse biased BC junction (since Vc > Vb)
    electronDensity: 0.8,
  });

  return (
    <div className="w-full h-screen relative flex flex-col md:flex-row bg-slate-900 text-slate-100 overflow-hidden">
      {/* 3D Visualization Area */}
      <div className="flex-1 h-3/5 md:h-full relative order-2 md:order-1">
        <TransistorCanvas params={params} />
        
        {/* Floating Labels Overlay */}
        <div className="absolute top-4 left-4 pointer-events-none">
          <h1 className="text-2xl font-bold bg-black/50 p-2 rounded backdrop-blur-sm border-l-4 border-blue-500">
            NPN Transistor <span className="text-blue-400">Active Region</span>
          </h1>
        </div>
      </div>

      {/* Sidebar Controls & Info */}
      <div className="w-full md:w-96 h-2/5 md:h-full bg-slate-800/90 backdrop-blur-md border-l border-slate-700 shadow-2xl flex flex-col order-1 md:order-2 overflow-y-auto z-10">
        <InfoOverlay />
        <ControlPanel params={params} setParams={setParams} />
      </div>
    </div>
  );
};

export default App;