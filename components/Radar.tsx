"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MESSAGES = [
  "INITIALIZING SECURE LINK...",
  "SCANNING ARCHIVE...",
  "LOCATING UTOPIA ASSETS...",
  "DECRYPTING COLLECTION DATA...",
  "ENCRYPTED CONNECTION STABLE",
];

export default function Radar() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-10 left-10 z-40 hidden lg:block">
      <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md border border-white/10 p-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border border-brand-neon/20 rounded-full"></div>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-t border-brand-neon rounded-full"
          ></motion.div>
          <div className="absolute inset-[45%] bg-brand-neon rounded-full animate-pulse shadow-[0_0_15px_rgba(157,255,0,0.8)]"></div>
        </div>
        
        <div className="w-48 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={msgIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="text-[10px] font-mono text-white/90 leading-relaxed uppercase tracking-widest"
            >
              {/* FIXED LINE BELOW */}
              {'>'} {MESSAGES[msgIndex]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}