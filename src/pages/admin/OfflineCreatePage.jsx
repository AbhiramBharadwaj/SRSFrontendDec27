import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import {
  UserIcon,
  CalendarIcon,
  PhoneIcon,
  CheckCircleIcon,
  XMarkIcon,
  TicketIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { Download, Smartphone, X, ArrowLeft } from "lucide-react";

// Success Modal (unchanged except minor fixes)
const SuccessModal = ({ booking, onClose }) => {
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
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-800">Ticket #{booking.bookingId}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex justify-center my-4">
          <img src={qrImageSrc} alt="QR Code" className="w-48 h-48 rounded-lg shadow-md" />
        </div>

        <div className="space-y-2 text-sm text-gray-700">
          <p><span className="font-semibold">Member:</span> {booking.memberName} ({booking.memberIdInput})</p>
          <p><span className="font-semibold">Event:</span> {booking.eventName}</p>
          <p><span className="font-semibold">Tickets:</span> M:{booking.memberTicketCount} G:{booking.guestTicketCount} K:{booking.kidTicketCount}</p>
          <p><span className="font-semibold">Meals:</span> Veg:{vegTotal} | Non-Veg:{nonVegTotal}</p>
          <p><span className="font-semibold">Amount Paid:</span> ₹{booking.finalAmount?.toLocaleString()}</p>
          <p><span className="font-semibold">Status:</span> <span className="text-green-600 font-bold">{booking.paymentStatus.toUpperCase()}</span></p>
          <p><span className="font-semibold">UTR:</span> {booking.utrNumber || 'N/A'}</p>
        </div>

        <div className="flex gap-3 mt-5 pt-3 border-t">
          <button onClick={sendViaWhatsApp} className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-green-700 transition">
            <Smartphone className="w-5 h-5" /> WhatsApp
          </button>
          <button onClick={downloadQR} className="flex-1 bg-black text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition">
            <Download className="w-5 h-5" /> Download QR
          </button>
        </div>
      </div>
    </div>
  );
};

const OfflineCreatePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newBooking, setNewBooking] = useState(null);
  const [previousBookings, setPreviousBookings] = useState([]);
  const [fetchingMember, setFetchingMember] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      eventId: "",
      memberId: "",
      memberName: "",
      contactNumber: "",
      notes: "",
      memberTicketCount: 0,
      guestTicketCount: 0,
      kidTicketCount: 0,
      memberVegCount: 0,
      memberNonVegCount: 0,
      guestVegCount: 0,
      guestNonVegCount: 0,
      kidVegCount: 0,
      kidNonVegCount: 0,
      attendeeNamesJson: [],
      discountCode: "",
      paymentStatus: "paid",
      amountPaid: 0,
      utrNumber: "",
      paymentMode: "upi",
    },
  });

  const memberTicketCount = Number(watch("memberTicketCount") || 0);
  const guestTicketCount = Number(watch("guestTicketCount") || 0);
  const kidTicketCount = Number(watch("kidTicketCount") || 0);
  const totalTickets = memberTicketCount + guestTicketCount + kidTicketCount;
  const watchDiscountCode = watch("discountCode");
  const watchPaymentStatus = watch("paymentStatus");

  const { fields, replace } = useFieldArray({ control, name: "attendeeNamesJson" });

  // Dynamic attendee names
  useEffect(() => {
    const needed = memberTicketCount + guestTicketCount;
    const current = fields.length;
    if (needed > current) {
      replace([...fields, ...Array(needed - current).fill({ name: "" })]);
    } else if (needed < current) {
      replace(fields.slice(0, needed));
    }
  }, [memberTicketCount, guestTicketCount, fields.length, replace]);

  // Load Events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://srs-backend-7ch1.onrender.com/api/events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(res.data.data || []);
      } catch (err) {
        toast.error("Failed to load events");
      }
    };
    fetchEvents();
  }, []);

  // Fetch Member + Previous Incomplete Bookings
  const fetchMember = async (memberId) => {
    if (!memberId?.trim()) {
      setValue("memberName", "");
      setPreviousBookings([]);
      return;
    }

    setFetchingMember(true);
    try {
      const token = localStorage.getItem("token");

      // Fetch member details
      const memberRes = await axios.get(`https://srs-backend-7ch1.onrender.com/api/admin/members/${memberId.trim()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setValue("memberName", memberRes.data.data.fullName || "Member");
      toast.success("Member found!");

      // Fetch previous bookings by memberIdInput
      const bookingsRes = await axios.get(`https://srs-backend-7ch1.onrender.com/api/bookings/member/${memberId.trim()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allBookings = bookingsRes.data.data || [];

      // Filter only incomplete (not fully scanned + not cancelled)
      const incomplete = allBookings.filter((b) => {
        const isNotFullyScanned = b.qrScanCount < (b.qrScanLimit || b.seatCount);
        const isActive = !["cancelled", "completed"].includes(b.status);
        return isNotFullyScanned && isActive;
      });

      setPreviousBookings(incomplete);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid Member ID");
      setValue("memberName", "");
      setPreviousBookings([]);
    } finally {
      setFetchingMember(false);
    }
  };

  const calculateTotals = () => {
    const event = events.find((e) => e._id === getValues("eventId"));
    if (!event) return { gross: 0, discount: 0, finalAmount: 0, discountPercent: 0 };

    const memberPrice = 1500;
    const guestPrice = 2000;
    const kidPrice = 850;

    const gross = memberTicketCount * memberPrice + guestTicketCount * guestPrice + kidTicketCount * kidPrice;

    const validCodes = { Discount52026: 5, Discount102026: 10, Discount152026: 15 };
    const code = (watchDiscountCode || "").trim();
    const discountPercent = validCodes[code] || 0;
    const discount = Math.round((gross * discountPercent) / 100);
    const finalAmount = gross - discount;

    return { gross, discount, finalAmount, discountPercent };
  };

  const { gross, discount, finalAmount } = calculateTotals();

  useEffect(() => {
    setValue("amountPaid", watchPaymentStatus === "paid" ? finalAmount : 0);
  }, [finalAmount, watchPaymentStatus, setValue]);

  const onSubmit = async (data) => {
    if (!data.eventId) return toast.error("Select an event");
    if (!data.memberId.trim()) return toast.error("Member ID required");
    if (memberTicketCount > 4) return toast.error("Max 4 member tickets");
    if (guestTicketCount > 10) return toast.error("Max 10 guest tickets");

    const totalMeals =
      Number(data.memberVegCount || 0) +
      Number(data.memberNonVegCount || 0) +
      Number(data.guestVegCount || 0) +
      Number(data.guestNonVegCount || 0) +
      Number(data.kidVegCount || 0) +
      Number(data.kidNonVegCount || 0);

    if (totalMeals !== totalTickets) return toast.error(`Meals (${totalMeals}) must equal tickets (${totalTickets})`);
    if (data.paymentStatus === "paid" && !data.utrNumber.trim()) return toast.error("UTR required for Paid");

    const payload = {
      ...data,
      memberTicketCount,
      guestTicketCount,
      kidTicketCount,
      grossAmount: gross,
      discountPercent: calculateTotals().discountPercent,
      discountAmount: discount,
      finalAmount,
      totalAmount: finalAmount,
      amountPaid: data.paymentStatus === "paid" ? finalAmount : 0,
      seatCount: totalTickets,
      payment_datetime: new Date().toISOString(),
    };

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post("https://srs-backend-7ch1.onrender.com/api/admin/offline-bookings", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const booking = res.data.data;
      const event = events.find((e) => e._id === data.eventId);
      booking.eventName = event?.title || "Event";
      booking.location = event?.mapsUrl || "Venue";
      booking.memberIdInput = data.memberId;

      setNewBooking(booking);
      setShowSuccessModal(true);
      toast.success("Booking created successfully!");
      reset();
      setPreviousBookings([]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => window.history.back();

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6 bg-white rounded-xl shadow-sm p-4 border">
          <button onClick={goBack} className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg transition">
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900 flex-1 text-center">Offline Booking</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-6">
          {}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1"><CalendarIcon className="w-4 h-4 inline mr-1" />Event</label>
              <select {...register("eventId", { required: true })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500">
                <option value="">Select Event</option>
                {events.map((e) => <option key={e._id} value={e._id}>{e.title}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1"><UserIcon className="w-4 h-4 inline mr-1" />Member ID</label>
              <input
                type="text"
                {...register("memberId", { required: true })}
                onBlur={(e) => fetchMember(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter Member ID"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1"><UserIcon className="w-4 h-4 inline mr-1" />Name</label>
              <input type="text" {...register("memberName")} readOnly className="w-full px-3 py-2 border bg-gray-50 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1"><PhoneIcon className="w-4 h-4 inline mr-1" />Phone</label>
              <input type="tel" {...register("contactNumber")} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>

          {}
          {previousBookings.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
              <div className="flex items-center gap-2 text-yellow-800 font-semibold mb-2">
                <ExclamationTriangleIcon className="w-5 h-5" />
                Previous Incomplete Bookings Found ({previousBookings.length})
              </div>
              <div className="space-y-2 text-sm">
                {previousBookings.map((b) => (
                  <div key={b._id} className="bg-white p-3 rounded border">
                    <p><strong>Booking ID:</strong> {b.bookingId}</p>
                    <p><strong>Event:</strong> {b.event?.title || b.eventName || "N/A"}</p>
                    <p><strong>Tickets:</strong> {b.seatCount} (Scanned: {b.qrScanCount}/{b.qrScanLimit || b.seatCount})</p>
                    <p><strong>Status:</strong> {b.status} | <strong>Payment:</strong> {b.paymentStatus}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {}
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
              <h3 className="font-bold text-indigo-800 mb-3">Member (₹1500)</h3>
              <input type="number" min="0" max="4" {...register("memberTicketCount", { valueAsNumber: true })} className="w-full mb-2 px-3 py-2 border rounded" />
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2 flex items-center justify-between text-xs font-semibold text-gray-700">
                  <span className="px-2 py-1 rounded bg-green-100 text-green-800 border border-green-200">Veg</span>
                  <span className="px-2 py-1 rounded bg-red-100 text-red-800 border border-red-200">Non-Veg</span>
                </div>
                <input type="number" min="0" {...register("memberVegCount", { valueAsNumber: true })} placeholder="Veg" className="px-3 py-2 border rounded text-center" />
                <input type="number" min="0" {...register("memberNonVegCount", { valueAsNumber: true })} placeholder="Non-Veg" className="px-3 py-2 border rounded text-center" />
              </div>
            </div>

            {}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h3 className="font-bold text-green-800 mb-3">Guest (₹2000)</h3>
              <input type="number" min="0" max="10" {...register("guestTicketCount", { valueAsNumber: true })} className="w-full mb-2 px-3 py-2 border rounded" />
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2 flex items-center justify-between text-xs font-semibold text-gray-700">
                  <span className="px-2 py-1 rounded bg-green-100 text-green-800 border border-green-200">Veg</span>
                  <span className="px-2 py-1 rounded bg-red-100 text-red-800 border border-red-200">Non-Veg</span>
                </div>
                <input type="number" min="0" {...register("guestVegCount", { valueAsNumber: true })} placeholder="Veg" className="px-3 py-2 border rounded text-center" />
                <input type="number" min="0" {...register("guestNonVegCount", { valueAsNumber: true })} placeholder="Non-Veg" className="px-3 py-2 border rounded text-center" />
              </div>
            </div>

            {}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <h3 className="font-bold text-purple-800 mb-3">Kid (₹850)</h3>
              <input type="number" min="0" {...register("kidTicketCount", { valueAsNumber: true })} className="w-full mb-2 px-3 py-2 border rounded" />
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2 flex items-center justify-between text-xs font-semibold text-gray-700">
                  <span className="px-2 py-1 rounded bg-green-100 text-green-800 border border-green-200">Veg</span>
                  <span className="px-2 py-1 rounded bg-red-100 text-red-800 border border-red-200">Non-Veg</span>
                </div>
                <input type="number" min="0" {...register("kidVegCount", { valueAsNumber: true })} placeholder="Veg" className="px-3 py-2 border rounded text-center" />
                <input type="number" min="0" {...register("kidNonVegCount", { valueAsNumber: true })} placeholder="Non-Veg" className="px-3 py-2 border rounded text-center" />
              </div>
            </div>
          </div>

          {}
          {(memberTicketCount + guestTicketCount > 0) && (
            <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="font-semibold mb-2">Attendee Names (Member + Guest)</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-48 overflow-y-auto">
                {fields.map((field, i) => (
                  <input
                    key={field.id}
                    {...register(`attendeeNamesJson.${i}.name`)}
                    placeholder={`Attendee ${i + 1}`}
                    className="px-3 py-2 border rounded"
                  />
                ))}
              </div>
            </div>
          )}

          {}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-5 rounded-xl border">
            <input {...register("discountCode")} placeholder="Discount Code" className="w-full mb-3 px-4 py-2 border rounded-lg font-mono" />
            <div className="bg-white p-4 rounded-lg text-center font-bold text-lg">
              <p>Gross: ₹{gross.toLocaleString()}</p>
              <p className="text-red-600">Discount: -₹{discount.toLocaleString()}</p>
              <p className="text-green-700 text-2xl">Final: ₹{finalAmount.toLocaleString()}</p>
            </div>
          </div>

          {}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-purple-50 p-5 rounded-xl border">
            <div>
              <label className="block font-semibold mb-1">Status</label>
              <select {...register("paymentStatus")} className="w-full px-3 py-2 border rounded">
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Amount</label>
              <input type="number" {...register("amountPaid")} readOnly className="w-full px-3 py-2 border bg-purple-100 rounded" />
            </div>
            <div>
              <label className="block font-semibold mb-1">UTR *</label>
              <input {...register("utrNumber")} className="w-full px-3 py-2 border rounded" placeholder="Required if Paid" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Mode</label>
              <select {...register("paymentMode")} className="w-full px-3 py-2 border rounded">
                <option value="upi">UPI</option>
                <option value="bank_transfer">Bank</option>
                <option value="cash">Cash</option>
              </select>
            </div>
          </div>

          {}
          <div>
            <label className="block font-semibold mb-1">Notes (Optional)</label>
            <textarea {...register("notes")} rows={3} className="w-full px-4 py-3 border rounded-lg resize-none" />
          </div>

          {}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-xl font-bold">
              Total Seats: <span className="text-green-600">{totalTickets}</span>
            </div>
            <button
              type="submit"
              disabled={loading || fetchingMember}
              className="bg-black text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 hover:bg-gray-900 disabled:opacity-60 transition"
            >
              {loading ? "Creating..." : <><CheckCircleIcon className="w-6 h-6" /> Complete Booking</>}
            </button>
          </div>
        </form>

        {showSuccessModal && <SuccessModal booking={newBooking} onClose={() => { setShowSuccessModal(false); setNewBooking(null); }} />}
      </div>
    </div>
  );
};

export default OfflineCreatePage;
