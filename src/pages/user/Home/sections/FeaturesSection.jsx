import React from "react";
import { Calendar, Share2, Ticket, QrCode, Smartphone } from "lucide-react";

const HowItWorks = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 text-center">
        {}
        <h2 className="font-black text-gray-900 text-3xl sm:text-4xl lg:text-5xl leading-tight mb-4 tracking-tight">
          How It Works
        </h2>
        <p className="text-gray-600 text-lg sm:text-xl font-medium max-w-2xl mx-auto mb-20 leading-relaxed">
          5 simple steps to sell out your events
        </p>

        {}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
          {}
          <div className="group flex flex-col items-center p-8 hover:-translate-y-3 transition-all duration-300 hover:shadow-xl rounded-3xl border border-gray-100 bg-gray-50/50">
            <div className="w-20 h-20 bg-black text-white rounded-3xl flex items-center justify-center mb-6 shadow-lg border border-gray-200 group-hover:bg-white group-hover:text-black transition-all duration-300">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">Create Event</h3>
            <p className="text-gray-600 font-medium text-sm leading-relaxed max-w-xs">Setup in 2 minutes</p>
          </div>

          {}
          <div className="group flex flex-col items-center p-8 hover:-translate-y-3 transition-all duration-300 hover:shadow-xl rounded-3xl border border-gray-100 bg-gray-50/50">
            <div className="w-20 h-20 bg-black text-white rounded-3xl flex items-center justify-center mb-6 shadow-lg border border-gray-200 group-hover:bg-white group-hover:text-black transition-all duration-300">
              <Share2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">Members Share</h3>
            <p className="text-gray-600 font-medium text-sm leading-relaxed max-w-xs">One tap sharing</p>
          </div>

          {}
          <div className="group flex flex-col items-center p-8 hover:-translate-y-3 transition-all duration-300 hover:shadow-xl rounded-3xl border border-gray-100 bg-gray-50/50">
            <div className="w-20 h-20 bg-black text-white rounded-3xl flex items-center justify-center mb-6 shadow-lg border border-gray-200 group-hover:bg-white group-hover:text-black transition-all duration-300">
              <Ticket className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">Guests Save Big</h3>
            <p className="text-gray-600 font-medium text-sm leading-relaxed max-w-xs">Up to 70% off</p>
          </div>

          {}
          <div className="group flex flex-col items-center p-8 hover:-translate-y-3 transition-all duration-300 hover:shadow-xl rounded-3xl border border-gray-100 bg-gray-50/50">
            <div className="w-20 h-20 bg-black text-white rounded-3xl flex items-center justify-center mb-6 shadow-lg border border-gray-200 group-hover:bg-white group-hover:text-black transition-all duration-300">
              <QrCode className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">Get QR Ticket</h3>
            <p className="text-gray-600 font-medium text-sm leading-relaxed max-w-xs">Instant delivery</p>
          </div>

          {}
          <div className="group flex flex-col items-center p-8 hover:-translate-y-3 transition-all duration-300 hover:shadow-xl rounded-3xl border border-gray-100 bg-gray-50/50">
            <div className="w-20 h-20 bg-black text-white rounded-3xl flex items-center justify-center mb-6 shadow-lg border border-gray-200 group-hover:bg-white group-hover:text-black transition-all duration-300">
              <Smartphone className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">Enter Instantly</h3>
            <p className="text-gray-600 font-medium text-sm leading-relaxed max-w-xs">Zero queue entry</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
