import React, { useState } from 'react';
import { api } from '../services/api';
import { DbUser } from '../types';
import { Lock, Mail, Loader, ArrowLeft, Shield, Building2, Store } from 'lucide-react';
import Logo from '../components/Logo';

interface LoginProps {
  onLogin: (user: DbUser) => void;
  onNavigate: (page: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleQuickLogin = (role: 'super' | 'company' | 'branch') => {
    if (role === 'super') setEmail('super@nouncrm.com');
    if (role === 'company') setEmail('owner@coffeex.com');
    if (role === 'branch') setEmail('manager@coffeex-b1.com');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.auth.login({ email, password });
      
      if (response.status === 'success' && response.user) {
         onLogin(response.user);
      } else {
         setError(response.message || 'Invalid email or password.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <Logo size="lg" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-heading font-bold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <button onClick={() => onNavigate('home')} className="font-medium text-brand-blue hover:text-blue-500">
            return to website
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-3xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-brand-blue focus:border-brand-blue block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-3 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={16} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-brand-blue focus:border-brand-blue block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-3 outline-none transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold uppercase tracking-wider text-white bg-brand-blue hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:opacity-50 transition-all"
              >
                {loading ? <Loader className="animate-spin" size={20} /> : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 font-medium">
                  Select Role (Demo)
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button 
                onClick={() => handleQuickLogin('super')}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-brand-blue transition-all group"
              >
                 <Shield size={24} className="text-gray-400 group-hover:text-brand-blue mb-2" />
                 <span className="text-[10px] font-bold uppercase text-gray-600">System Admin</span>
              </button>
              <button 
                onClick={() => handleQuickLogin('company')}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-brand-blue transition-all group"
              >
                 <Building2 size={24} className="text-gray-400 group-hover:text-brand-blue mb-2" />
                 <span className="text-[10px] font-bold uppercase text-gray-600">Franchise</span>
              </button>
              <button 
                onClick={() => handleQuickLogin('branch')}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-brand-blue transition-all group"
              >
                 <Store size={24} className="text-gray-400 group-hover:text-brand-blue mb-2" />
                 <span className="text-[10px] font-bold uppercase text-gray-600">Branch Mgr</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;