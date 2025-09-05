import React, { useState } from 'react';
import { Send, Upload, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { useToast } from '../hooks/use-toast';
import { translations } from '../data/mockData';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ServiceRequest = ({ language }) => {
  const t = translations[language];
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    deviceType: '',
    problemDescription: '',
    urgency: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    // Special handling for phone number
    if (field === 'phone') {
      // Remove any non-digit characters except + and spaces
      const cleanValue = value.replace(/[^\d\+\s\-\(\)]/g, '');
      setFormData(prev => ({
        ...prev,
        [field]: cleanValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Clear error for this field when user starts typing/selecting
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSelectChange = (field, value) => {
    console.log(`=== SELECT CHANGE: ${field} = ${value} ===`);
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      console.log('Updated form data:', newData);
      return newData;
    });
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = language === 'ka' ? 'სახელი აუცილებელია' : 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = language === 'ka' ? 'ელ. ფოსტა აუცილებელია' : 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = language === 'ka' ? 'ელ. ფოსტის ფორმატი არასწორია' : 'Email format is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = language === 'ka' ? 'ტელეფონი აუცილებელია' : 'Phone is required';
    } else if (!/^[\d\s\+\-\(\)]+$/.test(formData.phone.trim())) {
      newErrors.phone = language === 'ka' ? 'ტელეფონი უნდა შეიცავდეს მხოლოდ ციფრებს და +, -, (, ) სიმბოლოებს' : 'Phone should contain only numbers and +, -, (, ) symbols';
    } else if (formData.phone.replace(/[\s\+\-\(\)]/g, '').length < 9) {
      newErrors.phone = language === 'ka' ? 'ტელეფონი უნდა შეიცავდეს მინიმუმ 9 ციფრს' : 'Phone should contain at least 9 digits';
    }
    
    if (!formData.deviceType) {
      newErrors.deviceType = language === 'ka' ? 'მოწყობილობის ტიპი აუცილებელია' : 'Device type is required';
    }
    
    if (!formData.urgency) {
      newErrors.urgency = language === 'ka' ? 'სისწრაფე აუცილებელია' : 'Urgency is required';
    }
    
    if (!formData.problemDescription.trim()) {
      newErrors.problemDescription = language === 'ka' ? 'პრობლემის აღწერა აუცილებელია' : 'Problem description is required';
    } else if (formData.problemDescription.trim().length < 10) {
      newErrors.problemDescription = language === 'ka' ? 'პრობლემის აღწერა უნდა იყოს მინიმუმ 10 სიმბოლო' : 'Problem description must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Debug: Log form data
    console.log('=== SERVICE REQUEST FORM SUBMISSION ===');
    console.log('Form Data:', formData);
    console.log('Device Type:', formData.deviceType);
    console.log('Urgency:', formData.urgency);
    
    if (!validateForm()) {
      console.log('Validation failed with errors:', errors);
      toast({
        title: language === 'ka' ? 'შეცდომა' : 'Error',
        description: language === 'ka' ? 'გთხოვთ, შეავსეთ ყველა საჭირო ველი სწორად' : 'Please fill all required fields correctly',
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      
      console.log('Sending request to:', `${BACKEND_URL}/api/service-requests/`);
      console.log('Request payload:', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        device_type: formData.deviceType,
        problem_description: formData.problemDescription.trim(),
        urgency: formData.urgency
      });
      
      const response = await axios.post(`${BACKEND_URL}/api/service-requests/`, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        device_type: formData.deviceType,
        problem_description: formData.problemDescription.trim(),
        urgency: formData.urgency
      }, {
        timeout: 10000 // 10 second timeout
      });

      const data = response.data;
      console.log('Response received:', data);
      
      toast({
        title: language === 'ka' ? 'მოთხოვნა წარმატებით გაგზავნილია!' : 'Request Submitted Successfully!',
        description: language === 'ka' 
          ? `თქვენი საქმის ID: ${data.case_id}. ჩვენ მალე დაგიკავშირდებით.`
          : `Your case ID: ${data.case_id}. We will contact you soon.`,
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        deviceType: '',
        problemDescription: '',
        urgency: ''
      });

    } catch (error) {
      console.error('Error submitting service request:', error);
      console.error('Error details:', error.response?.data);
      
      let errorMessage = '';
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        errorMessage = language === 'ka' 
          ? 'სერვერთან კავშირის დრო ამოიწურა. გთხოვთ, სცადეთ მოგვიანებით.'
          : 'Connection timeout. Please try again later.';
      } else if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        if (status === 400) {
          const errorData = error.response.data;
          if (errorData && errorData.detail) {
            errorMessage = language === 'ka' 
              ? `მონაცემები არასწორია: ${errorData.detail}`
              : `Invalid data: ${errorData.detail}`;
          } else {
            errorMessage = language === 'ka' 
              ? 'მონაცემები არასწორია. გთხოვთ, შეამოწმეთ შეყვანილი ინფორმაცია.'
              : 'Invalid data. Please check your input.';
          }
        } else if (status === 500) {
          errorMessage = language === 'ka' 
            ? 'სერვერის შიდა შეცდომა. გთხოვთ, სცადეთ მოგვიანებით.'
            : 'Server error. Please try again later.';
        } else {
          errorMessage = language === 'ka' 
            ? `სერვერის შეცდომა (კოდი: ${status}). გთხოვთ, სცადეთ მოგვიანებით.`
            : `Server error (code: ${status}). Please try again later.`;
        }
      } else if (error.request) {
        // Network error
        errorMessage = language === 'ka' 
          ? 'კავშირის პრობლემა. გთხოვთ, შეამოწმეთ ინტერნეტ კავშირი და სცადეთ ხელახლა.'
          : 'Network error. Please check your connection and try again.';
      } else {
        errorMessage = language === 'ka' 
          ? 'მოთხოვნის გაგზავნისას მოხდა შეცდომა. გთხოვთ, სცადეთ ხელახლა.'
          : 'Error submitting request. Please try again.';
      }
      
      toast({
        title: language === 'ka' ? 'შეცდომა' : 'Error',
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deviceTypes = [
    { value: 'hdd', labelKa: 'HDD მყარი დისკი', labelEn: 'HDD Hard Drive' },
    { value: 'ssd', labelKa: 'SSD დისკი', labelEn: 'SSD Drive' },
    { value: 'raid', labelKa: 'RAID მასივი', labelEn: 'RAID Array' },
    { value: 'usb', labelKa: 'USB მოწყობილობა', labelEn: 'USB Device' },
    { value: 'sd', labelKa: 'SD ბარათი', labelEn: 'SD Card' },
    { value: 'other', labelKa: 'სხვა', labelEn: 'Other' }
  ];

  const urgencyLevels = [
    { value: 'low', labelKa: 'დაბალი', labelEn: 'Low' },
    { value: 'medium', labelKa: 'საშუალო', labelEn: 'Medium' },
    { value: 'high', labelKa: 'მაღალი', labelEn: 'High' },
    { value: 'critical', labelKa: 'კრიტიკული', labelEn: 'Critical' }
  ];

  return (
    <section id="service-request" className="py-20 bg-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t.serviceRequestTitle}
          </h2>
          <p className="text-xl text-gray-300">
            {t.serviceRequestSubtitle}
          </p>
        </div>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center">
              <FileText className="w-6 h-6 text-red-accent mr-3" />
              {language === 'ka' ? 'სერვისის მოთხოვნის ფორმა' : 'Service Request Form'}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {language === 'ka' 
                ? 'შეავსეთ ყველა ველი დეტალური ინფორმაციისთვის'
                : 'Fill in all fields for detailed information'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">
                    {language === 'ka' ? 'სახელი და გვარი' : 'Full Name'}
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`bg-gray-800 border-gray-600 text-white ${errors.name ? 'border-red-500' : ''}`}
                    placeholder={language === 'ka' ? 'თქვენი სახელი' : 'Your name'}
                  />
                  {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">
                    {language === 'ka' ? 'ელ. ფოსტა' : 'Email'}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`bg-gray-800 border-gray-600 text-white ${errors.email ? 'border-red-500' : ''}`}
                    placeholder={language === 'ka' ? 'your@email.com' : 'your@email.com'}
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>

              {/* Phone and Device Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-300">
                    {language === 'ka' ? 'ტელეფონი' : 'Phone'}
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    maxLength={20}
                    className={`bg-gray-800 border-gray-600 text-white ${errors.phone ? 'border-red-500' : ''}`}
                    placeholder={language === 'ka' ? '+995 XXX XXX XXX' : '+995 XXX XXX XXX'}
                  />
                  {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">
                    {language === 'ka' ? 'მოწყობილობის ტიპი' : 'Device Type'}
                  </Label>
                  <Select value={formData.deviceType} onValueChange={(value) => handleSelectChange('deviceType', value)}>
                    <SelectTrigger className={`bg-gray-800 border-gray-600 text-white ${errors.deviceType ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder={language === 'ka' ? 'აირჩიეთ მოწყობილობა' : 'Select device'} />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {deviceTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value} className="text-white hover:bg-gray-700">
                          {language === 'ka' ? type.labelKa : type.labelEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.deviceType && <p className="text-red-400 text-sm mt-1">{errors.deviceType}</p>}
                </div>
              </div>

              {/* Urgency */}
              <div className="space-y-2">
                <Label className="text-gray-300">
                  {language === 'ka' ? 'სისწრაფე' : 'Urgency Level'}
                </Label>
                <Select value={formData.urgency} onValueChange={(value) => handleSelectChange('urgency', value)}>
                  <SelectTrigger className={`bg-gray-800 border-gray-600 text-white ${errors.urgency ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder={language === 'ka' ? 'აირჩიეთ სისწრაფე' : 'Select urgency'} />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {urgencyLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value} className="text-white hover:bg-gray-700">
                        {language === 'ka' ? level.labelKa : level.labelEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.urgency && <p className="text-red-400 text-sm mt-1">{errors.urgency}</p>}
              </div>

              {/* Problem Description */}
              <div className="space-y-2">
                <Label htmlFor="problem" className="text-gray-300">
                  {language === 'ka' ? 'პრობლემის აღწერა' : 'Problem Description'}
                </Label>
                <Textarea
                  id="problem"
                  value={formData.problemDescription}
                  onChange={(e) => handleInputChange('problemDescription', e.target.value)}
                  rows={4}
                  maxLength={1000}
                  className={`bg-gray-800 border-gray-600 text-white ${errors.problemDescription ? 'border-red-500' : ''}`}
                  placeholder={language === 'ka' 
                    ? 'აღწერეთ დეტალურად რა პრობლემაა თქვენს მოწყობილობასთან...'
                    : 'Describe in detail what problem you have with your device...'
                  }
                />
                {errors.problemDescription && <p className="text-red-400 text-sm mt-1">{errors.problemDescription}</p>}
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
                    {language === 'ka' ? 'იგზავნება...' : 'Submitting...'}
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    {language === 'ka' ? 'მოთხოვნის გაგზავნა' : 'Submit Request'}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ServiceRequest;