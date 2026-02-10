import React from 'react';
import { Server, Database, Globe, Lock, ShieldCheck, Cpu, HardDrive, Network, Terminal, ShoppingCart, Coffee, Activity } from 'lucide-react';

const DeploymentMap: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-heading font-black text-gray-900 flex items-center gap-3 italic uppercase tracking-tighter">
            <Network className="text-brand-blue" />
            Hybrid Architecture
          </h2>
          <p className="text-gray-500 text-sm font-medium mt-1">Multi-country cloud instances supporting Retail & Hospitality flows.</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100">
           <Activity size={14} className="animate-pulse" /> Live Status: Operational
        </div>
      </div>

      <div className="bg-white p-16 rounded-[4rem] border border-gray-100 shadow-sm overflow-hidden relative group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-blue via-brand-yellow to-brand-blue"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-12 relative z-10">
          
          {/* Domain Layer */}
          <div className="flex flex-col items-center gap-6 group/item">
            <div className="w-28 h-28 bg-blue-50 rounded-[2rem] flex items-center justify-center text-brand-blue border-4 border-transparent group-hover/item:border-brand-blue transition-all duration-500 shadow-sm">
              <Globe size={48} />
            </div>
            <div className="text-center">
              <p className="font-black text-gray-900 uppercase text-xs tracking-widest">Frontend Hub</p>
              <p className="text-[10px] text-gray-400 font-mono mt-1">nouncrm.com</p>
            </div>
          </div>

          <div className="hidden md:flex justify-center items-center">
            <div className="w-full h-0.5 bg-gray-100 relative">
               <div className="absolute top-1/2 left-0 w-1/2 h-1 bg-brand-blue -translate-y-1/2 animate-shimmer"></div>
            </div>
          </div>

          {/* Cloud Layer */}
          <div className="flex flex-col items-center gap-6 group/item">
            <div className="w-28 h-28 bg-gray-900 rounded-[2rem] flex items-center justify-center text-white relative shadow-2xl group-hover/item:scale-105 transition-transform duration-500">
              <Server size={48} />
              <div className="absolute -top-3 -right-3 bg-green-500 w-8 h-8 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center">
                 <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
              </div>
            </div>
            <div className="text-center">
              <p className="font-black text-gray-900 uppercase text-xs tracking-widest">Nginx Cluster</p>
              <p className="text-[10px] text-gray-400 font-mono mt-1">v1.24 Mainline</p>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-center gap-2">
            <div className="w-0.5 h-16 bg-gradient-to-b from-gray-100 to-transparent"></div>
            <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest rotate-90">API Pipeline</div>
            <div className="w-0.5 h-16 bg-gradient-to-t from-gray-100 to-transparent"></div>
          </div>

          {/* Backend Hybrid Engine */}
          <div className="flex flex-col items-center gap-6 group/item">
             <div className="relative">
                <div className="w-36 h-36 bg-white rounded-[2.5rem] flex flex-col items-center justify-center text-brand-blue border-[6px] border-brand-light shadow-[0_20px_50px_rgba(0,0,0,0.08)] relative z-20 group-hover/item:border-brand-yellow transition-all duration-500">
                   <Cpu size={40} className="mb-2" />
                   <span className="font-black text-[11px] uppercase tracking-tighter">Laravel 11</span>
                </div>
                {/* Branching Visuals */}
                <div className="absolute -right-8 top-1/2 w-8 h-0.5 bg-gray-100"></div>
                <div className="absolute -left-8 top-1/2 w-8 h-0.5 bg-gray-100"></div>
             </div>
             <div className="text-center">
                <p className="font-black text-gray-900 uppercase text-xs tracking-widest">Core Engine</p>
                <div className="flex gap-2 mt-2">
                   <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[8px] font-black uppercase tracking-widest border border-blue-100">E-comm</span>
                   <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md text-[8px] font-black uppercase tracking-widest border border-amber-100">POS</span>
                </div>
             </div>
          </div>

        </div>

        {/* Distributed Databases Visualization */}
        <div className="mt-20 pt-16 border-t border-gray-50 grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="bg-gray-50/50 p-8 rounded-[2.5rem] border border-white shadow-inner group/db hover:bg-white hover:shadow-xl transition-all">
              <Database size={24} className="text-brand-blue mb-4" />
              <h4 className="font-black text-gray-900 uppercase text-xs tracking-widest mb-2">MySQL Master</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">Central Product & User Registry. ACID Compliant Transactions.</p>
           </div>
           <div className="bg-gray-50/50 p-8 rounded-[2.5rem] border border-white shadow-inner group/db hover:bg-white hover:shadow-xl transition-all">
              <HardDrive size={24} className="text-amber-600 mb-4" />
              <h4 className="font-black text-gray-900 uppercase text-xs tracking-widest mb-2">Redis Cache</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">Sub-millisecond Session Management & Rate Limiting.</p>
           </div>
           <div className="bg-gray-50/50 p-8 rounded-[2.5rem] border border-white shadow-inner group/db hover:bg-white hover:shadow-xl transition-all">
              <Lock size={24} className="text-green-600 mb-4" />
              <h4 className="font-black text-gray-900 uppercase text-xs tracking-widest mb-2">S3 Assets</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">Object Storage for Global Image CDN (TH / ID / KH).</p>
           </div>
        </div>

        <div className="absolute bottom-0 right-0 p-12 opacity-[0.03] pointer-events-none">
           <Network size={400} />
        </div>
      </div>

      {/* System Upgrades Alert */}
      <div className="bg-brand-blue p-8 rounded-[2.5rem] text-white flex items-center justify-between shadow-2xl relative overflow-hidden">
         <div className="flex items-center gap-6 relative z-10">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
               <ShieldCheck className="text-brand-yellow" size={28} />
            </div>
            <div>
               <h4 className="text-lg font-black uppercase tracking-tight italic">Enterprise Shield Active</h4>
               <p className="text-blue-200 text-[11px] font-bold uppercase tracking-widest mt-1">Real-time threat monitoring & Input Sanitization Enabled</p>
            </div>
         </div>
         <button className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10">
            Audit Logs
         </button>
      </div>
    </div>
  );
};

export default DeploymentMap;
