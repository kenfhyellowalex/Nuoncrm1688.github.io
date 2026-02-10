import React from 'react';
import { Translations } from '../types';
import { Globe, Users, Target } from 'lucide-react';

interface AboutProps {
  t: Translations;
}

const About: React.FC<AboutProps> = ({ t }) => {
  return (
    <div className="bg-brand-light min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-heading font-bold text-brand-blue mb-4">{t.about.title}</h2>
          <div className="w-20 h-1 bg-brand-yellow mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" 
              alt="Team" 
              className="rounded-2xl shadow-xl border-4 border-white"
            />
          </div>
          <div>
            <div className="flex items-center mb-4">
              <Users className="text-brand-yellow mr-3" size={32} />
              <h3 className="text-2xl font-bold text-gray-900">{t.about.whoWeAre}</h3>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              {t.about.whoWeAreDesc}
            </p>

            <div className="flex items-center mb-4">
              <Target className="text-brand-yellow mr-3" size={32} />
              <h3 className="text-2xl font-bold text-gray-900">{t.about.mission}</h3>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">
              {t.about.missionDesc}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 text-center">
          <Globe className="text-brand-blue mx-auto mb-6" size={48} />
          <h3 className="text-2xl font-bold text-gray-900 mb-8">{t.about.countries}</h3>
          
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="flex flex-col items-center">
              <span className="text-6xl mb-2">🇹🇭</span>
              <span className="font-bold text-gray-700">Thailand</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-6xl mb-2">🇮🇩</span>
              <span className="font-bold text-gray-700">Indonesia</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-6xl mb-2">🇰🇭</span>
              <span className="font-bold text-gray-700">Cambodia</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;