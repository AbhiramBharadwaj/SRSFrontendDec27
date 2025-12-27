import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-white">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 py-20 text-center">
        {}
        <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 text-sm font-bold mb-8 inline-block">
          <Sparkles className="w-4 h-4 text-gray-600" />
          Trusted by 18,000+ College Clubs
        </div>

        {}
        <h1 className="font-black text-gray-900 text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.9] tracking-tight max-w-5xl mx-auto whitespace-nowrap">
          Sell Out Every Event
        </h1>
        <h2 className="font-black text-gray-900 text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight mt-4 max-w-5xl mx-auto whitespace-nowrap">
          In Record Time
        </h2>

        {}
        <p className="mt-8 max-w-2xl mx-auto text-gray-700 text-lg sm:text-xl md:text-2xl font-semibold leading-relaxed">
          Guests get up to <span className="text-gray-900 font-black">70% off</span> • Instant QR tickets • Zero queue entry
        </p>

        {}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center max-w-xs mx-auto">
          <button className="group flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-3xl font-bold text-base shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-black whitespace-nowrap">
            Start Free Instantly
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button className="group flex items-center justify-center gap-2 bg-white border-2 border-gray-300 hover:border-black hover:bg-black hover:text-white px-8 py-4 rounded-3xl font-bold text-base shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 whitespace-nowrap">
            Watch 60s Demo
            <Sparkles className="w-4 h-4" />
          </button>
        </div>

        {}
        <div className="mt-20 flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-16 text-center">
          <div>
            <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900">2.4M+</div>
            <div className="text-gray-700 text-sm sm:text-base font-semibold mt-2 tracking-wide">Tickets Sold</div>
          </div>
          
          <div className="hidden sm:block w-px h-16 bg-gray-300" />
          
          <div>
            <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900">₹520Cr+</div>
            <div className="text-gray-700 text-sm sm:text-base font-semibold mt-2 tracking-wide">Revenue</div>
          </div>
          
          <div className="hidden sm:block w-px h-16 bg-gray-300" />
          
          <div>
            <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900">400+</div>
            <div className="text-gray-700 text-sm sm:text-base font-semibold mt-2 tracking-wide">Colleges</div>
          </div>
        </div>

        {}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center p-8 hover:-translate-y-2 transition-transform duration-300 group">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6 border border-gray-200 hover:bg-gray-100 transition-all group-hover:shadow-lg">
              <Sparkles className="w-8 h-8 text-gray-700" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">Instant QR Tickets</h3>
            <p className="text-gray-600 font-medium text-sm leading-relaxed max-w-sm">Delivered in 5 seconds, scan & enter</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-8 hover:-translate-y-2 transition-transform duration-300 group">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6 border border-gray-200 hover:bg-gray-100 transition-all group-hover:shadow-lg">
              <ArrowRight className="w-8 h-8 text-gray-700 rotate-[-45deg]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">70% Guest Discounts</h3>
            <p className="text-gray-600 font-medium text-sm leading-relaxed max-w-sm">Fill seats fast with referral magic</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-8 hover:-translate-y-2 transition-transform duration-300 group">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6 border border-gray-200 hover:bg-gray-100 transition-all group-hover:shadow-lg">
              <Sparkles className="w-8 h-8 text-gray-700" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">Zero Queue Entry</h3>
            <p className="text-gray-600 font-medium text-sm leading-relaxed max-w-sm">Lightning fast entry, happy guests</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
