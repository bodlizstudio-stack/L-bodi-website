'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useLocale } from '../../context/LocaleContext';
import { translations } from '../../lib/translations';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { locale, setLocale } = useLocale();
  const t = translations[locale].nav;

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuVariants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const linkVariants = {
    closed: { opacity: 0, y: 20 },
    open: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.1 + i * 0.1, duration: 0.5, ease: "easeOut" }
    })
  };

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button 
        onClick={toggleMenu} 
        className="relative z-50 w-10 h-10 flex flex-col justify-center items-center gap-1.5 focus:outline-none"
        aria-label="Toggle Mobile Menu"
      >
        <motion.span 
          animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} 
          className="w-6 h-0.5 bg-white origin-center transition-all bg-bioluminescence"
        />
        <motion.span 
          animate={isOpen ? { opacity: 0 } : { opacity: 1 }} 
          className="w-6 h-0.5 bg-white transition-all bg-bioluminescence"
        />
        <motion.span 
          animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} 
          className="w-6 h-0.5 bg-white origin-center transition-all bg-bioluminescence"
        />
      </button>

      {/* Fullscreen Overlay Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 z-40 bg-[#000000] flex flex-col justify-center items-center h-[100dvh] w-full"
            style={{ backgroundColor: '#000000' }}
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-bioluminescence/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Navigation Links */}
            <div className="flex flex-col items-center gap-8 text-2xl font-bold tracking-widest uppercase text-white/90 z-10 w-full px-6 text-center">
              {[
                { name: t.services, href: "/#services" },
                { name: t.myProjects, href: "/projects" },
                { name: t.about || 'About', href: "/about" },
                { name: t.contact, href: "/#contact" }
              ].map((link, i) => (
                <motion.div custom={i} variants={linkVariants} key={link.name}>
                  <Link 
                    href={link.href} 
                    onClick={toggleMenu}
                    className="hover:text-bioluminescence transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div custom={4} variants={linkVariants} className="mt-4">
                 <Link 
                   href="/#contact" 
                   onClick={toggleMenu}
                   className="px-8 py-3 bg-bioluminescence/10 border border-bioluminescence text-bioluminescence text-sm font-black uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(57,255,20,0.4)]"
                 >
                   {t.letsTalk}
                 </Link>
              </motion.div>
            </div>

            {/* Language Switcher */}
            <motion.div 
               custom={5} 
               variants={linkVariants} 
               className="absolute bottom-12 flex items-center gap-6 text-sm font-bold tracking-widest uppercase z-10"
            >
              <button
                type="button"
                onClick={() => { setLocale('en'); toggleMenu(); }}
                className={`transition-colors pb-1 border-b-2 ${locale === 'en' ? 'text-bioluminescence border-bioluminescence' : 'text-white/50 border-transparent'}`}
              >
                ENG
              </button>
              <button
                type="button"
                onClick={() => { setLocale('sl'); toggleMenu(); }}
                className={`transition-colors pb-1 border-b-2 ${locale === 'sl' ? 'text-bioluminescence border-bioluminescence' : 'text-white/50 border-transparent'}`}
              >
                SLO
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
