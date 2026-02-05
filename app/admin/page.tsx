"use client";
import { useState, useEffect } from 'react';
import { useDB } from '@/store/useDB';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Clock, ShieldAlert } from 'lucide-react';

const ADMIN_EMAIL = "chibundusadiq@gmail.com";

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const { products, createProduct, deleteProduct, fetchProducts, dropSettings, updateSettings, fetchSettings } = useDB();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('inventory');
  const [loading, setLoading] = useState(false);
  const [hypeData, setHypeData] = useState({ dropTitle: '', dropDate: '' });

  const [newProduct, setNewProduct] = useState({ 
      name: '', price: '', images: '', colors: '', sizes: 'S, M, L, XL', 
      collection: 'Utopia', category: 'clothes', 
      status: 'available' 
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.email !== ADMIN_EMAIL) {
        // router.push('/'); // Uncomment to auto-kick non-admins
    } else {
        fetchProducts();
        fetchSettings();
    }
  }, [user, authLoading]);

  // Loading State
  if (authLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-mono animate-pulse">AUTHENTICATING...</div>;

  // Access Denied
  if (!user || user.email !== ADMIN_EMAIL) {
      return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-red-500">
            <ShieldAlert size={64} className="mb-4" />
            <h1 className="text-2xl font-black uppercase">Access Denied</h1>
            <p className="font-mono text-xs mt-2">ID: {user?.email || 'Unknown'} is not authorized.</p>
        </div>
      );
  }

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
            status: newProduct.status as any 
        });
        alert('✅ Product Deployed!'); 
        setNewProduct({ name: '', price: '', images: '', colors: '', sizes: 'S, M, L, XL', collection: 'Utopia', category: 'clothes', status: 'available' });
    } catch (error: any) {
        alert(`❌ Failed: ${error.message}`);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen pt-28 px-6 bg-black text-white pb-40">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex justify-between items-end mb-8">
            <div>
                <p className="text-xs font-mono text-white/40 uppercase mb-2">Operator: {user.email}</p>
                <h1 className="text-4xl md:text-6xl font-black uppercase italic text-brand-neon leading-none">Command Center</h1>
            </div>
            <div className="flex gap-2">
                {['inventory', 'hype control'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2 font-bold uppercase tracking-widest text-[10px] border transition-colors ${activeTab === tab ? 'bg-brand-neon text-black border-brand-neon' : 'border-white/20 text-white/50 hover:border-white hover:text-white'}`}>
                        {tab}
                    </button>
                ))}
            </div>
        </div>

        {activeTab === 'inventory' && (
            <div className="grid md:grid-cols-12 gap-8 relative">
                <div className="md:col-span-4 lg:col-span-3">
                    <div className="bg-[#0f0f0f] border border-white/10 p-6 sticky top-28 z-50 shadow-2xl">
                        <h3 className="text-lg font-bold uppercase mb-4 flex items-center gap-2 text-white"><Plus className="text-brand-neon" /> Deploy Item</h3>
                        <form onSubmit={handleAddProduct} className="space-y-3">
                            <input placeholder="Product Name" className="w-full bg-black border border-white/20 p-3 text-xs text-white focus:border-brand-neon outline-none uppercase font-bold" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                            
                            <div className="grid grid-cols-2 gap-2">
                                <input placeholder="Price (₦)" type="number" className="bg-black border border-white/20 p-3 text-xs text-white focus:border-brand-neon outline-none font-mono" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                                <input placeholder="Collection" className="bg-black border border-white/20 p-3 text-xs text-white focus:border-brand-neon outline-none uppercase" value={newProduct.collection} onChange={e => setNewProduct({...newProduct, collection: e.target.value})} />
                            </div>

                            <textarea placeholder="Image URLs (comma separated)" className="w-full bg-black border border-white/20 p-3 text-xs h-24 text-white focus:border-brand-neon outline-none font-mono" value={newProduct.images} onChange={e => setNewProduct({...newProduct, images: e.target.value})} />
                            
                            <div className="grid grid-cols-2 gap-2">
                                <input placeholder="Colors" className="bg-black border border-white/20 p-3 text-xs text-white focus:border-brand-neon outline-none" value={newProduct.colors} onChange={e => setNewProduct({...newProduct, colors: e.target.value})} />
                                <input placeholder="Sizes" className="bg-black border border-white/20 p-3 text-xs text-white focus:border-brand-neon outline-none" value={newProduct.sizes} onChange={e => setNewProduct({...newProduct, sizes: e.target.value})} />
                            </div>

                            <div className="bg-black border border-white/20 p-2">
                                <label className="block text-[8px] uppercase font-bold text-white/40 tracking-widest mb-1">Status</label>
                                <select className="w-full bg-transparent text-xs uppercase text-brand-neon outline-none font-bold" value={newProduct.status} onChange={e => setNewProduct({...newProduct, status: e.target.value})}>
                                    <option value="available">Available</option>
                                    <option value="sold-out">Sold Out</option>
                                    <option value="pre-order">Pre-Order</option>
                                </select>
                            </div>

                            <button disabled={loading} className="w-full bg-white text-black font-black py-4 uppercase tracking-[0.2em] text-xs hover:bg-brand-neon transition-colors mt-4">
                                {loading ? 'Deploying...' : 'Deploy Unit'}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="md:col-span-8 lg:col-span-9 grid grid-cols-1 gap-2">
                    {products.map(p => (
                        <div key={p.id} className="flex gap-4 p-4 border border-white/5 bg-[#0a0a0a] items-center group hover:border-brand-neon/30 transition-colors">
                            <div className="w-12 h-12 bg-zinc-900 bg-cover bg-center" style={{backgroundImage: `url(${p.images[0]})`}}></div>
                            <div className="flex-1">
                                <h4 className="font-bold uppercase text-sm">{p.name}</h4>
                                <div className="flex gap-4 text-[10px] text-white/50 font-mono mt-1 items-center">
                                    <span className="text-brand-neon">₦{p.price.toLocaleString()}</span>
                                    <span>|</span>
                                    <span className="uppercase">{p.collection}</span>
                                </div>
                            </div>
                            <button onClick={() => deleteProduct(p.id)} className="text-white/20 hover:text-red-500 p-3 hover:bg-red-500/10 rounded transition-colors"><Trash2 size={16} /></button>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
}