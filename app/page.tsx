"use client";
import { useEffect } from 'react';
import { useDB } from '@/store/useDB';
import Link from 'next/link';
import DropCountdown from '@/components/DropCountdown';

export default function Home() {
  const { products, fetchProducts } = useDB();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="min-h-screen bg-black">
      <DropCountdown />
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 text-center">
        <h1 className="text-[15vw] font-black uppercase italic leading-none tracking-tighter text-white">
          UTOPIA<span className="text-brand-neon">.</span>
        </h1>
        <p className="max-w-xl mx-auto mt-6 text-xs font-mono text-white/40 uppercase tracking-[0.4em]">
          Digital artifacts // Limited deployment
        </p>
      </section>

      {/* Product Grid */}
      <div className="max-w-[1600px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
        {products.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`} className="group relative aspect-[4/5] bg-zinc-900 overflow-hidden border border-white/5">
            <img 
              src={product.images[0]} 
              alt={product.name}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div>
                    <h3 className="text-xl font-black uppercase italic leading-none mb-2">{product.name}</h3>
                    <p className="text-[10px] font-mono text-brand-neon uppercase tracking-widest">{product.collection}</p>
                </div>
                <p className="text-lg font-mono italic">₦{product.price.toLocaleString()}</p>
            </div>
          </Link>
        ))}
      </div>
      
      {products.length === 0 && (
        <div className="py-40 text-center text-white/20 font-mono text-[10px] uppercase tracking-[0.5em]">
            Waiting for next deployment...
        </div>
      )}
    </div>
  );
}