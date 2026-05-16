import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardHome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // In an Airbnb-style dashboard, the main entry point is usually "Trips"
    // So we just redirect the root /dashboard to /dashboard/bookings
    navigate('/dashboard/bookings', { replace: true });
  }, [navigate]);

  return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
    </div>
  );
};

export default DashboardHome;
