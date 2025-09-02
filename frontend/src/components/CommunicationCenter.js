import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { 
  Mail, 
  MessageSquare, 
  Send, 
  Phone, 
  Bell,
  Settings,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap
} from 'lucide-react';

const CommunicationCenter = ({ serviceRequests, contactMessages }) => {
  const [emailTemplates, setEmailTemplates] = useState([
    {
      id: 1,
      name: 'მიღების დადასტურება',
      subject: 'თქვენი მოთხოვნა მიღებულია - {case_id}',
      body: 'ძვირფასო {customer_name},\n\nთქვენი მოთხოვნა მიღებულია. საქმის ID: {case_id}\n\nჩვენ დაგიკავშირდებით 24 საათის განმავლობაში.\n\nმადლობა,\nDataLab Georgia გუნდი',
      trigger: 'case_created'
    },
    {
      id: 2,
      name: 'სამუშაოს დაწყება',
      subject: 'თქვენს საქმეზე სამუშაო დაიწყო - {case_id}',
      body: 'ძვირფასო {customer_name},\n\nთქვენს საქმეზე სამუშაო დაიწყო. საქმის ID: {case_id}\n\nმოწყობილობის ტიპი: {device_type}\nპრობლემა: {problem_description}\n\nჩვენ გავაცნობებთ პროგრესს.\n\nმადლობა,\nDataLab Georgia გუნდი',
      trigger: 'work_started'
    },
    {
      id: 3,
      name: 'სამუშაოს დასრულება',
      subject: 'თქვენი საქმე წარმატებით დასრულდა - {case_id}',
      body: 'ძვირფასო {customer_name},\n\nთქვენი საქმე წარმატებით დასრულდა! საქმის ID: {case_id}\n\nშეგიძლიათ მოვიდეთ თქვენი მოწყობილობის ასაღებად.\n\nსრული ღირებულება: {price}₾\n\nმადლობა ნდობისთვის!\n\nDataLab Georgia გუნდი',
      trigger: 'work_completed'
    }
  ]);

  const [smsTemplates, setSmsTemplates] = useState([
    {
      id: 1,
      name: 'მოკლე დადასტურება',
      body: 'DataLab Georgia: თქვენი მოთხოვნა მიღებულია. საქმის ID: {case_id}. გმადლობთ!',
      trigger: 'case_created'
    },
    {
      id: 2,
      name: 'სამუშაოს დასრულება',
      body: 'DataLab Georgia: თქვენი საქმე ({case_id}) დასრულდა! შეგიძლიათ ასაღებად მობრძანდეთ.',
      trigger: 'work_completed'
    }
  ]);

  const [automationRules, setAutomationRules] = useState([
    {
      id: 1,
      name: 'ავტო-დადასტურება',
      trigger: 'case_created',
      actions: ['send_email', 'send_sms'],
      active: true,
      delay: 0
    },
    {
      id: 2,
      name: 'სამუშაოს შეხსენება',
      trigger: 'case_pending_24h',
      actions: ['send_email'],
      active: true,
      delay: 1440 // 24 hours in minutes
    },
    {
      id: 3,
      name: 'დასრულების შეტყობინება',
      trigger: 'work_completed',
      actions: ['send_email', 'send_sms'],
      active: true,
      delay: 0
    }
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [bulkMessage, setBulkMessage] = useState({
    subject: '',
    body: '',
    recipients: 'all', // all, pending, completed
    type: 'email' // email, sms
  });

  const sendBulkMessage = async () => {
    try {
      // Filter recipients based on selection
      let recipients = [];
      
      if (bulkMessage.recipients === 'all') {
        recipients = serviceRequests.map(req => ({
          email: req.email,
          phone: req.phone,
          name: req.name,
          case_id: req.case_id
        }));
      } else if (bulkMessage.recipients === 'pending') {
        recipients = serviceRequests
          .filter(req => req.status === 'pending' || req.status === 'in_progress')
          .map(req => ({
            email: req.email,
            phone: req.phone,
            name: req.name,
            case_id: req.case_id
          }));
      } else if (bulkMessage.recipients === 'completed') {
        recipients = serviceRequests
          .filter(req => req.status === 'completed')
          .map(req => ({
            email: req.email,
            phone: req.phone,
            name: req.name,
            case_id: req.case_id
          }));
      }

      console.log(`Sending ${bulkMessage.type} to ${recipients.length} recipients`);
      
      // Here you would integrate with actual email/SMS service
      // For now, we'll just simulate success
      alert(`${bulkMessage.type === 'email' ? 'ემაილები' : 'SMS-ები'} გაიგზავნა ${recipients.length} მიმღებისთვის!`);
      
      setBulkMessage({ subject: '', body: '', recipients: 'all', type: 'email' });
    } catch (error) {
      console.error('Error sending bulk message:', error);
      alert('შეცდომა მესიჯების გაგზავნისას');
    }
  };

  const toggleAutomationRule = (ruleId) => {
    setAutomationRules(rules => 
      rules.map(rule => 
        rule.id === ruleId ? { ...rule, active: !rule.active } : rule
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">📨 კომუნიკაციის ცენტრი</h2>
          <p className="text-gray-600">ავტომატიზებული Email/SMS სისტემები</p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Settings className="h-4 w-4 mr-2" />
            პარამეტრები
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">გაგზავნილი ემაილები</CardTitle>
            <Mail className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">1,247</div>
            <p className="text-xs text-gray-500">+12% ამ თვეში</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">გაგზავნილი SMS</CardTitle>
            <MessageSquare className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">856</div>
            <p className="text-xs text-gray-500">+8% ამ თვეში</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">ავტომატიზაცია</CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {automationRules.filter(rule => rule.active).length}/{automationRules.length}
            </div>
            <p className="text-xs text-gray-500">აქტიური წესები</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">პასუხის მაჩვენებელი</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">94%</div>
            <p className="text-xs text-gray-500">მიღების მაჩვენებელი</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bulk Messaging */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-blue-500" />
              ბულკ მესიჯები
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <select 
                value={bulkMessage.type}
                onChange={(e) => setBulkMessage({...bulkMessage, type: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
              >
                <option value="email">📧 ემაილი</option>
                <option value="sms">📱 SMS</option>
              </select>
              
              <select 
                value={bulkMessage.recipients}
                onChange={(e) => setBulkMessage({...bulkMessage, recipients: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 flex-1"
              >
                <option value="all">ყველა კლიენტი</option>
                <option value="pending">მომლოდინე საქმეები</option>
                <option value="completed">დასრულებული საქმეები</option>
              </select>
            </div>

            {bulkMessage.type === 'email' && (
              <Input
                placeholder="სათაური"
                value={bulkMessage.subject}
                onChange={(e) => setBulkMessage({...bulkMessage, subject: e.target.value})}
                className="bg-white text-gray-900 border-gray-300"
              />
            )}

            <Textarea
              placeholder="შეტყობინების ტექსტი..."
              value={bulkMessage.body}
              onChange={(e) => setBulkMessage({...bulkMessage, body: e.target.value})}
              className="min-h-32 bg-white text-gray-900 border-gray-300"
            />

            <Button 
              onClick={sendBulkMessage}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!bulkMessage.body}
            >
              <Send className="h-4 w-4 mr-2" />
              გაგზავნა
            </Button>
          </CardContent>
        </Card>

        {/* Automation Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              ავტომატიზაციის წესები
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {automationRules.map((rule) => (
                <div 
                  key={rule.id}
                  className={`p-4 border rounded-lg ${rule.active ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${rule.active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <div>
                        <h4 className="font-medium text-gray-900">{rule.name}</h4>
                        <p className="text-sm text-gray-600">
                          {rule.trigger === 'case_created' && 'საქმის შექმნისას'}
                          {rule.trigger === 'case_pending_24h' && '24 საათის შემდეგ'}
                          {rule.trigger === 'work_completed' && 'სამუშაოს დასრულებისას'}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={rule.active ? "default" : "outline"}
                      onClick={() => toggleAutomationRule(rule.id)}
                      className={rule.active ? "bg-green-600 hover:bg-green-700 text-white" : "border-gray-300 text-gray-600 hover:bg-gray-50"}
                    >
                      {rule.active ? 'აქტიური' : 'გაუქმებული'}
                    </Button>
                  </div>
                  
                  <div className="mt-2 flex gap-2">
                    {rule.actions.includes('send_email') && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        📧 Email
                      </span>
                    )}
                    {rule.actions.includes('send_sms') && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        📱 SMS
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-500" />
            ემაილის შაბლონები
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {emailTemplates.map((template) => (
              <div 
                key={template.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors"
                onClick={() => setSelectedTemplate(template)}
              >
                <h4 className="font-medium text-gray-900 mb-2">{template.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{template.subject}</p>
                <p className="text-xs text-gray-500 line-clamp-3">{template.body}</p>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                    {template.trigger === 'case_created' && 'საქმის შექმნა'}
                    {template.trigger === 'work_started' && 'სამუშაოს დაწყება'}
                    {template.trigger === 'work_completed' && 'სამუშაოს დასრულება'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-500" />
            ბოლო აქტივობა
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
              <Mail className="h-5 w-5 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">დადასტურების ემაილი გაიგზავნა</p>
                <p className="text-xs text-gray-600">user@example.com - DL2025001</p>
              </div>
              <span className="text-xs text-gray-500">2 წუთის წინ</span>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
              <MessageSquare className="h-5 w-5 text-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">SMS შეტყობინება გაიგზავნა</p>
                <p className="text-xs text-gray-600">+995598123456 - DL2025002</p>
              </div>
              <span className="text-xs text-gray-500">5 წუთის წინ</span>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-yellow-50 rounded-lg">
              <Zap className="h-5 w-5 text-yellow-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">ავტომატიზაციის წესი გააქტიურდა</p>
                <p className="text-xs text-gray-600">სამუშაოს დასრულების შეტყობინება</p>
              </div>
              <span className="text-xs text-gray-500">10 წუთის წინ</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunicationCenter;