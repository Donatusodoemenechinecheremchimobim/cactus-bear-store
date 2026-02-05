"use client";
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useStore } from '@/store/useStore';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function CartSync() {
  const { user } = useAuth();
  const { cart, replaceCart } = useStore();

  // 1. LOAD CART FROM DB WHEN USER LOGS IN
  useEffect(() => {
    async function loadUserCart() {
      if (!user) return;
      
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data().cart) {
        // If user has a saved cart, load it
        console.log("📥 Loading Cloud Cart...");
        replaceCart(docSnap.data().cart);
      }
    }
    loadUserCart();
  }, [user, replaceCart]);

  // 2. SAVE CART TO DB WHENEVER IT CHANGES
  useEffect(() => {
    async function saveCartToCloud() {
        if (!user) return;
        
        // Save current cart to Firestore under the user's ID
        // This ensures User A never sees User B's cart
        const docRef = doc(db, "users", user.uid);
        await setDoc(docRef, { cart: cart }, { merge: true });
    }
    
    // Debounce to prevent spamming DB
    const timeout = setTimeout(saveCartToCloud, 1000);
    return () => clearTimeout(timeout);
  }, [cart, user]);

  return null; // This component is invisible
}