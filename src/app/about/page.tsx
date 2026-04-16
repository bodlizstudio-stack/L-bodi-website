'use client';

import { useLocale } from '../../context/LocaleContext';
import { translations } from '../../lib/translations';

export default function AboutPage() {
  const { locale } = useLocale();
  const t = translations[locale].about;

  return (
    <main className="min-h-screen bg-obsidian text-slate-300 pt-32 pb-24 relative overflow-hidden">
      {/* Bioluminescent Background Elements */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-bioluminescence/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="inline-block px-4 py-1 rounded-full border border-bioluminescence/30 text-bioluminescence text-xs font-semibold tracking-widest uppercase bg-bioluminescence/5 mb-8">
          BODLIZ STUDIO
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
          {t.title}
        </h1>
        
        <div className="glass-panel p-8 md:p-12 rounded-[2rem] border-white/5 shadow-2xl space-y-8 relative overflow-hidden">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[url('/slike/grid.svg')] bg-center opacity-[0.03] pointer-events-none" />
          
          <div className="relative z-10">
            <div className="w-16 h-1 bg-gradient-to-r from-bioluminescence to-transparent mb-8" />
            <p className="text-lg md:text-2xl font-light text-slate-300 leading-relaxed">
              {t.subtitle}
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
