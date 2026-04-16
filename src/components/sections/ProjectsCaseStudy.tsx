'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import { useLocale } from '../../context/LocaleContext';
import { translations } from '../../lib/translations';

gsap.registerPlugin(ScrollTrigger);

export function ProjectsCaseStudy() {
  const { locale } = useLocale();
  const t = translations[locale].projectsCaseStudy;
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        Array.from(contentRef.current!.children),
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 72%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 md:py-28 px-6 z-10 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <div ref={contentRef} className="space-y-12">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-bioluminescence mb-3">
              {t.problem}
            </h3>
            <p className="text-slate-300 text-lg leading-relaxed">
              {t.problemText}
            </p>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-bioluminescence mb-3">
              {t.solution}
            </h3>
            <p className="text-slate-300 text-lg leading-relaxed">
              {t.solutionText}
            </p>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-bioluminescence mb-3">
              {t.tech}
            </h3>
            <ul className="text-slate-300 text-lg space-y-2">
              <li><strong className="text-white/90">{t.techBackend}</strong> {t.techBackendText}</li>
              <li><strong className="text-white/90">{t.techAdmin}</strong> {t.techAdminText}</li>
              <li><strong className="text-white/90">{t.techPayment}</strong> {t.techPaymentText}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
