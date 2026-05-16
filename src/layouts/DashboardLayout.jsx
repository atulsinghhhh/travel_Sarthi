import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import dashboardData from '../data/dashboardData.json';
import { Menu, Search, Heart, Briefcase, User, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();

  // Fallback if authUser is null for any reason
  const user = authUser || { name: 'Traveler', email: '', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80' };

  React.useEffect(() => {
    const handleClickOutside = () => setIsProfileMenuOpen(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Trips', path: '/dashboard/bookings' },
    { name: 'Wishlists', path: '/dashboard/favorites' },
    { name: 'Profile', path: '/dashboard/profile' },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-rose-500 flex items-center gap-2 font-bold text-2xl tracking-tight">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44a1.5 1.5 0 01-1.14 0l-7.9-4.44A1 1 0 013 16.5v-9c0-.38.21-.71.53-.88l7.9-4.44a1.5 1.5 0 011.14 0l7.9 4.44c.32.17.53.5.53.88v9z" />
                </svg>
                <span className="hidden md:block">TravelSaarthi</span>
              </Link>
            </div>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `text-sm font-semibold transition-colors pb-7 pt-8 border-b-2 ${
                      isActive ? 'text-gray-900 border-gray-900' : 'text-gray-500 border-transparent hover:text-gray-900'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>

            {/* Right side: Profile Menu */}
            <div className="flex items-center gap-2">
              <Link to="/" className="text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-full text-sm font-semibold hidden md:block transition">
                Switch to hosting
              </Link>
              <button className="p-2 hover:bg-gray-100 rounded-full transition hidden md:block">
                <Globe className="w-5 h-5 text-gray-700" />
              </button>
              
              <div className="relative ml-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsProfileMenuOpen(!isProfileMenuOpen); }}
                  className="flex items-center gap-3 border border-gray-300 rounded-full p-2 hover:shadow-md transition bg-white"
                >
                  <Menu className="w-5 h-5 ml-1 text-gray-500" />
                  <div className="w-8 h-8 bg-rose-500 text-white font-bold rounded-full flex items-center justify-center overflow-hidden text-sm">
                    {authUser ? authUser.name?.charAt(0).toUpperCase() : 'U'}
                  </div>
                </button>

                {/* Dropdown */}
                {isProfileMenuOpen && (
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 py-2 animate-fadeIn"
                  >
                    <div className="px-4 py-3 border-b border-gray-100 mb-1 bg-gray-50/50">
                      <p className="font-semibold text-sm text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link to="/dashboard/bookings" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-rose-50 hover:text-rose-600 transition">Trips</Link>
                    <Link to="/dashboard/favorites" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-rose-50 hover:text-rose-600 transition">Wishlists</Link>
                    <hr className="my-1 border-gray-100" />
                    <Link to="/packages" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition">Explore Experiences</Link>
                    <Link to="/dashboard/profile" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition">Account Settings</Link>
                    <Link to="/about" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition">Help Center</Link>
                    <hr className="my-1 border-gray-100" />
                    <button onClick={handleLogout} className="w-full text-left block px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 font-medium transition">Log out</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Navigation - fixed at bottom */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
          <div className="flex justify-around py-3">
            <NavLink to="/" end className={({isActive}) => `flex flex-col items-center ${isActive ? 'text-rose-500' : 'text-gray-500'}`}>
              <Search className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-semibold">Explore</span>
            </NavLink>
            <NavLink to="/dashboard/favorites" className={({isActive}) => `flex flex-col items-center ${isActive ? 'text-rose-500' : 'text-gray-500'}`}>
              <Heart className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-semibold">Wishlists</span>
            </NavLink>
            <NavLink to="/dashboard/bookings" className={({isActive}) => `flex flex-col items-center ${isActive ? 'text-rose-500' : 'text-gray-500'}`}>
              <Briefcase className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-semibold">Trips</span>
            </NavLink>
            <NavLink to="/dashboard/profile" className={({isActive}) => `flex flex-col items-center ${isActive ? 'text-rose-500' : 'text-gray-500'}`}>
              <User className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-semibold">Profile</span>
            </NavLink>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 mb-16 md:mb-0">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
