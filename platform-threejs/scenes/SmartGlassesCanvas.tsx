import React from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment } from '@react-three/drei';
import { HudMode } from '../../core/domain/components/HudModeComponent';
import { DeviceDiagnosticsSnapshot } from '../../core/data/DeviceSpecifications';
import { SmartGlassesRig } from './SmartGlassesRig';

interface SmartGlassesCanvasProps {
  mode: HudMode;
  isPowered: boolean;
  diagnostics: DeviceDiagnosticsSnapshot;
}

const SmartGlassesCanvas: React.FC<SmartGlassesCanvasProps> = ({ mode, isPowered, diagnostics }) => {
  return (
    <Canvas
      className="absolute inset-0"
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 12], fov: 30, near: 0.1, far: 100 }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 6, 6]} intensity={1.4} castShadow />
      <directionalLight position={[-6, 2, 4]} intensity={0.4} color="#7fd7ff" />

      <SmartGlassesRig mode={mode} isPowered={isPowered} diagnostics={diagnostics} />

      <ContactShadows
        position={[0, -2.4, 0]}
        opacity={0.35}
        scale={10}
        blur={2.5}
        far={8}
      />

      <Environment preset="night" />
    </Canvas>
  );
};

export default SmartGlassesCanvas;
