import React, { useState, useEffect } from 'react';

import { UsersIcon, CalendarDaysIcon, TicketIcon, CurrencyRupeeIcon, QrCodeIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

import { adminService } from '../../services/adminService';
import { bookingService } from '../../services/bookingService';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revenuePeriod, setRevenuePeriod] = useState('7d');
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [pendingScans, setPendingScans] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [pendingError, setPendingError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchRevenueData();
  }, [revenuePeriod]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRevenueData = async () => {
    try {
      const response = await adminService.getRevenueChart(revenuePeriod);
      setRevenueData(response.data);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    }
  };

  const normalizeBookings = (response) => {
    if (!response) return [];
    if (Array.isArray(response.data)) return response.data;
    if (Array.isArray(response?.data?.data)) return response.data.data;
    if (Array.isArray(response)) return response;
    return [];
  };

  const normalizeUsers = (response) => {
    if (!response) return [];
    if (Array.isArray(response.data)) return response.data;
    if (Array.isArray(response?.data?.data)) return response.data.data;
    if (Array.isArray(response)) return response;
    return [];
  };

  const loadPendingScans = async () => {
    try {
      setPendingLoading(true);
      setPendingError('');
      const response = await bookingService.getUserBookings();
      const bookings = normalizeBookings(response);
      const userIds = bookings
        .map((booking) => booking?.user)
        .filter((user) => typeof user === 'string');
      let usersById = {};
      if (userIds.length) {
        try {
          const usersResponse = await adminService.getAllUsers({ page: 1, limit: 2000 });
          const users = normalizeUsers(usersResponse);
          usersById = users.reduce((acc, user) => {
            if (user?._id) acc[user._id] = user;
            return acc;
          }, {});
        } catch (err) {
          console.warn('Unable to load user details for pending scans:', err);
        }
      }
      const getMemberName = (booking) => {
        if (booking?.memberName) return booking.memberName;
        const user =
          (typeof booking?.user === 'string' ? usersById[booking.user] : booking?.user) ||
          booking?.member ||
          {};
        const first = user.firstName || user.first || '';
        const last = user.lastName || user.last || '';
        const full = `${first} ${last}`.trim();
        if (full) return full;
        if (user.name) return user.name;
        if (booking?.customerName) return booking.customerName;
        return 'Member';
      };

      const getTicketCount = (booking) => {
        if (booking?.qrScanLimit != null) return booking.qrScanLimit;
        if (booking?.totalTickets != null) return booking.totalTickets;
        if (booking?.ticketsCount != null) return booking.ticketsCount;
        if (booking?.totalGuests != null) return booking.totalGuests;
        if (booking?.quantity != null) return booking.quantity;
        const memberCount = booking?.memberTicketCount ?? 0;
        const guestCount = booking?.guestTicketCount ?? 0;
        const kidCount = booking?.kidTicketCount ?? 0;
        const attendeeCount = Array.isArray(booking?.attendeeNameJson)
          ? booking.attendeeNameJson.length
          : 0;
        return Math.max(memberCount + guestCount + kidCount, attendeeCount);
      };

      const pending = bookings
        .filter((booking) => {
          const limit = getTicketCount(booking);
          const scanned = booking?.qrScanCount ?? booking?.scannedCount ?? 0;
          return limit > scanned;
        })
        .map((booking) => ({
          id: booking._id,
          bookingId: booking.bookingId,
          eventTitle: booking.event?.title || booking.eventName || 'Event',
          memberName: getMemberName(booking),
          totalTickets: getTicketCount(booking),
          scanned: booking?.qrScanCount ?? booking?.scannedCount ?? 0,
          remaining: Math.max(
            0,
            getTicketCount(booking) - (booking?.qrScanCount ?? booking?.scannedCount ?? 0)
          ),
          contactNumber: booking?.contactNumber || '',
          bookingType: booking?.bookingType || '',
          bookingDate: booking?.bookingDate || booking?.createdAt || '',
          createdAt: booking?.createdAt || '',
          finalAmount: booking?.finalAmount ?? booking?.totalAmount ?? 0,
          grossAmount: booking?.grossAmount ?? 0,
          discountAmount: booking?.discountAmount ?? 0,
          discountCode: booking?.discountCode || '',
          guestTicketCount: booking?.guestTicketCount ?? 0,
          memberTicketCount: booking?.memberTicketCount ?? 0,
          kidTicketCount: booking?.kidTicketCount ?? 0,
          guestVegCount: booking?.guestVegCount ?? 0,
          guestNonVegCount: booking?.guestNonVegCount ?? 0,
          memberVegCount: booking?.memberVegCount ?? 0,
          memberNonVegCount: booking?.memberNonVegCount ?? 0,
          kidVegCount: booking?.kidVegCount ?? 0,
          kidNonVegCount: booking?.kidNonVegCount ?? 0,
          attendeeNames: Array.isArray(booking?.attendeeNameJson)
            ? booking.attendeeNameJson.map((attendee) => attendee?.name).filter(Boolean)
            : [],
          eventStartDate: booking?.event?.startDate || '',
          eventEndDate: booking?.event?.endDate || '',
          eventLocation: booking?.event?.location || '',
          eventGuestPrice: booking?.event?.guestPrice ?? '',
          eventMemberPrice: booking?.event?.memberPrice ?? '',
          eventUserPrice: booking?.event?.userPrice ?? '',
          eventMaxCapacity: booking?.event?.maxCapacity ?? '',
        }));
      setPendingScans(pending);
    } catch (error) {
      console.error('Error fetching pending scans:', error);
      setPendingError('Failed to load pending scans');
    } finally {
      setPendingLoading(false);
    }
  };

  const openPendingModal = async () => {
    setShowPendingModal(true);
    await loadPendingScans();
  };

  const exportPendingCsv = () => {
    if (!pendingScans.length) return;
    const headers = [
      'Booking ID',
      'Member Name',
      'Contact Number',
      'Booking Type',
      'Booking Date',
      'Created At',
      'Event',
      'Event Location',
      'Event Start',
      'Event End',
      'Tickets',
      'Scanned',
      'Pending',
      'Member Tickets',
      'Guest Tickets',
      'Kid Tickets',
      'Member Veg',
      'Member Non-Veg',
      'Guest Veg',
      'Guest Non-Veg',
      'Kid Veg',
      'Kid Non-Veg',
      'Gross Amount',
      'Discount Amount',
      'Discount Code',
      'Final Amount',
      'Attendee Names',
      'Event Member Price',
      'Event Guest Price',
      'Event User Price',
      'Event Max Capacity',
    ];
    const rows = pendingScans.map((item) => [
      item.bookingId,
      item.memberName,
      item.contactNumber,
      item.bookingType,
      item.bookingDate,
      item.createdAt,
      item.eventTitle,
      item.eventLocation,
      item.eventStartDate,
      item.eventEndDate,
      item.totalTickets,
      item.scanned,
      item.remaining,
      item.memberTicketCount,
      item.guestTicketCount,
      item.kidTicketCount,
      item.memberVegCount,
      item.memberNonVegCount,
      item.guestVegCount,
      item.guestNonVegCount,
      item.kidVegCount,
      item.kidNonVegCount,
      item.grossAmount,
      item.discountAmount,
      item.discountCode,
      item.finalAmount,
      item.attendeeNames.join(' | '),
      item.eventMemberPrice,
      item.eventGuestPrice,
      item.eventUserPrice,
      item.eventMaxCapacity,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pending-qr-scans-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });
  };

  const formatDateTime = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }


const statCards = [
  {
    title: 'Total Users',
    value: stats?.stats.totalUsers || 0,
    icon: UsersIcon,
    color: 'bg-blue-500',
    change: '+12%',
  },
  {
    title: 'Total Members',
    value: stats?.stats.totalMembers || 0,
    icon: UsersIcon,
    color: 'bg-green-500',
    change: '+8%',
  },
  {
    title: 'Active Events',
    value: stats?.stats.totalEvents || 0,
    icon: CalendarDaysIcon,
    color: 'bg-purple-500',
    change: '+15%',
  },
  {
    title: 'Total Bookings',
    value: stats?.stats.totalBookings || 0,
    subtitle: `${stats?.stats.totalTicketsBooked || 0} Tickets Booked`,
    icon: TicketIcon,
    color: 'bg-orange-500',
    change: '+23%',
  },
  {
    title: 'Total Revenue',
    value: formatCurrency(stats?.stats.totalRevenue || 0),
    subtitle: `Collected: ${formatCurrency(stats?.stats.amountCollected || 0)}`,
    icon: CurrencyRupeeIcon,
    color: 'bg-emerald-500',
    change: '+18%',
  },
  {
    title: 'Meal Preferences',
    value: `${stats?.stats.mealSummary?.veg || 0} Veg`,
    subtitle: `${stats?.stats.mealSummary?.nonVeg || 0} Non-Veg`,
    icon: () => (
      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
        <span className="text-orange-600 font-bold text-lg">M</span>
      </div>
    ),
    color: 'bg-orange-500',
  },
  // NEW: QR Scan Progress Card
  {
    title: 'QR Scan Status',
    icon: QrCodeIcon,
    color: 'bg-indigo-500',
    custom: true, // We'll render this differently
  },
];

  return (
    <div className="space-y-8">
      {}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your events platform.</p>
      </div>

      {}
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {statCards.map((stat, index) => {
    // Special handling for QR Scan Status card
    if (stat.custom) {
      const totalTickets = stats?.stats.totalTicketsBooked || 0;
      const scanned = stats?.stats.totalTicketsScanned || 0;
      const remaining = Math.max(0, totalTickets - scanned);
      const progress = totalTickets > 0 ? (scanned / totalTickets) * 100 : 0;

      return (
        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                QR Scan Status
              </p>
            </div>
            <div className="p-3 rounded-full bg-indigo-500">
              <QrCodeIcon className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Progress Circle */}
          <div className="flex flex-col items-center my-6">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#6366f1"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
          </div>

          {/* Stats below circle */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-indigo-600">{scanned}</p>
              <p className="text-xs text-gray-500 mt-1">Scanned</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalTickets}</p>
              <p className="text-xs text-gray-500 mt-1">Total</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">{remaining}</p>
              <p className="text-xs text-gray-500 mt-1">Pending</p>
            </div>
          </div>

          <button
            onClick={openPendingModal}
            className="mt-5 w-full text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border border-indigo-200 rounded-lg py-2 transition"
          >
            View pending members
          </button>
        </div>
      );
    }

    // Regular stat cards
    return (
      <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-3">
              {stat.value}
            </p>
            {stat.subtitle && (
              <p className="text-sm text-gray-500 mt-2">{stat.subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-full ${stat.color}`}>
            {typeof stat.icon === 'function' ? (
              <stat.icon />
            ) : (
              <stat.icon className="w-7 h-7 text-white" />
            )}
          </div>
        </div>


        {stat.change && (
          <div className="flex items-center mt-5">
            <CheckCircleIcon className="w-5 h-5 text-green-500 mr-1" />
            <span className="text-sm font-semibold text-green-600">{stat.change}</span>
            <span className="text-sm text-gray-500 ml-1">vs last month</span>
          </div>
        )}
      </div>
    );
  })}
</div>

      {}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
          <select
            value={revenuePeriod}
            onChange={(e) => setRevenuePeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="12m">Last 12 months</option>
          </select>
        </div>
        
        {revenueData.length > 0 ? (
          <div className="h-64 flex items-end space-x-2">
            {revenueData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-primary-500 rounded-t"
                  style={{
                    height: `${(data.revenue / Math.max(...revenueData.map(d => d.revenue))) * 200}px`,
                    minHeight: '4px',
                  }}
                />
                <div className="text-xs text-gray-600 mt-2 text-center">
                  <div>{formatDate(data._id)}</div>
                  <div className="font-medium">{formatCurrency(data.revenue)}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            No revenue data available
          </div>
        )}
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Users</h3>
          <div className="space-y-4">
            {stats?.recentUsers?.map((user) => (
              <div key={user._id} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-700 font-semibold text-sm">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user.role === 'member' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h3>
          <div className="space-y-4">
            {stats?.recentBookings?.map((booking) => (
              <div key={booking._id} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center">
                  <TicketIcon className="w-5 h-5 text-secondary-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {booking.event?.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    by {booking.user?.firstName} {booking.user?.lastName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    ₹{booking.totalAmount}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showPendingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-black/50">
          <div className="absolute inset-0" onClick={() => setShowPendingModal(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-gray-200 max-h-[85vh] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900">Pending QR Scans</h3>
                <p className="text-xs text-gray-500 mt-0.5">Members with remaining entries to scan</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={exportPendingCsv}
                  disabled={!pendingScans.length}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Export CSV
                </button>
                <button
                  onClick={() => setShowPendingModal(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100"
                  aria-label="Close pending scans"
                >
                  <XMarkIcon className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="px-5 py-4 overflow-y-auto max-h-[70vh]">
              {pendingLoading ? (
                <div className="py-12 flex justify-center">
                  <LoadingSpinner size="large" />
                </div>
              ) : pendingError ? (
                <div className="text-sm text-red-600">{pendingError}</div>
              ) : pendingScans.length === 0 ? (
                <div className="text-sm text-gray-600">No pending scans found.</div>
              ) : (
                <div className="space-y-3">
                  {pendingScans.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{item.memberName}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {item.eventTitle} · ID {item.bookingId}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {item.contactNumber ? `Contact: ${item.contactNumber}` : 'Contact: -'}
                            {item.bookingType ? ` · ${item.bookingType}` : ''}
                          </p>
                        </div>
                        <div className="text-xs sm:text-sm font-semibold text-orange-600">
                          {item.remaining} pending
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-gray-600">
                        <div className="bg-gray-50 rounded-md px-2 py-1">
                          Tickets: <span className="font-semibold text-gray-800">{item.totalTickets}</span>
                        </div>
                        <div className="bg-gray-50 rounded-md px-2 py-1">
                          Scanned: <span className="font-semibold text-gray-800">{item.scanned}</span>
                        </div>
                        <div className="bg-orange-50 rounded-md px-2 py-1">
                          Pending: <span className="font-semibold text-orange-600">{item.remaining}</span>
                        </div>
                      </div>
                      <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-gray-600">
                        <div className="bg-gray-50 rounded-md px-2 py-1">
                          Member: <span className="font-semibold text-gray-800">{item.memberTicketCount}</span>
                        </div>
                        <div className="bg-gray-50 rounded-md px-2 py-1">
                          Guest: <span className="font-semibold text-gray-800">{item.guestTicketCount}</span>
                        </div>
                        <div className="bg-gray-50 rounded-md px-2 py-1">
                          Kid: <span className="font-semibold text-gray-800">{item.kidTicketCount}</span>
                        </div>
                      </div>
                      <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-gray-600">
                        <div className="bg-gray-50 rounded-md px-2 py-1">
                          Mem Veg: <span className="font-semibold text-gray-800">{item.memberVegCount}</span>
                        </div>
                        <div className="bg-gray-50 rounded-md px-2 py-1">
                          Mem NV: <span className="font-semibold text-gray-800">{item.memberNonVegCount}</span>
                        </div>
                        <div className="bg-gray-50 rounded-md px-2 py-1">
                          Guest Veg: <span className="font-semibold text-gray-800">{item.guestVegCount}</span>
                        </div>
                        <div className="bg-gray-50 rounded-md px-2 py-1">
                          Guest NV: <span className="font-semibold text-gray-800">{item.guestNonVegCount}</span>
                        </div>
                        <div className="bg-gray-50 rounded-md px-2 py-1">
                          Kid Veg: <span className="font-semibold text-gray-800">{item.kidVegCount}</span>
                        </div>
                        <div className="bg-gray-50 rounded-md px-2 py-1">
                          Kid NV: <span className="font-semibold text-gray-800">{item.kidNonVegCount}</span>
                        </div>
                      </div>
                      <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-gray-600">
                        <div className="bg-gray-50 rounded-md px-2 py-1">
                          Gross: <span className="font-semibold text-gray-800">₹{item.grossAmount}</span>
                        </div>
                        <div className="bg-gray-50 rounded-md px-2 py-1">
                          Discount: <span className="font-semibold text-gray-800">₹{item.discountAmount}</span>
                        </div>
                        <div className="bg-gray-50 rounded-md px-2 py-1">
                          Final: <span className="font-semibold text-gray-800">₹{item.finalAmount}</span>
                        </div>
                        <div className="bg-gray-50 rounded-md px-2 py-1">
                          Code: <span className="font-semibold text-gray-800">{item.discountCode || '-'}</span>
                        </div>
                      </div>
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                        <div className="bg-gray-50 rounded-md px-2 py-1">
                          Booking Date: <span className="font-semibold text-gray-800">{formatDateTime(item.bookingDate)}</span>
                        </div>
                        <div className="bg-gray-50 rounded-md px-2 py-1">
                          Created At: <span className="font-semibold text-gray-800">{formatDateTime(item.createdAt)}</span>
                        </div>
                        <div className="bg-gray-50 rounded-md px-2 py-1">
                          Event Start: <span className="font-semibold text-gray-800">{formatDateTime(item.eventStartDate)}</span>
                        </div>
                        <div className="bg-gray-50 rounded-md px-2 py-1">
                          Event End: <span className="font-semibold text-gray-800">{formatDateTime(item.eventEndDate)}</span>
                        </div>
                        <div className="bg-gray-50 rounded-md px-2 py-1">
                          Location: <span className="font-semibold text-gray-800">{item.eventLocation || '-'}</span>
                        </div>
                        <div className="bg-gray-50 rounded-md px-2 py-1">
                          Capacity: <span className="font-semibold text-gray-800">{item.eventMaxCapacity || '-'}</span>
                        </div>
                      </div>
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-600">
                        <div className="bg-gray-50 rounded-md px-2 py-1">
                          Member Price: <span className="font-semibold text-gray-800">₹{item.eventMemberPrice || '-'}</span>
                        </div>
                        <div className="bg-gray-50 rounded-md px-2 py-1">
                          Guest Price: <span className="font-semibold text-gray-800">₹{item.eventGuestPrice || '-'}</span>
                        </div>
                        <div className="bg-gray-50 rounded-md px-2 py-1">
                          User Price: <span className="font-semibold text-gray-800">₹{item.eventUserPrice || '-'}</span>
                        </div>
                      </div>
                      {item.attendeeNames.length > 0 && (
                        <div className="mt-2 text-xs text-gray-600">
                          Attendees: <span className="font-semibold text-gray-800">{item.attendeeNames.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
