// src/pages/EventDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CalendarDaysIcon,
  MapPinIcon,
  ClockIcon,
  UsersIcon,
  ShareIcon,
  ArrowLeftIcon,
  CheckIcon,
  HeartIcon as HeartOutline,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon,
  WifiIcon,
  TruckIcon,
  CakeIcon,
  TagIcon,
  ShoppingCartIcon,
  PlusIcon,
  MinusIcon,
  StarIcon,
  PhoneIcon,
  EnvelopeIcon,
  LinkIcon,
  InformationCircleIcon,
  TicketIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { eventService } from '../../services/eventService';
import toast from 'react-hot-toast';
import useCartStore from '../../store/cartStore';
import { useAuth } from '../../context/AuthContext';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { addItem } = useCartStore();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const res = await eventService.getEventById(id);
      setEvent(res.data);
    } catch (err) {
      toast.error('Event not found');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({ title: event?.title, url: window.location.href });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied!');
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const formatTime = (d) => new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <LoadingSpinner size="large" />
    </div>
  );

  if (!event) return null;

  const seatsLeft = event.availableSeats || (event.maxCapacity - (event.bookedSeats || 0));
  const isSoldOut = seatsLeft <= 0;
  const maxAllowed = Math.min(seatsLeft, event.maxTicketsPerUser || 5);

  const userPrice = Number(event.userPrice) || 0;
  const memberPrice = Number(event.memberPrice) || userPrice; // fallback
  const guestPrice = Number(event.guestPrice) || userPrice;

  const userRole = user?.role || 'guest'; 

  const getPriceForRole = () => {
    if (userRole === 'admin' || userRole === 'member') return memberPrice;
    if (userRole === 'user') return userPrice;
    return guestPrice;
  };

  const ticketPrice = getPriceForRole();
  const totalAmount = ticketPrice * qty;

  const increaseQty = () => {
    if (qty < maxAllowed) setQty(qty + 1);
    else toast.error(`Maximum ${maxAllowed} tickets allowed`);
  };

  const decreaseQty = () => {
    if (qty > 1) setQty(qty - 1);
  };

  const handleAddToCart = () => {
    const cartItem = {
      eventId: event._id,
      title: event.title,
      price: ticketPrice,
      qty,
      bannerImage: event.bannerImage,
      date: event.startDate,
      venue: event.venue || event.location,
      bookingType: event.bookingType || 'paid',
      role: userRole,
      originalPrice: userPrice,
    };

    addItem(cartItem);
    toast.success(`${qty} ticket(s) added to cart!`, {
      icon: 'Cart',
      style: { background: '#111', color: '#fff' },
    });
  };

  const handleBuyNow = () => {
    const cartItem = {
      eventId: event._id,
      title: event.title,
      price: ticketPrice,
      qty,
      bannerImage: event.bannerImage,
      date: event.startDate,
      venue: event.venue || event.location,
    };

    addItem(cartItem, true); 
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {}
      <div className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 hover:bg-white/10 rounded-xl px-4 py-3 transition"
          >
            <ArrowLeftIcon className="w-5 h-5" /> Back
          </button>

          <div className="hidden lg:flex items-center gap-3 text-sm text-gray-400">
            Events › {event.category} › <span className="text-white font-medium">{event.title}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-3 hover:bg-white/10 rounded-xl transition"
            >
              {isFavorite ? <HeartSolid className="w-6 h-6 text-red-500" /> : <HeartOutline className="w-6 h-6" />}
            </button>
            <button onClick={handleShare} className="p-3 hover:bg-white/10 rounded-xl transition">
              <ShareIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {}
          <div className="lg:col-span-2 space-y-8">

            {}
            <div className="bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20 rounded-3xl p-8 border border-white/10">
              <div className="flex flex-wrap gap-3 mb-5">
                {event.featured && (
                  <span className="px-4 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-bold">
                    Bestseller
                  </span>
                )}
                {isSoldOut ? (
                  <span className="px-4 py-1.5 bg-red-600 rounded-full text-xs font-bold">Sold Out</span>
                ) : seatsLeft < 100 ? (
                  <span className="px-4 py-1.5 bg-orange-600 rounded-full text-xs font-bold">
                    Only {seatsLeft} left!
                  </span>
                ) : null}
              </div>

              <h1 className="text-3xl md:text-4xl font-black mb-4">{event.title}</h1>
              <p className="text-lg text-gray-300 leading-relaxed">{event.description}</p>

              <div className="flex items-center gap-6 mt-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <StarIcon className="w-5 h-5 text-yellow-400" />
                  <span className="font-bold text-white">4.8</span> · Featured
                </div>
                <div className="flex items-center gap-2">
                  <UsersIcon className="w-5 h-5" />
                  <span>{(event.viewCount || 0).toLocaleString()} views</span>
                </div>
              </div>

              <div className="mt-5 text-sm text-gray-500">
                Organized by <span className="text-purple-400 font-bold">{event.organizer.name}</span>
              </div>
            </div>

            {}
            {event.longDescription && (
              <div className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
                <h2 className="text-xl font-bold mb-4">About this Event</h2>
                <div className="text-gray-300 whitespace-pre-line leading-relaxed">{event.longDescription}</div>
              </div>
            )}

            {}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
                <div className="flex gap-4">
                  <CalendarDaysIcon className="w-6 h-6 text-purple-400" />
                  <div>
                    <p className="font-bold text-lg">{formatDate(event.startDate)}</p>
                    <p className="text-sm text-gray-400">{event.duration || 'Full Day'}</p>
                  </div>
                </div>
              </div>
              <div className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
                <div className="flex gap-4">
                  <MapPinIcon className="w-6 h-6 text-purple-400" />
                  <div>
                    <p className="font-bold text-lg">{event.venue || 'TBD'}</p>
                    <p className="text-sm text-gray-400">{event.location}</p>
                  </div>
                </div>
              </div>
              <div className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
                <div className="flex gap-4">
                  <ClockIcon className="w-6 h-6 text-purple-400" />
                  <div>
                    <p className="font-bold text-lg">{formatTime(event.startDate)}</p>
                    <p className="text-sm text-gray-400">Registration starts {formatDate(event.registrationStartDate)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
                <div className="flex gap-4">
                  <UsersIcon className="w-6 h-6 text-purple-400" />
                  <div>
                    <p className="font-bold text-lg">{seatsLeft} seats left</p>
                    <p className="text-sm text-gray-400">of {event.maxCapacity} total</p>
                  </div>
                </div>
              </div>
            </div>

            {}
            {event.highlights?.length > 0 && (
              <div className="bg-zinc-900 rounded-2xl p-8 border border-white/10">
                <h3 className="text-xl font-bold mb-6">What You'll Get</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {event.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <CheckIcon className="w-5 h-5 text-emerald-500 mt-0.5" />
                      <span className="text-gray-300">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {}
            <div className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold mb-5">Amenities & Rules</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                {event.hasRefreshments && <div className="flex items-center gap-2"><CakeIcon className="w-5 h-5 text-orange-400" /> Refreshments</div>}
                {event.hasParking && <div className="flex items-center gap-2"><TruckIcon className="w-5 h-5 text-blue-400" /> Parking</div>}
                {event.hasWifi && <div className="flex items-center gap-2"><WifiIcon className="w-5 h-5 text-purple-400" /> WiFi</div>}
                {event.isWheelchairAccessible && <div className="col-span-2 text-emerald-400 font-bold">Wheelchair Accessible</div>}
                {event.ageRestriction !== 'All Ages' && <div className="col-span-2 flex items-center gap-2"><ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" /> Age: {event.ageRestriction}</div>}
              </div>
            </div>

            {}
            <div className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold mb-5">Organizer</h3>
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-2xl font-black">
                  {event.organizer.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xl font-black">{event.organizer.name}</h4>
                  {event.organizer.description && <p className="text-gray-400 mt-2">{event.organizer.description}</p>}
                  <div className="mt-4 space-y-2 text-sm">
                    {event.organizer.email && <div className="flex items-center gap-2"><EnvelopeIcon className="w-4 h-4" /> {event.organizer.email}</div>}
                    {event.organizer.phone && <div className="flex items-center gap-2"><PhoneIcon className="w-4 h-4" /> {event.organizer.phone}</div>}
                  </div>
                </div>
              </div>
            </div>

            {}
            {event.faqs?.length > 0 && (
              <div className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-bold mb-5">FAQs</h3>
                {event.faqs.map((faq, i) => (
                  <details key={i} className="group py-4 border-b border-white/10 last:border-0">
                    <summary className="flex justify-between items-center cursor-pointer list-none">
                      <span className="font-medium">{faq.question}</span>
                      <QuestionMarkCircleIcon className="w-5 h-5 text-gray-500 group-open:rotate-180 transition" />
                    </summary>
                    <p className="mt-3 text-sm text-gray-400">{faq.answer}</p>
                  </details>
                ))}
              </div>
            )}
          </div>

          {}
          <div className="lg:col-span-1">
  <div className="sticky top-20 bg-zinc-900 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
    {/* Hero Image */}
    <div className="relative h-48">
      <img src={event.bannerImage} alt={event.title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80" />
      <div className="absolute bottom-4 left-4">
        <h3 className="text-lg font-black text-white leading-tight line-clamp-2">{event.title}</h3>
        <p className="text-[11px] text-gray-300 font-mono tracking-wider mt-1">{formatDate(event.startDate)}</p>
      </div>
    </div>

    <div className="p-5 space-y-4">
      {/* Price Section */}
      <div className="text-center">
        <div className="text-4xl font-black text-white mb-1">₹{ticketPrice.toLocaleString()}</div>
        {ticketPrice < userPrice && userRole !== 'guest' && (
          <div className="space-y-1">
            <p className="text-[11px] text-gray-400 line-through font-mono">₹{userPrice.toLocaleString()}</p>
            <p className="text-emerald-400 text-[11px] font-bold uppercase tracking-wider">
              {userRole === 'member' || userRole === 'admin' ? 'Member Discount!' : 'Special Price'}
            </p>
          </div>
        )}
        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">per ticket</p>
      </div>

      {/* Quantity Selector */}
      <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold">Tickets</span>
          <span className="text-sm font-bold text-white">{qty}</span>
        </div>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={decreaseQty}
            disabled={qty === 1 || isSoldOut}
            className="w-10 h-10 rounded-xl bg-zinc-700/50 hover:bg-zinc-600/80 disabled:opacity-30 transition-all flex items-center justify-center"
          >
            <MinusIcon className="w-4 h-4 text-gray-300" />
          </button>
          <span className="text-2xl font-black text-white w-10 text-center">{qty}</span>
          <button
            onClick={increaseQty}
            disabled={qty >= maxAllowed || isSoldOut}
            className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600/90 to-pink-600/90 hover:from-purple-700 hover:to-pink-700 disabled:opacity-30 shadow-md transition-all flex items-center justify-center"
          >
            <PlusIcon className="w-4 h-4 text-white" />
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-500 mt-2 font-mono tracking-wide">
          Max {maxAllowed} • {seatsLeft} left
        </p>
      </div>

      {/* Total */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-4 border border-purple-500/30 backdrop-blur-sm">
        <div className="flex justify-between items-baseline">
          <p className="text-lg font-bold text-white uppercase tracking-wide">Total</p>
          <p className="text-3xl font-black text-white">₹{totalAmount.toLocaleString()}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {isAuthenticated && (
          <>
            <button
              onClick={handleBuyNow}
              disabled={isSoldOut}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-40 font-bold text-sm py-3.5 px-4 rounded-xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all uppercase tracking-wide text-[11px]"
            >
              {isSoldOut ? 'Sold Out' : 'Buy Now'}
            </button>

            <button
              onClick={handleAddToCart}
              disabled={isSoldOut}
              className="w-full border-2 border-white/50 hover:border-white hover:bg-white/20 font-bold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-lg active:scale-[0.98] text-white uppercase tracking-wide text-[11px]"
            >
              <ShoppingCartIcon className="w-4 h-4" />
              Add to Cart
            </button>
          </>
        )}
        {!isAuthenticated && (
          <button
            onClick={() => navigate(`/guest/book/${event._id}`)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 font-bold text-sm py-3.5 px-4 rounded-xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all uppercase tracking-wide text-[11px]"
          >
            Book as Guest
          </button>
        )}
      </div>

      {/* Security Badge */}
      <div className="text-center pt-4 border-t border-white/10">
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
          <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-400" />
          <span>Instant QR • Secure • No Fees</span>
        </div>
      </div>
    </div>
  </div>
</div>

        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
