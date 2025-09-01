import React, { useState } from 'react';
import { Search, Package, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useToast } from '../hooks/use-toast';
import { translations, mockCases } from '../data/mockData';

const CaseTracking = ({ language }) => {
  const t = translations[language];
  const { toast } = useToast();
  const [trackingId, setTrackingId] = useState('');
  const [caseInfo, setCaseInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const trackCase = () => {
    if (!trackingId.trim()) {
      toast({
        title: language === 'ka' ? 'შეცდომა' : 'Error',
        description: language === 'ka' ? 'შეიყვანეთ თვალთვალის ID' : 'Please enter tracking ID',
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const foundCase = mockCases.find(c => c.id.toLowerCase() === trackingId.toLowerCase());
      
      if (foundCase) {
        setCaseInfo(foundCase);
        toast({
          title: language === 'ka' ? 'საქმე ნაპოვნია!' : 'Case Found!',
          description: language === 'ka' ? 'საქმის ინფორმაცია წარმატებით ჩაიტვირთა' : 'Case information loaded successfully',
        });
      } else {
        setCaseInfo(null);
        toast({
          title: language === 'ka' ? 'საქმე ვერ მოიძებნა' : 'Case Not Found',
          description: language === 'ka' ? 'შეამოწმეთ თვალთვალის ID და სცადეთ თავიდან' : 'Please check your tracking ID and try again',
          variant: "destructive"
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    const statusTexts = {
      completed: { ka: 'დასრულებული', en: 'Completed' },
      in_progress: { ka: 'მუშავდება', en: 'In Progress' },
      pending: { ka: 'ლოდინაში', en: 'Pending' }
    };
    return statusTexts[status]?.[language] || status;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'border-green-500 text-green-500';
      case 'in_progress':
        return 'border-yellow-500 text-yellow-500';
      default:
        return 'border-gray-500 text-gray-500';
    }
  };

  return (
    <section id="case-tracking" className="py-20 bg-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t.caseTrackingTitle}
          </h2>
          <p className="text-xl text-gray-300">
            {t.caseTrackingSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tracking Form */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center">
                <Search className="w-6 h-6 text-red-accent mr-3" />
                {language === 'ka' ? 'საქმის ძიება' : 'Track Your Case'}
              </CardTitle>
              <CardDescription className="text-gray-400">
                {language === 'ka' 
                  ? 'შეიყვანეთ თქვენი თვალთვალის ID რომ ნახოთ საქმის სტატუსი'
                  : 'Enter your tracking ID to view case status'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="tracking-id" className="text-gray-300">
                  {language === 'ka' ? 'თვალთვალის ID' : 'Tracking ID'}
                </Label>
                <Input
                  id="tracking-id"
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="DL2024001"
                  onKeyPress={(e) => e.key === 'Enter' && trackCase()}
                />
              </div>

              <Button 
                onClick={trackCase}
                disabled={isLoading}
                className="w-full bg-red-accent hover-red-accent text-white py-3"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {language === 'ka' ? 'ძიება...' : 'Searching...'}
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    {language === 'ka' ? 'საქმის ძიება' : 'Track Case'}
                  </>
                )}
              </Button>

              {/* Demo IDs */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-2">
                  {language === 'ka' ? 'ტესტირებისთვის:' : 'For testing:'}
                </p>
                <div className="space-y-1">
                  <button 
                    onClick={() => setTrackingId('DL2024001')}
                    className="block text-red-accent hover:text-red-400 text-sm transition-colors"
                  >
                    DL2024001 ({language === 'ka' ? 'დასრულებული' : 'Completed'})
                  </button>
                  <button 
                    onClick={() => setTrackingId('DL2024002')}
                    className="block text-red-accent hover:text-red-400 text-sm transition-colors"
                  >
                    DL2024002 ({language === 'ka' ? 'მუშავდება' : 'In Progress'})
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Case Information */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center">
                <Package className="w-6 h-6 text-red-accent mr-3" />
                {language === 'ka' ? 'საქმის ინფორმაცია' : 'Case Information'}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              {caseInfo ? (
                <div className="space-y-6">
                  {/* Case Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">{caseInfo.id}</h3>
                      <p className="text-gray-400">{caseInfo.deviceType.toUpperCase()}</p>
                    </div>
                    <Badge variant="outline" className={getStatusColor(caseInfo.status)}>
                      {getStatusIcon(caseInfo.status)}
                      <span className="ml-1">{getStatusText(caseInfo.status)}</span>
                    </Badge>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        {language === 'ka' ? 'პროგრესი' : 'Progress'}
                      </span>
                      <span className="text-white">{caseInfo.progress}%</span>
                    </div>
                    <Progress value={caseInfo.progress} className="h-3" />
                  </div>

                  {/* Case Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-400">
                        {language === 'ka' ? 'შექმნის თარიღი:' : 'Created Date:'}
                      </span>
                      <span className="text-white">{caseInfo.createdAt}</span>
                    </div>
                    
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-400">
                        {language === 'ka' ? 'სავარაუდო დასრულება:' : 'Est. Completion:'}
                      </span>
                      <span className="text-white">{caseInfo.estimatedCompletion}</span>
                    </div>
                  </div>

                  {/* Status Message */}
                  <div className="bg-red-accent/10 border border-red-accent/20 rounded-lg p-4">
                    <p className="text-sm text-gray-300">
                      {caseInfo.status === 'completed' 
                        ? (language === 'ka' ? 'თქვენი საქმე წარმატებით დასრულდა! შეგიძლიათ მოიტანოთ თქვენი მოწყობილობა.' : 'Your case has been completed successfully! You can pick up your device.')
                        : (language === 'ka' ? 'თქვენი საქმე მუშავდება. ჩვენ გაცნობებთ როდესაც მზად იქნება.' : 'Your case is being processed. We will notify you when it\'s ready.')
                      }
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">
                    {language === 'ka' 
                      ? 'შეიყვანეთ თვალთვალის ID საქმის ინფორმაციის სანახავად'
                      : 'Enter a tracking ID to view case information'
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

export default CaseTracking;