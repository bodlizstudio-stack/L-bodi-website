'use client';

import Link from 'next/link';
import { useLocale } from '../../context/LocaleContext';
import { translations } from '../../lib/translations';

export function HeaderNav() {
  const { locale, setLocale } = useLocale();
  const t = translations[locale].nav;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center mix-blend-difference">
      <Link href="/" className="flex items-center gap-3 group">
        <img src="/slike/logo.png" alt="BODLIZ STUDIO Logo" className="w-10 h-10 object-contain transition-transform duration-500 group-hover:scale-110" />
        <div className="text-xl font-bold tracking-tighter text-white uppercase">
          BODLIZ STUDIO<span className="text-bioluminescence">.</span>
        </div>
      </Link>
      <div className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-widest uppercase text-white/70">
        <Link href="/#services" className="hover:text-bioluminescence transition-colors">{t.services}</Link>
        <Link href="/projects" className="hover:text-bioluminescence transition-colors">{t.myProjects}</Link>
        <Link href="/about" className="hover:text-bioluminescence transition-colors">{t.about || 'About'}</Link>
        <Link href="/#contact" className="hover:text-bioluminescence transition-colors">{t.contact}</Link>
        <div className="flex items-center gap-1 ml-4">
          <Link 
            href="/#contact" 
            className="px-6 py-2 bg-transparent border border-bioluminescence text-bioluminescence text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-bioluminescence hover:text-black hover:shadow-[0_0_20px_rgba(57,255,20,0.6)] shadow-[0_0_10px_rgba(57,255,20,0.2)] transition-all hover:scale-105"
          >
            {t.letsTalk}
          </Link>
        </div>
        <span className="text-white/40">|</span>
        <button
          type="button"
          onClick={() => setLocale('en')}
          className={`transition-colors ${locale === 'en' ? 'text-bioluminescence' : 'hover:text-bioluminescence'}`}
          aria-pressed={locale === 'en'}
          aria-label="English"
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => setLocale('sl')}
          className={`transition-colors ${locale === 'sl' ? 'text-bioluminescence' : 'hover:text-bioluminescence'}`}
          aria-pressed={locale === 'sl'}
          aria-label="Slovenian"
        >
          SLO
        </button>
      </div>
    </nav>
  );
}
