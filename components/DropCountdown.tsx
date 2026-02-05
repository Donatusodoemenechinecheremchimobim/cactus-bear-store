"use client";
import { useState, useEffect } from 'react';
import { useDB } from '@/store/useDB';

export default function DropCountdown() {
  const { dropSettings, fetchSettings } = useDB();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => { 
      setMounted(true);
      fetchSettings(); 
  }, []);

  useEffect(() => {
    if (!dropSettings.dropDate) return;
    
    const targetDate = new Date(dropSettings.dropDate);

    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [dropSettings]);

  if (!mounted) return null;

  return (
    <div className="bg-[#050505] border-y border-white/10 py-6 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4">
            {/* Title */}
            <div className="flex items-center gap-3 animate-pulse">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full"></div>
                <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-red-500">{dropSettings.dropTitle || "DROP INBOUND"}</span>
            </div>
            
            {/* Timer - SCALED DOWN FOR MOBILE (text-3xl) / BIG ON DESKTOP (text-6xl) */}
            <div className="flex gap-4 md:gap-8 font-black text-3xl md:text-6xl text-white font-mono leading-none">
                <div className="flex flex-col items-center">
                    <span>{String(timeLeft.days).padStart(2, '0')}</span>
                    <span className="text-[8px] md:text-[10px] font-sans font-normal text-white/30 uppercase tracking-widest">Days</span>
                </div>
                <span className="text-brand-neon animate-pulse">:</span>
                <div className="flex flex-col items-center">
                    <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className="text-[8px] md:text-[10px] font-sans font-normal text-white/30 uppercase tracking-widest">Hrs</span>
                </div>
                <span className="text-brand-neon animate-pulse">:</span>
                <div className="flex flex-col items-center">
                    <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span className="text-[8px] md:text-[10px] font-sans font-normal text-white/30 uppercase tracking-widest">Mins</span>
                </div>
                <span className="text-brand-neon animate-pulse">:</span>
                <div className="flex flex-col items-center">
                    <span className="text-brand-neon">{String(timeLeft.seconds).padStart(2, '0')}</span>
                    <span className="text-[8px] md:text-[10px] font-sans font-normal text-white/30 uppercase tracking-widest">Secs</span>
                </div>
            </div>

            <div className="hidden md:block font-mono text-xs text-white/30 uppercase tracking-widest">
                /// Coordinates Locked
            </div>
        </div>
    </div>
  );
}