import api from './api';

export const packageService = {
  getAll: (params) => api.get('/packages', { params }),
  getById: (id) => api.get(`/packages/${id}`),
  getReviews: (id, page = 1) => api.get(`/packages/${id}/reviews?page=${page}`),
  create: (data) => api.post('/packages', data),
  update: (id, data) => api.put(`/packages/${id}`, data),
  delete: (id) => api.delete(`/packages/${id}`),
  postReview: (data) => api.post('/reviews', data),
  markReviewHelpful: (id) => api.post(`/reviews/${id}/helpful`),
};
