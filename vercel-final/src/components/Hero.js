import React from 'react';
import { ArrowRight, Shield, Clock, Award } from 'lucide-react';
import { Button } from './ui/button';
import { translations } from '../data/mockData';

const Hero = ({ language }) => {
  const t = translations[language];

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToServices = () => {
    const element = document.getElementById('services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const stats = [
    { icon: Shield, value: "99%", labelKa: "წარმატების მაჩვენებელი", labelEn: "Success Rate" },
    { icon: Clock, value: "24/7", labelKa: "მხარდაჭერა", labelEn: "Support" },
    { icon: Award, value: "5+", labelKa: "წლიანი გამოცდილება", labelEn: "Years Experience" }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(239, 68, 68, 0.3) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text">
              {t.heroTitle}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            {t.heroSubtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button 
              onClick={scrollToServices}
              className="bg-red-accent hover-red-accent glow-red text-white px-8 py-4 text-lg font-semibold"
              size="lg"
            >
              {t.getStarted}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <Button 
              onClick={scrollToContact}
              variant="outline"
              className="border-red-accent text-red-accent hover:bg-red-accent hover:text-white px-8 py-4 text-lg font-semibold"
              size="lg"  
            >
              {t.freeConsultation}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-accent/10 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-red-accent" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">
                  {language === 'ka' ? stat.labelKa : stat.labelEn}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-red-accent rounded-full animate-pulse opacity-60"></div>
      <div className="absolute top-40 right-20 w-2 h-2 bg-red-accent rounded-full animate-pulse opacity-40"></div>
      <div className="absolute bottom-20 left-20 w-3 h-3 bg-red-accent rounded-full animate-pulse opacity-50"></div>
      <div className="absolute bottom-40 right-10 w-5 h-5 bg-red-accent rounded-full animate-pulse opacity-30"></div>
    </section>
  );
};

export default Hero;