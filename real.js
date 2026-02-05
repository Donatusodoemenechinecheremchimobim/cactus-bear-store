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
  'app/product/[id]/page.tsx': `
"use client";
import { useEffect, useState } from 'react';
import { useDB, Product } from '@/store/useDB';
import { useStore } from '@/store/useStore';
import { useParams } from 'next/navigation';
import { ChevronLeft, ShoppingBag, Heart, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ProductPage() {
  const { id } = useParams();
  const { products, fetchProducts, toggleWishlist, wishlist } = useDB();
  const { addToCart, toggleCart } = useStore();
  
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const product = products.find(p => p.id === id);

  if (!product) return <div className="min-h-screen bg-black flex items-center justify-center text-brand-neon font-mono uppercase tracking-widest"><Loader2 className="animate-spin mr-2" /> Locating Asset...</div>;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    
    // ⚠️ THE FIX: Added 'color' to the object below
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor || product.colors[0] || 'Black', // Falls back to first color or Black
      quantity: 1
    });
    toggleCart();
  };

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 uppercase text-[10px] font-black tracking-widest">
            <ChevronLeft size={16} /> Return to Grid
        </Link>

        <div className="grid lg:grid-cols-2 gap-16">
          <div className="space-y-4">
            {product.images.map((img, idx) => (
              <div key={idx} className="aspect-square bg-zinc-900 border border-white/5 overflow-hidden">
                <img src={img} alt={product.name} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          <div className="lg:sticky lg:top-32 h-fit">
            <p className="text-brand-neon font-mono text-xs uppercase tracking-[0.3em] mb-4 italic">{product.collection} // {product.category}</p>
            <h1 className="text-5xl md:text-7xl font-black uppercase italic leading-none mb-6 tracking-tighter">{product.name}</h1>
            <p className="text-3xl font-mono text-white/90 mb-8 italic">₦{product.price.toLocaleString()}</p>
            
            <p className="text-sm text-white/50 leading-relaxed mb-12 max-w-md">{product.description}</p>

            <div className="space-y-10">
              {/* SIZE SELECT */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-4">Select Configuration (Size)</label>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map(size => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={\`px-6 py-3 border font-bold text-xs uppercase transition-all \${selectedSize === size ? 'bg-white text-black border-white' : 'border-white/10 text-white hover:border-white'}\`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* COLOR SELECT */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-4">Select Aesthetic (Color)</label>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map(color => (
                    <button 
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={\`px-6 py-3 border font-bold text-xs uppercase transition-all \${selectedColor === color ? 'bg-brand-neon text-black border-brand-neon' : 'border-white/10 text-white hover:border-white'}\`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-8">
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-brand-neon text-black font-black py-6 uppercase tracking-[0.2em] text-xs hover:bg-white transition-all flex items-center justify-center gap-3"
                >
                  <ShoppingBag size={18} /> Initialize Transfer
                </button>
                <button 
                  onClick={() => toggleWishlist(product.id)}
                  className={\`p-6 border transition-all \${wishlist.includes(product.id) ? 'bg-red-600 border-red-600 text-white' : 'border-white/10 text-white/40 hover:text-white hover:border-white'}\`}
                >
                  <Heart size={20} fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`
};

Object.keys(files).forEach((filePath) => { writeFile(filePath, files[filePath]); });

console.log("PRODUCT PAGE FIXED. Push to GitHub now.");