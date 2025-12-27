import api from './api';

export const bookingService = {
  createBooking: async (bookingData) => {
    const res = await api.post('/bookings', bookingData);
    return res.data;
  },

 getUserBookings: async () => {
  const response = await api.get('/bookings/user');
  
  const bookings = response.data.data || [];
  console.log(bookings)
  return {
    ...response,
    data: bookings.map(booking => ({
      ...booking,
      event: booking.event || { title: 'Event Deleted', location: 'N/A' }
    }))
  };
 },

  getBookingById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },
  cancelBooking: async (id) => {
    const response = await api.put(`/bookings/${id}/cancel`);
    return response.data;
  },

  downloadTicket: async (id) => {
    const response = await api.get(`/bookings/${id}/ticket`, {
      responseType: 'blob',
    });
    return response.data;
  },

  scanQRCode: async (qrCode) => {
    const response = await api.post('/bookings/scan-qr', { qrCode });
    return response.data;
  },

  initiatePayment: async (bookingId, amount) => {
    const response = await api.post('/bookings/payment/initiate', {
      bookingId,
      amount,
    });
    return response.data;
  },

  verifyPayment: async (paymentData) => {
    const response = await api.post('/bookings/payment/verify', paymentData);
    return response.data;
  },
};
