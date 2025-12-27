import api from './api';

export const adminService = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  getRevenueChart: async (period = '7d') => {
    const response = await api.get(`/admin/dashboard/revenue?period=${period}`);
    return response.data;
  },

  getAllMembers: async (params = {}) => {
    const response = await api.get('/member', { params });
    return response.data;
  },
   getAllUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  importUsers: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/admin/users/import', formData);
    return response.data;
  },

  exportUsers: async () => {
    const response = await api.get('/admin/users/export', {
      responseType: 'blob',
    });
    return response.data;
  },

  getAllMembers: async (params = {}) => {
    const response = await api.get('/admin/members', { params });
    return response.data;
  },

  createMember: async (memberData) => {
    const response = await api.post('/member/add', memberData);
    return response.data;
  },

  updateMember: async (id, memberData) => {
    const response = await api.put(`/admin/members/${id}`, memberData);
    return response.data;
  },

  deleteMember: async (id) => {
    const response = await api.delete(`/admin/members/${id}`);
    return response.data;
  },

  importMembers: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/admin/members/import', formData);
    return response.data;
  },

  exportMembers: async () => {
    const response = await api.get('/admin/members/export', {
      responseType: 'blob',
    });
    return response.data;
  },

  getMemberTemplate: async () => {
    const response = await api.get('/admin/members/template', {
      responseType: 'blob',
    });
    return response.data;
  },

  deactivateMember: async (id) => {
    const response = await api.put(`/admin/members/${id}/deactivate`);
    return response.data;
  },

  getAllBookings: async (params = {}) => {
    const response = await api.get('/admin/bookings', { params });
    return response.data;
  },

  createManualBooking: async (bookingData) => {
    const response = await api.post('/admin/bookings/manual', bookingData);
    return response.data;
  },

  updateBookingStatus: async (id, status) => {
    const response = await api.put(`/admin/bookings/${id}/status`, { status });
    return response.data;
  },
};