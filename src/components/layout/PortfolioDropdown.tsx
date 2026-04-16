'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useLocale } from '../../context/LocaleContext';
import { translations } from '../../lib/translations';
import { PORTFOLIO_LINKS } from '../../lib/portfolioLinks';

export function PortfolioDropdown() {
  const { locale } = useLocale();
  const t = translations[locale].nav;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="flex items-center gap-1 hover:text-bioluminescence transition-colors"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
      >
        {t.portfolio}
        <span
          className="inline-block text-[10px] transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          aria-hidden
        >
          ▼
        </span>
      </button>
      {open && (
        <div
          className="absolute left-0 top-full z-[60] pt-2 min-w-[14rem]"
          role="menu"
          aria-label={t.portfolio}
        >
          <div className="rounded-lg border border-white/10 bg-black/95 backdrop-blur-md py-2 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
            {PORTFOLIO_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                className="block px-4 py-2.5 text-[10px] font-semibold tracking-widest uppercase text-white/80 hover:text-bioluminescence hover:bg-white/5 transition-colors"
                onClick={() => setOpen(false)}
              >
                {t[item.labelKey]}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
