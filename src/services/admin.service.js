import api from './api';

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getBookingsTrend: (days) => api.get(`/admin/bookings-trend?days=${days}`),
  getPopularPackages: (limit) => api.get(`/admin/popular-packages?limit=${limit}`),
  getUserGrowth: (months) => api.get(`/admin/user-growth?months=${months}`),
  getBookingsByType: () => api.get('/admin/bookings-by-type'),
  
  getBookings: (params) => api.get('/admin/bookings', { params }),
  getBookingDetails: (id) => api.get(`/admin/bookings/${id}`),
  updateBookingStatus: (id, data) => api.patch(`/admin/bookings/${id}/status`, data),
  exportBookings: (params) => api.get('/admin/bookings/export', { params, responseType: 'blob' }),
  importBookings: (data) => api.post('/admin/bookings/import', data, { headers: { 'Content-Type': 'multipart/form-data' } }),

  getCoupons: () => api.get('/admin/coupons'),
  createCoupon: (data) => api.post('/admin/coupons', data),
  
  getReviews: () => api.get('/admin/reviews'),
  replyToReview: (id, data) => api.post(`/admin/reviews/${id}/reply`, data),
};
