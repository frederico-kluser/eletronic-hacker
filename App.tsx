import React, { useState } from 'react';
import SmartGlasses from './components/SmartGlasses';
import { Settings, Power, Activity, Map, Cpu } from 'lucide-react';

export default function App() {
  const [activeMode, setActiveMode] = useState<'system' | 'nav' | 'analysis'>('system');
  const [isPowered, setIsPowered] = useState(true);

  // Background simulating "Reality"
  const backgroundStyle = {
    backgroundImage: `url('https://picsum.photos/1920/1080?grayscale')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(2px) brightness(0.6)',
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col items-center justify-center">
      
      {/* Reality Layer (Background) */}
      <div 
        className="absolute inset-0 z-0 transition-opacity duration-1000" 
        style={backgroundStyle} 
      />

      {/* Main Experience Layer */}
      <div className="relative z-10 w-full max-w-6xl flex flex-col items-center gap-8 p-4">
        
        {/* The Glasses Component */}
        <SmartGlasses activeMode={activeMode} isPowered={isPowered} />

        {/* External Controls (User's hand controls/watch/phone interaction) */}
        <div className="mt-12 p-4 bg-black/80 backdrop-blur-md border border-gray-800 rounded-2xl shadow-2xl flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-mono uppercase tracking-widest mb-1">Device Control</span>
            <div className="flex gap-4">
               <button 
                onClick={() => setIsPowered(!isPowered)}
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
                  isActive={activeMode === 'system'} 
                  onClick={() => setActiveMode('system')} 
                  disabled={!isPowered}
                />
                <ControlButton 
                  icon={<Map size={20} />} 
                  label="NAV" 
                  isActive={activeMode === 'nav'} 
                  onClick={() => setActiveMode('nav')} 
                  disabled={!isPowered}
                />
                <ControlButton 
                  icon={<Activity size={20} />} 
                  label="SCAN" 
                  isActive={activeMode === 'analysis'} 
                  onClick={() => setActiveMode('analysis')} 
                  disabled={!isPowered}
                />
             </div>
          </div>
        </div>
      </div>

      {/* Vignette Overlay to focus vision */}
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
