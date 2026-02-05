const fs = require('fs');
const path = require('path');

// FORCE UPDATE IN CURRENT FOLDER
const rootDir = process.cwd(); 
console.log(`\x1b[35m🌵 FIXING WISHLIST BUILD ERROR in: ${rootDir}...\x1b[0m`);

const writeFile = (filePath, content) => {
  const absolutePath = path.join(rootDir, filePath);
  const dir = path.dirname(absolutePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(absolutePath, content.trim());
  console.log(`\x1b[32m  -> Updated: ${filePath}\x1b[0m`);
};

const files = {
  // ==========================================
  // UPDATED STORE (Now includes Wishlist Logic)
  // ==========================================
  'store/useDB.ts': `
import { create } from 'zustand';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, getDoc } from 'firebase/firestore';
import { persist } from 'zustand/middleware'; // Optional: Keeps wishlist after refresh

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
  wishlist: string[]; // <--- ADDED THIS
  loading: boolean;
  
  fetchProducts: () => Promise<void>;
  fetchSettings: () => Promise<void>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addProduct: (data: Omit<Product, 'id'>) => Promise<void>;
  toggleWishlist: (id: string) => void; // <--- ADDED THIS
}

export const useDB = create<DBState>((set, get) => ({
  products: [],
  settings: { nextDrop: '', announcement: '' },
  wishlist: [], // Default empty
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

  // ⚠️ THE FIX: Added the Logic to Save/Remove Items
  toggleWishlist: (id) => set((state) => {
    const isSaved = state.wishlist.includes(id);
    return { 
        wishlist: isSaved 
            ? state.wishlist.filter(item => item !== id) // Remove if there
            : [...state.wishlist, id] // Add if not
    };
  }),

}));
`
};

Object.keys(files).forEach((filePath) => { writeFile(filePath, files[filePath]); });
console.log(`\n\x1b[32m✅ BUILD ERROR RESOLVED: Added 'wishlist' logic to the database store.\x1b[0m`);