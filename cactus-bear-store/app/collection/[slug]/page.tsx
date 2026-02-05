"use client";
import { useParams } from 'next/navigation';
import { useDB } from '@/store/useDB';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function CollectionPage() {
  const { slug } = useParams();
  const { products } = useDB();

  // Filter products that belong to this collection (case insensitive)
  const collectionProducts = products.filter(p => 
      p.collection?.toLowerCase().includes((slug as string).toLowerCase())
  );

  return (
    <div className="min-h-screen pt-32 px-6 bg-black text-white pb-20">
        <div className="max-w-[1800px] mx-auto">
            <Link href="/collections" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 text-xs font-bold uppercase tracking-widest transition-colors">
                <ArrowLeft size={14} /> Back to Archives
            </Link>

            <h1 className="text-5xl md:text-8xl font-black uppercase italic mb-4 text-brand-neon">
                {slug} <span className="text-white text-2xl not-italic font-mono align-middle tracking-widest opacity-50">/// SEASON 1</span>
            </h1>

            {collectionProducts.length === 0 ? (
                <div className="py-20 text-center border border-white/10 bg-[#0a0a0a]">
                    <p className="font-mono text-white/40 uppercase">No Intel Found for this Sector.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {collectionProducts.map((product, i) => (
                        <Link href={`/product/${product.id}`} key={product.id}>
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }} 
                            whileInView={{ opacity: 1, y: 0 }} 
                            viewport={{ once: true }} 
                            transition={{ delay: i * 0.1 }} 
                            className="group relative bg-[#0a0a0a] border border-white/10 overflow-hidden hover:border-brand-neon/50 transition-colors h-[500px] flex flex-col"
                          >
                            <div className="relative h-[350px] overflow-hidden">
                               <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" style={{ backgroundImage: `url(${product.images[0]})` }} />
                               
                               {/* STATUS BADGES */}
                               {product.status === 'sold-out' && (
                                   <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest">Sold Out</div>
                               )}
                               {product.status === 'pre-order' && (
                                   <div className="absolute top-4 left-4 bg-yellow-500 text-black px-3 py-1 text-[10px] font-black uppercase tracking-widest">Pre-Order</div>
                               )}
                            </div>
                            <div className="p-6 relative flex-1 flex flex-col justify-between">
                              <div>
                                  <h3 className="text-xl font-black uppercase italic mb-1 group-hover:text-brand-neon transition-colors leading-none">{product.name}</h3>
                                  <p className="text-xs text-white/40 font-mono mt-1">{product.category}</p>
                              </div>
                              <div className="flex justify-between items-end mt-4">
                                <span className="text-white/70 font-mono">$${product.price}</span>
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