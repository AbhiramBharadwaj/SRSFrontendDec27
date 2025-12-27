// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { useAuth } from './context/AuthContext';

import ResponsiveLayout from './components/Layout/ResponsiveLayout';
import AdminLayout from './components/Layout/AdminLayout';

import Home from './pages/user/Home/sections/Home';
import About from './pages/user/About/About';
import Contact from './pages/user/Contact/Contact';
import Privacy from './pages/user/Privacy/Privacy';
import Sitemap from './pages/user/Sitemap/Sitemap';
import FAQ from './pages/user/FAQ/FAQ';

import EventsPage from './pages/user/EventsPage';
import EventDetailPage from './pages/user/EventDetailPage';
import ProfilePage from './pages/user/ProfilePage';
import FavoritesPage from './pages/user/FavoritesPage';
import CartPage from './pages/user/CartPage';
import CheckoutPage from './pages/user/CheckoutPage';
import BookingSuccessPage from './pages/user/BookingSuccessPage';

import AuthPage from './pages/auth/AuthPages';
// w
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersManagement from './pages/admin/UsersManagement';
import MembersManagement from './pages/admin/MembersManagement';
import EventsManagement from './pages/admin/EventsManagement';
import BookingsManagement from './pages/admin/BookingsManagement';
import AdminProfile from './pages/admin/AdminProfile';
import BookingDetailPage from './pages/user/BookingDetailPage';
import QrScanPage from './pages/admin/QrScanPage';
import GuestBookingPage from './pages/guest/GuestBookingPage';
import MemberDashboard from './pages/member/MemberDashboard';
import SearchBooking from './pages/guest/SearchBooking';
import OfflineCreatePage from './pages/admin/OfflineCreatePage';
import OfflineListPage from './pages/admin/OfflineListPage';
import EventCheckInPage from './pages/admin/EventCheckInPage';
import Test from './pages/member/Test';
import TicketViewPage from './pages/admin/TicketViewPage';

// Protected Route (Only for logged-in users)
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const {isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-700">Loading SRS Events...</p>
        </div>
      </div>
    );
  }

  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Public Layout Wrapper
const PublicLayout = () => (
  <ResponsiveLayout>
    <Outlet />
  </ResponsiveLayout>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
};
const App = () => {
  return (
    <Router>
      <Toaster position="top-right" />
      <ScrollToTop/>

      <Routes>

        {}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="/faqs" element={<FAQ />} />
           <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/guest/book/:id" element={<GuestBookingPage />} />
          <Route path="/search" element={<SearchBooking />} />
          <Route path="/search/:id" element={<SearchBooking />} />
          <Route path="/test" element={<Test />} />
          <Route path="/ticket" element={<TicketViewPage />} />
        </Route>
{/* q */}
        {}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />

        {}
        <Route element={<ProtectedRoute><ResponsiveLayout><Outlet /></ResponsiveLayout></ProtectedRoute>}>
         
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/booking-success" element={<BookingSuccessPage />} />
          <Route path="/booking/:id" element={<BookingDetailPage />} />
          <Route path="/member/requests" element={<MemberDashboard />} />

        </Route>

        {}
        <Route element={<ProtectedRoute adminOnly><AdminLayout><Outlet /></AdminLayout></ProtectedRoute>}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UsersManagement />} />
          <Route path="/admin/members" element={<MembersManagement />} />
          <Route path="/admin/events" element={<EventsManagement />} />
          <Route path="/admin/bookings" element={<BookingsManagement />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/offline-booking/create" element={<OfflineCreatePage />} />
          <Route path="/admin/offline-bookings" element={<OfflineListPage />} />
          <Route path="/admin/events/:id/checkin" element={<EventCheckInPage />} />
          <Route path="admin/scan" element={<QrScanPage />} />

        </Route>

        {}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
};

export default App;
