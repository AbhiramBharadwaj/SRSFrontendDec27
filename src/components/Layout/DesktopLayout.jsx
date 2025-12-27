import React, { useState } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  CalendarDaysIcon,
  HeartIcon,
  UserIcon,
  ShoppingCartIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  UsersIcon,
  StarIcon,
  TicketIcon,
} from '@heroicons/react/24/outline';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';

const DesktopLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isAdmin } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const cartItems = getTotalItems();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebarItems = [
    {
      name: 'Home',
      href: '/',
      icon: HomeIcon,
    },
    {
      name: 'Events',
      href: '/events',
      icon: CalendarDaysIcon,
    },
    {
      name: 'Favorites',
      href: '/favorites',
      icon: HeartIcon,
      requireAuth: true,
    },
    {
      name: 'Cart',
      href: '/cart',
      icon: ShoppingCartIcon,
      badge: cartItems > 0 ? cartItems : null,
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: UserIcon,
      requireAuth: true,
    },
  ];
  
  const adminItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: ChartBarIcon,
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: UsersIcon,
    },
    {
      name: 'Members',
      href: '/admin/members',
      icon: StarIcon,
    },
    {
      name: 'Events',
      href: '/admin/events',
      icon: CalendarDaysIcon,
    },
    {
      name: 'Bookings',
      href: '/admin/bookings',
      icon: TicketIcon,
    },
  ];

  const isActive = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-white shadow-lg`}>
        <div className="flex flex-col h-full">
          {}
          <div className="p-6 border-b border-gray-200">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              {sidebarOpen && (
                <span className="text-xl font-bold text-gray-900">SRS Events</span>
              )}
            </Link>
          </div>

          {}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => {
                if (item.requireAuth && !isAuthenticated) return null;
                
                const active = isActive(item.href);
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                        active
                          ? 'bg-primary-50 text-primary-700 border-r-4 border-primary-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {sidebarOpen && (
                        <>
                          <span className="ml-3 font-medium">{item.name}</span>
                          {item.badge && (
                            <span className="ml-auto bg-primary-500 text-white text-xs rounded-full px-2 py-1">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  </li>
                );
              })}
              
              {}
              {isAuthenticated && isAdmin() && (
                <>
                  {sidebarOpen && (
                    <li className="pt-4">
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Administration
                      </div>
                    </li>
                  )}
                  {adminItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                            active
                              ? 'bg-primary-50 text-primary-700 border-r-4 border-primary-700'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                          {sidebarOpen && (
                            <span className="ml-3 font-medium">{item.name}</span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </>
              )}
            </ul>
          </nav>

          {}
          {isAuthenticated && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-700 font-semibold">
                    {user?.firstName?.charAt(0) || 'U'}
                  </span>
                </div>
                {sidebarOpen && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.role === 'admin' ? 'Administrator' : user?.email}
                    </p>
                  </div>
                )}
              </div>
              {sidebarOpen && (
                <div className="space-y-1">
                  {isAdmin() ? (
                    <Link
                      to="/admin/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
                    >
                      <Cog6ToothIcon className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                  ) : (
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
                    >
                      <UserIcon className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg w-full text-left"
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {}
      <div className="flex-1 flex flex-col">
        {}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex items-center space-x-4">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-gray-900 font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    Welcome, {user?.firstName}!
                  </span>
                  {user?.role === 'member' && (
                    <span className="px-2 py-1 bg-secondary-100 text-secondary-700 text-xs font-medium rounded-full">
                      {user?.membershipTier || 'Member'}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {}
        <main className="flex-1 p-6 overflow-scroll">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default DesktopLayout;
