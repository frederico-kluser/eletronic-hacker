import React from 'react';
import { Float, RoundedBox } from '@react-three/drei';
import { HudMode } from '../../core/domain/components/HudModeComponent';
import { DeviceDiagnosticsSnapshot } from '../../core/data/DeviceSpecifications';
import { LensHUD } from './LensHUD';

const LENS_SIZE: [number, number] = [2.8, 1.8];

interface SmartGlassesRigProps {
  mode: HudMode;
  isPowered: boolean;
  diagnostics: DeviceDiagnosticsSnapshot;
}

export const SmartGlassesRig: React.FC<SmartGlassesRigProps> = ({ mode, isPowered, diagnostics }) => {
  return (
    <Float
      speed={1.2}
      rotationIntensity={0.25}
      floatIntensity={0.4}
      floatingRange={[0, 0.3]}
    >
      <group rotation={[Math.PI * -0.05, Math.PI * 0.12, 0]} position={[0, 0.4, 0]}>
        <FrameSide direction="left" />
        <FrameSide direction="right" />
        <Bridge />
        <Temple direction="left" />
        <Temple direction="right" />

        <LensHUD
          side="left"
          mode={mode}
          isPowered={isPowered}
          diagnostics={diagnostics}
          position={[-2.05, 0.05, 0.08]}
          lensSize={LENS_SIZE}
        />
        <LensHUD
          side="right"
          mode={mode}
          isPowered={isPowered}
          diagnostics={diagnostics}
          position={[2.05, 0.05, 0.08]}
          lensSize={LENS_SIZE}
        />
      </group>
    </Float>
  );
};

const FrameSide: React.FC<{ direction: 'left' | 'right' }> = ({ direction }) => {
  const sign = direction === 'left' ? -1 : 1;
  const x = sign * 2;

  return (
    <group position={[x, 0, 0]}>
      <RoundedBox args={[3.4, 2.2, 0.2]} radius={0.55} smoothness={6}>
        <meshStandardMaterial color="#0f0f0f" metalness={0.9} roughness={0.35} />
      </RoundedBox>
      <RoundedBox args={[3, 1.8, 0.12]} radius={0.45} smoothness={6}>
        <meshStandardMaterial color="#1b1b1b" metalness={0.7} roughness={0.25} />
      </RoundedBox>
    </group>
  );
};

const Bridge: React.FC = () => {
  return (
    <group position={[0, 0.3, 0]}>
      <RoundedBox args={[0.9, 0.4, 0.18]} radius={0.18} smoothness={4}>
        <meshStandardMaterial color="#151515" metalness={0.8} roughness={0.25} />
      </RoundedBox>
      <RoundedBox position={[0, -0.35, 0]} args={[0.4, 0.7, 0.12]} radius={0.15} smoothness={4}>
        <meshStandardMaterial color="#7b5a2c" metalness={0.3} roughness={0.6} />
      </RoundedBox>
    </group>
  );
};

const Temple: React.FC<{ direction: 'left' | 'right' }> = ({ direction }) => {
  const sign = direction === 'left' ? -1 : 1;
  return (
    <group position={[sign * 3.8, 0.3, -0.1]} rotation={[0, 0, 0.12 * sign]}>
      <RoundedBox args={[1.2, 0.3, 0.18]} radius={0.12} smoothness={4}>
        <meshStandardMaterial color="#0f0f0f" metalness={0.9} roughness={0.35} />
      </RoundedBox>
      <RoundedBox position={[sign * 0.9, -0.05, -0.3]} args={[1.8, 0.25, 0.16]} radius={0.1} smoothness={3}>
        <meshStandardMaterial color="#0c0c0c" metalness={0.8} roughness={0.4} />
      </RoundedBox>
    </group>
  );
};
