import { useState, useEffect } from 'react';
import { adminService } from '../services/admin.service';

export const useAdminStats = () => {
  const [stats, setStats] = useState(null);
  const [trend, setTrend] = useState([]);
  const [popularPackages, setPopularPackages] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [bookingsByType, setBookingsByType] = useState([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, trendRes, popRes, userRes, typeRes] = await Promise.all([
        adminService.getStats(),
        adminService.getBookingsTrend(days),
        adminService.getPopularPackages(5),
        adminService.getUserGrowth(6),
        adminService.getBookingsByType()
      ]);
      setStats(statsRes.data);
      setTrend(trendRes.data);
      setPopularPackages(popRes.data);
      setUserGrowth(userRes.data);
      setBookingsByType(typeRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [days]);

  return { stats, trend, popularPackages, userGrowth, bookingsByType, loading, days, setDays };
};
