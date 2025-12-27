import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  DocumentArrowDownIcon,
  QrCodeIcon,
  CalendarDaysIcon,
  UserIcon,
  CurrencyRupeeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { bookingService } from '../../services/bookingService';
import { eventService } from '../../services/eventService';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';

const BookingsManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    eventId: '',
    paymentStatus: '',
    bookingType: '',
    dateRange: '',
  });

  const statuses = ['pending', 'confirmed', 'cancelled', 'completed'];
  const paymentStatuses = ['pending', 'completed', 'failed', 'refunded'];
  const bookingTypes = ['user', 'member', 'guest'];

  useEffect(() => {
    fetchBookings();
    fetchEvents();
  }, [currentPage, searchTerm, filters]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getUserBookings({
        page: currentPage,
        limit: 20,
        search: searchTerm,
        ...filters
      });
      setBookings(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await eventService.getAllEvents({ limit: 100 });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1);
  };

  const handleCreateManualBooking = async (bookingData) => {
    try {
      await bookingService.createManualBooking(bookingData);
      toast.success('Manual booking created successfully');
      setShowCreateModal(false);
      fetchBookings();
    } catch (error) {
      toast.error('Failed to create manual booking');
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await bookingService.updateBookingStatus(bookingId, newStatus);
      toast.success('Booking status updated successfully');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to update booking status');
    }
  };

  const downloadReceipt = async (bookingId) => {
    try {
      const response = await bookingService.downloadTicket(bookingId);
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${bookingId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Receipt downloaded successfully');
    } catch (error) {
      toast.error('Failed to download receipt');
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
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      case 'refunded':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6 px-4 max-w-7xl mx-auto py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Bookings Management</h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-md">
            Manage all event bookings and create manual bookings
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-1 rounded-lg bg-black px-3 py-2 text-white text-xs sm:text-sm font-semibold hover:bg-gray-800 transition"
        >
          <PlusIcon className="w-4 h-4" />
          Manual Booking
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-lg shadow p-4 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-3 items-center">
        <div className="relative text-gray-400">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-9 pr-3 py-2 border rounded-lg w-full text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="text-xs sm:text-sm px-2 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
        >
          <option value="">All Statuses</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
        <select
          value={filters.paymentStatus}
          onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
          className="text-xs sm:text-sm px-2 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
        >
          <option value="">All Payment Status</option>
          {paymentStatuses.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
        <select
          value={filters.bookingType}
          onChange={(e) => handleFilterChange('bookingType', e.target.value)}
          className="text-xs sm:text-sm px-2 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
        >
          <option value="">All Types</option>
          {bookingTypes.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
        <select
          value={filters.eventId}
          onChange={(e) => handleFilterChange('eventId', e.target.value)}
          className="text-xs sm:text-sm px-2 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
        >
          <option value="">All Events</option>
          {events.map((event) => (
            <option key={event._id} value={event._id}>
              {event.title}
            </option>
          ))}
        </select>
        <select
          value={filters.dateRange}
          onChange={(e) => handleFilterChange('dateRange', e.target.value)}
          className="text-xs sm:text-sm px-2 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
        >
          <option value="">All Dates</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="this-week">This Week</option>
          <option value="last-week">Last Week</option>
          <option value="this-month">This Month</option>
          <option value="last-month">Last Month</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner size="large" />
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto rounded-lg shadow border border-gray-200 mt-4">
            <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Booking ID</th>
                  <th className="px-4 py-3 text-left">Event</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">QR Status</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-mono">{booking.bookingId}</td>
                    <td className="px-4 py-2 truncate max-w-xs">{booking.event?.title}</td>
                    <td className="px-4 py-2 truncate max-w-xs">{booking.user?.firstName} {booking.user?.lastName}</td>
                    <td className="px-4 py-2 text-right font-semibold">
                      <CurrencyRupeeIcon className="inline w-4 h-4 mr-1" />
                      {formatPrice(booking.totalAmount)}
                    </td>
                    <td className="px-4 py-2">
                      <span className="text-xs text-gray-500">
                        {booking.qrScanCount} / {booking.qrScanLimit}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowViewModal(true);
                        }}
                        className="text-primary-600 hover:text-primary-800"
                        aria-label="View Booking"
                        title="View Booking"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => downloadReceipt(booking._id)}
                        className="text-gray-600 hover:text-gray-800"
                        aria-label="Download Receipt"
                        title="Download Receipt"
                      >
                        <DocumentArrowDownIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden mt-4 space-y-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white shadow rounded-lg p-4 text-xs font-sans space-y-2">
                <div className="flex justify-between items-center">
                  <div className="font-mono font-medium text-gray-900">{booking.bookingId}</div>
                  <div>
                    <span className={`px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-gray-700 text-xs">
                  <CalendarDaysIcon className="w-4 h-4" />
                  <span>{booking.event?.title}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700 text-xs">
                  <UserIcon className="w-4 h-4" />
                  <span>{booking.user?.firstName} {booking.user?.lastName}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700 text-xs font-semibold">
                  <CurrencyRupeeIcon className="w-4 h-4" />
                  <span>{formatPrice(booking.totalAmount)}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700 text-xs">
                  <QrCodeIcon className="w-4 h-4" />
                  <span>
                    Scan {booking.qrScanCount} / {booking.qrScanLimit}
                  </span>
                </div>
                <div className="flex justify-end space-x-3 mt-2">
                  <button
                    onClick={() => {
                      setSelectedBooking(booking);
                      setShowViewModal(true);
                    }}
                    className="text-primary-600 hover:text-primary-800"
                    aria-label="View Booking"
                  >
                    <EyeIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => downloadReceipt(booking._id)}
                    className="text-gray-600 hover:text-gray-800"
                    aria-label="Download Receipt"
                  >
                    <DocumentArrowDownIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Create Manual Booking Modal */}
      {showCreateModal && (
        <CreateManualBookingModal
          events={events}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateManualBooking}
        />
      )}

      {/* View Booking Modal */}
      {showViewModal && selectedBooking && (
        <ViewBookingModal
          booking={selectedBooking}
          onClose={() => {
            setShowViewModal(false);
            setSelectedBooking(null);
          }}
        />
      )}
    </div>
  );
};

const CreateManualBookingModal = ({ events, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    eventId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    seatCount: 1,
    bookingType: 'user',
    paymentMethod: 'cash',
    transactionId: '',
  });
  const [loading, setLoading] = useState(false);

  const selectedEvent = events.find(e => e._id === formData.eventId);

  const getPrice = () => {
    if (!selectedEvent) return 0;
    if (formData.bookingType === 'member') return selectedEvent.memberPrice || 0;
    if (formData.bookingType === 'guest') return selectedEvent.guestPrice || 0;
    return selectedEvent.userPrice || 0;
  };

  const getTotalAmount = () => getPrice() * formData.seatCount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ ...formData, totalAmount: getTotalAmount() });
    } catch {
      // Ignore for brevity
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-auto relative shadow-lg">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-red-600">
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h3 className="text-xl font-semibold mb-6">Create Manual Booking</h3>
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block mb-1 font-medium">Select Event *</label>
            <select
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
              value={formData.eventId}
              onChange={(e) => setFormData({...formData, eventId: e.target.value})}
            >
              <option value="">Select event</option>
              {events.map(e => (
                <option key={e._id} value={e._id}>{e.title}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input 
              required placeholder="First Name" 
              className="input-field" 
              value={formData.firstName} 
              onChange={e => setFormData({...formData, firstName: e.target.value})} />
            <input 
              required placeholder="Last Name" 
              className="input-field" 
              value={formData.lastName} 
              onChange={e => setFormData({...formData, lastName: e.target.value})} />
          </div>
          <input 
            required type="email" placeholder="Email" 
            className="input-field" 
            value={formData.email} 
            onChange={e => setFormData({...formData, email: e.target.value})} />
          <input 
            required type="tel" placeholder="Phone"
            className="input-field" 
            value={formData.phone} 
            onChange={e => setFormData({...formData, phone: e.target.value})} />
          <div className="grid grid-cols-2 gap-3">
            <select 
              className="input-field" 
              value={formData.bookingType} 
              onChange={e => setFormData({...formData, bookingType: e.target.value})}>
              <option value="user">User</option>
              <option value="member">Member</option>
              <option value="guest">Guest</option>
            </select>
            <input 
              type="number" min="1" max="20" 
              className="input-field" 
              value={formData.seatCount} 
              onChange={e => setFormData({...formData, seatCount: +e.target.value})} />
          </div>
          <div>
            <select 
              className="input-field" 
              value={formData.paymentMethod} 
              onChange={e => setFormData({...formData, paymentMethod: e.target.value})}>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
            </select>
          </div>
          {formData.paymentMethod === 'upi' && (
            <input 
              placeholder="Transaction ID" 
              className="input-field" 
              value={formData.transactionId} 
              onChange={e => setFormData({...formData, transactionId: e.target.value})} />
          )}
          {selectedEvent && (
            <div className="bg-gray-50 p-3 rounded mt-3 text-sm flex justify-between">
              <span>Unit Price ({formData.bookingType}): ₹{getPrice().toLocaleString()}</span>
              <span>Total: ₹{getTotalAmount().toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedEvent}
              className="px-6 py-2 bg-black text-white rounded hover:bg-gray-900 flex items-center gap-2"
            >
              {loading ? <LoadingSpinner size="small" /> : <PlusIcon className="w-5 h-5" />}
              Create Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ViewBookingModal = ({ booking, onClose }) => {
  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) : '-';
  const formatPrice = (price) => price ? new Intl.NumberFormat('en-IN').format(price) : '-';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white max-w-2xl w-full rounded-lg p-6 shadow-lg max-h-[90vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-red-600">
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
        <div className="space-y-6 text-sm">
          <section>
            <h3 className="font-semibold text-gray-900 mb-2">Basic Info</h3>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-gray-700">
              <dt>Booking ID:</dt><dd>{booking.bookingId}</dd>
              <dt>Status:</dt><dd>{booking.status}</dd>
              <dt>Payment Status:</dt><dd>{booking.paymentStatus}</dd>
              <dt>Seats:</dt><dd>{booking.seatCount}</dd>
              <dt>Booking Type:</dt><dd>{booking.bookingType}</dd>
              <dt>Booking Date:</dt><dd>{formatDate(booking.bookingDate)}</dd>
            </dl>
          </section>
          <section>
            <h3 className="font-semibold text-gray-900 mb-2">Event Info</h3>
            {booking.event ? (
              <dl className="text-gray-700 space-y-1">
                <dt className="font-medium">{booking.event.title}</dt>
                <dd>{booking.event.description || '-'}</dd>
                <dd>{formatDate(booking.event.startDate)}</dd>
                {booking.event.location && <dd>{booking.event.location}</dd>}
              </dl>
            ) : (
              <p className="text-gray-500">No event information</p>
            )}
          </section>
          <section>
            <h3 className="font-semibold text-gray-900 mb-2">Customer Info</h3>
            <dl className="text-gray-700 space-y-1">
              <dd>{booking.user?.firstName} {booking.user?.lastName}</dd>
              <dd>{booking.user?.email || '-'}</dd>
              <dd>{booking.user?.phone || '-'}</dd>
              <dd>Role: {booking.user?.role || '-'}</dd>
            </dl>
          </section>
          <section>
            <h3 className="font-semibold text-gray-900 mb-2">Payment</h3>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-gray-700">
              <dt>Unit Price:</dt><dd>₹{formatPrice(booking.unitPrice)}</dd>
              <dt>Total Amount:</dt><dd className="font-semibold">₹{formatPrice(booking.totalAmount)}</dd>
              <dt>Payment Method:</dt><dd>{booking.paymentMethod || '-'}</dd>
              {booking.paymentDetails?.transactionId && <>
                <dt>Transaction ID:</dt><dd>{booking.paymentDetails.transactionId}</dd>
              </>}
            </dl>
          </section>
          {booking.qrScans?.length > 0 && (
            <section>
              <h3 className="font-semibold text-gray-900 mb-2">QR Scan History</h3>
              <ul className="space-y-2 max-h-48 overflow-y-auto text-xs text-gray-700">
                {booking.qrScans.map((scan, idx) => (
                  <li key={idx} className="border border-gray-200 rounded px-3 py-2 flex justify-between">
                    <span>Scan #{idx + 1} on {formatDate(scan.scannedAt)}</span>
                    <span>{scan.location || '-'}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingsManagement;
