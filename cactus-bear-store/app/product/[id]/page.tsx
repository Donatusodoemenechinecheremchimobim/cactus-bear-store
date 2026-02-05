"use client";
import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { useDB } from '@/store/useDB';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Heart, ChevronRight, AlertTriangle } from 'lucide-react';

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart, toggleCart, currency, exchangeRate } = useStore();
  const { products, toggleWishlist, wishlist } = useDB();
  const product = products.find(p => p.id === id);
  const [size, setSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [mainImage, setMainImage] = useState('');
  
  const isSoldOut = product?.status === 'sold-out';
  const isPreOrder = product?.status === 'pre-order';

  useEffect(() => { if (product) { setSelectedColor(product.colors[0]); setMainImage(product.images[0]); } }, [product]);
  
  if (!product) return <div className="h-screen flex items-center justify-center text-white font-mono uppercase bg-black">Item Not Found</div>;
  
  const isWishlisted = wishlist.includes(product.id);
  
  const handleAdd = () => { 
      if (isSoldOut) return;
      if (!size) { alert('PLEASE SELECT A SIZE'); return; } 
      addToCart(product, size, selectedColor); 
      toggleCart(); 
  };
  
  const displayPrice = currency === 'USD' 
      ? `$${product.price.toLocaleString()}.00` 
      : `₦${(product.price * exchangeRate).toLocaleString()}`;

  return (
    <div className="min-h-screen pt-20 bg-black text-white pb-32">
      <div className="grid md:grid-cols-2">
          {/* GALLERY */}
          <div className="relative h-[60vh] md:h-screen border-r border-white/10 flex flex-col bg-[#050505]">
              <motion.div key={mainImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`flex-1 bg-cover bg-center transition-all ${isSoldOut ? 'grayscale' : ''}`} style={{ backgroundImage: `url(${mainImage})` }} />
              
              {/* STATUS OVERLAY */}
              {isSoldOut && <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10"><h2 className="text-6xl font-black uppercase italic text-red-600 border-4 border-red-600 px-8 py-4 -rotate-12">Sold Out</h2></div>}
              {isPreOrder && <div className="absolute top-6 left-6 z-10 bg-yellow-500 text-black px-4 py-2 font-black uppercase tracking-widest">Pre-Order Only</div>}
          </div>

          {/* DETAILS */}
          <div className="p-8 md:p-24 flex flex-col justify-center relative">
              <span className="text-brand-neon font-mono text-sm uppercase tracking-widest mb-4">/// {product.collection || 'Collection 001'}</span>
              <h1 className="text-5xl md:text-7xl font-black uppercase italic leading-none mb-4">{product.name}</h1>
              <p className="text-3xl text-white font-mono mb-8 pb-8 border-b border-white/10">{displayPrice}</p>
              
              <div className="mb-8">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-4 block">Colorway</label>
                  <div className="flex gap-4 flex-wrap">
                      {product.colors.map(c => (
                          <button key={c} onClick={() => setSelectedColor(c)} className={`px-6 py-3 border text-xs font-bold uppercase transition-all ${selectedColor === c ? 'bg-white text-black border-white' : 'border-white/20 text-white/50 hover:border-white hover:text-white'}`}>{c}</button>
                      ))}
                  </div>
              </div>

              <div className="mb-12">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-4 block">Size</label>
                  <div className="flex gap-4 flex-wrap">
                      {(product.sizes || ['S','M','L','XL']).map(s => (
                          <button key={s} onClick={() => setSize(s)} className={`w-14 h-14 border flex items-center justify-center text-sm font-bold transition-all ${size === s ? 'bg-brand-neon text-black border-brand-neon' : 'border-white/20 hover:border-white'}`}>{s}</button>
                      ))}
                  </div>
              </div>

              <div className="flex gap-4">
                  <button 
                    onClick={handleAdd} 
                    disabled={isSoldOut}
                    className={`flex-1 py-5 text-lg font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group ${isSoldOut ? 'bg-white/10 text-white/30 cursor-not-allowed' : 'bg-white text-black hover:bg-brand-neon hover:scale-[1.01]'}`}
                  >
                      {isSoldOut ? 'Out of Stock' : (isPreOrder ? 'Pre-Order Now' : 'Add To Cart')} 
                      {!isSoldOut && <ChevronRight className="group-hover:translate-x-1 transition-transform"/>}
                  </button>
                  <button onClick={() => toggleWishlist(product.id)} className={`w-20 border flex items-center justify-center transition-colors ${isWishlisted ? 'bg-red-600 border-red-600 text-white' : 'border-white/20 hover:border-white'}`}>
                      <Heart fill={isWishlisted ? "currentColor" : "none"} />
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
}