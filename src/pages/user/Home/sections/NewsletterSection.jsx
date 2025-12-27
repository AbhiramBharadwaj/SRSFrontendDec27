import React, { useState } from 'react';
import { Mail, CheckCircle, Sparkles, Lightbulb, Gift, Send, ArrowRight } from 'lucide-react';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
      }, 4000);
    }
  };

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-400 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600 rounded-full filter blur-3xl opacity-10 animate-ping"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 text-center">
        {}
        <div className="mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-500/20 backdrop-blur-md border border-blue-400/30 rounded-full mb-6">
            <Sparkles className="w-6 h-6 text-cyan-300" />
            <span className="text-cyan-300 font-medium tracking-wider">Exclusive Updates</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Never Miss an{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-300">
              Update
            </span>
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Join 50,000+ event organizers getting weekly insights, new features, and exclusive strategies 
            delivered straight to their inbox.
          </p>
        </div>

        {}
        <div className="max-w-2xl mx-auto mb-20">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-2xl">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-5">
              <div className="flex-1 relative group">
                <Mail className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-blue-300 pointer-events-none z-10" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full pl-16 pr-6 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-blue-200 
                           focus:outline-none focus:ring-4 focus:ring-cyan-400/50 focus:border-cyan-400 
                           backdrop-blur-md transition-all duration-300 text-lg"
                />
              </div>

              <button
                type="submit"
                disabled={isSubscribed}
                className={`relative overflow-hidden px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-500 transform hover:scale-105
                  ${isSubscribed 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-2xl hover:shadow-cyan-500/50'
                  } disabled:cursor-not-allowed`}
              >
                <span className={`flex items-center justify-center gap-3 ${isSubscribed ? 'animate-pulse' : ''}`}>
                  {isSubscribed ? (
                    <>
                      <CheckCircle className="w-7 h-7" />
                      <span>Subscribed!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-6 h-6" />
                      <span>Subscribe Now</span>
                      <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </form>

            <p className="text-blue-200 text-sm mt-6 flex items-center justify-center gap-2">
              <span className="inline-flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-cyan-400" />
                No spam ever • Unsubscribe anytime
              </span>
            </p>
          </div>
        </div>

        {}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              icon: <Mail className="w-10 h-10" />,
              title: "Weekly Insights",
              desc: "Latest trends, features, and event strategies delivered every Monday",
              gradient: "from-blue-500 to-cyan-500"
            },
            {
              icon: <Lightbulb className="w-10 h-10" />,
              title: "Pro Tips & Tricks",
              desc: "Expert advice to grow your events and engage your community better",
              gradient: "from-indigo-500 to-purple-500"
            },
            {
              icon: <Gift className="w-10 h-10" />,
              title: "Exclusive Access",
              desc: "Early access to new features, beta tools, and special partner offers",
              gradient: "from-cyan-400 to-blue-600"
            }
          ].map((item, index) => (
            <div
              key={index}
              className="group relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 
                       hover:bg-white/20 hover:border-cyan-400/50 transition-all duration-500 
                       hover:-translate-y-3 hover:shadow-2xl"
            >
              <div className={`inline-flex p-5 rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-xl mb-6 
                            group-hover:scale-110 transition-transform duration-300`}>
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
              <p className="text-blue-100 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {}
        <div className="mt-20 text-center">
          <p className="text-blue-200 text-lg">
            Trusted by <span className="text-3xl font-bold text-cyan-400">50,000+</span> event organizers worldwide
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
