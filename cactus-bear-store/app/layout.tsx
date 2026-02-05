import type { Metadata } from "next";
import { Oswald, Courier_Prime } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import CustomCursor from "@/components/CustomCursor";
import IntelPopup from "@/components/IntelPopup";
import Radar from "@/components/Radar";
import SoundController from "@/components/SoundController";
import QuickViewModal from "@/components/QuickViewModal";
import SmoothScroll from "@/components/SmoothScroll"; // NEW
import { AuthProvider } from "@/components/Providers";

const oswald = Oswald({ subsets: ["latin"], variable: '--font-oswald' });
const courier = Courier_Prime({ weight: "400", subsets: ["latin"], variable: '--font-courier' });

export const metadata: Metadata = { 
  title: "CACTUS BEAR | Wilderness Luxury", 
  description: "High-end tactical streetwear for the modern survivalist." 
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${oswald.variable} ${courier.variable} font-sans antialiased bg-black text-white selection:bg-brand-neon selection:text-black`} suppressHydrationWarning>
        <AuthProvider>
          <SmoothScroll>
            <SoundController />
            <CustomCursor />
            <Radar />
            <Navbar />
            <CartDrawer />
            <QuickViewModal />
            <IntelPopup />
            <main className="min-h-screen relative">{children}</main>
          </SmoothScroll>
        </AuthProvider>
      </body>
    </html>
  );
}