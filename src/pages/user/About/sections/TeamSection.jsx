import React from 'react';
import { Linkedin, Twitter } from 'lucide-react';

const TeamSection = () => {
  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Co-Founder',
      image: 'https://images.pexels.com/photos/1181414/pexels-photo-1181414.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Former community manager with 10+ years experience building engaged communities.',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: 'Michael Chen',
      role: 'CTO & Co-Founder',
      image: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Senior software architect passionate about scalable and user-friendly platforms.',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Design',
      image: 'https://images.pexels.com/photos/1181563/pexels-photo-1181563.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'UX/UI designer focused on creating intuitive experiences for diverse users.',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: 'David Thompson',
      role: 'VP of Engineering',
      image: 'https://images.pexels.com/photos/1516673/pexels-photo-1516673.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Full-stack developer with expertise in modern web technologies and APIs.',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: 'Lisa Park',
      role: 'Head of Marketing',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Growth marketing specialist helping communities discover and adopt SRS.',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: 'Alex Kumar',
      role: 'Customer Success',
      image: 'https://images.pexels.com/photos/1516778/pexels-photo-1516778.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Dedicated to ensuring every club achieves success with our platform.',
      linkedin: '#',
      twitter: '#'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Meet Our
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"> Team</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The passionate individuals behind SRS, dedicated to empowering communities worldwide.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex space-x-3">
                    <a
                      href={member.linkedin}
                      className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                    >
                      <Linkedin size={20} className="text-white" />
                    </a>
                    <a
                      href={member.twitter}
                      className="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors"
                    >
                      <Twitter size={20} className="text-white" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-purple-600 font-semibold mb-4">{member.role}</p>
                <p className="text-gray-600 leading-relaxed">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
