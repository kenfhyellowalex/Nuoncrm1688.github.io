import React from 'react';
import { Play } from 'lucide-react';

const DigitalMenu: React.FC = () => {
  return (
    <div className="bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">
            Experience Our Digital Menu
          </h2>
          <p className="text-gray-400">Watch our signature drinks come to life</p>
        </div>
        
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-800 aspect-video max-w-4xl mx-auto bg-gray-900">
          <video 
            className="w-full h-full object-cover"
            autoPlay 
            loop 
            muted 
            playsInline
            poster="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80"
          >
            {/* Using a stock video of coffee pouring/cafe ambience */}
            <source src="https://videos.pexels.com/video-files/2909914/2909914-hd_1920_1080_25fps.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          <div className="absolute inset-0 bg-black/10 pointer-events-none flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/20 p-4 rounded-full backdrop-blur-md">
              <Play size={48} className="text-white fill-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalMenu;