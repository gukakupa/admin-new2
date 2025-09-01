import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';
import { 
  Package, 
  Mail, 
  MessageSquare, 
  Users, 
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Trash2,
  Edit,
  RefreshCw
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminPanel = () => {
  const { toast } = useToast();
  const [serviceRequests, setServiceRequests] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [servicesRes, contactRes, testimonialsRes, statsRes] = await Promise.all([
        axios.get(`${API}/service-requests/`),
        axios.get(`${API}/contact/`),
        axios.get(`${API}/testimonials/all`),
        axios.get(`${API}/contact/stats`)
      ]);

      setServiceRequests(servicesRes.data);
      setContactMessages(contactRes.data);
      setTestimonials(testimonialsRes.data);
      setStats(statsRes.data);

    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load admin data',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateServiceStatus = async (requestId, newStatus) => {
    try {
      await axios.put(`${API}/service-requests/${requestId}`, {
        status: newStatus
      });
      
      toast({
        title: 'Success',
        description: 'Service request status updated'
      });
      
      fetchAllData(); // Refresh data
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: "destructive"
      });
    }
  };

  const updateMessageStatus = async (messageId, newStatus) => {
    try {
      await axios.put(`${API}/contact/${messageId}/status`, {
        status: newStatus
      });
      
      toast({
        title: 'Success',
        description: 'Message status updated'
      });
      
      fetchAllData(); // Refresh data
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update message status',
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'border-green-500 text-green-500';
      case 'in_progress':
        return 'border-yellow-500 text-yellow-500';
      case 'pending':
        return 'border-orange-500 text-orange-500';
      case 'new':
        return 'border-blue-500 text-blue-500';
      case 'read':
        return 'border-gray-500 text-gray-500';
      case 'replied':
        return 'border-green-500 text-green-500';
      default:
        return 'border-gray-500 text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">ადმინ პანელი იტვირთება...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">DataLab Georgia - ადმინისტრაციის პანელი</h1>
              <p className="text-gray-600">სერვისის მოთხოვნების, კონტაქტების და გამოხმაურებების მართვა</p>
            </div>
            <Button onClick={fetchAllData} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
              <RefreshCw className="w-4 h-4 mr-2" />
              განახლება
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">სერვისის მოთხოვნები</CardTitle>
              <Package className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{serviceRequests.length}</div>
              <p className="text-xs text-gray-500">სულ მოთხოვნები</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">კონტაქტის შეტყობინებები</CardTitle>
              <Mail className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{stats.total || 0}</div>
              <p className="text-xs text-gray-500">{stats.new || 0} ახალი შეტყობინება</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">გამოხმაურებები</CardTitle>
              <Star className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{testimonials.length}</div>
              <p className="text-xs text-gray-500">{testimonials.filter(t => t.is_active).length} აქტიური</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">ლოდინაში არსებული</CardTitle>
              <Clock className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">
                {serviceRequests.filter(r => r.status === 'pending').length}
              </div>
              <p className="text-xs text-gray-500">საჭიროებს ყურადღებას</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="service-requests" className="space-y-6">
          <TabsList className="bg-white border-gray-200 shadow-sm">
            <TabsTrigger value="service-requests" className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-gray-700">
              სერვისის მოთხოვნები
            </TabsTrigger>
            <TabsTrigger value="contact-messages" className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-gray-700">
              კონტაქტის შეტყობინებები
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-gray-700">
              გამოხმაურებები
            </TabsTrigger>
          </TabsList>

          {/* Service Requests Tab */}
          <TabsContent value="service-requests" className="space-y-4">
            <div className="grid gap-4">
              {serviceRequests.map((request) => (
                <Card key={request.id} className="bg-white border-gray-200 shadow-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-gray-800 flex items-center">
                          {getStatusIcon(request.status)}
                          <span className="ml-2">{request.case_id}</span>
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                          {request.name} - {request.email}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className={getStatusColor(request.status)}>
                        {request.status === 'pending' ? 'ლოდინაში' : 
                         request.status === 'in_progress' ? 'მუშავდება' : 
                         request.status === 'completed' ? 'დასრულებული' : request.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">მოწყობილობის ტიპი</p>
                        <p className="text-gray-800">{request.device_type.toUpperCase()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">სისწრაფე</p>
                        <p className="text-gray-800">
                          {request.urgency === 'low' ? 'დაბალი' :
                           request.urgency === 'medium' ? 'საშუალო' :
                           request.urgency === 'high' ? 'მაღალი' :
                           request.urgency === 'critical' ? 'კრიტიკული' : request.urgency}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">ტელეფონი</p>
                        <p className="text-gray-800">{request.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">შექმნის თარიღი</p>
                        <p className="text-gray-800">{new Date(request.created_at).toLocaleDateString('ka-GE')}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">პრობლემის აღწერა</p>
                      <p className="text-gray-800">{request.problem_description}</p>
                    </div>

                    <div className="flex gap-2">
                      {request.status !== 'pending' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-gray-300 text-gray-700 hover:bg-gray-100"
                          onClick={() => updateServiceStatus(request.id, 'pending')}
                        >
                          ლოდინაში დაყენება
                        </Button>
                      )}
                      {request.status !== 'in_progress' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-blue-300 text-blue-700 hover:bg-blue-50"
                          onClick={() => updateServiceStatus(request.id, 'in_progress')}
                        >
                          მუშაობის დაწყება
                        </Button>
                      )}
                      {request.status !== 'completed' && (
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => updateServiceStatus(request.id, 'completed')}
                        >
                          დასრულებული
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Contact Messages Tab */}
          <TabsContent value="contact-messages" className="space-y-4">
            <div className="grid gap-4">
              {contactMessages.map((message) => (
                <Card key={message.id} className="bg-white border-gray-200 shadow-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-gray-800">{message.subject}</CardTitle>
                        <CardDescription className="text-gray-600">
                          {message.name} - {message.email}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className={getStatusColor(message.status)}>
                        {message.status === 'new' ? 'ახალი' : 
                         message.status === 'read' ? 'წაკითხული' : 
                         message.status === 'replied' ? 'პასუხგაცემული' : message.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">ტელეფონი</p>
                        <p className="text-gray-800">{message.phone || 'არ არის მითითებული'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">მიღების თარიღი</p>
                        <p className="text-gray-800">{new Date(message.created_at).toLocaleDateString('ka-GE')}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">შეტყობინება</p>
                      <p className="text-gray-800">{message.message}</p>
                    </div>

                    <div className="flex gap-2">
                      {message.status !== 'read' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-gray-300 text-gray-700 hover:bg-gray-100"
                          onClick={() => updateMessageStatus(message.id, 'read')}
                        >
                          წაკითხულად მონიშვნა
                        </Button>
                      )}
                      {message.status !== 'replied' && (
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => updateMessageStatus(message.id, 'replied')}
                        >
                          პასუხგაცემულად მონიშვნა
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials" className="space-y-4">
            <div className="grid gap-4">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="bg-white border-gray-200 shadow-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-gray-800">{testimonial.name}</CardTitle>
                        <CardDescription className="text-gray-600">{testimonial.position}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <Badge variant="outline" className={testimonial.is_active ? 'border-green-500 text-green-600 bg-green-50' : 'border-gray-400 text-gray-600 bg-gray-50'}>
                          {testimonial.is_active ? 'აქტიური' : 'არააქტიური'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">ქართული ტექსტი</p>
                        <p className="text-gray-800 text-sm">"{testimonial.text_ka}"</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">ინგლისური ტექსტი</p>
                        <p className="text-gray-800 text-sm">"{testimonial.text_en}"</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                        <Edit className="w-4 h-4 mr-1" />
                        რედაქტირება
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                        <Trash2 className="w-4 h-4 mr-1" />
                        {testimonial.is_active ? 'გაუქმება' : 'გააქტიურება'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;