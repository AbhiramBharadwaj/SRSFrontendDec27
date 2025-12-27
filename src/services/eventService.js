import api from './api';

export const eventService = {
  getAllEvents: async (params = {}) => {
    const response = await api.get('/events', { params });
    return response.data;
  },

  getEventById: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  createEvent: async (eventData) => {
    const response = await api.post('/events', eventData);
    return response.data;
  },

  updateEvent: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

  deleteEvent: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  getFeaturedEvents: async () => {
    const response = await api.get('/events/featured');
    return response.data;
  },

  getUpcomingEvents: async (limit = 6) => {
    const response = await api.get(`/events/upcoming?limit=${limit}`);
    return response.data;
  },

  searchEvents: async (query, filters = {}) => {
    const response = await api.get('/events/search', {
      params: { q: query, ...filters },
    });
    return response.data;
  },
};