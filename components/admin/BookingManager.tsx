
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { DbBooking, ApiResponse } from '../../types';
import { Calendar, Clock, Trash2, Search, Users, MessageSquare, Loader, Check } from 'lucide-react';

const BookingManager: React.FC = () => {
  const [bookings, setBookings] = useState<DbBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await api.bookings.list();
      if (response.status === 'success' && response.data) {
        setBookings(response.data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleConfirm = async (id: number) => {
    setProcessingId(id);
    try {
      // Fix for Error: Property 'data' does not exist on type 'ApiResponse<DbBooking> | { status: string; message: string; }'
      const response = await api.bookings.confirm(id) as ApiResponse<DbBooking>;
      if (response.status === 'success' && response.data) {
        const updatedBooking = response.data;
        setBookings(prev => prev.map(b => b.id === id ? updatedBooking : b));
      }
    } catch (error) {
      console.error("Error confirming booking:", error);
      alert("Failed to confirm booking");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      setProcessingId(id);
      try {
        // Fix for Error: Property 'data' does not exist on type 'ApiResponse<DbBooking> | { status: string; message: string; }'
        const response = await api.bookings.delete(id) as ApiResponse<undefined>;
        if (response.status === 'success') {
          setBookings(prev => prev.filter(b => b.id !== id));
        }
      } catch (error) {
        console.error("Error deleting booking:", error);
        alert("Failed to delete booking");
      } finally {
        setProcessingId(null);
      }
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.message && b.message.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-900">Reservations</h2>
           <p className="text-gray-500">Manage table bookings and reservations.</p>
        </div>
        <button 
          onClick={fetchBookings}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
             <div className="flex justify-center items-center h-64">
                <Loader className="animate-spin text-brand-blue" size={32} />
             </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm font-medium text-gray-900">
                          <Calendar size={16} className="mr-2 text-gray-400" />
                          {new Date(booking.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Clock size={14} className="mr-2 text-gray-400" />
                          {booking.time}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                         <div className="text-sm font-medium text-gray-900">Customer #{booking.customerId}</div>
                         {booking.message && (
                           <div className="flex items-center text-xs text-gray-500 mt-1" title={booking.message}>
                             <MessageSquare size={12} className="mr-1" />
                             <span className="truncate max-w-[150px]">{booking.message}</span>
                           </div>
                         )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Users size={16} className="mr-2 text-gray-400" />
                          {booking.peopleCount}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                          booking.status === 'canceled' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          {booking.status === 'pending' && (
                            <button 
                              onClick={() => handleConfirm(booking.id)}
                              disabled={processingId === booking.id}
                              className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 p-2 rounded-lg transition-colors"
                              title="Confirm Booking"
                            >
                              <Check size={18} />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDelete(booking.id)}
                            disabled={processingId === booking.id}
                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors"
                            title="Delete Booking"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingManager;
