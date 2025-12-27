// components/Layout/UserMobileLayout.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, CalendarDaysIcon, HeartIcon, UserIcon, 
  ShoppingCartIcon, Bars3Icon, XMarkIcon, ChevronDownIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { HomeIcon as HomeSolid, CalendarDaysIcon as CalendarSolid, HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import useCartStore from '../../store/cartStore';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';
import { BookKeyIcon, ListFilterPlus } from 'lucide-react';

const UserMobileLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { getTotalItems } = useCartStore();
  const cartCount = getTotalItems();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path) => location.pathname.startsWith(path) || (path === '/' && location.pathname === '/');

  const sidebarLinks = [
    { name: 'About', path: '/about-us' },
    { name: 'Contact', path: '/contact-us' },
    { name: 'Privacy', path: '/privacy' },
    { name: 'FAQs', path: '/faqs' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setSidebarOpen(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col pb-20 lg:pb-0">
        {}
        <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-50 px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
                <img src={logo} alt="SRS" className="w-8 h-8 object-contain" />
              </div>
            </Link>

            <div className="flex items-center gap-3">
              {isAuthenticated && user?.role !== 'admin' && cartCount > 0 && (
                <Link to="/cart" className="relative p-1.5 rounded-xl hover:bg-gray-50">
                  <ShoppingCartIcon className="w-5 h-5 text-gray-700" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                </Link>
              )}
              <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-xl hover:bg-gray-50">
                <Bars3Icon className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>

        {}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
          <div className={`grid ${isAuthenticated ? 'grid-cols-5' : 'grid-cols-2'} h-16`}>
            {}
            <Link to="/" className={`flex flex-col items-center justify-center gap-1 transition-all ${isActive('/') ? 'text-black scale-105' : 'text-gray-600'}`}>
              {isActive('/') ? <HomeSolid className="w-6 h-6" /> : <HomeIcon className="w-6 h-6" />}
              <span className="text-[10px] font-semibold uppercase tracking-wide">Home</span>
            </Link>
            
            {}
            <Link to="/events" className={`flex flex-col items-center justify-center gap-1 transition-all ${isActive('/events') ? 'text-black scale-105' : 'text-gray-600'}`}>
              {isActive('/events') ? <CalendarSolid className="w-6 h-6" /> : <CalendarDaysIcon className="w-6 h-6" />}
              <span className="text-[10px] font-semibold uppercase tracking-wide">Events</span>
            </Link>

            {}
            {isAuthenticated && (
              <>
                <Link to="/favorites" className={`flex flex-col items-center justify-center gap-1 transition-all ${isActive('/favorites') ? 'text-black scale-105' : 'text-gray-600'}`}>
                  {isActive('/favorites') ? <HeartSolid className="w-6 h-6" /> : <HeartIcon className="w-6 h-6" />}
                  <span className="text-[10px] font-semibold uppercase tracking-wide">Fav</span>
                </Link>
                
                <Link to="/cart" className={`flex flex-col items-center justify-center gap-1 transition-all ${isActive('/cart') ? 'text-black scale-105' : 'text-gray-600'}`}>
                  <ShoppingCartIcon className="w-6 h-6 relative">
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </ShoppingCartIcon>
                  <span className="text-[10px] font-semibold uppercase tracking-wide">Cart</span>
                </Link>
                
                <Link to="/profile" className={`flex flex-col items-center justify-center gap-1 transition-all ${isActive('/profile') ? 'text-black scale-105' : 'text-gray-600'}`}>
                  {isActive('/profile') ? <UserIcon className="w-6 h-6 text-black" /> : <UserIcon className="w-6 h-6" />}
                  <span className="text-[10px] font-semibold uppercase tracking-wide">Profile</span>
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>

      {}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-[9999] flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-80 bg-white border-r border-gray-200 animate-in slide-in-from-right duration-300 max-w-full">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <img src={logo} alt="SRS" className="w-7 h-7 object-contain" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">Menu</h2>
                  {isAuthenticated && <p className="text-[11px] text-gray-500">{user?.firstName}</p>}
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-xl hover:bg-gray-100">
                <XMarkIcon className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <div className="p-4 space-y-2 divide-y divide-gray-100">
              {isAuthenticated && (
                <div className="pt-2 pb-4">
                  <Link to="/profile" onClick={() => setSidebarOpen(false)} className="block w-full text-[12px] font-semibold text-gray-900 py-2.5 px-3 rounded-2xl hover:bg-gray-50 flex items-center gap-2">
                    <UserIcon className="w-4 h-4" />
                    Profile
                  </Link>
                  <Link to="/bookings" onClick={() => setSidebarOpen(false)} className="block w-full text-[12px] font-semibold text-gray-900 py-2.5 px-3 rounded-2xl hover:bg-gray-50 flex items-center gap-2">
                    <CalendarDaysIcon className="w-4 h-4" />
                    Bookings
                  </Link>
                   {
                                      user.role=="member"&&(
                                        <Link to="/member/requests" className="block w-full text-[12px] font-semibold text-gray-900 py-2.5 px-3 rounded-2xl hover:bg-gray-50 flex items-center gap-2">
                                      <ListFilterPlus className="w-4 h-4" />
                                      My Requests
                                    </Link>
                                      )
                                    }
                </div>
              )}

              {sidebarLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setSidebarOpen(false)}
                  className="block text-[12px] font-semibold text-gray-700 py-2.5 px-3 rounded-2xl hover:bg-gray-50 flex items-center gap-2"
                >
                  {link.name}
                </Link>
              ))}

              {isAuthenticated ? (
                <>
                  {user?.role === 'admin' && (
                    <Link to="/admin/dashboard" onClick={() => setSidebarOpen(false)} className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[12px] font-semibold py-2.5 px-3 rounded-2xl flex items-center gap-2">
                      <Cog6ToothIcon className="w-4 h-4" />
                      Admin
                    </Link>
                  )}
                  <button onClick={handleLogout} className="w-full text-[12px] text-rose-600 font-semibold py-2.5 px-3 rounded-2xl hover:bg-rose-50 flex items-center gap-2">
                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setSidebarOpen(false)} className="block w-full bg-black text-white text-[12px] font-semibold py-2.5 px-3 rounded-2xl text-center">Login</Link>
                  <Link to="/register" onClick={() => setSidebarOpen(false)} className="block w-full bg-gray-900 text-white text-[12px] font-semibold py-2.5 px-3 rounded-2xl text-center">Join</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserMobileLayout;
