import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <header className="h-20 flex items-center px-6 border-b border-gray-200">
        <Link to="/" className="text-rose-500 font-bold text-2xl tracking-tight flex items-center gap-2">
           <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44a1.5 1.5 0 01-1.14 0l-7.9-4.44A1 1 0 013 16.5v-9c0-.38.21-.71.53-.88l7.9-4.44a1.5 1.5 0 011.14 0l7.9 4.44c.32.17.53.5.53.88v9z" />
          </svg>
          <span className="hidden sm:inline">TravelSaarthi</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 sm:py-16">
        <div className="w-full max-w-[560px] bg-white sm:border sm:border-gray-300 sm:rounded-2xl sm:shadow-xl overflow-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
