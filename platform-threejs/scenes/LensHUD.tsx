import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { HudMode, hudModeToLabel } from '../../core/domain/components/HudModeComponent';
import {
  DeviceDiagnosticsSnapshot,
  cardinalDirectionToLabel,
  networkConnectionToLabel,
} from '../../core/data/DeviceSpecifications';

const HUD_WIDTH = 640;
const HUD_HEIGHT = 400;

export interface LensHUDProps {
  side: 'left' | 'right';
  mode: HudMode;
  isPowered: boolean;
  diagnostics: DeviceDiagnosticsSnapshot;
  position: [number, number, number];
  hudOffset?: number;
  lensSize: [number, number];
}

export const LensHUD: React.FC<LensHUDProps> = ({
  side,
  mode,
  isPowered,
  diagnostics,
  position,
  hudOffset = 0.01,
  lensSize,
}) => {
  const canvas = useMemo(() => {
    if (typeof document === 'undefined') {
      return null;
    }
    const element = document.createElement('canvas');
    element.width = HUD_WIDTH;
    element.height = HUD_HEIGHT;
    return element;
  }, []);

  const context = useMemo(() => canvas?.getContext('2d'), [canvas]);

  const texture = useMemo(() => {
    if (!canvas) {
      return null;
    }
    const nextTexture = new THREE.CanvasTexture(canvas);
    nextTexture.colorSpace = THREE.SRGBColorSpace;
    nextTexture.anisotropy = 8;
    return nextTexture;
  }, [canvas]);

  const scanLineRef = useRef(0);

  useFrame((state) => {
    if (!context || !canvas || !texture) {
      return;
    }

    renderHud(context, {
      side,
      mode,
      isPowered,
      diagnostics,
      elapsedMs: state.clock.elapsedTime * 1000,
      scanLineStore: scanLineRef,
    });

    texture.needsUpdate = true;
  });

  if (!texture) {
    return null;
  }

  const [width, height] = lensSize;

  return (
    <group position={position}>
      {/* Glass volume */}
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshPhysicalMaterial
          transparent
          transmission={0.9}
          roughness={0.05}
          thickness={0.08}
          color={mode === HudMode.Analysis ? '#2d0a0a' : '#022b2e'}
          opacity={0.55}
          metalness={0.1}
        />
      </mesh>

      {/* HUD overlay */}
      <mesh position={[0, 0, hudOffset]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          map={texture}
          transparent
          toneMapped={false}
          color="#ffffff"
        />
      </mesh>
    </group>
  );
};

interface RenderParams {
  side: 'left' | 'right';
  mode: HudMode;
  isPowered: boolean;
  diagnostics: DeviceDiagnosticsSnapshot;
  elapsedMs: number;
  scanLineStore: React.MutableRefObject<number>;
}

function renderHud(ctx: CanvasRenderingContext2D, params: RenderParams): void {
  const { side, mode, isPowered, diagnostics, elapsedMs, scanLineStore } = params;
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  ctx.clearRect(0, 0, width, height);

  if (!isPowered) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(200, 200, 200, 0.8)';
    ctx.font = '32px "Share Tech Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('OFFLINE', width / 2, height / 2);
    return;
  }

  const baseColor = mode === HudMode.Analysis ? 'rgba(255, 80, 80, 1)' : 'rgba(0, 255, 255, 1)';
  const dimColor = mode === HudMode.Analysis ? 'rgba(255, 80, 80, 0.25)' : 'rgba(0, 255, 255, 0.25)';

  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.strokeStyle = dimColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  const offset = side === 'left' ? 30 : -30;
  for (let x = 0; x < width; x += 40) {
    ctx.moveTo(x + offset, height);
    ctx.lineTo(width / 2 + (x - width / 2) * 0.25, height / 2 - 30);
  }
  for (let y = height / 2; y < height; y += 28) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();
  ctx.restore();

  const centerX = width / 2;
  const centerY = height / 2;
  const breathe = Math.sin(elapsedMs * 0.0025) * 6;

  ctx.strokeStyle = baseColor;
  ctx.lineWidth = 2;
  ctx.beginPath();

  if (mode === HudMode.System) {
    ctx.arc(centerX, centerY, 60 + breathe, 0, Math.PI * 2);
    ctx.moveTo(centerX - 20, centerY);
    ctx.lineTo(centerX - 90 - breathe, centerY);
    ctx.moveTo(centerX + 20, centerY);
    ctx.lineTo(centerX + 90 + breathe, centerY);
    ctx.moveTo(centerX, centerY - 20);
    ctx.lineTo(centerX, centerY - 90 - breathe);
    ctx.moveTo(centerX, centerY + 20);
    ctx.lineTo(centerX, centerY + 90 + breathe);
  } else if (mode === HudMode.Navigation) {
    ctx.moveTo(centerX, centerY - 50 - breathe);
    ctx.lineTo(centerX - 35, centerY + 30 + breathe);
    ctx.lineTo(centerX, centerY + 10 + breathe);
    ctx.lineTo(centerX + 35, centerY + 30 + breathe);
    ctx.closePath();
  } else if (mode === HudMode.Analysis) {
    const size = 80 + breathe;
    const gap = 18;
    ctx.moveTo(centerX - size, centerY - size + gap);
    ctx.lineTo(centerX - size, centerY - size);
    ctx.lineTo(centerX - size + gap, centerY - size);

    ctx.moveTo(centerX + size - gap, centerY - size);
    ctx.lineTo(centerX + size, centerY - size);
    ctx.lineTo(centerX + size, centerY - size + gap);

    ctx.moveTo(centerX + size, centerY + size - gap);
    ctx.lineTo(centerX + size, centerY + size);
    ctx.lineTo(centerX + size - gap, centerY + size);

    ctx.moveTo(centerX - size + gap, centerY + size);
    ctx.lineTo(centerX - size, centerY + size);
    ctx.lineTo(centerX - size, centerY + size - gap);
  }
  ctx.stroke();

  ctx.fillStyle = baseColor;
  ctx.textAlign = 'left';
  ctx.font = '18px "Share Tech Mono", monospace';

  if (side === 'left') {
    ctx.fillText(`CPU: ${Math.round(diagnostics.cpuLoad)}%`, 40, height - 110);
    const memLine = `${diagnostics.memoryUsage.toFixed(1)}TB / ${diagnostics.memoryCapacity.toFixed(0)}TB`;
    ctx.fillText(`MEM: ${memLine}`, 40, height - 80);
    const network = `${networkConnectionToLabel(diagnostics.networkConnection)} ${Math.round(
      diagnostics.networkStrength * 100,
    )}%`;
    ctx.fillText(`NET: ${network}`, 40, height - 50);

    ctx.font = '22px "Share Tech Mono", monospace';
    ctx.fillText(`MODE: ${hudModeToLabel(mode).toUpperCase()}`, 40, 60);
  } else {
    ctx.textAlign = 'right';
    ctx.font = '26px "Share Tech Mono", monospace';
    ctx.fillText(new Date().toLocaleTimeString(), width - 40, 60);

    ctx.font = '18px "Share Tech Mono", monospace';
    ctx.fillText(`TEMP: ${diagnostics.temperatureC.toFixed(1)}°C`, width - 40, height - 110);
    const wind = `${diagnostics.windSpeedKmh.toFixed(0)}km/h ${cardinalDirectionToLabel(diagnostics.windDirection)}`;
    ctx.fillText(`WIND: ${wind}`, width - 40, height - 80);
    ctx.fillText(`HUM: ${diagnostics.humidityPercent.toFixed(0)}%`, width - 40, height - 50);
  }

  if (mode === HudMode.Analysis) {
    scanLineStore.current = (scanLineStore.current + 1.2) % height;
    ctx.strokeStyle = 'rgba(255, 80, 80, 0.65)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, scanLineStore.current);
    ctx.lineTo(width, scanLineStore.current);
    ctx.stroke();

    if (Math.floor(elapsedMs / 800) % 2 === 0) {
      ctx.fillStyle = 'rgba(255, 80, 80, 0.9)';
      ctx.font = '20px "Share Tech Mono", monospace';
      ctx.textAlign = side === 'left' ? 'left' : 'right';
      const x = side === 'left' ? centerX + 90 : centerX + 140;
      ctx.fillText('SEARCHING...', x, centerY - 90);
    }
  }

  if (mode === HudMode.Navigation) {
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(centerX, height);
    ctx.bezierCurveTo(centerX, height * 0.75, centerX + 100, height * 0.6, centerX + 40, height * 0.35);
    ctx.stroke();
    ctx.fillText('DEST: 400m', centerX + 80, height * 0.4);
  }
}
