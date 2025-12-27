import React from 'react';
import { Calendar, Lightbulb, Rocket } from 'lucide-react';

const StorySection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
              Our
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Story</span>
            </h2>
            <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
              <p>
                Founded in 2020, SRS began as a simple idea: what if managing a club or community could be as easy as sending a text message? Our founders, experienced community leaders themselves, were frustrated by the complexity and cost of existing solutions.
              </p>
              <p>
                After countless late nights and feedback from hundreds of club leaders, we launched SRS with a clear vision: to democratize community management and make powerful tools accessible to organizations of all sizes.
              </p>
              <p>
                Today, we're proud to serve thousands of clubs worldwide, from small local groups to large international organizations, helping them build stronger, more engaged communities.
              </p>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Our team working"
              className="w-full h-96 object-cover rounded-3xl shadow-2xl"
            />
          </div>
        </div>

        {}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-16">Our Journey</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Lightbulb size={28} className="text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">2020 - The Idea</h4>
              <p className="text-gray-600">
                Identified the need for better club management tools after experiencing frustrations firsthand.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Calendar size={28} className="text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">2021 - First Launch</h4>
              <p className="text-gray-600">
                Launched MVP with 50 beta clubs, focusing on event management and member engagement.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Rocket size={28} className="text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">2024 - Scale Up</h4>
              <p className="text-gray-600">
                Serving 100+ clubs with advanced analytics, payments, and mobile-first design.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
