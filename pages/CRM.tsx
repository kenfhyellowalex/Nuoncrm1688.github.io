
import React, { useState, useEffect } from 'react';
import { 
  Users, LayoutDashboard, ShoppingBag, Package, Settings, FileText, Menu, X, Tags, 
  Calendar, UserPlus, CreditCard, ShieldAlert, LogOut, ChevronRight, Cpu, Sparkles, Smartphone, Network, BookOpen, Monitor, ChefHat, Boxes, PieChart, Truck, Globe, Megaphone
} from 'lucide-react';
import { Translations, DbUser } from '../types';
import DashboardHome from '../components/admin/DashboardHome';
import CustomerManager from '../components/admin/CustomerManager';
import CategoryManager from '../components/admin/CategoryManager';
import ProductManager from '../components/admin/ProductManager';
import OrderManager from '../components/admin/OrderManager';
import BookingManager from '../components/admin/BookingManager';
import ReportsManager from '../components/admin/ReportsManager';
import UserManager from '../components/admin/UserManager';
import PaymentManager from '../components/admin/PaymentManager';
import SettingsManager from '../components/admin/SettingsManager';
import SocialLinksManager from '../components/admin/SocialLinksManager';
import SecurityOverview from '../components/admin/SecurityOverview';
import MobileRoadmap from '../components/admin/MobileRoadmap';
import DeploymentMap from '../components/admin/DeploymentMap';
import DeploymentGuide from '../components/admin/DeploymentGuide';
import AISalesIntelligence from '../components/admin/AISalesIntelligence';
import CashierPOS from '../components/admin/CashierPOS';
import KitchenKDS from '../components/admin/KitchenKDS';
import InventoryManager from '../components/admin/InventoryManager';
import AccountingSystem from '../components/admin/AccountingSystem';
import DeliveryManager from '../components/admin/DeliveryManager';
import SuperAdminDashboard from '../components/admin/SuperAdminDashboard';
import MarketingAutomation from '../components/admin/MarketingAutomation';
import { api } from '../services/api';

interface CRMProps {
  t: Translations;
  onLogout?: () => void;
}

type AdminView = 'dashboard' | 'super_admin' | 'orders' | 'products' | 'categories' | 'customers' | 'reports' | 'ai-intel' | 'settings' | 'bookings' | 'users' | 'payments' | 'social' | 'security' | 'mobile-roadmap' | 'deployment' | 'deployment-guide' | 'pos' | 'kds' | 'inventory' | 'accounting' | 'delivery' | 'marketing';

const CRM: React.FC<CRMProps> = ({ t, onLogout }) => {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<DbUser | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
       const res = await api.auth.profile();
       if (res.status === 'success' && res.data) {
         setUser(res.data);
         // Redirect Super Admin to Global Dashboard by default
         if (res.data.role === 'super_admin') setCurrentView('super_admin');
       }
    };
    fetchUser();
  }, []);

  const SidebarItem = ({ icon: Icon, label, view, adminOnly = false }: { icon: any, label: string, view: AdminView, adminOnly?: boolean }) => {
    const isRestricted = adminOnly && user?.role !== 'company_admin' && user?.role !== 'super_admin';
    if (isRestricted) return null;

    return (
      <button 
        onClick={() => {
          setCurrentView(view);
          setMobileMenuOpen(false);
        }}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
          currentView === view ? 'bg-brand-blue text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
        }`}
      >
        <div className="flex items-center gap-3">
           <Icon size={20} className={currentView === view ? 'text-brand-yellow' : 'group-hover:text-brand-blue'} />
           <span className="font-bold text-sm tracking-tight">{label}</span>
        </div>
        {currentView === view && <ChevronRight size={14} className="text-white/50" />}
      </button>
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case 'super_admin': return <SuperAdminDashboard />;
      case 'dashboard': return <DashboardHome t={t} />;
      case 'marketing': return <MarketingAutomation />;
      case 'customers': return <CustomerManager />;
      case 'categories': return <CategoryManager />;
      case 'products': return <ProductManager />;
      case 'inventory': return <InventoryManager />;
      case 'orders': return <OrderManager />;
      case 'delivery': return <DeliveryManager />;
      case 'bookings': return <BookingManager />;
      case 'reports': return <ReportsManager />;
      case 'accounting': return <AccountingSystem />;
      case 'ai-intel': return <AISalesIntelligence />;
      case 'users': return <UserManager />;
      case 'payments': return <PaymentManager />;
      case 'social': return <SocialLinksManager />;
      case 'settings': return <SettingsManager />;
      case 'security': return <SecurityOverview />;
      case 'mobile-roadmap': return <MobileRoadmap />;
      case 'deployment': return <DeploymentMap />;
      case 'deployment-guide': return <DeploymentGuide />;
      case 'pos': return <CashierPOS />;
      case 'kds': return <KitchenKDS />;
      default: return <DashboardHome t={t} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-brand-light relative">
      {/* Mobile Header Overlay */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b flex items-center justify-between px-6 z-30">
         <span className="font-heading font-extrabold text-brand-blue">NOUN Admin</span>
         <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-gray-100 rounded-lg">
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
         </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-100 p-8 space-y-2 transform transition-transform duration-300 md:relative md:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="mb-10">
           <div className="flex items-center gap-3 mb-6 p-1">
              <div className="w-10 h-10 bg-brand-blue rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-100">N</div>
              <div>
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">Enterprise</p>
                 <h2 className="text-lg font-heading font-bold text-gray-900 leading-none">Admin Hub</h2>
              </div>
           </div>
           
           <div className="bg-brand-light rounded-2xl p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${user?.role === 'super_admin' ? 'bg-black text-brand-yellow' : 'bg-brand-yellow text-brand-blue'}`}>
                    {user?.role === 'super_admin' ? 'SU' : 'AD'}
                 </div>
                 <div className="overflow-hidden">
                    <p className="text-xs font-bold text-gray-900 truncate">{user?.name || 'Loading...'}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">{user?.role === 'super_admin' ? 'System Owner' : user?.role}</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-350px)] pr-2 scrollbar-hide">
           {user?.role === 'super_admin' && (
             <>
               <p className="text-[10px] font-black text-brand-blue uppercase tracking-[0.2em] mb-4 mt-4 ml-2">Global Admin</p>
               <SidebarItem icon={Globe} label="Franchise Dashboard" view="super_admin" />
             </>
           )}

           <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4 mt-4 ml-2">Main Terminals</p>
           <SidebarItem icon={Monitor} label="Cashier POS" view="pos" />
           <SidebarItem icon={ChefHat} label="Kitchen KDS" view="kds" />
           
           <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4 mt-8 ml-2">Analytics</p>
           <SidebarItem icon={LayoutDashboard} label="Branch Dashboard" view="dashboard" />
           <SidebarItem icon={PieChart} label="Accounting" view="accounting" adminOnly />
           <SidebarItem icon={Sparkles} label="AI Insights" view="ai-intel" />
           <SidebarItem icon={Megaphone} label="Marketing" view="marketing" adminOnly />
           <SidebarItem icon={FileText} label="Reports" view="reports" />

           <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4 mt-8 ml-2">Sales Flow</p>
           <SidebarItem icon={ShoppingBag} label="Orders Hub" view="orders" />
           <SidebarItem icon={Truck} label="Delivery Fleet" view="delivery" />
           <SidebarItem icon={Calendar} label="Bookings" view="bookings" />
           <SidebarItem icon={CreditCard} label="Transactions" view="payments" />

           <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4 mt-8 ml-2">Assets</p>
           <SidebarItem icon={Boxes} label="Inventory Hub" view="inventory" />
           <SidebarItem icon={Package} label="Products" view="products" />
           <SidebarItem icon={Tags} label="Categories" view="categories" />
           <SidebarItem icon={Users} label="Customers" view="customers" />

           <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4 mt-8 ml-2">Engineering</p>
           <SidebarItem icon={BookOpen} label="Deployment Guide" view="deployment-guide" adminOnly />
           <SidebarItem icon={Smartphone} label="Mobile Sync" view="mobile-roadmap" adminOnly />
           <SidebarItem icon={Network} label="Tech Stack" view="deployment" adminOnly />
           <SidebarItem icon={ShieldAlert} label="Security Logs" view="security" adminOnly />
           <SidebarItem icon={UserPlus} label="Staff Manager" view="users" adminOnly />
           <SidebarItem icon={Settings} label="Global Config" view="settings" adminOnly />
        </div>

        <div className="absolute bottom-8 left-8 right-8">
           <button onClick={onLogout} className="w-full flex items-center gap-3 p-3 text-red-500 font-bold text-sm hover:bg-red-50 rounded-xl transition-colors">
              <LogOut size={18} /> Logout
           </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col pt-16 md:pt-0 overflow-y-auto h-screen bg-gray-50/50">
        <div className="p-6 md:p-12">
           <div className="animate-fade-in-up">
              {renderContent()}
           </div>
        </div>
      </div>
    </div>
  );
};

export default CRM;
