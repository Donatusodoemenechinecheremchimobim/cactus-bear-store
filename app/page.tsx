"use client";
import { useDB } from '@/store/useDB';
import { useEffect } from 'react';
import Link from 'next/link';
import DropCountdown from '@/components/DropCountdown';
import { ArrowRight, Plus } from 'lucide-react';

export default function Home() {
  const { fetchProducts, products, fetchSettings } = useDB();
  
  useEffect(() => { 
      fetchProducts(); 
      fetchSettings(); 
  }, []);

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="bg-black min-h-screen text-white overflow-x-hidden">
      
      {/* HERO SECTION */}
      <section className="h-screen relative flex items-center justify-center overflow-hidden bg-zinc-900">
        
        {/* BEST MATCH FOUND: Woman, Sunglasses, Blonde, Tattoos, Edgy.
           If you have the ORIGINAL file from your screenshot, put it in 'public/hero.jpg' 
           and change this line to: bg-[url('/hero.jpg')]
        */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1616149562385-1d84e79478bb?q=80&w=1974')] bg-cover bg-center grayscale contrast-125 opacity-60 animate-pulse-slow" />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
        
        <div className="relative z-10 text-center px-4">
            <h2 className="text-brand-neon font-mono text-xs md:text-sm uppercase tracking-[0.5em] mb-4">/// Season 001 Live</h2>
            <h1 className="text-6xl md:text-[10vw] font-black uppercase italic leading-none mb-8 mix-blend-difference">
                Wilderness<br />Luxury
            </h1>
            <Link href="/collection/utopia" className="inline-block bg-white text-black px-12 py-5 font-black uppercase tracking-widest text-lg hover:bg-brand-neon hover:scale-105 transition-all">
                Enter Store
            </Link>
        </div>
      </section>

      <DropCountdown />

      {/* FEATURED PRODUCTS */}
      <section className="py-20 px-6 max-w-[1800px] mx-auto">
         <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-4">
            <h2 className="text-3xl font-black uppercase italic">Latest Drops</h2>
            <Link href="/collection/utopia" className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-brand-neon flex items-center gap-2">
                View All <ArrowRight size={14} />
            </Link>
         </div>

         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((p, i) => (
                <Link href={`/product/${p.id}`} key={p.id} className="group flex flex-col h-full bg-[#0a0a0a] border border-white/5 hover:border-brand-neon transition-all duration-300 relative overflow-hidden">
                    
                    {/* IMAGE AREA */}
                    <div className="aspect-[3/4] relative overflow-hidden bg-white/5">
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0" style={{ backgroundImage: `url(${p.images[0]})` }} />
                        {p.status === 'sold-out' && <div className="absolute top-2 left-2 bg-red-600/90 backdrop-blur text-white px-2 py-1 text-[9px] font-black uppercase tracking-widest border border-red-500">Sold Out</div>}
                        {p.status === 'pre-order' && <div className="absolute top-2 left-2 bg-yellow-500/90 backdrop-blur text-black px-2 py-1 text-[9px] font-black uppercase tracking-widest border border-yellow-400">Pre-Order</div>}
                    </div>

                    {/* CONTENT AREA */}
                    <div className="p-4 flex flex-col flex-1 justify-between relative">
                        <div>
                            <h3 className="text-xs md:text-sm font-black uppercase italic leading-tight mb-1 text-white group-hover:text-brand-neon transition-colors duration-300 line-clamp-1">{p.name}</h3>
                            <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest">{p.category || 'Collection 001'}</p>
                        </div>

                        <div className="mt-4 flex items-end justify-between border-t border-white/5 pt-3">
                             <span className="text-sm font-mono font-bold text-white/90">₦{p.price.toLocaleString()}</span>
                             
                             <div className="flex items-center">
                                <span className="flex items-center gap-1 text-[8px] md:text-[9px] font-black uppercase tracking-widest border border-white/10 text-white/50 px-2 py-1 group-hover:border-brand-neon group-hover:bg-brand-neon group-hover:text-black transition-all duration-300">
                                    DETAILS <Plus size={8} strokeWidth={4} />
                                </span>
                             </div>
                        </div>
                    </div>
                </Link>
            ))}
         </div>
      </section>
    </div>
  );
}