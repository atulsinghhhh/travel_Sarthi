import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/admin.service';
import { bookingService } from '../../services/booking.service';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp, DollarSign, Package } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminOverview = () => {
  const [stats, setStats] = useState({ users: 0, bookings: 0, revenue: 0 });
  const [trend, setTrend] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, trendRes, bookingsRes] = await Promise.all([
        adminService.getStats(),
        adminService.getBookingsTrend(),
        bookingService.getAll()
      ]);
      setStats(statsRes.data);
      setTrend(trendRes.data);
      setBookings(bookingsRes.data.slice(0, 10)); // Just show recent 10 for overview
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await bookingService.updateStatus(id, newStatus);
      toast.success('Booking status updated');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <div className="p-8 text-center animate-pulse">Loading dashboard...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-blue-100 p-4 rounded-full text-blue-600"><Users size={28} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{stats.users}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-green-100 p-4 rounded-full text-green-600"><Package size={28} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Bookings</p>
            <p className="text-2xl font-bold text-gray-900">{stats.bookings}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-purple-100 p-4 rounded-full text-purple-600"><DollarSign size={28} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">${stats.revenue}</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2"><TrendingUp /> Bookings Trend (Last 30 Days)</h2>
        <div className="h-80 w-full">
          {trend.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">Not enough data to show trend</div>
          )}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Recent Bookings</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                <th className="p-4 font-semibold">Booking ID</th>
                <th className="p-4 font-semibold">User</th>
                <th className="p-4 font-semibold">Package</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm">#{booking.id}</td>
                  <td className="p-4 font-medium text-gray-900">{booking.user?.name || `User ${booking.user_id}`}</td>
                  <td className="p-4 text-gray-600">{booking.package?.title}</td>
                  <td className="p-4 font-semibold">${booking.total_amount}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <select 
                      className="text-sm border-gray-300 rounded shadow-sm focus:ring-blue-500 p-1.5 bg-white border cursor-pointer outline-none"
                      value={booking.status}
                      onChange={(e) => handleStatusUpdate(booking.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirm</option>
                      <option value="cancelled">Cancel</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && <div className="p-8 text-center text-gray-500">No bookings found.</div>}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
