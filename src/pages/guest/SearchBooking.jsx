import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CalendarDaysIcon,
  MapPinIcon,
  TicketIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import { bookingService } from '../../services/bookingService'; 

const SearchBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bookingId, setBookingId] = useState(id || '');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const search = async (idToSearch) => {
    if (!idToSearch?.trim()) return toast.error('Enter Booking ID');

    setLoading(true);
    try {
      const res = await axios.get(
        `https://srs-backend-7ch1.onrender.com/api/bookings/guest-status/${idToSearch.trim().toUpperCase()}`
      );
      setBooking(res.data.data);
      navigate(`/search/${idToSearch.trim().toUpperCase()}`, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking not found');
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) search(id);
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    search(bookingId);
  };

  const handlePayment = async () => {
    if (!booking) return;

    setPaymentLoading(true);
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
          description: `Guest Booking - ${booking.bookingId}`,
          handler: async (response) => {
            try {
              await bookingService.verifyPayment({
                bookingId: booking._id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });

              toast.success('Payment successful! Your tickets are ready.');
              await search(booking.bookingId);
              navigate('/booking-success', { 
                state: { bookings: [booking] } 
              });

            } catch (err) {
              toast.error('Payment verification failed');
              console.error(err);
            }
          },
          prefill: {
            name: `${booking.guestDetails.firstName} ${booking.guestDetails.lastName}`,
            email: booking.guestDetails.email,
            contact: booking.guestDetails.phone,
          },
          theme: { color: '#000000' },
          modal: { ondismiss: () => setPaymentLoading(false) },
        });
        rzp.open();
      };
      
      document.body.appendChild(script);
      
      script.onerror = () => {
        toast.error('Payment gateway failed to load');
        setPaymentLoading(false);
      };
      
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment initiation failed');
    } finally {
      setPaymentLoading(false);
    }
  };

  const statusLabel = (status) => {
    if (status === 'pending_approval') return 'Pending Member Approval';
    if (status === 'approved') return 'Approved – Ready to Pay';
    if (status === 'rejected') return 'Rejected';
    if (status === 'confirmed') return 'Ticket Confirmed';
    return status;
  };

  const statusPillClass = (status) => {
    if (status === 'pending_approval')
      return 'bg-amber-100 text-amber-800 border-amber-200';
    if (status === 'approved')
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (status === 'rejected')
      return 'bg-red-100 text-red-800 border-red-200';
    if (status === 'confirmed')
      return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-zinc-800 text-zinc-200 border-zinc-700';
  };

  const isApproved = booking?.status === 'approved';
  const isConfirmed = booking?.status === 'confirmed';
  const isPaid = booking?.paymentStatus === 'paid';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:hidden sticky top-0 bg-white border-b border-gray-200 z-50 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-semibold">Guest Booking</p>
            <h1 className="text-sm font-semibold text-gray-900">Booking Status</h1>
          </div>
          <LockClosedIcon className="w-4 h-4 text-gray-600" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
        <div className="text-center mb-8 lg:mb-10">
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Search Your Booking
          </h1>
          <p className="text-[11px] text-gray-500">
            Enter your Booking ID to view status, event details and payment.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mb-8 lg:mb-10">
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value.toUpperCase())}
              placeholder="Enter Booking ID (e.g. SRS_GUEST123ABC)"
              className="w-full bg-white border border-gray-200 rounded-2xl px-4 lg:px-5 py-3 lg:py-3.5 text-xs lg:text-sm font-mono tracking-[0.2em] text-center focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-4 lg:px-5 py-2 rounded-xl text-[11px] lg:text-xs font-semibold text-white whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? 'Searching…' : 'Search'}
            </button>
          </div>
        </form>

        {!booking && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TicketIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Booking Found</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
              Enter your booking ID above to check status and complete payment.
            </p>
          </div>
        )}

        {booking && (
          <>
            {!isApproved && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-3xl border border-gray-200 p-6 lg:p-8 shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-semibold">
                        Booking ID
                      </p>
                      <p className="text-sm font-mono text-purple-600 truncate font-semibold">
                        {booking.bookingId}
                      </p>
                    </div>
                    <span className={`px-3 py-1.5 text-[11px] font-semibold rounded-full border ${statusPillClass(booking.status)}`}>
                      {statusLabel(booking.status)}
                    </span>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">
                        Event Details
                      </p>
                      <p className="text-base font-semibold text-gray-900 line-clamp-2 leading-tight">
                        {booking.event.title}
                      </p>
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <CalendarDaysIcon className="w-4 h-4" />
                        <span>{new Date(booking.event.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <MapPinIcon className="w-4 h-4" />
                        <span className="truncate">{booking.event.location}</span>
                      </div>
                    </div>
                    <div className="text-right lg:text-left space-y-2 pt-2 lg:pt-0 lg:border-l lg:border-gray-200 lg:pl-6">
                      <p className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">
                        Total Amount
                      </p>
                      <p className="text-3xl font-black text-emerald-600">
                        ₹{booking.totalAmount.toLocaleString('en-IN')}
                      </p>
                      <p className="text-sm text-gray-600">
                        {booking.seatCount} × Guest Tickets
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <p className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold mb-3">
                      Guest Information
                    </p>
                    <div className="bg-gray-50 rounded-2xl p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                          {(booking.guestDetails.firstName?.[0] || 'G').toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900">
                            {booking.guestDetails.firstName} {booking.guestDetails.lastName}
                          </p>
                          <p className="text-[11px] text-gray-600">Guest booking</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <EnvelopeIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                          <span className="truncate">{booking.guestDetails.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <PhoneIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                          <span>{booking.guestDetails.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    {booking.status === 'pending_approval' && (
                      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800 flex items-start gap-3">
                        <ClockIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold">Waiting for member approval</p>
                          <p className="mt-1">Once approved, return to this page with the same booking ID to complete payment.</p>
                        </div>
                      </div>
                    )}
                    {booking.status === 'rejected' && (
                      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-800">
                        This booking was rejected by the member. Please contact support if you believe this is a mistake.
                      </div>
                    )}
                    {isConfirmed && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-sm text-emerald-800">
                        ✓ Your ticket is confirmed! QR code sent to {booking.guestDetails.email}. Show at venue check-in.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {isApproved && (
              <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
                <div className="lg:col-span-2 space-y-4 lg:space-y-5">
                  <div className="hidden lg:block bg-white rounded-3xl border border-gray-200 p-5 shadow-sm">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-semibold">Guest Checkout</p>
                    <h1 className="text-lg font-semibold text-gray-900 mt-1">Booking {booking.bookingId}</h1>
                  </div>

                  <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 overflow-hidden">
                    <div className="flex gap-4">
                      <img
                        src={booking.event.bannerImage || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg'}
                        alt={booking.event.title}
                        className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0 pt-1">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold mb-2">Event</p>
                        <h3 className="text-sm lg:text-base font-semibold text-gray-900 line-clamp-2 mb-3 leading-tight">
                          {booking.event.title}
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-[11px] text-gray-600 mb-4">
                          <div className="flex items-center gap-1.5">
                            <CalendarDaysIcon className="w-3.5 h-3.5" />
                            <span>{new Date(booking.event.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPinIcon className="w-3.5 h-3.5" />
                            <span className="truncate">{booking.event.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-1.5 text-[11px] text-gray-600">
                            <TicketIcon className="w-3.5 h-3.5" />
                            <span>{booking.seatCount} × Guest Tickets</span>
                          </div>
                          <p className="text-lg font-bold text-gray-900">
                            ₹{booking.totalAmount.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 font-semibold">Guest</p>
                      <span className={`px-3 py-1 text-[11px] font-semibold rounded-full border ${statusPillClass(booking.status)}`}>
                        {statusLabel(booking.status)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                        {(booking.guestDetails.firstName?.[0] || 'G').toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {booking.guestDetails.firstName} {booking.guestDetails.lastName}
                        </p>
                        <p className="text-[11px] text-gray-600">Guest booking</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <EnvelopeIcon className="w-4 h-4 text-gray-500" />
                        <span className="truncate">{booking.guestDetails.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <PhoneIcon className="w-4 h-4 text-gray-500" />
                        <span>{booking.guestDetails.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:sticky lg:top-8 lg:self-start">
                  <div className="bg-white rounded-3xl border border-gray-200 p-5 lg:p-6 shadow-sm lg:min-h-[320px]">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-semibold mb-4 lg:mb-5">
                      Order Summary
                    </p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Guest Tickets ({booking.seatCount})</span>
                        <span className="font-semibold text-gray-900">₹{booking.totalAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-2xl text-sm">
                        <span>Platform Fee</span>
                        <span className="font-semibold text-emerald-700">FREE</span>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-5">
                      <div className="flex justify-between items-baseline mb-5">
                        <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-700">Total</span>
                        <span className="text-xl lg:text-2xl font-black text-gray-900">
                          ₹{booking.totalAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                      
                      <button
                        onClick={handlePayment}
                        disabled={paymentLoading || isPaid}
                        className="w-full bg-black hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold text-sm py-3.5 px-4 rounded-2xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 uppercase tracking-wide text-[12px]"
                      >
                        {paymentLoading ? (
                          <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                          </span>
                        ) : isPaid ? (
                          '✓ Payment Complete'
                        ) : (
                          <>
                            Pay ₹{booking.totalAmount.toLocaleString('en-IN')}
                            <ShieldCheckIcon className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      <div className="mt-4 flex items-center gap-1.5 text-[10px] text-gray-500 justify-center">
                        <LockClosedIcon className="w-3.5 h-3.5" />
                        <span>Secure • Razorpay</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isApproved && (
              <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl z-50">
                <div className="max-w-2xl mx-auto">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-gray-600 font-medium">Total</p>
                      <p className="text-lg font-bold text-gray-900">₹{booking.totalAmount.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="text-right text-[11px] text-gray-500">
                      <div className="flex items-center gap-1 mb-1">
                        <CreditCardIcon className="w-3.5 h-3.5" />
                        <span>Free fee</span>
                      </div>
                      <span>{booking.seatCount} tickets</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handlePayment}
                    disabled={paymentLoading || isPaid}
                    className="w-full bg-black hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold text-[12px] py-3.5 rounded-2xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 uppercase tracking-wide"
                  >
                    {paymentLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </span>
                    ) : isPaid ? (
                      '✓ Payment Complete'
                    ) : (
                      <>
                        Pay Now ₹{booking.totalAmount.toLocaleString('en-IN')}
                        <ShieldCheckIcon className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchBooking;
