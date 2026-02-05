"use client";
import { useState, useEffect } from 'react';
import { useDB } from '@/store/useDB';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Zap, Save } from 'lucide-react';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const { products, createProduct, deleteProduct, fetchProducts, dropSettings, updateSettings, fetchSettings } = useDB();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('inventory');
  const [loading, setLoading] = useState(false);
  const [hypeData, setHypeData] = useState({ dropTitle: '', dropDate: '' });

  const [newProduct, setNewProduct] = useState({ 
      name: '', price: '', images: '', colors: '', sizes: 'S, M, L, XL', 
      collection: 'Utopia', category: 'clothes', 
      status: 'available' // DEFAULT STATUS
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session || (session.user as any).role !== 'admin') router.push('/login');
    fetchProducts();
    fetchSettings();
  }, [session, status, router]);

  useEffect(() => {
      if (dropSettings) {
          const date = new Date(dropSettings.dropDate);
          const formatted = date.toISOString().slice(0, 16);
          setHypeData({ dropTitle: dropSettings.dropTitle, dropDate: formatted });
      }
  }, [dropSettings]);

  if (!session || (session.user as any).role !== 'admin') return null;

  const handleSaveHype = async (e: React.FormEvent) => {
      e.preventDefault();
      await updateSettings({ dropTitle: hypeData.dropTitle, dropDate: new Date(hypeData.dropDate).toISOString() });
      alert("✅ Hype Settings Updated!");
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        // @ts-ignore
        await createProduct({ 
            id: Math.random().toString(), 
            name: newProduct.name || 'Untitled', 
            price: Number(newProduct.price) || 0, 
            images: newProduct.images ? newProduct.images.split(',').map(s => s.trim()).filter(s => s !== '') : ['https://via.placeholder.com/500'], 
            colors: newProduct.colors ? newProduct.colors.split(',').map(s => s.trim()).filter(s => s !== '') : ['Black'], 
            sizes: newProduct.sizes ? newProduct.sizes.split(',').map(s => s.trim()).filter(s => s !== '') : ['M'],
            collection: newProduct.collection || 'General',
            category: newProduct.category, 
            description: 'Added via Admin',
            status: newProduct.status as any // SEND STATUS
        });
        alert('✅ Product Deployed!'); 
        setNewProduct({ name: '', price: '', images: '', colors: '', sizes: 'S, M, L, XL', collection: 'Utopia', category: 'clothes', status: 'available' });
    } catch (error: any) {
        alert(`❌ Failed: ${error.message}`);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen pt-24 px-6 bg-black text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-black uppercase italic text-brand-neon mb-2">Command Center</h1>
        <div className="flex gap-2 mb-12 border-b border-white/20 pb-0">
            {['inventory', 'hype control'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-8 py-3 font-bold uppercase tracking-widest text-xs transition-colors ${activeTab === tab ? 'bg-white text-black' : 'text-white/50 hover:text-white'}`}>{tab}</button>
            ))}
        </div>

        {activeTab === 'inventory' && (
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1 bg-[#0a0a0a] border border-white/10 p-6 h-fit sticky top-24">
                    <h3 className="text-xl font-bold uppercase mb-6 flex items-center gap-2 text-brand-neon"><Plus /> Deploy Item</h3>
                    <form onSubmit={handleAddProduct} className="space-y-4">
                        <input placeholder="Name" className="w-full bg-black border border-white/20 p-3 text-sm text-white focus:border-brand-neon outline-none" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                        <input placeholder="Price" type="number" className="w-full bg-black border border-white/20 p-3 text-sm text-white focus:border-brand-neon outline-none" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                        <textarea placeholder="Images (comma separated)" className="w-full bg-black border border-white/20 p-3 text-sm h-20 text-white focus:border-brand-neon outline-none" value={newProduct.images} onChange={e => setNewProduct({...newProduct, images: e.target.value})} />
                        
                        <div className="grid grid-cols-2 gap-2">
                             <input placeholder="Colors" className="bg-black border border-white/20 p-3 text-sm text-white focus:border-brand-neon outline-none" value={newProduct.colors} onChange={e => setNewProduct({...newProduct, colors: e.target.value})} />
                             <input placeholder="Sizes" className="bg-black border border-white/20 p-3 text-sm text-white focus:border-brand-neon outline-none" value={newProduct.sizes} onChange={e => setNewProduct({...newProduct, sizes: e.target.value})} />
                        </div>
                        
                        <input placeholder="Collection (e.g. Utopia)" className="w-full bg-black border border-white/20 p-3 text-sm text-white focus:border-brand-neon outline-none" value={newProduct.collection} onChange={e => setNewProduct({...newProduct, collection: e.target.value})} />

                        {/* STATUS SELECTOR */}
                        <label className="block text-[10px] uppercase font-bold text-white/40 tracking-widest">Availability Status</label>
                        <select className="w-full bg-black border border-white/20 p-3 text-sm uppercase text-white focus:border-brand-neon outline-none" value={newProduct.status} onChange={e => setNewProduct({...newProduct, status: e.target.value})}>
                            <option value="available">Available</option>
                            <option value="sold-out">Sold Out</option>
                            <option value="pre-order">Pre-Order</option>
                        </select>

                        <button disabled={loading} className="w-full bg-brand-neon text-black font-bold py-3 uppercase tracking-widest hover:bg-white transition-colors">
                            {loading ? 'Deploying...' : 'Deploy'}
                        </button>
                    </form>
                </div>

                <div className="md:col-span-2 grid grid-cols-1 gap-2 max-h-[80vh] overflow-y-auto custom-scrollbar">
                    {products.map(p => (
                        <div key={p.id} className="flex gap-4 p-4 border border-white/10 bg-[#0a0a0a] items-center group hover:border-white/30 transition-colors">
                            <img src={p.images[0]} className="w-16 h-16 object-cover bg-white/5" />
                            <div className="flex-1">
                                <h4 className="font-bold uppercase">{p.name}</h4>
                                <div className="flex gap-4 text-xs text-white/50 font-mono mt-1">
                                    <span className={`uppercase px-2 py-0.5 ${p.status === 'sold-out' ? 'bg-red-900 text-white' : (p.status === 'pre-order' ? 'bg-yellow-900 text-yellow-200' : 'bg-green-900/30 text-green-400')}`}>
                                        {p.status || 'available'}
                                    </span>
                                    <span>$${p.price}</span>
                                </div>
                            </div>
                            <button onClick={() => deleteProduct(p.id)} className="text-white/20 hover:text-red-500 p-2"><Trash2 size={20} /></button>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'hype control' && (
            <div className="bg-[#0a0a0a] border border-white/10 p-8 max-w-xl">
                <h3 className="text-2xl font-black uppercase italic text-brand-neon mb-6 flex items-center gap-2"><Zap /> Drop Manager</h3>
                <form onSubmit={handleSaveHype} className="space-y-6">
                    <div>
                        <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest block mb-2">Event Title</label>
                        <input className="w-full bg-black border border-white/20 p-4 text-white focus:border-brand-neon outline-none" value={hypeData.dropTitle} onChange={(e) => setHypeData({...hypeData, dropTitle: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest block mb-2">Target Launch Date</label>
                        <input type="datetime-local" className="w-full bg-black border border-white/20 p-4 text-white focus:border-brand-neon outline-none" value={hypeData.dropDate} onChange={(e) => setHypeData({...hypeData, dropDate: e.target.value})} />
                    </div>
                    <button className="w-full bg-brand-neon text-black font-black uppercase py-4 tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2"><Save size={18} /> Update System</button>
                </form>
            </div>
        )}
      </div>
    </div>
  );
}