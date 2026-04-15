'use client';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import { useLocale } from '../../context/LocaleContext';
import { translations } from '../../lib/translations';

gsap.registerPlugin(ScrollTrigger);

export function ServicesEcosystem() {
  const { locale } = useLocale();
  const t = translations[locale].services;
  const tiers = [
    { title: t.tier1Title, price: t.tier1Price, description: t.tier1Desc, features: t.tier1Features },
    { title: t.tier2Title, price: t.tier2Price, description: t.tier2Desc, features: t.tier2Features, featured: true },
    { title: t.tier3Title, price: t.tier3Price, description: t.tier3Desc, features: t.tier3Features },
  ];
  const containerRef = useRef<HTMLElement>(null);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      nodesRef.current.forEach((node) => {
        if (!node) return;
        
        gsap.fromTo(node, 
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: node,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="services" ref={containerRef} className="relative py-24 md:py-40 z-10 overflow-hidden">
      {/* Background glow for services */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-bioluminescence/5 rounded-full blur-[120px] pointer-events-none -translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20 md:mb-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                {t.heading.split(' ').slice(0, -1).join(' ')} <span className="text-bioluminescence">{t.heading.split(' ').pop()}</span>
              </h2>
              <p className="text-slate-400 text-lg md:text-xl font-light leading-relaxed">
                {t.subheading}
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-px bg-gradient-to-r from-bioluminescence to-transparent mb-4" />
              <p className="text-xs font-mono text-bioluminescence uppercase tracking-widest">Precision Engineering</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 relative">
          {tiers.map((tier, index) => (
            <div 
              key={tier.title}
              ref={el => { nodesRef.current[index] = el; }}
              className={`
                glass-panel p-10 rounded-[2.5rem] transition-all duration-700 relative
                ${index === 1 ? 'md:-translate-y-12 bg-white/[0.07] rotate-1' : index === 2 ? 'md:translate-y-12 -rotate-1' : 'rotate-[-0.5deg]'}
                hover:shadow-[0_0_60px_rgba(57,255,20,0.15)] hover:border-bioluminescence/30 hover:rotate-0 group
              `}
              style={{ 
                boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.6)',
                borderWidth: '1px',
                clipPath: index === 0 ? 'polygon(0% 0%, 100% 2%, 98% 100%, 2% 98%)' : index === 2 ? 'polygon(2% 0%, 100% 0%, 95% 100%, 0% 95%)' : ''
              }}
            >
              {tier.featured && (
                <div className="absolute -top-4 right-8 bg-bioluminescence text-obsidian text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-tighter shadow-[0_0_25px_rgba(0,255,157,0.4)] z-20">
                  {t.mostPopular}
                </div>
              )}
              
              <div className="mb-8 relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-bioluminescence/20 to-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <div className="w-6 h-6 rounded-full border-2 border-bioluminescence/60 animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-bioluminescence transition-colors">
                  {tier.title}
                </h3>
                <div className="text-xl font-mono text-bioluminescence font-bold mb-4">
                  {tier.price}
                </div>
              </div>

              <p className="text-slate-400 mb-10 text-base font-light leading-relaxed min-h-[4rem]">
                {tier.description}
              </p>
              
              <ul className="space-y-4 mb-8">
                {tier.features.map(feat => (
                  <li key={feat} className="flex items-start text-sm text-slate-300">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-bioluminescence mr-4 shadow-[0_0_10px_rgba(0,255,157,0.8)] flex-shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>

              <div className="pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                 <div className="w-full h-px bg-white/10 mb-6" />
                 <span className="text-bioluminescence text-xs font-mono uppercase tracking-[0.2em] cursor-pointer hover:underline">{t.cta} →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
