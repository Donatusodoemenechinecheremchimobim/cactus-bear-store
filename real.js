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
  // 1. THE BRAIN (Store) - Added EVERYTHING needed
  'store/useStore.ts': `
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

interface StoreState {
  cart: CartItem[];
  isCartOpen: boolean;
  toggleCart: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  replaceCart: (newCart: CartItem[]) => void;
  clearCart: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      cart: [],
      isCartOpen: false,
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      addToCart: (item) => set((state) => {
        const existing = state.cart.find(i => i.id === item.id && i.size === item.size);
        if (existing) {
          return { cart: state.cart.map(i => i.id === item.id && i.size === item.size ? { ...i, quantity: i.quantity + 1 } : i)};
        }
        return { cart: [...state.cart, item] };
      }),
      removeFromCart: (id, size) => set((state) => ({
        cart: state.cart.filter((i) => !(i.id === id && i.size === size)),
      })),
      updateQuantity: (id, size, quantity) => set((state) => ({
        cart: state.cart.map((item) => item.id === id && item.size === size ? { ...item, quantity: Math.max(0, quantity) } : item).filter(item => item.quantity > 0)
      })),
      replaceCart: (newCart) => set({ cart: newCart }),
      clearCart: () => set({ cart: [] }),
    }),
    { name: 'cactus-bear-storage' }
  )
);
`,

  // 2. THE ADMIN PAGE - Cleaned up duplicates and old names
  'app/admin/page.tsx': `
"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDB, Product } from '@/store/useDB';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Loader2, ShieldAlert } from 'lucide-react';

const ADMIN_EMAIL = "chibundusadiq@gmail.com";

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const { products, fetchProducts, deleteProduct, addProduct, fetchSettings } = useDB();
  const router = useRouter();
  
  const [newProduct, setNewProduct] = useState({
      name: '', price: '', category: 'clothes', collection: 'Utopia', 
      images: '', status: 'available', sizes: 'S, M, L, XL', colors: 'Black'
  });

  useEffect(() => {
    if (!authLoading && (!user || user.email !== ADMIN_EMAIL)) {
        router.push('/');
    } else if (user) {
        fetchProducts();
        fetchSettings();
    }
  }, [user, authLoading, router]);

  const handleAdd = async (e: any) => {
      e.preventDefault();
      await addProduct({
          ...newProduct,
          price: Number(newProduct.price),
          images: newProduct.images.split(',').map(s => s.trim()),
          sizes: newProduct.sizes.split(',').map(s => s.trim()),
          colors: newProduct.colors.split(',').map(s => s.trim()),
          description: 'Admin Deployment'
      });
      alert('Asset Deployed');
  };

  if (authLoading || !user) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-black text-white pt-32 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black uppercase italic text-brand-neon mb-12">Command Center</h1>
        <div className="grid md:grid-cols-2 gap-12">
            <form onSubmit={handleAdd} className="space-y-4 bg-zinc-900/50 p-6 border border-white/10">
                <input placeholder="Name" className="w-full bg-black border border-white/10 p-3 text-sm" onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                <input placeholder="Price" type="number" className="w-full bg-black border border-white/10 p-3 text-sm" onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                <textarea placeholder="Image URLs" className="w-full bg-black border border-white/10 p-3 text-sm h-32" onChange={e => setNewProduct({...newProduct, images: e.target.value})} />
                <button className="w-full bg-brand-neon text-black font-black py-4 uppercase text-xs">Deploy Asset</button>
            </form>
            <div className="space-y-2">
                {products.map(p => (
                    <div key={p.id} className="p-4 border border-white/5 bg-zinc-900/20 flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase">{p.name}</span>
                        <button onClick={() => deleteProduct(p.id)} className="text-red-500/50 hover:text-red-500"><Trash2 size={16}/></button>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
`,

  // 3. CART SYNC - Now matches the Store
  'components/CartSync.tsx': `
"use client";
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useStore } from '@/store/useStore';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function CartSync() {
  const { user } = useAuth();
  const { cart, replaceCart } = useStore();

  useEffect(() => {
    const syncDown = async () => {
      if (user) {
        const docRef = doc(db, 'carts', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          replaceCart(docSnap.data().items);
        }
      }
    };
    syncDown();
  }, [user, replaceCart]);

  useEffect(() => {
    const syncUp = async () => {
      if (user && cart.length > 0) {
        await setDoc(doc(db, 'carts', user.uid), { items: cart });
      }
    };
    syncUp();
  }, [cart, user]);

  return null;
}
`
};

Object.keys(files).forEach((filePath) => { writeFile(filePath, files[filePath]); });
console.log("TOTAL FIX COMPLETE. PUSH NOW.");