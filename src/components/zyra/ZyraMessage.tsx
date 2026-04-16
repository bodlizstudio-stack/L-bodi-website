'use client';

import { motion } from 'framer-motion';

export interface ZyraMessageProps {
  role: 'user' | 'assistant';
  content: string;
  isLatest?: boolean;
}

export function ZyraMessage({ role, content }: ZyraMessageProps) {
  const isUser = role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`
          max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed
          ${isUser
            ? 'bg-bioluminescence/15 text-white border border-bioluminescence/30 rounded-br-md shadow-[0_0_20px_rgba(0,255,157,0.15)]'
            : 'bg-white/5 text-slate-200 border border-white/10 rounded-bl-md'
          }
        `}
      >
        <p className="whitespace-pre-wrap break-words">{content}</p>
      </div>
    </motion.div>
  );
}
