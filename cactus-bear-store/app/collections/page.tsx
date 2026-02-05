"use client";
import Link from 'next/link';
import { Lock, ArrowRight, Ban } from 'lucide-react';

const SEASONS = [
    { 
        id: 'utopia', 
        name: 'Season 1: Utopia', 
        status: 'unlocked', 
        img: 'https://images.unsplash.com/photo-1509506692737-c7afc73a2143?q=80&w=2070', 
        desc: 'The Genesis Collection. Available Now.' 
    },
    { 
        id: 'dystopia', 
        name: 'Season 2: Dystopia', 
        status: 'locked', 
        img: 'https://images.unsplash.com/photo-1617144788540-c3d0f0744033?q=80&w=2070', 
        desc: 'Classified. Clearance Required.' 
    },
    { 
        id: 'cyber', 
        name: 'Season 3: Cyber', 
        status: 'locked', 
        img: 'https://images.unsplash.com/photo-1550614000-4b9519e02d8e?q=80&w=2070', 
        desc: 'System Offline.' 
    }
];

export default function Collections() {
  return (
    <div className="min-h-screen pt-32 px-6 bg-black text-white">
        <h1 className="text-4xl md:text-7xl font-black uppercase italic mb-12 text-center">Archives</h1>
        
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
            {SEASONS.map((season) => (
                <div key={season.id} className="relative group border border-white/10 bg-[#050505] overflow-hidden min-h-[400px]">
                    
                    {/* Background Image - Blurred if Locked */}
                    <div className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ${season.status === 'locked' ? 'grayscale opacity-20 blur-sm' : 'grayscale group-hover:grayscale-0'}`} style={{ backgroundImage: `url(${season.img})` }} />
                    
                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black via-black/50 to-transparent z-10">
                        <div className="flex justify-between items-end">
                            <div>
                                <h2 className={`text-3xl md:text-5xl font-black uppercase italic mb-2 ${season.status === 'locked' ? 'text-white/30' : 'text-white'}`}>{season.name}</h2>
                                <p className="font-mono text-xs md:text-sm text-white/60 uppercase tracking-widest">{season.desc}</p>
                            </div>
                            
                            {season.status === 'locked' ? (
                                <div className="flex items-center gap-2 text-brand-neon border border-brand-neon/30 px-4 py-2 uppercase font-bold tracking-widest text-xs bg-brand-neon/5">
                                    <Ban size={14} /> RESTRICTED
                                </div>
                            ) : (
                                <Link href={`/collection/${season.id}`} className="bg-brand-neon text-black px-8 py-3 font-black uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2">
                                    Enter <ArrowRight size={16}/>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* NEON PADLOCK OVERLAY FOR LOCKED SEASONS */}
                    {season.status === 'locked' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
                            <div className="border-4 border-brand-neon p-6 rounded-full shadow-[0_0_30px_rgba(204,255,0,0.3)] bg-black/50 backdrop-blur-md">
                                <Lock size={48} className="text-brand-neon" strokeWidth={2.5} />
                            </div>
                            <p className="mt-4 text-brand-neon font-mono text-xs uppercase tracking-[0.3em] animate-pulse">Access Denied</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    </div>
  );
}