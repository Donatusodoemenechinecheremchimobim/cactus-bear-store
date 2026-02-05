"use client";
import { useState } from 'react';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, UserPlus, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/'); 
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2072')] bg-cover bg-center opacity-20 grayscale" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />

      <div className="relative z-10 w-full max-w-md bg-[#0a0a0a] border border-white/10 p-8 md:p-12 text-center shadow-[0_0_50px_rgba(255,255,255,0.05)]">
        <div className="flex justify-center mb-8">
            <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10 animate-pulse-slow">
                <ShieldCheck size={32} className="text-brand-neon" />
            </div>
        </div>
        
        <h1 className="text-3xl font-black uppercase italic mb-2">System Access</h1>
        <p className="text-white/40 font-mono text-xs uppercase tracking-widest mb-10">Secure Gateway</p>

        {error && (
            <div className="mb-6 bg-red-900/20 border border-red-500/50 p-4 flex items-center gap-3 text-red-200 text-xs text-left">
                <AlertCircle size={16} />
                <span>{error}</span>
            </div>
        )}

        <button 
            onClick={handleGoogleLogin}
            className="w-full bg-white text-black font-black uppercase tracking-[0.2em] py-4 text-xs hover:bg-brand-neon hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group"
        >
            <UserPlus size={16} />
            <span>Sign In with Google</span>
        </button>

        <div className="mt-8 border-t border-white/5 pt-6">
            <Link href="/" className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white flex items-center justify-center gap-2 transition-colors">
                <ArrowLeft size={14} /> Return to Store
            </Link>
        </div>
      </div>
    </div>
  );
}