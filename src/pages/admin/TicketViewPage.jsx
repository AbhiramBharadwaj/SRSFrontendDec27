import React, { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import QRCode from "qrcode.react";
import { Download, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const TicketViewPage = () => {
  const [searchParams] = useSearchParams();
  const hiddenTicketRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const data = {
    bookingId: searchParams.get("bid") || "TEST001",
    qrCode: searchParams.get("qr") || "demo123",
    memberName: decodeURIComponent(searchParams.get("name") || "Guest"),
    memberId: searchParams.get("mid") || "N/A",
    eventName: decodeURIComponent(searchParams.get("event") || "Demo Event"),
    m: Number(searchParams.get("m") || 0),
    g: Number(searchParams.get("g") || 0),
    k: Number(searchParams.get("k") || 0),
    veg: Number(searchParams.get("veg") || 0),
    nonveg: Number(searchParams.get("nonveg") || 0),
    amount: searchParams.get("amt") || "0",
  };

  const generateTicket = async (format) => {
    setLoading(true);

    try {
      const element = hiddenTicketRef.current;
      const canvas = await html2canvas(element, {
        scale: 4,
        backgroundColor: "#f9fafb",
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");

      if (format === "pdf") {
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: [54, 86],
        });
        pdf.addImage(imgData, "PNG", 0, 0, 86, 54);
        pdf.save(`Golden_Eventz_Ticket_${data.bookingId}.pdf`);
        toast.success("Ticket PDF downloaded!");
      } else {
        const link = document.createElement("a");
        link.href = imgData;
        link.download = `Golden_Eventz_Ticket_${data.bookingId}.png`;
        link.click();
        toast.success("Ticket image downloaded!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {}
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900 flex flex-col items-center justify-center px-4 py-6">
        {}
        <div className="w-full max-w-sm mb-4">
          <h1 className="text-lg font-semibold text-slate-900 tracking-tight">
            Ticket ready
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Show the QR at the entrance to verify your booking.
          </p>
        </div>

        {}
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden mb-5">
          {}
          <div className="px-4 py-3 border-b border-dashed border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500">
                Golden Eventz
              </p>
              <p className="text-xs font-semibold text-slate-900 truncate">
                {data.eventName}
              </p>
            </div>
            {}
          </div>

          {}
          <div className="px-4 py-3 flex gap-3">
            {}
            <div className="flex-1 flex flex-col gap-1">
              <p className="text-[11px] font-semibold text-slate-900">
                {data.memberName}
              </p>
              <p className="text-[10px] text-slate-500">
                Booking ID: {data.bookingId}
              </p>

              <div className="mt-2 space-y-1">
                <p className="text-[10px] text-slate-600">
                  <span className="font-semibold">Tickets:</span>{" "}
                  M:{data.m} G:{data.g} K:{data.k}
                </p>
                <p className="text-[10px] text-slate-600">
                  <span className="font-semibold">Meals:</span>{" "}
                  Veg {data.veg} | Non-veg {data.nonveg}
                </p>
                <p className="text-[11px] font-semibold text-emerald-600">
                  ₹{data.amount} • Paid
                </p>
              </div>
            </div>

            {}
            <div className="flex flex-col items-center">
              <div className="bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm">
                <QRCode value={data.qrCode} size={74} level="H" />
              </div>
              <p className="mt-1.5 text-[9px] text-slate-500 text-center leading-tight">
                Show this QR at entrance
              </p>
            </div>
          </div>

          {}
          <div className="relative h-8 mt-1">
            <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 border-t border-dashed border-slate-300" />
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-100 rounded-full shadow-inner" />
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-100 rounded-full shadow-inner" />
            <p className="absolute inset-x-4 top-1/2 -translate-y-1/2 text-[9px] text-center text-slate-400">
              © 2025 Golden Eventz
            </p>
          </div>
        </div>

        {}
        <div className="w-full max-w-sm flex flex-col gap-2 mt-1">
          <button
            onClick={() => generateTicket("pdf")}
            disabled={loading}
            className="flex items-center justify-center gap-1.5 rounded-2xl bg-black text-white py-2.5 text-[11px] font-medium shadow-md active:scale-[0.98] disabled:opacity-60 transition"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>Download PDF ticket</span>
          </button>

          <button
            onClick={() => generateTicket("png")}
            disabled={loading}
            className="flex items-center justify-center gap-1.5 rounded-2xl bg-black text-white py-2.5 text-[11px] font-medium shadow-md active:scale-[0.98] disabled:opacity-60 transition"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>Download image</span>
          </button>
        </div>
      </div>

      {}
      <div
        style={{
          position: "fixed",
          top: "-9999px",
          left: "-9999px",
          width: "860px",
        }}
      >
        <div
          ref={hiddenTicketRef}
          className="bg-slate-50 text-slate-900 rounded-[32px] overflow-hidden shadow-2xl border-[10px] border-white"
          style={{ width: "860px", height: "540px", fontFamily: "system-ui" }}
        >
          {}
          <div className="px-10 pt-8 pb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-slate-500 uppercase">
                Golden Eventz
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {data.eventName}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Booking ID</p>
              <p className="text-lg font-semibold text-slate-900">
                #{data.bookingId}
              </p>
            </div>
          </div>

          {}
          <div className="relative h-8 mb-4">
            <div className="absolute inset-x-10 top-1/2 -translate-y-1/2 border-t border-dashed border-slate-300" />
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-slate-100 rounded-full shadow-inner" />
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-slate-100 rounded-full shadow-inner" />
          </div>

          {}
          <div className="mx-10 bg-white rounded-3xl p-8 flex items-center justify-between shadow-lg border border-slate-100">
            {}
            <div className="text-sm leading-relaxed space-y-1">
              <p>
                <span className="font-semibold text-slate-600">Name:</span>{" "}
                <span className="font-semibold text-slate-900">
                  {data.memberName}
                </span>
              </p>
              <p>
                <span className="font-semibold text-slate-600">
                  Booking ID:
                </span>{" "}
                {data.bookingId}
              </p>
              <p className="mt-2">
                <span className="font-semibold text-slate-600">
                  Tickets:
                </span>{" "}
                M:{data.m} • G:{data.g} • K:{data.k}
              </p>
              <p>
                <span className="font-semibold text-slate-600">Meals:</span>{" "}
                Veg {data.veg} • Non-veg {data.nonveg}
              </p>
              <p className="mt-4 text-base font-semibold text-emerald-600">
                Amount paid: ₹{data.amount}
              </p>
              <p className="text-xs font-semibold text-emerald-500 tracking-wide">
                Status: PAID
              </p>
            </div>

            {}
            <div className="flex flex-col items-center">
              <div className="p-4 bg-white border-2 border-slate-200 rounded-3xl shadow-md">
                <QRCode value={data.qrCode} size={180} level="H" />
              </div>
              <p className="mt-4 text-xs font-medium text-slate-500 text-center">
                Show this ticket at the entrance
              </p>
            </div>
          </div>

          {}
          <p className="mt-6 text-center text-[11px] text-slate-400">
            © 2025 Golden Eventz · All rights reserved
          </p>
        </div>
      </div>
    </>
  );
};

export default TicketViewPage;
