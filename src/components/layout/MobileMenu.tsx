'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useLocale } from '../../context/LocaleContext';
import { translations } from '../../lib/translations';
import { PORTFOLIO_LINKS } from '../../lib/portfolioLinks';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { locale, setLocale } = useLocale();
  const t = translations[locale].nav;

  // Wait for client mount so createPortal works
  useEffect(() => { setMounted(true); }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const linkVariants = {
    closed: { opacity: 0, y: 20 },
    open: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.15 + i * 0.08, duration: 0.4, ease: "easeOut" }
    })
  };

  // The overlay is rendered via Portal directly on document.body
  // This ensures it is OUTSIDE the <nav mix-blend-difference> parent
  const overlay = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mobile-menu-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 flex flex-col justify-center items-center"
          style={{
            zIndex: 9999,
            backgroundColor: '#000000',
            height: '100dvh',
            width: '100vw',
            top: 0,
            left: 0,
            position: 'fixed',
            isolation: 'isolate',
          }}
        >
          {/* Ambient Background Glow */}
          <div 
            className="absolute pointer-events-none rounded-full" 
            style={{
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '24rem', height: '24rem',
              background: 'rgba(57, 255, 20, 0.08)',
              filter: 'blur(100px)',
            }}
          />

          {/* Close Button - top right */}
          <button 
            onClick={toggleMenu}
            className="absolute top-6 right-6 w-10 h-10 flex flex-col justify-center items-center gap-1.5"
            style={{ zIndex: 10000 }}
            aria-label="Close Menu"
          >
            <span className="w-6 h-0.5 origin-center" style={{ backgroundColor: '#39FF14', transform: 'rotate(45deg) translateY(4px)' }} />
            <span className="w-6 h-0.5 origin-center" style={{ backgroundColor: '#39FF14', transform: 'rotate(-45deg) translateY(-4px)' }} />
          </button>

          {/* Navigation Links */}
          <div className="flex flex-col items-center gap-8 text-2xl font-bold tracking-widest uppercase w-full px-6 text-center" style={{ position: 'relative', zIndex: 10 }}>
            <motion.div custom={0} variants={linkVariants} initial="closed" animate="open">
              <Link
                href="/#services"
                onClick={toggleMenu}
                style={{ color: 'rgba(255,255,255,0.9)' }}
                className="hover:text-bioluminescence transition-colors"
              >
                {t.services}
              </Link>
            </motion.div>

            <motion.div custom={1} variants={linkVariants} initial="closed" animate="open" className="flex flex-col gap-4 w-full max-w-sm">
              <p className="text-sm font-black tracking-[0.2em] text-bioluminescence/90">{t.portfolio}</p>
              <div className="flex flex-col gap-3 text-lg">
                {PORTFOLIO_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={toggleMenu}
                    style={{ color: 'rgba(255,255,255,0.75)' }}
                    className="hover:text-bioluminescence transition-colors normal-case tracking-normal font-semibold"
                  >
                    {t[item.labelKey]}
                  </Link>
                ))}
              </div>
            </motion.div>

            {[
              { name: t.myProjects, href: '/projects' },
              { name: t.about || 'About', href: '/about' },
              { name: t.contact, href: '/#contact' },
            ].map((link, i) => (
              <motion.div custom={2 + i} variants={linkVariants} initial="closed" animate="open" key={link.href}>
                <Link
                  href={link.href}
                  onClick={toggleMenu}
                  style={{ color: 'rgba(255,255,255,0.9)' }}
                  className="hover:text-bioluminescence transition-colors"
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}

            <motion.div custom={5} variants={linkVariants} initial="closed" animate="open" className="mt-4">
               <Link 
                 href="/#contact" 
                 onClick={toggleMenu}
                 className="px-8 py-3 rounded-full text-sm font-black uppercase tracking-widest"
                 style={{
                   backgroundColor: 'rgba(57, 255, 20, 0.1)',
                   border: '1px solid #39FF14',
                   color: '#39FF14',
                   boxShadow: '0 0 20px rgba(57, 255, 20, 0.4)',
                 }}
               >
                 {t.letsTalk}
               </Link>
            </motion.div>
          </div>

          {/* Language Switcher */}
          <motion.div 
             custom={6} 
             variants={linkVariants} 
             initial="closed"
             animate="open"
             className="absolute bottom-12 flex items-center gap-6 text-sm font-bold tracking-widest uppercase"
             style={{ zIndex: 10 }}
          >
            <button
              type="button"
              onClick={() => { setLocale('en'); toggleMenu(); }}
              style={{
                color: locale === 'en' ? '#39FF14' : 'rgba(255,255,255,0.5)',
                borderBottom: locale === 'en' ? '2px solid #39FF14' : '2px solid transparent',
                paddingBottom: '4px',
              }}
            >
              ENG
            </button>
            <button
              type="button"
              onClick={() => { setLocale('sl'); toggleMenu(); }}
              style={{
                color: locale === 'sl' ? '#39FF14' : 'rgba(255,255,255,0.5)',
                borderBottom: locale === 'sl' ? '2px solid #39FF14' : '2px solid transparent',
                paddingBottom: '4px',
              }}
            >
              SLO
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button 
        onClick={toggleMenu} 
        className="relative w-10 h-10 flex flex-col justify-center items-center gap-1.5 focus:outline-none"
        style={{ zIndex: 10001 }}
        aria-label="Toggle Mobile Menu"
      >
        <motion.span 
          animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} 
          className="w-6 h-0.5 origin-center"
          style={{ backgroundColor: '#39FF14' }}
        />
        <motion.span 
          animate={isOpen ? { opacity: 0 } : { opacity: 1 }} 
          className="w-6 h-0.5"
          style={{ backgroundColor: '#39FF14' }}
        />
        <motion.span 
          animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} 
          className="w-6 h-0.5 origin-center"
          style={{ backgroundColor: '#39FF14' }}
        />
      </button>

      {/* Render overlay via Portal on document.body - escapes mix-blend-difference */}
      {mounted && createPortal(overlay, document.body)}
    </div>
  );
}
