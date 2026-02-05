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
  'components/CartDrawer.tsx': `
"use client";
import { useStore } from '@/store/useStore';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartDrawer() {
  const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity } = useStore();
  
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={toggleCart} />
      
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md">
          <div className="h-full flex flex-col bg-black border-l border-white/10 shadow-2xl">
            
            {/* Header */}
            <div className="px-6 py-8 border-b border-white/5 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black uppercase italic text-white leading-none">Your Stash</h2>
                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mt-1">{cart.length} UNITS LOADED</p>
                </div>
                <button onClick={toggleCart} className="p-2 hover:bg-white/5 transition-colors text-white/50 hover:text-white">
                    <X size={24} />
                </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 scrollbar-hide">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-20">
                    <ShoppingBag size={48} />
                    <p className="font-mono text-[10px] uppercase tracking-widest text-center">Empty Inventory // System Idle</p>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-4 bg-white/5 border border-white/5 hover:border-brand-neon/30 transition-colors group">
                    {/* FIXED LINE BELOW: Changed item.images[0] to item.image */}
                    <div className="w-24 h-24 bg-white/5 bg-cover bg-center" style={{ backgroundImage: \`url(\${item.image})\` }} />
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold uppercase text-white leading-none mb-1 text-sm">{item.name}</h3>
                        <p className="text-[10px] font-mono text-brand-neon uppercase tracking-tighter italic">{item.size} // ₦{item.price.toLocaleString()}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-white/10">
                            <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)} className="p-1 hover:text-brand-neon"><Minus size={12} /></button>
                            <span className="px-3 text-xs font-mono">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)} className="p-1 hover:text-brand-neon"><Plus size={12} /></button>
                        </div>
                        <button onClick={() => removeFromCart(item.id, item.size)} className="text-white/20 hover:text-red-500 transition-colors">
                            <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
                <div className="px-6 py-8 border-t border-white/10 bg-zinc-900/20">
                    <div className="flex justify-between items-end mb-6">
                        <span className="text-[10px] font-black uppercase text-white/40 tracking-[0.3em]">Total Value</span>
                        <span className="text-2xl font-black text-brand-neon font-mono italic">₦{total.toLocaleString()}</span>
                    </div>
                    <Link 
                        href="/checkout" 
                        onClick={toggleCart}
                        className="w-full bg-brand-neon text-black font-black py-5 uppercase tracking-[0.2em] text-xs hover:bg-white transition-all flex items-center justify-center gap-3 group"
                    >
                        Initialize Checkout <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
`
};

Object.keys(files).forEach((filePath) => { writeFile(filePath, files[filePath]); });

console.log("REPAIR COMPLETE. Push to GitHub now.");