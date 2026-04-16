"use client";

import Link from 'next/link';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useLocale } from '../../context/LocaleContext';
import { translations } from '../../lib/translations';

export function HeroSection() {
  const { locale } = useLocale();
  const t = translations[locale].hero;
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Panel entrance — starts visible, animates FROM a slightly offset position
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      
      tl.fromTo(panelRef.current, 
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.8, delay: 0.3 }
      );

      // Text children stagger
      if (textRef.current) {
        tl.fromTo(
          Array.from(textRef.current.children),
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.15, duration: 1 },
          '-=1.2'
        );
      }
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  const handleCTAEnter = () => {
    window.dispatchEvent(new CustomEvent('vine-pulse', { detail: { intensity: 1.5 } }));
  };

  const handleCTALeave = () => {
    window.dispatchEvent(new CustomEvent('vine-pulse', { detail: { intensity: 1.0 } }));
  };

  return (
    <section 
      id="home"
      ref={containerRef} 
      className="relative min-h-screen flex items-center justify-center px-4 pt-24 pb-16 overflow-hidden"
    >
      {/* 3D Glass Panel with Offset elements */}
      <div 
        ref={panelRef}
        className="glass-panel w-full max-w-5xl rounded-[2.5rem] p-8 md:p-16 flex flex-col items-center justify-center text-center relative z-10 transition-transform duration-700 ease-out border-white/10 backdrop-blur-md bg-obsidian/40"
        style={{ 
          transformStyle: 'preserve-3d',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(0, 255, 157, 0.05)'
        }}
      >
        <div ref={textRef} className="space-y-8 z-20 relative">
          <div className="inline-block px-4 py-1 rounded-full border border-bioluminescence/30 text-bioluminescence text-xs font-mono tracking-[0.2em] uppercase bg-bioluminescence/5 backdrop-blur-sm">
            {t.tagline}
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight text-white leading-[1.1]" style={{ textShadow: '0 0 30px rgba(57, 255, 20, 0.2)' }}>
            {t.title1}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-bioluminescence to-emerald-400">
              {t.title2}
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            {t.subtitle}
          </p>

          <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
            <Link 
              href="/projects"
              onMouseEnter={handleCTAEnter}
              onMouseLeave={handleCTALeave}
              className="group relative inline-flex items-center justify-center px-10 py-5 text-sm font-bold tracking-widest uppercase transition-all duration-500 rounded-full bg-bioluminescence text-obsidian hover:bg-white hover:text-black hover:shadow-[0_0_50px_rgba(0,255,157,0.7)] overflow-hidden"
            >
              {/* Pulse Glow Effect */}
              <span className="absolute inset-0 rounded-full bg-bioluminescence animate-ping opacity-20 group-hover:hidden" />
              <span className="relative z-10">{t.cta}</span>
            </Link>
            
            <Link href="/#services" className="px-10 py-4 text-sm font-bold tracking-widest uppercase rounded-full border border-white/20 text-white hover:bg-white/5 hover:border-white/40 transition-all backdrop-blur-sm">
              {/* @ts-ignore - Ensure secondary CTA falls back gracefully if translation type lacks cta2 */}
              {t.cta2 || 'See Our Services'}
            </Link>
            
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('open-zyra'))}
              className="group relative px-6 py-4 text-sm font-bold tracking-widest uppercase rounded-full border border-bioluminescence/50 text-bioluminescence hover:bg-bioluminescence/10 hover:border-bioluminescence transition-all backdrop-blur-sm flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-bioluminescence animate-pulse" />
              {/* @ts-ignore */}
              {t.cta3 || 'Talk to AI'}
            </button>
          </div>
        </div>
        
        {/* Engineering UI Elements */}
        <div className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-10 w-40 h-40 glass-panel opacity-10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute -bottom-20 -right-10 w-60 h-60 bg-emerald-500/5 rounded-full blur-[100px]" />
          
          {/* Diagnostic UI bits */}
          <div className="absolute top-12 right-12 flex gap-2">
            <div className="w-2 h-2 rounded-full bg-bioluminescence/40" />
            <div className="w-2 h-2 rounded-full bg-bioluminescence/20" />
            <div className="w-2 h-2 rounded-full bg-bioluminescence/10" />
          </div>
        </div>
      </div>

      {/* Featured Project Showcase Card (Floating Right) */}
      <Link href="/projects" className="absolute top-1/2 right-4 2xl:right-24 xl:right-12 -translate-y-1/2 hidden lg:flex flex-col glass-panel p-5 rounded-3xl border border-bioluminescence/30 shadow-[0_0_40px_rgba(57,255,20,0.15)] hover:scale-105 hover:border-bioluminescence hover:shadow-[0_0_60px_rgba(57,255,20,0.3)] transition-all duration-500 group z-30 cursor-pointer w-72 bg-obsidian/80 backdrop-blur-xl">
        <div className="flex justify-between items-center text-[10px] font-mono font-bold text-bioluminescence tracking-widest uppercase mb-4">
          <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-bioluminescence animate-pulse" /> {t.featuredLabel}</span>
          <span className="text-white/50 group-hover:text-white transition-colors">↗</span>
        </div>
        
        <div className="relative w-full h-36 rounded-2xl overflow-hidden border border-white/10 group-hover:border-bioluminescence/30 transition-colors bg-[#0a0a0a] flex items-center justify-center isolate">
          {/* Tech Grid Background inside card */}
          <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: 'radial-gradient(circle at center, #39ff14 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
          {/* Subtle Glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-bioluminescence/10 to-transparent" />
          
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="px-3 py-1 bg-obsidian border border-bioluminescence/40 text-bioluminescence text-xs font-mono rounded-md shadow-lg font-bold block whitespace-nowrap overflow-hidden text-ellipsis max-w-[90%] text-center">
              {t.featuredProject}
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-1">
          <div className="text-white font-bold tracking-tight text-sm">Full System Integration</div>
          <p className="text-xs text-slate-400 font-light leading-relaxed">High-performance custom engineering with localized logic engines.</p>
        </div>
      </Link>

      {/* Social Proof / Reviews (Floating Left) */}
      <div className="absolute top-1/2 left-4 2xl:left-24 xl:left-12 -translate-y-1/2 hidden lg:flex flex-col gap-6 z-30 w-72 pointer-events-none perspective-1000">
        {/* Review 1 */}
        <div className="glass-panel p-5 rounded-3xl border border-white/10 shadow-2xl bg-obsidian/70 backdrop-blur-xl transform -rotate-3 hover:rotate-0 transition-all duration-500 pointer-events-auto cursor-default">
          <div className="flex text-yellow-400 text-sm mb-3">{"★★★★★"}</div>
          <p className="text-sm text-slate-200 font-light italic leading-relaxed mb-4">{t.review1Text}</p>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-bioluminescence/20 to-emerald-500/10 border border-white/10 flex items-center justify-center text-xs font-bold text-white tracking-widest shrink-0">JR</div>
             <div className="flex flex-col min-w-0">
              <span className="text-white text-xs font-bold truncate">{t.review1Author}</span>
              <span className="text-bioluminescence text-[9px] uppercase tracking-widest truncate">{t.review1Role}</span>
            </div>
          </div>
        </div>
        
        {/* Review 2 */}
        <div className="glass-panel p-5 rounded-3xl border border-white/10 shadow-2xl bg-obsidian/70 backdrop-blur-xl transform rotate-2 hover:rotate-0 transition-all duration-500 translate-x-6 pointer-events-auto cursor-default">
          <div className="flex text-yellow-400 text-sm mb-3">{"★★★★★"}</div>
          <p className="text-sm text-slate-200 font-light italic leading-relaxed mb-4">{t.review2Text}</p>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500/20 to-bioluminescence/10 border border-white/10 flex items-center justify-center text-xs font-bold text-white tracking-widest shrink-0">VH</div>
             <div className="flex flex-col min-w-0">
              <span className="text-white text-xs font-bold truncate">{t.review2Author}</span>
              <span className="text-bioluminescence text-[9px] uppercase tracking-widest truncate">{t.review2Role}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
