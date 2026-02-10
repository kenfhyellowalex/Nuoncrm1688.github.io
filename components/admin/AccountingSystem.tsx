import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { DbExpense, AccountingStats } from '../../types';
import { 
  DollarSign, TrendingUp, TrendingDown, PieChart, 
  FileText, Plus, Trash2, Calendar, Download, 
  ArrowUpRight, ArrowDownRight, Activity, Receipt, ShoppingBasket
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AccountingSystem: React.FC = () => {
  const [stats, setStats] = useState<AccountingStats | null>(null);
  const [expenses, setExpenses] = useState<DbExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    name: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'rent',
    note: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, expRes] = await Promise.all([
        api.reports.financials(),
        api.expenses.list()
      ]);
      
      if (statsRes.status === 'success' && statsRes.data) setStats(statsRes.data);
      if (expRes.status === 'success' && expRes.data) setExpenses(expRes.data);
    } catch (error) {
      console.error("Financial Data Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.name || !newExpense.amount) return;

    try {
      const res = await api.expenses.create({
        ...newExpense,
        amount: parseFloat(newExpense.amount)
      });
      if (res.status === 'success') {
        setIsModalOpen(false);
        setNewExpense({ name: '', amount: '', date: new Date().toISOString().split('T')[0], category: 'rent', note: '' });
        fetchData(); // Refresh stats
      }
    } catch (err) {
      alert("Failed to add expense");
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (window.confirm("Remove this expense record?")) {
      await api.expenses.delete(id);
      fetchData();
    }
  };

  // Mock data for the chart since we only have aggregated totals in the mock API
  const chartData = [
    { name: 'Mon', revenue: 4000, cost: 2400 },
    { name: 'Tue', revenue: 3000, cost: 1800 },
    { name: 'Wed', revenue: 2000, cost: 1200 },
    { name: 'Thu', revenue: 2780, cost: 1600 },
    { name: 'Fri', revenue: 1890, cost: 1100 },
    { name: 'Sat', revenue: 2390, cost: 1400 },
    { name: 'Sun', revenue: 3490, cost: 2100 },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-3xl font-heading font-black text-gray-900 uppercase italic tracking-tighter">Profit & Loss</h2>
           <p className="text-gray-500 font-medium">Real-time financial health monitoring.</p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors">
              <Download size={18} /> Export PDF
           </button>
           <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-brand-blue text-white rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-lg">
              <Plus size={18} /> Add Expense
           </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {/* Revenue */}
         <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
               <DollarSign size={80} className="text-brand-blue" />
            </div>
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-blue-50 text-brand-blue rounded-lg"><TrendingUp size={20} /></div>
               <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Sales</span>
            </div>
            <h3 className="text-3xl font-heading font-black text-gray-900">${stats?.totalRevenue.toLocaleString() ?? '0.00'}</h3>
            <p className="text-xs font-bold text-green-500 mt-1 flex items-center gap-1"><ArrowUpRight size={12} /> Gross Revenue</p>
         </div>

         {/* COGS */}
         <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
               <ShoppingBasket size={80} className="text-amber-600" />
            </div>
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Activity size={20} /></div>
               <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Cost of Goods</span>
            </div>
            <h3 className="text-3xl font-heading font-black text-gray-900">${stats?.totalCOGS.toLocaleString() ?? '0.00'}</h3>
            <p className="text-xs font-bold text-amber-600 mt-1 flex items-center gap-1">Product Costs</p>
         </div>

         {/* Expenses */}
         <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
               <Receipt size={80} className="text-red-500" />
            </div>
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-red-50 text-red-500 rounded-lg"><ArrowDownRight size={20} /></div>
               <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Op. Expenses</span>
            </div>
            <h3 className="text-3xl font-heading font-black text-gray-900">${stats?.totalExpenses.toLocaleString() ?? '0.00'}</h3>
            <p className="text-xs font-bold text-red-500 mt-1 flex items-center gap-1">Rent, Salary, etc.</p>
         </div>

         {/* NET PROFIT */}
         <div className={`p-6 rounded-[2rem] shadow-lg relative overflow-hidden group text-white ${ (stats?.netProfit || 0) >= 0 ? 'bg-green-600' : 'bg-red-600' }`}>
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
               <PieChart size={80} className="text-white" />
            </div>
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-white/20 rounded-lg"><DollarSign size={20} /></div>
               <span className="text-xs font-black text-white/80 uppercase tracking-widest">Net Profit</span>
            </div>
            <h3 className="text-3xl font-heading font-black text-white">${stats?.netProfit.toLocaleString() ?? '0.00'}</h3>
            <p className="text-xs font-bold text-white/80 mt-1 flex items-center gap-1">
               Margin: {stats?.profitMargin.toFixed(1)}%
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Profit Chart */}
         <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h3 className="text-lg font-black text-gray-900 mb-6 uppercase tracking-tight">Revenue vs Cost Flow</h3>
            <div className="h-80 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                     <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#0047AB" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#0047AB" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#EF4444" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#9CA3AF'}} />
                     <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#9CA3AF'}} />
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                     <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}} />
                     <Area type="monotone" dataKey="revenue" stroke="#0047AB" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" name="Revenue" />
                     <Area type="monotone" dataKey="cost" stroke="#EF4444" strokeWidth={3} fillOpacity={1} fill="url(#colorCost)" name="Total Cost" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Expense List */}
         <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
               <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Recent Expenses</h3>
               <span className="text-xs font-bold bg-white px-3 py-1 rounded-full text-gray-500 shadow-sm">{expenses.length} Records</span>
            </div>
            <div className="flex-grow overflow-y-auto max-h-[400px] p-2 custom-scrollbar">
               {expenses.map(exp => (
                  <div key={exp.id} className="p-4 mb-2 bg-white hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100 group flex justify-between items-center">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center font-bold text-xs uppercase">
                           {exp.category.substring(0,2)}
                        </div>
                        <div>
                           <p className="font-bold text-sm text-gray-900">{exp.name}</p>
                           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(exp.date).toLocaleDateString()}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="font-black text-gray-900">-${exp.amount.toFixed(2)}</p>
                        <button onClick={() => handleDeleteExpense(exp.id)} className="text-[10px] text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity uppercase font-bold">Remove</button>
                     </div>
                  </div>
               ))}
               {expenses.length === 0 && (
                  <div className="text-center py-10 text-gray-400">
                     <FileText size={40} className="mx-auto mb-2 opacity-30" />
                     <p className="text-xs font-bold uppercase">No Expenses Recorded</p>
                  </div>
               )}
            </div>
         </div>
      </div>

      {/* Add Expense Modal */}
      {isModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden animate-fade-in-up shadow-2xl">
               <div className="bg-brand-blue p-6 text-white flex justify-between items-center">
                  <h3 className="text-xl font-heading font-black uppercase italic">Log Expense</h3>
                  <button onClick={() => setIsModalOpen(false)}><Plus size={24} className="rotate-45" /></button>
               </div>
               <form onSubmit={handleAddExpense} className="p-8 space-y-4">
                  <div>
                     <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Expense Name</label>
                     <input 
                        type="text" required
                        value={newExpense.name}
                        onChange={e => setNewExpense({...newExpense, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-brand-blue outline-none font-bold"
                        placeholder="e.g. Rent Payment"
                     />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Amount ($)</label>
                        <input 
                           type="number" required
                           value={newExpense.amount}
                           onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
                           className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-brand-blue outline-none font-bold"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Category</label>
                        <select 
                           value={newExpense.category}
                           onChange={e => setNewExpense({...newExpense, category: e.target.value as any})}
                           className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-brand-blue outline-none font-bold"
                        >
                           <option value="rent">Rent</option>
                           <option value="utilities">Utilities</option>
                           <option value="salary">Salary</option>
                           <option value="marketing">Marketing</option>
                           <option value="other">Other</option>
                        </select>
                     </div>
                  </div>
                  <div>
                     <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Date</label>
                     <input 
                        type="date" required
                        value={newExpense.date}
                        onChange={e => setNewExpense({...newExpense, date: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-brand-blue outline-none font-bold"
                     />
                  </div>
                  <button type="submit" className="w-full py-4 bg-brand-blue hover:bg-blue-800 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-lg mt-4">
                     Save Record
                  </button>
               </form>
            </div>
         </div>
      )}
    </div>
  );
};

export default AccountingSystem;