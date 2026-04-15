'use client';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import { useLocale } from '../../context/LocaleContext';
import { translations } from '../../lib/translations';

gsap.registerPlugin(ScrollTrigger);

export function CaseStudy() {
  const { locale } = useLocale();
  const t = translations[locale].caseStudy;
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Text reveal on scroll
      if (contentRef.current) {
        gsap.fromTo(
          Array.from(contentRef.current.children),
          { x: -30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            stagger: 0.15,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden z-10">
      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
        
        {/* Text Content */}
        <div ref={contentRef} className="space-y-6">
          <div className="inline-block px-4 py-1 rounded-full border border-bioluminescence/30 text-bioluminescence text-xs font-semibold tracking-widest uppercase" style={{ boxShadow: '0 0 15px rgba(0, 255, 157, 0.2)' }}>
            {t.badge}
          </div>
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            {t.title} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-bioluminescence to-emerald-400">
              {t.titleAccent}
            </span>
          </h2>
          
          <p className="text-base md:text-lg text-slate-400 font-light leading-relaxed">
            {t.description}
          </p>

          <ul className="grid grid-cols-2 gap-3 text-sm text-slate-300 pt-2">
            <li className="flex items-center">
              <span className="text-bioluminescence mr-2">✓</span> {t.feature1}
            </li>
            <li className="flex items-center">
              <span className="text-bioluminescence mr-2">✓</span> {t.feature2}
            </li>
            <li className="flex items-center">
              <span className="text-bioluminescence mr-2">✓</span> {t.feature3}
            </li>
            <li className="flex items-center">
              <span className="text-bioluminescence mr-2">✓</span> {t.feature4}
            </li>
          </ul>

          <button className="group mt-6 flex items-center text-white hover:text-bioluminescence transition-colors">
            <span className="font-semibold uppercase tracking-wider text-sm mr-4">{t.cta}</span>
            <div className="w-10 h-10 rounded-full border border-white/20 group-hover:border-bioluminescence flex items-center justify-center transition-all group-hover:shadow-[0_0_20px_rgba(0,255,157,0.4)]">
              &rarr;
            </div>
          </button>
        </div>

        {/* Visual Mockup Area */}
        <div className="relative h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden glass-panel group">
          <div 
            className="absolute inset-0"
            style={{ 
              background: 'linear-gradient(135deg, rgba(0,255,157,0.08) 0%, rgba(2,18,11,0.9) 50%, rgba(10,10,10,1) 100%)',
            }}
          />
          {/* Faux UI Overlay simulating backend panel */}
          <div className="absolute inset-x-6 bottom-6 top-24 glass-panel border-t border-white/20 rounded-xl flex p-4 md:p-6 transition-transform duration-500 transform translate-y-4 group-hover:translate-y-0" style={{ backgroundColor: 'rgba(10,10,10,0.8)' }}>
            <div className="w-1/3 space-y-3 pr-4 border-r border-white/10">
              <div className="h-3 w-full bg-white/10 rounded" />
              <div className="h-3 w-3/4 bg-white/10 rounded" />
              <div className="h-3 w-5/6 bg-white/10 rounded" />
              <div className="h-3 w-2/3 bg-white/10 rounded" />
              <div className="h-3 w-4/5 bg-bioluminescence/20 rounded" />
            </div>
            <div className="w-2/3 pl-4 space-y-3">
              <div className="h-24 w-full rounded border border-bioluminescence/20" style={{ background: 'rgba(0,255,157,0.05)' }} />
              <div className="h-12 w-full bg-white/5 rounded" />
              <div className="h-8 w-1/2 bg-white/5 rounded" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
