import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Globe, Menu, User, Moon, Sun, Sparkles, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Modal from './Modal';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    const handleClickOutside = () => setIsProfileMenuOpen(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const links = [
    { name: 'Hotels & Stays', path: '/hotels' },
    { name: 'Packages & Tours', path: '/packages' },
    { name: 'Explore', path: '/explore', icon: Compass },
    { name: 'AI Planner', path: '/trip-planner', icon: Sparkles },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsSearchModalOpen(false);
    if (searchQuery.trim()) {
      navigate(`/packages?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className={`fixed w-full z-50 border-b shadow-sm transition-all duration-300 ${isDarkMode ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Left: Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-[#FF385C] flex items-center gap-2 font-bold text-2xl tracking-tight">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44a1.5 1.5 0 01-1.14 0l-7.9-4.44A1 1 0 013 16.5v-9c0-.38.21-.71.53-.88l7.9-4.44a1.5 1.5 0 011.14 0l7.9 4.44c.32.17.53.5.53.88v9z" />
              </svg>
              <span className={`hidden lg:block font-extrabold tracking-tight ${isDarkMode ? 'text-white' : ''}`}>TravelSaarthi</span>
            </Link>
          </div>

          {/* Center: Navigation Links (Desktop) */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-8">
            {links.map((link) => {
              const isActive = location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-bold transition-all py-2 border-b-2 ${
                    isActive 
                      ? 'border-[#FF385C] text-[#FF385C]' 
                      : `border-transparent ${isDarkMode ? 'text-gray-300 hover:text-[#FF385C]' : 'text-gray-700 hover:text-[#FF385C]'}`
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right: Search, Actions & Profile */}
          <div className="flex items-center justify-end gap-3 md:gap-4">
            <button 
              onClick={() => setIsSearchModalOpen(true)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full text-sm font-semibold transition-colors shadow-sm ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
            >
              <Search size={16} className="text-[#FF385C]" /> 
              <span className="hidden sm:inline">Search Anywhere</span>
            </button>

            {user && <NotificationBell />}

            <button onClick={toggleTheme} className={`hidden md:flex items-center justify-center w-10 h-10 rounded-full transition-colors ${isDarkMode ? 'hover:bg-gray-800 text-yellow-400' : 'hover:bg-gray-100 text-gray-700'}`} title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={(e) => { e.stopPropagation(); setIsProfileMenuOpen(!isProfileMenuOpen); }}
                className={`flex items-center gap-3 border rounded-full p-2 hover:shadow-md transition ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-white'}`}
              >
                <Menu className={`w-5 h-5 ml-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                <div className="w-8 h-8 bg-[#FF385C] text-white font-bold rounded-full flex items-center justify-center overflow-hidden text-sm">
                  {user ? user.name?.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                </div>
              </button>

              {/* Dropdown Menu */}
              {isProfileMenuOpen && (
                <div 
                  onClick={(e) => e.stopPropagation()} 
                  className={`absolute right-0 mt-2 w-60 rounded-2xl shadow-xl border overflow-hidden z-50 py-2 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}
                >
                  {user ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-100 mb-1 bg-gray-50/50">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link to="/dashboard/bookings" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-[#FF385C]/10 hover:text-[#FF385C] transition">Trips</Link>
                      <Link to="/dashboard/favorites" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-[#FF385C]/10 hover:text-[#FF385C] transition">Wishlists</Link>
                      <hr className="my-1 border-gray-100" />
                      <Link to="/dashboard/profile" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-[#FF385C]/10 hover:text-[#FF385C] transition">Account Settings</Link>
                      <Link to="/help" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-[#FF385C]/10 hover:text-[#FF385C] transition">Help Center</Link>
                      <hr className="my-1 border-gray-100" />
                      <button onClick={() => { logout(); setIsProfileMenuOpen(false); }} className="w-full text-left block px-4 py-2.5 text-sm text-[#FF385C] hover:bg-[#FF385C]/10 font-medium transition">Log out</button>
                    </>
                  ) : (
                    <>
                      <Link to="/register" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-3 text-sm font-bold text-gray-900 hover:bg-[#FF385C]/10 hover:text-[#FF385C] transition">Sign up</Link>
                      <Link to="/login" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-3 text-sm text-gray-700 hover:bg-[#FF385C]/10 hover:text-[#FF385C] transition">Log in</Link>
                      <hr className="my-2 border-gray-100" />
                      <Link to="/about" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-3 text-sm text-gray-700 hover:bg-[#FF385C]/10 hover:text-[#FF385C] transition">TravelSaarthi your home</Link>
                      <Link to="/contact" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-3 text-sm text-gray-700 hover:bg-[#FF385C]/10 hover:text-[#FF385C] transition">Help Center</Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Links */}
        <div className={`md:hidden flex justify-around pb-3 border-t pt-2 ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                  location.pathname.startsWith(link.path)
                    ? 'bg-[#FF385C] text-white shadow-sm'
                    : isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Global Interactive Search Modal */}
      <Modal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} title="Search Stays & Destinations">
        <form onSubmit={handleSearchSubmit} className="space-y-6 p-2">
          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Where do you want to go?</label>
            <div className="relative">
              <input 
                type="text"
                autoFocus
                placeholder="Search destinations (e.g. Maldives, Goa, Paris)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-12 pr-4 py-4 border rounded-2xl font-medium focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] outline-none transition text-sm ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'}`}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button 
              type="button" 
              onClick={() => setIsSearchModalOpen(false)} 
              className="px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 text-sm transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-8 py-3 bg-[#FF385C] text-white font-semibold rounded-xl hover:bg-[#D70466] shadow-lg shadow-[#FF385C]/20 text-sm transition-colors"
            >
              Search
            </button>
          </div>
        </form>
      </Modal>
    </nav>
  );
};

export default Navbar;
