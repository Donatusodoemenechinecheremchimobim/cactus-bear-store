const fs = require('fs');
const path = require('path');

// FORCE UPDATE IN CURRENT FOLDER
const rootDir = process.cwd(); 
console.log(`\x1b[35m🌵 FIXING VERCEL TYPE ERROR in: ${rootDir}...\x1b[0m`);

const writeFile = (filePath, content) => {
  const absolutePath = path.join(rootDir, filePath);
  const dir = path.dirname(absolutePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(absolutePath, content.trim());
  console.log(`\x1b[32m  -> Updated: ${filePath}\x1b[0m`);
};

const files = {
  // ==========================================
  // 1. UPDATE THE BLUEPRINT (Add 'status')
  // ==========================================
  'store/useDB.ts': `
import { create } from 'zustand';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';

// ⚠️ THE FIX: Added 'status' to this list
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
  status: string; // <--- ADDED THIS LINE
}

interface DBState {
  products: Product[];
  loading: boolean;
  fetchProducts: () => Promise<void>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addProduct: (data: Omit<Product, 'id'>) => Promise<void>;
}

export const useDB = create<DBState>((set, get) => ({
  products: [],
  loading: false,

  fetchProducts: async () => {
    set({ loading: true });
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const products = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      set({ products, loading: false });
    } catch (error) {
      console.error("Fetch failed:", error);
      set({ loading: false });
    }
  },

  updateProduct: async (id, data) => {
    try {
      const productRef = doc(db, "products", id);
      await updateDoc(productRef, data);
      await get().fetchProducts(); 
    } catch (error) {
      console.error("Update failed:", error);
    }
  },

  deleteProduct: async (id) => {
    try {
      await deleteDoc(doc(db, "products", id));
      await get().fetchProducts();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  },

  addProduct: async (data) => {
    try {
      await addDoc(collection(db, "products"), data);
      await get().fetchProducts();
    } catch (error) {
      console.error("Add failed:", error);
    }
  }
}));
`,

// ==========================================
// 2. UPDATE ADMIN PAGE (To match the new blueprint)
// ==========================================
'app/admin/page.tsx': `
"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDB, Product } from '@/store/useDB';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Save, X, Edit2, Loader2, Package } from 'lucide-react';

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const { products, fetchProducts, updateProduct, deleteProduct, addProduct } = useDB();
  const router = useRouter();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState({
      name: '', price: 0, category: 'Tees', collection: 'Utopia', 
      images: '', description: '', status: 'Available', sizes: 'S,M,L,XL', colors: 'Black'
  });

  useEffect(() => {
    if (!authLoading && (!user || user.email !== 'chibundusadiq@gmail.com')) {
        router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSave = async (id: string) => {
      await updateProduct(id, editForm);
      setEditingId(null);
  };

  const handleAdd = async () => {
      // ⚠️ FIX: Ensure all fields match the Product type
      await addProduct({
          name: newProduct.name,
          price: Number(newProduct.price),
          images: newProduct.images.split(',').map(s => s.trim()),
          category: newProduct.category,
          collection: newProduct.collection,
          description: newProduct.description,
          status: newProduct.status,
          sizes: newProduct.sizes.split(',').map(s => s.trim()),
          colors: newProduct.colors.split(',').map(s => s.trim())
      });
      setIsAdding(false);
      setNewProduct({ name: '', price: 0, category: 'Tees', collection: 'Utopia', images: '', description: '', status: 'Available', sizes: 'S,M,L,XL', colors: 'Black' });
  };

  if (authLoading || !user) return <div className="min-h-screen bg-black flex items-center justify-center text-brand-neon"><Loader2 className="animate-spin"/></div>;

  return (
    <div className="min-h-screen bg-black text-white pt-32 px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-6">
            <div>
                <h1 className="text-4xl font-black uppercase italic text-brand-neon mb-2">Command Center</h1>
                <p className="text-xs font-mono text-white/50 uppercase tracking-widest">Inventory Management Protocol</p>
            </div>
            <button onClick={() => setIsAdding(true)} className="bg-white text-black px-6 py-3 font-bold uppercase text-xs tracking-widest hover:bg-brand-neon transition-colors flex items-center gap-2">
                <Plus size={16} /> New Asset
            </button>
        </div>

        {/* ADD NEW PRODUCT FORM */}
        {isAdding && (
            <div className="bg-[#0a0a0a] border border-brand-neon/50 p-8 mb-12 relative animate-in fade-in slide-in-from-top-4">
                <button onClick={() => setIsAdding(false)} className="absolute top-4 right-4 text-white/30 hover:text-white"><X size={20}/></button>
                <h3 className="text-xl font-bold uppercase text-white mb-6 flex items-center gap-2"><Package size={20}/> Deploy New Product</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="col-span-2 md:col-span-1">
                        <label className="text-[10px] uppercase font-bold text-white/40 mb-2 block">Name</label>
                        <input className="w-full bg-black border border-white/20 p-3 text-sm text-white focus:border-brand-neon outline-none" placeholder="Product Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-[10px] uppercase font-bold text-white/40 mb-2 block">Price (NGN)</label>
                        <input type="number" className="w-full bg-black border border-white/20 p-3 text-sm text-white focus:border-brand-neon outline-none" placeholder="0" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} />
                    </div>
                    <div>
                        <label className="text-[10px] uppercase font-bold text-white/40 mb-2 block">Status</label>
                        <select className="w-full bg-black border border-white/20 p-3 text-sm text-white focus:border-brand-neon outline-none" value={newProduct.status} onChange={e => setNewProduct({...newProduct, status: e.target.value})}>
                            <option value="Available">Available</option>
                            <option value="Sold Out">Sold Out</option>
                            <option value="Pre-Order">Pre-Order</option>
                        </select>
                    </div>
                    <div className="col-span-2">
                        <label className="text-[10px] uppercase font-bold text-white/40 mb-2 block">Image Links (Comma Separated)</label>
                        <input className="w-full bg-black border border-white/20 p-3 text-sm text-white focus:border-brand-neon outline-none font-mono" placeholder="https://..., https://..." value={newProduct.images} onChange={e => setNewProduct({...newProduct, images: e.target.value})} />
                    </div>
                    <div className="col-span-2">
                        <label className="text-[10px] uppercase font-bold text-white/40 mb-2 block">Description</label>
                        <textarea className="w-full bg-black border border-white/20 p-3 text-sm text-white focus:border-brand-neon outline-none h-24" placeholder="Product details..." value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                    </div>
                </div>
                <button onClick={handleAdd} className="mt-6 w-full bg-brand-neon text-black font-black py-4 uppercase tracking-[0.2em] hover:bg-white transition-colors">Confirm Deployment</button>
            </div>
        )}

        {/* PRODUCT LIST */}
        <div className="space-y-4">
            {products.map((product) => (
                <div key={product.id} className="bg-[#0a0a0a] border border-white/5 p-6 flex flex-col md:flex-row items-center gap-6 group hover:border-white/20 transition-all">
                    <div className="h-16 w-16 bg-zinc-900 bg-cover bg-center border border-white/10" style={{backgroundImage: \`url(\${product.images[0]})\`}}></div>
                    
                    <div className="flex-1 w-full">
                        {editingId === product.id ? (
                            <div className="grid grid-cols-2 gap-4">
                                <input className="bg-black border border-brand-neon p-2 text-white" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} />
                                <input className="bg-black border border-brand-neon p-2 text-white" type="number" value={editForm.price} onChange={(e) => setEditForm({...editForm, price: Number(e.target.value)})} />
                            </div>
                        ) : (
                            <div>
                                <h3 className="text-xl font-bold uppercase italic">{product.name}</h3>
                                <p className="text-brand-neon font-mono text-sm">₦{product.price.toLocaleString()}</p>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {editingId === product.id ? (
                            <button onClick={() => handleSave(product.id)} className="bg-green-600 text-white p-3 hover:bg-green-500"><Save size={18} /></button>
                        ) : (
                            <button onClick={() => { setEditingId(product.id); setEditForm(product); }} className="bg-white/5 text-white p-3 hover:bg-white/20"><Edit2 size={18} /></button>
                        )}
                        <button onClick={() => deleteProduct(product.id)} className="bg-red-900/20 text-red-500 p-3 hover:bg-red-600 hover:text-white"><Trash2 size={18} /></button>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
`
};

Object.keys(files).forEach((filePath) => { writeFile(filePath, files[filePath]); });
console.log(`\n\x1b[32m✅ TYPE FIXED: Added 'status' to Product blueprint. Vercel will accept this now.\x1b[0m`);