'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZyraMessage } from './ZyraMessage';
import { ZyraTypingIndicator } from './ZyraTypingIndicator';

const WELCOME = "Hi! I'm Zyra AI — your smart assistant. How can I help you today?";
const LIMIT_MESSAGE = "You reached today's free AI limit. Try again tomorrow.";

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ZyraChatPanelProps {
  onClose: () => void;
  usageRemaining: number;
  isLimitReached: boolean;
  onUsageDecrement?: () => void;
}

export function ZyraChatPanel({ onClose, usageRemaining, isLimitReached, onUsageDecrement }: ZyraChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'assistant', content: WELCOME },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading || isLimitReached) return;

    setInput('');
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const history = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ messages: history }),
      });

      const data = await res.json();

      if (res.status === 429) {
        setMessages((prev) => [...prev, { id: `limit-${Date.now()}`, role: 'assistant', content: LIMIT_MESSAGE }]);
        return;
      }

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { id: `err-${Date.now()}`, role: 'assistant', content: data.error || 'Something went wrong. Try again.' },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        { id: `ai-${Date.now()}`, role: 'assistant', content: data.message || '' },
      ]);
      onUsageDecrement?.();
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: `err-${Date.now()}`, role: 'assistant', content: 'Connection error. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm zyra-backdrop pointer-events-auto"
        onClick={onClose}
        aria-hidden
      />
      <motion.div
        role="dialog"
        aria-label="Zyra AI chat"
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
        className="zyra-panel pointer-events-auto absolute bottom-4 right-4 top-[10vh] left-4 md:left-auto md:bottom-6 md:right-6 md:top-auto md:w-[420px] md:max-h-[560px] z-[101] flex flex-col rounded-2xl overflow-hidden border border-bioluminescence/25 bg-[#0d1117]/95 backdrop-blur-xl shadow-[0_0_60px_rgba(0,255,157,0.12),inset_0_0_0_1px_rgba(0,255,157,0.08)]"
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-bioluminescence/15 border border-bioluminescence/30 flex items-center justify-center shadow-[0_0_20px_rgba(0,255,157,0.2)]">
              <img src="/slike/logo.png" alt="" className="w-5 h-5 object-contain" />
            </div>
            <div>
              <p className="font-semibold text-white tracking-tight">Zyra AI</p>
              <p className="text-xs text-slate-400">Your smart assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isLimitReached && (
              <span className="text-xs text-slate-500 tabular-nums">
                {usageRemaining} left today
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 min-h-0"
        >
          {messages.map((msg) => (
            <ZyraMessage
              key={msg.id}
              role={msg.role}
              content={msg.content}
            />
          ))}
          <AnimatePresence>
            {isLoading && <ZyraTypingIndicator />}
          </AnimatePresence>
        </div>

        {/* Input */}
        <div className="flex-shrink-0 p-4 pt-2 border-t border-white/10 bg-black/10">
          {isLimitReached ? (
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 px-4 py-3 text-sm text-amber-200">
              {LIMIT_MESSAGE}
            </div>
          ) : (
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Zyra anything..."
                rows={1}
                disabled={isLoading}
                className="zyra-input flex-1 min-h-[44px] max-h-28 px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-sm resize-none focus:border-bioluminescence/50 focus:ring-2 focus:ring-bioluminescence/20 outline-none transition-all disabled:opacity-60"
              />
              <button
                type="button"
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="flex-shrink-0 w-12 h-12 rounded-xl bg-bioluminescence/20 border border-bioluminescence/40 text-bioluminescence flex items-center justify-center hover:bg-bioluminescence/30 hover:border-bioluminescence/60 hover:shadow-[0_0_24px_rgba(0,255,157,0.25)] disabled:opacity-40 disabled:pointer-events-none transition-all"
                aria-label="Send message"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
