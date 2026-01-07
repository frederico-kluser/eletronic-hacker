import React from 'react';
import { Power, Activity, Map, Cpu } from 'lucide-react';
import RealityBackdrop from './platform-threejs/renderers/RealityBackdrop';
import SmartGlassesCanvas from './platform-threejs/scenes/SmartGlassesCanvas';
import { HudMode } from './core/domain/components/HudModeComponent';
import { useGameSimulation } from './platform-threejs/adapters/useGameSimulation';

export default function App() {
  const { snapshot, togglePower, setMode } = useGameSimulation();
  const { mode, isPowered, diagnostics } = snapshot;

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col items-center justify-center bg-black">
      <RealityBackdrop />

      {/* Main experience rendered via Three.js */}
      <div className="absolute inset-0 z-10">
        <SmartGlassesCanvas mode={mode} isPowered={isPowered} diagnostics={diagnostics} />
      </div>

      {/* External Controls - Fixed at bottom */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
        <div className="p-4 bg-black/80 backdrop-blur-md border border-gray-800 rounded-2xl shadow-2xl flex items-center gap-6 pointer-events-auto">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-mono uppercase tracking-widest mb-1">Device Control</span>
            <div className="flex gap-4">
               <button 
                onClick={togglePower}
                className={`p-4 rounded-full transition-all duration-300 ${isPowered ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'bg-red-900/20 text-red-500'}`}
              >
                <Power size={24} />
              </button>
            </div>
          </div>

          <div className="w-px h-12 bg-gray-700 mx-2" />

          <div className="flex flex-col">
             <span className="text-xs text-gray-400 font-mono uppercase tracking-widest mb-1">HUD Mode</span>
             <div className="flex gap-3">
                <ControlButton 
                  icon={<Cpu size={20} />} 
                  label="SYS" 
                  isActive={mode === HudMode.System} 
                  onClick={() => setMode(HudMode.System)} 
                  disabled={!isPowered}
                />
                <ControlButton 
                  icon={<Map size={20} />} 
                  label="NAV" 
                  isActive={mode === HudMode.Navigation} 
                  onClick={() => setMode(HudMode.Navigation)} 
                  disabled={!isPowered}
                />
                <ControlButton 
                  icon={<Activity size={20} />} 
                  label="SCAN" 
                  isActive={mode === HudMode.Analysis} 
                  onClick={() => setMode(HudMode.Analysis)} 
                  disabled={!isPowered}
                />
             </div>
          </div>
        </div>
      </div>

      {/* Vignette sits between backdrop and controls */}
      <div className="absolute inset-0 z-20 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.8)_100%)]" />
    </div>
  );
}

interface ControlButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  disabled: boolean;
}

const ControlButton: React.FC<ControlButtonProps> = ({ icon, label, isActive, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm font-bold transition-all duration-200
        ${disabled ? 'opacity-30 cursor-not-allowed grayscale' : 'hover:bg-white/5 cursor-pointer'}
        ${isActive && !disabled 
          ? 'bg-cyan-900/40 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.2)]' 
          : 'bg-gray-900/50 text-gray-400 border border-gray-700/50'}
      `}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};
