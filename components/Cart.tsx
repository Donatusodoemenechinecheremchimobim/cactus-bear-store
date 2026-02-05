"use client";
import { useStore } from '@/store/useStore';
import { X, Trash2, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Cart() {
  const { cart, removeFromCart, toggleCart, isCartOpen, currency } = useStore();
  const router = useRouter();
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={toggleCart} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]" 
          />
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/10 z-[70] p-6 flex flex-col"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black uppercase italic">Cart ({cart.length})</h2>
              <button onClick={toggleCart}><X className="hover:text-brand-neon" /></button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              {cart.length === 0 ? (
                <p className="text-white/30 font-mono text-xs uppercase">No Items Deployed.</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id + item.size} className="flex gap-4 bg-black p-3 border border-white/5">
                    <div className="h-20 w-20 bg-cover bg-center bg-zinc-900" style={{backgroundImage: `url(${item.image})`}} />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold uppercase text-sm">{item.name}</h3>
                        <p className="text-[10px] text-white/50 font-mono">Size: {item.size} | Qty: {item.quantity}</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="font-mono font-bold text-brand-neon">₦{(item.price * item.quantity).toLocaleString()}</span>
                        <button onClick={() => removeFromCart(item.id, item.size)} className="text-white/20 hover:text-red-500"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-white/10 pt-6 mt-4">
                <div className="flex justify-between text-lg font-black uppercase italic mb-6">
                  <span>Total</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
                <button 
                    onClick={() => { toggleCart(); router.push('/checkout'); }}
                    className="w-full bg-brand-neon text-black py-4 font-black uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2"
                >
                    <CreditCard size={18} /> Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}