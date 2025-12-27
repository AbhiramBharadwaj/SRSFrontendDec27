import React, { useState, useEffect } from 'react';
import {
  UserIcon,
  ShieldCheckIcon,
  BellAlertIcon,
  ArrowRightOnRectangleIcon,
  CalendarDaysIcon,
  HeartIcon,
  ShoppingCartIcon,
  CogIcon,
  DocumentArrowDownIcon,
  QrCodeIcon,
  EllipsisVerticalIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useCartStore from '../../store/cartStore';

// axios client with token from localStorage
const apiClient = axios.create({
  baseURL: 'https://srs-backend-7ch1.onrender.com/api', // change to your backend URL
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

const ProfilePage = () => {
  const { user, setUser, logout, isAuthenticated, isLoading: authLoading } =
    useAuth();
  const { getTotalItems } = useCartStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile'); // main tabs: profile, security, preferences, bookings, favorites, cart
  const [loading, setLoading] = useState(true);

  // profile form
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
    },
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [changingPassword, setChangingPassword] = useState(false);

  // preferences
  const [preferences, setPreferences] = useState({
    eventCategories: [],
    notifications: {
      email: true,
      sms: true,
      push: true,
    },
  });
  const [savingPrefs, setSavingPrefs] = useState(false);

  // bookings / favorites
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // popup menu
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // init from auth
  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || !user) {
      toast.error('Please login to view your profile');
      navigate('/login', { replace: true });
      return;
    }

    const dob = user?.dateOfBirth
      ? new Date(user.dateOfBirth).toISOString().slice(0, 10)
      : '';

    setProfileForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || '',
      dateOfBirth: dob,
      gender: user.gender || '',
      address: {
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        country: user.address?.country || '',
        zipCode: user.address?.zipCode || '',
      },
    });

    setPreferences({
      eventCategories: user.preferences?.eventCategories || [],
      notifications: {
        email: user.preferences?.notifications?.email ?? true,
        sms: user.preferences?.notifications?.sms ?? true,
        push: user.preferences?.notifications?.push ?? true,
      },
    });

    setLoading(false);
  }, [authLoading, isAuthenticated, user, navigate]);

  // fetch bookings + favorites once user is ready
  useEffect(() => {
    const load = async () => {
      if (!isAuthenticated || !user) return;
      try {
        setLoadingData(true);
        const [bookingsRes, favRes] = await Promise.all([
          apiClient.get('/bookings/user'), // adjust path
          apiClient.get('/users/favorites'), // adjust path
        ]);
        setBookings(
          Array.isArray(bookingsRes.data.data) ? bookingsRes.data.data : []
        );
        setFavorites(
          Array.isArray(favRes.data.data) ? favRes.data.data : []
        );
      } catch (err) {
        toast.error('Failed to load bookings/favorites');
      } finally {
        setLoadingData(false);
      }
    };
    load();
  }, [isAuthenticated, user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-600">Loading profile…</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  const isMember = user.role === 'member' || user.membershipTier;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    if (s === 'confirmed') return 'bg-emerald-100 text-emerald-800';
    if (s === 'pending') return 'bg-amber-100 text-amber-800';
    if (s === 'cancelled') return 'bg-rose-100 text-rose-800';
    return 'bg-gray-100 text-gray-700';
  };

  // profile handlers
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const key = name.split('.')[1];
      setProfileForm((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [key]: value,
        },
      }));
    } else {
      setProfileForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const payload = {
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        phone: profileForm.phone,
        dateOfBirth: profileForm.dateOfBirth || null,
        gender: profileForm.gender || null,
        address: profileForm.address,
        preferences,
      };
      const res = await apiClient.put('/auth/profile', payload);
      const updatedUser = res.data.data.user;
      setUser && setUser(updatedUser);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Failed to update profile'
      );
    } finally {
      setSavingProfile(false);
    }
  };

  // password
  const handlePasswordInput = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    try {
      setChangingPassword(true);
      await apiClient.put('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Password changed successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Failed to change password'
      );
    } finally {
      setChangingPassword(false);
    }
  };

  // preferences
  const toggleNotification = (key) => {
    setPreferences((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    try {
      setSavingPrefs(true);
      const payload = { preferences };
      const res = await apiClient.put('/auth/profile', payload);
      const updatedUser = res.data.data.user;
      setUser && setUser(updatedUser);
      toast.success('Preferences updated');
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Failed to update preferences'
      );
    } finally {
      setSavingPrefs(false);
    }
  };

  // logout all
  const handleLogoutAll = async () => {
    try {
      await apiClient.post('/auth/logout-all');
    } catch (_) {
      // ignore backend error
    }
    localStorage.removeItem('token');
    logout();
    navigate('/login');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'security', label: 'Security', icon: ShieldCheckIcon },
    { id: 'preferences', label: 'Preferences', icon: BellAlertIcon },
    { id: 'bookings', label: 'Bookings', icon: CalendarDaysIcon },
    { id: 'favorites', label: 'Favorites', icon: HeartIcon },
    {
      id: 'cart',
      label: 'Cart',
      icon: ShoppingCartIcon,
      badge: getTotalItems(),
    },
  ];

  const downloadTicket = async (bookingId) => {
    try {
      const res = await apiClient.get(`/bookings/${bookingId}/ticket`, {
        responseType: 'blob',
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SRS-Ticket-${bookingId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Ticket downloaded');
    } catch (err) {
      toast.error('Download failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-10">
        {}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-semibold">
              Account
            </p>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
              Profile & Activity
            </h1>
          </div>
          <button
            onClick={() => setShowProfileMenu(true)}
            className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm"
          >
            <EllipsisVerticalIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {}
        <div className="bg-white border border-gray-200 rounded-3xl p-4 sm:p-5 md:p-6 shadow-sm mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white text-2xl sm:text-3xl font-black">
                  {(user.firstName?.[0] || '').toUpperCase()}
                  {(user.lastName?.[0] || '').toUpperCase()}
                </div>
                {isMember && (
                  <div className="absolute -bottom-1 -right-1 bg-amber-400 rounded-full p-1.5 shadow">
                    <StarIcon className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-[0.18em]">
                  Signed in as
                </p>
                <p className="text-sm sm:text-base font-semibold text-gray-900">
                  {user.fullName || `${user.firstName} ${user.lastName}`}
                </p>
                <p className="text-[11px] text-gray-500">{user.email}</p>
                <p className="text-[10px] text-gray-400 mt-1">
                  Joined {formatDate(user.createdAt)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
              <div className="rounded-2xl bg-sky-50 border border-sky-100 px-2.5 py-3">
                <p className="text-xs text-gray-500 mb-0.5">Tier</p>
                <p className="text-sm font-semibold text-sky-700">
                  {user.membershipTier || 'Standard'}
                </p>
              </div>
              <div className="rounded-2xl bg-emerald-50 border border-emerald-100 px-2.5 py-3">
                <p className="text-xs text-gray-500 mb-0.5">Points</p>
                <p className="text-sm font-semibold text-emerald-700">
                  {user.loyaltyPoints || 0}
                </p>
              </div>
              <div className="rounded-2xl bg-gray-50 border border-gray-200 px-2.5 py-3">
                <p className="text-xs text-gray-500 mb-0.5">Status</p>
                <p className="text-sm font-semibold text-gray-800">
                  {user.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 px-3 sm:px-5">
            <nav className="flex gap-3 sm:gap-4 overflow-x-auto py-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-2 sm:px-3 py-2 text-[11px] font-medium whitespace-nowrap rounded-2xl ${
                      active
                        ? 'bg-sky-100 text-gray-900'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {tab.badge ? (
                      <span className="ml-1 inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-gray-900 text-[10px] text-white">
                        {tab.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-4 sm:p-6 md:p-7">
            {}
            {activeTab === 'profile' && (
              <form
                onSubmit={handleSaveProfile}
                className="space-y-5 max-w-3xl"
              >
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">
                    Basic information
                  </h2>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Update your name, phone number and personal details.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-gray-600">
                      First name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={profileForm.firstName}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-gray-600">
                      Last name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={profileForm.lastName}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-gray-600">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-gray-600">
                      Date of birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={profileForm.dateOfBirth}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-gray-600">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={profileForm.gender}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <h3 className="text-[12px] font-semibold text-gray-900 mb-2">
                    Address
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-gray-600">
                        Street
                      </label>
                      <input
                        type="text"
                        name="address.street"
                        value={profileForm.address.street}
                        onChange={handleProfileChange}
                        className="w-full px-3 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-gray-600">
                        City
                      </label>
                      <input
                        type="text"
                        name="address.city"
                        value={profileForm.address.city}
                        onChange={handleProfileChange}
                        className="w-full px-3 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-gray-600">
                        State
                      </label>
                      <input
                        type="text"
                        name="address.state"
                        value={profileForm.address.state}
                        onChange={handleProfileChange}
                        className="w-full px-3 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-gray-600">
                        Country
                      </label>
                      <input
                        type="text"
                        name="address.country"
                        value={profileForm.address.country}
                        onChange={handleProfileChange}
                        className="w-full px-3 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[11px] font-medium text-gray-600">
                        ZIP / Postal code
                      </label>
                      <input
                        type="text"
                        name="address.zipCode"
                        value={profileForm.address.zipCode}
                        onChange={handleProfileChange}
                        className="w-full px-3 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="inline-flex items-center px-4 py-2.5 rounded-2xl bg-gray-900 text-[11px] font-semibold text-white hover:bg-sky-400 disabled:opacity-60"
                  >
                    {savingProfile ? 'Saving…' : 'Save profile'}
                  </button>
                </div>
              </form>
            )}

            {}
            {activeTab === 'security' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl">
                <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4 space-y-3">
                  <h2 className="text-sm font-semibold text-gray-900">
                    Change password
                  </h2>
                  <p className="text-[11px] text-gray-500">
                    Use a strong password that you do not use elsewhere.
                  </p>
                  <form
                    onSubmit={handleChangePassword}
                    className="space-y-3"
                  >
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-gray-600">
                        Current password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordInput}
                        className="w-full px-3 py-2.5 rounded-2xl bg-white border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-gray-600">
                        New password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordInput}
                        className="w-full px-3 py-2.5 rounded-2xl bg-white border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-gray-600">
                        Confirm new password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordInput}
                        className="w-full px-3 py-2.5 rounded-2xl bg-white border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>
                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        disabled={changingPassword}
                        className="px-4 py-2.5 rounded-2xl bg-gray-900 text-[11px] font-semibold text-white hover:bg-sky-400 disabled:opacity-60"
                      >
                        {changingPassword ? 'Updating…' : 'Update password'}
                      </button>
                    </div>
                  </form>
                </div>

                <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4 space-y-3">
                  <h2 className="text-sm font-semibold text-gray-900">
                    Active sessions
                  </h2>
                  <p className="text-[11px] text-gray-500">
                    If you think someone else has access, log out from all
                    devices.
                  </p>
                  <button
                    onClick={handleLogoutAll}
                    className="mt-2 inline-flex items-center px-3 py-2 rounded-2xl text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100"
                  >
                    Logout from all devices
                  </button>
                </div>
              </div>
            )}

            {}
            {activeTab === 'preferences' && (
              <form
                onSubmit={handleSavePreferences}
                className="space-y-5 max-w-3xl"
              >
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">
                    Notifications
                  </h2>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Choose how you want to receive updates about your events.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4 space-y-3">
                  {['email', 'sms', 'push'].map((key) => (
                    <label
                      key={key}
                      className="flex items-center justify-between gap-3 py-2"
                    >
                      <div>
                        <p className="text-[12px] font-medium text-gray-900 capitalize">
                          {key} notifications
                        </p>
                        <p className="text-[11px] text-gray-500">
                          {key === 'email' &&
                            'Booking confirmations, reminders and offers.'}
                          {key === 'sms' &&
                            'Important alerts like cancellations or changes.'}
                          {key === 'push' &&
                            'Updates when you are actively using the app.'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleNotification(key)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full border transition ${
                          preferences.notifications[key]
                            ? 'bg-gray-900 border-sky-500'
                            : 'bg-gray-200 border-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                            preferences.notifications[key]
                              ? 'translate-x-4'
                              : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </label>
                  ))}
                </div>

                <div>
                  <h3 className="text-[12px] font-semibold text-gray-900 mb-2">
                    Event interests
                  </h3>
                  <p className="text-[11px] text-gray-500 mb-2">
                    Select categories to personalise recommendations.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Music', 'Sports', 'Workshops', 'Comedy', 'Business'].map(
                      (cat) => {
                        const selected =
                          preferences.eventCategories.includes(cat);
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() =>
                              setPreferences((prev) => {
                                const exists =
                                  prev.eventCategories.includes(cat);
                                return {
                                  ...prev,
                                  eventCategories: exists
                                    ? prev.eventCategories.filter(
                                        (c) => c !== cat
                                      )
                                    : [...prev.eventCategories, cat],
                                };
                              })
                            }
                            className={`px-3 py-1.5 rounded-2xl text-[11px] border ${
                              selected
                                ? 'bg-gray-900 text-white border-sky-500'
                                : 'bg-white text-gray-700 border-gray-200'
                            }`}
                          >
                            {cat}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={savingPrefs}
                    className="inline-flex items-center px-4 py-2.5 rounded-2xl bg-gray-900 text-[11px] font-semibold text-white hover:bg-sky-400 disabled:opacity-60"
                  >
                    {savingPrefs ? 'Saving…' : 'Save preferences'}
                  </button>
                </div>
              </form>
            )}

            {}
            {activeTab === 'bookings' && (
              <div className="space-y-4">
                {loadingData && (
                  <p className="text-xs text-gray-500">Loading bookings…</p>
                )}
                {!loadingData && bookings.length === 0 && (
                  <div className="text-center py-10">
                    <CalendarDaysIcon className="w-14 h-14 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                      No bookings yet
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">
                      Explore events and book your first ticket.
                    </p>
                    <Link
                      to="/events"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gray-900 text-[11px] font-semibold text-white hover:bg-sky-400"
                    >
                      Browse events
                    </Link>
                  </div>
                )}
                {!loadingData &&
                  bookings.length > 0 &&
                  bookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="border border-gray-200 rounded-2xl bg-gray-50 p-4 hover:border-sky-400 transition"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4">
                        <div className="space-y-1.5">
                          <h3 className="text-sm font-semibold text-gray-900">
                            {booking.event?.title || 'Event Removed'}
                          </h3>
                          <p className="text-[11px] text-gray-500">
                            Booking ID:{' '}
                            <span className="font-mono text-gray-800">
                              {booking.bookingId}
                            </span>
                          </p>
                          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[11px] text-gray-700">
                            <p>
                              <span className="text-gray-500">Date</span>:{' '}
                              {formatDate(booking.event?.startDate)}
                            </p>
                            <p>
                              <span className="text-gray-500">Location</span>:{' '}
                              {booking.event?.location || 'N/A'}
                            </p>
                            <p>
                              <span className="text-gray-500">Tickets</span>:{' '}
                              {booking.seatCount} × ₹{booking.unitPrice}
                            </p>
                            <p>
                              <span className="text-gray-500">Total</span>:{' '}
                              ₹{booking.totalAmount?.toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide ${getStatusBadge(
                              booking.status
                            )}`}
                          >
                            {booking.status}
                          </span>
                          <Link
                                // onClick={() => downloadTicket(booking._id)}
                                to={`/booking/${booking._id}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border border-gray-200 text-[11px] text-gray-800 hover:bg-gray-100"
                              >
                                <DocumentArrowDownIcon className="w-3.5 h-3.5" />
                                <span>View</span>
                              </Link>
                          {booking.status === 'confirmed' && (
                            <div className="flex flex-wrap justify-end gap-2">
                              
                              <Link
                                to={`/events/${booking.event?._id}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gray-900 text-[11px] text-white hover:bg-sky-400"
                              >
                                <QrCodeIcon className="w-3.5 h-3.5" />
                                <span>View QR</span>
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {}
            {activeTab === 'favorites' && (
              <div>
                {loadingData && (
                  <p className="text-xs text-gray-500">Loading favorites…</p>
                )}
                {!loadingData && favorites.length === 0 && (
                  <div className="text-center py-10">
                    <HeartIcon className="w-14 h-14 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                      No favorites yet
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">
                      Save events you love for quick access.
                    </p>
                    <Link
                      to="/events"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gray-900 text-[11px] font-semibold text-white hover:bg-sky-400"
                    >
                      Explore events
                    </Link>
                  </div>
                )}
                {!loadingData && favorites.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favorites.map((event) => (
                      <Link
                        key={event._id}
                        to={`/events/${event._id}`}
                        className="block border border-gray-200 rounded-2xl overflow-hidden bg-white hover:border-sky-400 transition"
                      >
                        <img
                          src={event.bannerImage || '/placeholder-event.jpg'}
                          alt={event.title}
                          className="w-full h-40 object-cover"
                        />
                        <div className="p-3">
                          <h3 className="text-xs font-semibold text-gray-900 mb-0.5 line-clamp-2">
                            {event.title}
                          </h3>
                          <p className="text-[11px] text-gray-500">
                            {formatDate(event.startDate)}
                          </p>
                          <p className="text-[11px] text-gray-500 line-clamp-1">
                            {event.location}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {}
            {activeTab === 'cart' && (
              <div className="text-center py-10">
                <ShoppingCartIcon className="w-14 h-14 text-gray-300 mx-auto mb-4" />
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  {getTotalItems()} item
                  {getTotalItems() !== 1 ? 's' : ''} in cart
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  Review and complete your booking.
                </p>
                <Link
                  to="/cart"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gray-900 text-[11px] font-semibold text-white hover:bg-sky-400"
                >
                  Go to cart
                  <ArrowRightOnRectangleIcon className="w-3.5 h-3.5 rotate-180" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {}
      {showProfileMenu && (
        <div
          className="fixed  mb-16 inset-0 z-40 flex items-end justify-center md:items-center bg-black/30"
          onClick={() => setShowProfileMenu(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-t-3xl md:rounded-3xl border border-gray-200 p-4 md:p-5 mb-0 md:mb-0 md:mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-800">
                Quick actions
              </p>
              <button
                onClick={() => setShowProfileMenu(false)}
                className="text-[11px] text-gray-500 hover:text-gray-800"
              >
                Close
              </button>
            </div>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  setActiveTab('profile');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-2xl hover:bg-gray-50 text-xs text-gray-800"
              >
                <CogIcon className="w-4 h-4" />
                <span>Edit profile & settings</span>
              </button>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  setActiveTab('bookings');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-2xl hover:bg-gray-50 text-xs text-gray-800"
              >
                <CalendarDaysIcon className="w-4 h-4" />
                <span>My bookings</span>
              </button>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  handleLogoutAll();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-2xl hover:bg-rose-50 text-xs text-rose-600"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                <span>Logout all devices</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
