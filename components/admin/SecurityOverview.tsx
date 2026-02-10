import React from 'react';
import { Shield, Lock, UserCheck, Eye, Activity, Key, Server, Database } from 'lucide-react';

const SecurityOverview: React.FC = () => {
  const securityLayers = [
    { name: 'SSL Encryption', status: 'Active', icon: Lock, color: 'text-green-500', bg: 'bg-green-50' },
    { name: 'Auth Middleware', status: 'Enabled', icon: Shield, color: 'text-blue-500', bg: 'bg-blue-50' },
    { name: 'RBAC Logic', status: 'Strict', icon: UserCheck, color: 'text-purple-500', bg: 'bg-purple-50' },
    { name: 'Input Validation', status: 'Sanitizing', icon: Eye, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  const accessLogs = [
    { user: 'admin@nouns.com', action: 'Login Success', ip: '192.168.1.1', time: '2 mins ago', role: 'admin' },
    { user: 'staff@nouns.com', action: 'Order Update', ip: '192.168.1.4', time: '15 mins ago', role: 'staff' },
    { user: 'unknown', action: 'Login Failure', ip: '45.12.33.1', time: '1 hour ago', role: 'guest' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
           <Shield className="text-brand-blue" />
           Security & Architecture
        </h2>
        <p className="text-gray-500 text-sm">Real-time status of backend protection layers and deployment health.</p>
      </div>

      {/* Layer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {securityLayers.map((layer, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
             <div className={`p-4 rounded-2xl ${layer.bg} ${layer.color} mb-4`}>
                <layer.icon size={28} />
             </div>
             <h3 className="font-bold text-gray-800 text-sm">{layer.name}</h3>
             <span className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${layer.color}`}>{layer.status}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Auth Logs */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
               <Activity size={18} className="text-brand-blue" />
               Recent Security Events
            </h3>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Last 24 Hours</span>
          </div>
          <div className="divide-y divide-gray-100">
             {accessLogs.map((log, idx) => (
               <div key={idx} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                     <div className={`w-2 h-2 rounded-full ${log.action.includes('Failure') ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                     <div>
                        <p className="text-sm font-bold text-gray-800">{log.user}</p>
                        <p className="text-[10px] text-gray-400">IP: {log.ip} • {log.time}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter ${log.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                        {log.role}
                     </span>
                     <p className={`text-[11px] font-medium mt-1 ${log.action.includes('Failure') ? 'text-red-600' : 'text-green-600'}`}>{log.action}</p>
                  </div>
               </div>
             ))}
          </div>
        </div>

        {/* Infrastructure Info */}
        <div className="bg-brand-blue rounded-2xl p-8 text-white flex flex-col justify-between relative overflow-hidden">
           <div className="absolute -right-10 -bottom-10 opacity-10">
              <Server size={200} />
           </div>
           <div className="relative z-10">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                 <Server size={20} /> Deployment Cloud
              </h3>
              <div className="space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-xl"><Database size={20} /></div>
                    <div>
                       <p className="text-xs text-blue-200">Database Engine</p>
                       <p className="text-sm font-bold">PostgreSQL Cluster</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-xl"><Key size={20} /></div>
                    <div>
                       <p className="text-xs text-blue-200">API Framework</p>
                       <p className="text-sm font-bold">Node.js (NextGen)</p>
                    </div>
                 </div>
              </div>
           </div>
           <div className="mt-10 p-4 bg-white/5 rounded-xl border border-white/10 relative z-10">
              <p className="text-[10px] uppercase font-bold tracking-widest text-blue-300 mb-2">Network Topology</p>
              <div className="flex justify-between items-end">
                 <div className="h-8 w-1 bg-green-400 rounded-full"></div>
                 <div className="h-12 w-1 bg-green-400 rounded-full"></div>
                 <div className="h-6 w-1 bg-green-400 rounded-full"></div>
                 <div className="h-10 w-1 bg-green-400 rounded-full"></div>
                 <div className="h-14 w-1 bg-green-400 rounded-full"></div>
                 <div className="h-8 w-1 bg-green-400 rounded-full"></div>
                 <span className="text-[10px] font-bold ml-2">99.9% Uptime</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityOverview;