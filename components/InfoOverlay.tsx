import React from 'react';
import { ArrowRight, Zap, Combine, TrendingUp } from 'lucide-react';

export const InfoOverlay: React.FC = () => {
  return (
    <div className="p-6 border-b border-slate-700">
      <h2 className="text-xl font-bold mb-4 text-blue-400 flex items-center gap-2">
        <Zap size={20} />
        Working Principle
      </h2>
      
      <div className="space-y-4 text-sm text-slate-300">
        <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
          <h3 className="font-semibold text-white mb-1 flex items-center gap-2">
             1. Emitter Injection (IE)
          </h3>
          <p>
            Heavily doped Emitter (N) is forward-biased. Electrons overcome the potential barrier and inject into the Base.
          </p>
        </div>

        <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
          <h3 className="font-semibold text-white mb-1 flex items-center gap-2">
             <Combine size={16} className="text-yellow-400"/>
             2. Recombination (IB)
          </h3>
          <p>
            The Base (P) is very thin and lightly doped. A small % of electrons recombine with holes and exit the Base terminal (Base Current).
            <br/>
            <span className="text-yellow-400 text-xs">Shown as yellow particles dropping down.</span>
          </p>
        </div>

        <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
          <h3 className="font-semibold text-white mb-1 flex items-center gap-2">
            <TrendingUp size={16} className="text-green-400"/>
            3. Collection (IC)
          </h3>
          <p>
            Most electrons diffuse across the Base. The strong reverse-bias field at the BC junction sweeps them rapidly into the Collector.
          </p>
        </div>
      </div>
    </div>
  );
};