import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  HardDrive, 
  Zap, 
  Database, 
  Usb, 
  CreditCard,
  CheckCircle,
  Clock,
  Shield,
  ArrowRight,
  Phone,
  Mail,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DataRecovery = ({ language = 'ka' }) => {
  const navigate = useNavigate();

  const translations = {
    ka: {
      title: "მონაცემთა აღდგენის სერვისები",
      subtitle: "პროფესიონალური მონაცემთა აღდგენა ყველა ტიპის მოწყობილობიდან",
      backToHome: "მთავარზე დაბრუნება",
      getQuote: "ფასის გაანგარიშება",
      contactUs: "დაგვიკავშირდით",
      features: "თავისებურებები",
      pricing: "ფასები",
      process: "პროცესი",
      guarantee: "გარანტია",
      support: "24/7 მხარდაჭერა",
      freeConsultation: "უფასო კონსულტაცია",
      startRecovery: "აღდგენის დაწყება"
    },
    en: {
      title: "Data Recovery Services",
      subtitle: "Professional data recovery from all types of devices",
      backToHome: "Back to Home",
      getQuote: "Get Quote",
      contactUs: "Contact Us",
      features: "Features",
      pricing: "Pricing",
      process: "Process",
      guarantee: "Guarantee",
      support: "24/7 Support",
      freeConsultation: "Free Consultation",
      startRecovery: "Start Recovery"
    }
  };

  const t = translations[language];

  const recoveryServices = [
    {
      id: 'hdd',
      icon: HardDrive,
      titleKa: 'HDD აღდგენა',
      titleEn: 'HDD Recovery',
      descKa: 'მყარი დისკებიდან მონაცემთა აღდგენა მექანიკური და ლოგიკური დაზიანებების შემთხვევაში',
      descEn: 'Data recovery from hard drives in cases of mechanical and logical damage',
      features: [
        { ka: 'მექანიკური დაზიანება', en: 'Mechanical damage' },
        { ka: 'ლოგიკური კორუფცია', en: 'Logical corruption' },
        { ka: 'ფაილების წაშლა', en: 'Deleted files' },
        { ka: 'ფორმატირება', en: 'Formatted drives' },
        { ka: 'SMART შეცდომები', en: 'SMART errors' }
      ],
      pricing: {
        basic: { ka: '100₾', en: '100₾' },
        advanced: { ka: '200₾', en: '200₾' },
        complex: { ka: '350₾', en: '350₾' }
      },
      successRate: '95%',
      avgTime: { ka: '3-5 დღე', en: '3-5 days' }
    },
    {
      id: 'ssd',
      icon: Zap,
      titleKa: 'SSD აღდგენა',
      titleEn: 'SSD Recovery',
      descKa: 'SSD დისკებიდან მონაცემთა აღდგენა კონტროლერის დაზიანება და NAND ჩიპების პრობლემების შემთხვევაში',
      descEn: 'Data recovery from SSD drives in cases of controller damage and NAND chip problems',
      features: [
        { ka: 'კონტროლერის დაზიანება', en: 'Controller damage' },
        { ka: 'NAND ჩიპები', en: 'NAND chips' },
        { ka: 'ენკრიპტირებული SSD', en: 'Encrypted SSD' },
        { ka: 'TRIM კომანდა', en: 'TRIM command' },
        { ka: 'Wear leveling', en: 'Wear leveling' }
      ],
      pricing: {
        basic: { ka: '150₾', en: '150₾' },
        advanced: { ka: '300₾', en: '300₾' },
        complex: { ka: '500₾', en: '500₾' }
      },
      successRate: '85%',
      avgTime: { ka: '5-7 დღე', en: '5-7 days' }
    },
    {
      id: 'raid',
      icon: Database,
      titleKa: 'RAID აღდგენა',
      titleEn: 'RAID Recovery',
      descKa: 'RAID მასივებიდან მონაცემთა აღდგენა კონფიგურაციების ყველა დონისთვის',
      descEn: 'Data recovery from RAID arrays for all configuration levels',
      features: [
        { ka: 'RAID 0, 1, 5, 6, 10', en: 'RAID 0, 1, 5, 6, 10' },
        { ka: 'რამდენიმე დისკის გაფუჭება', en: 'Multiple disk failure' },
        { ka: 'კონტროლერის პრობლემები', en: 'Controller issues' },
        { ka: 'Virtual RAID', en: 'Virtual RAID' },
        { ka: 'NAS სისტემები', en: 'NAS systems' }
      ],
      pricing: {
        basic: { ka: '300₾', en: '300₾' },
        advanced: { ka: '600₾', en: '600₾' },
        complex: { ka: '1000₾', en: '1000₾' }
      },
      successRate: '90%',
      avgTime: { ka: '5-10 დღე', en: '5-10 days' }
    },
    {
      id: 'usb',
      icon: Usb,
      titleKa: 'USB აღდგენა',
      titleEn: 'USB Recovery',
      descKa: 'USB მეხსიერების მოწყობილობებიდან მონაცემთა აღდგენა',
      descEn: 'Data recovery from USB memory devices',
      features: [
        { ka: 'USB Flash დრაივები', en: 'USB Flash drives' },
        { ka: 'ფიზიკური დაზიანება', en: 'Physical damage' },
        { ka: 'კონტროლერის პრობლემები', en: 'Controller problems' },
        { ka: 'NAND მეხსიერება', en: 'NAND memory' },
        { ka: 'ფაილების კორუფცია', en: 'File corruption' }
      ],
      pricing: {
        basic: { ka: '80₾', en: '80₾' },
        advanced: { ka: '150₾', en: '150₾' },
        complex: { ka: '250₾', en: '250₾' }
      },
      successRate: '88%',
      avgTime: { ka: '2-3 დღე', en: '2-3 days' }
    },
    {
      id: 'sd',
      icon: CreditCard,
      titleKa: 'SD ბარათი აღდგენა',
      titleEn: 'SD Card Recovery',
      descKa: 'SD, microSD, CF ბარათებიდან მონაცემთა აღდგენა',
      descEn: 'Data recovery from SD, microSD, CF cards',
      features: [
        { ka: 'SD/microSD ბარათები', en: 'SD/microSD cards' },
        { ka: 'CF ბარათები', en: 'CF cards' },
        { ka: 'ფოტო/ვიდეო აღდგენა', en: 'Photo/Video recovery' },
        { ka: 'ფორმატირების შემდეგ', en: 'After formatting' },
        { ka: 'წყლით დაზიანება', en: 'Water damage' }
      ],
      pricing: {
        basic: { ka: '60₾', en: '60₾' },
        advanced: { ka: '120₾', en: '120₾' },
        complex: { ka: '200₾', en: '200₾' }
      },
      successRate: '92%',
      avgTime: { ka: '1-2 დღე', en: '1-2 days' }
    }
  ];

  const processSteps = [
    {
      step: 1,
      titleKa: 'შეფასება',
      titleEn: 'Assessment',
      descKa: 'უფასო დიაგნოსტიკა და პრობლემის განსაზღვრა',
      descEn: 'Free diagnostics and problem identification'
    },
    {
      step: 2,
      titleKa: 'ანალიზი',
      titleEn: 'Analysis', 
      descKa: 'ღრმა ტექნიკური ანალიზი და აღდგენის გეგმა',
      descEn: 'Deep technical analysis and recovery plan'
    },
    {
      step: 3,
      titleKa: 'აღდგენა',
      titleEn: 'Recovery',
      descKa: 'პროფესიონალური ინსტრუმენტებით მონაცემთა აღდგენა',
      descEn: 'Data recovery using professional tools'
    },
    {
      step: 4,
      titleKa: 'ვერიფიკაცია',
      titleEn: 'Verification',
      descKa: 'აღდგენილი მონაცემების შემოწმება და ტესტირება',
      descEn: 'Verification and testing of recovered data'
    }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 bg-gray-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(239, 68, 68, 0.3) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="border-red-accent text-red-accent hover:bg-red-accent hover:text-white mb-8"
            >
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
              {t.backToHome}
            </Button>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {t.title}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              {t.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => scrollToSection('services')}
                className="bg-red-accent hover-red-accent text-white px-8 py-3"
              >
                {t.getQuote}
              </Button>
              <Button 
                onClick={() => scrollToSection('contact')}
                variant="outline"
                className="border-red-accent text-red-accent hover:bg-red-accent hover:text-white px-8 py-3"
              >
                {t.freeConsultation}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {language === 'ka' ? 'ჩვენი სერვისები' : 'Our Services'}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {recoveryServices.map((service) => {
              const IconComponent = service.icon;
              return (
                <Card key={service.id} className="bg-gray-900 border-gray-700 hover:border-red-accent/50 transition-colors duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-red-accent/10 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-red-accent" />
                        </div>
                        <div>
                          <CardTitle className="text-xl text-white">
                            {language === 'ka' ? service.titleKa : service.titleEn}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="border-green-500 text-green-500">
                              {service.successRate} {language === 'ka' ? 'წარმატება' : 'success'}
                            </Badge>
                            <Badge variant="outline" className="border-blue-500 text-blue-500">
                              {language === 'ka' ? service.avgTime.ka : service.avgTime.en}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-gray-400">
                      {language === 'ka' ? service.descKa : service.descEn}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-6">
                      {/* Features */}
                      <div>
                        <h4 className="text-white font-semibold mb-3">{t.features}</h4>
                        <div className="space-y-2">
                          {service.features.map((feature, index) => (
                            <div key={index} className="flex items-center text-gray-300">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                              {language === 'ka' ? feature.ka : feature.en}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pricing */}
                      <div>
                        <h4 className="text-white font-semibold mb-3">{t.pricing}</h4>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-center">
                            <div className="text-green-500 font-bold">
                              {language === 'ka' ? service.pricing.basic.ka : service.pricing.basic.en}
                            </div>
                            <div className="text-xs text-gray-400">
                              {language === 'ka' ? 'ბაზისური' : 'Basic'}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-yellow-500 font-bold">
                              {language === 'ka' ? service.pricing.advanced.ka : service.pricing.advanced.en}
                            </div>
                            <div className="text-xs text-gray-400">
                              {language === 'ka' ? 'რთული' : 'Advanced'}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-red-500 font-bold">
                              {language === 'ka' ? service.pricing.complex.ka : service.pricing.complex.en}
                            </div>
                            <div className="text-xs text-gray-400">
                              {language === 'ka' ? 'კომპლექსური' : 'Complex'}
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button 
                        className="w-full bg-red-accent hover-red-accent text-white"
                        onClick={() => navigate('/#service-request')}
                      >
                        {t.startRecovery}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {language === 'ka' ? 'აღდგენის პროცესი' : 'Recovery Process'}
            </h2>
            <p className="text-xl text-gray-300">
              {language === 'ka' 
                ? 'ნაბიჯ-ნაბიჯ პროცესი თქვენი მონაცემების უსაფრთხო აღდგენისთვის'
                : 'Step-by-step process for safe recovery of your data'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-red-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">{step.step}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {language === 'ka' ? step.titleKa : step.titleEn}
                </h3>
                <p className="text-gray-400">
                  {language === 'ka' ? step.descKa : step.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-red-accent/10 border border-red-accent/20 rounded-lg p-8">
            <Shield className="w-16 h-16 text-red-accent mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              {language === 'ka' ? 'ჩვენი გარანტია' : 'Our Guarantee'}
            </h2>
            <p className="text-xl text-gray-300 mb-6">
              {language === 'ka' 
                ? 'თუ მონაცემები არ აღვადგინოთ, არ გიხდიაქნთ!'
                : 'If we cannot recover your data, you pay nothing!'
              }
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="font-semibold text-white">
                  {language === 'ka' ? 'არ აღდგენა = 0₾' : 'No Recovery = 0₾'}
                </div>
              </div>
              <div className="text-center">
                <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="font-semibold text-white">
                  {language === 'ka' ? 'სწრაფი შედეგი' : 'Fast Results'}
                </div>
              </div>
              <div className="text-center">
                <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <div className="font-semibold text-white">
                  {language === 'ka' ? '99% წარმატება' : '99% Success'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {language === 'ka' ? 'მზად ვართ დაგეხმაროთ' : 'Ready to Help You'}
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            {language === 'ka' 
              ? 'დაგვიკავშირდით უფასო კონსულტაციისთვის და დეტალური ინფორმაციისთვის'
              : 'Contact us for free consultation and detailed information'
            }
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              onClick={() => navigate('/#service-request')}
              className="bg-red-accent hover-red-accent text-white px-8 py-3"
            >
              <Phone className="w-4 h-4 mr-2" />
              {language === 'ka' ? 'სერვისის მოთხოვნა' : 'Request Service'}
            </Button>
            <Button 
              onClick={() => navigate('/#contact')}
              variant="outline"
              className="border-red-accent text-red-accent hover:bg-red-accent hover:text-white px-8 py-3"
            >
              <Mail className="w-4 h-4 mr-2" />
              {t.contactUs}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-400">
            <div>
              <Phone className="w-6 h-6 text-red-accent mx-auto mb-2" />
              <div>+995 XXX XXX XXX</div>
            </div>
            <div>
              <Mail className="w-6 h-6 text-red-accent mx-auto mb-2" />
              <div>info@datalabgeorgia.ge</div>
            </div>
            <div>
              <Clock className="w-6 h-6 text-red-accent mx-auto mb-2" />
              <div>{language === 'ka' ? '24/7 მხარდაჭერა' : '24/7 Support'}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DataRecovery;