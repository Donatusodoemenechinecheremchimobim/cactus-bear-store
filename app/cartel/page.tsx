"use client";
import { useState } from 'react';
import { Users, Copy, Check } from 'lucide-react';

export default function Cartel() {
  const [code, setCode] = useState('AGENT-' + Math.random().toString(36).substr(2, 6).toUpperCase());
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-28 md:pt-32 px-4 md:px-6 bg-[#050505] text-white flex items-center justify-center">
        <div className="max-w-2xl w-full border border-white/10 bg-[#0a0a0a] p-6 md:p-16 relative overflow-hidden mb-20">
            <div className="absolute top-0 right-0 p-8 opacity-5"><Users size={200} /></div>
            
            <h1 className="text-3xl md:text-6xl font-black uppercase italic text-brand-neon mb-4 md:mb-6">The Cartel</h1>
            <p className="font-mono text-sm md:text-base text-white/60 mb-8 md:mb-12">
                Recruit operatives. Earn commission. Build your network.
                <br /><br />
                Share your unique identification code. When a recruit makes their first purchase, you receive <span className="text-white font-bold">$20.00</span> in store credit.
            </p>

            <div className="bg-black border border-white/20 p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-left">
                    <span className="text-[10px] uppercase font-bold text-white/30 tracking-widest block mb-2">Your Agent Code</span>
                    <span className="text-2xl md:text-3xl font-mono font-bold tracking-widest">{code}</span>
                </div>
                <button onClick={copyCode} className="w-full md:w-auto flex items-center justify-center gap-2 bg-white text-black px-6 py-3 font-bold uppercase hover:bg-brand-neon transition-colors text-sm">
                    {copied ? <Check size={16}/> : <Copy size={16}/>}
                    {copied ? 'Copied' : 'Copy Code'}
                </button>
            </div>

            <div className="mt-8 md:mt-12 grid grid-cols-3 gap-2 md:gap-4 text-center">
                <div className="border border-white/10 p-2 md:p-4">
                    <div className="text-lg md:text-2xl font-black">0</div>
                    <div className="text-[8px] md:text-[10px] uppercase text-white/40">Recruits</div>
                </div>
                <div className="border border-white/10 p-2 md:p-4">
                    <div className="text-lg md:text-2xl font-black">$0.00</div>
                    <div className="text-[8px] md:text-[10px] uppercase text-white/40">Earnings</div>
                </div>
                <div className="border border-white/10 p-2 md:p-4">
                    <div className="text-lg md:text-2xl font-black">Lvl 1</div>
                    <div className="text-[8px] md:text-[10px] uppercase text-white/40">Rank</div>
                </div>
            </div>
        </div>
    </div>
  );
}