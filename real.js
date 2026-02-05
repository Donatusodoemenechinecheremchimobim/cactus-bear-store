const fs = require('fs');
const path = require('path');

// FORCE UPDATE IN CURRENT FOLDER
const rootDir = process.cwd(); 
console.log(`\x1b[35m🌵 ACTIVATING HUD ALERTS ON CHECKOUT in: ${rootDir}...\x1b[0m`);

const writeFile = (filePath, content) => {
  const absolutePath = path.join(rootDir, filePath);
  const dir = path.dirname(absolutePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(absolutePath, content.trim());
  console.log(`\x1b[32m  -> Updated: ${filePath}\x1b[0m`);
};

const files = {
  // ==========================================
  // CHECKOUT PAGE (Now uses HUD Alerts)
  // ==========================================
  'app/checkout/page.tsx': `
"use client";
import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { ShieldCheck, Smartphone, Lock, MapPin, ArrowLeft } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/components/ToastProvider'; // <--- HUD SYSTEM
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, clearCart } = useStore();
  const { user } = useAuth();
  const router = useRouter();
  const { showToast } = useToast(); // <--- ACTIVATE HUD
  
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const ADMIN_WHATSAPP = "2348144462467"; 

  const config = {
    // ⬇️ YOUR LIVE KEY
    public_key: 'FLWPUBK-d9a91cce4a76b3e2529a4cdd48dc406d-X', 
    tx_ref: Date.now().toString(),
    amount: total,
    currency: 'NGN',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: user?.email || 'guest@cactusbear.com',
      phone_number: phone,
      name: user?.displayName || 'Guest User',
    },
    customizations: {
      title: 'Cactus Bear Store',
      description: 'Wilderness Luxury Payment',
      logo: 'https://cdn.iconscout.com/icon/free/png-256/free-cactus-18-460972.png',
    },
  };

  const handleFlutterwavePayment = useFlutterwave(config);

  const handleSuccess = async (response: any) => {
      setIsProcessing(true);
      closePaymentModal();
      
      try {
        if (user) {
            await addDoc(collection(db, "orders"), {
                userId: user.uid,
                email: user.email,
                items: cart,
                total: total,
                status: 'paid',
                date: serverTimestamp(),
                paymentRef: response.tx_ref,
                shipping: { phone, address }
            });
        }

        const itemsList = cart.map(i => \`• \${i.name} (x\${i.quantity}) - \${i.size}\`).join('%0a');
        const message = \`*🚨 NEW ORDER ALERT 🚨*%0a%0a*Status:* ✅ PAID (Flutterwave)%0a*Ref:* \${response.tx_ref}%0a*Amount:* ₦\${total.toLocaleString()}%0a%0a*👤 CUSTOMER:*%0a*Name:* \${user?.displayName || 'Guest'}%0a*Phone:* \${phone}%0a*Address:* \${address}%0a%0a*📦 ITEMS:*%0a\${itemsList}\`;

        clearCart();
        window.location.href = \`https://wa.me/\${ADMIN_WHATSAPP}?text=\${message}\`; 

      } catch (error) {
          showToast("Payment successful, but saving failed. Contact support.", "error");
      }
  };

  const initPayment = () => {
      // ⚠️ TACTICAL HUD CHECKS (No more alert pop-ups)
      if (!phone || phone.length < 10) { 
          showToast("Valid Phone Number Required", "error"); 
          return; 
      }
      if (!address || address.length < 5) { 
          showToast("Shipping Address Required", "error"); 
          return; 
      }

      handleFlutterwavePayment({
        callback: (response) => {
           if(response.status === "successful") handleSuccess(response);
           else { 
             closePaymentModal(); 
             showToast("Transaction Cancelled", "error"); 
           }
        },
        onClose: () => {},
      });
  };

  if (cart.length === 0) return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center pt-20 text-white">
          <h1 className="text-2xl font-black uppercase italic text-white/50">Cart is Empty</h1>
          <button onClick={() => router.push('/')} className="mt-4 border border-white px-6 py-2 uppercase text-xs font-bold hover:bg-white hover:text-black">Return to Store</button>
      </div>
  );

  return (
    <div className="min-h-screen bg-black text-white pt-32 px-6 pb-20">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
        
        {/* LEFT: PAYMENT FORM */}
        <div>
            <Link href="/" className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 hover:text-white flex items-center gap-2 transition-colors mb-8">
                <ArrowLeft size={10} /> Back to Store
            </Link>

            <h1 className="text-4xl font-black uppercase italic text-brand-neon mb-8">Secure Checkout</h1>
            
            <div className="bg-[#0a0a0a] border border-white/10 p-6 space-y-6">
                <div className="flex items-center gap-2 text-brand-neon text-xs font-bold uppercase tracking-widest border-b border-white/10 pb-2">
                    <ShieldCheck size={16} /> Encrypted Connection
                </div>

                <div>
                    <label className="block text-[10px] uppercase font-bold text-white/50 mb-2 flex items-center gap-2">
                        <Smartphone size={12} /> Mobile Number (Required)
                    </label>
                    <input 
                        type="tel" 
                        placeholder="080 000 0000" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-black border border-brand-neon/30 p-4 text-sm text-brand-neon focus:border-brand-neon outline-none font-mono placeholder:text-white/10 transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-[10px] uppercase font-bold text-white/50 mb-2 flex items-center gap-2">
                        <MapPin size={12} /> Shipping Address (Required)
                    </label>
                    <textarea 
                        placeholder="Enter full delivery location..." 
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-black border border-white/20 p-4 text-sm text-white focus:border-brand-neon outline-none font-mono h-24 resize-none transition-colors"
                    />
                </div>

                <div className="border-t border-white/10 pt-4">
                    <div className="flex justify-between items-center text-xl font-black uppercase italic">
                        <span>Total Due:</span>
                        <span className="text-brand-neon">₦{total.toLocaleString()}</span>
                    </div>
                </div>

                <button 
                    disabled={isProcessing} 
                    onClick={initPayment}
                    className="w-full bg-brand-neon text-black font-black py-5 uppercase tracking-[0.2em] text-sm hover:bg-white transition-colors flex items-center justify-center gap-2"
                >
                    {isProcessing ? 'Processing...' : <><Lock size={16} /> Pay Now</>}
                </button>
            </div>
        </div>

        {/* RIGHT: CART SUMMARY */}
        <div className="border-l border-white/10 pl-0 md:pl-12 pt-14">
            <h2 className="text-xl font-bold uppercase mb-6 text-white/50">Order Summary</h2>
            <div className="space-y-4">
                {cart.map((item) => (
                    <div key={item.id + item.size} className="flex gap-4 items-center bg-[#0a0a0a] p-2 border border-white/5 hover:border-white/20 transition-colors">
                        <div className="h-16 w-16 bg-cover bg-center bg-zinc-800" style={{backgroundImage: \`url(\${item.image})\`}} />
                        <div className="flex-1">
                            <h3 className="font-bold uppercase text-xs">{item.name}</h3>
                            <p className="text-[10px] font-mono text-white/50">{item.size} | x{item.quantity}</p>
                        </div>
                        <p className="font-mono text-xs font-bold text-brand-neon">₦{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
}
`
};

Object.keys(files).forEach((filePath) => { writeFile(filePath, files[filePath]); });
console.log(`\n\x1b[32m✅ CHECKOUT UPGRADED: Address errors now use the Tactical HUD (Red Bar).\x1b[0m`);