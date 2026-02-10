import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { DbOrder, DbOrderItem, DbPayment } from '../../types';
import { 
  Search, Eye, Edit, Trash2, CheckCircle, Clock, XCircle, Truck, ShoppingBag, 
  ChevronRight, Calendar, User, DollarSign, X, CreditCard
} from 'lucide-react';

const OrderManager: React.FC = () => {
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [payments, setPayments] = useState<DbPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<DbOrder['status'] | 'all'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  // Modal State
  const [selectedOrder, setSelectedOrder] = useState<DbOrder | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const [orderRes, payRes] = await Promise.all([
        api.orders.list(),
        api.payments.list()
      ]);
      
      if (orderRes.status === 'success' && orderRes.data) {
        setOrders(orderRes.data);
      }
      if (payRes.status === 'success' && payRes.data) {
        setPayments(payRes.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getOrderPayment = (orderId: string) => {
    const idInt = parseInt(orderId);
    return payments.find(p => p.orderId === idInt);
  };

  const handleStatusUpdate = async (id: string, newStatus: DbOrder['status']) => {
    setUpdatingId(id);
    try {
      const response = await api.orders.updateStatus(id, newStatus);
      if (response.status === 'success' && response.data) {
        const updatedOrder = response.data;
        setOrders(prev => prev.map(o => o.id === id ? updatedOrder : o));
        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder(updatedOrder);
        }
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        const response = await api.orders.delete(id);
        if (response.status === 'success') {
          setOrders(prev => prev.filter(o => o.id !== id));
          if (selectedOrder?.id === id) setIsDetailsOpen(false);
        }
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    }
  };

  const handleViewDetails = (order: DbOrder) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'preparing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'canceled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
           <p className="text-gray-500">Track and manage customer orders.</p>
        </div>
        <button 
          onClick={fetchOrders}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
           <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
             {['all', 'pending', 'preparing', 'completed', 'canceled'].map((status) => (
               <button
                 key={status}
                 onClick={() => setStatusFilter(status as any)}
                 className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-colors ${
                   statusFilter === status ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                 }`}
               >
                 {status}
               </button>
             ))}
           </div>
           <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
             <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
             </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => {
                  const p = getOrderPayment(order.id);
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <ShoppingBag size={16} className="text-gray-400 mr-2" />
                          <div>
                            <p className="text-sm font-bold text-gray-900">{order.orderNumber}</p>
                            <p className="text-[10px] text-gray-500 capitalize">{order.customerName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {p ? (
                          <div className="flex items-center gap-1.5">
                             <CreditCard size={14} className={p.paymentStatus === 'paid' ? 'text-green-500' : 'text-amber-500'} />
                             <span className={`text-[10px] font-bold uppercase tracking-tighter ${p.paymentStatus === 'paid' ? 'text-green-700' : 'text-amber-700'}`}>
                               {p.paymentMethod} • {p.paymentStatus}
                             </span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">UNPAID (CASH)</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[11px] text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                        <div className="text-[10px]">{new Date(order.createdAt).toLocaleTimeString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value as DbOrder['status'])}
                          className={`appearance-none px-3 py-1 rounded-full text-xs font-bold border transition-all ${getStatusColor(order.status)}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="preparing">Preparing</option>
                          <option value="completed">Completed</option>
                          <option value="canceled">Canceled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleViewDetails(order)} className="text-brand-blue hover:text-blue-900 p-1">
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Details Modal (Simplified for brevity, similar to before) */}
      {isDetailsOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
           <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in-up">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                 <h3 className="font-bold text-gray-900">Order Details: {selectedOrder.orderNumber}</h3>
                 <button onClick={() => setIsDetailsOpen(false)}><X size={20} /></button>
              </div>
              <div className="p-6">
                 {/* Itemized summary here... */}
                 <div className="bg-blue-50 p-4 rounded-xl mb-4 flex justify-between items-center">
                    <span className="font-bold text-brand-blue">Total to Collect:</span>
                    <span className="text-xl font-heading font-extrabold text-brand-blue">${selectedOrder.totalAmount.toFixed(2)}</span>
                 </div>
                 <div className="space-y-2">
                    <p className="text-sm text-gray-600"><strong>Customer:</strong> {selectedOrder.customerName}</p>
                    <p className="text-sm text-gray-600"><strong>Type:</strong> <span className="capitalize">{selectedOrder.orderType}</span></p>
                    <p className="text-sm text-gray-600"><strong>Status:</strong> <span className="capitalize">{selectedOrder.status}</span></p>
                 </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
                 <button onClick={() => setIsDetailsOpen(false)} className="px-4 py-2 text-gray-600">Close</button>
                 <button onClick={() => handleStatusUpdate(selectedOrder.id, 'completed')} className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold">Mark Completed</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default OrderManager;