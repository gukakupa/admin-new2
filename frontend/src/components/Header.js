import React, { useState } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { translations } from '../data/mockData';

const Header = ({ language, setLanguage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage(language === 'ka' ? 'en' : 'ka');
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 w-full bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer transition-transform duration-200 hover:scale-105" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img 
              src="https://customer-assets.emergentagent.com/job_techrescue-ge/artifacts/8fyncway_040db3e28698d949852f9558ab70bb7e_tplv-tiktokx-cropcenter_1080_1080-removebg-preview.png" 
              alt="DataLab Georgia Logo"
              className="h-10 w-auto object-contain"
              style={{
                filter: 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.4))'
              }}
            />
            <span className="text-xl font-bold text-white">DataLab Georgia</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-gray-300 hover:text-red-accent transition-colors duration-300"
            >
              {t.home}
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="text-gray-300 hover:text-red-accent transition-colors duration-300"
            >
              {t.services}
            </button>
            <button 
              onClick={() => scrollToSection('service-request')}
              className="text-gray-300 hover:text-red-accent transition-colors duration-300"
            >
              {t.serviceRequestTitle}
            </button>
            <button 
              onClick={() => scrollToSection('case-tracking')}
              className="text-gray-300 hover:text-red-accent transition-colors duration-300"
            >
              {t.caseTracking}
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-gray-300 hover:text-red-accent transition-colors duration-300"
            >
              {t.contact}
            </button>
          </nav>

          {/* Language Toggle & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="text-gray-300 hover:text-red-accent hover:bg-gray-800"
            >
              <Globe className="w-4 h-4 mr-1" />
              {language === 'ka' ? 'EN' : 'KA'}
            </Button>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-gray-300 hover:text-red-accent"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-800 border-t border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button 
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-gray-300 hover:text-red-accent hover:bg-gray-700 rounded-md"
              >
                {t.home}
              </button>
              <button 
                onClick={() => scrollToSection('services')}
                className="block w-full text-left px-3 py-2 text-gray-300 hover:text-red-accent hover:bg-gray-700 rounded-md"
              >
                {t.services}
              </button>
              <button 
                onClick={() => scrollToSection('service-request')}
                className="block w-full text-left px-3 py-2 text-gray-300 hover:text-red-accent hover:bg-gray-700 rounded-md"
              >
                {t.serviceRequestTitle}
              </button>
              <button 
                onClick={() => scrollToSection('case-tracking')}
                className="block w-full text-left px-3 py-2 text-gray-300 hover:text-red-accent hover:bg-gray-700 rounded-md"
              >
                {t.caseTracking}
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="block w-full text-left px-3 py-2 text-gray-300 hover:text-red-accent hover:bg-gray-700 rounded-md"
              >
                {t.contact}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;