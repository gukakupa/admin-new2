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
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">DataLab Georgia - Admin Panel</h1>
              <p className="text-gray-400">Manage service requests, contacts, and testimonials</p>
            </div>
            <Button onClick={fetchAllData} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Service Requests</CardTitle>
              <Package className="h-4 w-4 text-red-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{serviceRequests.length}</div>
              <p className="text-xs text-gray-400">Total requests</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Contact Messages</CardTitle>
              <Mail className="h-4 w-4 text-red-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.total || 0}</div>
              <p className="text-xs text-gray-400">{stats.new || 0} new messages</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Testimonials</CardTitle>
              <Star className="h-4 w-4 text-red-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{testimonials.length}</div>
              <p className="text-xs text-gray-400">{testimonials.filter(t => t.is_active).length} active</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Pending Cases</CardTitle>
              <Clock className="h-4 w-4 text-red-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {serviceRequests.filter(r => r.status === 'pending').length}
              </div>
              <p className="text-xs text-gray-400">Need attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="service-requests" className="space-y-6">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="service-requests" className="data-[state=active]:bg-red-accent">
              Service Requests
            </TabsTrigger>
            <TabsTrigger value="contact-messages" className="data-[state=active]:bg-red-accent">
              Contact Messages
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="data-[state=active]:bg-red-accent">
              Testimonials
            </TabsTrigger>
          </TabsList>

          {/* Service Requests Tab */}
          <TabsContent value="service-requests" className="space-y-4">
            <div className="grid gap-4">
              {serviceRequests.map((request) => (
                <Card key={request.id} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white flex items-center">
                          {getStatusIcon(request.status)}
                          <span className="ml-2">{request.case_id}</span>
                        </CardTitle>
                        <CardDescription>
                          {request.name} - {request.email}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-400">Device Type</p>
                        <p className="text-white">{request.device_type.toUpperCase()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Urgency</p>
                        <p className="text-white">{request.urgency}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Phone</p>
                        <p className="text-white">{request.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Created</p>
                        <p className="text-white">{new Date(request.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-400">Problem Description</p>
                      <p className="text-white">{request.problem_description}</p>
                    </div>

                    <div className="flex gap-2">
                      {request.status !== 'pending' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateServiceStatus(request.id, 'pending')}
                        >
                          Mark Pending
                        </Button>
                      )}
                      {request.status !== 'in_progress' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateServiceStatus(request.id, 'in_progress')}
                        >
                          Mark In Progress
                        </Button>
                      )}
                      {request.status !== 'completed' && (
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => updateServiceStatus(request.id, 'completed')}
                        >
                          Mark Completed
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
                <Card key={message.id} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white">{message.subject}</CardTitle>
                        <CardDescription>
                          {message.name} - {message.email}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className={getStatusColor(message.status)}>
                        {message.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-400">Phone</p>
                        <p className="text-white">{message.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Received</p>
                        <p className="text-white">{new Date(message.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-400">Message</p>
                      <p className="text-white">{message.message}</p>
                    </div>

                    <div className="flex gap-2">
                      {message.status !== 'read' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateMessageStatus(message.id, 'read')}
                        >
                          Mark as Read
                        </Button>
                      )}
                      {message.status !== 'replied' && (
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => updateMessageStatus(message.id, 'replied')}
                        >
                          Mark as Replied
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
                <Card key={testimonial.id} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white">{testimonial.name}</CardTitle>
                        <CardDescription>{testimonial.position}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
                              }`}
                            />
                          ))}
                        </div>
                        <Badge variant="outline" className={testimonial.is_active ? 'border-green-500 text-green-500' : 'border-gray-500 text-gray-500'}>
                          {testimonial.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-400">Georgian Text</p>
                        <p className="text-white text-sm">"{testimonial.text_ka}"</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">English Text</p>
                        <p className="text-white text-sm">"{testimonial.text_en}"</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white">
                        <Trash2 className="w-4 h-4 mr-1" />
                        {testimonial.is_active ? 'Deactivate' : 'Activate'}
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