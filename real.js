const fs = require('fs');
const path = require('path');

const rootDir = process.cwd(); 

const writeFile = (filePath, content) => {
  const absolutePath = path.join(rootDir, filePath);
  const dir = path.dirname(absolutePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(absolutePath, content.trim());
  console.log("Fixed: " + filePath);
};

// We are fixing the file at the ROOT and the one Vercel is finding in the sub-folder
const adminContent = `
"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDB, Product } from '@/store/useDB';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Loader2 } from 'lucide-react';

export default function AdminPage() {
  const { user, loading: authL } = useAuth();
  const { products, fetchProducts, deleteProduct, addProduct, fetchSettings } = useDB();
  const router = useRouter();
  const [newP, setNewP] = useState({ name: '', price: '', images: '', sizes: 'S,M,L', colors: 'Black', category: 'clothes', collection: 'Utopia', status: 'available' });

  useEffect(() => {
    if (!authL && (!user || user.email !== "chibundusadiq@gmail.com")) router.push('/');
    else if (user) { fetchProducts(); fetchSettings(); }
  }, [user, authL]);

  const handleAdd = async (e: any) => {
    e.preventDefault();
    await addProduct({ ...newP, price: Number(newP.price), images: newP.images.split(','), sizes: newP.sizes.split(','), colors: newP.colors.split(','), description: 'Admin' });
    alert('Deployed');
  };

  if (authL || !user) return <div className="bg-black min-h-screen" />;

  return (
    <div className="min-h-screen bg-black text-white pt-32 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black uppercase italic text-brand-neon mb-8">Command Center</h1>
        <div className="grid md:grid-cols-2 gap-12">
          <form onSubmit={handleAdd} className="space-y-4 bg-zinc-900/50 p-6 border border-white/10">
            <input placeholder="Name" className="w-full bg-black p-3 border border-white/10" onChange={e => setNewP({...newP, name: e.target.value})} />
            <input placeholder="Price" type="number" className="w-full bg-black p-3 border border-white/10" onChange={e => setNewP({...newP, price: e.target.value})} />
            <textarea placeholder="Images" className="w-full bg-black p-3 border border-white/10 h-32" onChange={e => setNewP({...newP, images: e.target.value})} />
            <button className="w-full bg-brand-neon text-black font-black py-4 uppercase">Deploy Asset</button>
          </form>
          <div className="space-y-2">
            {products.map(p => (
              <div key={p.id} className="p-4 border border-white/5 flex justify-between items-center">
                <span className="text-xs uppercase font-bold">{p.name}</span>
                <button onClick={() => deleteProduct(p.id)} className="text-red-500"><Trash2 size={16}/></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
`;

// 1. Fix the main admin page
writeFile('app/admin/page.tsx', adminContent);

// 2. Fix the sub-folder copy that Vercel is accidentally finding
writeFile('cactus-bear-store/app/admin/page.tsx', adminContent);

console.log("CLEANUP COMPLETE. Push now.");