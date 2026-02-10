import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Product, ProductType } from '../../types';
import { 
  Search, Package, AlertTriangle, ArrowUp, ArrowDown, 
  Plus, Minus, RefreshCw, Filter, ShoppingBasket, Coffee, Utensils, Loader
} from 'lucide-react';

const InventoryManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<ProductType | 'ALL'>('ALL');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await api.products.list();
      if (response.status === 'success' && response.data) {
        // Mock data usually lacks minStock, add defaults for the UI demo
        const enhanced = response.data.map(p => ({
          ...p,
          stock: p.stock ?? Math.floor(Math.random() * 50),
          minStock: p.minStock ?? 5
        }));
        setProducts(enhanced);
      }
    } catch (error) {
      console.error("Inventory Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const adjustStock = async (id: string, delta: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const newStock = Math.max(0, (p.stock || 0) + delta);
        api.products.update(id, { stock: newStock }); // Background sync
        return { ...p, stock: newStock };
      }
      return p;
    }));
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || p.category === filterType;
    const isLow = (p.stock || 0) <= (p.minStock || 5);
    const matchesLowFilter = !showLowStockOnly || isLow;
    return matchesSearch && matchesType && matchesLowFilter;
  });

  const lowStockCount = products.filter(p => (p.stock || 0) <= (p.minStock || 5)).length;

  const getTypeIcon = (type: ProductType) => {
    switch (type) {
      case ProductType.COFFEE: return <Coffee size={14} />;
      case ProductType.MART: return <ShoppingBasket size={14} />;
      case ProductType.RESTAURANT: return <Utensils size={14} />;
      default: return <Package size={14} />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
           <h2 className="text-3xl font-heading font-black text-gray-900 uppercase tracking-tighter italic">Stock Intelligence</h2>
           <p className="text-gray-500 font-medium">Real-time inventory levels across all branches.</p>
        </div>
        <div className="flex gap-4">
           <div className={`px-6 py-3 rounded-2xl border-2 flex items-center gap-3 transition-all ${lowStockCount > 0 ? 'bg-red-50 border-red-200 text-red-600' : 'bg-green-50 border-green-200 text-green-600'}`}>
              <AlertTriangle size={20} className={lowStockCount > 0 ? 'animate-bounce' : ''} />
              <div className="text-left leading-none">
                 <p className="text-[10px] font-black uppercase tracking-widest">Low Stock Alerts</p>
                 <p className="text-xl font-black mt-0.5">{lowStockCount} Items</p>
              </div>
           </div>
           <button onClick={fetchInventory} className="p-4 bg-white rounded-2xl border-2 border-gray-100 hover:border-brand-blue text-brand-blue transition-all">
              <RefreshCw size={24} />
           </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-center">
         <div className="relative flex-grow w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Search SKU or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl outline-none transition-all font-medium"
            />
         </div>
         <div className="flex gap-2 p-1.5 bg-gray-100 rounded-2xl w-full md:w-auto">
            {['ALL', ProductType.RESTAURANT, ProductType.COFFEE, ProductType.MART].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type as any)}
                className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterType === type ? 'bg-white text-brand-blue shadow-lg' : 'text-gray-500 hover:text-gray-900'}`}
              >
                {type}
              </button>
            ))}
         </div>
         <button 
           onClick={() => setShowLowStockOnly(!showLowStockOnly)}
           className={`px-6 py-4 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${showLowStockOnly ? 'bg-red-600 border-red-600 text-white shadow-xl' : 'bg-white border-gray-100 text-gray-400'}`}
         >
           <Filter size={16} />
           {showLowStockOnly ? 'Filtered: Low Stock' : 'Filter Low Stock'}
         </button>
      </div>

      {/* Stock Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          [1,2,3,4,5,6].map(i => <div key={i} className="h-64 bg-gray-100 rounded-[2.5rem] animate-pulse" />)
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.id} className={`bg-white rounded-[2.5rem] p-8 border-4 transition-all relative overflow-hidden group ${ (product.stock || 0) <= (product.minStock || 5) ? 'border-red-100 hover:border-red-500' : 'border-white hover:border-brand-yellow hover:shadow-2xl' }`}>
               <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm">
                        <img src={product.image} className="w-full h-full object-cover" alt="" />
                     </div>
                     <div>
                        <h4 className="font-black text-gray-900 uppercase tracking-tight leading-none mb-1">{product.name}</h4>
                        <div className="flex items-center gap-1.5 text-gray-400">
                           {getTypeIcon(product.category)}
                           <span className="text-[10px] font-bold uppercase tracking-widest">{(product.subCategory || product.category).slice(0, 15)}</span>
                        </div>
                     </div>
                  </div>
                  { (product.stock || 0) <= (product.minStock || 5) && (
                     <span className="bg-red-500 text-white px-2 py-0.5 rounded text-[8px] font-black uppercase animate-pulse">RESTOCK</span>
                  ) }
               </div>

               <div className="space-y-4">
                  <div className="flex justify-between items-end">
                     <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Stock Level</p>
                        <h3 className={`text-4xl font-heading font-black tracking-tighter italic ${ (product.stock || 0) <= (product.minStock || 5) ? 'text-red-600' : 'text-brand-blue' }`}>
                           {product.stock} <span className="text-xs font-sans not-italic text-gray-300">/ UNITS</span>
                        </h3>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Threshold</p>
                        <p className="text-sm font-black text-gray-900">{product.minStock} MIN</p>
                     </div>
                  </div>

                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                     <div 
                        className={`h-full transition-all duration-1000 ${ (product.stock || 0) <= (product.minStock || 5) ? 'bg-red-500' : 'bg-brand-blue' }`}
                        style={{ width: `${Math.min(100, ((product.stock || 0) / 50) * 100)}%` }}
                     ></div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4">
                     <button 
                       onClick={() => adjustStock(product.id, -1)}
                       className="py-3 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-xl transition-all flex items-center justify-center gap-2 group/btn"
                     >
                        <Minus size={18} className="group-hover/btn:scale-125 transition-transform" />
                        <span className="text-[10px] font-black uppercase">Reduce</span>
                     </button>
                     <button 
                       onClick={() => adjustStock(product.id, 1)}
                       className="py-3 bg-gray-50 hover:bg-green-50 text-gray-400 hover:text-green-600 rounded-xl transition-all flex items-center justify-center gap-2 group/btn"
                     >
                        <Plus size={18} className="group-hover/btn:scale-125 transition-transform" />
                        <span className="text-[10px] font-black uppercase">Increase</span>
                     </button>
                  </div>
               </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-32 text-center">
             <ShoppingBasket size={80} className="mx-auto text-gray-200 mb-6" />
             <h3 className="text-2xl font-black text-gray-400 uppercase italic tracking-tighter">No Items Match Query</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryManager;