import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  UserIcon,
  CalendarIcon,
  TicketIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  EllipsisVerticalIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

const MemberDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchRequests = async () => {
    try {
      const res = await axios.get('https://srs-backend-7ch1.onrender.com/api/bookings/member-requests', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setRequests(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.post(`https://srs-backend-7ch1.onrender.com/api/bookings/approve-request/${id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('✅ Request Approved!');
      fetchRequests();
    } catch (err) {
      toast.error('Failed to approve');
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.post(`https://srs-backend-7ch1.onrender.com/api/bookings/reject-request/${id}`, { reason: 'Not available' }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('❌ Request Rejected');
      fetchRequests();
    } catch (err) {
      toast.error('Failed to reject');
    }
  };

  const filtered = requests.filter(r => 
    !searchTerm || (
      r.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.guestDetails.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.guestDetails.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending_approval': return 'bg-amber-500/20 border-amber-500/30 text-amber-400';
      case 'approved': return 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400';
      case 'rejected': return 'bg-red-500/20 border-red-500/30 text-red-400';
      default: return 'bg-zinc-500/20 border-zinc-500/30 text-zinc-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending_approval': return ClockIcon;
      case 'approved': return CheckCircleIcon;
      case 'rejected': return XCircleIcon;
      default: return UserIcon;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {}
      <div className="lg:hidden sticky top-0 bg-white border-b border-gray-200 z-50 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-semibold">Member</p>
            <h1 className="text-sm font-semibold text-gray-900">Guest Requests</h1>
            <p className="text-[11px] text-gray-500">{requests.length} requests</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              <ChevronDownIcon className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-4 lg:py-6">
        {}
        <div className="mb-6 lg:mb-8">
          <div className="relative mb-3 lg:mb-4 max-w-md">
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search name, email or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent"
            />
          </div>

          {}
          {showFilters && (
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-3 flex flex-wrap gap-2 mb-4 lg:hidden">
              <button className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg hover:bg-gray-50 font-medium">All</button>
              <button className="px-3 py-1.5 text-xs bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg shadow-sm">Pending</button>
              <button className="px-3 py-1.5 text-xs bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg shadow-sm">Approved</button>
              <button className="px-3 py-1.5 text-xs bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-sm">Rejected</button>
            </div>
          )}
        </div>

        {}
        <div className="hidden lg:block mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Guest Requests</h1>
              <p className="text-[11px] text-gray-500 font-medium">{requests.length} total requests</p>
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl hover:bg-gray-50 font-medium"
            >
              Filters
              <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-20 lg:py-32">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <UserIcon className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No requests yet</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Guests will appear here when they request tickets using your membership.
              </p>
            </div>
          ) : (
            filtered.map((req) => {
              const StatusIcon = getStatusIcon(req.status);
              return (
                <div 
                  key={req._id} 
                  className="group bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all overflow-hidden"
                >
                  {}
                  <div className="p-5 lg:p-6 bg-gradient-to-r from-gray-50 to-white/50">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                          <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-gray-500">Event Request</p>
                        </div>
                        <h3 className="text-sm lg:text-base font-semibold text-gray-900 line-clamp-2 leading-tight group-hover:text-purple-600 transition">
                          {req.event.title}
                        </h3>
                        <div className="flex items-center gap-3 text-[11px] text-gray-600 mt-1.5">
                          <div className="flex items-center gap-1.5">
                            <CalendarIcon className="w-3.5 h-3.5" />
                            <span>{new Date(req.event.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <TicketIcon className="w-3.5 h-3.5" />
                            <span>{req.seatCount} guest ticket{req.seatCount > 1 ? 's' : ''}</span>
                          </div>
                        </div>
                      </div>
                      <EllipsisVerticalIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-600 cursor-pointer flex-shrink-0" />
                    </div>
                  </div>

                  {}
                  <div className="p-5 lg:p-6 border-t border-gray-100">
                    {}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`px-3 py-1.5 text-xs font-bold rounded-full border flex items-center gap-1.5 ${getStatusClass(req.status)}`}>
                        <StatusIcon className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="uppercase tracking-wide">{req.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                      </div>
                      <p className="text-xs font-mono text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
                        {req.bookingId.slice(-8)}
                      </p>
                    </div>

                    {}
                    <div className="space-y-2 mb-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <span className="text-sm font-bold text-gray-700">
                            {(req.guestDetails.firstName?.[0] || 'G').toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 capitalize">
                            {req.guestDetails.firstName} {req.guestDetails.lastName}
                          </p>
                          <p className="text-[11px] text-gray-600 truncate">{req.guestDetails.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pt-2 border-t border-gray-100 text-[11px] text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <PhoneIcon className="w-3.5 h-3.5" />
                          <span>{req.guestDetails.phone}</span>
                        </div>
                      </div>
                    </div>

                    {}
                    {req.status === 'pending_approval' && (
                      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => handleApprove(req._id)}
                          className="h-11 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                        >
                          <CheckCircleIcon className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(req._id)}
                          className="h-11 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                        >
                          <XCircleIcon className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    )}

                    {req.status === 'approved' && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center text-sm">
                        <CheckCircleIcon className="w-5 h-5 text-emerald-600 mx-auto mb-2" />
                        <p className="font-semibold text-emerald-800">Guest can now complete payment</p>
                        <p className="text-emerald-700 text-[11px] mt-1">Share booking ID: <span className="font-mono bg-emerald-100 px-1.5 py-0.5 rounded text-xs">{req.bookingId.slice(-8)}</span></p>
                      </div>
                    )}

                    {req.status === 'rejected' && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center text-sm">
                        <XCircleIcon className="w-5 h-5 text-red-600 mx-auto mb-2" />
                        <p className="font-semibold text-red-800">Request declined</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-[11px]">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-medium">Total</p>
            <p className="text-sm font-semibold text-gray-900">{filtered.length} requests</p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
              <MagnifyingGlassIcon className="w-3.5 h-3.5" />
              {filtered.length}/{requests.length} shown
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
