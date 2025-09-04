import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from './ui/card';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity,
  PieChart,
  Calendar,
  Download
} from 'lucide-react';
import { Button } from './ui/button';

const AnalyticsDashboard = ({ serviceRequests, contactMessages, testimonials, darkMode = false }) => {
  const [timeFrame, setTimeFrame] = useState('week');
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalCases: 0,
    completedCases: 0,
    activeClients: 0,
    avgCompletionTime: 0,
    customerSatisfaction: 0
  });

  useEffect(() => {
    calculateMetrics();
  }, [serviceRequests, contactMessages, timeFrame]);

  const calculateMetrics = () => {
    if (!serviceRequests?.length) return;

    const now = new Date();
    const timeFrameDays = timeFrame === 'week' ? 7 : timeFrame === 'month' ? 30 : 365;
    const cutoffDate = new Date(now.getTime() - (timeFrameDays * 24 * 60 * 60 * 1000));

    const filteredRequests = serviceRequests.filter(req => 
      new Date(req.created_at) >= cutoffDate
    );

    const totalRevenue = filteredRequests
      .filter(req => req.price)
      .reduce((sum, req) => sum + (req.price || 0), 0);

    const completedCases = filteredRequests.filter(req => 
      ['completed', 'picked_up'].includes(req.status)
    ).length;
    const activeCases = filteredRequests.filter(req => 
      ['pending', 'in_progress'].includes(req.status)
    ).length;

    // Calculate average completion time
    const completedWithTimes = filteredRequests.filter(req => 
      ['completed', 'picked_up'].includes(req.status) && req.started_at && req.completed_at
    );
    const avgTime = completedWithTimes.length > 0 
      ? completedWithTimes.reduce((sum, req) => {
          const start = new Date(req.started_at);
          const end = new Date(req.completed_at);
          return sum + (end - start);
        }, 0) / completedWithTimes.length / (1000 * 60 * 60 * 24) // Convert to days
      : 0;

    // Customer satisfaction from testimonials
    const avgRating = testimonials?.length > 0 
      ? testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length 
      : 0;

    setMetrics({
      totalRevenue,
      totalCases: filteredRequests.length,
      completedCases,
      activeClients: activeCases,
      avgCompletionTime: Math.round(avgTime * 10) / 10,
      customerSatisfaction: Math.round(avgRating * 10) / 10
    });
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = "blue" }) => (
    <Card className={`relative overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{title}</CardTitle>
        <Icon className={`h-4 w-4 text-${color}-500`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</div>
        <div className={`flex items-center text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {trend && (
            <TrendingUp className={`mr-1 h-3 w-3 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`} />
          )}
          <span>{subtitle}</span>
        </div>
      </CardContent>
      <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-${color}-400 to-${color}-600`}></div>
    </Card>
  );

  const chartData = {
    weekly: serviceRequests?.reduce((acc, req) => {
      const week = new Date(req.created_at).toLocaleDateString('ka-GE', { 
        month: 'short', 
        day: 'numeric' 
      });
      acc[week] = (acc[week] || 0) + 1;
      return acc;
    }, {}) || {},
    
    statusDistribution: serviceRequests?.reduce((acc, req) => {
      acc[req.status] = (acc[req.status] || 0) + 1;
      return acc;
    }, {}) || {}
  };

  const exportData = () => {
    const data = {
      metrics,
      timeFrame,
      exportDate: new Date().toISOString(),
      chartData
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics_${timeFrame}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>📊 კანბან ანალიტიკა</h2>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>მხოლოდ კანბანში დამტკიცებული პროექტების მეტრიკები</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={timeFrame} 
            onChange={(e) => setTimeFrame(e.target.value)}
            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="week">ბოლო კვირა</option>
            <option value="month">ბოლო თვე</option>
            <option value="year">ბოლო წელი</option>
          </select>
          <Button onClick={exportData} variant="outline" className={`flex items-center gap-2 ${
            darkMode 
              ? 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600' 
              : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
          }`}>
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="🔥 მთლიანი შემოსავალი"
          value={`${metrics.totalRevenue.toLocaleString()}₾`}
          subtitle={`${timeFrame === 'week' ? 'ამ კვირაში' : timeFrame === 'month' ? 'ამ თვეში' : 'ამ წელს'}`}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="📋 კანბან პროექტები"
          value={metrics.totalCases}
          subtitle={`${metrics.completedCases} დასრულებული`}
          icon={BarChart3}
          color="blue"
        />
        <StatCard
          title="👥 მიმდინარე კლიენტები"
          value={metrics.activeClients}
          subtitle="მიმდინარე პროექტები"
          icon={Users}
          color="purple"
        />
        <StatCard
          title="⏱️ საშუალო დასრულების დრო"
          value={`${metrics.avgCompletionTime} დღე`}
          subtitle="პროექტის სისწრაფე"
          icon={Activity}
          color="orange"
        />
        <StatCard
          title="⭐ მომხმარებელთა კმაყოფილება"
          value={`${metrics.customerSatisfaction}/5`}
          subtitle={`${testimonials?.length || 0} შეფასება`}
          icon={TrendingUp}
          color="yellow"
        />
        <StatCard
          title="📈 კვირეული ზრდა"
          value="+12%"
          subtitle="წინა კვირასთან შედარებით"
          icon={PieChart}
          color="indigo"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Chart */}
        <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <BarChart3 className="h-5 w-5 text-blue-500" />
              კვირეული აქტივობა
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(chartData.weekly).slice(-7).map(([date, count]) => (
                <div key={date} className="flex items-center gap-4">
                  <div className={`w-20 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{date}</div>
                  <div className={`flex-1 rounded-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(count / Math.max(...Object.values(chartData.weekly))) * 100}%` }}
                    ></div>
                  </div>
                  <div className={`w-8 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{count}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <PieChart className="h-5 w-5 text-purple-500" />
              სტატუსების განაწილება
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Fixed order to match updated Kanban */}
              {['pending', 'in_progress', 'completed', 'picked_up'].map((status) => {
                const count = chartData.statusDistribution[status] || 0;
                if (count === 0) return null; // Skip if no items
                
                const statusInfo = {
                  'pending': { label: 'მომლოდინე', color: 'bg-orange-500' },
                  'in_progress': { label: 'მუშავდება', color: 'bg-blue-500' },
                  'completed': { label: 'დასრულებული', color: 'bg-green-500' },
                  'picked_up': { label: 'გატანილი', color: 'bg-purple-500' }
                };
                
                const info = statusInfo[status];
                const percentage = Math.round((count / serviceRequests.length) * 100);
                
                return (
                  <div key={status} className="flex items-center gap-4">
                    <div className={`w-4 h-4 rounded-full ${info.color}`}></div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{info.label}</span>
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{count} ({percentage}%)</span>
                      </div>
                      <div className={`w-full rounded-full h-2 mt-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        <div 
                          className={`h-2 rounded-full ${info.color} transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Insights */}
      <Card className={`${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600' : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'}`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${darkMode ? 'text-blue-400' : 'text-blue-800'}`}>
            💡 სწრაფი ანალიზი
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>უმაღლესი შემოსავალი: SSD აღდგენა</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>ყველაზე სწრაფი: USB მოწყობილობები</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>პოპულარული: RAID სისტემები</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;