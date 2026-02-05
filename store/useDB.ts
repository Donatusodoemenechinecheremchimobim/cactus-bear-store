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