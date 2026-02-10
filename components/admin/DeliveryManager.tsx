import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { DbOrder, DbRider } from '../../types';
import { 
  Bike, Truck, MapPin, Clock, CheckCircle, Navigation, 
  User, Phone, ChevronRight, AlertCircle, ShoppingBag, 
  Activity, ArrowRight, RefreshCw 
} from 'lucide-react';

const DeliveryManager: React.FC = () => {
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [riders, setRiders] = useState<DbRider[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [oRes, rRes] = await Promise.all([
        api.orders.list(),
        api.riders.list()
      ]);
      
      if (oRes.status === 'success' && oRes.data) {
        // Filter for orders that are preparing or ready and are delivery type
        const deliverable = oRes.data.filter(o => 
          o.orderType === 'delivery' && 
          ['preparing', 'ready_for_pickup'].includes(o.status) &&
          !o.riderId
        );
        setOrders(deliverable);
      }
      if (rRes.status === 'success' && rRes.data) {
        setRiders(rRes.data);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleAssignRider = async (riderId: string) => {
    if (!selectedOrder) return;
    try {
      await api.orders.assignRider(selectedOrder, riderId);
      await api.riders.acceptOrder(riderId, selectedOrder);
      
      // Optimistic Update
      setOrders(prev => prev.filter(o => o.id !== selectedOrder));
      setRiders(prev => prev.map(r => r.id === riderId ? { ...r, status: 'busy' } : r));
      setSelectedOrder(null);
    } catch (e) {
      alert("Assignment failed");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-3xl font-heading font-black text-gray-900 uppercase italic tracking-tighter">Delivery Dispatch</h2>
           <p className="text-gray-500 font-medium">Assign riders to ready orders.</p>
        </div>
        <div className="flex gap-3">
           <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 flex items-center gap-2 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-bold uppercase tracking-widest text-gray-600">
                 {riders.filter(r => r.status === 'online').length} Riders Online
              </span>
           </div>
           <button onClick={fetchData} className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-200px)]">
         
         {/* Pending Deliveries Column */}
         <div className="lg:col-span-5 flex flex-col bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
               <h3 className="font-black text-gray-900 uppercase text-sm tracking-widest flex items-center gap-2">
                  <ShoppingBag size={18} className="text-brand-blue" /> Waiting for Rider
               </h3>
               <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">{orders.length}</span>
            </div>
            
            <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar">
               {orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                     <CheckCircle size={48} className="mb-4 opacity-20" />
                     <p className="font-bold uppercase tracking-widest text-xs">All Orders Dispatched</p>
                  </div>
               ) : (
                  orders.map(order => (
                     <div 
                        key={order.id} 
                        onClick={() => setSelectedOrder(order.id)}
                        className={`p-5 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-md ${
                           selectedOrder === order.id ? 'border-brand-blue bg-blue-50 ring-4 ring-blue-100' : 'border-gray-100 bg-white hover:border-gray-200'
                        }`}
                     >
                        <div className="flex justify-between items-start mb-3">
                           <div>
                              <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Order #{order.orderNumber}</span>
                              <h4 className="font-bold text-gray-900">{order.customerName}</h4>
                           </div>
                           <span className="bg-brand-yellow/20 text-brand-blue px-2 py-1 rounded-lg text-[10px] font-black uppercase">
                              ${order.totalAmount.toFixed(2)}
                           </span>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-gray-600 bg-white p-3 rounded-xl border border-gray-100">
                           <MapPin size={14} className="mt-0.5 text-red-500 flex-shrink-0" />
                           <p className="line-clamp-2">Phnom Penh, Cambodia (Mock Address)</p>
                        </div>
                        <div className="mt-3 flex justify-between items-center text-[10px] uppercase font-bold text-gray-400 tracking-widest">
                           <span className="flex items-center gap-1"><Clock size={12} /> {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                           <span className={selectedOrder === order.id ? 'text-brand-blue' : ''}>
                              {selectedOrder === order.id ? 'Selected' : 'Click to Assign'}
                           </span>
                        </div>
                     </div>
                  ))
               )}
            </div>
         </div>

         {/* Arrow Separator (Desktop Only) */}
         <div className="hidden lg:flex flex-col items-center justify-center lg:col-span-1">
            <div className={`p-4 rounded-full transition-all ${selectedOrder ? 'bg-brand-blue text-white animate-pulse' : 'bg-gray-100 text-gray-300'}`}>
               <ArrowRight size={32} />
            </div>
         </div>

         {/* Rider Fleet Column */}
         <div className="lg:col-span-6 flex flex-col bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
               <h3 className="font-black text-gray-900 uppercase text-sm tracking-widest flex items-center gap-2">
                  <Bike size={18} className="text-green-600" /> Active Fleet
               </h3>
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar">
               {riders.map(rider => (
                  <div key={rider.id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-gray-200 bg-white transition-all">
                     <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${rider.status === 'online' ? 'bg-green-500' : rider.status === 'busy' ? 'bg-amber-500' : 'bg-gray-300'}`}>
                           {rider.vehicleType === 'motorcycle' ? <Bike size={20} /> : <Truck size={20} />}
                        </div>
                        <div>
                           <h4 className="font-bold text-gray-900 text-sm">{rider.name}</h4>
                           <div className="flex items-center gap-2 mt-1">
                              <span className={`w-2 h-2 rounded-full ${rider.status === 'online' ? 'bg-green-500' : rider.status === 'busy' ? 'bg-amber-500' : 'bg-gray-300'}`}></span>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{rider.status}</span>
                           </div>
                        </div>
                     </div>

                     <div className="text-right">
                        {rider.status === 'online' && selectedOrder ? (
                           <button 
                              onClick={() => handleAssignRider(rider.id)}
                              className="px-4 py-2 bg-brand-blue hover:bg-blue-800 text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-colors shadow-lg"
                           >
                              Assign
                           </button>
                        ) : rider.status === 'busy' ? (
                           <div className="text-[10px] font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">
                              On Delivery
                           </div>
                        ) : (
                           <span className="text-gray-300 font-bold text-xs uppercase">Unavailable</span>
                        )}
                     </div>
                  </div>
               ))}
            </div>
         </div>

      </div>
    </div>
  );
};

export default DeliveryManager;