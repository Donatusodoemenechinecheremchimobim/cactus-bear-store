import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

interface StoreState {
  cart: CartItem[];
  currency: string;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size: string) => void;
  clearCart: () => void;
  replaceCart: (newCart: CartItem[]) => void; // <--- NEW ACTION
  toggleCart: () => void;
  toggleCurrency: () => void;
  isCartOpen: boolean;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      cart: [],
      currency: 'NGN',
      isCartOpen: false,
      
      addToCart: (item) => set((state) => {
        const existing = state.cart.find((i) => i.id === item.id && i.size === item.size);
        if (existing) {
          return {
            cart: state.cart.map((i) =>
              i.id === item.id && i.size === item.size
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          };
        }
        return { cart: [...state.cart, { ...item, quantity: 1 }], isCartOpen: true };
      }),

      removeFromCart: (id, size) => set((state) => ({
        cart: state.cart.filter((i) => !(i.id === id && i.size === size)),
      })),

      // NEW: Used to load cart from Database
      replaceCart: (newCart) => set({ cart: newCart }),

      clearCart: () => set({ cart: [] }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      toggleCurrency: () => set((state) => ({ currency: state.currency === 'NGN' ? 'USD' : 'NGN' })),
    }),
    { name: 'cactus-bear-storage' }
  )
);