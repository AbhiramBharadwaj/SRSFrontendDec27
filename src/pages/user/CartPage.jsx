import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HeartIcon as HeartOutline,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  MapPinIcon,
  TicketIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import useCartStore from '../../store/cartStore';
import useFavoritesStore from '../../store/favoritesStore';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { items, removeItem, updateItemCount, getTotalPrice } = useCartStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();

  const getPrice = (item) => {
    const event = item.event;

    if (user?.role === 'member' && event.memberPrice > 0) {
      return event.memberPrice;
    }
    if (user?.role === 'guest' && event.guestPrice > 0) {
      return event.guestPrice;
    }
    return event.userPrice || event.price || 0; 
  };

  const total = items.reduce((sum, item) => {
    return sum + (getPrice(item) * item.seatCount);
  }, 0);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to checkout');
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    navigate('/checkout', { state: { items } });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[400px] bg-gray-50 rounded-3xl border border-gray-200 p-6 flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
          <TicketIcon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Your cart is empty</h3>
        <p className="text-[11px] text-gray-500 mb-6">Add events to get started</p>
        <Link to="/events" className="w-full max-w-xs bg-black text-white text-[11px] font-semibold py-2.5 px-4 rounded-2xl hover:bg-gray-900 flex items-center justify-center gap-1.5">
          Browse Events
        </Link>
      </div>
    );
  }

  return (
    <>
      {}
      <div className="hidden lg:grid lg:grid-cols-3 lg:gap-8 p-2 lg:max-w-5xl lg:mx-auto px-4 py-3 lg:px-6 lg:py-8">
        <div className="lg:col-span-2 lg:space-y-5">
          <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-semibold">Cart</p>
                <h2 className="text-lg font-semibold text-gray-900">{items.length} items</h2>
              </div>
              <Link to="/events" className="text-[11px] text-gray-600 font-medium hover:text-gray-900">Continue shopping</Link>
            </div>
          </div>

          {items.map((item) => (
            <div key={`${item.eventId}-${item.bookingType}`} className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all">
              <div className="flex gap-4">
                <div className="relative flex-shrink-0">
                  <img
                    src={item.event.bannerImage || '/placeholder.jpg'}
                    alt={item.event.title}
                    className="w-20 h-20 rounded-2xl object-cover"
                  />
                  <span className="absolute -top-2 -right-2 text-[9px] font-bold px-1.5 py-0.5 bg-black text-white rounded-full">
                    {user?.role === 'member' ? 'M' : user?.role === 'guest' ? 'G' : 'U'}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">{item.event.title}</h3>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4 text-[11px] text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <CalendarDaysIcon className="w-3.5 h-3.5" />
                      <span>{new Date(item.event.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPinIcon className="w-3.5 h-3.5" />
                      <span className="truncate">{item.event.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateItemCount(item.eventId, item.bookingType, Math.max(1, item.seatCount - 1))}
                        className="w-8 h-8 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 active:scale-95 transition text-[11px]"
                      >
                        <MinusIcon className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm font-semibold w-8 text-center">{item.seatCount}</span>
                      <button
                        onClick={() => updateItemCount(item.eventId, item.bookingType, item.seatCount + 1)}
                        className="w-8 h-8 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 active:scale-95 transition text-[11px]"
                      >
                        <PlusIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        ₹{(getPrice(item) * item.seatCount).toLocaleString('en-IN')}
                      </p>
                      <p className="text-[11px] text-gray-500">₹{getPrice(item).toLocaleString()} ×{item.seatCount}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 ml-2">
                  <button
                    onClick={() => toggleFavorite(item.eventId)}
                    className="p-1.5 rounded-xl hover:bg-gray-50 flex items-center justify-center"
                  >
                    {isFavorite(item.eventId) ? 
                      <HeartSolid className="w-4 h-4 text-red-500" /> : 
                      <HeartOutline className="w-4 h-4 text-gray-400" />
                    }
                  </button>
                  <button
                    onClick={() => removeItem(item.eventId, item.bookingType)}
                    className="p-1.5 rounded-xl hover:bg-rose-50 flex items-center justify-center"
                  >
                    <TrashIcon className="w-4 h-4 text-rose-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:sticky lg:top-8 lg:self-start">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm lg:min-h-[300px]">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-[0.18em]">Order Summary</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal ({items.length} items)</span>
                <span className="font-semibold text-gray-900">₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-2xl text-[11px]">
                <span>Platform Fee</span>
                <span className="font-semibold text-emerald-700">FREE</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-baseline mb-5">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-700">Total</span>
                <span className="text-xl font-bold text-gray-900">₹{total.toLocaleString('en-IN')}</span>
              </div>
              
              <button
                onClick={handleCheckout}
                className="w-full bg-black hover:bg-gray-900 text-white font-semibold text-[12px] py-3 px-4 rounded-2xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 uppercase tracking-wide"
              >
                Checkout
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="lg:hidden space-y-4 pb-24 p-3">
        <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-sm sticky top-0 z-20 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-semibold">Cart</p>
              <h2 className="text-sm font-semibold text-gray-900">{items.length} items</h2>
            </div>
            <Link to="/events" className="text-[11px] text-sky-600 font-medium hover:text-sky-700">Continue shopping</Link>
          </div>
        </div>

        <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto">
          {items.map((item) => (
            <div key={`${item.eventId}-${item.bookingType}`} className="bg-white rounded-3xl border border-gray-200 shadow-sm p-5">
              <div className="flex gap-3">
                <div className="relative flex-shrink-0">
                  <img
                    src={item.event.bannerImage || '/placeholder.jpg'}
                    alt={item.event.title}
                    className="w-16 h-16 rounded-2xl object-cover"
                  />
                  <span className="absolute -top-1.5 -right-1.5 text-[9px] font-bold px-1.5 py-0.5 bg-black text-white rounded-full">
                    {user?.role === 'member' ? 'M' : user?.role === 'guest' ? 'G' : 'U'}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-[12px] font-semibold text-gray-900 line-clamp-2 mb-2">{item.event.title}</h3>
                  
                  <div className="flex items-center gap-2.5 text-[11px] text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <CalendarDaysIcon className="w-3.5 h-3.5" />
                      <span>{new Date(item.event.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </div>
                    <div className="flex items-center gap-1 truncate">
                      <MapPinIcon className="w-3.5 h-3.5" />
                      <span className="truncate">{item.event.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateItemCount(item.eventId, item.bookingType, Math.max(1, item.seatCount - 1))}
                        className="w-7 h-7 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 active:scale-95"
                      >
                        <MinusIcon className="w-3 h-3" />
                      </button>
                      <span className="text-[13px] font-semibold w-6 text-center">{item.seatCount}</span>
                      <button
                        onClick={() => updateItemCount(item.eventId, item.bookingType, item.seatCount + 1)}
                        className="w-7 h-7 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 active:scale-95"
                      >
                        <PlusIcon className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-[14px] font-bold text-gray-900">
                        ₹{(getPrice(item) * item.seatCount).toLocaleString('en-IN')}
                      </p>
                      <button
                        onClick={() => removeItem(item.eventId, item.bookingType)}
                        className="mt-1 p-1.5 rounded-xl hover:bg-rose-50 flex items-center justify-center"
                      >
                        <TrashIcon className="w-3.5 h-3.5 text-rose-500" />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleFavorite(item.eventId)}
                  className="p-1.5 rounded-xl hover:bg-gray-50 self-start flex items-center justify-center ml-1"
                >
                  {isFavorite(item.eventId) ? 
                    <HeartSolid className="w-4 h-4 text-red-500" /> : 
                    <HeartOutline className="w-4 h-4 text-gray-400" />
                  }
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="fixed bottom-16 left-0 right-0 lg:hidden bg-white border-t border-gray-200 p-4 shadow-2xl z-50 mb-20">
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
            onClick={handleCheckout}
            className="w-full bg-black hover:bg-gray-900 text-white font-semibold text-[12px] py-3 rounded-2xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 uppercase tracking-wide"
          >
            Checkout ₹{total.toLocaleString('en-IN')}
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
};

export default CartPage;
