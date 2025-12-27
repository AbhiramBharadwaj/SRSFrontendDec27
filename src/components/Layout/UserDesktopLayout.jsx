import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCartIcon, 
  TicketIcon,
  UserCircleIcon, 
  ChevronDownIcon, 
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon, 
  HeartIcon,
  HomeIcon,
  CalendarIcon,
  InformationCircleIcon,
  ChatBubbleLeftIcon,
  ShieldCheckIcon,
  MapIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import { ListFilterPlus } from 'lucide-react';
import logo from '../../assets/logo.png';
import { useAuth } from '../../context/AuthContext';
import useCartStore from '../../store/cartStore';

const UserDesktopLayout = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getTotalItems } = useCartStore();
  const navigate = useNavigate();
  const cartCount = getTotalItems();

  const [profileOpen, setProfileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const publicPages = [
    { name: 'About Us', path: '/about-us', icon: InformationCircleIcon },
    { name: 'Contact Us', path: '/contact-us', icon: ChatBubbleLeftIcon },
    { name: 'Privacy', path: '/privacy', icon: ShieldCheckIcon },
    { name: 'Sitemap', path: '/sitemap', icon: MapIcon },
    { name: 'FAQs', path: '/faqs', icon: QuestionMarkCircleIcon },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileOpen(false);
  };

  const NavLink = ({ href, children, icon: Icon, ...props }) => (
    <Link 
      to={href}
      className="text-[12px] font-semibold text-gray-700 hover:text-black uppercase tracking-wide transition flex items-center gap-1.5 group"
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 group-hover:text-purple-600 transition-colors" />}
      {children}
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 lg:px-6 py-3 flex items-center justify-between">
          {}
          <Link to="/" className="flex items-center">
            <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center">
              <img src={logo} alt="SRS" className="w-10 h-10 object-contain" />
            </div>
          </Link>

          {}
          <nav className="hidden lg:flex items-center gap-6">
            <NavLink href="/" icon={HomeIcon}>
              Home
            </NavLink>
            <NavLink href="/events" icon={CalendarIcon}>
              Events
            </NavLink>
            
            {}
            <div className="relative">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className="text-[12px] font-semibold text-gray-700 hover:text-black uppercase tracking-wide transition flex items-center gap-1.5 group"
              >
                <InformationCircleIcon className="w-4 h-4 group-hover:text-purple-600" />
                More
                <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
              </button>
              {moreOpen && (
                <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-3xl border border-gray-200 py-2 z-50 shadow-lg">
                  {publicPages.map(({ name, path, icon: Icon }) => (
                    <NavLink
                      key={name}
                      href={path}
                      icon={Icon}
                      onClick={() => setMoreOpen(false)}
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-900 hover:text-white rounded-2xl mx-1 my-1 font-semibold transition-all !text-left flex items-center gap-2"
                    >
                      {name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            {isAuthenticated && (
              <>
                <NavLink href="/favorites" icon={HeartIcon}>
                  Favorites
                </NavLink>
                <NavLink href="/profile" icon={UserCircleIcon}>
                  Profile
                </NavLink>
                {user?.role === "member" && (
                  <NavLink href="/member/requests" icon={ListFilterPlus}>
                    My Requests
                  </NavLink>
                )}
              </>
            )}
          </nav>

          {}
          <div className="flex items-center gap-3">
            {isAuthenticated && user?.role !== 'admin' && cartCount > 0 && (
              <Link to="/cart" className="relative p-1.5 rounded-xl hover:bg-gray-50 transition-all">
                <ShoppingCartIcon className="w-5 h-5 text-gray-700" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              </Link>
            )}

            {!isAuthenticated ? (
              <div className="hidden lg:flex items-center gap-3">
                <Link to="/login" className="text-[12px] font-semibold text-gray-700 hover:text-black flex items-center gap-1.5">
                  <UserCircleIcon className="w-4 h-4" />
                  Login
                </Link>
                <Link to="/register" className="bg-black text-white text-[12px] font-semibold px-5 py-2.5 rounded-2xl hover:bg-gray-900 transition flex items-center gap-1.5">
                  <ShieldCheckIcon className="w-4 h-4" />
                  Join
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2 relative">
                {user?.role === 'admin' && (
                  <Link to="/admin/dashboard" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[11px] px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1.5 hover:from-purple-700 hover:to-pink-700 transition-all shadow-sm">
                    <Cog6ToothIcon className="w-3.5 h-3.5" />
                    Admin
                  </Link>
                )}

                {}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-50 transition-all"
                    aria-label="User profile menu"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-sm">
                      <UserCircleIcon className="w-5 h-5 text-gray-600" />
                    </div>
                    <ChevronDownIcon className={`w-4 h-4 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-3xl border border-gray-200 py-2 z-50 shadow-2xl">
                      {}
                      <div className="px-4 py-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                            {user?.firstName?.[0]?.toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-gray-900 truncate">{user?.firstName} {user?.lastName}</p>
                            <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
                          </div>
                        </div>
                      </div>

                      {}
                      <NavLink 
                        href="/profile" 
                        icon={UserCircleIcon}
                        onClick={() => setProfileOpen(false)}
                        className="!text-left block px-4 py-3 text-sm font-semibold"
                      >
                        Profile
                      </NavLink>
                      
                      <NavLink 
                        href="/bookings" 
                        icon={TicketIcon}
                        onClick={() => setProfileOpen(false)}
                        className="!text-left block px-4 py-3 text-sm font-semibold"
                      >
                        My Bookings
                      </NavLink>

                      <hr className="border-gray-100 mx-4 my-1" />

                      {}
                      <button 
                        onClick={handleLogout} 
                        className="w-full text-left px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 rounded-2xl mx-1 font-semibold flex items-center gap-2.5 transition-all group"
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4 group-hover:text-rose-500 transition-colors" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
};

export default UserDesktopLayout;
