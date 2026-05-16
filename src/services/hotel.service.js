import api from './api';

export const hotelService = {
  getAll: (params) => api.get('/hotels', { params }),
  getById: (id) => api.get(`/hotels/${id}`),
  create: (data) => api.post('/admin/hotels', data),
  update: (id, data) => api.put(`/admin/hotels/${id}`, data),
  delete: (id) => api.delete(`/admin/hotels/${id}`),
  uploadImages: (id, data) => api.post(`/admin/hotels/${id}/images`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
};
