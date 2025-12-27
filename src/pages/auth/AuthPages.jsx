// src/pages/AuthPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  HashtagIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

const AuthPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [currentTab, setCurrentTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    memberId: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Universal Login Handler — works for both Email & Member ID
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const isMemberLogin = currentTab === 'member';
    const identifier = isMemberLogin ? formData.memberId.trim() : formData.email.trim();
    const password = formData.password;

    if (!identifier || !password) {
      toast.error('Please fill all fields');
      setLoading(false);
      return;
    }

    try {
      // Use your backend member login route
      const endpoint = isMemberLogin
        ? 'https://srs-backend-7ch1.onrender.com/api/member/login'
        : 'https://srs-backend-7ch1.onrender.com/api/auth/login';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          isMemberLogin
            ? { identifier, password }
            : { email: identifier, password }
        ),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const { user, token } = data.data;

      // Save token & login via context
      localStorage.setItem('token', token);
      await login(user.email, password); // This triggers context update

      toast.success(`Welcome back, ${user.firstName || 'Member'}!`);
      navigate(user.role === 'member' ? '/member/dashboard' : '/dashboard');
    } catch (err) {
      toast.error(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  // Registration Handler
  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (!formData.agreeToTerms) {
      toast.error('You must agree to terms');
      return;
    }

    setLoading(true);
    try {
      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
      };

      const res = await fetch('https://srs-backend-7ch1.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Registration failed');

      toast.success('Account created! Logging you in...');
      await login(userData.email, userData.password);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const isLoginTab = currentTab === 'login';
  const isMemberTab = currentTab === 'member';
  const isRegisterTab = currentTab === 'register';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md">
        {}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 bg-black rounded-2xl flex items-center justify-center">
            <img src={logo} alt="SRS" className="w-10 h-10 object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {isMemberTab ? 'Member Login' : isRegisterTab ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-[11px] text-gray-600">Sign in or create your SRS Events account</p>
        </div>

        {}
        <div className="bg-white rounded-3xl border border-gray-200 p-1 mb-6">
          <div className="flex bg-gray-50 rounded-2xl p-1">
            <button
              onClick={() => setCurrentTab('login')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                isLoginTab
                  ? 'bg-white text-gray-900 shadow-sm border border-black'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            {/* <button
              onClick={() => setCurrentTab('member')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                isMemberTab
                  ? 'bg-white text-gray-900 shadow-sm border border-black'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Member ID
            </button> */}
            <button
              onClick={() => setCurrentTab('register')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                isRegisterTab
                  ? 'bg-white text-gray-900 shadow-sm border border-black'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Register
            </button>
          </div>
        </div>

        {}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 lg:p-8">
          <form onSubmit={isRegisterTab ? handleRegister : handleLogin}>
            {(isLoginTab || isMemberTab) ? (
              <>
                <div className="space-y-4">
                  <div className="relative">
                    {isMemberTab ? (
                      <HashtagIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    ) : (
                      <EnvelopeIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    )}
                    <input
                      type="text"
                      name={isMemberTab ? 'memberId' : 'email'}
                      required
                      value={isMemberTab ? formData.memberId : formData.email}
                      onChange={handleChange}
                      placeholder={isMemberTab ? 'Member ID (e.g. MEM001)' : 'Email address'}
                      className="w-full pl-12 pr-4 py-4 text-sm border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>

                  <div className="relative">
                    <LockClosedIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      className="w-full pl-12 pr-12 py-4 text-sm border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg"
                    >
                      {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {isMemberTab && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
                    <strong>Tip:</strong> Your password is usually{' '}
                    <code className="bg-blue-100 px-2 py-1 rounded font-mono">
                      firstname@memberid
                    </code>{' '}
                    (lowercase)
                  </div>
                )}

                <div className="flex justify-between items-center mt-6 text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-black" />
                    <span>Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-black font-medium hover:underline">
                    Forgot?
                  </Link>
                </div>
              </>
            ) : (
              
              <>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-black focus:outline-none"
                  />
                  <input
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-black focus:outline-none"
                  />
                </div>

                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full mt-4 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-black focus:outline-none"
                />

                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  className="w-full mt-4 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-black focus:outline-none"
                />

                <div className="relative mt-4">
                  <LockClosedIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create password"
                    className="w-full pl-12 pr-12 py-4 border rounded-xl focus:ring-2 focus:ring-black"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2">
                    {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>

                <div className="relative mt-4">
                  <LockClosedIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    className="w-full pl-12 pr-12 py-4 border rounded-xl focus:ring-2 focus:ring-black"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2">
                    {showConfirm ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>

                <label className="flex items-center gap-3 mt-6 text-sm">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-400"
                    required
                  />
                  <span>I agree to the Terms & Privacy Policy</span>
                </label>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-black text-white font-bold py-4 rounded-2xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition"
            >
              {loading ? <LoadingSpinner size="small" /> : null}
              {isRegisterTab ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="text-center mt-6 text-sm text-gray-600">
            <p>
              {isRegisterTab ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => setCurrentTab(isRegisterTab ? 'login' : 'register')}
                className="font-bold text-black hover:underline"
              >
                {isRegisterTab ? 'Sign In' : 'Register Now'}
              </button>
            </p>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-gray-500 space-y-1">
          <Link to="/forgot-password" className="block hover:text-black">Forgot Password?</Link>
          <Link to="/terms" className="block">Terms • Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
