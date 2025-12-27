import React from "react";
import { 
  Users, 
  Ticket, 
  QrCode, 
  Zap, 
  Wallet, 
  TrendingUp,
  ShieldCheck
} from "lucide-react";

const RotatingStatsSection = () => {
  const stats = [
    { icon: Users, value: "18,000+", label: "Active Clubs", back: "400+ Top Colleges", gradient: "from-cyan-500 to-blue-600" },
    { icon: Ticket, value: "2.4M+", label: "Tickets Issued", back: "Instant QR in 5 sec", gradient: "from-blue-600 to-indigo-600" },
    { icon: QrCode, value: "99.98%", label: "Scan Success", back: "Zero Entry Delays", gradient: "from-emerald-500 to-teal-600" },
    { icon: Zap, value: "2.1 Sec", label: "Avg Booking", back: "Fastest in India", gradient: "from-purple-500 to-pink-600" },
    { icon: Wallet, value: "₹520Cr+", label: "Processed", back: "Bank-Grade Security", gradient: "from-indigo-600 to-purple-600" },
    { icon: TrendingUp, value: "87%", label: "Events Sold Out", back: "Thanks to Referral Magic", gradient: "from-pink-500 to-rose-600" },
  ];

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-blue-950 via-blue-900 to-indigo-950 relative overflow-hidden">
      {}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-80 h-80 md:w-96 md:h-96 bg-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 h-72 md:w-80 md:h-80 bg-blue-400 rounded-full blur-3xl opacity-20 animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 text-center">

        {}
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
          Numbers That
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-300">
            Speak Louder
          </span>
        </h2>
        <p className="text-lg md:text-xl text-blue-200 max-w-3xl mx-auto mb-12">
          Trusted by India’s fastest-growing college event ecosystem
        </p>

        {}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">

          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group h-56 md:h-64 perspective-1000"
              >
                <div className="relative w-full h-full duration-700 preserve-3d group-hover:rotate-y-180">

                  {}
                  <div className="absolute inset-0 backface-hidden">
                    <div className="h-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 flex flex-col items-center justify-center shadow-2xl">
                      <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4 shadow-xl`}>
                        <Icon className="w-9 h-9 md:w-11 md:h-11 text-white" />
                      </div>
                      <div className="text-1xl md:text-3xl lg:text-4xl font-black text-white">
                        {stat.value}
                      </div>
                      <div className="text-sm md:text-base font-bold text-cyan-300 mt-2">
                        {stat.label}
                      </div>
                    </div>
                  </div>

                  {}
                  <div className="absolute inset-0 rotate-y-180 backface-hidden">
                    <div className={`h-full bg-gradient-to-br ${stat.gradient} rounded-3xl p-6 flex flex-col items-center justify-center text-white shadow-2xl`}>
                      <h3 className="text-lg md:text-xl font-bold mb-2 text-center">
                        {stat.back.split(" ")[0]}<br className="sm:hidden" /> {stat.back.split(" ").slice(1).join(" ")}
                      </h3>
                      <p className="text-xs md:text-sm text-white/90 text-center leading-tight">
                        {stat.back.includes("Thanks") ? "Referral Magic" : stat.back.split(" ").slice(1).join(" ")}
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {}
        <div className="mt-16 inline-flex flex sm:flex-row items-center gap-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-md md:rounded-full px-6 py-5 shadow-2xl">
          <ShieldCheck className="w-10 h-10 md:w-12 md:h-12 text-cyan-400" />
          <div className="text-left">
            <div className="text-xl md:text-3xl font-black text-white">5 Lakh+</div>
            <div className="text-cyan-300 text-sm md:text-base">Happy Users • 18 States • 400+ Colleges</div>
          </div>
        </div>

      </div>

      {}
      <style jsx>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .group:hover .preserve-3d { transform: rotateY(180deg); }
      `}</style>
    </section>
  );
};

export default RotatingStatsSection;
