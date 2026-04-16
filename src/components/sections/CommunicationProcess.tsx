'use client';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import { useLocale } from '../../context/LocaleContext';
import { translations } from '../../lib/translations';

gsap.registerPlugin(ScrollTrigger);

export function CommunicationProcess() {
  const { locale } = useLocale();
  const t = translations[locale].contact;
  const containerRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

  const steps = [
    { title: t.step1Title, desc: t.step1Desc, icon: '01' },
    { title: t.step2Title, desc: t.step2Desc, icon: '02' },
    { title: t.step3Title, desc: t.step3Desc, icon: '03' },
    { title: t.step4Title, desc: t.step4Desc, icon: '04' },
    { title: t.step5Title, desc: t.step5Desc, icon: '05' },
    { title: t.step6Title, desc: t.step6Desc, icon: '06' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      stepsRef.current.forEach((step, index) => {
        if (!step) return;
        
        gsap.fromTo(step, 
          { x: index % 2 === 0 ? -50 : 50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: step,
              start: 'top 85%',
              toggleActions: 'play none none none'
            },
            delay: index * 0.1
          }
        );
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 md:py-40 relative z-10 overflow-hidden bg-obsidian/30">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-bioluminescence/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="mb-20 md:mb-32 max-w-3xl">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
            {t.introTitle.split(' ').slice(0, -1).join(' ')} <span className="text-bioluminescence">{t.introTitle.split(' ').pop()}</span>.
          </h2>
          <p className="text-slate-400 text-lg md:text-xl font-light leading-relaxed">
            {t.introSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              ref={el => { stepsRef.current[index] = el; }}
              className="glass-panel p-8 rounded-[2rem] border-white/5 hover:border-bioluminescence/30 transition-all duration-500 group"
            >
              <div className="flex items-start justify-between mb-6">
                <span className="text-4xl font-black text-bioluminescence/20 group-hover:text-bioluminescence/40 transition-colors font-mono tracking-tighter">
                  {step.icon}
                </span>
                <div className="w-10 h-10 rounded-full border border-bioluminescence/20 flex items-center justify-center group-hover:bg-bioluminescence/5 transition-all">
                   <div className="w-2 h-2 rounded-full bg-bioluminescence shadow-[0_0_10px_#39FF14]" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-bioluminescence transition-colors">
                {step.title}
              </h3>
              <p className="text-slate-400 font-light leading-relaxed text-sm">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
