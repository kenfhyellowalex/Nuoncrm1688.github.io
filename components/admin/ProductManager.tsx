import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Product, ProductType, ApiResponse, CountryCode } from '../../types';
import { Plus, Edit, Trash2, Search, X, Loader, Save, Coffee, ShoppingBasket, Utensils, Upload, Globe, AlertCircle } from 'lucide-react';

const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<ProductType | 'ALL'>('ALL');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Product & { country: string }>>({
    name: '',
    price: 0,
    costPrice: 0,
    category: ProductType.COFFEE,
    subCategory: 'HOT COFFEE',
    description: '',
    image: '',
    stock: 0,
    country: 'KH'
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.products.list();
      if (response.status === 'success' && response.data) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getSubCategories = (type: ProductType) => {
    switch(type) {
      case ProductType.COFFEE: 
        return ['HOT COFFEE', 'ICED COFFEE', 'NOUN COFFEE', 'FRAPPE', 'SMOOTHIE', 'TEA', 'SODA'];
      case ProductType.RESTAURANT: 
        return ['Main Course', 'Appetizer', 'Soup', 'Salad', 'Dessert', 'Beverage'];
      case ProductType.MART: 
        return ['Beverages', 'Snacks', 'Dairy', 'Bakery', 'Prepared', 'Pantry', 'Frozen', 'Produce', 'Personal Care', 'Household'];
      default: 
        return [];
    }
  };

  const handleOpenModal = (product?: Product) => {
    setErrorMessage(null);
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price,
        costPrice: product.costPrice || 0,
        category: product.category,
        subCategory: product.subCategory || getSubCategories(product.category)[0],
        description: product.description || '',
        image: product.image,
        stock: product.stock || 0,
        country: (product as any).country || 'KH'
      });
    } else {
      setEditingProduct(null);
      const defaultCategory = filterType !== 'ALL' ? filterType : ProductType.COFFEE;
      setFormData({
        name: '',
        price: 0,
        costPrice: 0,
        category: defaultCategory,
        subCategory: getSubCategories(defaultCategory)[0],
        description: '',
        image: '', 
        stock: 10,
        country: 'KH'
      });
    }
    setIsModalOpen(true);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value as ProductType;
    setFormData({
      ...formData,
      category: newCategory,
      subCategory: getSubCategories(newCategory)[0]
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await api.products.delete(id);
        if (response.status === 'success') {
          setProducts(prev => prev.filter(p => p.id !== id));
        }
      } catch (error) {
        alert("Failed to delete product");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    // Create clean data object to avoid state mutation
    const submissionData = { 
      ...formData,
      price: Number(formData.price) || 0,
      costPrice: Number(formData.costPrice) || 0,
      stock: Number(formData.stock) || 0
    };

    if (!submissionData.image) {
       submissionData.image = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80';
    }

    try {
      let response: ApiResponse<Product>;
      if (editingProduct) {
        response = await api.products.update(editingProduct.id, submissionData) as ApiResponse<Product>;
      } else {
        response = await api.products.create(submissionData as any) as ApiResponse<Product>;
      }

      if (response.status === 'success' && response.data) {
        const updatedProduct = response.data;
        if (editingProduct) {
          setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
        } else {
          setProducts(prev => [updatedProduct, ...prev]);
        }
        setIsModalOpen(false);
      } else {
        setErrorMessage(response.message || "An error occurred while saving.");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      setErrorMessage("System error: Could not connect to database.");
    }
  };

  const filteredProducts = products.filter(p => {
    const nameMatch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const subMatch = (p.subCategory || '').toLowerCase().includes(searchTerm.toLowerCase());
    const typeMatch = filterType === 'ALL' || p.category === filterType;
    return (nameMatch || subMatch) && typeMatch;
  });

  const getTypeIcon = (type: ProductType) => {
    switch (type) {
      case ProductType.COFFEE: return <Coffee size={16} className="text-amber-700" />;
      case ProductType.RESTAURANT: return <Utensils size={16} className="text-red-600" />;
      case ProductType.MART: return <ShoppingBasket size={16} className="text-blue-600" />;
      default: return <Coffee size={16} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div>
           <h2 className="text-3xl font-heading font-black text-gray-900 uppercase italic tracking-tighter">Inventory Console</h2>
           <p className="text-gray-500 font-medium">Manage cross-branch products and menu items.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-brand-blue text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-blue-800 transition-all shadow-xl shadow-blue-100"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row gap-6 justify-between items-center">
          <div className="flex gap-2 p-1.5 bg-gray-100 rounded-2xl w-full lg:w-auto overflow-x-auto">
             {['ALL', ProductType.RESTAURANT, ProductType.COFFEE, ProductType.MART].map(type => (
               <button 
                 key={type}
                 onClick={() => setFilterType(type as any)}
                 className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filterType === type ? 'bg-white shadow-lg text-brand-blue' : 'text-gray-500 hover:text-gray-900'}`}
               >
                 {type}
               </button>
             ))}
          </div>

          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Search by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl outline-none transition-all font-medium"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
             <div className="flex justify-center items-center h-96">
                <Loader className="animate-spin text-brand-blue" size={32} />
             </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Product</th>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Branch</th>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Pricing</th>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Inventory</th>
                  <th className="px-8 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0 rounded-xl overflow-hidden shadow-sm border-2 border-white">
                            <img className="h-full w-full object-cover" src={product.image} alt="" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-black text-gray-900 group-hover:text-brand-blue transition-colors">{product.name}</div>
                            <div className="flex items-center gap-2 mt-1">
                               {getTypeIcon(product.category)}
                               <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{product.subCategory || '-'}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-center">
                         <span className="px-3 py-1 bg-blue-50 text-brand-blue text-[10px] font-black rounded-lg border border-blue-100 uppercase tracking-tighter">
                            {(product as any).country || 'KH'}
                         </span>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="text-sm font-black text-gray-900">${(Number(product.price) || 0).toFixed(2)}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase">Cost: ${(Number(product.costPrice) || 0).toFixed(2)}</div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-center">
                        {product.category === ProductType.MART ? (
                          <span className={`px-3 py-1 inline-flex text-[10px] font-black uppercase tracking-widest rounded-full border ${
                            (product.stock || 0) > 5 ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
                          }`}>
                            {(product.stock || 0)} UNITS
                          </span>
                        ) : (
                          <span className="px-3 py-1 inline-flex text-[10px] font-black uppercase tracking-widest rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                            ON-MENU
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-right">
                        <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleOpenModal(product)}
                            className="text-blue-600 hover:bg-blue-600 hover:text-white p-2 rounded-xl transition-all"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:bg-red-600 hover:text-white p-2 rounded-xl transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                       <ShoppingBasket size={48} className="mx-auto text-gray-200 mb-4" />
                       <p className="text-gray-400 font-black uppercase italic tracking-widest">No Products Found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up border-8 border-white">
            <div className="flex justify-between items-center p-8 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter">
                  {editingProduct ? 'Update Product' : 'Catalog Entry'}
                </h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Stock Ledger Sync</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="bg-white p-2 rounded-2xl shadow-sm hover:scale-110 transition-transform">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {errorMessage && (
                <div className="bg-red-50 border-2 border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 animate-shake">
                   <AlertCircle size={20} />
                   <p className="text-xs font-black uppercase tracking-widest">{errorMessage}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Product Name</label>
                  <input 
                    type="text" required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl outline-none transition-all font-bold"
                    placeholder="e.g. Signature Dark Roast"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Selling Price ($)</label>
                  <input 
                    type="number" step="0.01" required
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl outline-none transition-all font-black text-brand-blue"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Cost Price ($)</label>
                  <input 
                    type="number" step="0.01"
                    value={formData.costPrice}
                    onChange={e => setFormData({...formData, costPrice: parseFloat(e.target.value) || 0})}
                    className="w-full px-5 py-4 bg-amber-50/50 border-2 border-transparent focus:border-brand-yellow rounded-2xl outline-none transition-all font-black text-amber-700"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Business Segment</label>
                  <select 
                    value={formData.category}
                    onChange={handleCategoryChange}
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl outline-none transition-all font-bold appearance-none"
                  >
                    <option value={ProductType.COFFEE}>☕ Coffee Shop</option>
                    <option value={ProductType.RESTAURANT}>🍛 Restaurant</option>
                    <option value={ProductType.MART}>🛒 Mini Mart</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Target Branch</label>
                  <select 
                    value={formData.country}
                    onChange={e => setFormData({...formData, country: e.target.value})}
                    className="w-full px-5 py-4 bg-blue-50/50 border-2 border-transparent focus:border-brand-blue rounded-2xl outline-none transition-all font-black text-brand-blue appearance-none"
                  >
                    <option value="KH">🇰🇭 Cambodia HQ</option>
                    <option value="TH">🇹🇭 Thailand Branch</option>
                    <option value="ID">🇮🇩 Indonesia Branch</option>
                    <option value="US">🇺🇸 Global Hub (US)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Sub-Category</label>
                  <select
                    value={formData.subCategory}
                    onChange={e => setFormData({...formData, subCategory: e.target.value})}
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl outline-none transition-all font-bold appearance-none"
                  >
                    {getSubCategories(formData.category as ProductType).map((sub, idx) => (
                      <option key={idx} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Current Stock</label>
                  <input 
                    type="number" 
                    value={formData.stock}
                    onChange={e => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl outline-none transition-all font-bold"
                  />
                </div>

                <div className="md:col-span-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Product Visualization</label>
                   {!formData.image ? (
                     <label className="flex flex-col items-center justify-center w-full h-40 border-4 border-dashed border-gray-100 rounded-3xl cursor-pointer bg-gray-50 hover:bg-white hover:border-brand-blue transition-all group">
                        <Upload size={32} className="text-gray-300 group-hover:text-brand-blue transition-colors mb-2" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Product Media</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                     </label>
                   ) : (
                     <div className="relative w-full h-48 rounded-3xl overflow-hidden border-4 border-gray-50 group shadow-inner">
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                           <label className="cursor-pointer p-4 bg-white rounded-2xl text-brand-blue shadow-xl hover:scale-110 transition-transform">
                              <Edit size={24} />
                              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                           </label>
                           <button 
                             type="button" 
                             onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                             className="p-4 bg-red-600 rounded-2xl text-white shadow-xl hover:scale-110 transition-transform"
                           >
                             <Trash2 size={24} />
                           </button>
                        </div>
                     </div>
                   )}
                </div>

                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Public Description</label>
                  <textarea 
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl outline-none transition-all font-medium"
                    placeholder="Describe this item for customers..."
                  />
                </div>
              </div>

              <div className="pt-6 flex flex-col gap-3">
                <button 
                  type="submit"
                  className="w-full py-5 bg-brand-blue text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-blue-200 hover:bg-blue-800 transition-all flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  COMMIT TO DATABASE
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-4 text-gray-400 font-black uppercase tracking-widest text-[10px] hover:text-gray-600"
                >
                  Discard Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManager;