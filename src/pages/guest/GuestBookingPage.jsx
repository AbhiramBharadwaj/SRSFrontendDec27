import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    CalendarIcon,
    MapPinIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  HashtagIcon,
  TicketIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  LockClosedIcon,
  CheckCircleIcon,
  ClipboardIcon,
} from '@heroicons/react/24/outline';
import { bookingService } from '../../services/bookingService';

const GuestBookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    memberId: '',
    seatCount: 1,
  });
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingIdSuccess, setBookingIdSuccess] = useState('');

  // Fetch event details
  const formRef = useRef(null);
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`https://srs-backend-7ch1.onrender.com/api/events/${id}`);
        setEvent(res.data.data);
      } catch (err) {
        toast.error('Event not found');
      }
    };
    if (id) fetchEvent();
  }, [id]);

  const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  // ✅ Validate required fields first
  if (!form.firstName.trim() || !form.email.trim() || !form.phone.trim() || !form.memberId.trim()) {
    toast.error('Please fill all required fields');
    setLoading(false);
    return;
  }
  
  try {
    const res = await axios.post('https://srs-backend-7ch1.onrender.com/api/bookings/guest-request', {
      eventId: id,
      seatCount: +form.seatCount,
      guestDetails: {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      },
      memberIdInput: form.memberId.trim(),
    });

    setBookingIdSuccess(res.data.data.bookingId);
    setShowSuccessModal(true);
    
    // Reset form
    setForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      memberId: '',
      seatCount: 1,
    });
    
    toast.success('Request sent successfully!');
    
  } catch (err) {
    console.error('Booking error:', err); // ✅ Debug log
    toast.error(err.response?.data?.message || 'Failed to send request');
  } finally {
    setLoading(false);
  }
};


  const copyBookingId = async () => {
    try {
      await navigator.clipboard.writeText(bookingIdSuccess);
      toast.success('✅ Booking ID copied!');
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const totalAmount = event?.guestPrice ? event.guestPrice * form.seatCount : 0;

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-500">Loading event details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {}
      <div className="lg:hidden sticky top-0 bg-white border-b border-gray-200 z-50 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-semibold">Guest Booking</p>
            <h1 className="text-sm font-semibold text-gray-900 line-clamp-1">{event.title}</h1>
          </div>
          <LockClosedIcon className="w-4 h-4 text-gray-600" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {}
          <div className="lg:col-span-2 space-y-4 lg:space-y-5">
            {}
            <div className="hidden lg:block bg-white rounded-3xl border border-gray-200 p-5 shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-semibold">Event Booking</p>
              <h1 className="text-lg font-semibold text-gray-900 mt-1 line-clamp-2">{event.title}</h1>
            </div>

            {}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
              <img 
                src={event.bannerImage} 
                alt={event.title}
                className="w-full h-48 lg:h-56 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"></div>
                  <p className="text-[10px] uppercase tracking-[0.25em] font-semibold text-gray-500">Guest Price</p>
                </div>
                <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-2 line-clamp-2">{event.title}</h2>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-gray-500" />
                    <span>{new Date(event.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4 text-gray-500" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <TicketIcon className="w-4 h-4" />
                    <span>{form.seatCount} × Guest Ticket{form.seatCount > 1 ? 's' : ''}</span>
                  </div>
                  <p className="text-2xl font-black text-emerald-600">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>

            {}
           <form ref={formRef} id="guest-form" onSubmit={handleSubmit}>
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 lg:p-8 space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                    G
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Guest Information</h3>
                    <p className="text-[11px] text-gray-500">Enter your details for the booking request</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">First Name *</label>
                    <input
                      required
                      type="text"
                      value={form.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Last Name</label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Doe"
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Email *</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Phone *</label>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="9606729320"
                    />
                  </div>
                  <div className="space-y-1 md:col-span-1">
                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Sponsor Member ID *</label>
                    <input
                      required
                      type="text"
                      value={form.memberId}
                      onChange={(e) => handleChange('memberId', e.target.value.toUpperCase())}
                      className="w-full bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl px-4 py-3 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="MEM001"
                    />
                  </div>
                  <div className="space-y-1 md:col-span-1">
                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Tickets</label>
                    <select
                      value={form.seatCount}
                      onChange={(e) => handleChange('seatCount', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {[1,2,3,4,5].map(n => (
                        <option key={n} value={n}>{n} Ticket{n>1?'s':''}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 lg:p-8 lg:min-h-[400px]">
              <div className="text-center mb-8 lg:mb-10">
                <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-semibold mb-2">Booking Summary</p>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Guest Request</h3>
                <p className="text-sm text-gray-600">{event.title}</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1.5">
                    <TicketIcon className="w-4 h-4" />
                    {form.seatCount} Guest Ticket{form.seatCount > 1 ? 's' : ''}
                  </span>
                  <span className="font-semibold text-gray-900">
                    ₹{(event.guestPrice || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <span className="text-sm text-gray-700">Member Sponsorship</span>
                  <span className="font-bold text-emerald-700 text-lg">FREE</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-baseline mb-6">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-700">Total Amount</span>
                  <span className="text-2xl lg:text-3xl font-black text-gray-900">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                
                <button
                  type="submit"
                form="guest-form"
                  disabled={loading}
                  className="w-full bg-black hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold text-sm py-4 px-6 rounded-2xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Request
                      <ShieldCheckIcon className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="mt-6 flex items-center gap-1.5 text-[11px] text-gray-500 justify-center">
                  <LockClosedIcon className="w-3.5 h-3.5" />
                  <span>Secure • Instant member notification</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl z-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-gray-600 font-medium">Total</p>
              <p className="text-lg font-bold text-gray-900">₹{totalAmount.toLocaleString('en-IN')}</p>
            </div>
            <div className="text-right text-[11px] text-gray-500">
              <div className="flex items-center gap-1 mb-1">
                <CreditCardIcon className="w-3.5 h-3.5" />
                <span>Free for guests</span>
              </div>
              <span>{form.seatCount} tickets</span>
            </div>
          </div>
          <button
            type="submit"
            form="guest-form"
            disabled={loading}
            className="w-full bg-black hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold text-[12px] py-4 rounded-2xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending...
              </>
            ) : (
              <>
                Send Request Now
                <ShieldCheckIcon className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full mx-4 p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="w-12 h-12 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Sent Successfully!</h2>
              <p className="text-sm text-gray-600">Your booking request has been sent to the member.</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5 mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-3 flex items-center gap-2 justify-center">
                <ClipboardIcon className="w-4 h-4" />
                Booking ID
              </p>
              <div 
                className="font-mono text-sm font-bold text-gray-900 bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-center cursor-pointer hover:border-gray-400 active:scale-[0.98] transition-all select-all"
                onClick={copyBookingId}
                title="Click to copy"
              >
                {bookingIdSuccess}
              </div>
              <p className="text-[11px] text-gray-500 mt-2 text-center">
                Don't forget this ID! You'll need it to check status.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate(`/search/${bookingIdSuccess}`);
                }}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold text-sm py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <TicketIcon className="w-4 h-4" />
                Track Booking Status
              </button>
              <button
                onClick={
                    () =>{ 
                        setShowSuccessModal(false);
                        navigate(`/events`);
                }
                }
                className="w-full text-gray-700 font-semibold text-sm py-3.5 border border-gray-300 rounded-2xl hover:bg-gray-50 transition-all"
              >
                Book Another Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestBookingPage;
