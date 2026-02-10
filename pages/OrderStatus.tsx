import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { DbOrder, DbPayment, Translations } from '../types';
import { 
  CheckCircle, Clock, Truck, Package, ArrowLeft, 
  RefreshCw, MapPin, ShoppingBag, Phone, CreditCard, Banknote
} from 'lucide-react';

interface OrderStatusProps {
  orderNumber: string;
  onNavigate: (page: string) => void;
  t: Translations;
  currencySymbol: string;
}

const OrderStatus: React.FC<OrderStatusProps> = ({ orderNumber, onNavigate, t, currencySymbol }) => {
  const [order, setOrder] = useState<DbOrder | null>(null);
  const [payment, setPayment] = useState<DbPayment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const response = await api.orders.list();
      if (response.status === 'success' && response.data) {
        const found = response.data.find(o => o.orderNumber === orderNumber);
        if (found) {
          setOrder(found);
          // Also try to find payment for this order
          const payRes = await api.payments.list();
          if (payRes.status === 'success' && payRes.data) {
            const orderIdInt = parseInt(found.id);
            const p = payRes.data.find(item => item.orderId === orderIdInt);
            setPayment(p || null);
          }
        } else {
          setError("Order not found.");
        }
      }
    } catch (err) {
      setError("Failed to fetch order status.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, [orderNumber]);

  if (loading && !order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <RefreshCw className="animate-spin text-brand-blue mb-4" size={40} />
        <p className="text-gray-500">Retrieving order information...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl mb-8">
           <h2 className="text-xl font-bold mb-2">Oops!</h2>
           <p>{error || "We couldn't find that order reference."}</p>
        </div>
        <button onClick={() => onNavigate('home')} className="font-bold text-brand-blue flex items-center justify-center gap-2 mx-auto">
          <ArrowLeft size={18} /> Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-fade-in-up">
      <div className="flex justify-between items-center mb-8">
        <button onClick={() => onNavigate('shop')} className="text-gray-500 hover:text-brand-blue flex items-center gap-2 transition-colors">
          <ArrowLeft size={18} /> Back to Shop
        </button>
        <div className="flex items-center gap-4">
           {payment ? (
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${payment.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {payment.paymentStatus === 'paid' ? <CheckCircle size={12} /> : <Clock size={12} />}
                Payment: {payment.paymentStatus}
              </span>
           ) : (
             <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Unpaid / Cash</span>
           )}
           <button onClick={fetchStatus} className="text-brand-blue text-sm font-bold flex items-center gap-1">
             <RefreshCw size={14} /> Refresh
           </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8">
        <div className="bg-brand-blue text-white p-8">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-200 text-sm uppercase font-bold tracking-widest mb-1">Order Tracking</p>
              <h1 className="text-3xl font-heading font-extrabold">{order.orderNumber}</h1>
            </div>
            <div className="text-right">
              <p className="text-blue-200 text-sm mb-1">Total Amount</p>
              <p className="text-2xl font-bold">{currencySymbol}{order.totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="p-8 border-b border-gray-100">
           {/* Step progress UI remains the same... */}
           <div className="relative">
              <div className="absolute top-5 left-0 w-full h-1 bg-gray-100 -z-10"></div>
              <div 
                className="absolute top-5 left-0 h-1 bg-brand-yellow transition-all duration-1000 -z-10"
                style={{ width: order.status === 'completed' ? '100%' : order.status === 'preparing' ? '50%' : '10%' }}
              ></div>
              <div className="flex justify-between items-start">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-md transition-colors ${order.status === 'pending' || order.status === 'preparing' || order.status === 'completed' ? 'bg-brand-yellow text-brand-blue' : 'bg-gray-200 text-gray-400'}`}>
                    <Clock size={18} />
                  </div>
                  <p className="mt-3 text-xs font-bold uppercase text-gray-900">Pending</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-md transition-colors ${order.status === 'preparing' || order.status === 'completed' ? 'bg-brand-yellow text-brand-blue' : 'bg-gray-200 text-gray-400'}`}>
                    <Package size={18} />
                  </div>
                  <p className={`mt-3 text-xs font-bold uppercase ${order.status === 'preparing' || order.status === 'completed' ? 'text-gray-900' : 'text-gray-400'}`}>Preparing</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-md transition-colors ${order.status === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    <CheckCircle size={18} />
                  </div>
                  <p className={`mt-3 text-xs font-bold uppercase ${order.status === 'completed' ? 'text-green-600' : 'text-gray-400'}`}>Ready</p>
                </div>
              </div>
           </div>
        </div>

        {/* Payment Summary */}
        <div className="px-8 py-6 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-2xl shadow-sm">
                 {payment?.paymentMethod === 'qr' ? <CreditCard className="text-purple-600" /> : <Banknote className="text-green-600" />}
              </div>
              <div>
                 <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Payment Method</p>
                 <p className="text-sm font-bold text-gray-800 capitalize">{payment?.paymentMethod || 'Cash'} {payment?.paymentStatus === 'paid' && '✓'}</p>
              </div>
           </div>
           {payment?.paymentStatus !== 'paid' && (
             <div className="text-amber-600 text-xs font-medium bg-amber-50 px-4 py-2 rounded-lg border border-amber-100">
               Please pay <strong>{currencySymbol}{order.totalAmount.toFixed(2)}</strong> upon arrival/delivery.
             </div>
           )}
        </div>

        <div className="p-8 space-y-6">
           {/* Order Details remains the same... */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Delivery Details</h3>
                <div className="space-y-3">
                   <div className="flex items-center gap-3 text-gray-700">
                     <MapPin size={18} className="text-brand-blue" />
                     <span className="text-sm">{order.orderType === 'pickup' ? "Store Pickup" : "Standard Delivery"}</span>
                   </div>
                   <div className="flex items-center gap-3 text-gray-700">
                     <Clock size={18} className="text-brand-blue" />
                     <span className="text-sm">{new Date(order.createdAt).toLocaleTimeString()}</span>
                   </div>
                </div>
              </div>
              <div>
                 <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Customer</h3>
                 <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-700">
                      <ShoppingBag size={18} className="text-brand-blue" />
                      <span className="text-sm">{order.customerName}</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-brand-yellow/10 border border-brand-yellow/30 p-6 rounded-2xl flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="bg-brand-yellow p-3 rounded-full text-brand-blue">
               <Phone size={24} />
            </div>
            <div>
               <h4 className="font-bold text-brand-blue">Need help?</h4>
               <p className="text-sm text-gray-600">Call us if you have any questions.</p>
            </div>
         </div>
         <a href="tel:+85512345678" className="px-6 py-2 bg-brand-blue text-white font-bold rounded-full shadow-lg">Call Support</a>
      </div>
    </div>
  );
};

export default OrderStatus;