import React from 'react';
import HeroSection from './sections/HeroSection';
import StorySection from './sections/StorySection';
import ValuesSection from './sections/ValuesSection';
import TeamSection from './sections/TeamSection';
import AchievementsSection from './sections/AchievementsSection';

const About = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <StorySection />
      <ValuesSection />
      <TeamSection />
      <AchievementsSection />
    </div>
  );
};

export default About;
