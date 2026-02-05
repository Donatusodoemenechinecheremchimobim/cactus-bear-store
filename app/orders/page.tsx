"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Package, Calendar, Clock, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');

    const fetchOrders = async () => {
      if (!user) return;
      try {
        // Query orders where userId matches current user
        const q = query(
            collection(db, "orders"), 
            where("userId", "==", user.uid),
            orderBy("date", "desc") // Newest first
        );
        
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchOrders();
  }, [user, authLoading, router]);

  if (loading || authLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-brand-neon"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-black text-white pt-32 px-6 pb-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black uppercase italic text-white mb-2">My Archives</h1>
        <p className="text-white/40 font-mono text-xs uppercase tracking-widest mb-12">Purchase History</p>

        {orders.length === 0 ? (
           <div className="border border-white/10 p-12 text-center bg-[#0a0a0a]">
              <Package size={48} className="text-white/20 mx-auto mb-4" />
              <h3 className="text-xl font-bold uppercase text-white/50">No Records Found</h3>
              <p className="text-xs text-white/30 font-mono mt-2">You haven't acquired any pieces yet.</p>
           </div>
        ) : (
           <div className="space-y-6">
              {orders.map((order) => (
                 <div key={order.id} className="bg-[#0a0a0a] border border-white/5 p-6 hover:border-brand-neon/30 transition-colors group">
                    <div className="flex flex-col md:flex-row justify-between mb-6 border-b border-white/5 pb-4">
                       <div>
                          <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest mb-1">Order ID</p>
                          <p className="text-xs font-bold text-white/70 font-mono">#{order.id.slice(0,8)}</p>
                       </div>
                       <div className="mt-4 md:mt-0 text-right">
                          <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest mb-1 flex items-center justify-end gap-1"><Calendar size={10}/> Date</p>
                          <p className="text-xs font-bold text-white/70 font-mono">
                            {order.date?.seconds ? new Date(order.date.seconds * 1000).toLocaleDateString() : 'Just Now'}
                          </p>
                       </div>
                    </div>

                    <div className="space-y-3">
                       {order.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex gap-4 items-center">
                             <div className="h-12 w-12 bg-zinc-900 bg-cover bg-center" style={{backgroundImage: `url(${item.image})`}}></div>
                             <div className="flex-1">
                                <h4 className="font-bold uppercase text-sm">{item.name}</h4>
                                <p className="text-[10px] font-mono text-white/50">{item.size} | x{item.quantity}</p>
                             </div>
                             <p className="font-mono text-xs text-white/70">₦{item.price.toLocaleString()}</p>
                          </div>
                       ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                       <span className="px-2 py-1 bg-green-900/20 text-green-400 text-[10px] uppercase font-bold tracking-widest border border-green-900/30 rounded-sm">
                          {order.status || 'Paid'}
                       </span>
                       <p className="text-xl font-black italic text-brand-neon">₦{order.total.toLocaleString()}</p>
                    </div>
                 </div>
              ))}
           </div>
        )}
      </div>
    </div>
  );
}