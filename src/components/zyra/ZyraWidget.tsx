'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZyraChatPanel } from './ZyraChatPanel';

const DAILY_LIMIT = 15;

export function ZyraWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [usageRemaining, setUsageRemaining] = useState(DAILY_LIMIT);

  const fetchUsage = async () => {
    try {
      const res = await fetch('/api/chat', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUsageRemaining(data.remaining ?? DAILY_LIMIT);
      }
    } catch {
      setUsageRemaining(DAILY_LIMIT);
    }
  };

  useEffect(() => {
    if (isOpen) fetchUsage();
  }, [isOpen]);

  // Listen for custom event to open the widget programmatically
  useEffect(() => {
    const handleOpenZyra = () => setIsOpen(true);
    window.addEventListener('open-zyra', handleOpenZyra);
    return () => window.removeEventListener('open-zyra', handleOpenZyra);
  }, []);

  const isLimitReached = usageRemaining <= 0;

  return (
    <>
      {/* Proactive bubble */}
      {!isOpen && usageRemaining > 0 && (
        <motion.div
          className="fixed bottom-24 right-8 z-50 glass-panel px-4 py-2 rounded-xl text-[10px] md:text-xs font-mono text-bioluminescence tracking-wider pointer-events-none"
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 3, duration: 0.8 }}
          style={{ 
            border: '1px solid rgba(57, 255, 20, 0.3)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(57, 255, 20, 0.1)'
          }}
        >
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-bioluminescence animate-pulse" />
             Need help? Ask our Bio-Digital AI
          </div>
          {/* Bubble tail */}
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-obsidian border-r border-b border-white/10 rotate-45" style={{ backgroundColor: 'rgba(20, 20, 20, 0.8)', borderColor: 'rgba(57, 255, 20, 0.3)' }} />
        </motion.div>
      )}

      {/* Floating button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(true)}
        className="zyra-fab fixed bottom-6 right-6 z-50 w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center border border-bioluminescence/40 bg-[#0a0a0a]/90 backdrop-blur-md shadow-[0_0_40px_rgba(57,255,20,0.2),inset_0_0_0_1px_rgba(57,255,20,0.15)] hover:border-bioluminescence/70 hover:shadow-[0_0_50px_rgba(57,255,20,0.35)] focus:outline-none focus:ring-2 focus:ring-bioluminescence/50 transition-all duration-300"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        aria-label="Open Zyra AI assistant"
      >
        {/* Ping animation ring */}
        <span className="absolute inset-0 rounded-2xl bg-bioluminescence/20 animate-ping" style={{ animationDuration: '3s' }} />
        
        <span className="zyra-fab-glow absolute inset-0 rounded-2xl" aria-hidden />
        <img
          src="/slike/logo.png"
          alt=""
          className="relative z-10 w-7 h-7 md:w-8 md:h-8 object-contain drop-shadow-[0_0_8px_rgba(57,255,20,0.6)]"
        />
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <ZyraChatPanel
            key="zyra-panel"
            onClose={() => setIsOpen(false)}
            usageRemaining={usageRemaining}
            isLimitReached={isLimitReached}
            onUsageDecrement={() => setUsageRemaining((r) => Math.max(0, r - 1))}
          />
        )}
      </AnimatePresence>
    </>
  );
}
