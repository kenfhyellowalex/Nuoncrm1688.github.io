import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { DbBooking, Translations } from '../types';
import { 
  CheckCircle, Clock, Calendar, Users, ArrowLeft, 
  RefreshCw, MapPin, Phone, MessageSquare, ShieldCheck
} from 'lucide-react';

interface BookingStatusProps {
  bookingId: number;
  onNavigate: (page: string) => void;
  t: Translations;
}

const BookingStatus: React.FC<BookingStatusProps> = ({ bookingId, onNavigate, t }) => {
  const [booking, setBooking] = useState<DbBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const response = await api.bookings.list();
      if (response.status === 'success' && response.data) {
        const found = response.data.find(b => b.id === bookingId);
        if (found) {
          setBooking(found);
        } else {
          setError("Reservation not found.");
        }
      }
    } catch (err) {
      setError("Failed to fetch reservation details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 8000); // Poll every 8 seconds
    return () => clearInterval(interval);
  }, [bookingId]);

  if (loading && !booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <RefreshCw className="animate-spin text-brand-blue mb-4" size={40} />
        <p className="text-gray-500">Retrieving reservation info...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl mb-8">
           <h2 className="text-xl font-bold mb-2">Notice</h2>
           <p>{error || "We couldn't find your booking."}</p>
        </div>
        <button onClick={() => onNavigate('booking')} className="font-bold text-brand-blue flex items-center justify-center gap-2 mx-auto">
          <ArrowLeft size={18} /> New Reservation
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-fade-in-up">
      <div className="flex justify-between items-center mb-8">
        <button onClick={() => onNavigate('home')} className="text-gray-500 hover:text-brand-blue flex items-center gap-2 transition-colors font-medium">
          <ArrowLeft size={18} /> Back Home
        </button>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">
          ID: RES-{booking.id}
        </span>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-8">
        {/* Header Branding */}
        <div className={`p-8 text-white ${booking.status === 'confirmed' ? 'bg-green-600' : 'bg-brand-blue'}`}>
          <div className="flex justify-between items-center">
            <div>
              <p className="opacity-80 text-sm uppercase font-bold tracking-widest mb-1">Reservation Status</p>
              <h1 className="text-3xl font-heading font-extrabold capitalize">
                {booking.status === 'confirmed' ? 'Confirmed ✓' : 'Wait-listing...'}
              </h1>
            </div>
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
               <Calendar size={32} />
            </div>
          </div>
        </div>

        {/* Timeline Progress */}
        <div className="p-10 border-b border-gray-100">
           <div className="flex items-center gap-6">
              <div className="relative flex flex-col items-center">
                 <div className="w-10 h-10 rounded-full bg-brand-yellow text-brand-blue flex items-center justify-center z-10 shadow-lg">
                    <ShieldCheck size={20} />
                 </div>
                 <div className={`absolute top-10 w-0.5 h-16 ${booking.status === 'confirmed' ? 'bg-brand-yellow' : 'bg-gray-100'}`}></div>
              </div>
              <div>
                 <h4 className="font-bold text-gray-900">Request Received</h4>
                 <p className="text-sm text-gray-500">We've received your table request at {new Date(booking.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              </div>
           </div>

           <div className="flex items-center gap-6 mt-12">
              <div className="relative flex flex-col items-center">
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 shadow-md border-4 border-white transition-colors ${booking.status === 'confirmed' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-300'}`}>
                    {booking.status === 'confirmed' ? <CheckCircle size={20} /> : <Clock size={20} />}
                 </div>
              </div>
              <div>
                 <h4 className={`font-bold ${booking.status === 'confirmed' ? 'text-green-700' : 'text-gray-400'}`}>Staff Confirmation</h4>
                 <p className="text-sm text-gray-500">
                    {booking.status === 'confirmed' 
                      ? 'Great news! Your table is ready for you.' 
                      : 'Our staff is checking availability. Please stay on this page.'}
                 </p>
              </div>
           </div>
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 bg-gray-50/50">
           <div className="p-8 border-r border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">When & Who</h3>
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-brand-blue flex items-center justify-center">
                       <Calendar size={16} />
                    </div>
                    <span className="text-sm font-bold text-gray-700">{new Date(booking.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-brand-blue flex items-center justify-center">
                       <Clock size={16} />
                    </div>
                    <span className="text-sm font-bold text-gray-700">{booking.time}</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-brand-blue flex items-center justify-center">
                       <Users size={16} />
                    </div>
                    <span className="text-sm font-bold text-gray-700">{booking.peopleCount} People</span>
                 </div>
              </div>
           </div>
           <div className="p-8">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Reservation For</h3>
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-200 text-gray-600 flex items-center justify-center">
                       <MapPin size={16} />
                    </div>
                    <span className="text-sm font-bold text-gray-700">{booking.customerId}</span>
                 </div>
                 {booking.message && (
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-200 text-gray-600 flex items-center justify-center flex-shrink-0">
                           <MessageSquare size={16} />
                        </div>
                        <p className="text-sm italic text-gray-500">"{booking.message}"</p>
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>

      <div className="bg-brand-blue p-8 rounded-3xl text-white text-center shadow-xl">
         <h4 className="text-xl font-bold mb-2">Change of plans?</h4>
         <p className="text-blue-200 text-sm mb-6">If you need to cancel or change your time, please call us immediately.</p>
         <a href="tel:+85512345678" className="inline-flex items-center gap-2 bg-brand-yellow text-brand-blue px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform">
            <Phone size={18} />
            Contact Host
         </a>
      </div>
    </div>
  );
};

export default BookingStatus;