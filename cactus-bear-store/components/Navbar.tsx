"use client";
import { ShoppingBag, User, Menu, X, Globe } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Logo from './Logo';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => setMounted(true), []);
  const { cart, toggleCart, currency, toggleCurrency } = useStore();
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/85 backdrop-blur-md border-b border-white/5 transition-all duration-300">
      <div className="px-6 py-5 flex justify-between items-center max-w-[1920px] mx-auto">
        <Link href="/"><Logo /></Link>
        
        {/* DESKTOP MENU - UPDATED: REMOVED CARTEL, ADDED SEASON 001 */}
        <div className="hidden lg:flex items-center gap-12 text-lg font-black uppercase tracking-[0.15em] text-white">
          <Link href="/manifesto" className="hover:text-brand-neon hover:scale-105 transition-all decoration-brand-neon underline-offset-8 hover:underline">Manifesto</Link>
          <Link href="/collection/utopia" className="hover:text-brand-neon hover:scale-105 transition-all decoration-brand-neon underline-offset-8 hover:underline text-brand-neon">Season 001</Link>
          <Link href="/collections" className="hover:text-brand-neon hover:scale-105 transition-all decoration-brand-neon underline-offset-8 hover:underline">Archives</Link>
          <Link href="/wishlist" className="hover:text-brand-neon hover:scale-105 transition-all decoration-brand-neon underline-offset-8 hover:underline">Wishlist</Link>
        </div>

        <div className="flex items-center gap-6">
          {/* CURRENCY */}
          <button onClick={toggleCurrency} className="hidden md:flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors">
            <Globe size={14}/> {currency}
          </button>

          {/* AUTH */}
          {session ? (
            <div className="group relative hidden md:block">
               <Link href={(session.user as any).role === 'admin' ? '/admin' : '/#'} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-neon border border-brand-neon/50 px-4 py-2 hover:bg-brand-neon hover:text-black transition-all">
                 <User className="w-3 h-3" />
                 <span>{session.user?.name?.split(' ')[0]}</span>
               </Link>
               <div className="absolute right-0 top-full pt-2 hidden group-hover:block w-32">
                 <button onClick={() => signOut()} className="w-full bg-white text-black px-4 py-3 text-xs font-black uppercase hover:bg-red-600 hover:text-white transition-colors">Log Out</button>
               </div>
             </div>
          ) : (
            <Link href="/login" className="hidden md:block text-xs font-black uppercase tracking-widest hover:text-brand-neon transition-colors">Log In</Link>
          )}

          {/* CART */}
          <button onClick={toggleCart} className="relative group p-1">
            <ShoppingBag className="w-7 h-7 text-white group-hover:text-brand-neon transition-colors" strokeWidth={2} />
            {mounted && cart.length > 0 && <span className="absolute -top-1 -right-1 bg-brand-neon text-black text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full animate-pulse">{cart.length}</span>}
          </button>
          
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-white"><Menu size={28} /></button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col p-8">
          <div className="flex justify-between items-center mb-12">
            <Logo />
            <button onClick={() => setMobileOpen(false)}><X className="text-white w-8 h-8" /></button>
          </div>
          <div className="flex flex-col gap-8 text-4xl font-black uppercase italic tracking-tighter text-white/50">
             <Link href="/manifesto" className="hover:text-white" onClick={() => setMobileOpen(false)}>Manifesto</Link>
             <Link href="/collection/utopia" className="text-brand-neon hover:text-white" onClick={() => setMobileOpen(false)}>Season 001</Link>
             <Link href="/collections" className="hover:text-white" onClick={() => setMobileOpen(false)}>Archives</Link>
             <Link href="/wishlist" className="hover:text-white" onClick={() => setMobileOpen(false)}>Wishlist</Link>
             <button onClick={() => { toggleCurrency(); setMobileOpen(false); }} className="text-left hover:text-white uppercase text-xl mt-4">Currency: {currency}</button>
          </div>
        </div>
      )}
    </nav>
  );
}