import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CalendarDaysIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { eventService } from '../../services/eventService';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';
import { X, Calendar, CheckCircle, ChevronLeft } from "lucide-react";


const EventsManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const categories = ['Conference', 'Workshop', 'Seminar', 'Concert', 'Sports', 'Exhibition', 'Other'];
  const statuses = ['draft', 'published', 'cancelled', 'completed'];

  useEffect(() => {
    fetchEvents();
  }, [currentPage, searchTerm, categoryFilter, statusFilter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getAllEvents({
        page: currentPage,
        limit: 20,
        search: searchTerm,
        category: categoryFilter,
        status: statusFilter || undefined
      });
      setEvents(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleAddEvent = async (eventData) => {
    try {
      await eventService.createEvent(eventData);
      toast.success('Event created successfully');
      setShowAddModal(false);
      fetchEvents();
    } catch (error) {
      toast.error('Failed to create event');
    }
  };

  const handleUpdateEvent = async (eventData) => {
    try {
      await eventService.updateEvent(selectedEvent._id, eventData);
      toast.success('Event updated successfully');
      setShowEditModal(false);
      setSelectedEvent(null);
      fetchEvents();
    } catch (error) {
      toast.error('Failed to update event');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventService.deleteEvent(eventId);
        toast.success('Event deleted successfully');
        fetchEvents();
      } catch (error) {
        toast.error('Failed to delete event');
      }
    }
  };

  const handleStatusChange = async (eventId, newStatus) => {
    try {
      await eventService.updateEventStatus(eventId, newStatus);
      toast.success('Event status updated successfully');
      fetchEvents();
    } catch (error) {
      toast.error('Failed to update event status');
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-success-100 text-success-700';
      case 'draft':
        return 'bg-warning-100 text-warning-700';
      case 'cancelled':
        return 'bg-error-100 text-error-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events Management</h1>
          <p className="text-gray-600 mt-2">Create and manage all events</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center mt-4 sm:mt-0"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Event
        </button>
      </div>

      {}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Statuses</option>
            {statuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        ) : (
          <>
            {}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pricing
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Capacity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.map((event) => (
                    <tr key={event._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={event.bannerImage || 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg'}
                            alt={event.title}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 line-clamp-1">
                              {event.title}
                            </div>
                            <div className="text-sm text-gray-500">{event.category}</div>
                            {event.featured && (
                              <span className="inline-block px-2 py-1 text-xs font-medium bg-secondary-100 text-secondary-700 rounded-full mt-1">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center mb-1">
                            <CalendarDaysIcon className="w-4 h-4 mr-1" />
                            {formatDate(event.startDate)}
                          </div>
                          <div className="flex items-center text-gray-500">
                            <MapPinIcon className="w-4 h-4 mr-1" />
                            <span className="truncate max-w-32">{event.location}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div>User: ₹{formatPrice(event.userPrice)}</div>
                          <div>Member: ₹{formatPrice(event.memberPrice)}</div>
                          <div>Guest: ₹{formatPrice(event.guestPrice)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center">
                            <UserGroupIcon className="w-4 h-4 mr-1" />
                            {event.bookedSeats || 0} / {event.maxCapacity}
                          </div>
                          <div className="text-xs text-gray-500">
                            {event.maxCapacity - (event.bookedSeats || 0)} available
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={event.status}
                          onChange={(e) => handleStatusChange(event._id, e.target.value)}
                          className={`text-xs font-medium rounded-full px-2 py-1 border-0 ${getStatusColor(event.status)}`}
                        >
                          {statuses.map(status => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setSelectedEvent(event);
                              setShowViewModal(true);
                            }}
                            className="text-primary-600 hover:text-primary-700"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedEvent(event);
                              setShowEditModal(true);
                            }}
                            className="text-gray-600 hover:text-gray-700"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {}
            <div className="lg:hidden">
              {events.map((event) => (
                <div key={event._id} className="p-6 border-b border-gray-200 last:border-b-0">
                  <div className="flex items-start space-x-4 mb-4">
                    <img
                      src={event.bannerImage || 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg'}
                      alt={event.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">{event.category}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </span>
                        {event.featured && (
                          <span className="px-2 py-1 text-xs font-medium bg-secondary-100 text-secondary-700 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <CalendarDaysIcon className="w-4 h-4 mr-2" />
                      {formatDate(event.startDate)}
                    </div>
                    <div className="flex items-center">
                      <MapPinIcon className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                    <div className="flex items-center">
                      <CurrencyRupeeIcon className="w-4 h-4 mr-2" />
                      User: ₹{formatPrice(event.userPrice)} | Member: ₹{formatPrice(event.memberPrice)}
                    </div>
                    <div className="flex items-center">
                      <UserGroupIcon className="w-4 h-4 mr-2" />
                      {event.bookedSeats || 0} / {event.maxCapacity} booked
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowViewModal(true);
                      }}
                      className="flex items-center px-3 py-1 text-sm text-primary-600 hover:text-primary-700"
                    >
                      <EyeIcon className="w-4 h-4 mr-1" />
                      View
                    </button>
                    <button
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowEditModal(true);
                      }}
                      className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-700"
                    >
                      <PencilIcon className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event._id)}
                      className="flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="w-4 h-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <p className="text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {}
      {showAddModal && (
        <EventFormModal
          title="Create New Event"
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddEvent}
        />
      )}

      {}
      {showEditModal && selectedEvent && (
        <EventFormModal
          title="Edit Event"
          event={selectedEvent}
          onClose={() => {
            setShowEditModal(false);
            setSelectedEvent(null);
          }}
          onSubmit={handleUpdateEvent}
        />
      )}

      {}
      {showViewModal && selectedEvent && (
        <ViewEventModal
          event={selectedEvent}
          onClose={() => {
            setShowViewModal(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );
};



const EventFormModal = ({ title, event, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: event?.title || "",
    description: event?.description || "",
    longDescription: event?.longDescription || "",
    category: event?.category || "Conference",
    tags: event?.tags?.join(", ") || "",
    startDate: event?.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : "",
    endDate: event?.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : "",
    actualDateOfEvent: event?.actualDateOfEvent || "", // Added field
    duration: event?.duration || "",
    location: event?.location || "",
    venue: event?.venue || "",
    bannerImage: event?.bannerImage || "",
    gallery: event?.gallery?.join("\n") || "",
    userPrice: event?.userPrice || 0,
    memberPrice: event?.memberPrice || 0,
    guestPrice: event?.guestPrice || 0,
    maxCapacity: event?.maxCapacity || 100,
    maxTicketsPerUser: event?.maxTicketsPerUser || 5,
    maxTicketsPerMember: event?.maxTicketsPerMember || 10,
    maxTicketsPerGuest: event?.maxTicketsPerGuest || 3,
    organizer: {
      name: event?.organizer?.name || "",
      email: event?.organizer?.email || "",
      phone: event?.organizer?.phone || "",
      website: event?.organizer?.website || "",
      description: event?.organizer?.description || "",
    },
    highlights: event?.highlights?.join("\n") || "",
    seatingType: event?.seatingType || "Open",
    ageRestriction: event?.ageRestriction || "All Ages",
    dresscode: event?.dresscode || "",
    specialNotes: event?.specialNotes || "",
    mapsUrl: event?.mapsUrl || "",
    terms: event?.terms || "",
    refundPolicy: event?.refundPolicy || "No refunds available",
    cancellationPolicy: event?.cancellationPolicy || "",
    faqs: event?.faqs || [{ question: "", answer: "" }],
    socialMedia: {
      facebook: event?.socialMedia?.facebook || "",
      twitter: event?.socialMedia?.twitter || "",
      instagram: event?.socialMedia?.instagram || "",
      linkedin: event?.socialMedia?.linkedin || "",
    },
    hasRefreshments: event?.hasRefreshments || false,
    hasParking: event?.hasParking || false,
    isWheelchairAccessible: event?.isWheelchairAccessible || false,
    hasWifi: event?.hasWifi || false,
    featured: event?.featured || false,
    status: event?.status || "draft",
  });


//   const [formData, setFormData] = useState({
//   title: event?.title || "International Tech Innovations Summit 2025",
//   description: event?.description || "A global summit bringing together innovators, entrepreneurs, researchers, and industry leaders.",
//   longDescription: event?.longDescription || 
//     "The International Tech Innovations Summit 2025 focuses on breakthrough technologies across AI, Robotics, Cybersecurity, Cloud Computing, and Biotechnology. The summit includes keynote speakers, workshops, panel discussions, and networking opportunities.",

//   category: event?.category || "Conference",
//   tags: event?.tags?.join(", ") || "Technology, Innovation, AI, Summit",

//   startDate: event?.startDate 
//     ? new Date(event.startDate).toISOString().slice(0, 16)
//     : "2025-03-10T09:00",

//   endDate: event?.endDate
//     ? new Date(event.endDate).toISOString().slice(0, 16)
//     : "2025-03-12T18:00",

//   actualDateOfEvent: event?.actualDateOfEvent || "2025-03-11",
//   duration: event?.duration || "3 Days",

//   location: event?.location || "Bangalore International Exhibition Centre",
//   venue: event?.venue || "Hall A – Conference Auditorium",

//   bannerImage: event?.bannerImage || "https://example.com/images/techsummit-banner.jpg",

//   gallery: event?.gallery?.join("\n") ||
//     "https://example.com/images/gallery1.jpg\nhttps://example.com/images/gallery2.jpg",

//   userPrice: event?.userPrice || 1500,
//   memberPrice: event?.memberPrice || 1200,
//   guestPrice: event?.guestPrice || 1800,

//   maxCapacity: event?.maxCapacity || 500,
//   maxTicketsPerUser: event?.maxTicketsPerUser || 5,
//   maxTicketsPerMember: event?.maxTicketsPerMember || 10,
//   maxTicketsPerGuest: event?.maxTicketsPerGuest || 3,

//   organizer: {
//     name: event?.organizer?.name || "Tech Global Foundation",
//     email: event?.organizer?.email || "contact@techglobal.org",
//     phone: event?.organizer?.phone || "+91 9876543210",
//     website: event?.organizer?.website || "https://techglobal.org",
//     description: event?.organizer?.description || 
//       "Tech Global Foundation is a non-profit organization dedicated to promoting cutting-edge technology innovations and global collaboration.",
//   },

//   highlights: event?.highlights?.join("\n") ||
//     "Keynote by World-renowned AI Scientist\nLive Robotics Demo\nStartup Pitch Battle\nNetworking Dinner",

//   seatingType: event?.seatingType || "Open",
//   ageRestriction: event?.ageRestriction || "All Ages",
//   dresscode: event?.dresscode || "Smart Casual",
//   specialNotes: event?.specialNotes || "Bring your registration QR code for entry.",
//   mapsUrl: event?.mapsUrl || "https://maps.google.com/?q=BIEC+Bangalore",

//   terms: event?.terms || "All attendees must carry a valid ID proof. Photography is permitted.",
//   refundPolicy: event?.refundPolicy || "Refunds available only if cancelled 7 days prior to event.",
//   cancellationPolicy: event?.cancellationPolicy || 
//     "Organizer reserves the right to reschedule or cancel the event due to unavoidable circumstances.",

//   faqs: event?.faqs || [
//     { question: "Is lunch provided?", answer: "Yes, lunch and refreshments will be provided." },
//     { question: "Can I transfer my ticket?", answer: "Yes, ticket transfer is allowed before 3 days of event." }
//   ],

//   socialMedia: {
//     facebook: event?.socialMedia?.facebook || "https://facebook.com/techsummit",
//     twitter: event?.socialMedia?.twitter || "https://twitter.com/techsummit",
//     instagram: event?.socialMedia?.instagram || "https://instagram.com/techsummit",
//     linkedin: event?.socialMedia?.linkedin || "https://linkedin.com/company/techsummit",
//   },

//   hasRefreshments: event?.hasRefreshments || true,
//   hasParking: event?.hasParking || true,
//   isWheelchairAccessible: event?.isWheelchairAccessible || true,
//   hasWifi: event?.hasWifi || true,

//   featured: event?.featured || true,
//   status: event?.status || "draft",
// });


  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const categories = ["Conference", "Workshop", "Seminar", "Concert", "Sports", "Exhibition", "Other"];
  const seatingTypes = ["Open", "Reserved", "Mixed"];
  const ageRestrictions = ["All Ages", "18+", "21+", "Kids Only"];
  const statuses = ["draft", "published", "cancelled", "completed"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const eventData = {
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag),
        gallery: formData.gallery.split("\n").map((url) => url.trim()).filter((url) => url),
        highlights: formData.highlights.split("\n").map((highlight) => highlight.trim()).filter((highlight) => highlight),
        faqs: formData.faqs.filter((faq) => faq.question && faq.answer),
      };
      await onSubmit(eventData);
    } finally {
      setLoading(false);
    }
  };

  const addFAQ = () => {
    setFormData({
      ...formData,
      faqs: [...formData.faqs, { question: "", answer: "" }],
    });
  };

  const removeFAQ = (index) => {
    setFormData({
      ...formData,
      faqs: formData.faqs.filter((_, i) => i !== index),
    });
  };

  const updateFAQ = (index, field, value) => {
    const updatedFAQs = formData.faqs.map((faq, i) => (i === index ? { ...faq, [field]: value } : faq));
    setFormData({ ...formData, faqs: updatedFAQs });
  };

  const tabs = [
    { id: "basic", name: "Basic Info" },
    { id: "details", name: "Details" },
    { id: "pricing", name: "Pricing" },
    { id: "organizer", name: "Organizer" },
    { id: "policies", name: "Policies" },
    { id: "features", name: "Features" },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl sm:max-w-6xl h-[95vh] sm:h-auto flex flex-col rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-200 max-h-screen">
        {/* Mobile Header */}
        <div className="sm:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h3 className="text-lg font-bold text-gray-900 truncate">{title}</h3>
          <div className="w-6 h-6" />
        </div>

        {/* Desktop Header */}
        <div className="hidden sm:flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          </div>
        </div>

        {/* Tabs - Sticky */}
        <div className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-10 sm:px-6">
          <nav className="flex sm:space-x-8 overflow-x-auto pb-2 sm:pb-4 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap py-3 px-4 sm:px-6 border-b-2 font-semibold text-sm transition-all ${
                  activeTab === tab.id
                    ? "border-black text-black shadow-sm"
                    : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Form Content */}
         <form onSubmit={handleSubmit} className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 sm:pb-4 space-y-4 sm:space-y-6">
            {}
            {activeTab === 'basic' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Long Description
                  </label>
                  <textarea
                    rows={5}
                    value={formData.longDescription}
                    onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                     
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="technology, conference, networking"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Banner Image URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.bannerImage}
                    onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gallery Images (one URL per line)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.gallery}
                    onChange={(e) => setFormData({ ...formData, gallery: e.target.value })}
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                    Featured Event
                  </label>
                </div>
              </div>
            )}

            {}
            {activeTab === 'details' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                
               <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="2 hours"
                  />
                </div>
                 <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    Actual Event Date
                  </label>
                  <input
                    type="date"
                    value={formData.actualDateOfEvent}
                    onChange={(e) => setFormData({ ...formData, actualDateOfEvent: e.target.value })}
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
               </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Venue
                    </label>
                    <input
                      type="text"
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maps URL
                  </label>
                  <input
                    type="url"
                    value={formData.mapsUrl}
                    onChange={(e) => setFormData({ ...formData, mapsUrl: e.target.value })}
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Seating Type
                    </label>
                    <select
                      value={formData.seatingType}
                      onChange={(e) => setFormData({ ...formData, seatingType: e.target.value })}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {seatingTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age Restriction
                    </label>
                    <select
                      value={formData.ageRestriction}
                      onChange={(e) => setFormData({ ...formData, ageRestriction: e.target.value })}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {ageRestrictions.map(restriction => (
                        <option key={restriction} value={restriction}>{restriction}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Capacity *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.maxCapacity}
                      onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dress Code
                  </label>
                  <input
                    type="text"
                    value={formData.dresscode}
                    onChange={(e) => setFormData({ ...formData, dresscode: e.target.value })}
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Notes
                  </label>
                  <textarea
                    rows={3}
                    value={formData.specialNotes}
                    onChange={(e) => setFormData({ ...formData, specialNotes: e.target.value })}
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Highlights (one per line)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.highlights}
                    onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Expert speakers&#10;Networking opportunities&#10;Free refreshments"
                  />
                </div>
              </div>
            )}

            {}
            {activeTab === 'pricing' && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      User Price *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.userPrice}
                      onChange={(e) => setFormData({ ...formData, userPrice: parseFloat(e.target.value) })}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Member Price *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.memberPrice}
                      onChange={(e) => setFormData({ ...formData, memberPrice: parseFloat(e.target.value) })}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Guest Price *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.guestPrice}
                      onChange={(e) => setFormData({ ...formData, guestPrice: parseFloat(e.target.value) })}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Tickets per User
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.maxTicketsPerUser}
                      onChange={(e) => setFormData({ ...formData, maxTicketsPerUser: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Tickets per Member
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.maxTicketsPerMember}
                      onChange={(e) => setFormData({ ...formData, maxTicketsPerMember: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Tickets per Guest
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.maxTicketsPerGuest}
                      onChange={(e) => setFormData({ ...formData, maxTicketsPerGuest: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {}
            {activeTab === 'organizer' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Organizer Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.organizer.name}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        organizer: { ...formData.organizer, name: e.target.value }
                      })}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Organizer Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.organizer.email}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        organizer: { ...formData.organizer, email: e.target.value }
                      })}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.organizer.phone}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        organizer: { ...formData.organizer, phone: e.target.value }
                      })}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.organizer.website}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        organizer: { ...formData.organizer, website: e.target.value }
                      })}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organizer Description
                  </label>
                  <textarea
                    rows={4}
                    value={formData.organizer.description}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      organizer: { ...formData.organizer, description: e.target.value }
                    })}
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Facebook
                    </label>
                    <input
                      type="url"
                      value={formData.socialMedia.facebook}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        socialMedia: { ...formData.socialMedia, facebook: e.target.value }
                      })}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Twitter
                    </label>
                    <input
                      type="url"
                      value={formData.socialMedia.twitter}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        socialMedia: { ...formData.socialMedia, twitter: e.target.value }
                      })}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Instagram
                    </label>
                    <input
                      type="url"
                      value={formData.socialMedia.instagram}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        socialMedia: { ...formData.socialMedia, instagram: e.target.value }
                      })}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      value={formData.socialMedia.linkedin}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        socialMedia: { ...formData.socialMedia, linkedin: e.target.value }
                      })}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {}
            {activeTab === 'policies' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Terms & Conditions
                  </label>
                  <textarea
                    rows={4}
                    value={formData.terms}
                    onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Refund Policy
                  </label>
                  <textarea
                    rows={3}
                    value={formData.refundPolicy}
                    onChange={(e) => setFormData({ ...formData, refundPolicy: e.target.value })}
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cancellation Policy
                  </label>
                  <textarea
                    rows={3}
                    value={formData.cancellationPolicy}
                    onChange={(e) => setFormData({ ...formData, cancellationPolicy: e.target.value })}
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                {}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Frequently Asked Questions
                    </label>
                    <button
                      type="button"
                      onClick={addFAQ}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      + Add FAQ
                    </button>
                  </div>
                  
                  {formData.faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-gray-700">FAQ {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeFAQ(index)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Question"
                          value={faq.question}
                          onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <textarea
                          rows={2}
                          placeholder="Answer"
                          value={faq.answer}
                          onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {}
            {activeTab === 'features' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="hasRefreshments"
                      checked={formData.hasRefreshments}
                      onChange={(e) => setFormData({ ...formData, hasRefreshments: e.target.checked })}
                      className="mr-2"
                    />
                    <label htmlFor="hasRefreshments" className="text-sm font-medium text-gray-700">
                      Has Refreshments
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="hasParking"
                      checked={formData.hasParking}
                      onChange={(e) => setFormData({ ...formData, hasParking: e.target.checked })}
                      className="mr-2"
                    />
                    <label htmlFor="hasParking" className="text-sm font-medium text-gray-700">
                      Has Parking
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isWheelchairAccessible"
                      checked={formData.isWheelchairAccessible}
                      onChange={(e) => setFormData({ ...formData, isWheelchairAccessible: e.target.checked })}
                      className="mr-2"
                    />
                    <label htmlFor="isWheelchairAccessible" className="text-sm font-medium text-gray-700">
                      Wheelchair Accessible
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="hasWifi"
                      checked={formData.hasWifi}
                      onChange={(e) => setFormData({ ...formData, hasWifi: e.target.checked })}
                      className="mr-2"
                    />
                    <label htmlFor="hasWifi" className="text-sm font-medium text-gray-700">
                      Has WiFi
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {}
          {/* <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center"
            >
              {loading && <LoadingSpinner size="small" className="mr-2" />}
              {event ? 'Update Event' : 'Create Event'}
            </button>
          </div> */}
        </form>

        {/* Sticky Footer */}
        <div className="border-t border-gray-200 bg-white/95 backdrop-blur-sm p-4 sm:px-6 sticky bottom-0 z-10 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 sm:flex-none px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 sm:flex-none px-8 py-3 bg-black hover:bg-gray-900 text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <CheckCircle className="w-5 h-5" />
            )}
            {event ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};



// View Event Modal Component
const ViewEventModal = ({ event, onClose }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN').format(price);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col overflow-scroll">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Event Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {}
          <div>
            <img
              src={event.bannerImage}
              alt={event.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h2>
            <p className="text-gray-600 mb-4">{event.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Category:</span>
                <p className="text-gray-900">{event.category}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <p className="text-gray-900 capitalize">{event.status}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Duration:</span>
                <p className="text-gray-900">{event.duration}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Capacity:</span>
                <p className="text-gray-900">{event.bookedSeats || 0} / {event.maxCapacity}</p>
              </div>
            </div>
          </div>

          {}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Date & Time</h4>
              <p className="text-sm text-gray-600">Start: {formatDate(event.startDate)}</p>
              <p className="text-sm text-gray-600">End: {formatDate(event.endDate)}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Location</h4>
              <p className="text-sm text-gray-600">{event.location}</p>
              {event.venue && <p className="text-sm text-gray-600">{event.venue}</p>}
            </div>
          </div>

          {}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Pricing</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">User Price:</span>
                <p className="font-medium">₹{formatPrice(event.userPrice)}</p>
              </div>
              <div>
                <span className="text-gray-600">Member Price:</span>
                <p className="font-medium">₹{formatPrice(event.memberPrice)}</p>
              </div>
              <div>
                <span className="text-gray-600">Guest Price:</span>
                <p className="font-medium">₹{formatPrice(event.guestPrice)}</p>
              </div>
            </div>
          </div>

          {}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Organizer</h4>
            <div className="text-sm">
              <p><span className="font-medium">Name:</span> {event.organizer.name}</p>
              <p><span className="font-medium">Email:</span> {event.organizer.email}</p>
              {event.organizer.phone && (
                <p><span className="font-medium">Phone:</span> {event.organizer.phone}</p>
              )}
            </div>
          </div>

          {}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Features</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center">
                <span className={`w-2 h-2 rounded-full mr-2 ${event.hasRefreshments ? 'bg-green-500' : 'bg-gray-300'}`} />
                Refreshments
              </div>
              <div className="flex items-center">
                <span className={`w-2 h-2 rounded-full mr-2 ${event.hasParking ? 'bg-green-500' : 'bg-gray-300'}`} />
                Parking
              </div>
              <div className="flex items-center">
                <span className={`w-2 h-2 rounded-full mr-2 ${event.isWheelchairAccessible ? 'bg-green-500' : 'bg-gray-300'}`} />
                Wheelchair Accessible
              </div>
              <div className="flex items-center">
                <span className={`w-2 h-2 rounded-full mr-2 ${event.hasWifi ? 'bg-green-500' : 'bg-gray-300'}`} />
                WiFi
              </div>
            </div>
          </div>

          {}
          {event.longDescription && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{event.longDescription}</p>
            </div>
          )}

          {}
          {event.highlights && event.highlights.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Highlights</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {event.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {}
          {event.faqs && event.faqs.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">FAQs</h4>
              <div className="space-y-3">
                {event.faqs.map((faq, index) => (
                  <div key={index} className="border-l-4 border-primary-500 pl-4">
                    <p className="font-medium text-sm text-gray-900">{faq.question}</p>
                    <p className="text-sm text-gray-600 mt-1">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsManagement;
