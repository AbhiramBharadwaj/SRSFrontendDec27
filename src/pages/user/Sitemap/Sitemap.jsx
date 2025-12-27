import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Calendar, 
  CreditCard, 
  MessageSquare, 
  HelpCircle, 
  Shield, 
  Map,
  ExternalLink,
  ArrowRight
} from 'lucide-react';

const Sitemap = () => {
  const siteStructure = [
    {
      category: 'Main Pages',
      icon: Home,
      pages: [
        { name: 'Home', path: '/', description: 'Welcome to SRS Club Management System' },
        { name: 'About Us', path: '/about', description: 'Learn about our story, team, and mission' },
        { name: 'Contact', path: '/contact', description: 'Get in touch with our team' }
      ]
    },
    {
      category: 'Core Features',
      icon: Calendar,
      pages: [
        { name: 'Events', path: '/events', description: 'Discover and manage club events' },
        { name: 'Membership', path: '/membership', description: 'Join or manage your club membership' }
      ]
    },
    {
      category: 'Support & Legal',
      icon: HelpCircle,
      pages: [
        { name: 'FAQ', path: '/faq', description: 'Frequently asked questions and answers' },
        { name: 'Privacy Policy', path: '/privacy', description: 'How we handle and protect your data' },
        { name: 'Sitemap', path: '/sitemap', description: 'Navigate our website structure' }
      ]
    },
    {
      category: 'External Resources',
      icon: ExternalLink,
      pages: [
        { name: 'Documentation', path: '#', description: 'API docs and integration guides', external: true },
        { name: 'Blog', path: '#', description: 'Latest updates and community insights', external: true },
        { name: 'Help Center', path: '#', description: 'Comprehensive help and tutorials', external: true },
        { name: 'Status Page', path: '#', description: 'System status and uptime monitoring', external: true }
      ]
    }
  ];

  const quickActions = [
    {
      title: 'Start Free Trial',
      description: 'Get started with SRS today',
      icon: ArrowRight,
      color: 'from-blue-600 to-purple-600'
    },
    {
      title: 'Schedule Demo',
      description: 'See SRS in action',
      icon: Calendar,
      color: 'from-green-600 to-teal-600'
    },
    {
      title: 'Contact Sales',
      description: 'Speak with our team',
      icon: MessageSquare,
      color: 'from-orange-600 to-red-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Map size={80} className="mx-auto mb-8 text-blue-400" />
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Site
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-500"> Map</span>
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Navigate through our website and find exactly what you're looking for.
          </p>
        </div>
      </section>

      {}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {}
            <div className="lg:col-span-2 space-y-12">
              {siteStructure.map((section, index) => {
                const Icon = section.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="flex items-center space-x-4 mb-8">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                        <Icon size={28} className="text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900">
                        {section.category}
                      </h2>
                    </div>

                    <div className="grid gap-4">
                      {section.pages.map((page, pageIndex) => (
                        <div
                          key={pageIndex}
                          className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              {page.external ? (
                                <a
                                  href={page.path}
                                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                                >
                                  <span>{page.name}</span>
                                  <ExternalLink size={16} />
                                </a>
                              ) : (
                                <Link
                                  to={page.path}
                                  className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                                >
                                  {page.name}
                                </Link>
                              )}
                              <p className="text-gray-600 text-sm mt-1">
                                {page.description}
                              </p>
                            </div>
                            <ArrowRight 
                              size={20} 
                              className="text-gray-400 group-hover:text-blue-600 transition-colors"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {}
            <div className="space-y-8">
              {}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                <div className="space-y-4">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={index}
                        className={`w-full bg-gradient-to-r ${action.color} hover:shadow-lg text-white p-4 rounded-lg transition-all duration-300 transform hover:scale-105 group`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon size={20} />
                          <div className="text-left">
                            <div className="font-semibold">{action.title}</div>
                            <div className="text-sm opacity-90">{action.description}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Need Help?</h3>
                <p className="text-gray-600 mb-6">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <MessageSquare size={18} className="text-blue-600" />
                    <span className="text-gray-700">Live Chat Support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <HelpCircle size={18} className="text-blue-600" />
                    <span className="text-gray-700">Help Documentation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users size={18} className="text-blue-600" />
                    <span className="text-gray-700">Community Forum</span>
                  </div>
                </div>
              </div>

              {}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Popular Pages</h3>
                <div className="space-y-3">
                  <Link to="/" className="block text-blue-600 hover:text-blue-800 transition-colors">
                    → Getting Started Guide
                  </Link>
                  <Link to="/about" className="block text-blue-600 hover:text-blue-800 transition-colors">
                    → Feature Overview
                  </Link>
                  <Link to="/faq" className="block text-blue-600 hover:text-blue-800 transition-colors">
                    → Pricing Calculator
                  </Link>
                  <Link to="/contact" className="block text-blue-600 hover:text-blue-800 transition-colors">
                    → API Reference
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of clubs already using SRS to manage their communities.
          </p>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
            Start Your Free Trial
          </button>
        </div>
      </section>
    </div>
  );
};

export default Sitemap;
