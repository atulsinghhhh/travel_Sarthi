import React, { useState, useEffect } from 'react';
import { bookingService } from '../../services/booking.service';
import toast from 'react-hot-toast';
import { Calendar, MapPin, XCircle, CheckCircle, Clock } from 'lucide-react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await bookingService.getAll();
      setBookings(data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      await bookingService.updateStatus(id, 'cancelled');
      toast.success('Booking cancelled successfully');
      fetchBookings(); // Refresh list
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase"><CheckCircle size={14}/> Confirmed</span>;
      case 'cancelled':
        return <span className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase"><XCircle size={14}/> Cancelled</span>;
      default:
        return <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold uppercase"><Clock size={14}/> Pending</span>;
    }
  };

  if (loading) return <div className="text-center py-20 animate-pulse text-lg font-medium text-gray-500">Loading your trips...</div>;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="border-b border-gray-200 pb-6 mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-1 text-gray-900 tracking-tight">Trips</h1>
        <p className="text-lg text-gray-500 font-medium">Explore and keep track of all your upcoming and past adventures.</p>
      </div>
      
      {bookings.length === 0 ? (
        <div className="py-8">
          <div className="mb-6">
            <h3 className="text-2xl font-medium text-gray-900 mb-3">No trips booked...yet!</h3>
            <p className="text-gray-500 text-lg">Time to dust off your bags and start planning your next adventure.</p>
          </div>
          <button 
            onClick={() => window.location.href = '/'}
            className="border border-gray-900 text-gray-900 hover:bg-gray-50 font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Start searching
          </button>
          
          <hr className="my-10 border-gray-200" />
          <p className="text-gray-600">Can't find your reservation here? <a href="#" className="underline font-semibold text-gray-900">Visit the Help Center</a></p>
        </div>
      ) : (
        <div className="space-y-8">
          {bookings.map(booking => (
            <div key={booking.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col md:flex-row hover:shadow-lg transition-shadow duration-300">
              
              <div className="w-full md:w-1/3 h-48 md:h-auto bg-gray-100 shrink-0 relative">
                {(booking.package?.image || booking.hotel?.image || booking.hotel?.images?.[0]) ? (
                  <img
                    src={booking.package?.image || booking.hotel?.image || booking.hotel?.images?.[0]}
                    alt={booking.package?.title || booking.hotel?.name || 'Booking'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
                <div className="absolute top-4 left-4">
                  {getStatusBadge(booking.status)}
                </div>
              </div>

              <div className="p-6 md:p-8 grow flex flex-col justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Entire trip</p>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{booking.package?.title || booking.hotel?.name || 'Booking'}</h2>
                  
                  <div className="space-y-3 text-gray-600 mb-6">
                    <div className="flex items-center gap-3"><MapPin className="text-gray-400 w-5 h-5"/> <span>{booking.package?.destination || booking.hotel?.location || booking.hotel?.city}</span></div>
                    <div className="flex items-center gap-3"><Calendar className="text-gray-400 w-5 h-5"/> <span>{booking.start_date} to {booking.end_date}</span></div>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-gray-100 pt-6 mt-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Cost</p>
                    <p className="text-2xl font-bold text-gray-900">${booking.total_amount}</p>
                  </div>
                  
                  {booking.status === 'pending' && (
                    <button 
                      onClick={() => handleCancelBooking(booking.id)}
                      className="text-gray-900 hover:bg-gray-100 font-semibold px-5 py-2.5 rounded-lg border border-gray-300 transition-colors"
                    >
                      Cancel Trip
                    </button>
                  )}
                </div>
              </div>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
