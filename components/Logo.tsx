import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'color' | 'white' | 'iconOnly';
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className = "", variant = 'color', size = 'md' }) => {
  const isWhite = variant === 'white';
  
  // Size classes
  const iconSize = size === 'sm' ? 'h-8 w-8' : size === 'lg' ? 'h-14 w-14' : 'h-10 w-10';
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-xl';
  const subTextSize = size === 'sm' ? 'text-[0.5rem]' : size === 'lg' ? 'text-[0.75rem]' : 'text-[0.6rem]';

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* Symbol: Concept 1 - N shaped like a Smart Order Hub */}
      <div className={`relative flex items-center justify-center ${iconSize}`}>
        <svg 
          viewBox="0 0 64 64" 
          className="w-full h-full drop-shadow-sm" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background Shape (Rounded Square - App Icon Style) */}
          <rect 
            x="0" y="0" width="64" height="64" rx="16" 
            className={isWhite ? "fill-white/10" : "fill-brand-blue"} 
            stroke={isWhite ? "white" : "none"}
            strokeWidth={isWhite ? "2" : "0"}
            strokeOpacity="0.2"
          />
          
          {/* The 'N' Shape - Yellow (Energy/Action) */}
          <path 
            d="M20 46V22L44 46V22" 
            stroke={isWhite ? "#FFFFFF" : "#FFD700"} 
            strokeWidth="7" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          
          {/* Accent Dot/Leaf (Brown - Coffee/Organic) */}
          <circle 
            cx="48" cy="16" r="4" 
            className={isWhite ? "fill-white" : "fill-brand-brown"} 
          />
        </svg>
      </div>

      {/* Text Part */}
      {variant !== 'iconOnly' && (
        <div className="flex flex-col justify-center">
          <span className={`font-heading font-bold leading-none tracking-tight ${textSize} ${isWhite ? 'text-white' : 'text-brand-blue'}`}>
            NOUN
          </span>
          <span className={`${subTextSize} font-bold tracking-[0.25em] uppercase leading-none mt-0.5 ${isWhite ? 'text-brand-yellow' : 'text-brand-brown'}`}>
            CRM
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;