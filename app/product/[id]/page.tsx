"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { useDB } from '@/store/useDB';
import { ShieldCheck, Share2, ArrowLeft, Plus } from 'lucide-react'; // Swapped ShoppingBag for cleaner Plus icon
import Link from 'next/link';
import { useToast } from '@/components/ToastProvider'; 

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart, toggleCart } = useStore();
  const { products, fetchProducts } = useDB();
  const { showToast } = useToast(); 
  
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(''); // <--- NEW STATE
  const [activeImage, setActiveImage] = useState(''); 
  const [loading, setLoading] = useState(true);

  const product = products.find((p) => p.id === id);

  useEffect(() => {
    if (products.length === 0) fetchProducts();
    setLoading(false);
  }, [products, fetchProducts]);

  useEffect(() => {
    if (product && !activeImage) setActiveImage(product.images[0]);
  }, [product, activeImage]);

  const handleAddToCart = () => {
    if (!product) return;

    // ⚠️ VALIDATION: Must pick Color AND Size now
    if (!selectedColor) {
      showToast("Please select a color", "error"); 
      return;
    }
    if (!selectedSize) {
      showToast("Please select a size", "error"); 
      return;
    }

    addToCart({ 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        image: product.images[0], 
        size: selectedSize, 
        quantity: 1,
        // We can add color to the cart object if your store supports it, 
        // but for now we ensure they picked it.
    });

    showToast("Added to Cart", "success");
    toggleCart(); 
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white/50 animate-pulse">LOADING...</div>;
  if (!product) return <div className="min-h-screen bg-black flex items-center justify-center text-red-500">ITEM UNAVAILABLE</div>;

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
        
        {/* LEFT: VISUALS */}
        <div className="space-y-6">
            <div className="aspect-[4/5] bg-zinc-900 w-full relative overflow-hidden group border border-white/5">
                <img 
                    src={activeImage || product.images[0]} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
            </div>
            {/* Minimalist Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                    <div 
                        key={i} 
                        onClick={() => setActiveImage(img)}
                        className={`h-20 w-20 flex-shrink-0 bg-zinc-900 border cursor-pointer transition-all ${activeImage === img ? 'border-brand-neon opacity-100' : 'border-white/10 opacity-40 hover:opacity-100 hover:border-white'}`}
                    >
                        <img src={img} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
                    </div>
                ))}
            </div>
        </div>

        {/* RIGHT: DATA & CONTROLS */}
        <div className="flex flex-col h-full pt-4">
            <div className="sticky top-32">
                {/* Header */}
                <div className="mb-8 border-b border-white/10 pb-6">
                    <div className="flex justify-between items-start mb-4">
                        <Link href="/" className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 hover:text-white flex items-center gap-2 transition-colors">
                            <ArrowLeft size={10} /> Archives
                        </Link>
                        <button className="text-white/30 hover:text-white transition-colors"><Share2 size={18} /></button>
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl font-black uppercase italic leading-none mb-4 text-white">{product.name}</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-xl font-bold text-brand-neon font-mono">₦{product.price.toLocaleString()}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">/ {product.collection}</span>
                    </div>
                </div>

                <div className="prose prose-invert prose-sm mb-10">
                    <p className="text-white/60 leading-7 font-light text-sm">
                        {product.description || "Constructed from premium heavy-weight cotton. Designed in Nigeria. Engineered for the modern wilderness."}
                    </p>
                </div>

                {/* CONTROLS GRID */}
                <div className="space-y-8">
                    
                    {/* 1. COLOR SELECTOR */}
                    <div>
                        <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-3">Select Colorway</span>
                        <div className="flex flex-wrap gap-2">
                            {product.colors.map((c) => (
                                <button 
                                    key={c} 
                                    onClick={() => setSelectedColor(c)}
                                    className={`px-6 py-2 border text-[10px] font-bold uppercase tracking-widest transition-all ${selectedColor === c ? 'bg-white text-black border-white' : 'bg-transparent text-white border-white/20 hover:border-white'}`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 2. SIZE SELECTOR */}
                    <div>
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-3">
                            <span>Select Size</span>
                            <span className="cursor-pointer hover:text-white underline decoration-white/30 underline-offset-4">Fit Guide</span>
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                            {product.sizes.map((s) => (
                                <button 
                                    key={s} 
                                    onClick={() => setSelectedSize(s)}
                                    className={`h-10 border text-[10px] font-bold transition-all ${selectedSize === s ? 'bg-white text-black border-white' : 'border-white/20 text-white/60 hover:border-white hover:text-white'}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 3. ACTION BUTTON (Refined & Sleek) */}
                    <div className="pt-6">
                        <button 
                            onClick={handleAddToCart}
                            className="group w-full bg-brand-neon text-black font-black h-12 uppercase tracking-[0.25em] text-xs hover:bg-white transition-all flex items-center justify-between px-6"
                        >
                            <span>Add to Cart</span>
                            <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300"/>
                        </button>
                        
                        <div className="flex items-center justify-center gap-2 mt-4 text-[9px] text-white/20 uppercase tracking-[0.2em] font-bold">
                            <ShieldCheck size={10} /> Secured by Flutterwave
                        </div>
                    </div>

                </div>
            </div>
        </div>

      </div>
    </div>
  );
}