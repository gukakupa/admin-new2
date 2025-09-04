import React, { useState } from 'react';
import { Search, Package, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useToast } from '../hooks/use-toast';
import { translations } from '../data/mockData';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const CaseTracking = ({ language }) => {
  const t = translations[language];
  const { toast } = useToast();
  const [trackingId, setTrackingId] = useState('');
  const [caseInfo, setCaseInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const trackCase = async () => {
    if (!trackingId.trim()) {
      toast({
        title: language === 'ka' ? 'შეცდომა' : 'Error',
        description: language === 'ka' ? 'შეიყვანეთ თვალთვალის ID' : 'Please enter tracking ID',
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      const caseId = trackingId.trim();
      
      // Check if it's a Kanban case (KB prefix) or Service Request case (DL prefix)
      if (caseId.startsWith('KB')) {
        // Search in Kanban tasks from localStorage
        const manualTasks = JSON.parse(localStorage.getItem('kanban_manual_tasks') || '[]');
        const kanbanCase = manualTasks.find(task => task.case_id === caseId);
        
        if (kanbanCase) {
          // Convert Kanban task to case info format
          const caseData = {
            case_id: kanbanCase.case_id,
            name: kanbanCase.name || kanbanCase.client_name,
            email: kanbanCase.email,
            phone: kanbanCase.phone,
            device_type: kanbanCase.device_type,
            problem_description: kanbanCase.damage_description || kanbanCase.problem_description,
            urgency: kanbanCase.urgency,
            status: kanbanCase.status || 'pending',
            created_at: kanbanCase.created_at || new Date().toISOString(),
            started_at: kanbanCase.started_at,
            completed_at: kanbanCase.completed_at,
            price: kanbanCase.price,
            progress_percentage: getProgressPercentage(kanbanCase.status || 'pending'),
            is_kanban_case: true // Flag to identify Kanban cases
          };
          
          setCaseInfo(caseData);
          toast({
            title: language === 'ka' ? 'კანბან საქმე ნაპოვნია!' : 'Kanban Case Found!',
            description: language === 'ka' ? 'კანბანის საქმის ინფორმაცია წარმატებით ჩაიტვირთა' : 'Kanban case information loaded successfully',
          });
          return;
        } else {
          // Kanban case not found
          setCaseInfo(null);
          toast({
            title: language === 'ka' ? 'კანბან საქმე ვერ მოიძებნა' : 'Kanban Case Not Found',
            description: language === 'ka' ? 'შეამოწმეთ კანბანის საქმის ID და სცადეთ თავიდან' : 'Please check your Kanban case ID and try again',
            variant: "destructive"
          });
          return;
        }
      } else {
        // Search in Service Requests via API (DL prefix or other)
        const response = await axios.get(`${BACKEND_URL}/api/service-requests/${caseId}`);
        
        setCaseInfo(response.data);
        toast({
          title: language === 'ka' ? 'სერვისის საქმე ნაპოვნია!' : 'Service Case Found!',
          description: language === 'ka' ? 'სერვისის საქმის ინფორმაცია წარმატებით ჩაიტვირთა' : 'Service case information loaded successfully',
        });
      }

    } catch (error) {
      console.error('Error tracking case:', error);
      setCaseInfo(null);
      
      if (error.response?.status === 404) {
        toast({
          title: language === 'ka' ? 'საქმე ვერ მოიძებნა' : 'Case Not Found',
          description: language === 'ka' ? 'შეამოწმეთ თვალთვალის ID და სცადეთ თავიდან' : 'Please check your tracking ID and try again',
          variant: "destructive"
        });
      } else {
        toast({
          title: language === 'ka' ? 'შეცდომა' : 'Error',
          description: language === 'ka' ? 'საქმის ძიებისას მოხდა შეცდომა' : 'Error occurred while tracking case',
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to calculate progress percentage based on status
  const getProgressPercentage = (status) => {
    switch (status) {
      case 'pending': return 25;
      case 'in_progress': return 50;
      case 'completed': return 75;
      case 'picked_up': return 100;
      default: return 0;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'picked_up':
        return <Package className="w-5 h-5 text-purple-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    const statusTexts = {
      completed: { ka: 'დასრულებული', en: 'Completed' },
      picked_up: { ka: 'გატანილი', en: 'Picked Up' },
      in_progress: { ka: 'მუშავდება', en: 'In Progress' },
      pending: { ka: 'მომლოდინე', en: 'Pending' }
    };
    return statusTexts[status] ? statusTexts[status][language] : (language === 'ka' ? 'უცნობი' : 'Unknown');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'border-green-500 text-green-500';
      case 'picked_up':
        return 'border-purple-500 text-purple-500';
      case 'in_progress':
        return 'border-blue-500 text-blue-500';
      case 'pending':
        return 'border-orange-500 text-orange-500';
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
                    onClick={() => setTrackingId('DL2025001')}
                    className="block text-red-accent hover:text-red-400 text-sm transition-colors"
                  >
                    DL2025001 ({language === 'ka' ? 'ლოდინაში' : 'Pending'})
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    {language === 'ka' 
                      ? 'ან გამოიყენეთ Service Request-ით მიღებული ID'
                      : 'Or use ID received from Service Request'
                    }
                  </p>
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
                      <h3 className="text-xl font-bold text-white">{caseInfo.case_id}</h3>
                      <p className="text-gray-400">{caseInfo.device_type.toUpperCase()}</p>
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
                    <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-700">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500 ease-out"
                        style={{ width: `${caseInfo.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Case Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-400">
                        {language === 'ka' ? 'შექმნის თარიღი:' : 'Created Date:'}
                      </span>
                      <span className="text-white">{caseInfo.created_at}</span>
                    </div>
                    
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-400">
                        {language === 'ka' ? 'სავარაუდო დასრულება:' : 'Est. Completion:'}
                      </span>
                      <span className="text-white">{caseInfo.estimated_completion || 'TBD'}</span>
                    </div>
                    
                    {caseInfo.price && (
                      <div className="flex justify-between py-2 border-b border-gray-700">
                        <span className="text-gray-400">
                          {language === 'ka' ? 'ღირებულება:' : 'Price:'}
                        </span>
                        <span className="text-white">{caseInfo.price}₾</span>
                      </div>
                    )}
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