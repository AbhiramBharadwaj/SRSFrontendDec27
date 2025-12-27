import React from 'react';
import { Shield, Lock, Eye, UserCheck, FileText, Globe } from 'lucide-react';

const Privacy = () => {
  const sections = [
    {
      icon: FileText,
      title: 'Information We Collect',
      content: `We collect information you provide directly to us, such as when you create an account, join a club, or contact us for support. This includes your name, email address, profile information, and any content you post or share through our platform.

We also automatically collect certain information about your device and usage of our services, including IP address, browser type, operating system, and activity data to improve our services and ensure security.`
    },
    {
      icon: Lock,
      title: 'How We Use Your Information',
      content: `We use your information to provide, maintain, and improve our services, including facilitating club management, event organization, and member communication. We may also use your information to send you important updates, security alerts, and promotional materials (which you can opt out of at any time).

Your information helps us personalize your experience, provide customer support, and ensure the security and integrity of our platform.`
    },
    {
      icon: UserCheck,
      title: 'Information Sharing',
      content: `We do not sell, rent, or trade your personal information to third parties. We may share your information only in the following circumstances:

• With club administrators and members as necessary for club functionality
• With service providers who assist us in operating our platform
• When required by law or to protect our rights and safety
• In connection with a business transfer or acquisition

We always ensure that any third parties we work with maintain appropriate privacy and security standards.`
    },
    {
      icon: Shield,
      title: 'Data Security',
      content: `We implement industry-standard security measures to protect your personal information, including encryption of data in transit and at rest, regular security audits, and access controls.

While we take every precaution to protect your information, no method of transmission over the internet is 100% secure. We continuously monitor and update our security practices to address emerging threats and maintain the highest level of protection for your data.`
    },
    {
      icon: Eye,
      title: 'Your Privacy Rights',
      content: `You have the right to access, update, or delete your personal information at any time. You can do this through your account settings or by contacting our support team.

You also have the right to opt out of promotional communications, request a copy of your data, and in some jurisdictions, request that we restrict or stop processing your information.`
    },
    {
      icon: Globe,
      title: 'International Transfers',
      content: `Our services are hosted and operated in the United States. If you are accessing our services from outside the US, please be aware that your information may be transferred to, stored, and processed in the United States.

We ensure that all international transfers of personal data are conducted in accordance with applicable data protection laws and regulations.`
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Shield size={80} className="mx-auto mb-8 text-green-400" />
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Privacy
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500"> Policy</span>
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Your privacy is important to us. Learn how we collect, use, and protect your information.
          </p>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <p className="text-blue-100">
              <strong>Last updated:</strong> March 15, 2024
            </p>
          </div>
        </div>
      </section>

      {}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Introduction</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              At SRS Club Management System ("SRS," "we," "us," or "our"), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, share, and protect information about you when you use our services.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              By using our services, you agree to the collection and use of information in accordance with this policy. We encourage you to read this policy carefully and contact us if you have any questions.
            </p>
          </div>

          <div className="space-y-8">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-start space-x-6">
                    {/* <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Icon size={28} className="text-white" />
                    </div> */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        {section.title}
                      </h3>
                      <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {section.content}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {}
          <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Questions About Privacy?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              If you have any questions about this Privacy Policy or our data practices, please don't hesitate to contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                Contact Privacy Team
              </button>
              <button className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-8 py-4 rounded-lg font-semibold transition-all duration-300">
                Download PDF
              </button>
            </div>
          </div>

          {}
          <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Data Rights</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">Access your data</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">Update your information</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">Delete your account</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">Opt out of marketing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">Export your data</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">Report privacy concerns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;
