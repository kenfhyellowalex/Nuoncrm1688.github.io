
import React from 'react';
import { Menu, X, ShoppingCart, LogIn, LogOut, User, ChevronDown, Globe } from 'lucide-react';
import { COUNTRIES, SOCIAL_LINKS } from '../constants';
import { CountryCode, Translations, DbUser } from '../types';
import Logo from './Logo';
import ShareMenuButton from './ShareMenuButton';

interface NavbarProps {
  cartCount: number;
  currentCountry: CountryCode;
  onCountryChange: (code: CountryCode) => void;
  onNavigate: (page: string) => void;
  currentPage: string;
  t: Translations;
  user: DbUser | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  cartCount, 
  currentCountry, 
  onCountryChange, 
  onNavigate,
  currentPage,
  t,
  user,
  onLogout
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const selectedCountry = COUNTRIES.find(c => c.code === currentCountry);

  const navLinks = [
    { name: t.nav.home, value: 'home' },
    { name: t.nav.menu, value: 'shop' },
    { name: t.nav.booking, value: 'booking' },
    { name: t.nav.about, value: 'about' },
    { name: t.nav.contact, value: 'contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b-4 border-brand-yellow">
      {/* Top Bar - Multi-Country Branding & Global Config */}
      <div className="bg-brand-blue text-white px-4 py-1.5 text-[10px] md:text-xs font-bold uppercase tracking-widest flex justify-between items-center">
         <div className="flex gap-4 items-center">
            <span className="flex items-center gap-1"><Globe size={10} /> Hybrid Retail Engine</span>
            <span className="hidden md:inline text-blue-300">|</span>
            <span className="hidden md:inline text-blue-100">{selectedCountry?.name} HQ</span>
         </div>
         <div className="flex gap-4 items-center">
            <ShareMenuButton variant="minimal" />
            <span className="text-blue-400">|</span>
            {SOCIAL_LINKS.map(l => <a key={l.id} href={l.linkUrl} target="_blank" className="hover:text-brand-yellow transition-colors">{l.label}</a>)}
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="cursor-pointer" onClick={() => onNavigate('home')}>
            <Logo variant="color" />
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.value}
                onClick={() => onNavigate(link.value)}
                className={`text-sm font-bold transition-all uppercase tracking-wide py-2 border-b-2 ${
                  currentPage === link.value 
                    ? 'text-brand-blue border-brand-blue' 
                    : 'text-gray-500 border-transparent hover:text-brand-blue'
                }`}
              >
                {link.name}
              </button>
            ))}
            {user && (
               <button onClick={() => onNavigate('crm')} className={`text-sm font-bold uppercase tracking-wide py-2 border-b-2 ${currentPage === 'crm' ? 'text-red-600 border-red-600' : 'text-red-500 border-transparent hover:text-red-700'}`}>
                 {t.nav.crm}
               </button>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
             {/* Country Selector */}
             <div className="relative group">
                <button className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full border border-gray-200 hover:bg-gray-200 transition-colors">
                   <span className="text-xl leading-none">{selectedCountry?.flag}</span>
                   <span className="hidden md:inline text-xs font-bold text-gray-700">{selectedCountry?.code}</span>
                   <ChevronDown size={14} className="text-gray-400" />
                </button>
                <div className="absolute top-full right-0 mt-2 w-40 bg-white shadow-xl rounded-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 z-[60]">
                   {COUNTRIES.map(c => (
                     <button 
                       key={c.code}
                       onClick={() => onCountryChange(c.code as CountryCode)}
                       className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${currentCountry === c.code ? 'bg-blue-50 text-brand-blue font-bold' : 'text-gray-600'}`}
                     >
                       <span>{c.flag}</span>
                       <span>{c.name}</span>
                     </button>
                   ))}
                </div>
             </div>

             {/* Cart */}
             <button onClick={() => onNavigate('checkout')} className="relative p-2 text-brand-blue hover:scale-110 transition-transform">
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white">
                    {cartCount}
                  </span>
                )}
             </button>

             {/* Auth */}
             <div className="hidden md:block">
                {user ? (
                   <button onClick={onLogout} className="flex items-center gap-2 bg-brand-light px-4 py-2 rounded-full border border-gray-100 text-gray-700 font-bold text-xs hover:bg-red-50 hover:text-red-600 transition-all">
                      <LogOut size={16} /> Logout
                   </button>
                ) : (
                  <button onClick={() => onNavigate('login')} className="flex items-center gap-2 bg-brand-yellow px-4 py-2 rounded-full text-brand-blue font-bold text-xs shadow-sm hover:shadow-md transition-all">
                    <LogIn size={16} /> Login
                  </button>
                )}
             </div>

             {/* Mobile Menu Toggle */}
             <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-brand-blue">
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
             </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 animate-fade-in">
           <div className="px-4 py-6 space-y-3">
              {navLinks.map(l => (
                <button key={l.value} onClick={() => { onNavigate(l.value); setIsMenuOpen(false); }} className="w-full text-left p-3 rounded-xl font-bold text-gray-700 hover:bg-gray-50">
                  {l.name}
                </button>
              ))}
              {user && <button onClick={() => { onNavigate('crm'); setIsMenuOpen(false); }} className="w-full text-left p-3 rounded-xl font-bold text-red-600 hover:bg-red-50">Admin Panel</button>}
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                 <button onClick={() => onNavigate('login')} className="text-sm font-bold text-brand-blue">{user ? 'Switch Account' : 'Login'}</button>
                 <div className="flex gap-2">
                    {COUNTRIES.map(c => (
                      <button key={c.code} onClick={() => onCountryChange(c.code as CountryCode)} className={`p-2 rounded-lg border ${currentCountry === c.code ? 'border-brand-blue bg-blue-50' : 'border-gray-200'}`}>
                        {c.flag}
                      </button>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
