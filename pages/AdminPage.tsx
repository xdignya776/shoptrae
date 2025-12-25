import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { Product } from '../types';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, LayoutGrid, Package, DollarSign, Wifi } from 'lucide-react';
import { Reveal } from '../components/Reveal';

export const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-6 flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md text-center">
          <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-6">
            <LockIcon />
          </div>
          <h1 className="text-2xl font-bold mb-2">Admin Access</h1>
          <p className="text-gray-500 mb-8">Enter the secure access pin to manage store.</p>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (password === '1234') setIsAuthenticated(true);
            else alert('Invalid PIN (Try 1234)');
          }}>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter PIN (1234)"
              className="w-full text-center text-2xl tracking-widest p-4 bg-gray-50 border border-gray-200 rounded-xl mb-6 focus:border-black outline-none"
              maxLength={4}
            />
            <button className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors">
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
};

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);

const AdminDashboard: React.FC = () => {
  const { products, deleteProduct, addProduct, updateProduct, isLoading } = useProducts();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Stats
  const totalValue = products.reduce((acc, p) => acc + p.price, 0);
  
  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          {/* Header & Status */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold tracking-tight">Store Dashboard</h1>
                <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  <Wifi size={12} /> OpenCart Connected
                </div>
              </div>
              <p className="text-gray-500">Manage your inventory and products.</p>
            </div>
            <div className="flex gap-4">
               <button 
                onClick={() => setIsAdding(true)}
                className="bg-black text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-gray-800 shadow-lg"
              >
                <Plus size={18} /> Add Product
              </button>
            </div>
          </div>
        </Reveal>

        {/* Stats Row */}
        <Reveal delay={100}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Package size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{isLoading ? '...' : products.length}</div>
                <div className="text-sm text-gray-500">Total Products</div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                <DollarSign size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{isLoading ? '...' : `$${totalValue.toFixed(2)}`}</div>
                <div className="text-sm text-gray-500">Inventory Value</div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                <LayoutGrid size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{isLoading ? '...' : new Set(products.map(p => p.category)).size}</div>
                <div className="text-sm text-gray-500">Categories</div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Product Table */}
        <Reveal delay={200}>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {isLoading ? (
              <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                 <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
                 Loading Products...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="p-6 font-semibold text-gray-500 text-sm">Product</th>
                      <th className="p-6 font-semibold text-gray-500 text-sm">Category</th>
                      <th className="p-6 font-semibold text-gray-500 text-sm">Price</th>
                      <th className="p-6 font-semibold text-gray-500 text-sm text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-gray-500">
                          No products found from OpenCart API.
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-6">
                            <div className="flex items-center gap-4">
                              <img src={product.image || 'https://via.placeholder.com/50'} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                              <div>
                                <div className="font-bold text-gray-900">{product.title}</div>
                                <div className="text-xs text-gray-400 truncate max-w-[200px]">{product.baseDescription}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-6">
                            <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-600">
                              {product.category}
                            </span>
                          </td>
                          <td className="p-6 font-medium">${product.price.toFixed(2)}</td>
                          <td className="p-6 text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => setIsEditing(product.id)}
                                className="p-2 hover:bg-gray-200 rounded-full text-gray-500 hover:text-black transition-colors"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button 
                                onClick={() => {
                                  if(window.confirm('Are you sure?')) deleteProduct(product.id);
                                }}
                                className="p-2 hover:bg-red-50 rounded-full text-gray-500 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Reveal>
      </div>

      {/* Product Form Modal (Add/Edit) */}
      {(isAdding || isEditing) && (
        <ProductFormModal 
          product={isEditing ? products.find(p => p.id === isEditing) : undefined}
          onClose={() => { setIsAdding(false); setIsEditing(null); }}
          onSave={(data) => {
            if (isEditing) {
              updateProduct(isEditing, data);
            } else {
              addProduct(data);
            }
            setIsAdding(false);
            setIsEditing(null);
          }}
        />
      )}
    </div>
  );
};

const ProductFormModal: React.FC<{
  product?: Product;
  onClose: () => void;
  onSave: (data: any) => void;
}> = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: product?.title || '',
    price: product?.price || 0,
    category: product?.category || '',
    image: product?.image || `https://picsum.photos/seed/${Math.random()}/600/750`,
    baseDescription: product?.baseDescription || ''
  });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
        <h2 className="text-2xl font-bold mb-6">{product ? 'Edit Product' : 'Add New Product'}</h2>
        
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Product Title</label>
            <input 
              required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-black outline-none"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price ($)</label>
              <input 
                required
                type="number"
                step="0.01"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-black outline-none"
                value={formData.price}
                onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <input 
                required
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-black outline-none"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <div className="flex gap-2">
              <input 
                required
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-black outline-none"
                value={formData.image}
                onChange={e => setFormData({...formData, image: e.target.value})}
              />
              <button 
                type="button"
                onClick={() => setFormData({...formData, image: `https://picsum.photos/seed/${Math.random()}/600/750`})}
                className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200"
                title="Random Image"
              >
                <ImageIcon size={20} />
              </button>
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium mb-1">Description</label>
             <textarea 
               required
               rows={3}
               className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-black outline-none resize-none"
               value={formData.baseDescription}
               onChange={e => setFormData({...formData, baseDescription: e.target.value})}
             />
          </div>

          <button className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors mt-4">
            Save Product
          </button>
        </form>
        
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full">
          <X size={20} />
        </button>
      </div>
    </div>
  );
};