"use client";
import Link from 'next/link';
import { Lock, ArrowRight, Ban } from 'lucide-react';

// FIXED WALLPAPERS: High-Reliability Fashion Images
const SEASONS = [
    { 
        id: 'utopia', 
        name: 'Season 1: Utopia', 
        status: 'unlocked', 
        // Desert Fashion (Utopia)
        img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2064', 
        desc: 'The Genesis Collection. Available Now.' 
    },
    { 
        id: 'dystopia', 
        name: 'Season 2: Dystopia', 
        status: 'locked', 
        // Dark Urban Streetwear (Dystopia)
        img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2070', 
        desc: 'Classified. Clearance Required.' 
    },
    { 
        id: 'cyber', 
        name: 'Season 3: Cyber', 
        status: 'locked', 
        // Neon Future Fashion (Cyber)
        img: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2072', 
        desc: 'System Offline.' 
    }
];

export default function Collections() {
  return (
    <div className="min-h-screen pt-32 px-6 bg-black text-white">
        <h1 className="text-4xl md:text-7xl font-black uppercase italic mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50">
            Archives
        </h1>
        
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
            {SEASONS.map((season) => (
                <div key={season.id} className="relative group border border-white/10 bg-[#0a0a0a] overflow-hidden min-h-[450px] md:min-h-[500px]">
                    
                    {/* WALLPAPER LAYER */}
                    <div 
                        className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 transform ${season.status === 'locked' ? 'grayscale opacity-50 scale-100' : 'grayscale-0 opacity-80 group-hover:scale-110 group-hover:contrast-125'}`} 
                        style={{ backgroundImage: `url(${season.img})` }} 
                    />
                    
                    {/* OVERLAYS */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />

                    <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 z-20">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                            <div>
                                <h2 className={`text-4xl md:text-6xl font-black uppercase italic mb-2 leading-none ${season.status === 'locked' ? 'text-white/50' : 'text-white drop-shadow-lg'}`}>
                                    {season.name}
                                </h2>
                                <p className="font-mono text-xs md:text-sm text-brand-neon uppercase tracking-widest bg-black/80 inline-block px-2 py-1">
                                    {season.desc}
                                </p>
                            </div>
                            
                            {season.status === 'locked' ? (
                                <div className="flex items-center gap-2 text-red-500 border border-red-500/30 px-6 py-3 uppercase font-black tracking-widest text-xs bg-red-950/30 backdrop-blur">
                                    <Ban size={16} /> RESTRICTED
                                </div>
                            ) : (
                                <Link href="/collection/utopia" className="bg-white text-black px-10 py-4 font-black uppercase tracking-widest hover:bg-brand-neon hover:scale-105 transition-all flex items-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                                    Enter Store <ArrowRight size={18} strokeWidth={3}/>
                                </Link>
                            )}
                        </div>
                    </div>

                    {season.status === 'locked' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none">
                            <div className="border-4 border-white/10 p-8 rounded-full bg-black/40 backdrop-blur-md">
                                <Lock size={64} className="text-white/20" strokeWidth={1.5} />
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    </div>
  );
}