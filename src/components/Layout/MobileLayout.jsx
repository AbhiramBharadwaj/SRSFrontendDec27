import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import {
  HomeIcon,
  CalendarDaysIcon,
  HeartIcon,
  UserIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  CalendarDaysIcon as CalendarDaysIconSolid,
  HeartIcon as HeartIconSolid,
  UserIcon as UserIconSolid,
} from '@heroicons/react/24/solid';
import useCartStore from '../../store/cartStore';

const MobileLayout = ({ children }) => {
  const location = useLocation();
  const { getTotalItems } = useCartStore();
  const cartItems = getTotalItems();

  const bottomNavItems = [
    {
      name: 'Home',
      href: '/',
      icon: HomeIcon,
      activeIcon: HomeIconSolid,
    },
    {
      name: 'Events',
      href: '/events',
      icon: CalendarDaysIcon,
      activeIcon: CalendarDaysIconSolid,
    },
    {
      name: 'Favorites',
      href: '/favorites',
      icon: HeartIcon,
      activeIcon: HeartIconSolid,
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: UserIcon,
      activeIcon: UserIconSolid,
    },
  ];

  const isActive = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            SRS
          </Link>
          <div className="flex items-center space-x-3">
            {cartItems > 0 && (
              <Link
                to="/cart"
                className="relative p-2 text-gray-600 hover:text-primary-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems}
                </span>
              </Link>
            )}
            <button className="p-2 text-gray-600 hover:text-primary-600">
              <Bars3Icon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {}
      <main className="flex-1 pb-20">
        {children || <Outlet />}
      </main>

      {}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-4 h-16">
          {bottomNavItems.map((item) => {
            const active = isActive(item.href);
            const IconComponent = active ? item.activeIcon : item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center justify-center transition-colors duration-200 ${
                  active
                    ? 'text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <IconComponent className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default MobileLayout;
