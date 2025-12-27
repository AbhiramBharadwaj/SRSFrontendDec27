import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartIcon,
  MapPinIcon,
  CalendarDaysIcon,
  CurrencyRupeeIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import useFavoritesStore from '../../store/favoritesStore';
import useAuthStore from '../../store/authStore';

const EventCard = ({ event, className = '' }) => {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const { isAuthenticated } = useAuthStore();
  
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAuthenticated) {
      toggleFavorite(event._id);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN').format(price);
  };

  const isEventFavorite = isFavorite(event._id);

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden ${className}`}>
      <Link to={`/events/${event._id}`} className="block">
        {}
        <div className="relative h-48 bg-gray-200">
          <img
            src={event.bannerImage || 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg'}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          {isAuthenticated && (
            <button
              onClick={handleFavoriteClick}
              className="absolute top-3 right-3 p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all duration-200"
            >
              {isEventFavorite ? (
                <HeartIconSolid className="w-5 h-5 text-red-500" />
              ) : (
                <HeartIcon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          )}
          {event.featured && (
            <div className="absolute top-3 left-3">
              <span className="bg-secondary-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                Featured
              </span>
            </div>
          )}
        </div>

        {}
        <div className="p-4">
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {event.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2">
              {event.description}
            </p>
          </div>

          {}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-gray-500 text-sm">
              <CalendarDaysIcon className="w-4 h-4 mr-2" />
              <span>{formatDate(event.startDate)}</span>
              {event.endDate && event.startDate !== event.endDate && (
                <span className="mx-1">- {formatDate(event.endDate)}</span>
              )}
            </div>
            
            {event.location && (
              <div className="flex items-center text-gray-500 text-sm">
                <MapPinIcon className="w-4 h-4 mr-2" />
                <span className="truncate">{event.location}</span>
              </div>
            )}
          </div>

          {}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-primary-600 font-semibold">
              <CurrencyRupeeIcon className="w-4 h-4" />
              <span>{formatPrice(event.userPrice)}</span>
              <span className="text-gray-500 text-sm ml-1">onwards</span>
            </div>
            
            {event.category && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                {event.category}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default EventCard;
