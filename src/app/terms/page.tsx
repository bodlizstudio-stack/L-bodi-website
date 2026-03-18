'use client';

import { useLocale } from '../../context/LocaleContext';
import { translations } from '../../lib/translations';

export default function TermsPage() {
  const { locale } = useLocale();
  const t = translations[locale].terms;

  return (
    <main className="min-h-screen bg-obsidian text-slate-300 pt-32 pb-24 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-bioluminescence/5 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-12">
          {t.title}
        </h1>
        
        <div className="glass-panel p-8 md:p-12 rounded-[2rem] border-white/5 shadow-2xl h-full">
          <div className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap font-light">
            {t.content}
          </div>
        </div>
      </div>
    </main>
  );
}
