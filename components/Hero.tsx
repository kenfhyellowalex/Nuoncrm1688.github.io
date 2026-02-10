import React from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import { Translations } from '../types';

interface HeroProps {
  onOrderClick: () => void;
  onBookClick: () => void;
  t: Translations;
}

const Hero: React.FC<HeroProps> = ({ onOrderClick, onBookClick, t }) => {
  return (
    <div className="relative h-[550px] overflow-hidden">
      {/* Background Image: Food + Coffee + Mini Mart Theme */}
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1920&q=80"
          alt="NOUN CRM Theme"
        />
        {/* Darker Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center h-full text-center items-center">
        <div className="animate-fade-in-up max-w-3xl">
          
          <h1 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tight text-white mb-6 drop-shadow-xl leading-tight">
            {t.hero.slogan}
          </h1>
          
          <p className="mt-4 text-xl md:text-2xl text-gray-200 mb-10 font-light">
            {t.hero.subSlogan}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Burger/Order Button */}
            <button 
              onClick={onOrderClick}
              className="inline-flex items-center justify-center px-8 py-4 bg-brand-yellow hover:bg-yellow-400 text-brand-blue text-lg font-bold rounded-full transition-transform hover:-translate-y-1 shadow-lg min-w-[200px]"
            >
              🍔 {t.hero.btnOrder}
            </button>
            
            {/* Calendar/Book Button */}
            <button 
              onClick={onBookClick}
              className="inline-flex items-center justify-center px-8 py-4 bg-white/20 backdrop-blur-md border-2 border-white hover:bg-white hover:text-brand-blue text-white text-lg font-bold rounded-full transition-all min-w-[200px]"
            >
              📅 {t.hero.btnBook}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Hero;