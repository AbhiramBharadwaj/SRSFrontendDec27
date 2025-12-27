// src/pages/user/BookingDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  QrCodeIcon,
  DocumentArrowDownIcon,
  CalendarDaysIcon,
  MapPinIcon,
  TicketIcon,
  CurrencyRupeeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  HeartIcon,
  ArrowLeftIcon,
  ChevronDownIcon,
  PhoneIcon,
  StarIcon,
  CreditCardIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  UserIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { bookingService } from '../../services/bookingService';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';

const BookingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false);
  const [showQR, setShowQR] = useState(true);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getBookingById(id);
      setBooking(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching booking:', error);
      toast.error('Booking not found');
      navigate('/profile');
    } finally {
      setLoading(false);
    }
  };

  const downloadTicket = async () => {
    try {
      const response = await bookingService.downloadTicket(booking._id);
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ticket-${booking.bookingId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Ticket downloaded');
    } catch (error) {
      toast.error('Download failed');
    }
  };

  const initiatePayment = async () => {
    setPayLoading(true);
    try {
      const paymentRes = await bookingService.initiatePayment(booking._id, booking.totalAmount);

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        const rzp = new window.Razorpay({
          key: paymentRes.data.key,
          amount: paymentRes.data.amount,
          currency: 'INR',
          order_id: paymentRes.data.orderId,
          name: 'SRS Events',
          description: `Payment for booking ${booking.bookingId}`,
          image: '/logo.png',
          handler: async (response) => {
            try {
              await bookingService.verifyPayment({
                bookingId: booking._id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              toast.success('Payment successful! Your ticket is confirmed.');
              fetchBookingDetails();
            } catch (err) {
              toast.error('Payment verification failed');
            } finally {
              setPayLoading(false);
            }
          },
          prefill: {
            name: `${booking.guestDetails?.firstName || ''} ${booking.guestDetails?.lastName || ''}`,
            email: booking.guestDetails?.email || '',
            contact: booking.guestDetails?.phone || '',
          },
          theme: { color: '#000000' },
          modal: {
            ondismiss: () => setPayLoading(false),
          },
        });
        rzp.open();
      };
      script.onerror = () => {
        toast.error('Failed to load payment gateway');
        setPayLoading(false);
      };
      document.body.appendChild(script);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
      setPayLoading(false);
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('en-IN');
  const formatTime = (date) => new Date(date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  const formatPrice = (price) => new Intl.NumberFormat('en-IN').format(price);

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      completed: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  // Loading State
  if (loading || payLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-sm text-gray-600 mt-4">{payLoading ? 'Processing payment...' : 'Loading booking details...'}</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4 pb-20">
        <div className="max-w-sm w-full text-center bg-white rounded-2xl p-8 shadow-lg border">
          <TicketIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-gray-900 mb-2">Booking Not Found</h2>
          <p className="text-sm text-gray-600 mb-6">This booking doesn't exist or has been removed.</p>
          <button onClick={() => navigate('/profile')} className="w-full bg-black text-white py-3 rounded-xl font-medium text-sm hover:bg-gray-900">
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  // PAYMENT PENDING STATE — Beautiful Yellow Card
  if (booking.paymentStatus === 'pending') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full text-center bg-white rounded-3xl p-10 shadow-2xl border-2 border-yellow-400">
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
              <ClockIcon className="w-12 h-12 text-yellow-600" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-yellow-800 mb-3">Payment Pending</h2>
          <p className="text-sm text-gray-700 mb-2">
            Your booking <span className="font-mono font-bold text-yellow-700">#{booking.bookingId}</span> is reserved.
          </p>
          <p className="text-xs text-gray-600 mb-8">
            Complete payment within <strong>15 minutes</strong> to confirm your tickets.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-700">Total Amount</span>
              <span className="text-2xl font-black text-yellow-800">₹{formatPrice(booking.totalAmount)}</span>
            </div>
            <div className="text-xs text-gray-600">
              {booking.seatCount} × Ticket{booking.seatCount > 1 ? 's' : ''} for <strong>{booking.event.title}</strong>
            </div>
          </div>

          <button
            onClick={initiatePayment}
            disabled={payLoading}
            className="w-full bg-black text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-xl hover:bg-gray-900 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all"
          >
            {payLoading ? (
              <>Processing...</>
            ) : (
              <>
                Pay ₹{formatPrice(booking.totalAmount)}
                <ChevronRightIcon className="w-5 h-5" />
              </>
            )}
          </button>

          <button
            onClick={() => navigate('/profile')}
            className="mt-4 text-sm text-gray-600 hover:text-black underline"
          >
            Cancel & go back
          </button>
        </div>
      </div>
    );
  }

  // FULL SUCCESS UI — Your exact beautiful design
  return (
    <div className="min-h-screen bg-gray-50 py-2 px-2 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {}
        {isMobile && (
          <div className="mb-4 bg-white rounded-2xl shadow-sm p-3 border sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <button onClick={() => navigate('/profile')} className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200">
                <ArrowLeftIcon className="w-4 h-4" />
              </button>
              <div className="flex-1 text-center min-w-0 px-2">
                <h1 className="text-sm font-bold truncate">Booking #{booking.bookingId}</h1>
                <p className="text-xs text-gray-500">{booking.event.title}</p>
              </div>
              <div className="w-10" />
            </div>
          </div>
        )}

        {}
        {!isMobile && (
          <div className="mb-4 bg-white rounded-2xl shadow-sm p-4 border">
            <button onClick={() => navigate('/profile')} className="flex items-center gap-1 text-xs text-gray-600 hover:text-black mb-2 px-3 py-1.5 rounded-xl hover:bg-gray-100 inline-flex">
              <ArrowLeftIcon className="w-3.5 h-3.5" /> Profile
            </button>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-bold text-gray-900">Booking Details</h1>
              <span className="px-2.5 py-1 bg-gray-100 text-xs font-mono rounded-xl">#{booking.bookingId}</span>
              <span className={`px-2.5 py-1 text-xs font-medium rounded-xl ${getStatusColor(booking.status)}`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 lg:gap-4">
          {}
          <div className="lg:col-span-3 space-y-3">
            {}
            <div className="bg-white rounded-2xl shadow-sm border p-4">
              <div className="flex items-center gap-2 mb-3">
                <TicketIcon className="w-4 h-4 text-blue-500" />
                <h3 className="text-sm font-bold text-gray-900">Event Details</h3>
              </div>
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="relative flex-shrink-0">
                  <img
                    src={booking.event.bannerImage || 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg'}
                    alt={booking.event.title}
                    className="w-24 h-24 lg:w-28 lg:h-28 object-cover rounded-xl shadow-md"
                  />
                  <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">LIVE</div>
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <h4 className="font-bold text-sm truncate">{booking.event.title}</h4>
                  <p className="text-xs text-gray-600 line-clamp-2 leading-tight">{booking.event.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <CalendarDaysIcon className="w-3.5 h-3.5" />
                      {formatDate(booking.event.startDate)}
                    </div>
                    <div className="flex items-center gap-1">
                      <ClockIcon className="w-3.5 h-3.5" />
                      {formatTime(booking.event.startDate)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-600 truncate">
                    <MapPinIcon className="w-3.5 h-3.5" />
                    {booking.event.location}
                  </div>
                </div>
              </div>
            </div>

            {}
            <div className="bg-white rounded-2xl shadow-sm border p-4">
              <div className="flex items-center gap-2 mb-3">
                <CurrencyRupeeIcon className="w-4 h-4 text-green-500" />
                <h3 className="text-sm font-bold">Order Summary</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-xl text-xs">
                  <span>Type</span>
                  <span className="font-semibold capitalize">{booking.bookingType}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-xl text-xs">
                  <span>Seats</span>
                  <span className="font-bold text-lg">{booking.seatCount}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border text-xs font-semibold">
                  <span>Per Seat</span>
                  <span className="text-green-700">₹{formatPrice(booking.unitPrice)}</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-gray-100">
                  <span className="text-sm font-bold">Total Amount</span>
                  <span className="text-xl font-black text-gray-900">₹{formatPrice(booking.totalAmount)}</span>
                </div>
              </div>
            </div>

            {}
            <div className="bg-white rounded-2xl shadow-sm border p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl mb-1">
                    <span className="text-xs font-medium">Booking</span>
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                    <span className="text-xs font-medium">Payment</span>
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${getStatusColor(booking.paymentStatus)}`}>
                      {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Booked on</p>
                  <p className="text-sm font-semibold">{formatDate(booking.bookingDate)}</p>
                </div>
              </div>
            </div>

            {}
            <div className="bg-white rounded-2xl shadow-sm border p-4 grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 p-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl text-xs border border-blue-100">
                <PhoneIcon className="w-3.5 h-3.5 text-blue-500" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-1 p-2.5 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl text-xs border border-yellow-100 justify-center">
                <StarIcon className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                <span>4.8 (2.3k)</span>
              </div>
            </div>
          </div>

          {}
          <div className="lg:col-span-1 space-y-3">

            {}
            {isMobile && (
              <div className="bg-white p-3 lg:hidden rounded-2xl border shadow-sm">
                <button
                  onClick={() => setShowBottomSheet(true)}
                  className="w-full bg-gradient-to-r from-black to-gray-900 text-white py-4 px-6 rounded-2xl font-bold text-sm shadow-2xl hover:from-gray-900 hover:to-black border border-gray-700 flex items-center justify-center gap-2"
                >
                  <QrCodeIcon className="w-5 h-5" />
                  Show QR Code
                </button>
              </div>
            )}

            {}
            {!isMobile && (
              <div className="bg-gradient-to-b from-black to-gray-900 text-white rounded-2xl p-4 shadow-2xl border border-gray-800 sticky top-4">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-700">
                  <QrCodeIcon className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wide">Entry QR</h4>
                </div>

                <div className="space-y-2 mb-3">
                  <button onClick={() => setShowQR(true)} className={`w-full p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all ${showQR ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-800 hover:bg-gray-700 border border-gray-700'}`}>
                    <CheckCircleIcon className="w-3.5 h-3.5" /> Show QR
                  </button>
                  <button onClick={() => setShowQR(false)} className={`w-full p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all ${!showQR ? 'bg-gray-700 text-white shadow-lg' : 'bg-gray-800/50 hover:bg-gray-700 border border-gray-600'}`}>
                    <XCircleIcon className="w-3.5 h-3.5" /> Hide QR
                  </button>
                </div>

                <div className={`w-28 h-28 mx-auto rounded-2xl border-2 shadow-2xl overflow-hidden mb-3 transition-all ${showQR ? 'border-green-400 bg-green-500/5' : 'border-gray-700 bg-gray-900/50'}`}>
                  {showQR ? (
                    <img src={booking.qrCodeImage} alt="QR Code" className="w-full h-full object-contain p-1.5" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-2 bg-gray-900/50">
                      <QrCodeIcon className="w-10 h-10 text-gray-500 mb-1" />
                      <span className="text-xs text-gray-500 font-medium">QR Hidden</span>
                    </div>
                  )}
                </div>

                <div className="mb-4 p-3 bg-gray-900/50 rounded-xl border border-gray-700">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold tracking-wide">Scan Usage</span>
                    <span className="font-mono font-bold text-green-400">
                      {booking.qrScanCount || 0}/{booking.qrScanLimit || booking.seatCount}
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden border">
                    <div className="h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-sm transition-all duration-700" 
                      style={{ width: `${Math.min(((booking.qrScanCount || 0) / (booking.qrScanLimit || booking.seatCount)) * 100, 100)}%` }} />
                  </div>
                </div>

                <div className={`p-2.5 rounded-xl text-xs font-bold text-center uppercase tracking-wide flex items-center justify-center gap-1 ${(booking.qrScanCount || 0) < (booking.qrScanLimit || booking.seatCount) ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25' : 'bg-gray-800 border border-gray-700 text-gray-400'}`}>
                  {(booking.qrScanCount || 0) < (booking.qrScanLimit || booking.seatCount) ? (
                    <>Ready to Scan</>
                  ) : (
                    <>Fully Used</>
                  )}
                </div>
              </div>
            )}

            {}
            <div className="bg-gradient-to-b from-black to-gray-900 text-white rounded-2xl p-4 shadow-2xl border border-gray-800">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-700">
                <TicketIcon className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wide">Actions</h4>
              </div>
              <div className="space-y-2">
                <button onClick={downloadTicket} className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2.5 px-3 rounded-xl text-xs font-semibold border border-gray-600 shadow-md flex items-center justify-center gap-1.5 transition-all">
                  <DocumentArrowDownIcon className="w-3.5 h-3.5" /> Download PDF
                </button>
                <button className="w-full bg-gray-800/50 hover:bg-gray-700/50 text-xs py-2.5 px-3 rounded-xl text-gray-300 border border-gray-600 flex items-center justify-center gap-1.5">
                  <HeartIcon className="w-3.5 h-3.5" /> Add to Wallet
                </button>
              </div>
            </div>

            {}
            {booking.paymentDetails && (
              <div className="bg-gradient-to-b from-gray-900 to-black text-white rounded-2xl p-4 shadow-2xl border border-gray-800">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCardIcon className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wide">Payment</h4>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-gray-800/50 rounded-xl border border-gray-700">
                    <span className="font-semibold flex items-center gap-1">
                      <BanknotesIcon className="w-3.5 h-3.5" /> Method
                    </span>
                    <span className="font-mono font-semibold capitalize">{booking.paymentMethod || 'Razorpay'}</span>
                  </div>
                  {booking.paymentDetails.razorpayPaymentId && (
                    <div className="p-3 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-500/30">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-blue-300 font-medium flex items-center gap-1">
                          <ShieldCheckIcon className="w-3.5 h-3.5" /> Payment ID
                        </span>
                        <span className="text-xs text-blue-400 font-mono">Verified</span>
                      </div>
                      <div className="bg-black/50 px-3 py-1.5 rounded-lg">
                        <code className="font-mono text-sm tracking-wider break-all">
                          {booking.paymentDetails.razorpayPaymentId.slice(-12)}
                        </code>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/30 text-emerald-300">
                    <span className="font-semibold">Status</span>
                    <span className="font-bold text-emerald-400">Completed</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {}
      {isMobile && showBottomSheet && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 " onClick={() => setShowBottomSheet(false)} />
          <div className="fixed bottom-14 left-0 right-0 z-50 max-h-[90vh] bg-white rounded-t-3xl shadow-2xl border-t border-gray-200 overflow-y-auto">
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 h-1.5 w-20 mx-auto rounded-full mt-4 mb-3" />
            <div className="px-5 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <QrCodeIcon className="w-5 h-5 text-blue-500" />
                  <h3 className="font-bold text-sm">Entry QR Code</h3>
                </div>
                <button onClick={() => setShowBottomSheet(false)} className="p-2 rounded-2xl hover:bg-gray-100">
                  <XCircleIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-5 space-y-6">
              <div className="flex gap-2">
                <button onClick={() => setShowQR(true)} className={`flex-1 p-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 ${showQR ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-100 hover:bg-gray-200 border'}`}>
                  <CheckCircleIcon className="w-4 h-4" /> Show QR
                </button>
                <button onClick={() => setShowQR(false)} className={`flex-1 p-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 ${!showQR ? 'bg-gray-200 text-gray-700 shadow-md' : 'bg-gray-100 hover:bg-gray-200 border'}`}>
                  <XCircleIcon className="w-4 h-4" /> Hide QR
                </button>
              </div>

              <div className={`w-64 h-64 mx-auto rounded-2xl border-4 shadow-2xl overflow-hidden ${showQR ? 'border-green-400 bg-green-50/50' : 'border-gray-300 bg-gray-100'}`}>
                {showQR ? (
                  <img src={booking.qrCodeImage} alt="QR Code" className="w-full h-full object-contain p-3" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                    <QrCodeIcon className="w-16 h-16 text-gray-400 mb-3" />
                    <p className="text-sm font-semibold text-gray-600 mb-1">QR Code Hidden</p>
                    <p className="text-xs text-gray-500">Tap Show QR to reveal</p>
                  </div>
                )}
              </div>

              <button onClick={downloadTicket} className="w-full bg-gradient-to-r from-black to-gray-900 text-white py-5 px-6 rounded-2xl font-bold text-lg shadow-2xl hover:from-gray-900 hover:to-black border border-gray-700 flex items-center justify-center gap-3">
                <DocumentArrowDownIcon className="w-6 h-6" /> Download PDF Ticket
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BookingDetailPage;
