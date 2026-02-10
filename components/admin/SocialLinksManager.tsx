
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { SocialLink, SocialPlatform, ApiResponse } from '../../types';
import { Plus, Edit, Trash2, Globe, Send, MessageCircle, Facebook, X, Loader, Save, ExternalLink } from 'lucide-react';

const SocialLinksManager: React.FC = () => {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  
  const [formData, setFormData] = useState<Omit<SocialLink, 'id'>>({
    platform: 'telegram',
    linkUrl: '',
    label: ''
  });

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const response = await api.socialLinks.list();
      if (response.status === 'success' && response.data) {
        setLinks(response.data);
      }
    } catch (error) {
      console.error("Error fetching social links:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleOpenModal = (link?: SocialLink) => {
    if (link) {
      setEditingLink(link);
      setFormData({
        platform: link.platform,
        linkUrl: link.linkUrl,
        label: link.label
      });
    } else {
      setEditingLink(null);
      setFormData({
        platform: 'telegram',
        linkUrl: '',
        label: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Remove this social link?")) {
      try {
        const response = await api.socialLinks.delete(id);
        if (response.status === 'success') {
          setLinks(prev => prev.filter(l => l.id !== id));
        }
      } catch (error) {
        alert("Failed to delete link");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLink) {
        // Fix for Error: Property 'data' does not exist on type 'ApiResponse<SocialLink> | { status: string; message: string; }'
        const response = await api.socialLinks.update(editingLink.id, formData) as ApiResponse<SocialLink>;
        if (response.status === 'success' && response.data) {
          const updated = response.data;
          setLinks(prev => prev.map(l => l.id === updated.id ? updated : l));
        }
      } else {
        // Fix for Error: Property 'data' does not exist on type 'ApiResponse<SocialLink> | { status: string; message: string; }'
        const response = await api.socialLinks.create(formData) as ApiResponse<SocialLink>;
        if (response.status === 'success' && response.data) {
          setLinks(prev => [...prev, response.data!]);
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving social link:", error);
    }
  };

  const getPlatformIcon = (platform: SocialPlatform) => {
    switch (platform) {
      case 'telegram': return <Send size={20} className="text-blue-500" />;
      case 'line': return <MessageCircle size={20} className="text-green-500" />;
      case 'whatsapp': return <MessageCircle size={20} className="text-green-600" />;
      case 'facebook': return <Facebook size={20} className="text-blue-700" />;
      default: return <Globe size={20} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-900">Social Connect</h2>
           <p className="text-gray-500">Manage links for Telegram, Line, WhatsApp, and Facebook.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-brand-blue text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-800 transition-colors"
        >
          <Plus size={18} />
          Add Social Link
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
           <Loader className="animate-spin text-brand-blue" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {links.map((link) => (
            <div key={link.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-gray-50 rounded-xl">
                  {getPlatformIcon(link.platform)}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleOpenModal(link)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(link.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">{link.label}</h3>
              <p className="text-sm text-gray-500 truncate mb-4">{link.linkUrl}</p>
              <a 
                href={link.linkUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold text-brand-blue hover:underline"
              >
                Test Link <ExternalLink size={14} />
              </a>
            </div>
          ))}
          {links.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
              No social links configured.
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">
                {editingLink ? 'Edit Link' : 'Add Social Link'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                <select 
                  value={formData.platform}
                  onChange={e => setFormData({...formData, platform: e.target.value as SocialPlatform})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none"
                >
                  <option value="telegram">Telegram</option>
                  <option value="line">Line OA</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="facebook">Facebook</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Label</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Join our Telegram"
                  value={formData.label}
                  onChange={e => setFormData({...formData, label: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL / Link</label>
                <input 
                  type="url" 
                  required
                  placeholder="https://..."
                  value={formData.linkUrl}
                  onChange={e => setFormData({...formData, linkUrl: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-800 flex items-center gap-2"
                >
                  <Save size={18} />
                  Save Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialLinksManager;
