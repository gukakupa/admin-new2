import React, { useState } from 'react';
import { Send, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useToast } from '../hooks/use-toast';
import { translations } from '../data/mockData';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Contact = ({ language }) => {
  const t = translations[language];
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await axios.post(`${BACKEND_URL}/api/contact/`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        subject: formData.subject,
        message: formData.message
      });
      
      toast({
        title: language === 'ka' ? 'შეტყობინება გაგზავნილია!' : 'Message Sent!',
        description: language === 'ka' 
          ? 'ჩვენ მალე დაგიკავშირდებით'
          : 'We will contact you soon',
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: language === 'ka' ? 'შეცდომა' : 'Error',
        description: language === 'ka' 
          ? 'შეტყობინების გაგზავნისას მოხდა შეცდომა'
          : 'Error sending message',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      titleKa: 'ტელეფონი',
      titleEn: 'Phone',
      valueKa: '+995 XXX XXX XXX',
      valueEn: '+995 XXX XXX XXX',
      descKa: '24/7 ხელმისაწვდომი',
      descEn: 'Available 24/7'
    },
    {
      icon: Mail,
      titleKa: 'ელ. ფოსტა',
      titleEn: 'Email',
      valueKa: 'info@datalabgeorgia.ge',
      valueEn: 'info@datalabgeorgia.ge',
      descKa: 'სწრაფი პასუხი',
      descEn: 'Quick Response'
    },
    {
      icon: MapPin,
      titleKa: 'მისამართი',
      titleEn: 'Address',
      valueKa: 'თბილისი, საქართველო',
      valueEn: 'Tbilisi, Georgia',
      descKa: 'ოფისში ვიზიტი შესაძლებელია',
      descEn: 'Office visits available'
    },
    {
      icon: Clock,
      titleKa: 'სამუშაო საათები',
      titleEn: 'Working Hours',
      valueKa: '24/7',
      valueEn: '24/7',
      descKa: 'გადაუდებელი შემთხვევები',
      descEn: 'Emergency cases'
    }
  ];

  return (
    <section id="contact" className="py-20 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t.contactTitle}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t.contactSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl text-white">
                {language === 'ka' ? 'გაგვიგზავნეთ შეტყობინება' : 'Send us a Message'}
              </CardTitle>
              <CardDescription className="text-gray-400">
                {language === 'ka' 
                  ? 'ჩვენ ვპასუხობთ 1 საათის განმავლობაში'
                  : 'We respond within 1 hour'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name" className="text-gray-300">
                      {language === 'ka' ? 'სახელი და გვარი' : 'Full Name'}
                    </Label>
                    <Input
                      id="contact-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder={language === 'ka' ? 'თქვენი სახელი' : 'Your name'}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-email" className="text-gray-300">
                      {language === 'ka' ? 'ელ. ფოსტა' : 'Email'}
                    </Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                {/* Phone and Subject */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-phone" className="text-gray-300">
                      {language === 'ka' ? 'ტელეფონი' : 'Phone'}
                    </Label>
                    <Input
                      id="contact-phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="+995 XXX XXX XXX"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-subject" className="text-gray-300">
                      {language === 'ka' ? 'თემა' : 'Subject'}
                    </Label>
                    <Input
                      id="contact-subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      required
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder={language === 'ka' ? 'შეტყობინების თემა' : 'Message subject'}
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="contact-message" className="text-gray-300">
                    {language === 'ka' ? 'შეტყობინება' : 'Message'}
                  </Label>
                  <Textarea
                    id="contact-message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    required
                    rows={5}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder={language === 'ka' 
                      ? 'დაწერეთ თქვენი შეტყობინება აქ...'
                      : 'Write your message here...'
                    }
                  />
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full bg-red-accent hover-red-accent text-white py-3 text-lg font-semibold glow-red"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {language === 'ka' ? 'იგზავნება...' : 'Sending...'}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      {language === 'ka' ? 'შეტყობინების გაგზავნა' : 'Send Message'}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="text-center lg:text-left mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                {language === 'ka' ? 'დაგვიკავშირდით' : 'Get in Touch'}
              </h3>
              <p className="text-gray-300">
                {language === 'ka' 
                  ? 'ჩვენ ვართ აქ დაგეხმაროთ 24/7. იქნება ეს გადაუდებელი შემთხვევა თუ რიგითი კონსულტაცია.'
                  : 'We are here to help you 24/7. Whether it\'s an emergency case or regular consultation.'
                }
              </p>
            </div>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactInfo.map((info, index) => (
                <Card key={index} className="bg-gray-900 border-gray-700 hover:border-red-accent/50 transition-colors duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-red-accent/10 rounded-lg flex items-center justify-center">
                          <info.icon className="w-6 h-6 text-red-accent" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold mb-1">
                          {language === 'ka' ? info.titleKa : info.titleEn}
                        </h4>
                        <p className="text-red-accent font-medium mb-1">
                          {language === 'ka' ? info.valueKa : info.valueEn}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {language === 'ka' ? info.descKa : info.descEn}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Emergency Notice */}
            <Card className="bg-red-accent/10 border-red-accent/20">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-red-accent rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">
                      {language === 'ka' ? 'გადაუდებელი დახმარება' : 'Emergency Support'}
                    </h4>
                    <p className="text-gray-300 text-sm">
                      {language === 'ka' 
                        ? 'გადაუდებელი შემთხვევებისთვის დაგვირეკეთ ნებისმიერ დროს. ჩვენ ვართ მზად 24/7!'
                        : 'For emergency cases, call us anytime. We are ready 24/7!'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;