import { create } from 'zustand';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, getDoc } from 'firebase/firestore';

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

// ⚠️ THE FIX: Added 'settings' and 'fetchSettings' to the interface
interface DBState {
  products: Product[];
  settings: { nextDrop: string; announcement: string }; 
  loading: boolean;
  fetchProducts: () => Promise<void>;
  fetchSettings: () => Promise<void>; // <--- THIS WAS MISSING
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addProduct: (data: Omit<Product, 'id'>) => Promise<void>;
}

export const useDB = create<DBState>((set, get) => ({
  products: [],
  settings: { nextDrop: '', announcement: '' }, // Default empty settings
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

  // ⚠️ THE FIX: Implemented the missing function
  fetchSettings: async () => {
    try {
      // We assume there is a collection called 'settings' with a doc called 'general'
      const docRef = doc(db, "settings", "general");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        set({ settings: docSnap.data() as any });
      }
    } catch (error) {
      console.error("Fetch settings failed:", error);
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
  }
}));