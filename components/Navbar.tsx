"use client";
import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/hooks/useAuth';
import { useDB } from '@/store/useDB';
import Link from 'next/link';
import { ShoppingBag, Menu, X, User, Zap, Heart } from 'lucide-react';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // ⚠️ CLEANUP: Destructuring only what exists in the Store
  const { cart, toggleCart } = useStore();
  const { user } = useAuth();
  const { wishlist } = useDB();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <nav className="fixed top-0 left-0 w-full z-[90] bg-black/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-neon rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
                <Zap size={18} className="text-black" fill="black" />
            </div>
            <span className="text-xl font-black uppercase italic tracking-tighter text-white group-hover:text-brand-neon transition-colors">CACTUS BEAR</span>
        </Link>

        {/* Icons */}
        <div className="flex items-center gap-6">
          <Link href="/wishlist" className="relative text-white/50 hover:text-white transition-colors">
            <Heart size={20} />
            {wishlist.length > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />}
          </Link>
          
          <button onClick={toggleCart} className="relative group p-2">
            <ShoppingBag size={22} className="text-white/50 group-hover:text-brand-neon transition-colors" />
            {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-brand-neon text-black text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {cart.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
            )}
          </button>

          <Link href={user ? "/profile" : "/login"} className="text-white/50 hover:text-white transition-colors">
            <User size={22} />
          </Link>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
}