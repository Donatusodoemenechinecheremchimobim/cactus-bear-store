import './globals.css';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import Radar from '@/components/Radar';
import CartSync from '@/components/CartSync';

export const metadata = {
  title: 'CACTUS BEAR | UTOPIA',
  description: 'High-end streetwear for the digital age.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased selection:bg-brand-neon selection:text-black">
        <CartSync />
        <Navbar />
        <CartDrawer />
        <Radar />
        <main>{children}</main>
      </body>
    </html>
  );
}