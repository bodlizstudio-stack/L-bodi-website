'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import { ClockConfigurator } from '../configurator/ClockConfigurator';
import { useLocale } from '../../context/LocaleContext';
import { translations } from '../../lib/translations';

gsap.registerPlugin(ScrollTrigger);

const images = [
  '/images/lupsmods/slika1lupsmods.png',
  '/images/lupsmods/slika2lupsmods.png',
];

export function LupsModsCaseStudy() {
  const { locale } = useLocale();
  const t = translations[locale].lupsModsCaseStudy;
  const [activeImage, setActiveImage] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (contentRef.current) {
        gsap.fromTo(
          Array.from(contentRef.current.children),
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % images.length);
  };

  return (
    <section ref={sectionRef} className="relative py-20 px-6 md:py-32 overflow-hidden z-10">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start relative z-10">
        
        {/* Text Content */}
        <div ref={contentRef} className="space-y-8 order-2 lg:order-1">
          <div>
            <div className="inline-block px-4 py-1 mb-4 rounded-full border border-bioluminescence/30 text-bioluminescence text-xs font-semibold tracking-widest uppercase" style={{ boxShadow: '0 0 15px rgba(0, 255, 157, 0.2)' }}>
              {t.badge}
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              {t.title} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-bioluminescence to-emerald-400">
                {t.titleAccent}
              </span>
            </h2>
          </div>

          <div className="space-y-6 text-sm md:text-base text-slate-300 font-light leading-relaxed">
            <div>
              <h3 className="text-white font-semibold text-lg mb-2">{t.overviewTitle}</h3>
              <p>
                {t.overviewText}
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold text-lg mb-2">{t.coreTitle}</h3>
              <ul className="space-y-3">
                <li><strong className="text-bioluminescence font-medium">{t.lifecycle}</strong> {t.lifecycleText}</li>
                <li><strong className="text-bioluminescence font-medium">{t.inventory}</strong> {t.inventoryText}</li>
                <li><strong className="text-bioluminescence font-medium">{t.workflow}</strong> {t.workflowText}</li>
                <li><strong className="text-bioluminescence font-medium">{t.assets}</strong> {t.assetsText}</li>
                <li><strong className="text-bioluminescence font-medium">{t.ux}</strong> {t.uxText}</li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold text-lg mb-2">{t.impactTitle}</h3>
              <p>
                {t.impactText}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Image Slider & Configurator */}
        <div className="flex flex-col gap-8 order-1 lg:order-2 w-full">
          <div className="relative w-full aspect-[16/10] md:aspect-[4/3] lg:aspect-[4/3] xl:aspect-[16/10] rounded-2xl overflow-hidden glass-panel group cursor-pointer border border-white/10 shadow-2xl" onClick={nextImage}>
          <div className="absolute inset-0 flex transition-transform duration-700 ease-[cubic-bezier(0.87,0,0.13,1)]" style={{ transform: `translateX(-${activeImage * 100}%)` }}>
            {images.map((src, idx) => (
              <div key={idx} className="relative w-full h-full flex-shrink-0">
                <Image
                  src={src}
                  alt={`LUPS Mods CMS Screenshot ${idx + 1}`}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={idx === 0}
                />
              </div>
            ))}
          </div>
          
          {/* Navigation Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
            {images.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-300 ${activeImage === idx ? 'w-8 bg-bioluminescence shadow-[0_0_10px_rgba(0,255,157,0.8)]' : 'w-3 bg-white/30'}`}
              />
            ))}
          </div>

          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-xs text-white/80 px-3 py-1.5 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
            {t.sliderHint}
          </div>
        </div>

        {/* Configurator */}
        <div className="relative rounded-2xl p-6 md:p-8 glass-panel-glow overflow-visible mt-2"
          style={{ boxShadow: '0 0 40px rgba(0, 255, 157, 0.08), inset 0 0 60px rgba(0, 255, 157, 0.02)' }}
        >
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-bioluminescence/10 to-transparent opacity-50 pointer-events-none" aria-hidden />
          <div className="absolute top-3 left-3 w-8 h-8 border-l border-t border-bioluminescence/20 rounded-tl-lg pointer-events-none" aria-hidden />
          <div className="absolute top-3 right-3 w-8 h-8 border-r border-t border-bioluminescence/20 rounded-tr-lg pointer-events-none" aria-hidden />
          <div className="absolute bottom-3 left-3 w-8 h-8 border-l border-b border-bioluminescence/20 rounded-bl-lg pointer-events-none" aria-hidden />
          <div className="absolute bottom-3 right-3 w-8 h-8 border-r border-b border-bioluminescence/20 rounded-br-lg pointer-events-none" aria-hidden />
          
          <div className="relative pt-2">
            <h3 className="text-xl font-semibold text-white mb-1">{t.configTitle}</h3>
            <p className="text-slate-400 text-sm mb-6">{t.configSubtitle}</p>
            <ClockConfigurator />
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
