import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Package, CalendarDays, Building2, 
  Users, Tags, MessageSquare, Menu, LogOut, X, Bell 
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Bookings', icon: CalendarDays, path: '/admin/bookings' },
    { name: 'Packages', icon: Package, path: '/admin/packages' },
    { name: 'Hotels', icon: Building2, path: '/admin/hotels' },
    { name: 'Users', icon: Users, path: '/admin/users' },
    { name: 'Coupons', icon: Tags, path: '/admin/coupons' },
    { name: 'Reviews', icon: MessageSquare, path: '/admin/reviews' },
  ];

  const { user, logout } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  React.useEffect(() => {
    fetchNotifications();

    const handleClickOutside = () => {
      setShowNotifications(false);
      setShowProfileMenu(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data.data || []);
      setUnreadCount(data.meta?.unread_count || 0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.post('/notifications/read-all');
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileOpen(false)} />
      )}

      <aside className={`fixed md:static inset-y-0 left-0 z-50 bg-white border-r border-gray-200 text-gray-700 transition-all duration-300 flex flex-col
        ${isSidebarOpen ? 'w-64' : 'w-20'} 
        ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}`}>
        
        <div className="flex items-center justify-between p-6 border-b border-gray-100 h-20">
          <div className={`font-semibold text-lg tracking-tight text-rose-500 overflow-hidden whitespace-nowrap ${!isSidebarOpen && 'md:hidden'}`}>
            TravelSaarthi
          </div>
          <button className="md:hidden text-gray-400 hover:text-gray-600" onClick={() => setIsMobileOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/admin'}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg font-normal transition text-sm
                ${isActive ? 'bg-rose-50 text-rose-600 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${!isSidebarOpen && 'md:w-0 md:opacity-0'}`}>
                {item.name}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="flex items-center px-4 py-3 w-full rounded-lg text-gray-600 hover:bg-rose-50 hover:text-rose-600 transition text-sm font-normal">
            <span className={`whitespace-nowrap transition-all duration-300 ${!isSidebarOpen && 'md:hidden'}`}>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50/50">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileOpen(true)} className="md:hidden text-gray-600 hover:text-gray-900 p-2 outline-none">
              <Menu size={24} />
            </button>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden md:block text-gray-500 hover:text-gray-900 p-2 rounded-xl hover:bg-gray-100 transition outline-none">
              <Menu size={20} />
            </button>
          </div>

          <div className="flex items-center gap-4 relative">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
              className="relative p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-full transition outline-none"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
              )}
            </button>

            {showNotifications && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute right-12 top-14 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 animate-fadeIn"
              >
                <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-900">Notifications</h4>
                  {unreadCount > 0 && (
                    <button onClick={handleMarkAllRead} className="text-xs text-rose-500 hover:text-rose-600 font-medium">Mark all read</button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-gray-400 p-4 text-center">No notifications</p>
                  ) : (
                    notifications.map(n => {
                      const itemData = typeof n.data === 'string' ? JSON.parse(n.data) : n.data;
                      return (
                        <div key={n.id} className={`p-3.5 hover:bg-gray-50 transition text-xs ${!n.read_at ? 'bg-rose-50/30 font-medium' : 'text-gray-600'}`}>
                          <p className="text-gray-800 leading-relaxed">{itemData?.message || 'Notification'}</p>
                          <span className="text-[10px] text-gray-400 mt-1 block">{itemData?.time || 'Recent'}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            <div 
              onClick={(e) => { e.stopPropagation(); setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
              className="h-9 w-9 rounded-full bg-rose-500 flex items-center justify-center text-white font-semibold shadow-md border-2 border-white cursor-pointer select-none text-sm"
            >
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>

            {showProfileMenu && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-14 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-fadeIn"
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'Administrator'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@travelsarthi.com'}</p>
                </div>
                <div className="py-1">
                  <button onClick={() => navigate('/')} className="w-full text-left px-4 py-2.5 text-xs text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition font-medium">
                    🌐 Switch to Tourist Portal
                  </button>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 transition font-medium">
                    🚪 Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
