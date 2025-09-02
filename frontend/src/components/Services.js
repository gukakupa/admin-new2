import React from 'react';
import { HardDrive, Shield, Wrench, Search, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { translations, services } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

const Services = ({ language }) => {
  const t = translations[language];
  const navigate = useNavigate();

  const getIcon = (iconName) => {
    const icons = {
      HardDrive,
      Shield, 
      Wrench,
      Search
    };
    return icons[iconName] || HardDrive;
  };

  return (
    <section id="services" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t.servicesTitle}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t.servicesSubtitle}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => {
            const IconComponent = getIcon(service.icon);
            return (
              <Card 
                key={service.id}
                className="service-card bg-gray-800 border-gray-700 hover:border-red-accent/50 group cursor-pointer"
              >
                <CardHeader className="text-center pb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-accent/10 rounded-full mb-4 mx-auto group-hover:bg-red-accent/20 transition-colors duration-300">
                    <IconComponent className="w-8 h-8 text-red-accent" />
                  </div>
                  <CardTitle className="text-xl font-bold text-white mb-2">
                    {t[service.titleKey]}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    {t[service.descKey]}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-300">
                        <ChevronRight className="w-4 h-4 text-red-accent mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="border-red-accent text-red-accent">
                      {service.price}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-red-accent hover:text-white hover:bg-red-accent"
                      onClick={() => {
                        if (service.id === 1) { // Data Recovery service
                          navigate('/data-recovery');
                        }
                      }}
                    >
                      {language === 'ka' ? 'დეტალურად' : 'Learn More'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <p className="text-lg text-gray-300 mb-6">
            {language === 'ka' 
              ? 'არ ხედავთ თქვენს საჭირო სერვისს? დაგვიკავშირდით!' 
              : "Don't see the service you need? Contact us!"
            }
          </p>
          <Button 
            className="bg-red-accent hover-red-accent text-white px-8 py-3"
            onClick={() => {
              const element = document.getElementById('contact');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {language === 'ka' ? 'კონსულტაცია' : 'Get Consultation'}
            <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;