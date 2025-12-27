import React from "react";
import { 
  Ticket, 
  QrCode, 
  Users, 
  Zap, 
  Shield, 
  Sparkles, 
  ArrowRight, 
  CheckCircle 
} from "lucide-react";

const GuestExperienceSection = () => {
  const benefits = [
    { icon: <QrCode className="w-8 h-8" />, title: "Instant QR Ticket", desc: "Get scannable QR in 5 sec on WhatsApp & Email" },
    { icon: <Users className="w-8 h-8" />, title: "Up to ₹2000 Off", desc: "Use any member's code — no membership needed!" },
    { icon: <Zap className="w-8 h-8" />, title: "2-Second Booking", desc: "Fastest event booking in India" },
    { icon: <Ticket className="w-8 h-8" />, title: "Zero Queue Entry", desc: "Just show your phone — VIP entry" },
    { icon: <Shield className="w-8 h-8" />, title: "100% Safe", desc: "Full refund if event cancelled" },
    { icon: <Sparkles className="w-8 h-8" />, title: "Trusted by 400+ Colleges", desc: "IITs • NITs • DU • VIT • Manipal & more" }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-blue-50/30 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        {}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-xs md:text-sm font-bold mb-4">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
            Loved by Guests & Members
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            The Smarter Way to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              Attend Events
            </span>
          </h2>
          <p className="mt-4 text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
            No printing. No waiting. Just pure convenience.
          </p>
        </div>

        {}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {benefits.map((item, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-2xl mb-5 md:mb-6 shadow-lg group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-3">
                {item.title}
              </h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {}
        <div className="mt-12 md:mt-16 text-center">
          <div className="inline-block bg-gradient-to-r from-blue-600 to-cyan-600 p-8 md:p-12 rounded-3xl shadow-2xl text-white w-full max-w-4xl">
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Join 2.4 Million+ Happy Users
            </h3>
            <p className="text-base md:text-lg lg:text-xl text-blue-100 mb-8 opacity-90">
              Book events with massive discounts — zero hassle
            </p>
            <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 md:px-12 py-4 md:py-6 rounded-2xl font-bold text-base md:text-xl transition-all hover:scale-105 shadow-xl flex items-center gap-3 mx-auto">
              Explore All Events
              <ArrowRight className="w-6 h-6 md:w-7 md:h-7" />
            </button>

            <div className="mt-8 flex flex-wrap justify-center gap-4 md:gap-8 text-xs md:text-sm opacity-90">
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-300" />
                Instant Booking
              </span>
              <span className="hidden xs:block text-white/60">•</span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-300" />
                Full Refund
              </span>
              <span className="hidden xs:block text-white/60">•</span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-300" />
                4.9/5 Rating
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default GuestExperienceSection;
