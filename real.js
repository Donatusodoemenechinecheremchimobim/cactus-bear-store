const fs = require('fs');
const path = require('path');

const rootDir = process.cwd(); 

const writeFile = (filePath, content) => {
  const absolutePath = path.join(rootDir, filePath);
  const dir = path.dirname(absolutePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(absolutePath, content.trim());
  console.log("Successfully Synchronized: " + filePath);
};

const files = {
  // 1. THE DATABASE STORE
  'store/useDB.ts': `
import { create } from 'zustand';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, getDoc, setDoc } from 'firebase/firestore';

export interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  collection: string;
  description: string;
  sizes: string[];
  colors: string[];
  status: string;
}

interface DBState {
  products: Product[];
  settings: { nextDrop: string; announcement: string }; 
  wishlist: string[];
  loading: boolean;
  fetchProducts: () => Promise<void>;
  fetchSettings: () => Promise<void>;
  updateSettings: (data: any) => Promise<void>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addProduct: (data: Omit<Product, 'id'>) => Promise<void>;
  toggleWishlist: (id: string) => void;
}

export const useDB = create<DBState>((set, get) => ({
  products: [],
  settings: { nextDrop: '', announcement: '' },
  wishlist: [],
  loading: false,
  fetchProducts: async () => {
    set({ loading: true });
    try {
      const snap = await getDocs(collection(db, "products"));
      const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
      set({ products: items, loading: false });
    } catch (e) { set({ loading: false }); }
  },
  fetchSettings: async () => {
    const snap = await getDoc(doc(db, "settings", "general"));
    if (snap.exists()) set({ settings: snap.data() as any });
  },
  updateSettings: async (data) => {
    await setDoc(doc(db, "settings", "general"), data, { merge: true });
    set({ settings: data });
  },
  updateProduct: async (id, data) => {
    await updateDoc(doc(db, "products", id), data);
    await get().fetchProducts(); 
  },
  deleteProduct: async (id) => {
    await deleteDoc(doc(db, "products", id));
    await get().fetchProducts();
  },
  addProduct: async (data) => {
    await addDoc(collection(db, "products"), data);
    await get().fetchProducts();
  },
  toggleWishlist: (id) => set((s) => ({
    wishlist: s.wishlist.includes(id) ? s.wishlist.filter(i => i !== id) : [...s.wishlist, id]
  })),
}));
`,

  // 2. THE ADMIN PAGE
  'app/admin/page.tsx': `
"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDB, Product } from '@/store/useDB';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Save, X, Edit2, Loader2, Package, Clock, ShieldAlert } from 'lucide-react';

const ADMIN_EMAIL = "chibundusadiq@gmail.com";

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const { products, fetchProducts, deleteProduct, addProduct, settings, updateSettings, fetchSettings } = useDB();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('inventory');
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
          description: 'Admin'
      });
      alert('Product Deployed');
  };

  if (authLoading || !user) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-black text-white pt-32 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black uppercase italic text-brand-neon mb-12">Command Center</h1>
        
        <div className="grid md:grid-cols-2 gap-12">
            <form onSubmit={handleAdd} className="space-y-4 bg-zinc-900/50 p-6 border border-white/10">
                <input placeholder="Name" className="w-full bg-black border border-white/10 p-3 text-sm" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                <input placeholder="Price" type="number" className="w-full bg-black border border-white/10 p-3 text-sm" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                <textarea placeholder="Image Links (comma separated)" className="w-full bg-black border border-white/10 p-3 text-sm h-32" value={newProduct.images} onChange={e => setNewProduct({...newProduct, images: e.target.value})} />
                <button className="w-full bg-brand-neon text-black font-black py-4 uppercase text-xs">Deploy Asset</button>
            </form>

            <div className="space-y-2">
                {products.map(p => (
                    <div key={p.id} className="p-4 border border-white/5 bg-zinc-900/20 flex justify-between items-center">
                        <span className="text-xs font-bold uppercase tracking-widest">{p.name}</span>
                        <button onClick={() => deleteProduct(p.id)} className="text-red-500/50 hover:text-red-500"><Trash2 size={16}/></button>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
`
};

Object.keys(files).forEach((filePath) => { writeFile(filePath, files[filePath]); });

console.log("REPAIR COMPLETE. Run your git commands now.");