import React, { useRef, useEffect } from 'react';

interface ARLensProps {
  side: 'left' | 'right';
  activeMode: 'system' | 'nav' | 'analysis';
  isPowered: boolean;
}

const ARLens: React.FC<ARLensProps> = ({ side, activeMode, isPowered }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameIdRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high-DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Animation state
    let scanLineY = 0;
    let loadingProgress = 0;
    
    const draw = () => {
      const now = Date.now();
      const elapsed = now - startTimeRef.current;
      
      // Clear
      ctx.clearRect(0, 0, rect.width, rect.height);

      if (!isPowered) {
        // Power off animation could go here (fade out), but we'll just clear
        return;
      }

      // Base HUD Color
      const hudColor = activeMode === 'analysis' ? 'rgba(255, 50, 50, 0.8)' : 'rgba(0, 255, 255, 0.8)';
      const hudDim = activeMode === 'analysis' ? 'rgba(255, 50, 50, 0.2)' : 'rgba(0, 255, 255, 0.2)';

      // 1. Draw Subtle Grid (Perspective Floor)
      ctx.strokeStyle = hudDim;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < rect.width; i += 40) {
        // Perspective effect: lines fan out from center
        const offset = side === 'left' ? 20 : -20; // Stereoscopic shift
        ctx.moveTo(i + offset, rect.height);
        ctx.lineTo(rect.width / 2 + (i - rect.width / 2) * 0.2, rect.height / 2 - 20);
      }
      // Horizontal grid lines
      for (let i = rect.height / 2; i < rect.height; i += 30) {
        ctx.moveTo(0, i);
        ctx.lineTo(rect.width, i);
      }
      ctx.stroke();

      // 2. Center Reticle
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      
      // Animate reticle breathing
      const breathe = Math.sin(elapsed * 0.003) * 5;

      ctx.strokeStyle = hudColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      if (activeMode === 'system') {
        // Circle Reticle
        ctx.arc(cx, cy, 30 + breathe, 0, Math.PI * 2);
        ctx.moveTo(cx - 10, cy); ctx.lineTo(cx - 40 - breathe, cy);
        ctx.moveTo(cx + 10, cy); ctx.lineTo(cx + 40 + breathe, cy);
        ctx.moveTo(cx, cy - 10); ctx.lineTo(cx, cy - 40 - breathe);
        ctx.moveTo(cx, cy + 10); ctx.lineTo(cx, cy + 40 + breathe);
      } else if (activeMode === 'nav') {
        // Nav Arrow
        ctx.moveTo(cx, cy - 20 - breathe);
        ctx.lineTo(cx - 15, cy + 15 + breathe);
        ctx.lineTo(cx, cy + 5 + breathe);
        ctx.lineTo(cx + 15, cy + 15 + breathe);
        ctx.closePath();
      } else if (activeMode === 'analysis') {
        // Box Corners
        const size = 40 + breathe;
        const gap = 10;
        // Top Left
        ctx.moveTo(cx - size, cy - size + gap); ctx.lineTo(cx - size, cy - size); ctx.lineTo(cx - size + gap, cy - size);
        // Top Right
        ctx.moveTo(cx + size - gap, cy - size); ctx.lineTo(cx + size, cy - size); ctx.lineTo(cx + size, cy - size + gap);
        // Bottom Right
        ctx.moveTo(cx + size, cy + size - gap); ctx.lineTo(cx + size, cy + size); ctx.lineTo(cx + size - gap, cy + size);
        // Bottom Left
        ctx.moveTo(cx - size + gap, cy + size); ctx.lineTo(cx - size, cy + size); ctx.lineTo(cx - size, cy + size - gap);
      }
      
      ctx.stroke();

      // 3. Text Data (Different for Left vs Right Eye for realism)
      ctx.fillStyle = hudColor;
      ctx.font = '12px "Share Tech Mono"';
      
      if (side === 'left') {
        // Left Eye: System Stats
        ctx.fillText(`CPU: ${Math.round(40 + Math.random() * 5)}%`, 20, rect.height - 60);
        ctx.fillText(`MEM: 12TB / 64TB`, 20, rect.height - 45);
        ctx.fillText(`NET: 5G connected`, 20, rect.height - 30);
        
        // Mode Label
        ctx.font = 'bold 14px "Share Tech Mono"';
        ctx.fillText(`MODE: ${activeMode.toUpperCase()}`, 20, 40);

      } else {
        // Right Eye: Contextual Info
        const time = new Date();
        ctx.textAlign = 'right';
        ctx.font = '16px "Share Tech Mono"';
        ctx.fillText(time.toLocaleTimeString(), rect.width - 20, 40);
        
        ctx.font = '12px "Share Tech Mono"';
        ctx.fillText(`TEMP: 24°C`, rect.width - 20, rect.height - 60);
        ctx.fillText(`WIND: 12km/h NW`, rect.width - 20, rect.height - 45);
        ctx.fillText(`HUM: 45%`, rect.width - 20, rect.height - 30);
      }

      // Reset Alignment
      ctx.textAlign = 'left';

      // 4. Analysis Scanning Line (if active)
      if (activeMode === 'analysis') {
        scanLineY = (elapsed * 0.2) % rect.height;
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 50, 50, 0.5)';
        ctx.lineWidth = 2;
        ctx.moveTo(0, scanLineY);
        ctx.lineTo(rect.width, scanLineY);
        ctx.stroke();
        
        // Add random "Target Acquired" text
        if (elapsed % 2000 < 1000) {
            ctx.fillStyle = 'rgba(255, 50, 50, 1)';
            ctx.fillText("SEARCHING...", cx + 50, cy - 50);
        }
      }

      // 5. Navigation Path (if active)
      if (activeMode === 'nav') {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(0, 255, 255, 0.4)';
          ctx.lineWidth = 4;
          // Draw a curved path
          ctx.moveTo(cx, rect.height);
          ctx.bezierCurveTo(cx, rect.height * 0.7, cx + 50, rect.height * 0.5, cx + 20, rect.height * 0.3);
          ctx.stroke();
          
          ctx.fillStyle = hudColor;
          ctx.fillText("DEST: 400m", cx + 30, rect.height * 0.4);
      }

      // 6. Boot/Loading Sequence (First 3 seconds)
      if (elapsed < 2000) {
        loadingProgress = Math.min(100, (elapsed / 2000) * 100);
        // Overlay black with opacity fading
        ctx.fillStyle = `rgba(0,0,0, ${1 - elapsed/2000})`;
        ctx.fillRect(0, 0, rect.width, rect.height);
        
        // Loading Bar
        if (elapsed < 1500) {
            ctx.fillStyle = hudColor;
            ctx.fillText(`INITIALIZING OPTICS... ${Math.round(loadingProgress)}%`, cx - 70, cy + 80);
            ctx.strokeStyle = hudColor;
            ctx.strokeRect(cx - 100, cy + 90, 200, 10);
            ctx.fillRect(cx - 98, cy + 92, 196 * (loadingProgress/100), 6);
        }
      }

      frameIdRef.current = requestAnimationFrame(draw);
    };

    frameIdRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameIdRef.current);
    };
  }, [side, activeMode, isPowered]);

  // If powered off, just show black glass
  if (!isPowered) {
    return (
        <div className="w-full h-full bg-black/90 flex items-center justify-center">
            <div className="text-neutral-700 font-mono text-xs">OFFLINE</div>
        </div>
    );
  }

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full block"
      style={{
        // Slight CRT scanline effect via CSS
        backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
        backgroundSize: '100% 2px, 3px 100%',
        boxShadow: 'inset 0 0 40px rgba(0,0,0,0.6)'
      }}
    />
  );
};

export default ARLens;