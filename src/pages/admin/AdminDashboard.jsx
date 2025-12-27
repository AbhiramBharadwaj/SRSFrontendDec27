import React, { useState, useEffect } from 'react';

 import { UsersIcon, CalendarDaysIcon, TicketIcon, CurrencyRupeeIcon, QrCodeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

import { adminService } from '../../services/adminService';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revenuePeriod, setRevenuePeriod] = useState('7d');

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
    </div>
  );
};

export default AdminDashboard;
