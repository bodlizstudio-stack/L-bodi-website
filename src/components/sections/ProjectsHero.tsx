'use client';

import { useLocale } from '../../context/LocaleContext';
import { translations } from '../../lib/translations';

export function ProjectsHero() {
  const { locale } = useLocale();
  const t = translations[locale].projectsHero;

  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 px-6 z-10">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-block px-4 py-1 mb-4 rounded-full border border-bioluminescence/40 text-bioluminescence text-xs font-semibold tracking-widest uppercase bg-bioluminescence/5" style={{ boxShadow: '0 0 20px rgba(57, 255, 20, 0.15)' }}>
          {t.badge}
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
          {t.title} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-bioluminescence to-emerald-400">
            {t.titleAccent}
          </span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
          {t.description}{' '}
          <a href="https://lupsmods.com" target="_blank" rel="noopener noreferrer" className="text-bioluminescence hover:underline">lupsmods.com</a>.
        </p>
      </div>
    </section>
  );
}
