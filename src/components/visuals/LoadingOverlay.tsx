'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

interface VinePath {
  startX: number;
  startY: number;
  cp1X: number;
  cp1Y: number;
  cp2X: number;
  cp2Y: number;
  endX: number;
  endY: number;
}

function cubicPoint(
  path: VinePath,
  t: number
): { x: number; y: number } {
  const u = 1 - t;
  const { startX, startY, cp1X, cp1Y, cp2X, cp2Y, endX, endY } = path;
  return {
    x: u ** 3 * startX + 3 * u ** 2 * t * cp1X + 3 * u * t ** 2 * cp2X + t ** 3 * endX,
    y: u ** 3 * startY + 3 * u ** 2 * t * cp1Y + 3 * u * t ** 2 * cp2Y + t ** 3 * endY,
  };
}

const ROUTE_CHANGE_LOADER_MS = 1500;

export function LoadingOverlay({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const progressRef = useRef(0);
  const startTimeRef = useRef(0);
  const rafRef = useRef<number>();
  const hasInitiallyLoadedRef = useRef(false);
  const previousPathnameRef = useRef<string | null>(null);

  const isHome = pathname === '/';
  const vineDuration = isHome ? 1.8 : 1.1;
  const minDisplayTime = isHome ? 2200 : 1500;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Fallback: forcefully finish loading after 3.5 seconds if events fail
    const fallbackTimeout = setTimeout(() => {
      setLoading(false);
    }, 3500);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // ... resize logic ...
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    window.addEventListener('resize', resize);
    resize();

    const w = window.innerWidth;
    const h = window.innerHeight;
    const duration = vineDuration;

    const vinePaths: VinePath[] = [
      { startX: 0, startY: h * 1.1, cp1X: w * 0.2, cp1Y: h * 0.6, cp2X: w * 0.1, cp2Y: h * 0.2, endX: w * 0.4, endY: -20 },
      { startX: w * 0.2, startY: h * 1.05, cp1X: w * 0.5, cp1Y: h * 0.5, cp2X: w * 0.3, cp2Y: h * 0.1, endX: w * 0.6, endY: -30 },
      { startX: w, startY: h * 1.1, cp1X: w * 0.8, cp1Y: h * 0.6, cp2X: w * 0.9, cp2Y: h * 0.2, endX: w * 0.6, endY: -20 },
      { startX: w * 0.8, startY: h * 1.05, cp1X: w * 0.5, cp1Y: h * 0.5, cp2X: w * 0.7, cp2Y: h * 0.1, endX: w * 0.35, endY: -30 },
      { startX: w * 0.5, startY: h * 1.05, cp1X: w * 0.7, cp1Y: h * 0.4, cp2X: w * 0.2, cp2Y: h * 0.3, endX: w * 0.5, endY: -20 },
      { startX: 0, startY: h * 0.9, cp1X: w * 0.15, cp1Y: h * 0.5, cp2X: w * 0.35, cp2Y: h * 0.1, endX: w * 0.2, endY: -15 },
      { startX: w, startY: h * 0.9, cp1X: w * 0.85, cp1Y: h * 0.5, cp2X: w * 0.65, cp2Y: h * 0.1, endX: w * 0.8, endY: -15 },
    ];

    const draw = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = (timestamp - startTimeRef.current) / 1000;
      progressRef.current = Math.min(1, elapsed / duration);
      const p = progressRef.current;
      ctx.clearRect(0, 0, w, h);

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowBlur = 14;
      ctx.shadowColor = 'rgba(57, 255, 20, 0.5)';

      vinePaths.forEach((path, i) => {
        const delay = i * 0.08;
        const vineProgress = Math.max(0, Math.min(1, (p - delay) / (1 - delay * 2)));
        const easeProgress = 1 - (1 - vineProgress) ** 1.4;

        ctx.beginPath();
        const steps = 48;
        const first = cubicPoint(path, 0);
        ctx.moveTo(first.x, first.y);
        for (let k = 1; k <= steps; k++) {
          const t = (k / steps) * easeProgress;
          const pt = cubicPoint(path, t);
          ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = `rgba(57, 255, 20, ${0.4 + 0.3 * easeProgress})`;
        ctx.lineWidth = 2.2 + (i % 2) * 0.8;
        ctx.stroke();
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    const finish = () => {
      setLoading(false);
      clearTimeout(fallbackTimeout);
    };

    const startTime = Date.now();
    const handleLoad = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minDisplayTime - elapsed);
      setTimeout(finish, remaining);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('load', handleLoad);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearTimeout(fallbackTimeout);
    };
  }, [vineDuration, minDisplayTime, mounted]);

  useEffect(() => {
    if (!loading) {
      hasInitiallyLoadedRef.current = true;
      const overlay = overlayRef.current;
      const content = contentRef.current;
      if (overlay && content) {
        gsap.to(overlay, { opacity: 0, duration: 0.65, ease: 'power2.inOut' });
        gsap.to(content, { opacity: 1, duration: 0.5, delay: 0.15, ease: 'power2.out' });
        gsap.delayedCall(0.9, () => {
          overlay.style.pointerEvents = 'none';
        });
      }
    }
  }, [loading]);

  // On route change (e.g. main → /projects): show loader again for a short time
  useEffect(() => {
    const prev = previousPathnameRef.current;
    previousPathnameRef.current = pathname;

    if (prev === null) return; // first paint, skip
    if (prev === pathname) return; // no change
    if (!hasInitiallyLoadedRef.current) return; // initial loader still running

    const overlay = overlayRef.current;
    const content = contentRef.current;
    if (!overlay || !content) return;

    startTimeRef.current = 0; // restart vine animation
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'auto';
    content.style.opacity = '0';
    setLoading(true);

    const t = setTimeout(() => {
      setLoading(false);
    }, ROUTE_CHANGE_LOADER_MS);

    return () => clearTimeout(t);
  }, [pathname]);

  if (!mounted) return <>{children}</>;

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-obsidian"
        aria-hidden={!loading}
        style={{ opacity: 1, visibility: loading ? 'visible' : 'hidden' }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(57,255,20,0.08)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_0%_100%,rgba(57,255,20,0.06)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_100%_100%,rgba(57,255,20,0.06)_0%,transparent_50%)]" />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden
        />
      </div>
      <div
        ref={contentRef}
        className="relative w-full min-h-screen"
        style={{ opacity: loading ? 0 : 1 }}
      >
        {children}
      </div>
    </>
  );
}
