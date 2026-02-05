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