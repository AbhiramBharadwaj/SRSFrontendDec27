import React from 'react';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Club President',
      organization: 'Tech Innovators Club',
      image: 'https://images.pexels.com/photos/1181414/pexels-photo-1181414.jpeg?auto=compress&cs=tinysrgb&w=150',
      quote: 'SRS has transformed how we manage our club. The event planning tools are incredible and our member engagement has increased by 300%.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Event Coordinator',
      organization: 'Professional Network Hub',
      image: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150',
      quote: 'The analytics and insights have helped us make data-driven decisions. Our events are now more successful than ever before.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Community Manager',
      organization: 'Creative Arts Society',
      image: 'https://images.pexels.com/photos/1181563/pexels-photo-1181563.jpeg?auto=compress&cs=tinysrgb&w=150',
      quote: 'The mobile app makes it so easy for our members to stay connected and participate in events. Highly recommended!',
      rating: 5
    },
    {
      name: 'David Thompson',
      role: 'Membership Director',
      organization: 'Business Leaders Forum',
      image: 'https://images.pexels.com/photos/1516673/pexels-photo-1516673.jpeg?auto=compress&cs=tinysrgb&w=150',
      quote: 'Payment processing is seamless and secure. We\'ve seen a significant increase in membership renewals since switching to SRS.',
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            What Our
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600"> Members Say</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from club leaders who have transformed their communities with SRS.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 p-8 rounded-2xl relative hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <Quote size={40} className="text-blue-500 opacity-20 absolute top-6 right-6" />
              
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-gray-600">{testimonial.role}</p>
                  <p className="text-blue-600 font-medium text-sm">{testimonial.organization}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={20} className="text-yellow-500 fill-current" />
                ))}
              </div>

              <p className="text-gray-700 italic text-lg leading-relaxed">
                "{testimonial.quote}"
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Join 10,000+ Happy Club Leaders
            </h3>
            <p className="text-gray-600 mb-6">
              Start your free trial today and see why clubs worldwide choose SRS.
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
              Start Free Trial
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
