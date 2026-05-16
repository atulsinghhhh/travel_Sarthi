import React, { useRef, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthService from '../../services/auth.service';

const AdminSidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    setIsUploading(true);
    try {
      const response = await AuthService.updateAvatar(formData);
      if (response.data?.user) {
        updateUser(response.data.user);
      }
    } catch (err) {
      console.error('Failed to upload admin avatar', err);
    } finally {
      setIsUploading(false);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: '📊', exact: true },
    { name: 'Users', path: '/admin/users', icon: '👥' },
    { name: 'Hotels', path: '/admin/hotels', icon: '🏨' },
    { name: 'Packages', path: '/admin/packages', icon: '🗺️' },
    { name: 'Bookings', path: '/admin/bookings', icon: '📅' },
    { name: 'Coupons', path: '/admin/coupons', icon: '🏷️' },
    { name: 'Reviews', path: '/admin/reviews', icon: '⭐' },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white border-r border-gray-100 shadow-sm w-64 lg:w-72 transition-colors duration-300">
      {/* Brand */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100">
        <Link to="/" className="text-2xl font-black text-[#FF385C] flex items-center gap-2 tracking-tight">
          <span className="text-3xl">✈️</span> <span className="hidden sm:block">Admin Panel</span>
        </Link>
        <button 
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* Admin Profile Mini */}
      <div className="p-6 border-b border-gray-100 flex items-center gap-4">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="relative w-12 h-12 rounded-full cursor-pointer group flex-shrink-0"
          title="Click to upload profile picture"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleAvatarUpload} 
            accept="image/*" 
            className="hidden" 
          />
          {user?.avatar ? (
            <img 
              src={user.avatar} 
              alt="Admin" 
              className={`w-12 h-12 rounded-full object-cover border-2 border-[#FF385C]/30 shadow-sm transition ${isUploading ? 'opacity-50' : ''}`} 
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#FF385C]/20 text-[#FF385C] flex items-center justify-center font-bold text-xl border-2 border-[#FF385C]/30 shadow-sm">
              {user ? user.name?.charAt(0).toUpperCase() : 'A'}
            </div>
          )}
          
          {isUploading ? (
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            </div>
          ) : (
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" /></svg>
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-gray-900 truncate">{user?.name || 'Super Admin'}</h3>
          <p className="text-xs text-gray-500 font-medium truncate">{user?.email || 'admin@travelsaarthi.com'}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 font-semibold">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.exact}
            onClick={() => setIsMobileOpen(false)}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-[#FF385C] text-white shadow-md font-bold' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-[#FF385C]'
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100 font-semibold">
        <Link 
          to="/login"
          className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          Logout
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full z-20">
        {sidebarContent}
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          ></div>
          <div className="relative w-64 sm:w-72 h-full bg-white transform transition-transform ease-in-out duration-300">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
