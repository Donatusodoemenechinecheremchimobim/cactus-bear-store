"use client";
import { ShoppingBag, User, Menu, X, Globe, Archive } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/hooks/useAuth';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => setMounted(true), []);
  const { cart, toggleCart, currency, toggleCurrency } = useStore();
  const { user } = useAuth(); 

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [mobileOpen]);

  const handleSignOut = async () => {
      await signOut(auth);
      window.location.reload();
  };

  return (
    <>
    <nav className="fixed top-0 w-full z-50 bg-black/85 backdrop-blur-md border-b border-white/5 transition-all duration-300 h-20">
      <div className="px-6 h-full flex justify-between items-center max-w-[1920px] mx-auto">
        <Link href="/" className="z-50 relative"><Logo /></Link>
        
        <div className="hidden lg:flex items-center gap-12 text-lg font-black uppercase tracking-[0.15em] text-white">
          <Link href="/manifesto" className="hover:text-brand-neon hover:scale-105 transition-all decoration-brand-neon underline-offset-8 hover:underline">Manifesto</Link>
          <Link href="/collection/utopia" className="hover:text-brand-neon hover:scale-105 transition-all decoration-brand-neon underline-offset-8 hover:underline">Season 001</Link>
          <Link href="/collections" className="hover:text-brand-neon hover:scale-105 transition-all decoration-brand-neon underline-offset-8 hover:underline">Archives</Link>
          <Link href="/wishlist" className="hover:text-brand-neon hover:scale-105 transition-all decoration-brand-neon underline-offset-8 hover:underline">Wishlist</Link>
        </div>

        <div className="flex items-center gap-6 z-50 relative">
          <button onClick={toggleCurrency} className="hidden md:flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors">
            <Globe size={14}/> {currency}
          </button>

          {user ? (
            <div className="group relative hidden md:block">
               <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-neon border border-brand-neon/50 px-4 py-2 hover:bg-brand-neon hover:text-black transition-all cursor-pointer">
                 <User className="w-3 h-3" />
                 <span>{user.displayName?.split(' ')[0] || 'User'}</span>
               </div>
               <div className="absolute right-0 top-full pt-2 hidden group-hover:block w-40">
                 <div className="bg-[#0a0a0a] border border-white/10 flex flex-col">
                    {user.email === 'chibundusadiq@gmail.com' && (
                        <Link href="/admin" className="px-4 py-3 text-xs font-bold uppercase hover:bg-white/5 text-left border-b border-white/5">Admin Panel</Link>
                    )}
                    <Link href="/orders" className="px-4 py-3 text-xs font-bold uppercase hover:bg-white/5 text-left border-b border-white/5">My Archives</Link>
                    <button onClick={handleSignOut} className="w-full text-left bg-red-900/20 text-red-400 px-4 py-3 text-xs font-black uppercase hover:bg-red-600 hover:text-white transition-colors">Log Out</button>
                 </div>
               </div>
             </div>
          ) : (
            <Link href="/login" className="hidden md:block text-xs font-black uppercase tracking-widest hover:text-brand-neon transition-colors">Log In</Link>
          )}

          <button onClick={toggleCart} className="relative group p-1">
            <ShoppingBag className="w-7 h-7 text-white group-hover:text-brand-neon transition-colors" strokeWidth={2} />
            {mounted && cart.length > 0 && <span className="absolute -top-1 -right-1 bg-brand-neon text-black text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full animate-pulse">{cart.length}</span>}
          </button>
          
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-white transition-transform active:scale-90">
             {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
    </nav>

    {/* MOBILE MENU */}
    <AnimatePresence>
      {mobileOpen && (
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-40 flex flex-col pt-32 px-8"
        >
          <div className="flex flex-col gap-8 text-4xl font-black uppercase italic tracking-tighter text-white/50">
             <Link href="/manifesto" className="hover:text-white transition-colors" onClick={() => setMobileOpen(false)}>Manifesto</Link>
             <Link href="/collection/utopia" className="hover:text-brand-neon transition-colors" onClick={() => setMobileOpen(false)}>Season 001</Link>
             <Link href="/collections" className="hover:text-white transition-colors" onClick={() => setMobileOpen(false)}>Archives</Link>
             <Link href="/wishlist" className="hover:text-white transition-colors" onClick={() => setMobileOpen(false)}>Wishlist</Link>
             
             {user && <Link href="/orders" className="text-brand-neon hover:text-white transition-colors" onClick={() => setMobileOpen(false)}>My Orders</Link>}

             <div className="mt-8 border-t border-white/10 pt-8 flex flex-col gap-4">
                 {!user && <Link href="/login" onClick={() => setMobileOpen(false)} className="text-left hover:text-white uppercase text-sm font-mono tracking-widest">Operator Login</Link>}
                 {user && <button onClick={handleSignOut} className="text-left text-red-500 uppercase text-sm font-mono tracking-widest">Sign Out</button>}
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}