import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Loader, TrendingUp, TrendingDown, AlertTriangle, 
  ShoppingBag, Brain, Calendar, DollarSign, Package, ArrowRight,
  Activity
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../../services/api';
import { generateCRMInsight } from '../../services/geminiService';
import { PredictionStats } from '../../types';

const AISalesIntelligence: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'prediction' | 'strategy'>('prediction');
  const [predictions, setPredictions] = useState<PredictionStats | null>(null);
  const [loadingPred, setLoadingPred] = useState(true);
  
  // Strategy State
  const [strategyInsight, setStrategyInsight] = useState<string | null>(null);
  const [loadingStrategy, setLoadingStrategy] = useState(false);

  useEffect(() => {
    const fetchPredictions = async () => {
      setLoadingPred(true);
      try {
        const res = await api.predictions.get();
        if (res.status === 'success' && res.data) {
          setPredictions(res.data);
        }
      } catch (e) {
        console.error("Prediction API Error", e);
      } finally {
        setLoadingPred(false);
      }
    };
    fetchPredictions();
  }, []);

  const generateStrategy = async () => {
    setLoadingStrategy(true);
    try {
      const [salesRes, custRes] = await Promise.all([
        api.reports.daily(),
        api.customers.list()
      ]);
      if (salesRes.data && custRes.data) {
        const result = await generateCRMInsight(salesRes.data, custRes.data);
        setStrategyInsight(result);
      }
    } catch (e) {
      setStrategyInsight("Unable to generate strategy. Please check API connection.");
    } finally {
      setLoadingStrategy(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-100 pb-6">
        <div>
           <h2 className="text-3xl font-heading font-black text-gray-900 flex items-center gap-3 italic uppercase tracking-tighter">
              <Brain className="text-brand-blue" />
              AI Sales Core
           </h2>
           <p className="text-gray-500 font-medium mt-1">Predictive analytics and smart inventory forecasting.</p>
        </div>
        <div className="flex bg-gray-100 p-1.5 rounded-xl">
           <button 
             onClick={() => setActiveTab('prediction')}
             className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'prediction' ? 'bg-white shadow-md text-brand-blue' : 'text-gray-500 hover:text-gray-900'}`}
           >
             Sales Forecast
           </button>
           <button 
             onClick={() => setActiveTab('strategy')}
             className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'strategy' ? 'bg-white shadow-md text-brand-blue' : 'text-gray-500 hover:text-gray-900'}`}
           >
             Strategy Analyst
           </button>
        </div>
      </div>

      {activeTab === 'prediction' && (
        <div className="space-y-8">
           {loadingPred ? (
             <div className="h-96 flex flex-col items-center justify-center text-gray-400">
                <Loader className="animate-spin mb-4" size={40} />
                <p className="font-bold uppercase tracking-widest text-xs">Crunching numbers...</p>
             </div>
           ) : !predictions ? (
             <div className="text-center py-20 bg-gray-50 rounded-3xl">
                <p>No prediction data available.</p>
             </div>
           ) : (
             <>
               {/* Tomorrow's Snapshot */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-brand-blue p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                        <DollarSign size={80} />
                     </div>
                     <p className="text-blue-200 text-xs font-black uppercase tracking-widest mb-1">Predicted Sales (Tmrw)</p>
                     <h3 className="text-4xl font-heading font-black">${predictions.tomorrowRevenue}</h3>
                     <div className="mt-4 inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold">
                        <TrendingUp size={12} className="text-green-400" /> +15% vs Avg
                     </div>
                  </div>

                  <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                        <Activity size={80} className="text-green-500" />
                     </div>
                     <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Expected Profit</p>
                     <h3 className="text-4xl font-heading font-black text-gray-900">${predictions.tomorrowProfit}</h3>
                     <div className="mt-4 inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold">
                        Est. Margin 32%
                     </div>
                  </div>

                  <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                        <Package size={80} className="text-red-500" />
                     </div>
                     <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Stock Alerts</p>
                     <h3 className="text-4xl font-heading font-black text-red-500">{predictions.restockAlerts.length}</h3>
                     <div className="mt-4 inline-flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1 rounded-full text-[10px] font-bold">
                        Action Required
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Weekly Forecast Chart */}
                  <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                     <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-6 flex items-center gap-2">
                        <Calendar className="text-brand-blue" size={20} /> 7-Day Forecast
                     </h3>
                     <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={predictions.weeklyForecast}>
                              <defs>
                                 <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0047AB" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#0047AB" stopOpacity={0}/>
                                 </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10, fontWeight: 'bold'}} />
                              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10, fontWeight: 'bold'}} />
                              <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}} />
                              <Area type="monotone" dataKey="revenue" stroke="#0047AB" strokeWidth={3} fillOpacity={1} fill="url(#colorPred)" />
                           </AreaChart>
                        </ResponsiveContainer>
                     </div>
                  </div>

                  {/* Restock Alerts */}
                  <div className="bg-red-50 border-2 border-red-100 p-8 rounded-[2.5rem]">
                     <h3 className="text-lg font-black text-red-800 uppercase tracking-tight mb-6 flex items-center gap-2">
                        <AlertTriangle className="text-red-600" size={20} /> Smart Restock
                     </h3>
                     <div className="space-y-4">
                        {predictions.restockAlerts.map((alert, idx) => (
                           <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center">
                              <div>
                                 <p className="font-bold text-gray-900 text-sm">{alert.productName}</p>
                                 <p className="text-[10px] text-red-500 font-bold uppercase tracking-wide">Stock: {alert.currentStock} / Pred: {alert.predictedDemand}</p>
                              </div>
                              <button className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors">
                                 <ShoppingBag size={16} />
                              </button>
                           </div>
                        ))}
                        {predictions.restockAlerts.length === 0 && (
                           <p className="text-center text-red-400 text-sm font-medium">Inventory levels healthy.</p>
                        )}
                     </div>
                  </div>
               </div>

               {/* Product Predictions */}
               <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                  <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-6 flex items-center gap-2">
                     <TrendingUp className="text-green-500" size={20} /> Product Demand Forecast
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                     {predictions.topProducts.map((prod, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                           <div>
                              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Rank #{idx + 1}</p>
                              <p className="font-bold text-gray-900">{prod.name}</p>
                           </div>
                           <div className="text-right">
                              <p className="font-black text-lg text-brand-blue">{prod.predictedQty}</p>
                              <div className={`flex items-center justify-end gap-1 text-[10px] font-bold uppercase ${prod.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                                 {prod.trend === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                 {prod.trend}
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
             </>
           )}
        </div>
      )}

      {activeTab === 'strategy' && (
        <div className="max-w-4xl mx-auto">
           <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 text-center mb-8">
              <Sparkles size={48} className="mx-auto text-brand-yellow mb-4" />
              <h3 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter mb-2">AI Business Strategist</h3>
              <p className="text-gray-500 mb-8 max-w-lg mx-auto">Generate qualitative insights based on cross-regional sales data and customer behavior using Gemini 1.5 Flash.</p>
              
              <button 
                onClick={generateStrategy}
                disabled={loadingStrategy}
                className="px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-lg hover:bg-black transition-all flex items-center justify-center gap-3 mx-auto disabled:opacity-50"
              >
                 {loadingStrategy ? <Loader className="animate-spin" /> : <Brain />}
                 {loadingStrategy ? "Analyzing Market Data..." : "Run Strategic Analysis"}
              </button>
           </div>

           {strategyInsight && (
              <div className="bg-brand-blue text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-fade-in-up">
                 <div className="absolute top-0 right-0 p-10 opacity-10">
                    <Activity size={200} />
                 </div>
                 <div className="relative z-10">
                    <h4 className="text-lg font-black uppercase tracking-widest text-brand-yellow mb-6">Strategic Report</h4>
                    <div className="prose prose-invert max-w-none font-medium leading-relaxed whitespace-pre-line">
                       {strategyInsight}
                    </div>
                 </div>
              </div>
           )}
        </div>
      )}
    </div>
  );
};

export default AISalesIntelligence;