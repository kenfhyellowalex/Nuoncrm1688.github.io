import React, { useState } from 'react';
import { Translations } from '../types';
import { Send, MapPin, Phone, Mail } from 'lucide-react';
import { SOCIAL_LINKS } from '../constants';

interface ContactProps {
  t: Translations;
}

const Contact: React.FC<ContactProps> = ({ t }) => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const getSocialStyle = (platform: string) => {
    switch (platform) {
      case 'telegram': return 'bg-blue-50 text-blue-600 hover:bg-blue-100';
      case 'line': return 'bg-green-50 text-green-600 hover:bg-green-100';
      case 'whatsapp': return 'bg-green-50 text-green-700 hover:bg-green-100';
      case 'facebook': return 'bg-blue-50 text-blue-800 hover:bg-blue-100';
      default: return 'bg-gray-50 text-gray-700 hover:bg-gray-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-heading font-bold text-brand-blue mb-4">{t.contact.title}</h2>
        <p className="text-gray-500 text-lg">{t.contact.desc}</p>
        <div className="w-20 h-1 bg-brand-yellow mx-auto mt-4"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Contact Form */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-brand-blue">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">{t.contact.formTitle}</h3>
          
          {sent ? (
            <div className="bg-green-100 text-green-800 p-4 rounded-lg text-center">
              Thank you! Message sent.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.contact.name}</label>
                <input type="text" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.contact.email}</label>
                <input type="email" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.contact.message}</label>
                <textarea rows={4} required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent"></textarea>
              </div>
              <button type="submit" className="w-full bg-brand-blue hover:bg-blue-800 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                <Send size={18} />
                {t.contact.send}
              </button>
            </form>
          )}
        </div>

        {/* Right: Social & Info */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.contact.socialTitle}</h3>
            <p className="text-gray-500 mb-6">{t.contact.socialText}</p>
            <div className="grid grid-cols-2 gap-4">
              {SOCIAL_LINKS.map((link) => (
                <a 
                  key={link.id}
                  href={link.linkUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`flex items-center justify-center p-4 rounded-xl transition-colors font-bold ${getSocialStyle(link.platform)}`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="bg-gray-100 p-8 rounded-2xl h-64 flex items-center justify-center text-gray-400">
             {/* Placeholder for Map */}
             <div className="text-center">
               <MapPin size={48} className="mx-auto mb-2 opacity-50" />
               <span className="font-bold">Google Map Location</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;