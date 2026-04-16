'use client';

import { motion } from 'framer-motion';

export function ZyraTypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className="rounded-2xl rounded-bl-md bg-white/5 border border-white/10 px-4 py-3 flex items-center gap-1.5">
        <span className="zyra-typing-dot w-2 h-2 rounded-full bg-bioluminescence" />
        <span className="zyra-typing-dot w-2 h-2 rounded-full bg-bioluminescence" style={{ animationDelay: '0.15s' }} />
        <span className="zyra-typing-dot w-2 h-2 rounded-full bg-bioluminescence" style={{ animationDelay: '0.3s' }} />
      </div>
    </motion.div>
  );
}
