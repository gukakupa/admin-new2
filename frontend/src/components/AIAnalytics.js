import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  BarChart3,
  PieChart,
  Activity,
  Lightbulb,
  Settings
} from 'lucide-react';

const AIAnalytics = ({ serviceRequests, contactMessages, testimonials }) => {
  const [predictions, setPredictions] = useState({
    revenue: { next_month: 15420, confidence: 87, trend: 'up' },
    cases: { next_week: 23, confidence: 92, trend: 'up' },
    completion_time: { avg_hours: 48, confidence: 79, trend: 'down' },
    customer_satisfaction: { score: 4.7, confidence: 85, trend: 'up' }
  });

  const [insights, setInsights] = useState([
    {
      id: 1,
      type: 'revenue',
      title: 'შემოსავლის ზრდის პროგნოზი',
      description: 'მომდევნო თვეში შემოსავალი გაიზრდება 12% SSD აღდგენის მომატებული მოთხოვნის გამო',
      confidence: 87,
      impact: 'high',
      action: 'SSD აღდგენის კაპაციტეტის გაზრდა'
    },
    {
      id: 2,
      type: 'efficiency',
      title: 'სამუშაოს დროის ოპტიმიზაცია',
      description: 'USB მოწყობილობების აღდგენის დრო შეიძლება შემცირდეს 25%-ით პროცესის ავტომატიზაციით',
      confidence: 79,
      impact: 'medium',
      action: 'ავტომატიზაციის სისტემის დანერგვა'
    },
    {
      id: 3,
      type: 'customer',
      title: 'კლიენტების ქცევის ანალიზი',
      description: 'კლიენტები რომლებიც იყენებენ ფასდაკლების კუპონებს, 40% უფრო მეტ ალბათობით დაბრუნდებიან',
      confidence: 91,
      impact: 'high',
      action: 'მარკეტინგ კამპანიის განვითარება'
    },
    {
      id: 4,
      type: 'risk',
      title: 'რისკის შეფასება',
      description: 'RAID სისტემების აღდგენისას 15% რისკია რთულებისა მუშაობის სპეციფიკურობის გამო',
      confidence: 84,
      impact: 'medium',
      action: 'დამატებითი ტრენინგის ჩატარება'
    }
  ]);

  const [trends, setTrends] = useState({
    seasonal: {
      peak_months: ['დეკემბერი', 'იანვარი', 'მარტი'],
      low_months: ['ივნისი', 'ივლისი', 'აგვისტო'],
      reason: 'სეზონური ფაქტორები და სტუდენტური პერიოდები'
    },
    device_trends: [
      { device: 'SSD', growth: 45, reason: 'ახალი ტექნოლოგიების გავრცელება' },
      { device: 'USB', growth: -12, reason: 'Cloud Storage-ის პოპულარობა' },
      { device: 'HDD', growth: -8, reason: 'SSD-ზე გადასვლა' }
    ],
    problem_patterns: [
      { problem: 'წყლის დაზიანება', frequency: 23, solution_rate: 67 },
      { problem: 'ფიზიკური დაზიანება', frequency: 31, solution_rate: 89 },
      { problem: 'ლოგიკური დაზიანება', frequency: 46, solution_rate: 94 }
    ]
  });

  const [mlModels, setMlModels] = useState([
    {
      name: 'შემოსავლის პროგნოზი',
      accuracy: 87.4,
      status: 'active',
      last_trained: '2025-09-01',
      predictions_made: 1247
    },
    {
      name: 'კლიენტების ქცევა',
      accuracy: 91.2,
      status: 'active',
      last_trained: '2025-08-28',
      predictions_made: 856
    },
    {
      name: 'დროის პროგნოზი',
      accuracy: 79.8,
      status: 'training',
      last_trained: '2025-08-25',
      predictions_made: 623
    }
  ]);

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">🤖 AI Analytics</h2>
          <p className="text-gray-600">მანქანური სწავლება და ინტელექტუალური ანალიზი</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white text-gray-900 border-gray-300 hover:bg-gray-50">
            <Brain className="h-4 w-4 mr-2" />
            მოდელების ტრენინგი
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <Zap className="h-4 w-4 mr-2" />
            AI Assistant
          </Button>
        </div>
      </div>

      {/* Predictions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">შემოსავლის პროგნოზი</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{predictions.revenue.next_month.toLocaleString()}₾</div>
            <div className="flex items-center text-xs text-blue-700 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>მომდევნო თვე</span>
            </div>
            <div className={`text-xs mt-2 ${getConfidenceColor(predictions.revenue.confidence)}`}>
              სანდოობა: {predictions.revenue.confidence}%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">საქმეების პროგნოზი</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{predictions.cases.next_week}</div>
            <div className="flex items-center text-xs text-green-700 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>მომდევნო კვირა</span>
            </div>
            <div className={`text-xs mt-2 ${getConfidenceColor(predictions.cases.confidence)}`}>
              სანდოობა: {predictions.cases.confidence}%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">დასრულების დრო</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{predictions.completion_time.avg_hours}ს</div>
            <div className="flex items-center text-xs text-purple-700 mt-1">
              <Activity className="h-3 w-3 mr-1" />
              <span>საშუალო დრო</span>
            </div>
            <div className={`text-xs mt-2 ${getConfidenceColor(predictions.completion_time.confidence)}`}>
              სანდოობა: {predictions.completion_time.confidence}%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">კმაყოფილება</CardTitle>
            <Target className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{predictions.customer_satisfaction.score}/5</div>
            <div className="flex items-center text-xs text-orange-700 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>პროგნოზირებული</span>
            </div>
            <div className={`text-xs mt-2 ${getConfidenceColor(predictions.customer_satisfaction.confidence)}`}>
              სანდოობა: {predictions.customer_satisfaction.confidence}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            AI ინსაითები და რეკომენდაციები
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight) => (
              <div 
                key={insight.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge className={getImpactColor(insight.impact)}>
                    {insight.impact === 'high' ? '🔥 მაღალი' : 
                     insight.impact === 'medium' ? '⚡ საშუალო' : 
                     '📋 დაბალი'} გავლენა
                  </Badge>
                  <div className={`text-sm ${getConfidenceColor(insight.confidence)}`}>
                    {insight.confidence}%
                  </div>
                </div>
                
                <h4 className="font-medium text-gray-900 mb-2">{insight.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">მოქმედება:</span>
                  <span className="text-xs font-medium text-blue-600">{insight.action}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trends Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              ტრენდების ანალიზი
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Seasonal Trends */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">სეზონური ტრენდები</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">პიკური თვეები:</span>
                  <span className="text-sm font-medium">{trends.seasonal.peak_months.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">ყველაზე ნაკლები:</span>
                  <span className="text-sm font-medium">{trends.seasonal.low_months.join(', ')}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">{trends.seasonal.reason}</p>
              </div>
            </div>

            {/* Device Trends */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">მოწყობილობების ტრენდები</h4>
              <div className="space-y-2">
                {trends.device_trends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">{trend.device}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        trend.growth > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {trend.growth > 0 ? '+' : ''}{trend.growth}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-purple-500" />
              პრობლემების ანალიზი
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trends.problem_patterns.map((pattern, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{pattern.problem}</span>
                    <Badge variant="outline" className="text-xs">
                      {pattern.frequency}% სიხშირე
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${pattern.solution_rate}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>ამოხსნის მაჩვენებელი</span>
                    <span>{pattern.solution_rate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ML Models Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            მანქანური სწავლების მოდელები
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mlModels.map((model, index) => (
              <div 
                key={index}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{model.name}</h4>
                  <Badge className={
                    model.status === 'active' ? 'bg-green-100 text-green-700' :
                    model.status === 'training' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }>
                    {model.status === 'active' ? '🟢 აქტიური' :
                     model.status === 'training' ? '🟡 ტრენინგი' :
                     '🔴 გაუქმებული'}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">სიზუსტე:</span>
                    <span className={`font-medium ${getConfidenceColor(model.accuracy)}`}>
                      {model.accuracy}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ბოლო ტრენინგი:</span>
                    <span className="font-medium">{model.last_trained}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">პროგნოზები:</span>
                    <span className="font-medium">{model.predictions_made.toLocaleString()}</span>
                  </div>
                </div>
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full mt-3 border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  დეტალები
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAnalytics;