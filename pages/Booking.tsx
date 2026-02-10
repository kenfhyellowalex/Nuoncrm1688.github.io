import React, { useState } from 'react';
import { Calendar, Clock, Users, CheckCircle, Loader, MessageSquare } from 'lucide-react';
import { Translations } from '../types';
import { api } from '../services/api';

interface BookingProps {
  t: Translations;
  onNavigate: (page: string, params?: any) => void;
}

const Booking: React.FC<BookingProps> = ({ t, onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2 People',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create the booking via API
      const response = await api.bookings.create({
        customerId: formData.name, // Mock: Using name as ID for tracking simplicity
        date: formData.date,
        time: formData.time,
        peopleCount: parseInt(formData.guests),
        message: formData.message
      });

      if (response.status === 'success' && response.booking_id) {
        // 2. Navigate to status tracking page
        onNavigate('booking-status', { bookingId: response.booking_id });
      }
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        
        {/* Info Side */}
        <div className="lg:col-span-5 mb-10 lg:mb-0">
          <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">{t.booking.title}</h2>
          <p className="text-gray-600 mb-8">
            {t.booking.desc}
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-brand-yellow text-brand-blue">
                  <Clock size={24} />
                </div>
              </div>
              <div className="ml-4">
                <h5 className="text-lg font-bold text-gray-900">{t.booking.info.hoursTitle}</h5>
                <p className="mt-1 text-gray-500">{t.booking.info.hours}</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-brand-yellow text-brand-blue">
                  <Users size={24} />
                </div>
              </div>
              <div className="ml-4">
                <h5 className="text-lg font-bold text-gray-900">{t.booking.info.groupTitle}</h5>
                <p className="mt-1 text-gray-500">{t.booking.info.groupDesc}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-2xl p-8 border-t-4 border-brand-brown">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t.booking.labels.name}</label>
                <div className="mt-1">
                  <input 
                    type="text" name="name" id="name" required 
                    value={formData.name} onChange={handleChange}
                    className="py-3 px-4 block w-full shadow-sm focus:ring-brand-blue focus:border-brand-blue border border-gray-300 rounded-md outline-none transition-all" 
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t.booking.labels.email}</label>
                <div className="mt-1">
                  <input 
                    type="email" name="email" id="email" required 
                    value={formData.email} onChange={handleChange}
                    className="py-3 px-4 block w-full shadow-sm focus:ring-brand-blue focus:border-brand-blue border border-gray-300 rounded-md outline-none transition-all" 
                  />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">{t.booking.labels.phone}</label>
                <div className="mt-1">
                  <input 
                    type="tel" name="phone" id="phone" required 
                    value={formData.phone} onChange={handleChange}
                    className="py-3 px-4 block w-full shadow-sm focus:ring-brand-blue focus:border-brand-blue border border-gray-300 rounded-md outline-none transition-all" 
                  />
                </div>
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">{t.booking.labels.date}</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size={16} className="text-gray-400" />
                  </div>
                  <input 
                    type="date" name="date" id="date" required 
                    value={formData.date} onChange={handleChange}
                    className="focus:ring-brand-blue focus:border-brand-blue block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 outline-none transition-all" 
                  />
                </div>
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">{t.booking.labels.time}</label>
                <div className="mt-1">
                  <input 
                    type="time" name="time" id="time" required 
                    value={formData.time} onChange={handleChange}
                    className="py-3 px-4 block w-full shadow-sm focus:ring-brand-blue focus:border-brand-blue border border-gray-300 rounded-md outline-none transition-all" 
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="guests" className="block text-sm font-medium text-gray-700">{t.booking.labels.guests}</label>
                <select 
                  id="guests" name="guests" 
                  value={formData.guests} onChange={handleChange}
                  className="mt-1 block w-full py-3 px-4 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm outline-none"
                >
                  <option>2 People</option>
                  <option>3 People</option>
                  <option>4 People</option>
                  <option>5-8 People</option>
                  <option>10+ People</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">{t.booking.labels.message}</label>
                <div className="mt-1">
                  <textarea 
                    name="message" id="message" rows={3}
                    value={formData.message} onChange={handleChange}
                    className="py-3 px-4 block w-full shadow-sm focus:ring-brand-blue focus:border-brand-blue border border-gray-300 rounded-md outline-none"
                  ></textarea>
                </div>
              </div>
              <div className="sm:col-span-2">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full inline-flex justify-center items-center py-4 px-6 border border-transparent shadow-xl text-lg font-bold rounded-xl text-brand-blue bg-brand-yellow hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-all disabled:opacity-50"
                >
                  {loading ? <Loader className="animate-spin mr-2" /> : <CheckCircle className="mr-2" />}
                  {loading ? "Processing..." : t.booking.labels.submit}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Booking;