import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { api } from '../../services/api';
import { generateCRMInsight } from '../../services/geminiService';
import { 
  Users, DollarSign, Sparkles, Loader, ShoppingBag, 
  Calendar, ArrowUpRight, ShoppingCart, Coffee, 
  Activity, Zap, Utensils, Trophy, Target
} from 'lucide-react';
import { Translations, Customer, SalesData } from '../../types';

interface DashboardHomeProps {
  t: Translations;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ t }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [insight, setInsight] = useState<string>('');
  const [loadingAI, setLoadingAI] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const [custRes, reportRes] = await Promise.all([
          api.customers.list(),
          api.reports.daily()
        ]);
        
        if (custRes.status === 'success' && custRes.data) {
          setCustomers(custRes.data);
        }
        if (reportRes.status === 'success' && reportRes.data) {
          setSalesData(reportRes.data);
        }
      } catch (error) {
        console.error("Failed to load CRM data", error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const handleGenerateInsight = async () => {
    setLoadingAI(true);
    const result = await generateCRMInsight(salesData, customers);
    setInsight(result);
    setLoadingAI(false);
  };

  const statCards = [
    { title: "Today's Revenue", value: '$1,432', change: '+12.5%', icon: DollarSign, color: 'bg-brand-blue', text: 'text-white' },
    { title: "Active Orders", value: '24', change: 'Live', icon: ShoppingBag, color: 'bg-brand-yellow', text: 'text-brand-blue' },
    { title: "Best Seller", value: 'Iced Latte', change: '42 Sold', icon: Trophy, color: 'bg-green-600', text: 'text-white' },
    { title: "Lead Segment", value: 'Coffee', change: '62% Mix', icon: Target, color: 'bg-purple-600', text: 'text-white' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10 animate-fade-in">
      {/* Header with AI Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Multi-Branch Hub • Operational</span>
          </div>
          <h2 className="text-4xl font-heading font-black text-gray-900 uppercase tracking-tighter italic leading-none">Owner Dashboard</h2>
          <p className="text-gray-500 font-medium mt-1">Global performance across Restaurant, Coffee, and Mart.</p>
        </div>
        <button 
          onClick={handleGenerateInsight}
          disabled={loadingAI || loadingData}
          className="group inline-flex items-center px-8 py-4 border border-transparent rounded-2xl shadow-2xl text-xs font-black uppercase tracking-widest text-brand-blue bg-brand-yellow hover:bg-yellow-400 transition-all disabled:opacity-50 active:scale-95"
        >
          {loadingAI ? <Loader className="animate-spin mr-2" size={18} /> : <Sparkles className="mr-2 group-hover:rotate-12 transition-transform" size={18} />}
          {loadingAI ? "Consulting AI..." : "Get Market Insight"}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className={`${card.color} rounded-3xl overflow-hidden shadow-xl hover:translate-y-[-4px] transition-all duration-300 group`}>
             <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                   <div className={`p-3 bg-white/10 rounded-xl ${card.text}`}>
                      <card.icon size={24} />
                   </div>
                   <span className={`text-[10px] font-black uppercase tracking-widest ${card.text} opacity-60`}>{card.change}</span>
                </div>
                <h3 className={`text-3xl font-heading font-black ${card.text} mb-1`}>{card.value}</h3>
                <p className={`text-[10px] font-black uppercase tracking-[0.1em] opacity-80 ${card.text}`}>{card.title}</p>
             </div>
          </div>
        ))}
      </div>

      {/* AI Strategist Panel */}
      {insight && (
        <div className="bg-gray-900 text-white rounded-[2.5rem] p-10 shadow-2xl border-l-[16px] border-brand-yellow animate-fade-in-up relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5">
             <Activity size={200} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-brand-yellow rounded-2xl text-brand-blue">
                 <Sparkles size={24} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-widest italic">AI Manager Report</h3>
            </div>
            <div className="font-mono text-base text-blue-100 leading-relaxed bg-black/40 p-8 rounded-3xl border border-white/5 whitespace-pre-wrap shadow-inner">
              {insight}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Branch Mix Chart */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-10">
             <div>
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">Weekly Sales Mix</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Volume by Business Unit</p>
             </div>
          </div>
          <div className="h-96 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" tick={{fill: '#9CA3AF', fontSize: 10, fontWeight: '900'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill: '#9CA3AF', fontSize: 10, fontWeight: '900'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)'}}
                />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase'}} />
                <Bar dataKey="coffee" fill="#4B2C20" name="Coffee Branch" radius={[6, 6, 0, 0]} />
                <Bar dataKey="mart" fill="#0047AB" name="Mini Mart Branch" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-time Branch Activity */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-8">Branch Pulse</h3>
          <div className="space-y-8">
            {[
              { name: 'Restaurant Main', status: 'Peak Hours', icon: Utensils, color: 'text-red-500', bg: 'bg-red-50', load: 85 },
              { name: 'Coffee Counter', status: 'Online', icon: Coffee, color: 'text-amber-600', bg: 'bg-amber-50', load: 42 },
              { name: 'Mini Mart S1', status: 'Syncing', icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50', load: 12 },
            ].map((branch, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${branch.bg} ${branch.color} flex items-center justify-center shadow-sm`}>
                       <branch.icon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900">{branch.name}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{branch.status}</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-gray-900">{branch.load}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                   <div className={`h-full transition-all duration-1000 ${branch.color.replace('text-', 'bg-')}`} style={{ width: `${branch.load}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-brand-light rounded-2xl border border-gray-100">
             <div className="flex items-center gap-2 mb-2">
                <Zap size={14} className="text-brand-yellow fill-brand-yellow" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Live POS Link</span>
             </div>
             <p className="text-xs text-gray-600 font-medium leading-relaxed">
               Secure WebSocket tunnel active between <strong>Flutter Terminals</strong> and <strong>Admin Core</strong>.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;