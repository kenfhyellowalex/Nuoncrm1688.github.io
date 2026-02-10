import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { DbCampaign, CampaignChannel, CampaignRule } from '../../types';
import { 
  Megaphone, Send, MessageCircle, MessageSquare, Play, 
  Pause, Plus, Trash2, Smartphone, Gift, Calendar, 
  TrendingUp, Users, Loader, CheckCircle, RefreshCw
} from 'lucide-react';

const MarketingAutomation: React.FC = () => {
  const [campaigns, setCampaigns] = useState<DbCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [runningId, setRunningId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<{
    name: string;
    channel: CampaignChannel;
    rule: CampaignRule;
    message: string;
  }>({
    name: '',
    channel: 'telegram',
    rule: 'no_order_7_days',
    message: ''
  });

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await api.marketing.list();
      if (res.status === 'success' && res.data) {
        setCampaigns(res.data);
      }
    } catch (e) {
      console.error("Fetch Campaigns Error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.marketing.create(formData);
      if (res.status === 'success' && res.data) {
        setCampaigns(prev => [res.data!, ...prev]);
        setIsModalOpen(false);
        setFormData({ name: '', channel: 'telegram', rule: 'no_order_7_days', message: '' });
      }
    } catch (e) {
      alert("Failed to create campaign");
    }
  };

  const handleToggleStatus = async (id: string) => {
    const res = await api.marketing.toggleStatus(id);
    if (res.status === 'success' && res.data) {
      const updated = res.data;
      setCampaigns(prev => prev.map(c => c.id === id ? updated : c));
    }
  };

  const handleRunCampaign = async (id: string) => {
    setRunningId(id);
    try {
      const res = await api.marketing.trigger(id);
      if (res.status === 'success') {
        const sent = res.data?.sent || 0;
        alert(`Campaign Triggered! Sent to ${sent} customers.`);
        fetchCampaigns(); // Refresh stats
      }
    } catch (e) {
      alert("Failed to trigger campaign");
    } finally {
      setRunningId(null);
    }
  };

  const getChannelIcon = (channel: CampaignChannel) => {
    switch (channel) {
      case 'telegram': return <Send size={18} className="text-blue-500" />;
      case 'line': return <MessageCircle size={18} className="text-green-500" />;
      case 'whatsapp': return <MessageSquare size={18} className="text-green-600" />;
      case 'sms': return <Smartphone size={18} className="text-gray-600" />;
      default: return <Megaphone size={18} />;
    }
  };

  const getRuleLabel = (rule: CampaignRule) => {
    switch (rule) {
      case 'no_order_7_days': return 'Churn Risk (>7 Days)';
      case 'birthday': return 'Birthday Celebration';
      case 'points_over_100': return 'VIP Reward (>100 Pts)';
      case 'slow_day': return 'Slow Day Boost';
      case 'new_customer': return 'Welcome Series';
      default: return rule;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-100 pb-6">
        <div>
           <h2 className="text-3xl font-heading font-black text-gray-900 flex items-center gap-3 italic uppercase tracking-tighter">
              <Megaphone className="text-brand-blue" />
              Marketing Engine
           </h2>
           <p className="text-gray-500 font-medium mt-1">Automated engagement campaigns & loyalty triggers.</p>
        </div>
        <div className="flex gap-3">
           <button onClick={fetchCampaigns} className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
           </button>
           <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-brand-blue text-white rounded-xl font-bold shadow-lg hover:bg-blue-800 transition-colors uppercase text-xs tracking-widest">
              <Plus size={16} /> New Campaign
           </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><Send size={24} /></div>
            <div>
               <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Messages Sent</p>
               <h3 className="text-2xl font-black text-gray-900">{campaigns.reduce((acc, c) => acc + c.sentCount, 0)}</h3>
            </div>
         </div>
         <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-green-50 text-green-600 rounded-2xl"><TrendingUp size={24} /></div>
            <div>
               <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Revenue Generated</p>
               <h3 className="text-2xl font-black text-gray-900">${campaigns.reduce((acc, c) => acc + c.revenue, 0).toFixed(2)}</h3>
            </div>
         </div>
         <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl"><Users size={24} /></div>
            <div>
               <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Engaged Users</p>
               <h3 className="text-2xl font-black text-gray-900">{campaigns.reduce((acc, c) => acc + c.clickCount, 0)}</h3>
            </div>
         </div>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
         {campaigns.map((campaign) => (
            <div key={campaign.id} className={`bg-white rounded-3xl p-6 border-2 transition-all hover:shadow-lg flex flex-col lg:flex-row justify-between lg:items-center gap-6 ${campaign.status === 'active' ? 'border-green-100' : 'border-gray-100 opacity-80'}`}>
               <div className="flex items-start gap-4">
                  <div className={`p-4 rounded-2xl ${campaign.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                     {getChannelIcon(campaign.channel)}
                  </div>
                  <div>
                     <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-black text-gray-900 text-lg">{campaign.name}</h3>
                        <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded ${campaign.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                           {campaign.status}
                        </span>
                     </div>
                     <p className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                        Trigger: <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{getRuleLabel(campaign.rule)}</span>
                     </p>
                     <p className="text-sm text-gray-600 mt-2 italic">"{campaign.message}"</p>
                  </div>
               </div>

               <div className="flex items-center gap-8 border-t lg:border-t-0 border-gray-100 pt-4 lg:pt-0">
                  <div className="flex gap-6 text-center">
                     <div>
                        <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Sent</p>
                        <p className="font-bold text-gray-900">{campaign.sentCount}</p>
                     </div>
                     <div>
                        <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Clicks</p>
                        <p className="font-bold text-gray-900">{campaign.clickCount}</p>
                     </div>
                     <div>
                        <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Rev</p>
                        <p className="font-bold text-green-600">${campaign.revenue}</p>
                     </div>
                  </div>

                  <div className="flex gap-2">
                     <button 
                       onClick={() => handleToggleStatus(campaign.id)}
                       className={`p-3 rounded-xl transition-colors ${campaign.status === 'active' ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                       title={campaign.status === 'active' ? 'Pause Campaign' : 'Activate Campaign'}
                     >
                        {campaign.status === 'active' ? <Pause size={18} /> : <Play size={18} />}
                     </button>
                     <button 
                       onClick={() => handleRunCampaign(campaign.id)}
                       disabled={runningId === campaign.id || campaign.status !== 'active'}
                       className="px-4 py-3 bg-brand-blue text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                     >
                        {runningId === campaign.id ? <Loader className="animate-spin" size={16} /> : <Send size={16} />}
                        Run Now
                     </button>
                  </div>
               </div>
            </div>
         ))}
      </div>

      {/* New Campaign Modal */}
      {isModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden animate-fade-in-up border-8 border-white shadow-2xl">
               <div className="bg-brand-blue p-8 text-white flex justify-between items-center">
                  <h3 className="text-xl font-black uppercase italic tracking-tighter">Create Campaign</h3>
                  <button onClick={() => setIsModalOpen(false)}><span className="text-2xl">&times;</span></button>
               </div>
               <form onSubmit={handleCreate} className="p-8 space-y-6">
                  <div>
                     <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Campaign Name</label>
                     <input 
                       type="text" required
                       value={formData.name}
                       onChange={e => setFormData({...formData, name: e.target.value})}
                       className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-xl outline-none font-bold"
                       placeholder="e.g. Weekend Flash Sale"
                     />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Channel</label>
                        <select 
                           value={formData.channel}
                           onChange={e => setFormData({...formData, channel: e.target.value as any})}
                           className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-xl outline-none font-bold"
                        >
                           <option value="telegram">Telegram</option>
                           <option value="line">Line OA</option>
                           <option value="whatsapp">WhatsApp</option>
                           <option value="sms">SMS</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Trigger Rule</label>
                        <select 
                           value={formData.rule}
                           onChange={e => setFormData({...formData, rule: e.target.value as any})}
                           className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-xl outline-none font-bold"
                        >
                           <option value="no_order_7_days">Inactive (7 Days)</option>
                           <option value="birthday">Birthday</option>
                           <option value="points_over_100">High Points</option>
                           <option value="slow_day">Slow Sales Day</option>
                        </select>
                     </div>
                  </div>
                  <div>
                     <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Message Template</label>
                     <textarea 
                       rows={3} required
                       value={formData.message}
                       onChange={e => setFormData({...formData, message: e.target.value})}
                       className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-xl outline-none font-medium"
                       placeholder="Enter your promotional message..."
                     />
                  </div>
                  <button type="submit" className="w-full py-4 bg-brand-yellow hover:bg-yellow-400 text-brand-blue font-black uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
                     <CheckCircle size={18} />
                     Launch Automation
                  </button>
               </form>
            </div>
         </div>
      )}
    </div>
  );
};

export default MarketingAutomation;