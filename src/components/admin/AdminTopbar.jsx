import React from 'react';
import NotificationBell from '../NotificationBell';
import { useAuth } from '../../context/AuthContext';

const AdminTopbar = ({ setIsMobileOpen }) => {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm flex items-center justify-between px-4 sm:px-6 z-10 sticky top-0 transition-colors duration-300 font-semibold">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
          </svg>
        </button>

        {/* Global Search */}
        <div className="hidden sm:flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 w-64 lg:w-96 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search bookings, users..." 
            className="bg-transparent border-none outline-none pl-2 text-sm w-full text-gray-900 placeholder-gray-400 font-semibold"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Notifications */}
        <NotificationBell />

        {/* Profile */}
        <div className="flex items-center gap-2 p-1 pl-2 pr-3 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors">
          {user?.avatar ? (
            <img src={user.avatar} alt="Admin" className="w-8 h-8 rounded-full object-cover border border-gray-200" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#FF385C]/20 text-[#FF385C] flex items-center justify-center font-bold text-sm">
              {user ? user.name?.charAt(0).toUpperCase() : 'A'}
            </div>
          )}
          <span className="text-sm font-bold text-gray-900 hidden sm:block">{user?.name || 'Admin'}</span>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
