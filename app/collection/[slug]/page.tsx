"use client";
import { useParams } from 'next/navigation';
import { useDB } from '@/store/useDB';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus } from 'lucide-react';

export default function CollectionPage() {
  const { slug } = useParams();
  const { products } = useDB();

  const collectionProducts = (slug === 'utopia' || slug === 'all')
      ? products 
      : products.filter(p => p.collection?.toLowerCase().includes((slug as string).toLowerCase()));

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 md:px-6 bg-black text-white">
        <div className="max-w-[1800px] mx-auto">
            <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
                <div>
                    <Link href="/collections" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-2 text-[10px] font-bold uppercase tracking-widest transition-colors">
                        <ArrowLeft size={12} /> Back to Archives
                    </Link>
                    <h1 className="text-4xl md:text-8xl font-black uppercase italic text-brand-neon leading-none">
                        {slug === 'utopia' ? 'Season 001' : slug}
                    </h1>
                </div>
            </div>

            {/* PRODUCT GRID */}
            {collectionProducts.length === 0 ? (
                <div className="py-20 text-center border border-white/10 bg-[#0a0a0a]">
                    <p className="font-mono text-white/40 uppercase animate-pulse">Scanning... No Intel Found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {collectionProducts.map((product, i) => (
                        <Link href={`/product/${product.id}`} key={product.id}>
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }} 
                            whileInView={{ opacity: 1, y: 0 }} 
                            viewport={{ once: true }} 
                            transition={{ delay: i * 0.05 }} 
                            className="group flex flex-col h-full bg-[#0a0a0a] border border-white/5 hover:border-brand-neon transition-all duration-300 relative overflow-hidden"
                          >
                            {/* IMAGE */}
                            <div className="aspect-[3/4] relative overflow-hidden bg-white/5">
                               <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0" style={{ backgroundImage: `url(${product.images[0]})` }} />
                               {product.status === 'sold-out' && <div className="absolute top-2 left-2 bg-red-600/90 backdrop-blur text-white px-2 py-1 text-[9px] font-black uppercase tracking-widest border border-red-500">Sold Out</div>}
                               {product.status === 'pre-order' && <div className="absolute top-2 left-2 bg-yellow-500/90 backdrop-blur text-black px-2 py-1 text-[9px] font-black uppercase tracking-widest border border-yellow-400">Pre-Order</div>}
                            </div>

                            {/* CONTENT BOX */}
                            <div className="p-4 flex flex-col flex-1 justify-between relative">
                                <div>
                                    <h3 className="text-xs md:text-sm font-black uppercase italic leading-tight mb-1 text-white group-hover:text-brand-neon transition-colors duration-300 line-clamp-1">{product.name}</h3>
                                    <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest">{product.category || 'Collection 001'}</p>
                                </div>

                                <div className="mt-4 flex items-end justify-between border-t border-white/5 pt-3">
                                     {/* NAIRA SYMBOL UPDATE */}
                                     <span className="text-sm font-mono font-bold text-white/90">₦{product.price.toLocaleString()}</span>
                                     
                                     <div className="flex items-center">
                                        <span className="flex items-center gap-1 text-[8px] md:text-[9px] font-black uppercase tracking-widest border border-white/10 text-white/50 px-2 py-1 group-hover:border-brand-neon group-hover:bg-brand-neon group-hover:text-black transition-all duration-300">
                                            DETAILS <Plus size={8} strokeWidth={4} />
                                        </span>
                                     </div>
                                </div>
                            </div>
                          </motion.div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
}