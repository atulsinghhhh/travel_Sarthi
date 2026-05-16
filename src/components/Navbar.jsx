import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Globe, Menu, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  React.useEffect(() => {
    const handleClickOutside = () => setIsProfileMenuOpen(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const links = [
    { name: 'Stays', path: '/hotels' },
    { name: 'Experiences', path: '/packages' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed w-full z-50 bg-white border-b border-gray-200 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Left: Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-rose-500 flex items-center gap-2 font-bold text-2xl tracking-tight">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44a1.5 1.5 0 01-1.14 0l-7.9-4.44A1 1 0 013 16.5v-9c0-.38.21-.71.53-.88l7.9-4.44a1.5 1.5 0 011.14 0l7.9 4.44c.32.17.53.5.53.88v9z" />
              </svg>
              <span className="hidden lg:block">TravelSaarthi</span>
            </Link>
          </div>

          {/* Center: Search / Links (Desktop) */}
          <div className="hidden md:flex flex-1 items-center justify-center">
            {location.pathname === '/' ? (
              <div className="flex gap-6">
                {links.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="text-gray-900 font-semibold hover:text-gray-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex items-center border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow cursor-pointer pl-6 pr-2 py-2">
                <span className="text-sm font-semibold text-gray-900 border-r border-gray-300 pr-4">Anywhere</span>
                <span className="text-sm font-semibold text-gray-900 border-r border-gray-300 px-4">Any week</span>
                <span className="text-sm text-gray-500 pl-4 pr-3">Add guests</span>
                <div className="bg-rose-500 p-2 rounded-full text-white">
                  <Search size={14} strokeWidth={3} />
                </div>
              </div>
            )}
          </div>

          {/* Right: Actions & Profile */}
          <div className="flex items-center justify-end gap-1 md:gap-2">
            <Link to="/about" className="hidden md:block text-sm font-semibold text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-full transition-colors">
              TravelSaarthi your home
            </Link>
            <button className="hidden md:block p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Globe className="w-5 h-5 text-gray-900" />
            </button>
            
            {/* Profile Dropdown */}
            <div className="relative ml-2">
              <button 
                onClick={(e) => { e.stopPropagation(); setIsProfileMenuOpen(!isProfileMenuOpen); }}
                className="flex items-center gap-3 border border-gray-300 rounded-full p-2 hover:shadow-md transition bg-white"
              >
                <Menu className="w-5 h-5 ml-1 text-gray-600" />
                <div className="w-8 h-8 bg-rose-500 text-white font-bold rounded-full flex items-center justify-center overflow-hidden text-sm">
                  {user ? user.name?.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                </div>
              </button>

              {/* Dropdown Menu */}
              {isProfileMenuOpen && (
                <div 
                  onClick={(e) => e.stopPropagation()} 
                  className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 py-2 animate-fadeIn"
                >
                  {user ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-100 mb-1 bg-gray-50/50">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link to="/dashboard/bookings" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-rose-50 hover:text-rose-600 transition">Trips</Link>
                      <Link to="/dashboard/favorites" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-rose-50 hover:text-rose-600 transition">Wishlists</Link>
                      <hr className="my-1 border-gray-100" />
                      <Link to="/dashboard/profile" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition">Account Settings</Link>
                      <Link to="/about" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition">Help Center</Link>
                      <hr className="my-1 border-gray-100" />
                      <button onClick={() => { logout(); setIsProfileMenuOpen(false); }} className="w-full text-left block px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 font-medium transition">Log out</button>
                    </>
                  ) : (
                    <>
                      <Link to="/register" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-3 text-sm font-bold text-gray-900 hover:bg-rose-50 hover:text-rose-600 transition">Sign up</Link>
                      <Link to="/login" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-3 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition">Log in</Link>
                      <hr className="my-2 border-gray-100" />
                      <Link to="/about" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-3 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition">TravelSaarthi your home</Link>
                      <Link to="/contact" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-3 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition">Help Center</Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search - Only shows if not home and on mobile */}
        {location.pathname !== '/' && (
          <div className="md:hidden pb-4">
            <div className="flex items-center border border-gray-300 rounded-full shadow-sm px-4 py-3 bg-gray-50">
              <Search className="w-5 h-5 text-gray-800 mr-3" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900 leading-tight">Where to?</span>
                <span className="text-xs text-gray-500">Anywhere • Any week • Add guests</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
