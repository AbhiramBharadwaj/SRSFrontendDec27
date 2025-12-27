import React from 'react';
import HeroSection from './HeroSection';
import HowItWorks from './FeaturesSection';
import GuestExperienceSection from './MembershipSection';
import RotatingStatsSection from './StatsSection';
// import BlogSection from './BlogSection';
import NewsletterSection from './NewsletterSection';
import ReferralDiscountSection from './BlogSection';


const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <HowItWorks />
      {/* <EventsSection /> */}
      <GuestExperienceSection />
      <RotatingStatsSection />
      {/* <Tes /> */}
      <ReferralDiscountSection />
      {/* <P /> */}
      <NewsletterSection />
      {/* <FooterSection /> */}
    </div>
  );
};

export default Home;