'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '../../context/LocaleContext';
import { translations } from '../../lib/translations';

export function Footer() {
  const { locale } = useLocale();
  const t = translations[locale].footer;
  const nav = translations[locale].nav;

  // Easter Egg State
  const [eggPhase, setEggPhase] = useState<'hidden' | 'text' | 'video'>('hidden');
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleEasterEgg = () => {
    if (eggPhase !== 'hidden') return;
    setEggPhase('text');
    
    // Play the cool fade-in sequence
    setTimeout(() => {
      // 1. Fade out the text, fade in the video
      setEggPhase('video');
    }, 2500);
  };

  const closeEasterEgg = () => {
    setEggPhase('hidden');
  };

  return (
    <>
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
                    window.dispatchEvent(new CustomEvent('trigger-circuit-trace'));
                    setTimeout(() => {
                      const contactSection = document.getElementById('contact');
                      if (contactSection) {
                        contactSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }, 500); 
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
          <p>
            <span 
              onClick={handleEasterEgg} 
              className="cursor-pointer hover:text-bioluminescence hover:shadow-[0_0_10px_#39ff14] transition-all duration-300 inline-block"
              title="Click me"
            >
              ©
            </span>
            {t.copyright.replace('©', '')}
          </p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <Link href="/terms" className="hover:text-white transition-colors">{t.privacy}</Link>
            <Link href="/terms" className="hover:text-white transition-colors">{t.terms}</Link>
          </div>
        </div>
      </footer>

      {/* EASTER EGG OVERLAY */}
      <AnimatePresence>
        {eggPhase !== 'hidden' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            ref={overlayRef}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center"
          >
            {/* Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-white/5 rounded-full blur-[120px] pointer-events-none transition-all duration-1000" />
            
            <button 
              onClick={() => {
                closeEasterEgg();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="absolute top-8 right-8 text-white/50 hover:text-white text-xs font-mono uppercase tracking-widest z-[110] transition-colors"
            >
              [ Back to Home ]
            </button>

            {eggPhase === 'text' && (
              <motion.h1 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1, type: 'spring' }}
                ref={textRef}
                className="text-white text-4xl md:text-8xl font-black uppercase tracking-[0.5em] text-center"
                style={{ textShadow: '0 0 40px rgba(255,255,255,0.3)' }}
              >
                EASTER EGG
              </motion.h1>
            )}

            {eggPhase === 'video' && (
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1 }}
                className="relative w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-[0_0_100px_rgba(255,255,255,0.1)] border border-white/10"
              >
                <video 
                  ref={videoRef}
                  src="/slike/Jesus is the only true God.mp4" 
                  controls
                  autoPlay 
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

