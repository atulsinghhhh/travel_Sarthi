import api from './api';

export const travellerService = {
  getAll: () => api.get('/travellers'),
  create: (data) => api.post('/travellers', data),
  update: (id, data) => api.put(`/travellers/${id}`, data),
  delete: (id) => api.delete(`/travellers/${id}`),
};
