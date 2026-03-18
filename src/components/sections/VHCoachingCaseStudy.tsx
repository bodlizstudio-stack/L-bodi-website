'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';

import { useLocale } from '../../context/LocaleContext';
import { translations } from '../../lib/translations';

gsap.registerPlugin(ScrollTrigger);

const images = [
  '/images/vh_coaching/slika1.png',
  '/images/vh_coaching/slika2.png',
  '/images/vh_coaching/slika3.png',
];

export function VHCoachingCaseStudy() {
  const { locale } = useLocale();
  const t = translations[locale].vhCoachingCaseStudy;
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
        
        {/* Interactive Image Slider */}
        <div className="relative w-full aspect-[16/10] md:aspect-[4/3] lg:aspect-[4/3] xl:aspect-[16/10] rounded-2xl overflow-hidden glass-panel group cursor-pointer border border-white/10 shadow-2xl" onClick={nextImage}>
          <div className="absolute inset-0 flex transition-transform duration-700 ease-[cubic-bezier(0.87,0,0.13,1)]" style={{ transform: `translateX(-${activeImage * 100}%)` }}>
            {images.map((src, idx) => (
              <div key={idx} className="relative w-full h-full flex-shrink-0">
                <Image
                  src={src}
                  alt={`VH Coaching Screenshot ${idx + 1}`}
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

        {/* Text Content */}
        <div ref={contentRef} className="space-y-8">
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
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg mb-2">{t.goalTitle}</h3>
              <p>
                {t.goalText}
              </p>
            </div>
            
            {/* Live Preview Square */}
            <div className="w-full md:w-64 aspect-square flex-shrink-0 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-bioluminescence to-emerald-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative w-full h-full bg-obsidian rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                <div className="absolute top-0 inset-x-0 h-6 bg-white/5 border-b border-white/5 flex items-center px-3 gap-1.5 z-20">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                  <span className="text-[8px] text-white/30 font-mono ml-1 uppercase tracking-tighter">live_preview.exe</span>
                </div>
                <div className="w-full h-full pt-6">
                  <iframe 
                    src="/vh_coaching/index.html" 
                    className="w-[400%] h-[400%] border-none origin-top-left scale-[0.25] pointer-events-none"
                    title="VH Coaching Preview"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-60 pointer-events-none" />
                <a 
                  href="/vh_coaching/index.html" 
                  target="_blank" 
                  className="absolute inset-0 flex items-center justify-center bg-obsidian/0 group-hover:bg-obsidian/60 transition-all duration-300 z-30"
                >
                  <span className="px-4 py-2 bg-bioluminescence text-obsidian text-[10px] font-bold uppercase tracking-widest rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    {t.visitSite}
                  </span>
                </a>
              </div>
              <p className="mt-3 text-[10px] text-bioluminescence/60 font-mono uppercase tracking-[0.2em] text-center">VH_COACHING_V1.0</p>
            </div>
          </div>

            <div>
              <h3 className="text-white font-semibold text-lg mb-2">{t.builtTitle}</h3>
              <ul className="space-y-3">
                <li><strong className="text-bioluminescence font-medium">{t.frontend}</strong> {t.frontendText}</li>
                <li><strong className="text-bioluminescence font-medium">{t.ui}</strong> {t.uiText}</li>
                <li><strong className="text-bioluminescence font-medium">{t.php}</strong> {t.phpText}</li>
                <li><strong className="text-bioluminescence font-medium">{t.performance}</strong> {t.performanceText}</li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold text-lg mb-2">{t.resultTitle}</h3>
              <p>
                {t.resultText}
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 mt-6">
              <h4 className="text-white text-sm font-semibold mb-3 uppercase tracking-wider text-xs">{t.deliverablesTitle}</h4>
              <div className="flex flex-wrap gap-2">
                {t.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-slate-400 font-mono">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
