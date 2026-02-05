const fs = require('fs');
const path = require('path');

const rootDir = process.cwd(); 

const writeFile = (filePath, content) => {
  const absolutePath = path.join(rootDir, filePath);
  const dir = path.dirname(absolutePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(absolutePath, content.trim());
  console.log("Successfully Fixed: " + filePath);
};

const files = {
  'components/DropCountdown.tsx': `
"use client";
import { useState, useEffect } from 'react';
import { useDB } from '@/store/useDB';

export default function DropCountdown() {
  // ⚠️ THE FIX: Changed 'dropSettings' to 'settings'
  const { settings, fetchSettings } = useDB();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (!settings?.nextDrop) return;

    const timer = setInterval(() => {
      const target = new Date(settings.nextDrop).getTime();
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [settings]);

  if (!mounted || !settings?.nextDrop) return null;

  return (
    <div className="bg-brand-neon text-black py-2 px-4 flex justify-center gap-8 font-mono text-[10px] font-black uppercase tracking-[0.2em]">
      <div className="flex items-center gap-2">
        <span className="opacity-40">Next Drop:</span>
        <span>{settings.announcement || 'Utopia Collection'}</span>
      </div>
      <div className="flex gap-4">
        <div>{timeLeft.days}D</div>
        <div>{timeLeft.hours}H</div>
        <div>{timeLeft.minutes}M</div>
        <div>{timeLeft.seconds}S</div>
      </div>
    </div>
  );
}
`
};

Object.keys(files).forEach((filePath) => { writeFile(filePath, files[filePath]); });

console.log("COUNTDOWN FIXED. Run git push now.");