import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Filter, Download, X, QrCode, Smartphone, ChevronDown, ArrowLeft, 
  Delete,
  Trash
} from 'lucide-react';

const QRModal = ({ booking, onClose }) => {
  if (!booking) return null;

  const qrImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${booking.qrCode}`;
  const vegTotal = booking.memberVegCount + booking.guestVegCount + booking.kidVegCount;
  const nonVegTotal = booking.memberNonVegCount + booking.guestNonVegCount + booking.kidNonVegCount;

  const ticketUrl = `https://thesrsevents.com/ticket?bid=${booking.bookingId}&qr=${booking.qrCode}&name=${encodeURIComponent(booking.memberName)}&mid=${booking.memberIdInput}&event=${encodeURIComponent(booking.eventName || 'Event')}&m=${booking.memberTicketCount}&g=${booking.guestTicketCount}&k=${booking.kidTicketCount}&veg=${vegTotal}&nonveg=${nonVegTotal}&amt=${booking.finalAmount}&status=${booking.paymentStatus.toUpperCase()}&utr=${encodeURIComponent(booking.utrNumber || 'Pending')}`;

  const message = `Hello ${booking.memberName}!

Booking Confirmed! You are all set for ${booking.eventName || 'the event'}.

Booking ID: #${booking.bookingId}
Member: ${booking.memberName}
Event: ${booking.eventName || 'N/A'}
Tickets: M:${booking.memberTicketCount} G:${booking.guestTicketCount} K:${booking.kidTicketCount}
Meals: Veg:${vegTotal} | Non-Veg:${nonVegTotal}
Amount: ₹${booking.finalAmount}
Payment Status: ${booking.paymentStatus.toUpperCase()}

Location: ${booking.location || 'Venue'}
Date: 31st Dec | Time: 7:30 PM Onwards

Please show this QR code at the entrance:
${ticketUrl}

See you there!
Team golden eventz

Need help? Contact us or Visit: http://www.goldeneventz.co.in`;

  const sendViaWhatsApp = () => {
    const phone = booking.contactNumber?.replace(/\D/g, '') || "9606729320";
    const num = phone.startsWith("91") ? phone : `91${phone}`;
    const waUrl = `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
    toast.success("WhatsApp opened!");
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = qrImageSrc;
    link.download = `SRS_Ticket_${booking.bookingId}.png`;
    link.click();
    toast.success('QR Downloaded!');
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm max-h-[90vh] overflow-auto p-3 border">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-gray-800">Ticket #{booking.bookingId}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex justify-center mb-3">
          <img src={qrImageSrc} alt="Ticket QR" className="w-32 h-32 rounded shadow-sm object-contain" />
        </div>
        <div className="space-y-1 text-xs text-gray-700 leading-tight">
          <p><span className="font-bold">Member:</span> {booking.memberName}</p>
          <p><span className="font-bold">Event:</span> {booking.event?.title || 'N/A'}</p>
          <p><span className="font-bold">Tickets:</span> M:{booking.memberTicketCount} G:{booking.guestTicketCount} K:{booking.kidTicketCount}</p>
          <p><span className="font-bold">Meals:</span> V:{booking.memberVegCount + booking.guestVegCount + booking.kidVegCount} NV:{booking.memberNonVegCount + booking.guestNonVegCount + booking.kidNonVegCount}</p>
          <p><span className="font-bold">Amount:</span> ₹{booking.finalAmount}</p>
          <p><span className="font-bold">Status:</span> <span className={`font-bold ${booking.paymentStatus === 'completed' ? 'text-green-600' : 'text-orange-600'}`}>{booking.paymentStatus.toUpperCase()}</span></p>
          <p><span className="font-bold">UTR:</span> {booking.utrNumber || '-'}</p>
        </div>
        <div className="flex gap-2 mt-4 pt-2 border-t">
          <button onClick={sendViaWhatsApp} className="flex-1 bg-black text-white text-xs rounded-lg py-2 px-3 font-medium hover:bg-gray-800 flex items-center justify-center gap-1">
            <Smartphone className="w-3 h-3" /> WhatsApp
          </button>
          <button onClick={downloadQR} className="flex-1 bg-black text-white text-xs rounded-lg py-2 px-3 font-medium hover:bg-gray-800 flex items-center justify-center gap-1">
            <Download className="w-3 h-3" /> QR
          </button>
        </div>
      </div>
    </div>
  );
};

const BookingCard = ({ booking, onQRClick, events, deleteBooking }) => {
  const event = events.find(e => e._id === booking.event);
  
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all mb-3">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm text-gray-900 truncate">#{booking.bookingId}</div>
          <div className="text-xs text-gray-500 font-mono mb-1">{booking.memberName}</div>
          <div className="text-xs text-indigo-600 font-medium">{event?.title || 'N/A'}</div>
        </div>
        <div className="ml-2">
          <span className={`inline-block rounded-full px-2 py-1 text-xs font-bold text-white ${booking.paymentStatus === 'completed' ? 'bg-green-600' : 'bg-orange-600'}`}>
            {booking.paymentStatus.toUpperCase()}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-xs mb-3">
        <div>
          <div className="text-gray-500 font-mono">Tickets</div>
          <div className="font-mono">M:{booking.memberTicketCount} G:{booking.guestTicketCount} K:{booking.kidTicketCount}</div>
        </div>
        <div>
          <div className="text-gray-500 font-mono">Meals</div>
          <div className="font-mono">V:{booking.memberVegCount + booking.guestVegCount + booking.kidVegCount} NV:{booking.memberNonVegCount + booking.guestNonVegCount + booking.kidNonVegCount}</div>
        </div>
        <div>
          <div className="text-gray-500">Gross</div>
          <div className="font-mono text-sm">₹{booking.grossAmount}</div>
        </div>
        <div>
          <div className="text-gray-500">Final</div>
          <div className="font-bold text-green-600 font-mono text-sm">₹{booking.finalAmount}</div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs">
        <div className="font-mono text-gray-600 truncate max-w-[120px]">{booking.utrNumber || '-'}</div>
        <button
          onClick={() => onQRClick(booking)}
          className="bg-black text-white px-4 py-1.5 rounded-lg font-medium text-xs hover:bg-gray-800 transition flex items-center gap-1 whitespace-nowrap"
        >
          <QrCode className="w-3 h-3" />
          Send QR
        </button>

        <button
      onClick={() => deleteBooking(booking._id)}
      className="bg-red-800 text-white px-4 py-1.5 rounded-lg font-medium text-xs hover:bg-gray-800 transition flex items-center gap-1 whitespace-nowrap"
    >
      Delete
    </button>
      </div>
    </div>
  );
};

const OfflineListPage = () => {
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState({
    startDate: '', endDate: '', eventId: '', memberId: '', utrNumber: '',
    paymentStatus: '', discountCode: '', search: ''
  });
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (token) {
      fetchEvents();
      fetchBookings();
    } else {
      toast.error('Please login again');
    }
  }, [token]);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('https://srs-backend-7ch1.onrender.com/api/events', { headers: { Authorization: `Bearer ${token}` } });
      setEvents(res.data.data || []);
    } catch {
      toast.error('Failed to load events');
    }
  };

  const fetchBookings = async () => {
    if (!token) return;
    try {
      const res = await axios.get('https://srs-backend-7ch1.onrender.com/api/admin/offline-bookings', {
        params: filter,
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data.data || []);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      toast.error('Failed to load bookings');
    }
  };

  const handleExport = async () => {
    try {
      const res = await axios.get('https://srs-backend-7ch1.onrender.com/api/admin/offline-bookings/export', {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` }
      });
      const url = URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `offline-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      toast.success('CSV exported!');
    } catch {
      toast.error('Export failed');
    }
  };

  const deleteBooking = async (id) => {
  if (!window.confirm("Are you sure you want to delete this booking?")) return;

  try {
    const res = await axios.delete(
      `https://srs-backend-7ch1.onrender.com/api/admin/offline-bookings/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success("Booking deleted successfully");

    fetchBookings();

  } catch (err) {
    toast.error("Failed to delete booking");
  }
};
  const openQRModal = (booking) => {
    setSelectedBooking(booking);
    setShowQRModal(true);
  };

  const goBack = () => {
    window.history.back();
  };

  


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        {}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border">
          <button 
            onClick={goBack}
            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-all text-sm font-medium text-gray-700 self-start"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 text-center flex-1">Offline Bookings</h1>
          <div className="flex gap-2 flex-1 sm:flex-none justify-end">
            <button 
              onClick={() => setShowFilterPopup(true)} 
              className="flex items-center gap-1.5 bg-black text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-gray-800 transition whitespace-nowrap"
            >
              <Filter className="w-3 h-3" />
              Filters
            </button>
            <button 
              onClick={handleExport} 
              className="flex items-center gap-1.5 bg-black text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-gray-800 transition whitespace-nowrap"
            >
              <Download className="w-3 h-3" />
              Export
            </button>
          </div>
        </div>

        {}
        {showFilterPopup && (
          <div className="fixed inset-0 bg-black/50 z-[999] flex items-end sm:items-center justify-center p-2 sm:p-6">
            <div className="bg-white rounded-2xl sm:rounded-xl w-full max-w-md max-h-[85vh] overflow-auto shadow-2xl border">
              <div className="p-4 border-b sticky top-0 bg-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-800">Filters</h2>
                  <button onClick={() => setShowFilterPopup(false)} className="text-gray-500 hover:text-red-600 p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-4 space-y-3 text-sm">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-600">Start Date</label>
                  <input type="date" value={filter.startDate} onChange={e => setFilter({ ...filter, startDate: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-600">End Date</label>
                  <input type="date" value={filter.endDate} onChange={e => setFilter({ ...filter, endDate: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-600">Event</label>
                  <select value={filter.eventId} onChange={e => setFilter({ ...filter, eventId: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black text-xs">
                    <option value="">All Events</option>
                    {events.map(e => <option key={e._id} value={e._id}>{e.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-600">Member ID</label>
                  <input placeholder="Member ID" value={filter.memberId} onChange={e => setFilter({ ...filter, memberId: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-600">UTR</label>
                  <input placeholder="UTR Number" value={filter.utrNumber} onChange={e => setFilter({ ...filter, utrNumber: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-600">Status</label>
                  <select value={filter.paymentStatus} onChange={e => setFilter({ ...filter, paymentStatus: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black text-xs">
                    <option value="">All Status</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <button 
                  onClick={() => { fetchBookings(); setShowFilterPopup(false); }} 
                  className="w-full bg-black text-white py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 transition mt-2"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border p-2 sm:p-4">
          {isMobile || window.innerWidth < 768 ? (
            
            <div className="space-y-3">
              {bookings.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="w-16 h-16 bg-gray-200 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <Filter className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-lg font-semibold">No bookings found</p>
                </div>
              ) : (
                bookings.map(booking => (
                  <BookingCard
                    key={booking._id}
                    booking={booking}
                    onQRClick={openQRModal}
                    events={events}
                    deleteBooking={deleteBooking}
                  />
                ))
              )}
            </div>
          ) : (
            
            <div className="overflow-x-auto">
              <table className="w-full table-fixed border-collapse border border-gray-200 text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-300">
                    <th className="border border-gray-300 p-2.5 text-left font-semibold text-gray-700">Booking ID</th>
                    <th className="border border-gray-300 p-2.5 text-left font-semibold text-gray-700">Member</th>
                    <th className="border border-gray-300 p-2.5 text-center font-semibold text-gray-700">Tickets</th>
                    <th className="border border-gray-300 p-2.5 text-center font-semibold text-gray-700">Meals</th>
                    <th className="border border-gray-300 p-2.5 text-right font-semibold text-gray-700">Gross</th>
                    <th className="border border-gray-300 p-2.5 text-right font-semibold text-gray-700">Final</th>
                    <th className="border border-gray-300 p-2.5 text-center font-semibold text-gray-700">Status</th>
                    {}
                    <th className="border border-gray-300 p-2.5 text-center font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center p-8 text-gray-500">No bookings found</td>
                    </tr>
                  ) : (
                    bookings.map(b => (
                      <tr key={b._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                       <td className="border border-gray-300 p-2 font-mono text-xs break-words">
  {`#${b.bookingId}`}
</td>
                        <td className="border border-gray-300 p-2 max-w-[160px]">
                          <div className="font-semibold text-xs truncate">{b.memberName}</div>
                          <div className="text-xs text-gray-500 font-mono truncate">{b.memberIdInput}</div>
                        </td>
                        <td className="border border-gray-300 p-2 text-center font-mono text-xs">M:{b.memberTicketCount}<br/>G:{b.guestTicketCount} K:{b.kidTicketCount}</td>
                        <td className="border border-gray-300 p-2 text-center font-mono text-xs">V:{b.memberVegCount + b.guestVegCount + b.kidVegCount}<br/>NV:{b.memberNonVegCount + b.guestNonVegCount + b.kidNonVegCount}</td>
                        <td className="border border-gray-300 p-2 text-right font-mono text-xs">₹{b.grossAmount}</td>
                        <td className="border border-gray-300 p-2 text-right font-bold text-green-600 font-mono text-xs">₹{b.finalAmount}</td>
                        <td className="border border-gray-300 p-2 text-center">
                          <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold text-white ${b.paymentStatus === 'completed' ? 'bg-green-600' : 'bg-orange-600'}`}>
                            {b.paymentStatus.toUpperCase()}
                          </span>
                        </td>
                        {}
                        <td className="border border-gray-300 p-2 text-center flex space2">
                          <button
                            onClick={() => openQRModal(b)}
                            className="bg-black text-white px-3 py-1.5 rounded-lg font-medium text-xs hover:bg-gray-800 transition flex items-center gap-1 mx-auto"
                          >
                            <QrCode className="w-3 h-3" />
                            
                          </button>

                          <button
      onClick={() => deleteBooking(b._id)}
      className="bg-red-600 text-white px-3 py-1.5 rounded-lg font-medium text-xs hover:bg-red-700 transition whitespace-nowrap mx-2"
    >
      <Trash className="w-3 h-3"/>
    </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showQRModal && <QRModal booking={selectedBooking} onClose={() => setShowQRModal(false)} />}
      </div>
    </div>
  );
};

export default OfflineListPage;
