
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { DbSettings } from '../../types';
import { Save, Loader, Globe, Palette, DollarSign, Layout, Image as ImageIcon, Grid, List, Maximize } from 'lucide-react';

const SettingsManager: React.FC = () => {
  const [settings, setSettings] = useState<DbSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const response = await api.settings.get();
        if (response.status === 'success' && response.data) {
          setSettings(response.data);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (field: keyof DbSettings, value: string) => {
    if (settings) {
      setSettings({ ...settings, [field]: value });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setMessage(null);
    try {
      const response = await api.settings.update(settings);
      if (response.status === 'success') {
        setMessage({ type: 'success', text: 'Settings updated successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to update settings.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-brand-blue" size={32} />
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
        <p className="text-gray-500">Configure global application settings.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* General Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <Globe size={18} className="text-gray-500" />
            <h3 className="font-bold text-gray-800">General Information</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
              <div className="relative">
                <Layout size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  value={settings.siteName}
                  onChange={(e) => handleChange('siteName', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency Symbol</label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  value={settings.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Language</label>
              <select 
                value={settings.languageDefault}
                onChange={(e) => handleChange('languageDefault', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none"
              >
                <option value="US">English (US)</option>
                <option value="KH">Khmer (Cambodia)</option>
                <option value="TH">Thai (Thailand)</option>
                <option value="ID">Indonesian (Indonesia)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Digital Menu Layout */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
           <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
              <Layout size={18} className="text-gray-500" />
              <h3 className="font-bold text-gray-800">Digital Menu Design</h3>
           </div>
           <div className="p-6">
              <p className="text-sm text-gray-500 mb-4">Select the visual template for your customer-facing menu.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <button
                   type="button"
                   onClick={() => handleChange('menuLayout', 'grid')}
                   className={`flex flex-col items-center p-6 rounded-2xl border-2 transition-all ${settings.menuLayout === 'grid' ? 'border-brand-blue bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
                 >
                    <Grid size={32} className={`mb-3 ${settings.menuLayout === 'grid' ? 'text-brand-blue' : 'text-gray-400'}`} />
                    <span className={`font-bold ${settings.menuLayout === 'grid' ? 'text-brand-blue' : 'text-gray-700'}`}>Classic Grid</span>
                    <span className="text-xs text-gray-400 mt-1">Balanced visual & info</span>
                 </button>

                 <button
                   type="button"
                   onClick={() => handleChange('menuLayout', 'list')}
                   className={`flex flex-col items-center p-6 rounded-2xl border-2 transition-all ${settings.menuLayout === 'list' ? 'border-brand-blue bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
                 >
                    <List size={32} className={`mb-3 ${settings.menuLayout === 'list' ? 'text-brand-blue' : 'text-gray-400'}`} />
                    <span className={`font-bold ${settings.menuLayout === 'list' ? 'text-brand-blue' : 'text-gray-700'}`}>List View</span>
                    <span className="text-xs text-gray-400 mt-1">Compact & details focused</span>
                 </button>

                 <button
                   type="button"
                   onClick={() => handleChange('menuLayout', 'focus')}
                   className={`flex flex-col items-center p-6 rounded-2xl border-2 transition-all ${settings.menuLayout === 'focus' ? 'border-brand-blue bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
                 >
                    <Maximize size={32} className={`mb-3 ${settings.menuLayout === 'focus' ? 'text-brand-blue' : 'text-gray-400'}`} />
                    <span className={`font-bold ${settings.menuLayout === 'focus' ? 'text-brand-blue' : 'text-gray-700'}`}>Focus Card</span>
                    <span className="text-xs text-gray-400 mt-1">Large imagery for food</span>
                 </button>
              </div>
           </div>
        </div>

        {/* Branding */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <Palette size={18} className="text-gray-500" />
            <h3 className="font-bold text-gray-800">Branding & Appearance</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
              <div className="flex gap-2">
                <input 
                  type="color" 
                  value={settings.primaryColor}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  className="h-10 w-16 p-1 rounded border border-gray-300 cursor-pointer"
                />
                <input 
                  type="text" 
                  value={settings.primaryColor}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
              <div className="flex gap-2">
                <input 
                  type="color" 
                  value={settings.secondaryColor}
                  onChange={(e) => handleChange('secondaryColor', e.target.value)}
                  className="h-10 w-16 p-1 rounded border border-gray-300 cursor-pointer"
                />
                <input 
                  type="text" 
                  value={settings.secondaryColor}
                  onChange={(e) => handleChange('secondaryColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none uppercase"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
              <div className="relative">
                <ImageIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  value={settings.logoUrl || ''}
                  onChange={(e) => handleChange('logoUrl', e.target.value)}
                  placeholder="https://..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-4">
          {message && (
            <div className={`text-sm font-medium ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {message.text}
            </div>
          )}
          <div className="ml-auto">
            <button 
              type="submit" 
              disabled={saving}
              className="flex items-center gap-2 bg-brand-blue text-white px-6 py-2.5 rounded-lg hover:bg-blue-800 disabled:opacity-50 transition-colors shadow-sm font-bold"
            >
              {saving ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
              Save Changes
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default SettingsManager;