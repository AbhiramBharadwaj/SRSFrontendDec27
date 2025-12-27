import React from 'react';
import { Users, Target, Award } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white overflow-hidden py-20">
      <div className="absolute inset-0 bg-black opacity-30"></div>
      
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
            About
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500"> SRS</span>
          </h1>
          <p className="text-xl lg:text-2xl text-purple-100 max-w-4xl mx-auto leading-relaxed">
            We're on a mission to revolutionize how clubs and communities connect, engage, and thrive in the digital age.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users size={40} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">50,000+</h3>
            <p className="text-purple-200">Happy Members</p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Target size={40} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">100+</h3>
            <p className="text-purple-200">Partner Clubs</p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Award size={40} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">25+</h3>
            <p className="text-purple-200">Industry Awards</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
