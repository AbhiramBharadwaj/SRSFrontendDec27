import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartIcon, 
  CalendarDaysIcon,
  MapPinIcon,
  TicketIcon,
  StarIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import EventCard from '../../components/UI/EventCard';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { userService } from '../../services/userService';
import toast from 'react-hot-toast';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await userService.getFavorites();
      setFavorites(response.data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-500">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 bg-white border-b border-gray-200 z-50 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-semibold">Favorites</p>
            <h1 className="text-sm font-bold text-gray-900">Saved Events</h1>
            <p className="text-[11px] text-gray-500">{favorites.length} events</p>
          </div>
          <HeartIcon className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-12">
        {/* Desktop Header */}
        <div className="hidden lg:block mb-12 text-center">
          <div className="inline-flex items-center gap-2 mb-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-3xl">
            <HeartIcon className="w-5 h-5" />
            <span className="text-lg font-black uppercase tracking-wide">My Favorites</span>
          </div>
          <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">
            Events you've saved for later • {favorites.length} total
          </p>
        </div>

        {/* Mobile/Desktop Content */}
        {favorites.length === 0 ? (
          <div className="text-center py-20 lg:py-32 max-w-md mx-auto">
            {/* Empty State Illustration */}
            <div className="w-28 h-28 bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <div className="w-20 h-20 bg-white/50 rounded-2xl flex items-center justify-center ">
                <HeartIcon className="w-10 h-10 text-rose-400" />
              </div>
            </div>
            
            <div className="space-y-3 mb-8">
              <h2 className="text-2xl lg:text-3xl font-black text-gray-900 leading-tight">
                No favorites yet
              </h2>
              <p className="text-lg text-gray-600 max-w-sm mx-auto leading-relaxed">
                Start exploring amazing events and save the ones you're interested in for later!
              </p>
            </div>

            {/* Dark CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/events"
                className="flex-1 bg-black hover:bg-gray-900 text-white font-bold text-sm py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-wide text-[12px]"
              >
                <MagnifyingGlassIcon className="w-4 h-4" />
                Browse Events
              </Link>
              <Link
                to="/events?featured=true"
                className="flex-1 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold text-sm py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-wide text-[12px]"
              >
                <StarIcon className="w-4 h-4" />
                Featured
              </Link>
            </div>

            <p className="text-[11px] text-gray-500 mt-8 font-medium">
              💡 Tap heart icon on any event to save it here
            </p>
          </div>
        ) : (
          <>
            {/* Stats Bar (Desktop) */}
            <div className="hidden lg:block bg-white/50 backdrop-blur-sm border border-gray-200 rounded-3xl p-6 mb-8 shadow-sm">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-black text-gray-900 mb-1">{favorites.length}</div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">Saved Events</p>
                </div>
                <div>
                  <div className="text-3xl font-black text-emerald-600 mb-1">{favorites.filter(e => new Date(e.startDate) < new Date()).length}</div>
                  <p className="text-[11px] text-emerald-600 uppercase tracking-wider font-semibold">Past Events</p>
                </div>
                <div>
                  <div className="text-3xl font-black text-blue-600 mb-1">{favorites.filter(e => new Date(e.startDate) >= new Date()).length}</div>
                  <p className="text-[11px] text-blue-600 uppercase tracking-wider font-semibold">Upcoming</p>
                </div>
              </div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6">
              {favorites.map((event) => (
                <div key={event._id} className="group">
                  <EventCard event={event} />
                  <div className="lg:hidden mt-2 px-2">
                    <button className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white text-[11px] font-bold py-2.5 px-4 rounded-xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 uppercase tracking-wide">
                      <TicketIcon className="w-3.5 h-3.5" />
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More / Action Bar (Desktop) */}
            {favorites.length > 0 && (
              <div className="hidden lg:block mt-12 text-center">
                <div className="inline-flex bg-black text-white font-bold text-sm px-8 py-4 rounded-3xl shadow-2xl hover:shadow-3xl hover:bg-gray-900 active:scale-[0.98] transition-all uppercase tracking-wider">
                  <CalendarDaysIcon className="w-4 h-4 inline mr-2" />
                  Discover More Events
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Mobile Bottom Bar */}
      {favorites.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px]">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-medium">Total</p>
              <p className="text-sm font-bold text-gray-900">{favorites.length} events</p>
            </div>
            <Link
              to="/events"
              className="bg-black hover:bg-gray-900 text-white font-bold text-[12px] px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex items-center gap-2 uppercase tracking-wide"
            >
              <MagnifyingGlassIcon className="w-3.5 h-3.5" />
              Browse More
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
