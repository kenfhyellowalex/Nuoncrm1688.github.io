import React, { useState, useEffect } from 'react';
import { 
  Clock, CheckCircle, ChefHat, Timer, AlertCircle, 
  RefreshCw, Utensils, Coffee, ShoppingBasket, Bell, 
  ChevronRight, Play, Check, Flame
} from 'lucide-react';
import { api } from '../../services/api';
import { DbOrder } from '../../types';

const KitchenKDS: React.FC = () => {
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchKitchenOrders = async () => {
    setIsRefreshing(true);
    try {
      const res = await api.orders.list();
      if (res.status === 'success' && res.data) {
        // Kitchen only sees orders that are 'preparing' (accepted by POS)
        // 'pending' orders stay in POS until accepted.
        const kitchenOnly = res.data.filter(o => o.status === 'preparing');
        setOrders(kitchenOnly);
      }
    } catch (err) {
      console.error("KDS Sync Error:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchKitchenOrders();
    const interval = setInterval(fetchKitchenOrders, 10000); // Auto-refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const handleMarkDone = async (orderId: string) => {
    // Optimistic UI update
    setOrders(prev => prev.filter(o => o.id !== orderId));
    await api.orders.updateStatus(orderId, 'completed');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-white">
        <LoaderPinwheel className="animate-spin text-brand-yellow mb-4" size={48} />
        <p className="font-black uppercase tracking-widest text-xs opacity-50">Syncing Kitchen Cloud...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white -m-6 md:-m-12 p-6 md:p-10 animate-fade-in">
      {/* KDS Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 border-b border-white/5 pb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-brand-yellow rounded-2xl flex items-center justify-center text-brand-blue shadow-lg shadow-yellow-500/10">
            <ChefHat size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-heading font-black uppercase italic tracking-tighter leading-none">Kitchen Hub</h1>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Live Prep Terminal • NOUN CRM</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Active Tickets</p>
              <p className="text-xl font-black text-brand-yellow leading-none mt-1">{orders.length}</p>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <button 
              onClick={fetchKitchenOrders}
              className={`p-2 hover:bg-white/10 rounded-xl transition-all ${isRefreshing ? 'animate-spin' : ''}`}
            >
              <RefreshCw size={20} className="text-blue-400" />
            </button>
          </div>
          <button className="bg-red-600 hover:bg-red-500 p-4 rounded-2xl shadow-xl transition-all animate-pulse">
            <Bell size={24} />
          </button>
        </div>
      </div>

      {/* Ticket Grid */}
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] opacity-20">
           <Flame size={120} className="mb-6" />
           <h2 className="text-4xl font-black uppercase italic italic tracking-tighter">Kitchen Clear</h2>
           <p className="font-bold uppercase tracking-widest text-sm mt-2 text-blue-400">Waiting for accepted orders...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="bg-gray-900 rounded-[2rem] overflow-hidden border-2 border-blue-500/50 transition-all flex flex-col shadow-2xl"
            >
              {/* Ticket Header */}
              <div className="p-5 flex justify-between items-start bg-blue-600/10">
                <div>
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded bg-blue-600 text-white">
                     PREPARING
                   </span>
                   <h3 className="text-2xl font-black mt-2">#{order.orderNumber.split('-')[1]}</h3>
                   {order.source === 'online' && (
                     <span className="text-[9px] font-bold text-blue-300 uppercase tracking-wider block mt-1">ONLINE ORDER</span>
                   )}
                </div>
                <div className="text-right">
                   <div className="flex items-center gap-1 text-gray-400 font-bold text-xs uppercase tracking-tighter">
                      <Clock size={12} />
                      {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                   </div>
                   <div className="flex items-center gap-1 text-brand-yellow font-black text-xs uppercase tracking-tighter mt-1">
                      <Timer size={12} />
                      {/* Simulating time ago since accept */}
                      2m ago
                   </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6 flex-grow space-y-4">
                 <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Description</p>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Qty</p>
                 </div>
                 
                 {/* Map actual items if available, or fallback for demo */}
                 {order.items && order.items.length > 0 ? (
                    order.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-start group cursor-pointer">
                         <div className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded border-2 border-white/20 mt-1 flex items-center justify-center group-hover:border-brand-yellow transition-colors">
                               <Check size={12} className="opacity-0 group-hover:opacity-100 text-brand-yellow" />
                            </div>
                            <div>
                               <p className="text-lg font-black uppercase leading-none tracking-tight">{item.productName || 'Unknown Item'}</p>
                               {/* Options mock */}
                               <p className="text-[10px] text-brand-yellow font-bold uppercase mt-1">Standard</p>
                            </div>
                         </div>
                         <p className="text-xl font-black text-blue-400 italic">x{item.quantity}</p>
                      </div>
                    ))
                 ) : (
                    [1, 2].map((_, i) => (
                      <div key={i} className="flex justify-between items-start group cursor-pointer">
                         <div className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded border-2 border-white/20 mt-1 flex items-center justify-center group-hover:border-brand-yellow transition-colors">
                               <Check size={12} className="opacity-0 group-hover:opacity-100 text-brand-yellow" />
                            </div>
                            <div>
                               <p className="text-lg font-black uppercase leading-none tracking-tight">Demo Item {i+1}</p>
                            </div>
                         </div>
                         <p className="text-xl font-black text-blue-400 italic">x1</p>
                      </div>
                    ))
                 )}
              </div>

              {/* Interaction Footer */}
              <div className="p-4 bg-black/40 border-t border-white/5">
                <button 
                  onClick={() => handleMarkDone(order.id)}
                  className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle size={18} />
                  BUMP TICKET (DONE)
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* KDS Stats Footer */}
      <div className="fixed bottom-6 left-10 right-10 bg-gray-900/80 backdrop-blur-xl p-4 rounded-3xl border border-white/10 flex justify-between items-center z-50">
         <div className="flex gap-8 px-4">
            <div className="flex flex-col">
               <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Avg Prep Time</span>
               <span className="text-sm font-black text-green-400 italic">12.4 MINS</span>
            </div>
            <div className="flex flex-col border-l border-white/10 pl-8">
               <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Completed Today</span>
               <span className="text-sm font-black text-blue-400 italic">142 ORDERS</span>
            </div>
         </div>
         <div className="flex items-center gap-3 bg-black/40 px-6 py-2 rounded-2xl border border-white/5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Gateway Connected</span>
         </div>
      </div>
    </div>
  );
};

const LoaderPinwheel = ({ className, size }: { className?: string, size?: number }) => (
  <svg 
    className={className} 
    width={size} height={size} 
    viewBox="0 0 24 24" fill="none" 
    stroke="currentColor" strokeWidth="2" 
    strokeLinecap="round" strokeLinejoin="round"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default KitchenKDS;