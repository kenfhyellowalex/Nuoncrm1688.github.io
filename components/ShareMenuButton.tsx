
import React, { useState } from 'react';
import { Share2, Download, Copy, X, ExternalLink, CheckCircle } from 'lucide-react';

interface ShareMenuButtonProps {
  url?: string;
  title?: string;
  variant?: 'primary' | 'minimal';
}

const ShareMenuButton: React.FC<ShareMenuButtonProps> = ({ 
  url = window.location.href, 
  title = "Check out our menu!",
  variant = 'primary'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Use a high-quality QR code API
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(url)}&color=000000&bgcolor=ffffff&margin=10`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'NOUN CRM Menu',
          text: title,
          url: url,
        });
      } catch (err) {
        // Share cancelled or failed
      }
    } else {
      // Fallback if native share not supported
      handleCopy();
      alert('Link copied to clipboard!');
    }
  };

  const handleDownloadQR = async () => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'menu-qr-code.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      // Fallback: open in new tab
      window.open(qrUrl, '_blank');
    }
  };

  return (
    <>
      {variant === 'primary' ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-brand-blue transition-all shadow-lg hover:scale-105 active:scale-95"
        >
          <Share2 size={16} /> Share Menu
        </button>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1.5 hover:text-brand-yellow transition-colors text-[10px] font-bold uppercase tracking-widest"
        >
          <Share2 size={12} /> Share
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in text-gray-900">
          <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 relative shadow-2xl border-4 border-white/10" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-gray-500"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter mb-2">Share Menu</h3>
              <p className="text-gray-500 text-sm font-medium">Scan or share to order instantly.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-3xl border-4 border-dashed border-gray-200 mb-8 flex justify-center relative group">
               <img src={qrUrl} alt="Menu QR" className="w-48 h-48 mix-blend-multiply" />
               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm rounded-2xl pointer-events-none">
                  <span className="font-bold text-brand-blue text-sm">SCAN ME</span>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
               <button 
                 onClick={handleDownloadQR}
                 className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-brand-blue transition-all font-bold text-xs gap-2 border border-gray-100 hover:border-blue-200"
               >
                  <Download size={20} />
                  Save QR
               </button>
               <button 
                 onClick={handleCopy}
                 className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 hover:bg-green-50 text-gray-700 hover:text-green-600 transition-all font-bold text-xs gap-2 border border-gray-100 hover:border-green-200"
               >
                  {copied ? <CheckCircle size={20} className="text-green-500" /> : <Copy size={20} />}
                  {copied ? 'Copied!' : 'Copy Link'}
               </button>
            </div>

            <button 
              onClick={handleShare}
              className="w-full py-4 bg-brand-blue text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-blue-800 transition-all flex items-center justify-center gap-3"
            >
               <ExternalLink size={18} /> Share via App
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareMenuButton;
