import React from 'react';
import { Heart, Shield, Users, Zap } from 'lucide-react';

const ValuesSection = () => {
  const values = [
    {
      icon: Heart,
      title: 'Community First',
      description: 'Every decision we make is driven by what\'s best for our community of clubs and members.',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Security & Trust',
      description: 'We protect your data with enterprise-grade security and transparent practices.',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: Users,
      title: 'Inclusivity',
      description: 'Building tools that welcome everyone and support diverse communities worldwide.',
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Continuously pushing boundaries to create the most intuitive and powerful platform.',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Our
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600"> Values</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            These core principles guide everything we do and shape how we build for the future.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <Icon size={28} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{value.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-20 bg-gradient-to-r from-blue-50 to-purple-50 p-12 rounded-3xl text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">
            Join Our Mission
          </h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Help us build the future of community management. We're always looking for passionate individuals to join our team.
          </p>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
            View Open Positions
          </button>
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
