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