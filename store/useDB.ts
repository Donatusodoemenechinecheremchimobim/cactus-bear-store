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
  updateSettings: (data: any) => Promise<void>; // <--- Added this
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
      const querySnapshot = await getDocs(collection(db, "products"));
      const products = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      set({ products, loading: false });
    } catch (error) {
      console.error("Fetch products failed:", error);
      set({ loading: false });
    }
  },

  fetchSettings: async () => {
    try {
      const docRef = doc(db, "settings", "general");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        set({ settings: docSnap.data() as any });
      }
    } catch (error) {
      console.error("Fetch settings failed:", error);
    }
  },

  updateSettings: async (data) => {
    try {
      const docRef = doc(db, "settings", "general");
      await setDoc(docRef, data, { merge: true });
      set({ settings: data });
    } catch (error) {
      console.error("Update settings failed:", error);
    }
  },

  updateProduct: async (id, data) => {
    try {
      const productRef = doc(db, "products", id);
      await updateDoc(productRef, data);
      await get().fetchProducts(); 
    } catch (error) {
      console.error("Update product failed:", error);
    }
  },

  deleteProduct: async (id) => {
    try {
      await deleteDoc(doc(db, "products", id));
      await get().fetchProducts();
    } catch (error) {
      console.error("Delete product failed:", error);
    }
  },

  addProduct: async (data) => {
    try {
      await addDoc(collection(db, "products"), data);
      await get().fetchProducts();
    } catch (error) {
      console.error("Add product failed:", error);
    }
  },

  toggleWishlist: (id) => set((state) => {
    const isSaved = state.wishlist.includes(id);
    return { 
        wishlist: isSaved 
            ? state.wishlist.filter(item => item !== id)
            : [...state.wishlist, id]
    };
  }),

}));