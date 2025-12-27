// src/pages/user/BookingSuccessPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  CheckCircleIcon,
  QrCodeIcon,
  DocumentArrowDownIcon,
  CalendarDaysIcon,
  MapPinIcon,
  TicketIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
  ClockIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import useCartStore from '../../store/cartStore';

const BookingSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCartStore();
  const bookings = location.state?.bookings || [];
  const [selectedQR, setSelectedQR] = useState(null);

  useEffect(() => {
    if (!bookings.length) navigate('/');
    else clearCart();
  }, []);

  const total = bookings.reduce((sum, b) => sum + b.totalAmount, 0);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status) => {
    return status === 'pending' ? 'text-yellow-600 bg-yellow-50' : 
           status === 'confirmed' ? 'text-emerald-600 bg-emerald-50' : 
           'text-gray-600 bg-gray-50';
  };

  const downloadQR = (qrImage, bookingId) => {
    const link = document.createElement('a');
    link.href = qrImage;
    link.download = `SRS-Ticket-QR-${bookingId}.png`;
    link.click();
  };

  const downloadTicket = async (bookingId) => {
    try {
      const response = await fetch(`https://srs-backend-7ch1.onrender.com/api/bookings/${bookingId}/download-ticket`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `SRS-Ticket-${bookingId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download ticket. Please try again.');
      console.error(err);
    }
  };

  if (!bookings.length) return null;

  return (
    <>
      {}
      <div className="lg:hidden min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-semibold">Confirmed</p>
              <h1 className="text-sm font-semibold text-gray-900">{bookings.length} Booking{bookings.length > 1 ? 's' : ''}</h1>
            </div>
            <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
          </div>
        </div>

        <div className="px-4 py-6 space-y-4 pb-28 max-h-[calc(100vh-200px)] overflow-y-auto">
          {bookings.map((b) => (
            <div key={b._id} className="bg-white rounded-3xl border border-gray-200 w-full">
              <div className="p-5 space-y-4">
                {}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                    {b.event?.title || 'Event Name'}
                  </h3>
                  <p className="text-[11px] text-gray-500 font-mono">#{b.bookingId}</p>
                </div>

                {}
                <div className="grid grid-cols-2 gap-3 text-[11px] text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <CalendarDaysIcon className="w-3.5 h-3.5" />
                    <span>{formatDate(b.event?.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ClockIcon className="w-3.5 h-3.5" />
                    <span>{formatTime(b.event?.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPinIcon className="w-3.5 h-3.5" />
                    <span className="truncate">{b.event?.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TicketIcon className="w-3.5 h-3.5" />
                    <span>{b.seatCount} × {b.bookingType.toUpperCase()}</span>
                  </div>
                </div>

                {}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 ${getStatusColor(b.status)}`}>
                    {b.status.toUpperCase()}
                  </div>
                  <div className="text-right text-gray-500">
                    <span>{b.qrScanCount}/{b.qrScanLimit} scans</span>
                  </div>
                </div>

                {}
                <div 
                  className="bg-gray-50 rounded-2xl p-3 mx-1 cursor-pointer"
                  onClick={() => setSelectedQR(b)}
                >
                  <img src={b.qrCodeImage} alt="QR" className="w-28 h-28 mx-auto rounded-xl" />
                  <p className="text-center text-[10px] text-gray-500 mt-1">
                    {b.remainingScans} scan{ b.remainingScans !== 1 ? 's' : ''} left
                  </p>
                </div>

                {}
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      ₹{b.totalAmount.toLocaleString('en-IN')}
                    </p>
                    <p className="text-[10px] text-gray-500">Unit: ₹{b.unitPrice.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setSelectedQR(b)}
                      className="p-2 rounded-xl hover:bg-gray-50 flex items-center justify-center"
                    >
                      <QrCodeIcon className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                      onClick={() => downloadTicket(b._id)}
                      className="p-2 rounded-xl hover:bg-gray-50 flex items-center justify-center"
                    >
                      <DocumentArrowDownIcon className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                </div>

                {}
                <div className="pt-2 border-t border-gray-100 text-[10px] text-gray-500 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <ClockIcon className="w-3 h-3" />
                    <span>Booked: {formatDate(b.bookingDate)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>Payment: {b.paymentMethod}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {}
          <div className="bg-white rounded-3xl border border-gray-200 p-5">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Total Paid</span>
              <span className="text-lg font-bold text-gray-900">
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
          <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto">
            <Link to="/my-bookings" className="bg-black text-white text-[12px] font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-1.5 hover:bg-gray-900">
              My Bookings
            </Link>
            <Link to="/events" className="bg-gray-50 text-gray-900 text-[12px] font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-1.5 border border-gray-200 hover:bg-gray-100">
              More Events
            </Link>
          </div>
        </div>
      </div>

      {}
      <div className="hidden lg:block max-w-5xl mx-auto px-6 py-8 bg-gray-50 min-h-screen">
        {}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 mb-8 text-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-200">
            <CheckCircleIcon className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-lg font-semibold text-gray-900 mb-1">Bookings Confirmed</h1>
          <p className="text-[12px] text-gray-600">Check your email for tickets & receipts</p>
        </div>

        <div className="space-y-6 mb-12">
          {bookings.map((b) => (
            <div key={b._id} className="bg-white rounded-3xl border border-gray-200 w-full overflow-hidden">
              {}
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900">{b.event?.title}</h2>
                    <p className="text-[11px] text-gray-500 font-mono">#{b.bookingId}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-semibold ${getStatusColor(b.status)}`}>
                    {b.status.toUpperCase()}
                  </div>
                </div>
              </div>

              {}
              <div className="grid grid-cols-1 lg:grid-cols-2 p-6 gap-6 lg:gap-8">
                {}
                <div className="space-y-4">
                  <div className="space-y-3 text-[12px] text-gray-700">
                    <div className="flex items-center gap-2">
                      <CalendarDaysIcon className="w-4 h-4" />
                      <span className="font-semibold">{formatDate(b.event?.startDate)}</span>
                      <span className="text-gray-500">•</span>
                      <ClockIcon className="w-4 h-4" />
                      <span>{formatTime(b.event?.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{b.event?.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TicketIcon className="w-4 h-4" />
                      <span className="font-semibold">{b.seatCount} × {b.bookingType.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-gray-600">
                      <QrCodeIcon className="w-4 h-4" />
                      <span>{b.qrScanCount}/{b.qrScanLimit} scans used</span>
                    </div>
                  </div>

                  {}
                  <div className="border-t border-gray-100 pt-4 pb-2">
                    <div className="space-y-1 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Total:</span>
                        <span className="font-bold text-gray-900">₹{b.totalAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-gray-500">
                        <span>Unit Price:</span>
                        <span>₹{b.unitPrice.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedQR(b)}
                        className="flex-1 bg-gray-50 text-gray-900 text-[12px] font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 border border-gray-200 hover:bg-gray-100"
                      >
                        <QrCodeIcon className="w-4 h-4" />
                        Full QR
                      </button>
                      <button
                        onClick={() => downloadTicket(b._id)}
                        className="flex-1 bg-gray-50 text-gray-900 text-[12px] font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 border border-gray-200 hover:bg-gray-100"
                      >
                        <DocumentArrowDownIcon className="w-4 h-4" />
                        PDF Ticket
                      </button>
                    </div>
                  </div>

                  {}
                  <div className="text-[11px] text-gray-500 space-y-1 pt-2">
                    <div className="flex items-center gap-1.5">
                      <ClockIcon className="w-3.5 h-3.5" />
                      <span>Booked: {formatDate(b.bookingDate)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>Payment: {b.paymentMethod}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>Remaining: {b.remainingScans} scans</span>
                    </div>
                  </div>
                </div>

                {}
                <div className="flex items-center justify-center p-2">
                  <div 
                    className="bg-gray-50 rounded-2xl p-4 cursor-pointer hover:bg-gray-100 transition-colors w-full max-w-xs mx-auto border border-gray-200"
                    onClick={() => setSelectedQR(b)}
                  >
                    <img src={b.qrCodeImage} alt="QR" className="w-32 h-32 mx-auto rounded-xl" />
                    <p className="text-center text-[11px] text-gray-600 mt-2 font-medium">
                      {b.remainingScans} scan{ b.remainingScans !== 1 ? 's' : ''} left
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Total Amount</span>
            <span className="text-xl font-bold text-gray-900">₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {}
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <Link to="/my-bookings" className="bg-black text-white text-sm font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-900 border border-black">
            My Bookings
          </Link>
          <Link to="/events" className="bg-gray-50 text-gray-900 text-sm font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-100">
            More Events
          </Link>
        </div>
      </div>

      {}
      {selectedQR && (
        <div className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-4" onClick={() => setSelectedQR(null)}>
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full relative border border-gray-200" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-gray-100 text-gray-500" onClick={() => setSelectedQR(null)}>
              <XMarkIcon className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">QR Code</h3>
              <p className="text-[12px] text-gray-600 font-mono font-semibold">#{selectedQR.bookingId}</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-200">
              <img src={selectedQR.qrCodeImage} alt="QR" className="w-48 h-48 mx-auto rounded-xl" />
            </div>

            <div className="text-center space-y-2 mb-5">
              <p className="text-[12px] text-gray-700 font-semibold">
                {selectedQR.remainingScans} scan{selectedQR.remainingScans !== 1 ? 's' : ''} remaining
              </p>
              <p className="text-[11px] text-gray-500">{selectedQR.qrScanCount}/{selectedQR.qrScanLimit} used</p>
            </div>

            <button
              onClick={() => downloadQR(selectedQR.qrCodeImage, selectedQR.bookingId)}
              className="w-full bg-black text-white text-sm font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-900"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              Download QR Image
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingSuccessPage;
