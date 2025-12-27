import React, { useState } from 'react';
import {
  CurrencyRupeeIcon,
  HeartIcon,
  ShoppingCartIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';
import useFavoritesStore from '../../store/favoritesStore';

const BookingCard = ({ event, onBookNow }) => {
  const { user, isAuthenticated, isMember } = useAuthStore();
  const { addItem } = useCartStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const [seatCount, setSeatCount] = useState(1);
  const [bookingType, setBookingType] = useState('user');

  const handleBookingTypeChange = (type) => {
    setBookingType(type);
  };

  const handleAddToCart = () => {
    addItem(event, seatCount, bookingType);
  };

  const handleFavoriteToggle = () => {
    if (isAuthenticated) {
      toggleFavorite(event._id);
    }
  };

  const getCurrentPrice = () => {
    switch (bookingType) {
      case 'member':
        return event.memberPrice;
      case 'guest':
        return event.guestPrice;
      default:
        return event.userPrice;
    }
  };

  const getTotalPrice = () => {
    return getCurrentPrice() * seatCount;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN').format(price);
  };

  const isEventFavorite = isFavorite(event._id);

  return (
    <div className="sticky top-6 bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Book Your Seats</h3>
        
        {}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="radio"
                name="bookingType"
                value="user"
                checked={bookingType === 'user'}
                onChange={() => handleBookingTypeChange('user')}
                className="mr-2"
              />
              <span className="text-sm font-medium">User Price</span>
            </label>
            <div className="flex items-center text-gray-900 font-semibold">
              <CurrencyRupeeIcon className="w-4 h-4" />
              <span>{formatPrice(event.userPrice)}</span>
            </div>
          </div>

          {isMember() && (
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="bookingType"
                  value="member"
                  checked={bookingType === 'member'}
                  onChange={() => handleBookingTypeChange('member')}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-secondary-600">
                  Member Price
                </span>
              </label>
              <div className="flex items-center text-secondary-600 font-semibold">
                <CurrencyRupeeIcon className="w-4 h-4" />
                <span>{formatPrice(event.memberPrice)}</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="radio"
                name="bookingType"
                value="guest"
                checked={bookingType === 'guest'}
                onChange={() => handleBookingTypeChange('guest')}
                className="mr-2"
              />
              <span className="text-sm font-medium">Guest Price</span>
            </label>
            <div className="flex items-center text-gray-900 font-semibold">
              <CurrencyRupeeIcon className="w-4 h-4" />
              <span>{formatPrice(event.guestPrice)}</span>
            </div>
          </div>
        </div>

        {}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Seats
          </label>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSeatCount(Math.max(1, seatCount - 1))}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={seatCount <= 1}
            >
              -
            </button>
            <span className="mx-4 text-lg font-semibold">{seatCount}</span>
            <button
              onClick={() => setSeatCount(seatCount + 1)}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              +
            </button>
          </div>
        </div>

        {}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-gray-900">Total</span>
            <div className="flex items-center text-xl font-bold text-primary-600">
              <CurrencyRupeeIcon className="w-5 h-5" />
              <span>{formatPrice(getTotalPrice())}</span>
            </div>
          </div>
        </div>

        {}
        <div className="space-y-3">
          <button
            onClick={() => onBookNow({ bookingType, seatCount, totalPrice: getTotalPrice() })}
            className="w-full btn-primary text-center py-3"
          >
            Book Now
          </button>
          
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center btn-outline py-3"
          >
            <ShoppingCartIcon className="w-5 h-5 mr-2" />
            Add to Cart
          </button>

          {isAuthenticated && (
            <button
              onClick={handleFavoriteToggle}
              className="w-full flex items-center justify-center border border-gray-300 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              {isEventFavorite ? (
                <>
                  <HeartIconSolid className="w-5 h-5 mr-2 text-red-500" />
                  Remove from Favorites
                </>
              ) : (
                <>
                  <HeartIcon className="w-5 h-5 mr-2" />
                  Add to Favorites
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {}
      <div className="border-t pt-4">
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <UserGroupIcon className="w-4 h-4 mr-2" />
          <span>Available Seats: {event.maxCapacity - (event.bookedSeats || 0)}</span>
        </div>
        
        {event.refundPolicy && (
          <p className="text-xs text-gray-500">
            <strong>Refund Policy:</strong> {event.refundPolicy}
          </p>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
