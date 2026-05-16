import React from 'react';
import { useAdminStats } from '../../hooks/useAdminStats';
import StatCard from '../../components/admin/StatCard';
import PageHeader from '../../components/admin/PageHeader';
import DataTable from '../../components/admin/DataTable';
import { Users, CalendarDays, IndianRupee, Clock, Package } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';
import StarRating from '../../components/StarRating';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const AdminDashboard = () => {
  const { stats, trend, popularPackages, userGrowth, bookingsByType, loading, days, setDays } = useAdminStats();

  if (loading) return <div className="p-8 text-center text-lg animate-pulse">Loading dashboard...</div>;
  if (!stats) return <div className="p-8 text-center text-red-500">Failed to load analytics</div>;

  const columns = [
    { header: 'Package', accessor: 'name', render: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          {row.image ? <img src={row.image} alt={row.name} className="w-full h-full object-cover"/> : <Package className="w-full h-full p-2 text-gray-400" />}
        </div>
        <span className="font-bold text-gray-800">{row.name}</span>
      </div>
    )},
    { header: 'Bookings', accessor: 'bookings_count', cellClassName: 'font-medium text-gray-900' },
    { header: 'Revenue', accessor: 'revenue', render: (row) => <span className="font-bold text-green-600">₹{Number(row.revenue).toLocaleString('en-IN')}</span> },
    { header: 'Rating', accessor: 'avg_rating', render: (row) => (
      <div className="flex items-center gap-1">
        <StarRating rating={row.avg_rating} size={14} />
        <span className="text-sm font-bold text-gray-700">{Number(row.avg_rating).toFixed(1)}</span>
      </div>
    )},
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return percent > 0.05 ? (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="12" fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  return (
    <div>
      <PageHeader title="Analytics Dashboard" subtitle="Overview of your platform's performance" />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Users" value={stats.total_users} change={`+${stats.new_users_this_month} this month`} changeType="up" icon={Users} color="blue" />
        <StatCard title="Total Bookings" value={stats.total_bookings} change={`+${stats.bookings_this_month} this month`} changeType="up" icon={CalendarDays} color="green" />
        <StatCard title="Total Revenue" value={`₹${Number(stats.total_revenue).toLocaleString('en-IN')}`} change={`+₹${Number(stats.revenue_this_month).toLocaleString('en-IN')}`} changeType="up" icon={IndianRupee} color="purple" />
        <StatCard title="Pending Bookings" value={stats.pending_bookings} icon={Clock} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Bookings & Revenue Trend</h3>
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              {[7, 30, 90].map(d => (
                <button 
                  key={d} 
                  onClick={() => setDays(d)}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-colors outline-none ${days === d ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {d} Days
                </button>
              ))}
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" tick={{fontSize: 12, fill: '#6b7280'}} axisLine={false} tickLine={false} minTickGap={30} />
                <YAxis yAxisId="left" tick={{fontSize: 12, fill: '#6b7280'}} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{fontSize: 12, fill: '#6b7280'}} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <RechartsTooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  labelStyle={{fontWeight: 'bold', color: '#374151', marginBottom: '4px'}}
                />
                <Area yAxisId="left" type="monotone" dataKey="bookings" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorBookings)" name="Bookings" />
                <Area yAxisId="right" type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue ₹" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Bookings by Type</h3>
          <div className="h-64 w-full relative">
            {bookingsByType.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bookingsByType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="type"
                    stroke="white"
                    strokeWidth={2}
                  >
                    {bookingsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Legend iconType="circle" wrapperStyle={{fontSize: '12px'}} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500 italic text-sm">No data available</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Performing Packages</h3>
          <DataTable columns={columns} data={popularPackages} emptyMessage="No bookings yet" />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">User Growth</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userGrowth} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{fontSize: 12, fill: '#6b7280'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12, fill: '#6b7280'}} axisLine={false} tickLine={false} />
                <RechartsTooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="new_users" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="New Users" maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
