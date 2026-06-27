import api from './axios.js';

export const getBills = (params) => api.get('/bills', { params }).then(r => r.data.data);
export const getBill = (id) => api.get(`/bills/${id}`).then(r => r.data.data);
export const createBill = (data) => api.post('/bills', data).then(r => r.data.data);
export const updateBill = (id, data) => api.put(`/bills/${id}`, data).then(r => r.data.data);
export const deleteBill = (id) => api.delete(`/bills/${id}`).then(r => r.data.data);
export const submitBill = (id) => api.post(`/bills/${id}/submit`).then(r => r.data.data);
export const approveBill = (id) => api.post(`/bills/${id}/approve`).then(r => r.data.data);
export const rejectBill = (id, data) => api.post(`/bills/${id}/reject`, data).then(r => r.data.data);
export const sendBillEmail = (id) => api.post(`/bills/${id}/send-email`).then(r => r.data.data);
