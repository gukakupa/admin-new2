import React, { useState } from 'react';
import { Calculator, DollarSign, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { translations } from '../data/mockData';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PriceEstimation = ({ language }) => {
  const t = translations[language];
  const { toast } = useToast();
  const [estimation, setEstimation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    deviceType: '',
    problemType: '',
    urgency: ''
  });

  const deviceTypes = [
    { value: 'hdd', labelKa: 'HDD მყარი დისკი', labelEn: 'HDD Hard Drive', basePrice: 100 },
    { value: 'ssd', labelKa: 'SSD დისკი', labelEn: 'SSD Drive', basePrice: 150 },
    { value: 'raid', labelKa: 'RAID მასივი', labelEn: 'RAID Array', basePrice: 300 },
    { value: 'usb', labelKa: 'USB მოწყობილობა', labelEn: 'USB Device', basePrice: 80 },
    { value: 'sd', labelKa: 'SD ბარათი', labelEn: 'SD Card', basePrice: 60 }
  ];

  const problemTypes = [
    { value: 'logical', labelKa: 'ლოგიკური დაზიანება', labelEn: 'Logical Damage', multiplier: 1 },
    { value: 'physical', labelKa: 'ფიზიკური დაზიანება', labelEn: 'Physical Damage', multiplier: 1.5 },
    { value: 'water', labelKa: 'წყლით დაზიანება', labelEn: 'Water Damage', multiplier: 2 },
    { value: 'fire', labelKa: 'ცეცხლით დაზიანება', labelEn: 'Fire Damage', multiplier: 2.5 }
  ];

  const urgencyLevels = [
    { value: 'standard', labelKa: 'სტანდარტული (5-7 დღე)', labelEn: 'Standard (5-7 days)', multiplier: 1 },
    { value: 'urgent', labelKa: 'ეხლა (2-3 დღე)', labelEn: 'Urgent (2-3 days)', multiplier: 1.5 },
    { value: 'emergency', labelKa: 'გადაუდებელი (24 საათი)', labelEn: 'Emergency (24 hours)', multiplier: 2 }
  ];

  const calculatePrice = async () => {
    if (!formData.deviceType || !formData.problemType || !formData.urgency) {
      toast({
        title: language === 'ka' ? 'შეცდომა' : 'Error',
        description: language === 'ka' ? 'შეავსეთ ყველა ველი' : 'Please fill all fields',
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API}/price-estimate/`, {
        device_type: formData.deviceType,
        problem_type: formData.problemType,
        urgency: formData.urgency
      });

      const data = response.data;
      const device = deviceTypes.find(d => d.value === formData.deviceType);
      const problem = problemTypes.find(p => p.value === formData.problemType);

      setEstimation({
        price: data.estimated_price,
        timeframe: language === 'ka' ? data.timeframe_ka : data.timeframe_en,
        device: language === 'ka' ? device.labelKa : device.labelEn,
        problem: language === 'ka' ? problem.labelKa : problem.labelEn,
        currency: data.currency
      });

      toast({
        title: language === 'ka' ? 'ფასი გამოითვალა!' : 'Price Calculated!',
        description: language === 'ka' ? `სავარაუდო ღირებულება: ${data.estimated_price}₾` : `Estimated cost: ${data.estimated_price}₾`,
      });

    } catch (error) {
      console.error('Error calculating price:', error);
      toast({
        title: language === 'ka' ? 'შეცდომა' : 'Error',
        description: language === 'ka' ? 'ფასის გაანგარიშებისას მოხდა შეცდომა' : 'Error calculating price',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setEstimation(null); // Reset estimation when form changes
  };

  return (
    <section id="price-estimation" className="py-20 bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t.priceEstimationTitle}
          </h2>
          <p className="text-xl text-gray-300">
            {t.priceEstimationSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Price Calculator Form */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center">
                <Calculator className="w-6 h-6 text-red-accent mr-3" />
                {language === 'ka' ? 'ფასის კალკულატორი' : 'Price Calculator'}
              </CardTitle>
              <CardDescription className="text-gray-400">
                {language === 'ka' 
                  ? 'აირჩიეთ თქვენი მოწყობილობა და პრობლემის ტიპი'
                  : 'Select your device and problem type'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Device Type */}
              <div className="space-y-2">
                <Label className="text-gray-300">
                  {language === 'ka' ? 'მოწყობილობის ტიპი' : 'Device Type'}
                </Label>
                <Select value={formData.deviceType} onValueChange={(value) => handleInputChange('deviceType', value)}>
                  <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
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
              </div>

              {/* Problem Type */}
              <div className="space-y-2">
                <Label className="text-gray-300">
                  {language === 'ka' ? 'პრობლემის ტიპი' : 'Problem Type'}
                </Label>
                <Select value={formData.problemType} onValueChange={(value) => handleInputChange('problemType', value)}>
                  <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                    <SelectValue placeholder={language === 'ka' ? 'აირჩიეთ პრობლემა' : 'Select problem'} />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {problemTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value} className="text-white hover:bg-gray-700">
                        {language === 'ka' ? type.labelKa : type.labelEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Urgency */}
              <div className="space-y-2">
                <Label className="text-gray-300">
                  {language === 'ka' ? 'სისწრაფე' : 'Urgency Level'}
                </Label>
                <Select value={formData.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
                  <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
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
              </div>

              <Button 
                onClick={calculatePrice}
                className="w-full bg-red-accent hover-red-accent text-white py-3"
                disabled={!formData.deviceType || !formData.problemType || !formData.urgency || loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {language === 'ka' ? 'მუშავდება...' : 'Calculating...'}
                  </>
                ) : (
                  <>
                    <Calculator className="w-4 h-4 mr-2" />
                    {language === 'ka' ? 'ფასის გაანგარიშება' : 'Calculate Price'}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Estimation Result */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center">
                <DollarSign className="w-6 h-6 text-red-accent mr-3" />
                {language === 'ka' ? 'შეფასების შედეგი' : 'Estimation Result'}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              {estimation ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-red-accent mb-2">
                      {estimation.price}₾
                    </div>
                    <p className="text-gray-400">
                      {language === 'ka' ? 'სავარაუდო ღირებულება' : 'Estimated Cost'}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-400">
                        {language === 'ka' ? 'მოწყობილობა:' : 'Device:'}
                      </span>
                      <Badge variant="outline" className="border-red-accent text-red-accent">
                        {estimation.device}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-400">
                        {language === 'ka' ? 'პრობლემა:' : 'Problem:'}
                      </span>
                      <span className="text-white">{estimation.problem}</span>
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-400 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {language === 'ka' ? 'ვადა:' : 'Timeframe:'}
                      </span>
                      <span className="text-white">{estimation.timeframe}</span>
                    </div>
                  </div>

                  <div className="bg-red-accent/10 border border-red-accent/20 rounded-lg p-4">
                    <p className="text-sm text-gray-300">
                      {language === 'ka' 
                        ? '* ეს არის სავარაუდო ღირებულება. საბოლოო ფასი დამოკიდებულია მოწყობილობის მდგომარეობაზე.'
                        : '* This is an estimated price. Final cost depends on device condition.'
                      }
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calculator className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">
                    {language === 'ka' 
                      ? 'შეავსეთ ყველა ველი ფასის გასაანგარიშებლად'
                      : 'Fill in all fields to calculate the price'
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PriceEstimation;