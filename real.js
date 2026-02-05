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
  'components/Cart.tsx': `
"use client";
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { X, Trash2, ShoppingBag } from 'lucide-react';

export default function Cart() {
  // ⚠️ THE FIX: Removed 'currency' from the list below
  const { cart, removeFromCart, toggleCart, isCartOpen } = useStore();
  const router = useRouter();
  
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={toggleCart} />
      
      <div className="relative w-full max-w-md bg-black border-l border-white/10 h-full flex flex-col shadow-2xl">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-black uppercase italic text-brand-neon">Current Stash</h2>
          <button onClick={toggleCart} className="text-white/50 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-white/20 uppercase font-mono text-xs tracking-widest gap-4">
              <ShoppingBag size={40} />
              <p>Inventory Empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={\`\${item.id}-\${item.size}\`} className="flex gap-4 bg-zinc-900/50 p-4 border border-white/5 group">
                <div className="w-20 h-20 bg-zinc-800 bg-cover bg-center" style={{ backgroundImage: \`url(\${item.image})\` }} />
                <div className="flex-1">
                  <h3 className="font-bold uppercase text-sm leading-tight mb-1">{item.name}</h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">{item.size} // {item.quantity} units</p>
                  <p className="text-brand-neon font-mono text-xs font-bold">₦{item.price.toLocaleString()}</p>
                </div>
                <button onClick={() => removeFromCart(item.id, item.size)} className="text-white/20 hover:text-red-500 self-start transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-zinc-900/30">
            <div className="flex justify-between items-end mb-6">
              <span className="text-[10px] uppercase font-black text-white/40 tracking-widest">Subtotal</span>
              <span className="text-2xl font-black text-white italic">₦{total.toLocaleString()}</span>
            </div>
            <button 
              onClick={() => { toggleCart(); router.push('/checkout'); }}
              className="w-full bg-white text-black font-black py-4 uppercase tracking-[0.2em] text-xs hover:bg-brand-neon transition-all"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
`
};

Object.keys(files).forEach((filePath) => { writeFile(filePath, files[filePath]); });

console.log("CART UI FIXED. Run git push now.");