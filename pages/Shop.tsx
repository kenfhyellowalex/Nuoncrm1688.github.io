
import React, { useState, useEffect } from 'react';
import { ProductType, Product, Translations, CartItem, CountryCode } from '../types';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import { Coffee, ShoppingBasket, Utensils, ShoppingCart, X, Minus, Plus, Loader, Info } from 'lucide-react';
import { COUNTRIES } from '../constants';

interface ShopProps {
  currencySymbol: string;
  addToCart: (product: Product, quantity?: number, options?: any) => void;
  t: Translations;
  cart: CartItem[];
  onNavigate: (page: string) => void;
  currentCountry?: CountryCode;
}

const Shop: React.FC<ShopProps> = ({ currencySymbol, addToCart, t, cart, onNavigate, currentCountry }) => {
  const [activeTab, setActiveTab] = useState<ProductType>(ProductType.RESTAURANT);
  const [activeSubCategory, setActiveSubCategory] = useState<string>('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [options, setOptions] = useState<{sweetness?: string; iceLevel?: string; spiciness?: string}>({});
  const [layout, setLayout] = useState<'grid' | 'list' | 'focus'>('grid');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, settingRes] = await Promise.all([
           api.products.list(activeTab, currentCountry),
           api.settings.get()
        ]);

        if (prodRes.status === 'success' && prodRes.data) {
          setProducts(prodRes.data);
        }
        if (settingRes.status === 'success' && settingRes.data) {
           setLayout(settingRes.data.menuLayout || 'grid');
        }
        setActiveSubCategory('All');
      } catch (error) {
        console.error("Failed to load shop data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab, currentCountry]);

  const subCategories = ['All', ...Array.from(new Set(products.map(p => p.subCategory).filter((c): c is string => !!c)))];
  const filteredProducts = products.filter(p => activeSubCategory === 'All' || p.subCategory === activeSubCategory);
  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const countryInfo = COUNTRIES.find(c => c.code === currentCountry);

  const getGridClass = () => {
     if (layout === 'list') return 'grid grid-cols-1 lg:grid-cols-2 gap-4';
     if (layout === 'focus') return 'grid grid-cols-1 md:grid-cols-2 gap-8';
     return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'; // Default Grid
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-brand-blue text-white pt-12 pb-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <span className="text-xl">{countryInfo?.flag}</span> Local Hub: {countryInfo?.name}
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-black mb-4 uppercase tracking-tighter">{t.shop.pageTitle}</h1>
          <p className="text-blue-100 max-w-xl mx-auto font-medium opacity-80 mb-8">{t.shop.pageDesc}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-sm border-b sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-6 overflow-x-auto py-4 scrollbar-hide">
             {[
               { id: ProductType.RESTAURANT, icon: Utensils, label: t.shop.restaurantTab, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
               { id: ProductType.COFFEE, icon: Coffee, label: t.shop.cafeTab, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
               { id: ProductType.MART, icon: ShoppingBasket, label: t.shop.martTab, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' }
             ].map(tab => (
               <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black whitespace-nowrap transition-all border-2 ${
                  activeTab === tab.id ? `${tab.bg} ${tab.color} ${tab.border} shadow-sm` : 'text-gray-400 border-transparent hover:text-gray-600'
                }`}
               >
                 <tab.icon size={20} />
                 <span>{tab.label}</span>
               </button>
             ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 flex-grow w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-48">
              <h3 className="font-heading font-black text-xs uppercase tracking-widest mb-6 text-gray-400">{t.shop.categories}</h3>
              <div className="space-y-1">
                {subCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveSubCategory(cat)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      activeSubCategory === cat ? 'bg-brand-blue text-white shadow-lg shadow-blue-200 scale-105' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
             {loading ? (
               <div className={getGridClass()}>
                 {[1,2,3,4,5,6].map(i => <div key={i} className="bg-gray-100 h-80 rounded-3xl animate-pulse" />)}
               </div>
             ) : (
               <>
                 {filteredProducts.length > 0 ? (
                   <div className={getGridClass()}>
                     {filteredProducts.map(p => (
                       <ProductCard 
                          key={p.id} 
                          product={p} 
                          currencySymbol={currencySymbol} 
                          t={t} 
                          variant={layout}
                          onAddToCart={() => {
                            if (p.category === ProductType.MART) addToCart(p, 1);
                            else { setSelectedProduct(p); setQuantity(1); setOptions(p.category === ProductType.COFFEE ? { sweetness: '100%', iceLevel: 'Normal' } : { spiciness: 'Medium' }); }
                          }} 
                       />
                     ))}
                   </div>
                 ) : (
                   <div className="bg-white py-20 rounded-3xl text-center border-4 border-dashed border-gray-100">
                      <p className="text-gray-400 font-bold uppercase tracking-widest">No Items in this region</p>
                      <p className="text-xs text-gray-300 mt-2">Our multi-country engine filters items by warehouse location.</p>
                   </div>
                 )}
               </>
             )}
          </div>
        </div>
      </div>

      {/* Cart Fab */}
      <div className="fixed bottom-10 right-10 z-50">
        <button 
          onClick={() => onNavigate('checkout')}
          className="bg-brand-yellow text-brand-blue font-black px-8 py-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex items-center gap-4 hover:scale-110 active:scale-95 transition-all border-4 border-white"
        >
          <ShoppingCart size={28} />
          <span className="text-xl">{cartTotalCount}</span>
        </button>
      </div>

      {/* Modal - Generic Handler */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
           <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden animate-fade-in-up">
              <div className="h-56 relative">
                 <img src={selectedProduct.image} className="w-full h-full object-cover" />
                 <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 bg-white p-2 rounded-full shadow-xl"><X size={20} /></button>
              </div>
              <div className="p-10">
                 <div className="flex justify-between items-start mb-6">
                    <h2 className="text-3xl font-heading font-black text-gray-900">{selectedProduct.name}</h2>
                    <span className="text-2xl font-black text-brand-blue">{currencySymbol}{selectedProduct.price.toFixed(2)}</span>
                 </div>
                 
                 <div className="flex items-center gap-4 pt-8 border-t border-gray-100">
                    <div className="flex items-center bg-gray-100 rounded-2xl p-1">
                       <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3"><Minus size={20} /></button>
                       <span className="w-10 text-center font-black text-xl">{quantity}</span>
                       <button onClick={() => setQuantity(quantity + 1)} className="p-3"><Plus size={20} /></button>
                    </div>
                    <button onClick={() => { addToCart(selectedProduct, quantity, options); setSelectedProduct(null); }} className="flex-1 bg-brand-yellow py-5 rounded-2xl font-black text-brand-blue shadow-xl shadow-yellow-100">
                       {t.shop.addToCart} • {currencySymbol}{(selectedProduct.price * quantity).toFixed(2)}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
