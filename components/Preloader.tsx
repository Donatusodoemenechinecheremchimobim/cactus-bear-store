"use client";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6"
        >
          {/* LOGO CONTAINER */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative w-full max-w-lg flex items-center justify-center"
          >
             {/* ⚠️ THE FIX: 
                1. mix-blend-mode: screen -> Hides black pixels
                2. contrast(150%) -> Forces dark gray pixels to become pure black (so they hide too)
                3. grayscale(100%) -> Removes any color tint
             */}
             <img 
               src="/logo.jpg" 
               alt="Cactus Bear" 
               className="w-full h-auto object-contain"
               style={{ 
                 mixBlendMode: 'screen', 
                 filter: 'contrast(150%) grayscale(100%) brightness(100%)' 
               }} 
             />
          </motion.div>

          {/* Loading Bar */}
          <div className="absolute bottom-12 w-32 h-0.5 bg-zinc-900 overflow-hidden rounded-full">
            <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                className="h-full w-1/2 bg-white"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}