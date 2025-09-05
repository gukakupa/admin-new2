import React from 'react';
import { Phone, Mail, MapPin, ExternalLink, HardDrive } from 'lucide-react';
import { translations } from '../data/mockData';

const Footer = ({ language }) => {
  const t = translations[language];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const quickLinks = [
    { key: 'services', id: 'services' },
    { key: 'serviceRequestTitle', id: 'service-request' },
    { key: 'priceEstimationTitle', id: 'price-estimation' },
    { key: 'caseTracking', id: 'case-tracking' },
    { key: 'contact', id: 'contact' }
  ];

  const serviceLinks = [
    { labelKa: 'HDD აღდგენა', labelEn: 'HDD Recovery' },
    { labelKa: 'SSD აღდგენა', labelEn: 'SSD Recovery' },
    { labelKa: 'RAID აღდგენა', labelEn: 'RAID Recovery' },
    { labelKa: 'უსბ აღდგენა', labelEn: 'USB Recovery' },
    { labelKa: 'SD ბარათი', labelEn: 'SD Card Recovery' }
  ];

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-accent rounded-lg flex items-center justify-center">
                <HardDrive className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">DataLab Georgia</span>
            </div>
            
            <p className="text-gray-400 leading-relaxed">
              {t.footerDesc}
            </p>

            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-500 text-sm font-medium">
                {language === 'ka' ? 'ონლაინ' : 'Online'}
              </span>
              <span className="text-gray-400 text-sm">24/7</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">
              {t.quickLinks}
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="text-gray-400 hover:text-red-accent transition-colors duration-300 flex items-center group"
                  >
                    <span>{t[link.key]}</span>
                    <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">
              {t.services}
            </h3>
            <ul className="space-y-3">
              {serviceLinks.map((service, index) => (
                <li key={index}>
                  <span className="text-gray-400 hover:text-red-accent transition-colors duration-300 cursor-pointer">
                    {language === 'ka' ? service.labelKa : service.labelEn}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">
              {t.contactInfo}
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-red-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">+995 XXX XXX XXX</p>
                  <p className="text-gray-400 text-sm">
                    {language === 'ka' ? '24/7 ხელმისაწვდომი' : 'Available 24/7'}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-red-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">info@datalabgeorgia.ge</p>
                  <p className="text-gray-400 text-sm">
                    {language === 'ka' ? 'სწრაფი პასუხი' : 'Quick response'}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-red-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">
                    {language === 'ka' ? 'თბილისი, საქართველო' : 'Tbilisi, Georgia'}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {language === 'ka' ? 'ოფისში ვიზიტი' : 'Office visits'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 DataLab Georgia. {t.allRightsReserved}
            </div>
            
            <div className="flex items-center space-x-6">
              <span className="text-gray-400 text-sm">
                {language === 'ka' ? 'გაჩუქებულია' : 'Powered by'}
              </span>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-red-accent rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">E</span>
                </div>
                <span className="text-gray-400 text-sm">Emergent AI</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => scrollToSection('contact')}
          className="bg-red-accent hover-red-accent text-white p-4 rounded-full shadow-lg glow-red transition-all duration-300 hover:scale-110"
          title={language === 'ka' ? 'დაგვიკავშირდით' : 'Contact Us'}
        >
          <Phone className="w-6 h-6" />
        </button>
      </div>
    </footer>
  );
};

export default Footer;