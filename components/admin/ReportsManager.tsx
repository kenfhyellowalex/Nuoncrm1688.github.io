import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  AreaChart, Area
} from 'recharts';
import { api } from '../../services/api';
import { SalesData } from '../../types';
import { Loader, TrendingUp, Calendar, DollarSign, Award, ShoppingBag, ArrowRight } from 'lucide-react';

interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
}

const ReportsManager: React.FC = () => {
  const [dailyData, setDailyData] = useState<SalesData[]>([]);
  const [monthlyData, setMonthlyData] = useState<SalesData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Mocking some rich data for the report view
        const [dailyRes] = await Promise.all([
          api.reports.daily()
        ]);
        
        if (dailyRes.status === 'success' && dailyRes.data) {
          setDailyData(dailyRes.data);
          setMonthlyData([
            { name: 'Jan', coffee: 4500, mart: 2100, total: 6600 },
            { name: 'Feb', coffee: 5200, mart: 2400, total: 7600 },
            { name: 'Mar', coffee: 4800, mart: 3100, total: 7900 },
            { name: 'Apr', coffee: 6100, mart: 3800, total: 9900 },
          ]);
          setTopProducts([
            { id: '1', name: 'Signature Iced Latte', sales: 420, revenue: 2100 },
            { id: '2', name: 'Chef Fried Rice', sales: 310, revenue: 1550 },
            { id: '3', name: 'Premium Mineral Water', sales: 280, revenue: 280 },
            { id: '4', name: 'Fresh Croissant', sales: 250, revenue: 875 },
            { id: '5', name: 'Energy Drink Pack', sales: 120, revenue: 600 },
          ]);
        }
      } catch (error) {
        console.error("Failed to load report data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader className="animate-spin text-brand-blue mb-4" size={40} />
        <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Synchronizing Reports...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up pb-10">
      <div>
        <h2 className="text-3xl font-heading font-black text-gray-900 uppercase tracking-tighter italic">Sales Intelligence</h2>
        <p className="text-gray-500 font-medium">Granular performance data for all active segments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center">
          <div className="p-4 bg-blue-50 rounded-2xl text-brand-blue mr-5 shadow-sm">
            <DollarSign size={28} />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Gross Revenue (YTD)</p>
            <h3 className="text-3xl font-heading font-black text-gray-900">$32,000</h3>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center">
          <div className="p-4 bg-green-50 rounded-2xl text-green-600 mr-5 shadow-sm">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Growth Rate</p>
            <h3 className="text-3xl font-heading font-black text-gray-900">+18.4%</h3>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center">
          <div className="p-4 bg-brand-yellow/20 rounded-2xl text-amber-700 mr-5 shadow-sm">
            <Award size={28} />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Best Segment</p>
            <h3 className="text-3xl font-heading font-black text-gray-900">Hospitality</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
          <h3 className="text-lg font-black text-gray-900 flex items-center gap-2 uppercase italic tracking-tight mb-8">
            <Calendar size={18} className="text-brand-blue" />
            Daily Sales Flow
          </h3>
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0047AB" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0047AB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10, fontWeight: 'bold'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)'}}
                />
                <Area type="monotone" dataKey="total" stroke="#0047AB" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" name="Gross Total" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
           <h3 className="text-lg font-black text-gray-900 flex items-center gap-2 uppercase italic tracking-tight mb-8">
            <TrendingUp size={18} className="text-green-500" />
            Monthly Volume Mix
          </h3>
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10, fontWeight: 'bold'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)'}}
                  cursor={{fill: '#F9FAFB'}}
                />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase'}} />
                <Bar dataKey="coffee" stackId="a" fill="#4B2C20" name="Hospitality" radius={[0, 0, 4, 4]} />
                <Bar dataKey="mart" stackId="a" fill="#0047AB" name="Retail Mart" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Products Manager View */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
          <div>
             <h3 className="text-xl font-black text-gray-900 flex items-center gap-2 uppercase italic tracking-tighter leading-none">Menu Performance Rank</h3>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Cross-branch best sellers</p>
          </div>
          <button className="text-[10px] font-black uppercase tracking-widest text-brand-blue flex items-center gap-2 hover:translate-x-1 transition-transform">
             Export CSV <ArrowRight size={14} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Rank</th>
                <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Name</th>
                <th className="px-8 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Units</th>
                <th className="px-8 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Revenue</th>
                <th className="px-8 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Share</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {topProducts.map((product, index) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors cursor-pointer group">
                  <td className="px-8 py-5 whitespace-nowrap text-sm font-black text-gray-300 group-hover:text-brand-blue">
                    #{(index + 1).toString().padStart(2, '0')}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <span className="text-sm font-black text-gray-800">{product.name}</span>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-right text-sm font-bold text-gray-600">
                    {product.sales}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-right text-sm font-black text-brand-blue">
                    ${product.revenue.toLocaleString()}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-right">
                    <div className="w-32 bg-gray-100 rounded-full h-2 inline-block ml-auto overflow-hidden">
                      <div 
                        className="bg-brand-yellow h-2 rounded-full group-hover:bg-brand-blue transition-colors duration-500" 
                        style={{ width: `${(product.sales / (topProducts[0]?.sales || 1)) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsManager;