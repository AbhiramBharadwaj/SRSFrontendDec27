import api from './api';

export const userService = {
  getFavorites: async () => {
    const response = await api.get('/users/favorites');
    return response.data;
  },

  addToFavorites: async (eventId) => {
    const response = await api.post(`/users/favorites/${eventId}`);
    return response.data;
  },

  removeFromFavorites: async (eventId) => {
    const response = await api.delete(`/users/favorites/${eventId}`);
    return response.data;
  },

  getCart: async () => {
    const response = await api.get('/users/cart');
    return response.data;
  },

  addToCart: async (cartData) => {
    const response = await api.post('/users/cart', cartData);
    return response.data;
  },

  updateCartItem: async (eventId, cartData) => {
    const response = await api.put(`/users/cart/${eventId}`, cartData);
    return response.data;
  },

  removeFromCart: async (eventId, bookingType) => {
    const response = await api.delete(`/users/cart/${eventId}?bookingType=${bookingType}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete('/users/cart');
    return response.data;
  },
};