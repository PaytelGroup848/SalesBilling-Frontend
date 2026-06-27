import api from './axios.js';

export const getClients = (params) => api.get('/clients', { params }).then(r => r.data.data);
export const getClient = (id) => api.get(`/clients/${id}`).then(r => r.data.data);
export const createClient = (data) => api.post('/clients', data).then(r => r.data.data);
export const updateClient = (id, data) => api.put(`/clients/${id}`, data).then(r => r.data.data);
export const deleteClient = (id) => api.delete(`/clients/${id}`).then(r => r.data.data);
