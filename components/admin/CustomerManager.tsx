
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Customer, ApiResponse } from '../../types';
// Fix: Added Users to the import list from lucide-react
import { Plus, Edit, Trash2, Search, X, Loader, Save, Phone, Mail, MapPin, Trophy, Star, Users } from 'lucide-react';

const CustomerManager: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Customer>>({
    name: '',
    email: '',
    phone: '',
    country: 'KH',
    favoriteItem: '',
    points: 0
  });

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await api.customers.list();
      if (response.status === 'success' && response.data) {
        setCustomers(response.data);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleOpenModal = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        country: customer.country,
        favoriteItem: customer.favoriteItem,
        points: customer.points || 0
      });
    } else {
      setEditingCustomer(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        country: 'KH',
        favoriteItem: '',
        points: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        const response = await api.customers.delete(id);
        if (response.status === 'success') {
          setCustomers(prev => prev.filter(c => c.id !== id));
        }
      } catch (error) {
        alert("Failed to delete customer");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        const response = await api.customers.update(editingCustomer.id, formData) as ApiResponse<Customer>;
        if (response.status === 'success' && response.data) {
          const updated = response.data;
          setCustomers(prev => prev.map(c => c.id === updated.id ? updated : c));
        }
      } else {
        const response = await api.customers.create(formData as any) as ApiResponse<Customer>;
        if (response.status === 'success' && response.data) {
          setCustomers(prev => [...prev, response.data!]);
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving customer:", error);
      alert("Failed to save customer");
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
           <h2 className="text-3xl font-heading font-black text-gray-900 uppercase tracking-tighter italic">Relationship Hub</h2>
           <p className="text-gray-500 font-medium">Customer behavior and loyalty management.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-brand-blue text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-blue-800 transition-all shadow-xl shadow-blue-100"
        >
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        {/* Search Bar */}
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative max-w-md flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Search by name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl outline-none transition-all font-medium"
            />
          </div>
          <div className="bg-brand-yellow/10 px-6 py-4 rounded-2xl border border-brand-yellow/30 flex items-center gap-4">
             <Trophy size={20} className="text-amber-600" />
             <div className="text-left leading-none">
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-800">Circulating Pts</p>
                <p className="text-xl font-black text-amber-700">{customers.reduce((acc, c) => acc + (c.points || 0), 0)}</p>
             </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
             <div className="flex justify-center items-center h-64">
                <Loader className="animate-spin text-brand-blue" size={32} />
             </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Profile</th>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact</th>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Loyalty Balance</th>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Preferences</th>
                  <th className="px-8 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Lifetime Value</th>
                  <th className="px-8 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="text-sm font-black text-gray-900 group-hover:text-brand-blue transition-colors">{customer.name}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Branch: {customer.country}</div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex items-center text-xs text-gray-600 font-medium mb-1">
                          <Mail size={12} className="mr-2 text-gray-400" /> {customer.email}
                        </div>
                        <div className="flex items-center text-xs text-gray-600 font-medium">
                          <Phone size={12} className="mr-2 text-gray-400" /> {customer.phone}
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-center">
                         <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full border border-amber-100 text-amber-700 font-black text-xs">
                            <Star size={12} className="fill-amber-400" />
                            {customer.points || 0} PTS
                         </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-500 font-bold text-[10px] uppercase tracking-widest border border-gray-200">{customer.favoriteItem || "N/A"}</span>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-right">
                        <div className="text-sm font-black text-brand-blue">${customer.totalSpent?.toLocaleString() || "0.00"}</div>
                        <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Last Order: {customer.lastOrderDate}</div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-right">
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => handleOpenModal(customer)}
                            className="text-blue-600 hover:bg-blue-600 hover:text-white p-2 rounded-xl transition-all"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(customer.id)}
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
                    <td colSpan={6} className="px-8 py-20 text-center">
                      <Users size={48} className="mx-auto text-gray-200 mb-4" />
                      <p className="text-gray-400 font-black uppercase italic">No Customers Detected</p>
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
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up border-8 border-white">
            <div className="flex justify-between items-center p-8 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter">
                  {editingCustomer ? 'Update Profile' : 'New Account'}
                </h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">CRM Core Sync</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="bg-white p-2 rounded-2xl shadow-sm hover:scale-110 transition-transform">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                 <div className="col-span-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Full Name</label>
                    <input 
                      type="text" required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl outline-none transition-all font-bold"
                    />
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Phone Number</label>
                    <input 
                      type="text" required
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl outline-none transition-all font-bold"
                    />
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Email</label>
                    <input 
                      type="email" required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl outline-none transition-all font-bold"
                    />
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Country / Branch</label>
                    <select 
                      value={formData.country}
                      onChange={e => setFormData({...formData, country: e.target.value as any})}
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl outline-none transition-all font-bold appearance-none"
                    >
                      <option value="KH">🇰🇭 Cambodia</option>
                      <option value="TH">🇹🇭 Thailand</option>
                      <option value="ID">🇮🇩 Indonesia</option>
                      <option value="US">🇺🇸 USA</option>
                    </select>
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1 block">Loyalty Pts</label>
                    <div className="relative">
                       <input 
                        type="number" 
                        value={formData.points}
                        onChange={e => setFormData({...formData, points: parseInt(e.target.value)})}
                        className="w-full px-5 py-4 bg-amber-50 border-2 border-transparent focus:border-brand-yellow rounded-2xl outline-none transition-all font-black text-amber-700"
                       />
                       <Star className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-yellow fill-brand-yellow" size={16} />
                    </div>
                 </div>
              </div>

              <div className="pt-6 flex flex-col gap-3">
                <button 
                  type="submit"
                  className="w-full py-5 bg-brand-blue text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-blue-200 hover:bg-blue-800 transition-all flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  COMMIT CHANGES
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-4 text-gray-400 font-black uppercase tracking-widest text-[10px] hover:text-gray-600"
                >
                  Cancel Operation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManager;
