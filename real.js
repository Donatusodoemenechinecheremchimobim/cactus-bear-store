const fs = require('fs');
const path = require('path');

const rootDir = process.cwd(); 

const writeFile = (filePath, content) => {
  const absolutePath = path.join(rootDir, filePath);
  const dir = path.dirname(absolutePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(absolutePath, content.trim());
  console.log("Aligned: " + filePath);
};

const files = {
  // 1. CLEAN CHECKOUT PAGE (Removing the broken useToast)
  'app/checkout/page.tsx': `
"use client";
import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { ChevronLeft, Lock, Truck, CreditCard, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { cart, clearCart } = useStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate Processing
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      clearCart();
    }, 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <CheckCircle2 size={80} className="text-brand-neon mb-6 animate-bounce" />
        <h1 className="text-4xl font-black uppercase italic text-white mb-4">Order Received</h1>
        <p className="text-white/40 font-mono text-xs uppercase tracking-widest max-w-xs mb-10">
          Your assets are being prepared for deployment. Check your email for tracking data.
        </p>
        <Link href="/" className="bg-white text-black font-black px-10 py-4 uppercase text-xs tracking-widest hover:bg-brand-neon transition-colors">
          Return to Base
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 uppercase text-[10px] font-black tracking-widest">
            <ChevronLeft size={16} /> Edit Stash
        </Link>

        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7">
            <h2 className="text-3xl font-black uppercase italic mb-10 text-brand-neon">Shipping Protocol</h2>
            <form onSubmit={handleOrder} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input required placeholder="FIRST NAME" className="w-full bg-transparent border-b border-white/20 py-4 text-xs outline-none focus:border-brand-neon transition-colors uppercase font-bold" />
                <input required placeholder="LAST NAME" className="w-full bg-transparent border-b border-white/20 py-4 text-xs outline-none focus:border-brand-neon transition-colors uppercase font-bold" />
              </div>
              <input required type="email" placeholder="EMAIL ADDRESS" className="w-full bg-transparent border-b border-white/20 py-4 text-xs outline-none focus:border-brand-neon transition-colors uppercase font-bold" />
              <input required placeholder="SHIPPING ADDRESS" className="w-full bg-transparent border-b border-white/20 py-4 text-xs outline-none focus:border-brand-neon transition-colors uppercase font-bold" />
              
              <div className="pt-10">
                <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-3">
                    <CreditCard size={18} className="text-brand-neon" /> Payment Method
                </h3>
                <div className="p-6 border border-brand-neon bg-brand-neon/5 flex justify-between items-center group">
                    <span className="text-[10px] font-bold uppercase tracking-widest">Pay on Delivery / Bank Transfer</span>
                    <CheckCircle2 size={20} className="text-brand-neon" />
                </div>
              </div>

              <button 
                disabled={loading || cart.length === 0}
                className="w-full bg-white text-black font-black py-6 uppercase tracking-[0.3em] text-xs hover:bg-brand-neon transition-all mt-10 disabled:opacity-20"
              >
                {loading ? 'PROCESSING...' : 'CONFIRM ORDER'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-zinc-900/50 border border-white/5 p-8 sticky top-32">
              <h3 className="text-xs font-black uppercase tracking-widest mb-8 text-white/40">Order Summary</h3>
              <div className="space-y-4 mb-8">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-white/60">{item.quantity}x {item.name} ({item.size})</span>
                    <span className="font-mono">₦{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-6 space-y-2">
                <div className="flex justify-between text-[10px] uppercase font-bold text-white/40">
                    <span>Shipping</span>
                    <span>Calculated at next step</span>
                </div>
                <div className="flex justify-between items-end pt-4">
                    <span className="text-xs font-black uppercase italic">Total</span>
                    <span className="text-2xl font-black text-brand-neon font-mono">₦{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`,

  // 2. LAYOUT RE-SYNC
  'app/layout.tsx': `
import './globals.css';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import Radar from '@/components/Radar';
import CartSync from '@/components/CartSync';

export const metadata = {
  title: 'CACTUS BEAR | UTOPIA',
  description: 'High-end streetwear for the digital age.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased selection:bg-brand-neon selection:text-black">
        <CartSync />
        <Navbar />
        <CartDrawer />
        <Radar />
        <main>{children}</main>
      </body>
    </html>
  );
}
`
};

Object.keys(files).forEach((filePath) => { writeFile(filePath, files[filePath]); });

console.log("CHECKOUT ERROR ELIMINATED. Run git push now.");