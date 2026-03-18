'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function GlobalBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let dpr = 1;
    let lines: any[] = [];

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initLines();
    };

    const initLines = () => {
      lines = [];
      const count = 15;
      for (let i = 0; i < count; i++) {
        lines.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          length: 50 + Math.random() * 200,
          speed: 0.5 + Math.random() * 2,
          vertical: Math.random() > 0.5,
          opacity: 0.1 + Math.random() * 0.3
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      
      ctx.lineWidth = 1;
      lines.forEach(line => {
        ctx.strokeStyle = `rgba(57, 255, 20, ${line.opacity})`;
        ctx.beginPath();
        if (line.vertical) {
          ctx.moveTo(line.x, line.y);
          ctx.lineTo(line.x, line.y + line.length);
          line.y += line.speed;
          if (line.y > window.innerHeight) line.y = -line.length;
        } else {
          ctx.moveTo(line.x, line.y);
          ctx.lineTo(line.x + line.length, line.y);
          line.x += line.speed;
          if (line.x > window.innerWidth) line.x = -line.length;
        }
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-obsidian">
      {/* Blueprint Grid Layer */}
      <div 
        ref={gridRef}
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #39ff14 1px, transparent 1px),
            linear-gradient(to bottom, #39ff14 1px, transparent 1px),
            linear-gradient(to right, #39ff14 1px, transparent 1px),
            linear-gradient(to bottom, #39ff14 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px, 40px 40px, 200px 200px, 200px 200px',
          backgroundPosition: 'center center'
        }}
      />

      {/* Dynamic Data Streams Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full opacity-40 mix-blend-screen"
      />

      {/* Bioluminescent Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-bioluminescence/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-emerald-500/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />

      {/* Floating Inventor Labels & Snippets */}
      <div className="absolute top-24 left-12 text-[10px] font-mono text-bioluminescence/20 uppercase tracking-[0.3em] select-none">
        System_Ref: 0x4f2a99
        <br />
        <span className="text-[8px] opacity-50">v1.4.2 [STABLE]</span>
      </div>

      <div className="absolute bottom-32 right-12 text-[9px] font-mono text-slate-500/20 text-right select-none hidden lg:block">
        <pre><code>{`// Core optimization engaged
await engine.prime();
status: optimal`}</code></pre>
      </div>

      {/* Subtle Scanline Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[size:100%_2px,3px_100%] pointer-events-none opacity-20" />
    </div>
  );
}
