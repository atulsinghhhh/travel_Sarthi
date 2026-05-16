import api from './api';

export const notificationService = {
  getAll: (page = 1) => api.get(`/notifications?page=${page}`),
  markAsRead: (id) => api.post(`/notifications/${id}/read`),
  markAllAsRead: () => api.post('/notifications/read-all'),
};
