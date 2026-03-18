'use client';

import Link from 'next/link';
import { useLocale } from '../../context/LocaleContext';
import { translations } from '../../lib/translations';

export function Footer() {
  const { locale } = useLocale();
  const t = translations[locale].footer;
  const nav = translations[locale].nav;

  return (
    <footer className="relative z-10 py-20 border-t border-white/5 bg-obsidian/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="space-y-4 text-center md:text-left">
          <Link href="/" className="flex flex-col md:flex-row items-center md:items-start gap-4 group">
            <img src="/slike/logo.png" alt="BODLIZ STUDIO Logo" className="w-12 h-12 object-contain" />
            <div className="text-3xl font-bold tracking-tighter text-white uppercase">
              BODLIZ STUDIO<span className="text-bioluminescence">.</span>
            </div>
          </Link>
          <p className="text-slate-500 text-sm max-w-xs">
            {t.tagline}
          </p>
        </div>

        <div className="flex gap-16">
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-bioluminescence">{t.nav}</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="//" className="hover:text-white transition-colors">{t.home}</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">{nav.about || 'About'}</Link></li>
              <li><Link href="/#services" className="hover:text-white transition-colors">{nav.services}</Link></li>
              <li><Link href="/projects" className="hover:text-white transition-colors">{nav.myProjects}</Link></li>
              <li><Link 
                id="footer-contact-link"
                href="/#contact" 
                onClick={(e) => {
                  e.preventDefault();
                  // Dispatch animation immediately
                  window.dispatchEvent(new CustomEvent('trigger-circuit-trace'));
                  // Smooth scroll to contact section
                  setTimeout(() => {
                    const contactSection = document.getElementById('contact');
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 500); // Wait a bit for the animation to start drawing
                }}
                className="hover:text-white transition-colors"
               >
                 {nav.contact}
               </Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-bioluminescence">{t.connect}</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-[0.2em] text-slate-600">
        <p>{t.copyright}</p>
        <div className="flex gap-8 mt-4 md:mt-0">
          <Link href="/terms" className="hover:text-white transition-colors">{t.privacy}</Link>
          <Link href="/terms" className="hover:text-white transition-colors">{t.terms}</Link>
        </div>
      </div>
    </footer>
  );
}

