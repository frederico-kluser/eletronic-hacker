import React, { useEffect, useState, useRef } from 'react';
import { DeviceDiagnosticsSnapshot } from '../../core/data/DeviceSpecifications';
import { HudMode } from '../../core/domain/components/HudModeComponent';
import ARLensCanvas, { LensSide } from './ARLensCanvas';

interface SmartGlassesViewProps {
  mode: HudMode;
  isPowered: boolean;
  diagnostics: DeviceDiagnosticsSnapshot;
}

// Base width of the glasses frame (approximately)
const GLASSES_BASE_WIDTH = 640;

const SmartGlassesView: React.FC<SmartGlassesViewProps> = ({ mode, isPowered, diagnostics }) => {
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateScale = () => {
      const viewportWidth = window.innerWidth;
      // Scale to fill 100% of viewport width
      const newScale = viewportWidth / GLASSES_BASE_WIDTH;
      setScale(newScale);
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
      }}
    >
      {/* Main glasses frame container */}
      <div className="relative flex items-center">
        {/* Left lens assembly */}
        <div className="relative">
          {/* Outer frame - left lens */}
          <div
            className="relative bg-gradient-to-b from-neutral-700/50 via-neutral-800/40 to-neutral-900/40 p-[3px] shadow-[0_4px_15px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)]"
            style={{
              borderRadius: '20% 55% 45% 25% / 30% 30% 40% 35%',
            }}
          >
            {/* Inner frame border */}
            <div
              className="bg-gradient-to-br from-neutral-900/50 via-black/30 to-neutral-950/40 p-[2px]"
              style={{
                borderRadius: '18% 53% 43% 23% / 28% 28% 38% 33%',
              }}
            >
              {/* Lens container */}
              <div
                className="relative w-[300px] h-[200px] overflow-hidden"
                style={{
                  borderRadius: '16% 51% 41% 21% / 26% 26% 36% 31%',
                  backgroundColor: 'transparent',
                }}
              >
                <ARLensCanvas side={LensSide.Left} mode={mode} isPowered={isPowered} diagnostics={diagnostics} />
              </div>
            </div>
          </div>
          {/* Left frame accent detail */}
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-16 bg-gradient-to-b from-neutral-600/50 via-neutral-800/40 to-neutral-600/50 rounded-l-full shadow-md" />
        </div>

        {/* Bridge - nose piece */}
        <div className="relative z-20 -mx-2">
          {/* Top bridge bar */}
          <div className="w-12 h-3 bg-gradient-to-b from-neutral-600/40 via-neutral-700/40 to-neutral-800/40 rounded-t-lg shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
          {/* Bridge arch */}
          <div className="relative flex justify-center">
            <div className="w-8 h-6 border-l-[3px] border-r-[3px] border-b-[3px] border-neutral-700/60 rounded-b-[50%] bg-transparent" />
          </div>
          {/* Nose pads hints */}
          <div className="absolute -bottom-2 left-1 w-2 h-3 bg-gradient-to-b from-neutral-500/60 to-neutral-700/50 rounded-full opacity-60" />
          <div className="absolute -bottom-2 right-1 w-2 h-3 bg-gradient-to-b from-neutral-500/60 to-neutral-700/50 rounded-full opacity-60" />
        </div>

        {/* Right lens assembly */}
        <div className="relative">
          {/* Outer frame - right lens */}
          <div
            className="relative bg-gradient-to-b from-neutral-700/50 via-neutral-800/40 to-neutral-900/40 p-[3px] shadow-[0_4px_15px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)]"
            style={{
              borderRadius: '55% 20% 25% 45% / 30% 30% 35% 40%',
            }}
          >
            {/* Inner frame border */}
            <div
              className="bg-gradient-to-br from-neutral-900/50 via-black/30 to-neutral-950/40 p-[2px]"
              style={{
                borderRadius: '53% 18% 23% 43% / 28% 28% 33% 38%',
              }}
            >
              {/* Lens container */}
              <div
                className="relative w-[300px] h-[200px] overflow-hidden"
                style={{
                  borderRadius: '51% 16% 21% 41% / 26% 26% 31% 36%',
                  backgroundColor: 'transparent',
                }}
              >
                <ARLensCanvas side={LensSide.Right} mode={mode} isPowered={isPowered} diagnostics={diagnostics} />
              </div>
            </div>
          </div>
          {/* Right frame accent detail */}
          <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-16 bg-gradient-to-b from-neutral-600/50 via-neutral-800/40 to-neutral-600/50 rounded-r-full shadow-md" />
        </div>
      </div>
    </div>
  );
};

export default SmartGlassesView;
