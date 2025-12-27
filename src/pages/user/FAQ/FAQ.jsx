import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, HelpCircle } from 'lucide-react';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState({});

  const faqData = [
    {
      category: 'Getting Started',
      questions: [
        {
          id: 1,
          question: 'How do I create my first club on SRS?',
          answer: 'Creating your club is simple! Sign up for an account, click on "Create Club" in your dashboard, fill in your club details including name, description, and club type. You can customize your club settings and start inviting members immediately.'
        },
        {
          id: 2,
          question: 'Is there a free trial available?',
          answer: 'Yes! We offer a 14-day free trial with full access to all features. No credit card required to start. You can upgrade to a paid plan anytime during or after your trial period.'
        },
        {
          id: 3,
          question: 'How do I invite members to my club?',
          answer: 'You can invite members through multiple ways: send email invitations directly from your dashboard, share a unique club link, import contacts from CSV files, or use our QR code feature for in-person events.'
        }
      ]
    },
    {
      category: 'Features & Functionality',
      questions: [
        {
          id: 4,
          question: 'Can I customize the look and feel of my club page?',
          answer: 'Absolutely! SRS offers extensive customization options including custom logos, color schemes, banners, and layout preferences. Premium plans include white-labeling options for complete branding control.'
        },
        {
          id: 5,
          question: 'How does event management work?',
          answer: 'Our event management system allows you to create events with detailed descriptions, set dates and locations, manage RSVPs, send reminders, and track attendance. You can also set up recurring events and collect payments for paid events.'
        },
        {
          id: 6,
          question: 'What payment methods do you support?',
          answer: 'We integrate with Razorpay to support all major credit cards, debit cards, net banking, UPI, and digital wallets. All transactions are secure and PCI compliant.'
        }
      ]
    },
    {
      category: 'Billing & Plans',
      questions: [
        {
          id: 7,
          question: 'What are the different pricing plans?',
          answer: 'We offer three main plans: Basic ($29/month) for small clubs, Pro ($79/month) for growing communities, and Enterprise ($199/month) for large organizations. Each plan includes different features and member limits.'
        },
        {
          id: 8,
          question: 'Can I change my plan anytime?',
          answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately for upgrades, while downgrades take effect at the start of your next billing cycle.'
        },
        {
          id: 9,
          question: 'Do you offer discounts for annual payments?',
          answer: 'Yes! We offer a 20% discount when you pay annually instead of monthly. Nonprofit organizations can also contact us for special pricing.'
        }
      ]
    },
    {
      category: 'Technical Support',
      questions: [
        {
          id: 10,
          question: 'Is my data secure?',
          answer: 'Security is our top priority. We use enterprise-grade encryption, regular security audits, secure data centers, and comply with GDPR and other data protection regulations. Your data is backed up daily and stored securely.'
        },
        {
          id: 11,
          question: 'Do you have a mobile app?',
          answer: 'Our web platform is fully responsive and works great on mobile devices with an app-like experience. We\'re currently developing dedicated iOS and Android apps, which will be available in early 2025.'
        },
        {
          id: 12,
          question: 'How do I export my data?',
          answer: 'You can export your club data anytime from the settings panel. We provide exports in CSV and JSON formats including member lists, event data, and analytics. Enterprise customers get additional export options.'
        }
      ]
    }
  ];

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredFAQ = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
           q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <HelpCircle size={80} className="mx-auto mb-8 text-yellow-400" />
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Frequently Asked
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500"> Questions</span>
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Find answers to common questions about SRS features, billing, and more.
          </p>
          
          {}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          {filteredFAQ.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No results found</h3>
              <p className="text-gray-600">Try adjusting your search terms or browse all categories below.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {filteredFAQ.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                    {category.category}
                  </h2>
                  <div className="space-y-4">
                    {category.questions.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
                      >
                        <button
                          onClick={() => toggleItem(item.id)}
                          className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <h3 className="text-lg font-semibold text-gray-900 pr-4">
                            {item.question}
                          </h3>
                          {openItems[item.id] ? (
                            <ChevronUp size={24} className="text-blue-600 flex-shrink-0" />
                          ) : (
                            <ChevronDown size={24} className="text-gray-400 flex-shrink-0" />
                          )}
                        </button>
                        {openItems[item.id] && (
                          <div className="px-8 pb-6">
                            <div className="border-t border-gray-200 pt-4">
                              <p className="text-gray-700 leading-relaxed">
                                {item.answer}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Still Have Questions?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Our support team is here to help. Get in touch and we'll respond within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
              Contact Support
            </button>
            <button className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-8 py-4 rounded-lg font-semibold transition-all duration-300">
              Schedule a Call
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
