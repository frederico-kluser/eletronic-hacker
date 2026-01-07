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
            className="relative bg-gradient-to-b from-neutral-700 via-neutral-800 to-neutral-900 p-[3px] shadow-[0_4px_15px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)]"
            style={{
              borderRadius: '20% 55% 45% 25% / 30% 30% 40% 35%',
            }}
          >
            {/* Inner frame border */}
            <div
              className="bg-gradient-to-br from-neutral-900 via-black to-neutral-950 p-[2px]"
              style={{
                borderRadius: '18% 53% 43% 23% / 28% 28% 38% 33%',
              }}
            >
              {/* Lens container */}
              <div
                className="relative w-[300px] h-[200px] overflow-hidden"
                style={{
                  borderRadius: '16% 51% 41% 21% / 26% 26% 36% 31%',
                  backgroundColor: 'rgba(0, 0, 0, 0.15)',
                  boxShadow: 'inset 0 0 30px rgba(0,0,0,0.3)',
                }}
              >
                <ARLensCanvas side={LensSide.Left} mode={mode} isPowered={isPowered} diagnostics={diagnostics} />
                {/* Glass reflection effect */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent pointer-events-none z-30"
                  style={{
                    borderRadius: '16% 51% 41% 21% / 26% 26% 36% 31%',
                  }}
                />
                {/* Secondary reflection */}
                <div
                  className="absolute bottom-0 right-0 w-1/2 h-1/3 bg-gradient-to-tl from-white/5 to-transparent pointer-events-none z-30"
                  style={{
                    borderRadius: '0 0 41% 0',
                  }}
                />
              </div>
            </div>
          </div>
          {/* Left frame accent detail */}
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-16 bg-gradient-to-b from-neutral-600 via-neutral-800 to-neutral-600 rounded-l-full shadow-md" />
        </div>

        {/* Bridge - nose piece */}
        <div className="relative z-20 -mx-2">
          {/* Top bridge bar */}
          <div className="w-12 h-3 bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-800 rounded-t-lg shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
          {/* Bridge arch */}
          <div className="relative flex justify-center">
            <div className="w-8 h-6 border-l-[3px] border-r-[3px] border-b-[3px] border-neutral-700 rounded-b-[50%] bg-transparent" />
          </div>
          {/* Nose pads hints */}
          <div className="absolute -bottom-2 left-1 w-2 h-3 bg-gradient-to-b from-neutral-500 to-neutral-700 rounded-full opacity-60" />
          <div className="absolute -bottom-2 right-1 w-2 h-3 bg-gradient-to-b from-neutral-500 to-neutral-700 rounded-full opacity-60" />
        </div>

        {/* Right lens assembly */}
        <div className="relative">
          {/* Outer frame - right lens */}
          <div
            className="relative bg-gradient-to-b from-neutral-700 via-neutral-800 to-neutral-900 p-[3px] shadow-[0_4px_15px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)]"
            style={{
              borderRadius: '55% 20% 25% 45% / 30% 30% 35% 40%',
            }}
          >
            {/* Inner frame border */}
            <div
              className="bg-gradient-to-br from-neutral-900 via-black to-neutral-950 p-[2px]"
              style={{
                borderRadius: '53% 18% 23% 43% / 28% 28% 33% 38%',
              }}
            >
              {/* Lens container */}
              <div
                className="relative w-[300px] h-[200px] overflow-hidden"
                style={{
                  borderRadius: '51% 16% 21% 41% / 26% 26% 31% 36%',
                  backgroundColor: 'rgba(0, 0, 0, 0.15)',
                  boxShadow: 'inset 0 0 30px rgba(0,0,0,0.3)',
                }}
              >
                <ARLensCanvas side={LensSide.Right} mode={mode} isPowered={isPowered} diagnostics={diagnostics} />
                {/* Glass reflection effect */}
                <div
                  className="absolute inset-0 bg-gradient-to-bl from-white/8 via-transparent to-transparent pointer-events-none z-30"
                  style={{
                    borderRadius: '51% 16% 21% 41% / 26% 26% 31% 36%',
                  }}
                />
                {/* Secondary reflection */}
                <div
                  className="absolute bottom-0 left-0 w-1/2 h-1/3 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none z-30"
                  style={{
                    borderRadius: '0 0 0 41%',
                  }}
                />
              </div>
            </div>
          </div>
          {/* Right frame accent detail */}
          <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-16 bg-gradient-to-b from-neutral-600 via-neutral-800 to-neutral-600 rounded-r-full shadow-md" />
        </div>
      </div>
    </div>
  );
};

export default SmartGlassesView;
