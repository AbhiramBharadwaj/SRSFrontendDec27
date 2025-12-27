import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  UserIcon,
  CalendarDaysIcon,
  MapPinIcon,
  TicketIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import useCartStore from '../../store/cartStore';
import { bookingService } from '../../services/bookingService';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { items: cartItems, clearCart } = useCartStore();
  console.log(cartItems)
  const [loading, setLoading] = useState(false);

  const items = location.state?.items?.length > 0 ? location.state.items : cartItems;

  const getPrice = (item) => {
    const event = item.event;
    let unitPrice = 0;
    if (user?.role === 'member' && event?.memberPrice > 0) {
      unitPrice = event.memberPrice;
    } else if (user?.role === 'guest' && event?.guestPrice > 0) {
      unitPrice = event.guestPrice;
    } else {
      unitPrice = event?.userPrice || event?.price || 0;
    }

    return unitPrice * (item.seatCount || 1);
  };

  const total = items.reduce((sum, item) => {
    return sum + getPrice(item);
  }, 0);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !user) {
      toast.error('Please login to continue');
      navigate('/login', { state: { from: location } });
    }
  }, [authLoading, isAuthenticated, user, navigate, location]);

  const handlePayment = async () => {
    if (total <= 0) {
      toast.error('Invalid amount');
      return;
    }
    setLoading(true);
    try {
      const bookings = await Promise.all(
        items.map((item) =>
          bookingService.createBooking({
            eventId: item.event.eventId,
            seatCount: item.seatCount || 1,
            bookingType: user.role === 'member' ? 'member' : user.role === 'guest' ? 'guest' : 'user',
          })
        )
      );

      const paymentRes = await bookingService.initiatePayment(bookings[0].data._id, total);

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        const rzp = new window.Razorpay({
            key: paymentRes.data.key,
            amount: paymentRes.data.amount,
            currency: 'INR',
            order_id: paymentRes.data.orderId,
            name: 'SRS Events',
            description: 'Event Booking',
            handler: async (response) => {
              try {
                await bookingService.verifyPayment({
                  bookingId: bookings[0].data._id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                });

                clearCart();
                toast.success('Payment successful! Your tickets are ready.');
                navigate('/booking-success', { 
                  state: { bookings: bookings.map(b => b.data) } 
                });
              } catch (err) {
                toast.error('Payment verification failed');
                console.error(err);
              }
            },
            prefill: {
              name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Guest',
              email: user.email || '',
              contact: user.phone || '',
            },
            theme: { color: '#000000' },
            modal: { ondismiss: () => setLoading(false) },
          });
        rzp.open();
      };
      document.body.appendChild(script);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {}
      <div className="lg:hidden sticky top-0 bg-white border-b border-gray-200 z-50 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-semibold">Checkout</p>
            <h1 className="text-sm font-semibold text-gray-900">{items.length} items</h1>
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
              <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-semibold">Order</p>
              <h1 className="text-lg font-semibold text-gray-900">Complete Booking</h1>
            </div>

            {}
            <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white text-lg font-bold">
                  {(user.firstName?.[0] || 'U').toUpperCase()}
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-[11px] text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>

            {}
            <div className="space-y-3 lg:space-y-4">
              {items.map((item, i) => (
                <div key={i} className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="flex gap-4 p-5 lg:p-6">
                    <img
                      src={item.event.bannerImage || '/placeholder.jpg'}
                      alt={item.event.title}
                      className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[12px] lg:text-sm font-semibold text-gray-900 line-clamp-2 mb-2">
                        {item.event.title}
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600 mb-3">
                        <div className="flex items-center gap-1.5">
                          <CalendarDaysIcon className="w-3.5 h-3.5" />
                          <span>{new Date(item.event.startDate).toLocaleDateString('en-IN', { 
                            day: 'numeric', month: 'short' 
                          })}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPinIcon className="w-3.5 h-3.5" />
                          <span className="truncate">{item.event.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-600">
                          <TicketIcon className="w-3.5 h-3.5" />
                          <span>{item.seatCount || 1} × {user?.role?.toUpperCase() || 'USER'}</span>
                        </div>
                        <p className="text-[14px] lg:text-lg font-bold text-gray-900">
                          ₹{getPrice(item).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="bg-white rounded-3xl border border-gray-200 p-5 lg:p-6 shadow-sm lg:min-h-[320px]">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-semibold mb-3 lg:mb-4">
                  Order Summary
                </p>
                
                <div className="space-y-3 mb-5 lg:mb-6">
                  <div className="flex justify-between text-[12px] lg:text-sm">
                    <span className="text-gray-600">Subtotal ({items.length} items)</span>
                    <span className="font-semibold text-gray-900">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-2xl text-[11px]">
                    <span>Platform Fee</span>
                    <span className="font-semibold text-emerald-700">FREE</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 lg:pt-5">
                  <div className="flex justify-between items-baseline mb-4 lg:mb-5">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-700">Total</span>
                    <span className="text-lg lg:text-xl font-bold text-gray-900">
                      ₹{total.toLocaleString('en-IN')}
                    </span>
                  </div>
                  
                  <button
                    onClick={handlePayment}
                    disabled={loading || total === 0}
                    className="w-full bg-black hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold text-[12px] lg:text-sm py-3 lg:py-3.5 px-4 rounded-2xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 uppercase tracking-wide"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </span>
                    ) : (
                      <>
                        Pay ₹{total.toLocaleString('en-IN')}
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
        </div>
      </div>

      {}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl z-50">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-gray-600 font-medium">Total</p>
              <p className="text-lg font-bold text-gray-900">₹{total.toLocaleString('en-IN')}</p>
            </div>
            <div className="text-right text-[11px] text-gray-500">
              <div className="flex items-center gap-1 mb-1">
                <CreditCardIcon className="w-3.5 h-3.5" />
                <span>Free fee</span>
              </div>
              <span>{items.length} items</span>
            </div>
          </div>
          
          <button
            onClick={handlePayment}
            disabled={loading || total === 0}
            className="w-full bg-black hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold text-[12px] py-3.5 rounded-2xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 uppercase tracking-wide"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </span>
            ) : (
              <>
                Pay Now ₹{total.toLocaleString('en-IN')}
                <ShieldCheckIcon className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
