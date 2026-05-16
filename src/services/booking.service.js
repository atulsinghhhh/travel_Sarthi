import api from './api';

export const bookingService = {
  getAll: () => api.get('/bookings'),
  create: (data) => api.post('/bookings', data),
  updateStatus: (id, status) => api.patch(`/bookings/${id}/status`, { status }),
};
