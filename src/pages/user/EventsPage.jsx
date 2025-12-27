import React, { useState, useEffect } from 'react';
import { 
  FunnelIcon, XMarkIcon, ChevronLeftIcon, ClockIcon, 
  MapPinIcon, TicketIcon, CurrencyRupeeIcon ,
   MagnifyingGlassIcon, CalendarDaysIcon, StarIcon
} from '@heroicons/react/24/outline';

import EventCard from '../../components/UI/EventCard';
import SearchBar from '../../components/UI/SearchBar';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { eventService } from '../../services/eventService';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    priceRange: '',
    dateRange: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, [searchQuery, filters]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = { search: searchQuery, ...filters };
      const response = await eventService.getAllEvents(params);
      setEvents(response.data);
      
      const uniqueCategories = [...new Set(response.data.map(event => event.category).filter(Boolean))];
      const uniqueLocations = [...new Set(response.data.map(event => event.location).filter(Boolean))];
      setCategories(uniqueCategories);
      setLocations(uniqueLocations);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      location: '',
      priceRange: '',
      dateRange: '',
    });
    setSearchQuery('');
  };

  const hasActiveFilters = Object.values(filters).some(filter => filter !== '') || searchQuery !== '';

  return (
    <div className="min-h-screen bg-gray-50 p-1 md:p-4">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {}
        <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-40 px-4 py-3">
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl hover:bg-gray-50 -ml-1">
              <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-gray-900">Events</h1>
              <p className="text-[11px] text-gray-600">{events.length} found</p>
            </div>
          </div>
        </div>

        {}

<div className="hidden lg:block bg-white/95 backdrop-blur-sm rounded-3xl border border-gray-200 p-4 mb-8 sticky top-4 z-30 shadow-sm max-w-4xl mx-auto">
  <div className="flex items-center justify-between mb-4">
    <div>
      <h1 className="text-xl font-extrabold text-gray-900 leading-tight">Discover Events</h1>
      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Find amazing events near you</p>
    </div>
    <div className="text-[10px] font-semibold text-gray-700 bg-gray-100 rounded-full px-2 py-0.5 select-none">
      {events.length} event{events.length !== 1 ? 's' : ''}
    </div>
  </div>

  {/* Buttons row */}
  <div className="flex gap-2">
    <button className="flex items-center gap-1 px-2.5 py-1 rounded-xl border border-gray-300 text-gray-700 text-[10px] font-semibold hover:bg-gray-100 active:scale-[0.97] transition-transform whitespace-nowrap shadow-sm">
      <MagnifyingGlassIcon className="w-3 h-3" />
      All Events
    </button>
    <button className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] font-semibold shadow-md hover:brightness-110 active:scale-[0.97] transition-transform whitespace-nowrap">
      <CalendarDaysIcon className="w-3 h-3" />
      Upcoming
    </button>
    <button className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-700 text-[10px] font-semibold shadow-sm hover:bg-emerald-100 active:scale-[0.97] transition-transform whitespace-nowrap">
      <StarIcon className="w-3 h-3" />
      Featured
    </button>
  </div>
</div>


        {}
        <div className="mb-6 lg:mb-8 mt-7">
          <div className="bg-white rounded-3xl border border-gray-200 p-4 lg:p-6">
            <div className="flex items-center gap-3 lg:gap-4">
              <SearchBar 
                onSearch={handleSearch}
                placeholder="Search events, artists, venues..." 
                className="flex-1"
              />
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden p-3 rounded-2xl border border-gray-200 hover:bg-gray-50 flex items-center gap-2"
              >
                <FunnelIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {}
        <div className="hidden lg:block mb-8">
          <div className="bg-white rounded-3xl border border-gray-200 p-6">
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <TicketIcon className="w-4 h-4 text-gray-500" />
                  Category
                </label>
                <select 
                  value={filters.category} 
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full text-sm px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-gray-50 hover:bg-gray-100 transition-all"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4 text-gray-500" />
                  Location
                </label>
                <select 
                  value={filters.location} 
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full text-sm px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-gray-50 hover:bg-gray-100 transition-all"
                >
                  <option value="">All Locations</option>
                  {locations.slice(0, 8).map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <CurrencyRupeeIcon className="w-4 h-4 text-gray-500" />
                  Price
                </label>
                <select 
                  value={filters.priceRange} 
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="w-full text-sm px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-gray-50 hover:bg-gray-100 transition-all"
                >
                  <option value="">All Prices</option>
                  <option value="0-1000">₹0 - ₹1K</option>
                  <option value="1000-2500">₹1K - ₹2.5K</option>
                  <option value="2500+">₹2.5K+</option>
                </select>
              </div>

              {}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <ClockIcon className="w-4 h-4 text-gray-500" />
                  Date
                </label>
                <select 
                  value={filters.dateRange} 
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                  className="w-full text-sm px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-gray-50 hover:bg-gray-100 transition-all"
                >
                  <option value="">All Dates</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            </div>
            
            {hasActiveFilters && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button 
                  onClick={clearFilters}
                  className="text-sm text-rose-600 font-semibold hover:text-rose-700 flex items-center gap-1.5"
                >
                  <XMarkIcon className="w-4 h-4" />
                  Clear {events.length} filters
                </button>
              </div>
            )}
          </div>
        </div>

        {}
        {showFilters && (
          <div className="lg:hidden fixed inset-0 z-[9999] flex items-end justify-center p-4">
            <div 
              className="bg-white rounded-3xl border border-gray-200 w-full max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-4"
              onClick={e => e.stopPropagation()}
            >
              {}
              <div className="p-5 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-3xl">
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                <button 
                  onClick={() => setShowFilters(false)} 
                  className="p-2 rounded-2xl hover:bg-gray-50"
                >
                  <XMarkIcon className="w-6 h-6 text-gray-700" />
                </button>
              </div>

              {}
              <div className="flex-1 overflow-y-auto px-5 py-6 -mt-px">
                {}
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TicketIcon className="w-4 h-4" />
                    Category
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center p-3 rounded-2xl border border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-all">
                      <input
                        type="radio"
                        name="category"
                        value=""
                        checked={filters.category === ''}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="w-5 h-5 text-black border-2 border-gray-300 rounded focus:ring-black"
                      />
                      <span className="ml-3 text-sm font-semibold text-gray-900">All Events</span>
                    </label>
                    {categories.map((category) => (
                      <label key={category} className="flex items-center p-3 rounded-2xl border border-gray-200 bg-white cursor-pointer hover:bg-gray-50 transition-all">
                        <input
                          type="radio"
                          name="category"
                          value={category}
                          checked={filters.category === category}
                          onChange={(e) => handleFilterChange('category', e.target.value)}
                          className="w-5 h-5 text-black border-2 border-gray-300 rounded focus:ring-black"
                        />
                        <span className="ml-3 text-sm font-semibold text-gray-900 capitalize">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {}
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4" />
                    Location
                  </h3>
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    <label className="flex items-center p-3 rounded-2xl border border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-all">
                      <input
                        type="radio"
                        name="location"
                        value=""
                        checked={filters.location === ''}
                        onChange={(e) => handleFilterChange('location', e.target.value)}
                        className="w-5 h-5 text-black border-2 border-gray-300 rounded focus:ring-black"
                      />
                      <span className="ml-3 text-sm font-semibold text-gray-900">All Locations</span>
                    </label>
                    {locations.slice(0, 8).map((location) => (
                      <label key={location} className="flex items-center p-3 rounded-2xl border border-gray-200 bg-white cursor-pointer hover:bg-gray-50 transition-all">
                        <input
                          type="radio"
                          name="location"
                          value={location}
                          checked={filters.location === location}
                          onChange={(e) => handleFilterChange('location', e.target.value)}
                          className="w-5 h-5 text-black border-2 border-gray-300 rounded focus:ring-black"
                        />
                        <span className="ml-3 text-sm font-semibold text-gray-900 truncate">{location}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <CurrencyRupeeIcon className="w-4 h-4" />
                      Price
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center p-3 rounded-2xl border border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100">
                        <input type="radio" name="price" value="" checked={filters.priceRange === ''} onChange={(e) => handleFilterChange('priceRange', e.target.value)} className="w-5 h-5" />
                        <span className="ml-3 text-sm font-semibold text-gray-900">All</span>
                      </label>
                      <label className="flex items-center p-3 rounded-2xl border border-gray-200 bg-white cursor-pointer hover:bg-gray-50">
                        <input type="radio" name="price" value="0-1000" checked={filters.priceRange === '0-1000'} onChange={(e) => handleFilterChange('priceRange', e.target.value)} className="w-5 h-5" />
                        <span className="ml-3 text-sm font-semibold text-gray-900">₹0-1K</span>
                      </label>
                      <label className="flex items-center p-3 rounded-2xl border border-gray-200 bg-white cursor-pointer hover:bg-gray-50">
                        <input type="radio" name="price" value="1000+" checked={filters.priceRange === '1000+'} onChange={(e) => handleFilterChange('priceRange', e.target.value)} className="w-5 h-5" />
                        <span className="ml-3 text-sm font-semibold text-gray-900">₹1K+</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <ClockIcon className="w-4 h-4" />
                      Date
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center p-3 rounded-2xl border border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100">
                        <input type="radio" name="date" value="" checked={filters.dateRange === ''} onChange={(e) => handleFilterChange('dateRange', e.target.value)} className="w-5 h-5" />
                        <span className="ml-3 text-sm font-semibold text-gray-900">All</span>
                      </label>
                      <label className="flex items-center p-3 rounded-2xl border border-gray-200 bg-white cursor-pointer hover:bg-gray-50">
                        <input type="radio" name="date" value="week" checked={filters.dateRange === 'week'} onChange={(e) => handleFilterChange('dateRange', e.target.value)} className="w-5 h-5" />
                        <span className="ml-3 text-sm font-semibold text-gray-900">This Week</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {}
              <div className="p-5 border-t border-gray-200 bg-gray-50 rounded-b-3xl mt-auto sticky bottom-0">
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full bg-black text-white text-sm font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-900 shadow-lg transition-all"
                >
                  <ClockIcon className="w-5 h-5" />
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {}
        <div className={`space-y-4 lg:space-y-6 ${loading || events.length === 0 ? 'min-h-[60vh]' : ''}`}>
          {loading ? (
            <div className="flex items-center justify-center py-20 lg:py-32">
              <LoadingSpinner size="large" />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20 lg:py-32">
              <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-8 border-2 border-dashed border-gray-200">
                <FunnelIcon className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">No events match your search</h3>
              <p className="text-sm lg:text-base text-gray-600 mb-8 max-w-lg mx-auto">
                {hasActiveFilters 
                  ? 'Try adjusting your filters or search for something else' 
                  : 'No events available right now. Check back soon!'
                }
              </p>
              {hasActiveFilters && (
                <button 
                  onClick={clearFilters} 
                  className="bg-black text-white px-8 py-3.5 rounded-2xl font-semibold text-sm hover:bg-gray-900 shadow-lg transition-all"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
