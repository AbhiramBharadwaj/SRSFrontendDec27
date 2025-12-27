import React from "react";
import { CheckCircle, Users, QrCode, Star, Zap, ArrowRight } from "lucide-react";

const ReferralDiscountSection = () => {
  const stats = [
    { icon: <Users />, value: "1.8M+", label: "Guest Tickets" },
    { icon: <QrCode />, value: "99.9%", label: "QR Success" },
    { icon: <Star />, value: "₹420Cr+", label: "Saved by Guests" },
    { icon: <Zap />, value: "2 Sec", label: "Booking Time" },
  ];

  const features = [
    "Use any member's code → instant discount",
    "Up to 70% off — no membership needed",
    "QR ticket in 5 sec on WhatsApp + Email",
    "Fastest payment in India",
    "Zero queue — just show phone",
    "Your friend earns points too!",
  ];

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        {}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-xs font-bold mb-4">
            Guest Booking Revolution
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Book Any Event with
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              Massive Discounts
            </span>
          </h2>
          <p className="mt-3 text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Just ask any SRS member for their code — no signup needed!
          </p>
        </div>

        {}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl text-white mb-3 shadow-lg">
                {stat.icon}
              </div>
              <div className="text-2xl md:text-3xl font-black text-gray-900">{stat.value}</div>
              <div className="text-sm md:text-base text-gray-600 font-medium mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">

          {}
          <div className="space-y-4">
            {features.map((feat, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-blue-50/70 transition-colors">
                <CheckCircle className="w-6 h-6 text-cyan-600 mt-0.5 flex-shrink-0" />
                <span className="text-base md:text-lg font-medium text-gray-800 leading-snug">
                  {feat}
                </span>
              </div>
            ))}
          </div>

          {}
          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl p-8 md:p-10 text-white shadow-2xl">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Got a Referral Code?</h3>
            <p className="text-blue-100 text-base md:text-lg mb-8 opacity-90">
              Apply it → Watch price drop instantly — save up to ₹2000/ticket!
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-2xl font-bold text-base md:text-lg flex items-center justify-center gap-3 transition-all hover:scale-105 shadow-xl">
                Browse Events Now
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border-2 border-white/40 hover:bg-white/10 px-8 py-4 rounded-2xl font-bold text-base md:text-lg transition-all">
                Ask a Friend
              </button>
            </div>

            {}
            <div className="mt-8 flex items-center gap-4 text-sm">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-white/20 border-2 border-white flex items-center justify-center text-xs font-bold"
                  >
                    {i === 4 ? "+1.8M" : String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="opacity-90">
                <strong>1.8 Million+</strong> guests saved big
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ReferralDiscountSection;
