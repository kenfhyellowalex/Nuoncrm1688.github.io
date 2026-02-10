import React from 'react';
import { Server, Database, Globe, Smartphone, Shield, Zap, Code, ChevronRight, Activity, Cpu } from 'lucide-react';

const SystemArchitecture: React.FC = () => {
  const stack = [
    { name: 'Cloud Instance', type: 'AWS/GCP', status: 'Running', icon: Globe, color: 'text-blue-500' },
    { name: 'Web Server', type: 'Nginx 1.24', status: 'Active', icon: Zap, color: 'text-green-500' },
    { name: 'API Engine', type: 'Laravel 11 (PHP 8.3)', status: 'Healthy', icon: Server, color: 'text-red-500' },
    { name: 'Primary DB', type: 'MySQL 8.0', status: 'Connected', icon: Database, color: 'text-blue-600' },
  ];

  const flutterStructure = [
    { path: 'lib/core/', desc: 'API Services & Themes', sync: 100 },
    { path: 'lib/models/', desc: 'Data Entities (Order, Product)', sync: 100 },
    { path: 'lib/providers/', desc: 'State Management (Riverpod)', sync: 85 },
    { path: 'lib/screens/', desc: 'UI Views & Navigation', sync: 40 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Cpu className="text-brand-blue" />
            Core Architecture
          </h2>
          <p className="text-gray-500 text-sm">Deployment stack and multi-platform synchronization status.</p>
        </div>
        <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
           <Activity size={12} className="animate-pulse" /> System Live
        </div>
      </div>

      {/* Stack Visualization */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stack.map((item, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-2 opacity-5 group-hover:scale-110 transition-transform ${item.color}`}>
               <item.icon size={64} />
            </div>
            <item.icon className={`${item.color} mb-3`} size={24} />
            <h3 className="font-bold text-gray-800 text-sm">{item.name}</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mb-2">{item.type}</p>
            <div className="flex items-center gap-1">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
               <span className="text-[10px] font-bold text-green-600 uppercase">{item.status}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Flutter Roadmap */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gray-900 p-6 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg text-white">
                <Smartphone size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm">Mobile Core (Flutter)</h3>
                <p className="text-[10px] text-blue-300 font-bold uppercase tracking-widest">Cross-Platform Sync</p>
              </div>
            </div>
            <button className="text-[10px] bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full font-bold transition-colors">
              VIEW REPO
            </button>
          </div>
          
          <div className="p-8">
            <div className="space-y-6">
               {flutterStructure.map((item, idx) => (
                 <div key={idx}>
                    <div className="flex justify-between items-center mb-2">
                       <div className="flex items-center gap-2">
                          <Code size={14} className="text-blue-500" />
                          <span className="text-sm font-mono font-bold text-gray-700">{item.path}</span>
                       </div>
                       <span className="text-[10px] font-black text-gray-400">{item.sync}% SYNCED</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                       <div 
                        className={`h-full transition-all duration-1000 ${item.sync === 100 ? 'bg-green-500' : 'bg-blue-500'}`} 
                        style={{ width: `${item.sync}%` }}
                       ></div>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest">{item.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Security & Middleware */}
        <div className="bg-brand-blue rounded-3xl p-8 text-white relative overflow-hidden flex flex-col">
          <div className="absolute -right-4 -bottom-4 opacity-10">
             <Shield size={160} />
          </div>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
             <Shield size={20} className="text-brand-yellow" />
             Security Layers
          </h3>
          
          <ul className="space-y-6 relative z-10">
             {[
               { label: 'HTTPS / TLS 1.3', desc: 'Encrypted Transport' },
               { label: 'Auth Middleware', desc: 'JWT Token Validation' },
               { label: 'RBAC Access', desc: 'Role-Based Permissions' },
               { label: 'Input Sanitization', desc: 'XSS & SQLi Protection' }
             ].map((layer, idx) => (
               <li key={idx} className="flex gap-4 items-start">
                  <div className="w-5 h-5 rounded-full bg-brand-yellow flex items-center justify-center flex-shrink-0 mt-0.5">
                     <ChevronRight size={12} className="text-brand-blue font-black" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{layer.label}</p>
                    <p className="text-[10px] text-blue-200 uppercase font-medium">{layer.desc}</p>
                  </div>
               </li>
             ))}
          </ul>

          <div className="mt-auto pt-10 relative z-10">
             <div className="p-4 bg-white/10 rounded-2xl border border-white/10 text-center">
                <p className="text-[10px] uppercase font-bold text-blue-300 mb-1">Database Constraint</p>
                <p className="text-xs font-mono">FOREIGN KEY / CASCADE</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemArchitecture;