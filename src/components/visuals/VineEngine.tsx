'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface VineSegment {
  startX: number;
  startY: number;
  cpX: number;
  cpY: number;
  endX: number;
  endY: number;
}

function drawPartialBezier(
  ctx: CanvasRenderingContext2D,
  seg: VineSegment,
  progress: number
) {
  const t = Math.max(0, Math.min(1, progress));
  // De Casteljau subdivision for partial curve
  const sx = seg.startX, sy = seg.startY;
  const cx = seg.cpX, cy = seg.cpY;
  const ex = seg.endX, ey = seg.endY;
  
  const midCX = (1 - t) * sx + t * cx;
  const midCY = (1 - t) * sy + t * cy;
  const endPX = (1 - t) * (1 - t) * sx + 2 * (1 - t) * t * cx + t * t * ex;
  const endPY = (1 - t) * (1 - t) * sy + 2 * (1 - t) * t * cy + t * t * ey;
  
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.quadraticCurveTo(midCX, midCY, endPX, endPY);
  ctx.stroke();
}

export function VineEngine() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollProgressRef = useRef(0);
  const pulseRef = useRef(1);

  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let dpr = 1;

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    resize();

    // Track scroll progress
    ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress;
      }
    });

    // Listen for pulse events
    const handlePulse = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.intensity) {
        pulseRef.current = detail.intensity;
        gsap.to(pulseRef, { current: 1, duration: 0.8, ease: 'power2.out' });
      }
    };
    window.addEventListener('vine-pulse', handlePulse);

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const progress = scrollProgressRef.current;
      const pulse = pulseRef.current;
      const mouse = mouseRef.current;
      
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      
      // Vine styling
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowBlur = 20 * pulse;
      ctx.shadowColor = 'rgba(57, 255, 20, 0.6)'; // Neon Green shadow
      
      const scrollY = window.scrollY;
      const docH = document.documentElement.scrollHeight;
      
      // Define more complex "Neural" vines
      const vines: VineSegment[] = [
        { startX: w * 0.05, startY: 0, cpX: w * 0.3, cpY: docH * 0.15, endX: w * 0.1, endY: docH * 0.4 },
        { startX: w * 0.95, startY: -200, cpX: w * 0.7, cpY: docH * 0.2, endX: w * 0.9, endY: docH * 0.5 },
        { startX: w * 0.4, startY: 0, cpX: w * 0.05, cpY: docH * 0.3, endX: w * 0.25, endY: docH * 0.75 },
        { startX: w * 0.8, startY: docH * 0.1, cpX: w * 1.0, cpY: docH * 0.4, endX: w * 0.75, endY: docH * 0.85 },
        { startX: w * 0.15, startY: docH * 0.3, cpX: -w * 0.1, cpY: docH * 0.6, endX: w * 0.35, endY: docH * 1.0 },
        { startX: w * 0.6, startY: docH * 0.5, cpX: w * 0.9, cpY: docH * 0.8, endX: w * 0.5, endY: docH * 1.2 },
      ];

      vines.forEach((vine, index) => {
        const growthSpeed = 1.0 + (index * 0.08);
        const vineProgress = Math.min(1, progress * growthSpeed + 0.15);
        
        // Mouse reactivity - neural displacement
        const dx = mouse.x - (vine.cpX);
        const dy = (mouse.y + scrollY) - (vine.cpY);
        const dist = Math.sqrt(dx*dx + dy*dy);
        const maxDist = 400;
        let ox = 0, oy = 0;
        if (dist < maxDist) {
          const power = (1 - dist/maxDist) * 60 * pulse;
          ox = (dx / dist) * power;
          oy = (dy / dist) * power;
        }

        const screenVine: VineSegment = {
          startX: vine.startX,
          startY: vine.startY - scrollY,
          cpX: vine.cpX + ox,
          cpY: vine.cpY - scrollY + oy,
          endX: vine.endX,
          endY: vine.endY - scrollY,
        };
        
        const alpha = (0.2 + (index % 4) * 0.1) * pulse;
        ctx.strokeStyle = `rgba(57, 255, 20, ${alpha})`; // Glowing Neon Green
        ctx.lineWidth = 1 + (index % 4) * 0.6;
        
        drawPartialBezier(ctx, screenVine, vineProgress);
      });

      // Add "Neural nodes" (glow points at line junctions/ends)
      vines.forEach((vine, index) => {
        const growthSpeed = 1.0 + (index * 0.08);
        const vineProgress = Math.min(1, progress * growthSpeed + 0.15);
        if (vineProgress > 0.9) {
          const x = vine.endX;
          const y = (vine.endY - scrollY);
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(57, 255, 20, ${0.8 * pulse})`;
          ctx.shadowBlur = 15;
          ctx.fill();
        }
      });

      // bioluminescent particles
      const particleCount = 25;
      for (let i = 0; i < particleCount; i++) {
        const time = Date.now() * 0.0008;
        const x = ((Math.sin(time + i * 15) * 0.4 + 0.5) * w + Math.cos(time * 0.5) * 50) % w;
        const y = ((Math.cos(time * 0.7 + i * 8) * 0.4 + 0.5) * h + scrollY * 0.3) % h;
        const size = (Math.sin(time * 2.5 + i) * 0.5 + 0.5) * 2.5 + 0.5;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(57, 255, 20, ${0.3 * pulse})`;
        ctx.shadowBlur = 8;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('vine-pulse', handlePulse);
      cancelAnimationFrame(animationFrameId);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 5 }}
      aria-hidden="true"
    />
  );
}
