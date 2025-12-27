import React from 'react';
import { Trophy, Star, Users, Globe } from 'lucide-react';

const AchievementsSection = () => {
  const achievements = [
    {
      icon: Trophy,
      title: 'Best SaaS Platform 2023',
      organization: 'TechCrunch Awards',
      date: '2023'
    },
    {
      icon: Star,
      title: 'Top Rated Software',
      organization: 'G2 Reviews',
      date: '2023'
    },
    {
      icon: Users,
      title: 'Community Choice Award',
      organization: 'Product Hunt',
      date: '2022'
    },
    {
      icon: Globe,
      title: 'Global Innovation Award',
      organization: 'Web Summit',
      date: '2022'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Recognition &
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500"> Awards</span>
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            We're honored to be recognized by industry leaders and our amazing community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Icon size={28} className="text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">{achievement.title}</h3>
                <p className="text-blue-200 mb-2">{achievement.organization}</p>
                <p className="text-yellow-400 font-semibold">{achievement.date}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-20 text-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20">
            <h3 className="text-3xl font-bold mb-6">
              Ready to Join Our Success Story?
            </h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Become part of the SRS community and experience why thousands of clubs trust us with their growth.
            </p>
            <button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
              Start Your Free Trial
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
