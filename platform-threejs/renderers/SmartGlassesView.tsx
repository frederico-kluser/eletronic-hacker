import React from 'react';
import { DeviceDiagnosticsSnapshot } from '../../core/data/DeviceSpecifications';
import { HudMode } from '../../core/domain/components/HudModeComponent';
import ARLensCanvas, { LensSide } from './ARLensCanvas';

interface SmartGlassesViewProps {
  mode: HudMode;
  isPowered: boolean;
  diagnostics: DeviceDiagnosticsSnapshot;
}

const SmartGlassesView: React.FC<SmartGlassesViewProps> = ({ mode, isPowered, diagnostics }) => {
  return (
    <div className="relative flex items-start justify-center perspective-[1000px]">
      <div className="relative group">
        <div className="absolute -top-3 left-0 w-full h-8 bg-gradient-to-b from-neutral-800 via-neutral-900 to-black rounded-t-2xl z-20 shadow-[0_2px_5px_rgba(0,0,0,0.8)] border-t border-neutral-700/50" />
        <div className="relative w-[320px] h-[240px] rounded-b-[45%] rounded-t-sm border-b-[3px] border-l-[2px] border-r-[2px] border-amber-600/40 bg-black/10 backdrop-blur-[2px] overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] transform translate-z-0">
          <ARLensCanvas side={LensSide.Left} mode={mode} isPowered={isPowered} diagnostics={diagnostics} />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-30 opacity-40 rounded-b-[45%]" />
        </div>
      </div>

      <div className="relative w-10 h-8 mt-1 z-10 flex flex-col items-center">
        <div className="w-full h-2 bg-neutral-900 absolute top-0" />
        <div className="w-8 h-[2px] bg-amber-600/60 mt-4 rounded-full shadow-sm" />
        <div className="absolute top-6 w-full flex justify-between px-1">
          <div className="w-1 h-3 bg-transparent border-r border-amber-600/40" />
          <div className="w-1 h-3 bg-transparent border-l border-amber-600/40" />
        </div>
      </div>

      <div className="relative group">
        <div className="absolute -top-3 right-0 w-full h-8 bg-gradient-to-b from-neutral-800 via-neutral-900 to-black rounded-t-2xl z-20 shadow-[0_2px_5px_rgba(0,0,0,0.8)] border-t border-neutral-700/50" />
        <div className="relative w-[320px] h-[240px] rounded-b-[45%] rounded-t-sm border-b-[3px] border-l-[2px] border-r-[2px] border-amber-600/40 bg-black/10 backdrop-blur-[2px] overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] transform translate-z-0">
          <ARLensCanvas side={LensSide.Right} mode={mode} isPowered={isPowered} diagnostics={diagnostics} />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-30 opacity-40 rounded-b-[45%]" />
        </div>
      </div>
    </div>
  );
};

export default SmartGlassesView;
