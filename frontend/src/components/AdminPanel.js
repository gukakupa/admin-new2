import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
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
  RefreshCw,
  Archive,
  DollarSign,
  Play,
  Square,
  Eye,
  ArchiveRestore
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminPanel = () => {
  const { toast } = useToast();
  const [serviceRequests, setServiceRequests] = useState([]);
  const [archivedRequests, setArchivedRequests] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [editingPrice, setEditingPrice] = useState(null);
  const [priceInput, setPriceInput] = useState('');
  const [editForm, setEditForm] = useState({
    name: '',
    name_en: '',
    position: '',
    position_en: '',
    text_ka: '',
    text_en: '',
    rating: 5,
    image: ''
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [servicesRes, archivedRes, contactRes, testimonialsRes, statsRes] = await Promise.all([
        axios.get(`${API}/service-requests/`),
        axios.get(`${API}/service-requests/archived`),
        axios.get(`${API}/contact/`),
        axios.get(`${API}/testimonials/all`),
        axios.get(`${API}/contact/stats`)
      ]);

      setServiceRequests(servicesRes.data);
      setArchivedRequests(archivedRes.data);
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
        title: 'წარმატება',
        description: 'სერვისის მოთხოვნის სტატუსი განახლდა'
      });
      
      fetchAllData(); // Refresh data
    } catch (error) {
      toast({
        title: 'შეცდომა',
        description: 'სტატუსის განახლება ვერ მოხერხდა',
        variant: "destructive"
      });
    }
  };

  const updateServicePrice = async (requestId, price) => {
    try {
      await axios.put(`${API}/service-requests/${requestId}`, {
        price: parseFloat(price)
      });
      
      toast({
        title: 'წარმატება',
        description: 'ფასი წარმატებით განახლდა'
      });
      
      setEditingPrice(null);
      setPriceInput('');
      fetchAllData(); // Refresh data
    } catch (error) {
      toast({
        title: 'შეცდომა',
        description: 'ფასის განახლება ვერ მოხერხდა',
        variant: "destructive"
      });
    }
  };

  const archiveServiceRequest = async (requestId) => {
    try {
      await axios.put(`${API}/service-requests/${requestId}/archive`);
      
      toast({
        title: 'წარმატება',
        description: 'მოთხოვნა არქივში გადატანილია'
      });
      
      fetchAllData(); // Refresh data
    } catch (error) {
      toast({
        title: 'შეცდომა',
        description: 'არქივში გადატანა ვერ მოხერხდა',
        variant: "destructive"
      });
    }
  };

  const markAsRead = async (requestId) => {
    try {
      await axios.put(`${API}/service-requests/${requestId}`, {
        is_read: true
      });
      
      fetchAllData(); // Refresh data
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const updateMessageStatus = async (messageId, newStatus) => {
    try {
      await axios.put(`${API}/contact/${messageId}/status`, {
        status: newStatus
      });
      
      toast({
        title: 'წარმატება',
        description: 'შეტყობინების სტატუსი განახლდა'
      });
      
      fetchAllData(); // Refresh data
    } catch (error) {
      toast({
        title: 'შეცდომა',
        description: 'სტატუსის განახლება ვერ მოხერხდა',
        variant: "destructive"
      });
    }
  };

  const startEditTestimonial = (testimonial) => {
    setEditingTestimonial(testimonial.id);
    setEditForm({
      name: testimonial.name,
      name_en: testimonial.name_en,
      position: testimonial.position,
      position_en: testimonial.position_en,
      text_ka: testimonial.text_ka,
      text_en: testimonial.text_en,
      rating: testimonial.rating,
      image: testimonial.image || ''
    });
  };

  const startEditPrice = (requestId, currentPrice) => {
    setEditingPrice(requestId);
    setPriceInput(currentPrice ? currentPrice.toString() : '');
  };

  const cancelEdit = () => {
    setEditingTestimonial(null);
    setEditForm({
      name: '',
      name_en: '',
      position: '',
      position_en: '',
      text_ka: '',
      text_en: '',
      rating: 5,
      image: ''
    });
  };

  const cancelPriceEdit = () => {
    setEditingPrice(null);
    setPriceInput('');
  };

  const saveTestimonial = async (testimonialId) => {
    try {
      await axios.put(`${API}/testimonials/${testimonialId}`, editForm);
      
      toast({
        title: 'წარმატება',
        description: 'გამოხმაურება წარმატებით განახლდა'
      });
      
      setEditingTestimonial(null);
      fetchAllData(); // Refresh data
    } catch (error) {
      toast({
        title: 'შეცდომა',
        description: 'გამოხმაურების განახლება ვერ მოხერხდა',
        variant: "destructive"
      });
    }
  };

  const toggleTestimonialStatus = async (testimonialId, currentStatus) => {
    try {
      await axios.put(`${API}/testimonials/${testimonialId}`, {
        is_active: !currentStatus
      });
      
      toast({
        title: 'წარმატება',
        description: 'გამოხმაურების სტატუსი შეიცვალა'
      });
      
      fetchAllData(); // Refresh data
    } catch (error) {
      toast({
        title: 'შეცდომა',
        description: 'სტატუსის ცვლილება ვერ მოხერხდა',
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress':
        return <Play className="w-4 h-4 text-yellow-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'unread':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'archived':
        return <Archive className="w-4 h-4 text-gray-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status, isRead = true) => {
    if (status === 'unread' || !isRead) {
      return 'border-red-500 bg-red-50 text-red-700';
    }
    
    switch (status) {
      case 'completed':
        return 'border-green-500 bg-green-50 text-green-700';
      case 'in_progress':
        return 'border-yellow-500 bg-yellow-50 text-yellow-700';
      case 'pending':
        return 'border-orange-500 bg-orange-50 text-orange-700';
      case 'archived':
        return 'border-gray-500 bg-gray-50 text-gray-700';
      case 'new':
        return 'border-blue-500 bg-blue-50 text-blue-700';
      case 'read':
        return 'border-gray-500 bg-gray-50 text-gray-700';
      case 'replied':
        return 'border-green-500 bg-green-50 text-green-700';
      default:
        return 'border-gray-500 bg-gray-50 text-gray-700';
    }
  };

  const getBorderColor = (status, isRead = true) => {
    if (status === 'unread' || !isRead) {
      return 'border-red-500 border-2';
    }
    
    switch (status) {
      case 'completed':
        return 'border-green-500 border-2';
      case 'in_progress':
        return 'border-yellow-500 border-2';
      case 'pending':
        return 'border-orange-500';
      case 'archived':
        return 'border-gray-300';
      default:
        return 'border-gray-300';
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">სერვისის მოთხოვნები</CardTitle>
              <Package className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{serviceRequests.length}</div>
              <p className="text-xs text-gray-500">აქტიური მოთხოვნები</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">წაუკითხავი</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {serviceRequests.filter(r => r.status === 'unread' || !r.is_read).length}
              </div>
              <p className="text-xs text-gray-500">ახალი მოთხოვნები</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">მუშავდება</CardTitle>
              <Play className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {serviceRequests.filter(r => r.status === 'in_progress').length}
              </div>
              <p className="text-xs text-gray-500">დაწყებული სამუშაო</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">არქივი</CardTitle>
              <Archive className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{archivedRequests.length}</div>
              <p className="text-xs text-gray-500">დასრულებული</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">კონტაქტები</CardTitle>
              <Mail className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{stats.total || 0}</div>
              <p className="text-xs text-gray-500">{stats.new || 0} ახალი შეტყობინება</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="service-requests" className="space-y-6">
          <TabsList className="bg-white border-gray-200 shadow-sm">
            <TabsTrigger value="service-requests" className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-gray-700">
              სერვისის მოთხოვნები
            </TabsTrigger>
            <TabsTrigger value="archived-requests" className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-gray-700">
              არქივი
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
                <Card key={request.id} className={`bg-white shadow-sm ${getBorderColor(request.status, request.is_read)}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(request.status)}
                        <div>
                          <CardTitle className="text-gray-800 flex items-center">
                            <span>{request.case_id}</span>
                            {(!request.is_read || request.status === 'unread') && (
                              <Eye 
                                className="w-4 h-4 ml-2 text-red-500 cursor-pointer hover:text-red-700" 
                                onClick={() => markAsRead(request.id)}
                                title="წაკითხულად მონიშვნა"
                              />
                            )}
                          </CardTitle>
                          <CardDescription className="text-gray-600">
                            {request.name} - {request.email}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className={getStatusColor(request.status, request.is_read)}>
                        {request.status === 'unread' ? 'წაუკითხავი' :
                         request.status === 'pending' ? 'ლოდინაში' : 
                         request.status === 'in_progress' ? 'მუშავდება' : 
                         request.status === 'completed' ? 'დასრულებული' : request.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                      {request.started_at && (
                        <div>
                          <p className="text-sm text-gray-500">დაწყების თარიღი</p>
                          <p className="text-gray-800">{new Date(request.started_at).toLocaleDateString('ka-GE')}</p>
                        </div>
                      )}
                      {request.completed_at && (
                        <div>
                          <p className="text-sm text-gray-500">დასრულების თარიღი</p>
                          <p className="text-gray-800">{new Date(request.completed_at).toLocaleDateString('ka-GE')}</p>
                        </div>
                      )}
                    </div>

                    {/* Price Section */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-500">ფასი:</p>
                        {editingPrice === request.id ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={priceInput}
                              onChange={(e) => setPriceInput(e.target.value)}
                              placeholder="ფასი ლარებში"
                              className="w-32"
                            />
                            <Button
                              size="sm"
                              onClick={() => updateServicePrice(request.id, priceInput)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              შენახვა
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelPriceEdit}
                            >
                              გაუქმება
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <p className="text-gray-800 font-medium">
                              {request.price ? `${request.price}₾` : 'არ არის მითითებული'}
                            </p>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEditPrice(request.id, request.price)}
                              className="border-gray-300 text-gray-700 hover:bg-gray-100"
                            >
                              <DollarSign className="w-4 h-4 mr-1" />
                              ფასის რედაქტირება
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">პრობლემის აღწერა</p>
                      <p className="text-gray-800">{request.problem_description}</p>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      {request.status === 'unread' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-orange-300 text-orange-700 hover:bg-orange-50"
                          onClick={() => updateServiceStatus(request.id, 'pending')}
                        >
                          ლოდინაში დაყენება
                        </Button>
                      )}
                      {request.status !== 'in_progress' && request.status !== 'completed' && (
                        <Button 
                          size="sm" 
                          className="bg-yellow-600 hover:bg-yellow-700 text-white"
                          onClick={() => updateServiceStatus(request.id, 'in_progress')}
                        >
                          <Play className="w-4 h-4 mr-1" />
                          მუშაობის დაწყება
                        </Button>
                      )}
                      {request.status !== 'completed' && (
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => updateServiceStatus(request.id, 'completed')}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          დასრულებული
                        </Button>
                      )}
                      {request.status === 'completed' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-gray-300 text-gray-700 hover:bg-gray-100"
                          onClick={() => archiveServiceRequest(request.id)}
                        >
                          <Archive className="w-4 h-4 mr-1" />
                          არქივში გადატანა
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Archived Requests Tab */}
          <TabsContent value="archived-requests" className="space-y-4">
            <div className="grid gap-4">
              {archivedRequests.map((request) => (
                <Card key={request.id} className="bg-white border-gray-200 shadow-sm opacity-75">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Archive className="w-4 h-4 text-gray-500" />
                        <div>
                          <CardTitle className="text-gray-800">{request.case_id}</CardTitle>
                          <CardDescription className="text-gray-600">
                            {request.name} - {request.email}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-gray-500 bg-gray-50 text-gray-700">
                        არქივირებული
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">მოწყობილობის ტიპი</p>
                        <p className="text-gray-800">{request.device_type.toUpperCase()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">ფასი</p>
                        <p className="text-gray-800 font-medium">
                          {request.price ? `${request.price}₾` : 'არ არის მითითებული'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">დასრულების თარიღი</p>
                        <p className="text-gray-800">
                          {request.completed_at ? new Date(request.completed_at).toLocaleDateString('ka-GE') : 'არ არის მითითებული'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">პრობლემის აღწერა</p>
                      <p className="text-gray-800">{request.problem_description}</p>
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
                      <div className="flex items-center gap-3">
                        {testimonial.image && (
                          <img 
                            src={testimonial.image} 
                            alt={testimonial.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        <div>
                          <CardTitle className="text-gray-800">{testimonial.name}</CardTitle>
                          <CardDescription className="text-gray-600">{testimonial.position}</CardDescription>
                        </div>
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
                    {editingTestimonial === testimonial.id ? (
                      // Edit Form
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-gray-600">ქართული სახელი</Label>
                            <Input
                              value={editForm.name}
                              onChange={(e) => setEditForm(prev => ({...prev, name: e.target.value}))}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-gray-600">ინგლისური სახელი</Label>
                            <Input
                              value={editForm.name_en}
                              onChange={(e) => setEditForm(prev => ({...prev, name_en: e.target.value}))}
                              className="mt-1"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-gray-600">ქართული პოზიცია</Label>
                            <Input
                              value={editForm.position}
                              onChange={(e) => setEditForm(prev => ({...prev, position: e.target.value}))}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-gray-600">ინგლისური პოზიცია</Label>
                            <Input
                              value={editForm.position_en}
                              onChange={(e) => setEditForm(prev => ({...prev, position_en: e.target.value}))}
                              className="mt-1"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-gray-600">ქართული ტექსტი</Label>
                            <Textarea
                              value={editForm.text_ka}
                              onChange={(e) => setEditForm(prev => ({...prev, text_ka: e.target.value}))}
                              rows={3}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-gray-600">ინგლისური ტექსტი</Label>
                            <Textarea
                              value={editForm.text_en}
                              onChange={(e) => setEditForm(prev => ({...prev, text_en: e.target.value}))}
                              rows={3}
                              className="mt-1"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-gray-600">ფოტო URL</Label>
                            <Input
                              value={editForm.image}
                              onChange={(e) => setEditForm(prev => ({...prev, image: e.target.value}))}
                              placeholder="https://images.unsplash.com/photo-..."
                              className="mt-1"
                            />
                            {editForm.image && (
                              <div className="mt-2">
                                <img 
                                  src={editForm.image} 
                                  alt="Preview" 
                                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <Label className="text-gray-600">რეიტინგი</Label>
                            <div className="flex gap-1 mt-2">
                              {Array.from({ length: 5 }, (_, i) => (
                                <button
                                  key={i}
                                  onClick={() => setEditForm(prev => ({...prev, rating: i + 1}))}
                                  className="focus:outline-none"
                                >
                                  <Star
                                    className={`w-6 h-6 ${
                                      i < editForm.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                    } hover:text-yellow-400 transition-colors`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 pt-4">
                          <Button 
                            onClick={() => saveTestimonial(testimonial.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            შენახვა
                          </Button>
                          <Button 
                            onClick={cancelEdit}
                            variant="outline"
                            className="border-gray-300 text-gray-700 hover:bg-gray-100"
                          >
                            გაუქმება
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // Display Mode
                      <>
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
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-gray-300 text-gray-700 hover:bg-gray-100"
                            onClick={() => startEditTestimonial(testimonial)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            რედაქტირება
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600 border-red-300 hover:bg-red-50"
                            onClick={() => toggleTestimonialStatus(testimonial.id, testimonial.is_active)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            {testimonial.is_active ? 'გაუქმება' : 'გააქტიურება'}
                          </Button>
                        </div>
                      </>
                    )}
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