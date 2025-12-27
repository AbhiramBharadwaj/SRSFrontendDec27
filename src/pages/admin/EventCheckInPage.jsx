import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const EventCheckInPage = ({ eventId }) => {
  const [qrCode, setQrCode] = useState('');
  const [booking, setBooking] = useState(null);

  const handleScan = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://srs-backend-7ch1.onrender.com/api/bookings/scan-qr', { qrCode }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setBooking(res.data.data.booking);
      toast.success('Scanned! Pending: ' + res.data.data.booking.remainingScans);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid QR');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Event Check-In</h1>
      <form onSubmit={handleScan} className="space-y-4">
        <input value={qrCode} onChange={(e) => setQrCode(e.target.value)} placeholder="Scan QR Code" className="w-full border p-4 rounded-2xl" />
        <button type="submit" className="w-full bg-green-600 text-white py-4 rounded-2xl">Scan</button>
      </form>

      {booking && (
        <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
          <p>Booking ID: {booking.bookingId}</p>
          <p>People Entered: {booking.qrScanCount}</p>
          <p>Pending to Enter: {booking.remainingScans}</p>
        </div>
      )}
    </div>
  );
};

export default EventCheckInPage;
