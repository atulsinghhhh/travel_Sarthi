import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { notificationService } from '../services/notification.service';

const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await notificationService.getAll(1);
      setNotifications(data.data.slice(0, 5));
      setUnreadCount(data.meta.unread_count);
    } catch (error) {
      console.error('Failed to fetch notifications');
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      fetchNotifications();
    } catch (e) {}
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors relative outline-none"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in-up">
          <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-gray-800">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={async () => {
                  await notificationService.markAllAsRead();
                  fetchNotifications();
                }} 
                className="text-xs text-blue-600 font-medium hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">No new notifications</div>
            ) : (
              notifications.map(notif => (
                <div 
                  key={notif.id} 
                  className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${notif.read_at ? 'opacity-70' : 'bg-blue-50/30'}`}
                  onClick={() => !notif.read_at && handleMarkAsRead(notif.id)}
                >
                  <h4 className="text-sm font-bold text-gray-800">{notif.data?.title || 'Update'}</h4>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{notif.data?.message}</p>
                  <p className="text-[10px] text-gray-400 mt-2">{new Date(notif.created_at).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>

          <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
            <Link to="/dashboard/notifications" onClick={() => setIsOpen(false)} className="text-sm text-blue-600 font-medium hover:underline">
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
