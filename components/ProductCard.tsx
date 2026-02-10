
import React from 'react';
import { Plus, Coffee, Package, Utensils, ShoppingCart } from 'lucide-react';
import { Product, ProductType, Translations } from '../types';

interface ProductCardProps {
  product: Product;
  currencySymbol: string;
  onAddToCart: (product: Product) => void;
  t: Translations;
  variant?: 'grid' | 'list' | 'focus';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, currencySymbol, onAddToCart, t, variant = 'grid' }) => {
  const getIcon = () => {
    switch(product.category) {
      case ProductType.COFFEE: return <Coffee size={18} />;
      case ProductType.MART: return <Package size={18} />;
      case ProductType.RESTAURANT: return <Utensils size={18} />;
      default: return <Coffee size={18} />;
    }
  };

  const isCustomizable = product.category === ProductType.COFFEE || product.category === ProductType.RESTAURANT;

  // --- LIST VIEW VARIANT ---
  if (variant === 'list') {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-4 items-center hover:shadow-lg transition-all group">
        <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" loading="lazy" />
        </div>
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2 mb-1">
             <span className="bg-gray-100 text-gray-500 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded">{product.subCategory}</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 truncate">{product.name}</h3>
          <p className="text-xs text-gray-500 line-clamp-1">{product.description}</p>
          <div className="mt-2 text-xl font-black text-brand-blue">{currencySymbol}{product.price.toFixed(2)}</div>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
          className="bg-brand-yellow text-brand-blue p-4 rounded-xl shadow-md hover:bg-yellow-400 transition-colors flex-shrink-0"
        >
          <Plus size={24} />
        </button>
      </div>
    );
  }

  // --- FOCUS VARIANT ---
  if (variant === 'focus') {
    return (
      <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden group border-2 border-transparent hover:border-brand-blue transition-all cursor-pointer" onClick={() => onAddToCart(product)}>
         <div className="h-64 overflow-hidden relative">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md p-2 rounded-xl text-brand-blue shadow-lg">
               {getIcon()}
            </div>
         </div>
         <div className="p-8">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <h3 className="text-3xl font-heading font-black text-gray-900 leading-tight mb-2">{product.name}</h3>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">{product.subCategory}</span>
               </div>
               <span className="text-4xl font-black text-brand-blue tracking-tighter">{currencySymbol}{product.price.toFixed(2)}</span>
            </div>
            <p className="text-gray-600 mb-8 line-clamp-2">{product.description}</p>
            <button 
              className="w-full py-4 bg-brand-blue text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-blue-800 transition-all flex items-center justify-center gap-3 shadow-lg group-hover:shadow-2xl"
            >
               <ShoppingCart size={20} />
               {isCustomizable ? 'Customize & Add' : 'Add to Order'}
            </button>
         </div>
      </div>
    );
  }

  // --- GRID VIEW (DEFAULT) ---
  return (
    <div className="aspect-square relative rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border-4 border-white flex flex-col group cursor-pointer">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        {/* Modern Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
      </div>

      {/* Top Badges */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md p-2.5 rounded-2xl shadow-lg text-brand-blue">
          {getIcon()}
        </div>
        {product.subCategory && (
          <div className="bg-brand-yellow/90 backdrop-blur-md px-3 py-1 rounded-full shadow-lg">
             <span className="text-brand-blue text-[10px] font-black uppercase tracking-widest">{product.subCategory}</span>
          </div>
        )}
      </div>

      {/* Bottom Content */}
      <div className="mt-auto p-6 relative z-10">
        <div className="mb-4">
          <h3 className="text-xl font-heading font-black text-white leading-tight line-clamp-1 mb-1">{product.name}</h3>
          <span className="text-brand-yellow font-black text-2xl tracking-tighter">{currencySymbol}{product.price.toFixed(2)}</span>
        </div>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="w-full bg-white hover:bg-brand-yellow text-brand-blue font-black py-3 rounded-2xl flex items-center justify-center gap-2 transition-all transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 shadow-xl"
        >
          <Plus size={18} />
          {isCustomizable ? t.shop.customize : t.shop.addToCart}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;