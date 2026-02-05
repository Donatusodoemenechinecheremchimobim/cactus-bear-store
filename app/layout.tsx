import type { Metadata } from 'next';
import './globals.css';
import { Outfit } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Cart from '@/components/Cart';
import AuthProvider from '@/components/AuthProvider';
import Preloader from '@/components/Preloader';
import CartSync from '@/components/CartSync';
import { ToastProvider } from '@/components/ToastProvider'; // <--- NEW IMPORT

const outfit = Outfit({ 
  subsets: ['latin'], 
  weight: ['300', '400', '600', '800'],
  variable: '--font-outfit'
});

export const metadata: Metadata = {
  title: 'CACTUS BEAR | Chaos is Luxury',
  description: 'The premier high-end streetwear label. Deployed from Nigeria.',
  keywords: ['Streetwear', 'Fashion', 'Luxury', 'Nigeria', 'Cactus Bear'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${outfit.className} bg-black text-white antialiased overflow-x-hidden selection:bg-brand-neon selection:text-black`}>
        <AuthProvider>
            <ToastProvider> {/* <--- WRAP EVERYTHING IN TOAST PROVIDER */}
              <CartSync />
              <Preloader />
              <Navbar />
              <Cart />
              <main>{children}</main>
            </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}