import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { DbCompany } from '../../types';
import { 
  Building2, Globe, TrendingUp, Users, Plus, MoreHorizontal, 
  CheckCircle, AlertCircle, DollarSign, Activity, Server
} from 'lucide-react';

const SuperAdminDashboard: React.FC = () => {
  const [companies, setCompanies] = useState<DbCompany[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      const res = await api.companies.list();
      if (res.status === 'success' && res.data) {
        setCompanies(res.data);
      }
      setLoading(false);
    };
    fetchCompanies();
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'trial': return 'bg-blue-100 text-blue-700';
      case 'suspended': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Top Banner */}
      <div className="bg-gray-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 p-10 opacity-10">
            <Globe size={300} />
         </div>
         <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
               <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
                  <Server size={24} className="text-brand-yellow" />
               </div>
               <span className="text-sm font-black uppercase tracking-[0.3em] text-gray-400">System Admin Control</span>
            </div>
            <h1 className="text-5xl font-heading font-black mb-4 tracking-tight leading-none">Global Franchise Network</h1>
            <p className="text-lg text-gray-400 font-medium">Manage multi-country tenants, subscription plans, and system-wide revenue.</p>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 relative z-10">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Total MRR</p>
               <h3 className="text-3xl font-black text-brand-yellow">$12,450</h3>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Active Tenants</p>
               <h3 className="text-3xl font-black text-white">{companies.filter(c => c.status === 'active').length}</h3>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">System Health</p>
               <div className="flex items-center gap-2 text-green-400 font-black text-xl">
                  <Activity size={24} /> 99.9% Uptime
               </div>
            </div>
         </div>
      </div>

      {/* Companies List */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
         <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
               <Building2 size={20} className="text-brand-blue" /> Registered Companies
            </h2>
            <button className="flex items-center gap-2 px-6 py-3 bg-brand-blue text-white rounded-xl font-bold shadow-lg hover:bg-blue-800 transition-all text-xs uppercase tracking-widest">
               <Plus size={16} /> New Tenant
            </button>
         </div>
         
         <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {companies.map(company => (
                  <div key={company.id} className="group bg-white border-2 border-gray-100 hover:border-brand-blue rounded-3xl p-6 transition-all hover:shadow-xl relative overflow-hidden">
                     <div className="flex justify-between items-start mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm ${company.country === 'KH' ? 'bg-blue-50' : company.country === 'TH' ? 'bg-red-50' : 'bg-green-50'}`}>
                           {company.country === 'KH' ? '🇰🇭' : company.country === 'TH' ? '🇹🇭' : '🇮🇩'}
                        </div>
                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(company.status)}`}>
                           {company.status}
                        </div>
                     </div>
                     
                     <h3 className="text-xl font-black text-gray-900 mb-1 group-hover:text-brand-blue transition-colors">{company.name}</h3>
                     <p className="text-xs text-gray-500 font-bold mb-6">Owner: {company.ownerName}</p>
                     
                     <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 rounded-xl p-3">
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Plan</p>
                           <p className="text-sm font-bold text-gray-800 capitalize">{company.plan}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Branches</p>
                           <p className="text-sm font-bold text-gray-800">{company.totalBranches}</p>
                        </div>
                     </div>

                     <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                        <div className="text-xs text-gray-400 font-medium">
                           Expires: {new Date(company.expireDate).toLocaleDateString()}
                        </div>
                        <button className="text-brand-blue hover:bg-blue-50 p-2 rounded-lg transition-colors">
                           <MoreHorizontal size={20} />
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;