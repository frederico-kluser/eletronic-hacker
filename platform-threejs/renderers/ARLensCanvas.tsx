import React, { useEffect, useRef } from 'react';
import { HudMode, hudModeToLabel } from '../../core/domain/components/HudModeComponent';
import {
  DeviceDiagnosticsSnapshot,
  cardinalDirectionToLabel,
  networkConnectionToLabel,
} from '../../core/data/DeviceSpecifications';

export enum LensSide {
  Left = 'left',
  Right = 'right',
}

interface ARLensCanvasProps {
  side: LensSide;
  mode: HudMode;
  isPowered: boolean;
  diagnostics: DeviceDiagnosticsSnapshot;
}

const ARLensCanvas: React.FC<ARLensCanvasProps> = ({ side, mode, isPowered, diagnostics }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameIdRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());
  const diagnosticsRef = useRef<DeviceDiagnosticsSnapshot>(diagnostics);

  useEffect(() => {
    diagnosticsRef.current = diagnostics;
  }, [diagnostics]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return () => undefined;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return () => undefined;
    }

    const devicePixelRatio = window.devicePixelRatio || 1;
    const bounds = canvas.getBoundingClientRect();
    canvas.width = bounds.width * devicePixelRatio;
    canvas.height = bounds.height * devicePixelRatio;
    context.scale(devicePixelRatio, devicePixelRatio);

    let scanLineY = 0;

    const draw = () => {
      const now = Date.now();
      const elapsed = now - startTimeRef.current;
      context.clearRect(0, 0, bounds.width, bounds.height);

      if (!isPowered) {
        return;
      }

      const hudColor = mode === HudMode.Analysis ? 'rgba(255, 50, 50, 0.8)' : 'rgba(0, 255, 255, 0.8)';
      const hudDim = mode === HudMode.Analysis ? 'rgba(255, 50, 50, 0.2)' : 'rgba(0, 255, 255, 0.2)';
      const liveDiagnostics = diagnosticsRef.current;

      context.strokeStyle = hudDim;
      context.lineWidth = 1;
      context.beginPath();

      for (let index = 0; index < bounds.width; index += 40) {
        const offset = side === LensSide.Left ? 20 : -20;
        context.moveTo(index + offset, bounds.height);
        context.lineTo(bounds.width / 2 + (index - bounds.width / 2) * 0.2, bounds.height / 2 - 20);
      }

      for (let y = bounds.height / 2; y < bounds.height; y += 30) {
        context.moveTo(0, y);
        context.lineTo(bounds.width, y);
      }

      context.stroke();

      const centerX = bounds.width / 2;
      const centerY = bounds.height / 2;
      const breathe = Math.sin(elapsed * 0.003) * 5;
      context.strokeStyle = hudColor;
      context.lineWidth = 2;
      context.beginPath();

      if (mode === HudMode.System) {
        context.arc(centerX, centerY, 30 + breathe, 0, Math.PI * 2);
        context.moveTo(centerX - 10, centerY);
        context.lineTo(centerX - 40 - breathe, centerY);
        context.moveTo(centerX + 10, centerY);
        context.lineTo(centerX + 40 + breathe, centerY);
        context.moveTo(centerX, centerY - 10);
        context.lineTo(centerX, centerY - 40 - breathe);
        context.moveTo(centerX, centerY + 10);
        context.lineTo(centerX, centerY + 40 + breathe);
      } else if (mode === HudMode.Navigation) {
        context.moveTo(centerX, centerY - 20 - breathe);
        context.lineTo(centerX - 15, centerY + 15 + breathe);
        context.lineTo(centerX, centerY + 5 + breathe);
        context.lineTo(centerX + 15, centerY + 15 + breathe);
        context.closePath();
      } else if (mode === HudMode.Analysis) {
        const size = 40 + breathe;
        const gap = 10;
        context.moveTo(centerX - size, centerY - size + gap);
        context.lineTo(centerX - size, centerY - size);
        context.lineTo(centerX - size + gap, centerY - size);
        context.moveTo(centerX + size - gap, centerY - size);
        context.lineTo(centerX + size, centerY - size);
        context.lineTo(centerX + size, centerY - size + gap);
        context.moveTo(centerX + size, centerY + size - gap);
        context.lineTo(centerX + size, centerY + size);
        context.lineTo(centerX + size - gap, centerY + size);
        context.moveTo(centerX - size + gap, centerY + size);
        context.lineTo(centerX - size, centerY + size);
        context.lineTo(centerX - size, centerY + size - gap);
      }

      context.stroke();
      context.fillStyle = hudColor;
      context.font = '12px "Share Tech Mono"';

      if (side === LensSide.Left) {
        const memoryLine = `${liveDiagnostics.memoryUsage.toFixed(1)}TB / ${liveDiagnostics.memoryCapacity.toFixed(0)}TB`;
        context.fillText(`CPU: ${Math.round(liveDiagnostics.cpuLoad)}%`, 20, bounds.height - 60);
        context.fillText(`MEM: ${memoryLine}`, 20, bounds.height - 45);
        const networkLabel = networkConnectionToLabel(liveDiagnostics.networkConnection);
        const networkStrength = `${Math.round(liveDiagnostics.networkStrength * 100)}%`;
        context.fillText(`NET: ${networkLabel} ${networkStrength}`, 20, bounds.height - 30);
        context.font = 'bold 14px "Share Tech Mono"';
        context.fillText(`MODE: ${hudModeToLabel(mode).toUpperCase()}`, 20, 40);
      } else {
        const time = new Date();
        context.textAlign = 'right';
        context.font = '16px "Share Tech Mono"';
        context.fillText(time.toLocaleTimeString(), bounds.width - 20, 40);
        context.font = '12px "Share Tech Mono"';
        context.fillText(`TEMP: ${liveDiagnostics.temperatureC.toFixed(1)}°C`, bounds.width - 20, bounds.height - 60);
        const windDirection = cardinalDirectionToLabel(liveDiagnostics.windDirection);
        context.fillText(
          `WIND: ${liveDiagnostics.windSpeedKmh.toFixed(0)}km/h ${windDirection}`,
          bounds.width - 20,
          bounds.height - 45,
        );
        context.fillText(`HUM: ${liveDiagnostics.humidityPercent.toFixed(0)}%`, bounds.width - 20, bounds.height - 30);
      }

      context.textAlign = 'left';

      if (mode === HudMode.Analysis) {
        scanLineY = (elapsed * 0.2) % bounds.height;
        context.beginPath();
        context.strokeStyle = 'rgba(255, 50, 50, 0.5)';
        context.lineWidth = 2;
        context.moveTo(0, scanLineY);
        context.lineTo(bounds.width, scanLineY);
        context.stroke();

        if (elapsed % 2000 < 1000) {
          context.fillStyle = 'rgba(255, 50, 50, 1)';
          context.fillText('SEARCHING...', centerX + 50, centerY - 50);
        }
      }

      if (mode === HudMode.Navigation) {
        context.beginPath();
        context.strokeStyle = 'rgba(0, 255, 255, 0.4)';
        context.lineWidth = 4;
        context.moveTo(centerX, bounds.height);
        context.bezierCurveTo(centerX, bounds.height * 0.7, centerX + 50, bounds.height * 0.5, centerX + 20, bounds.height * 0.3);
        context.stroke();
        context.fillStyle = hudColor;
        context.fillText('DEST: 400m', centerX + 30, bounds.height * 0.4);
      }

      frameIdRef.current = requestAnimationFrame(draw);
    };

    frameIdRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameIdRef.current);
    };
  }, [side, mode, isPowered]);

  if (!isPowered) {
    return (
      <div className="w-full h-full bg-transparent flex items-center justify-center">
        <div className="text-neutral-500 font-mono text-xs">OFFLINE</div>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
      style={{
        backgroundColor: 'transparent',
      }}
    />
  );
};

export default ARLensCanvas;
