import api from './api';

export const couponService = {
  validate: (code) => api.post('/coupons/validate', { code }),
  create: (data) => api.post('/coupons', data),
  getAll: () => api.get('/coupons'),
};
