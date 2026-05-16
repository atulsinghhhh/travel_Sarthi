import React, { useEffect, useState } from 'react';
import { notificationService } from '../../services/notification.service';
import { Bell, Check, Package, MessageSquare } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [filter, setFilter] = useState('All');
  const { showToast } = useToast();

  useEffect(() => {
    fetchNotifications(1, true);
  }, [filter]);

  const fetchNotifications = async (pageNum, reset = false) => {
    try {
      const { data } = await notificationService.getAll(pageNum);
      let notifs = data.data;
      
      if (filter === 'Unread') notifs = notifs.filter(n => !n.read_at);
      if (filter === 'Bookings') notifs = notifs.filter(n => n.type.includes('Booking'));
      if (filter === 'Reviews') notifs = notifs.filter(n => n.type.includes('Review'));

      setNotifications(prev => reset ? notifs : [...prev, ...notifs]);
      setHasMore(pageNum < data.meta.last_page);
      setPage(pageNum);
    } catch (error) {
      showToast('Failed to load notifications', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
    } catch (error) {
      showToast('Failed to mark as read', 'error');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
      showToast('All marked as read', 'success');
    } catch (error) {
      showToast('Failed to mark all as read', 'error');
    }
  };

  const getIcon = (type) => {
    if (type.includes('Booking')) return <Package size={20} className="text-blue-500" />;
    if (type.includes('Review')) return <MessageSquare size={20} className="text-green-500" />;
    return <Bell size={20} className="text-gray-500" />;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b pb-4 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <button onClick={handleMarkAllAsRead} className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1">
          <Check size={16} /> Mark all as read
        </button>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {['All', 'Unread', 'Bookings', 'Reviews'].map(f => (
          <button 
            key={f} 
            onClick={() => { setLoading(true); setFilter(f); }}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === f ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-200 animate-pulse rounded-xl"></div>)}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <Bell size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">No notifications yet</h3>
          <p className="text-gray-500">When you book packages or receive updates, they'll appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map(notification => (
            <div key={notification.id} className={`p-5 rounded-xl border transition-colors flex gap-4 ${notification.read_at ? 'bg-white border-gray-100' : 'bg-blue-50 border-blue-100'}`}>
              <div className={`p-3 rounded-full flex-shrink-0 h-min ${notification.read_at ? 'bg-gray-100' : 'bg-blue-100'}`}>
                {getIcon(notification.type)}
              </div>
              <div className="flex-grow">
                <h4 className={`font-bold ${notification.read_at ? 'text-gray-700' : 'text-gray-900'}`}>{notification.data?.title || 'Notification'}</h4>
                <p className="text-gray-600 mt-1 text-sm">{notification.data?.message || 'You have a new update.'}</p>
                <p className="text-xs text-gray-400 mt-2">{new Date(notification.created_at).toLocaleString()}</p>
              </div>
              {!notification.read_at && (
                <button onClick={() => handleMarkAsRead(notification.id)} className="w-3 h-3 bg-blue-600 rounded-full flex-shrink-0 mt-2" title="Mark as read"></button>
              )}
            </div>
          ))}

          {hasMore && (
            <div className="text-center mt-8">
              <button onClick={() => fetchNotifications(page + 1)} className="border-2 border-blue-600 text-blue-600 font-bold px-6 py-2 rounded-lg hover:bg-blue-50">
                Load More
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
