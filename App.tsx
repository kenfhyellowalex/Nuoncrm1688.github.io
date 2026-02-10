import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Shop from './pages/Shop';
import Booking from './pages/Booking';
import CRM from './pages/CRM';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import OrderStatus from './pages/OrderStatus';
import BookingStatus from './pages/BookingStatus';
import RiderPortal from './pages/RiderPortal';
import { Product, CountryCode, CartItem, DbUser } from './types';
import { COUNTRIES } from './constants';
import { TRANSLATIONS } from './translations';
import { api } from './services/api';

const App: React.FC = () => {
  const [page, setPage] = useState<string>('home');
  const [params, setParams] = useState<any>({});
  const [cart, setCart] = useState<CartItem[]>([]);
  const [country, setCountry] = useState<CountryCode>(CountryCode.KH);
  const [user, setUser] = useState<DbUser | null>(null);

  const t = TRANSLATIONS[country];
  const currencySymbol = COUNTRIES.find(c => c.code === country)?.currency || '$';

  const navigate = (newPage: string, newParams: any = {}) => {
    setPage(newPage);
    setParams(newParams);
    window.scrollTo(0, 0);
  };

  const addToCart = (product: Product, quantity: number = 1, options?: CartItem['options']) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id && JSON.stringify(item.options) === JSON.stringify(options));
      if (existingIndex > -1) {
        const newCart = [...prev];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      }
      return [...prev, { ...product, quantity, options }];
    });
  };

  const clearCart = () => setCart([]);

  const handleLogin = (loggedInUser: DbUser) => {
    setUser(loggedInUser);
    navigate('crm');
  };

  const handleLogout = async () => {
    await api.auth.logout();
    setUser(null);
    navigate('home');
  };

  const renderContent = () => {
    switch(page) {
      case 'home':
        return (
          <>
            <Hero onOrderClick={() => navigate('shop')} onBookClick={() => navigate('booking')} t={t} />
            <div className="py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-heading font-black text-gray-900 uppercase tracking-tighter italic">{t.home.servicesTitle}</h2>
                  <div className="w-16 h-1.5 bg-brand-yellow mx-auto mt-4 rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  {['service1', 'service2', 'service3'].map((s, i) => (
                    <div key={s} onClick={() => navigate('shop')} className="group aspect-square p-10 rounded-[3rem] bg-white border-4 border-gray-50 hover:border-brand-yellow hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer flex flex-col items-center justify-center text-center">
                      <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mb-8 transition-all ${i === 0 ? 'bg-red-50 text-red-600 group-hover:bg-red-600' : i === 1 ? 'bg-amber-50 text-amber-600 group-hover:bg-amber-600' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600'} group-hover:text-white shadow-sm group-hover:rotate-6`}>
                        <div className="text-5xl">{i === 0 ? '🍛' : i === 1 ? '☕' : '🛒'}</div>
                      </div>
                      <h3 className="text-2xl font-black mb-4 text-gray-900 uppercase tracking-tight italic">{(t.home as any)[s]}</h3>
                      <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">{(t.home as any)[s + 'Desc']}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        );
      case 'shop':
        return <Shop currencySymbol={currencySymbol} addToCart={addToCart} t={t} cart={cart} onNavigate={navigate} currentCountry={country} />;
      case 'booking':
        return <Booking t={t} onNavigate={navigate} />;
      case 'booking-status':
        return <BookingStatus bookingId={params.bookingId} onNavigate={navigate} t={t} />;
      case 'checkout':
        return <Checkout cart={cart} t={t} onNavigate={navigate} currencySymbol={currencySymbol} onOrderSuccess={clearCart} />;
      case 'order-status':
        return <OrderStatus orderNumber={params.orderNumber} onNavigate={navigate} t={t} currencySymbol={currencySymbol} />;
      case 'rider':
        return <RiderPortal />;
      case 'crm':
        if (!user) return <Login onLogin={handleLogin} onNavigate={navigate} />;
        return <CRM t={t} onLogout={handleLogout} />;
      case 'about': return <About t={t} />;
      case 'contact': return <Contact t={t} />;
      case 'login': return <Login onLogin={handleLogin} onNavigate={navigate} />;
      default: return <Hero onOrderClick={() => navigate('shop')} onBookClick={() => navigate('booking')} t={t} />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-light flex flex-col font-sans selection:bg-brand-yellow selection:text-brand-blue">
      {page !== 'rider' && (
        <Navbar cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)} currentCountry={country} onCountryChange={setCountry} onNavigate={navigate} currentPage={page} t={t} user={user} onLogout={handleLogout} />
      )}
      <main className="flex-grow">{renderContent()}</main>
      {(page !== 'login' && page !== 'crm' && page !== 'rider') && (
        <footer className="bg-brand-blue text-white pt-20 pb-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-heading font-black mb-8 italic">NOUN CRM</h2>
            <div className="flex flex-wrap justify-center gap-8 mb-12">
               {['home', 'shop', 'booking', 'about'].map(p => <button key={p} onClick={() => navigate(p)} className="text-blue-200 font-bold uppercase text-xs tracking-widest hover:text-white transition-colors">{p}</button>)}
            </div>
            <div className="border-t border-white/10 pt-10 text-blue-300/50 text-[10px] font-bold uppercase tracking-[0.3em]">
              {t.footer.rights} • Operating in TH / ID / KH
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;