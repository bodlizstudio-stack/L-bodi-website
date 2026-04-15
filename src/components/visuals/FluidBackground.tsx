'use client';
import { useEffect, useRef } from 'react';

export function FluidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();

    // A simple flowing gradient noise simulation
    const draw = () => {
      time += 0.005;
      const w = canvas.width;
      const h = canvas.height;
      
      // Clear with obsidian
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, w, h);
      
      // Draw massive slow flowing radial gradients
      const cx1 = w * 0.5 + Math.sin(time * 0.5) * w * 0.3;
      const cy1 = h * 0.5 + Math.cos(time * 0.3) * h * 0.3;
      
      const cx2 = w * 0.5 + Math.cos(time * 0.4) * w * 0.4;
      const cy2 = h * 0.5 + Math.sin(time * 0.6) * h * 0.4;

      const grd1 = ctx.createRadialGradient(cx1, cy1, 0, cx1, cy1, w * 0.8);
      grd1.addColorStop(0, 'rgba(2, 18, 11, 0.8)'); // forest-green intense
      grd1.addColorStop(1, 'rgba(10, 10, 10, 0)'); // obsidian transparent
      
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = grd1;
      ctx.fillRect(0, 0, w, h);

      const grd2 = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, w * 0.6);
      grd2.addColorStop(0, 'rgba(57, 255, 20, 0.05)'); // subtle bioluminescence
      grd2.addColorStop(1, 'rgba(10, 10, 10, 0)');
      
      ctx.fillStyle = grd2;
      ctx.fillRect(0, 0, w, h);
      
      ctx.globalCompositeOperation = 'source-over';

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
