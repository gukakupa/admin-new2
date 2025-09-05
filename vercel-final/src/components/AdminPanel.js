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
import AnalyticsDashboard from './AnalyticsDashboard'; // Direct import instead of lazy

import KanbanBoard from './KanbanBoardNew';

import { 
  Package, 
  Mail, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Play, 
  Edit,
  Trash2,
  Archive,
  ArchiveRestore,
  Package2,
  Edit2,
  Square,
  Eye,
  Moon,
  Sun,
  Filter,
  Download,
  PieChart,
  Activity,
  Zap,
  Calendar,
  X,
  Phone,
  MapPin,
  User,
  FileText,
  BarChart3,
  TrendingUp,
  Save,
  MessageSquare,
  Star,
  RefreshCw,
  DollarSign,
  Search
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
  const [editingRequest, setEditingRequest] = useState(null);
  const [editRequestForm, setEditRequestForm] = useState({
    name: '',
    email: '',
    phone: '',
    device_type: '',
    problem_description: '',
    urgency: 'medium'
  });
  
  // New state for enhanced UX
  const [activeTab, setActiveTab] = useState('kanban');
  const [darkMode, setDarkMode] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedMessages, setExpandedMessages] = useState(new Set());
  const [selectedArchivedRequest, setSelectedArchivedRequest] = useState(null);
  const [editingArchivedRequest, setEditingArchivedRequest] = useState(null);
  
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

  const updateServiceRequest = async (id, updates) => {
    try {
      const response = await axios.put(`${API}/service-requests/${id}`, updates);
      
      // Update the service requests in state
      setServiceRequests(prevRequests => 
        prevRequests.map(request => 
          request.id === id ? { ...request, ...updates } : request
        )
      );
      
      toast({
        title: "✅ განახლება წარმატებული",
        description: "სერვისის მოთხოვნა განახლდა",
        variant: "default"
      });
      
      return response.data;
    } catch (error) {
      console.error('Error updating service request:', error);
      toast({
        title: "❌ შეცდომა",
        description: "სერვისის მოთხოვნის განახლება ვერ მოხერხდა",
        variant: "destructive"
      });
      throw error;
    }
  };
  const restoreFromArchive = async (requestId) => {
    try {
      // Update both status and is_archived
      await updateServiceRequest(requestId, { 
        status: 'completed', 
        is_archived: false 
      });
      
      // Move request from archived to service requests
      const requestToRestore = archivedRequests.find(req => req.id === requestId);
      if (requestToRestore) {
        const restoredRequest = { 
          ...requestToRestore, 
          status: 'completed', 
          is_archived: false 
        };
        setServiceRequests(prev => [...prev, restoredRequest]);
        setArchivedRequests(prev => prev.filter(req => req.id !== requestId));
      }

      toast({
        title: "✅ წარმატებით აღდგა",
        description: "საქმე დაბრუნდა სერვისის მოთხოვნებში",
        variant: "default"
      });
    } catch (error) {
      console.error('Error restoring from archive:', error);
      toast({
        title: "❌ შეცდომა",
        description: "საქმის აღდგენა ვერ მოხერხდა",
        variant: "destructive"
      });
    }
  };

  // Function to update archived request comment
  const updateRequestComment = async (requestId, comment) => {
    try {
      await axios.put(`${API}/service-requests/${requestId}`, {
        admin_comment: comment
      });
      
      // Update local state
      setArchivedRequests(prevRequests => 
        prevRequests.map(request => 
          request.id === requestId ? { ...request, admin_comment: comment } : request
        )
      );
      
      toast({
        title: "✅ კომენტარი შენახულია",
        description: "ადმინისტრაციული კომენტარი წარმატებით განახლდა",
        variant: "default"
      });
      
    } catch (error) {
      console.error('Error updating comment:', error);
      toast({
        title: "❌ შეცდომა",
        description: "კომენტარის განახლება ვერ მოხერხდა",
        variant: "destructive"
      });
    }
  };

  const approveForKanban = async (requestId) => {
    try {
      await updateServiceRequest(requestId, { 
        approved_for_kanban: true,
        status: 'pending' // Default status when approved for Kanban
      });

      toast({
        title: "✅ კანბანში დამატებულია",
        description: "სერვისის მოთხოვნა კანბან ბორდში გამოჩნდება",
        variant: "default"
      });
    } catch (error) {
      console.error('Error approving for Kanban:', error);
      toast({
        title: "❌ შეცდომა", 
        description: "კანბანში დამატება ვერ მოხერხდა",
        variant: "destructive"
      });
    }
  };

  const startEditPrice = (requestId, currentPrice) => {
    setEditingPrice(requestId);
    setPriceInput(currentPrice ? currentPrice.toString() : '');
  };

  const startEditRequest = (request) => {
    setEditingRequest(request.id);
    setEditRequestForm({
      name: request.name || '',
      email: request.email || '',
      phone: request.phone || '',
      device_type: request.device_type || '',
      problem_description: request.problem_description || '',
      urgency: request.urgency || 'medium'
    });
  };

  const cancelEditRequest = () => {
    setEditingRequest(null);
    setEditRequestForm({
      name: '',
      email: '',
      phone: '',
      device_type: '',
      problem_description: '',
      urgency: 'medium'
    });
  };

  const saveEditRequest = async (requestId) => {
    try {
      await axios.put(`${API}/service-requests/${requestId}`, editRequestForm);
      
      toast({
        title: 'წარმატება',
        description: 'მოთხოვნა წარმატებით განახლდა'
      });
      
      setEditingRequest(null);
      fetchAllData(); // Refresh data
    } catch (error) {
      toast({
        title: 'შეცდომა',
        description: 'მოთხოვნის განახლება ვერ მოხერხდა',
        variant: "destructive"
      });
    }
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

  // Import Analytics Dashboard - Direct import instead of lazy
  // const AnalyticsDashboard = React.lazy(() => import('./AnalyticsDashboard'));

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} flex items-center justify-center`}>
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className={`text-lg ${darkMode ? 'text-white' : 'text-gray-700'}`}>მონაცემები იტვირთება...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'kanban', label: '📋 Kanban Board', icon: Activity },
    { id: 'service-requests', label: '📋 სერვისის მოთხოვნები', icon: FileText },
    { id: 'archived-requests', label: '📦 არქივი', icon: Archive },
    { id: 'contact-messages', label: '📧 კონტაქტი', icon: MessageSquare },
    { id: 'dashboard', label: '📊 Dashboard', icon: BarChart3 },
    { id: 'testimonials', label: '⭐ გამოხმაურებები', icon: Star }
  ];

  const filteredRequests = serviceRequests.filter(request => {
    const matchesSearch = searchTerm === '' || 
      request.case_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.phone.includes(searchTerm) ||  // Phone number search (exact match)
      request.device_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.problem_description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || request.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Filtered archived requests with same search criteria
  const filteredArchivedRequests = archivedRequests.filter(request => {
    const matchesSearch = searchTerm === '' || 
      request.case_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.phone.includes(searchTerm) ||  // Phone number search (exact match)
      request.device_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.problem_description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const toggleMessageExpansion = (messageId) => {
    setExpandedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
        // Mark as read when expanded
        if (contactMessages.find(m => m.id === messageId)?.status === 'new') {
          updateMessageStatus(messageId, 'read');
        }
      }
      return newSet;
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('ka-GE', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return date.toLocaleDateString('ka-GE', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  // Filter only approved service requests for Dashboard analytics
  const approvedServiceRequests = serviceRequests.filter(request => request.approved_for_kanban === true);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} transition-colors duration-300`}>
      {/* Compact Header */}
      <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  DataLab Georgia
                </h1>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  ადმინისტრაციული პანელი
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Theme Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDarkMode(!darkMode)}
                className={`flex items-center gap-1 px-2 py-1 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
                    : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-100'
                }`}
              >
                {darkMode ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
                <span className="text-xs">{darkMode ? 'ნათელი' : 'მუქი'}</span>
              </Button>

              {/* Refresh Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={fetchAllData}
                className={`flex items-center gap-1 px-2 py-1 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
                    : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-100'
                }`}
              >
                <RefreshCw className="h-3 w-3" />
                <span className="text-xs">განახლება</span>
              </Button>
            </div>
          </div>

          {/* Compact Navigation Tabs */}
          <div className="flex space-x-1 pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    console.log('Tab clicked:', tab.id, 'Current activeTab:', activeTab);
                    setActiveTab(tab.id);
                  }}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? darkMode 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'bg-red-500 text-white shadow-md'
                      : darkMode
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content - Full Width for Kanban */}
      <main className={`${activeTab === 'kanban' ? 'max-w-none px-6' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'} py-8`}>
        {console.log('Current activeTab:', activeTab)}
        
        {/* Dashboard Tab - Only Approved Kanban Requests */}
        {activeTab === 'dashboard' && (
          <AnalyticsDashboard 
            serviceRequests={approvedServiceRequests}
            contactMessages={contactMessages}
            testimonials={testimonials}
            darkMode={darkMode}
          />
        )}

        {/* Kanban Board Tab */}
        {activeTab === 'kanban' && (
          <KanbanBoard 
            serviceRequests={serviceRequests}
            updateServiceRequest={updateServiceRequest}
            darkMode={darkMode}
          />
        )}

        {/* Service Requests Tab */}
        {activeTab === 'service-requests' && (
          <div className="space-y-6">
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>📋 სერვისის მოთხოვნები</h2>
            {/* Enhanced Filters */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="ძებნა case ID, email, ტელეფონის ნომრით, სახელით ან მოწყობილობის ტიპით..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`pl-10 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="all">ყველა სტატუსი</option>
                    <option value="unread">წაუკითხავი</option>
                    <option value="pending">მომლოდინე</option>
                    <option value="in_progress">მიმდინარე</option>
                    <option value="completed">დასრულებული</option>
                  </select>
                  <Button variant="outline" size="sm" className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'}`}>
                    <Filter className="h-4 w-4 mr-2" />
                    ფილტრი
                  </Button>
                </div>
              </div>
            </div>

            {/* Service Requests Content */}
            <div className="grid gap-4">
              {filteredRequests.map((request) => (
                <Card key={request.id} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-sm ${getBorderColor(request.status, request.is_read)}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(request.status)}
                        <div>
                          <CardTitle className={`${darkMode ? 'text-white' : 'text-gray-800'} flex items-center text-lg`}>
                            <span>{request.case_id}</span>
                            {(!request.is_read || request.status === 'unread') && (
                              <Eye 
                                className="w-4 h-4 ml-2 text-red-500 cursor-pointer hover:text-red-700" 
                                onClick={() => markAsRead(request.id)}
                                title="წაკითხულად მონიშვნა"
                              />
                            )}
                          </CardTitle>
                          <CardDescription className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                            {request.name} - {request.email}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getStatusColor(request.status, request.is_read)}>
                          {request.status === 'unread' ? 'წაუკითხავი' :
                           request.status === 'pending' ? 'ლოდინაში' : 
                           request.status === 'in_progress' ? 'მუშავდება' : 
                           request.status === 'completed' ? 'დასრულებული' : request.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {/* Compact Info Grid - 5 columns */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                      <div>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>მოწყობილობა</p>
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{request.device_type.toUpperCase()}</p>
                      </div>
                      <div>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>სისწრაფე</p>
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {request.urgency === 'low' ? 'დაბალი' :
                           request.urgency === 'medium' ? 'საშუალო' :
                           request.urgency === 'high' ? 'მაღალი' :
                           request.urgency === 'critical' ? 'კრიტიკული' : request.urgency}
                        </p>
                      </div>
                      <div>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>ტელეფონი</p>
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{request.phone}</p>
                      </div>
                      <div>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>შექმნა</p>
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{new Date(request.created_at).toLocaleDateString('ka-GE')}</p>
                      </div>
                      <div>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>დასრულება</p>
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {request.completed_at ? new Date(request.completed_at).toLocaleDateString('ka-GE') : 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* Price Section - Standard Size */}
                    <div className="mb-4 flex items-center gap-4">
                      <div>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>ფასი</p>
                        {editingPrice === request.id ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={priceInput}
                              onChange={(e) => setPriceInput(e.target.value)}
                              placeholder="ფასი ლარებში"
                              className={`w-24 h-8 text-sm ${
                                darkMode 
                                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                  : 'bg-white border-gray-300 text-gray-900'
                              }`}
                            />
                            <Button size="sm" onClick={() => updateServicePrice(request.id, priceInput)} className="bg-green-600 hover:bg-green-700 text-white h-8 px-3 text-xs">
                              ✓
                            </Button>
                            <Button size="sm" variant="outline" onClick={cancelPriceEdit} className={`h-8 px-3 text-xs ${
                              darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                            }`}>
                              ✗
                            </Button>
                          </div>
                        ) : (
                          <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {request.price ? `${request.price}₾` : 'არ არის მითითებული'}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Problem Description - Beautiful Section */}
                    <div className="mb-4 p-3 rounded-lg bg-opacity-20" style={{ backgroundColor: darkMode ? '#374151' : '#f3f4f6' }}>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>პრობლემის აღწერა</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                        {request.problem_description}
                      </p>
                    </div>
                    
                    {/* Action Buttons - Two Rows */}
                    <div className="space-y-2">
                      {/* Status Action Buttons */}
                      <div className="flex gap-2 flex-wrap">
                        {request.status === 'unread' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className={`${darkMode ? 'border-orange-600 text-orange-400 hover:bg-orange-900 hover:bg-opacity-20' : 'border-orange-300 text-orange-700 hover:bg-orange-50'}`}
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
                            <Play className="w-3 h-3 mr-1" />
                            დაწყება
                          </Button>
                        )}
                        {request.status !== 'completed' && (
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => updateServiceStatus(request.id, 'completed')}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            დასრულება
                          </Button>
                        )}
                        {request.status === 'completed' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className={darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}
                            onClick={() => archiveServiceRequest(request.id)}
                          >
                            <Archive className="w-3 h-3 mr-1" />
                            არქივი
                          </Button>
                        )}
                      </div>
                      
                      {/* Contact & Edit Actions */}
                      <div className="flex gap-2 pt-2 border-t border-opacity-20" style={{ borderColor: darkMode ? '#374151' : '#e5e7eb' }}>
                        {/* Kanban Approval Button */}
                        {!request.approved_for_kanban && (
                          <Button 
                            size="sm" 
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => approveForKanban(request.id)}
                          >
                            <Package className="w-3 h-3 mr-1" />
                            კანბანში დამატება
                          </Button>
                        )}
                        {request.approved_for_kanban && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className={`${darkMode ? 'bg-red-900 bg-opacity-20 border-red-600 text-red-400' : 'bg-red-50 border-red-300 text-red-700'}`}
                            disabled
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            კანბანშია
                          </Button>
                        )}
                        
                        <Button 
                          size="sm" 
                          variant="outline"
                          className={`${darkMode ? 'bg-blue-900 bg-opacity-20 border-blue-600 text-blue-400 hover:bg-blue-800 hover:bg-opacity-30' : 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100'}`}
                          onClick={() => window.open(`tel:${request.phone}`, '_self')}
                        >
                          <Phone className="w-3 h-3 mr-1" />
                          დარეკვა
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className={`${darkMode ? 'bg-green-900 bg-opacity-20 border-green-600 text-green-400 hover:bg-green-800 hover:bg-opacity-30' : 'bg-green-50 border-green-300 text-green-700 hover:bg-green-100'}`}
                          onClick={() => window.open(`mailto:${request.email}`, '_self')}
                        >
                          <Mail className="w-3 h-3 mr-1" />
                          ემაილი
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className={`${darkMode ? 'bg-purple-900 bg-opacity-20 border-purple-600 text-purple-400 hover:bg-purple-800 hover:bg-opacity-30' : 'bg-purple-50 border-purple-300 text-purple-700 hover:bg-purple-100'}`}
                          onClick={() => startEditPrice(request.id, request.price)}
                        >
                          <DollarSign className="w-3 h-3 mr-1" />
                          ფასი
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className={`${darkMode ? 'bg-orange-900 bg-opacity-20 border-orange-600 text-orange-400 hover:bg-orange-800 hover:bg-orange-30' : 'bg-orange-50 border-orange-300 text-orange-700 hover:bg-orange-100'}`}
                          onClick={() => startEditRequest(request)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          რედაქტირება
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Archived Requests Tab */}
        {activeTab === 'archived-requests' && (
          <div className="space-y-6">
            {/* Search Filter for Archive */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="ძებნა არქივში - case ID, email, ტელეფონი, სახელი, მოწყობილობა..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`pl-10 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}
                    />
                  </div>
                </div>
                <Button 
                  onClick={() => setSearchTerm('')}
                  variant="outline" 
                  size="sm" 
                  className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'}`}
                >
                  <X className="h-4 w-4 mr-2" />
                  გასუფთავება
                </Button>
              </div>
            </div>

            {/* Archive Cards Grid */}
            <div className="grid gap-4">
              {archivedRequests
                .filter(request => {
                  if (!searchTerm) return true;
                  const searchLower = searchTerm.toLowerCase();
                  return (
                    request.case_id.toLowerCase().includes(searchLower) ||
                    request.email.toLowerCase().includes(searchLower) ||
                    request.name.toLowerCase().includes(searchLower) ||
                    request.phone.includes(searchTerm) ||
                    request.device_type.toLowerCase().includes(searchLower) ||
                    request.problem_description.toLowerCase().includes(searchLower)
                  );
                })
                .map((request) => (
                <Card key={request.id} className={`${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'} shadow-md hover:shadow-lg transition-all duration-200`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900">
                          <Archive className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <CardTitle className={`text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {request.case_id}
                          </CardTitle>
                          <CardDescription className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
                            {request.name} • {request.email}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                          არქივი
                        </Badge>
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedArchivedRequest(selectedArchivedRequest?.id === request.id ? null : request)}
                          className={`${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {/* Basic Info Always Visible */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
                          მოწყობილობა
                        </p>
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {request.device_type.toUpperCase()}
                        </p>
                      </div>
                      <div>
                        <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
                          ღირებულება
                        </p>
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {request.price ? `${request.price}₾` : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
                          შექმნის თარიღი
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {new Date(request.created_at).toLocaleDateString('ka-GE')}
                        </p>
                      </div>
                      <div>
                        <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
                          დასრულება
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {request.completed_at ? new Date(request.completed_at).toLocaleDateString('ka-GE') : 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {selectedArchivedRequest?.id === request.id && (
                      <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} space-y-4`}>
                        {/* Full Contact Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
                              📞 ტელეფონი
                            </p>
                            <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                              {request.phone}
                            </p>
                          </div>
                          <div>
                            <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
                              ⚡ სისწრაფე
                            </p>
                            <Badge variant="outline" className={`
                              ${request.urgency === 'critical' ? 'border-red-500 text-red-700 bg-red-50 dark:bg-red-900 dark:text-red-300' : 
                                request.urgency === 'high' ? 'border-orange-500 text-orange-700 bg-orange-50 dark:bg-orange-900 dark:text-orange-300' :
                                request.urgency === 'medium' ? 'border-blue-500 text-blue-700 bg-blue-50 dark:bg-blue-900 dark:text-blue-300' :
                                'border-gray-500 text-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-gray-300'}
                            `}>
                              {request.urgency === 'critical' ? 'კრიტიკული' :
                               request.urgency === 'high' ? 'მაღალი' :
                               request.urgency === 'medium' ? 'საშუალო' : 'დაბალი'}
                            </Badge>
                          </div>
                        </div>

                        {/* Problem Description */}
                        <div>
                          <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
                            📝 პრობლემის აღწერა
                          </p>
                          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                              {request.problem_description}
                            </p>
                          </div>
                        </div>

                        {/* Admin Comment */}
                        <div>
                          <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
                            💬 ადმინის კომენტარი
                          </p>
                          <textarea
                            placeholder="დაამატეთ კომენტარი - რა მუშაობა ჩატარდა, რა აღმოაჩნდა, როგორ მოგვარდა..."
                            className={`w-full p-3 text-sm rounded-lg border resize-none ${
                              darkMode 
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                            }`}
                            rows="3"
                            defaultValue={request.admin_comment || ''}
                            onBlur={(e) => updateRequestComment(request.id, e.target.value)}
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2 pt-2">
                          <Button 
                            size="sm"
                            onClick={() => setEditingArchivedRequest(request)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            სრული რედაქტირება
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => restoreFromArchive(request.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <ArchiveRestore className="h-4 w-4 mr-2" />
                            უკან დაბრუნება
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className={`${darkMode ? 'border-green-600 text-green-400 hover:bg-green-800 hover:bg-opacity-20' : 'border-green-500 text-green-600 hover:bg-green-50'}`}
                            onClick={() => window.open(`tel:${request.phone}`, '_self')}
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            დარეკვა
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className={`${darkMode ? 'border-blue-600 text-blue-400 hover:bg-blue-800 hover:bg-opacity-20' : 'border-blue-500 text-blue-600 hover:bg-blue-50'}`}
                            onClick={() => window.open(`mailto:${request.email}`, '_self')}
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            ემაილი
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              
              {archivedRequests.length === 0 && (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-12 text-center`}>
                  <Archive className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    არქივი ცარიელია
                  </h3>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    არქივირებული საქმეები აქ გამოჩნდება
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contact Messages Tab - Gmail Style */}
        {activeTab === 'contact-messages' && (
          <div className="space-y-6">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              {/* Header */}
              <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>📧 კონტაქტის შეტყობინებები</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  ნაცვლისფერით არაწაკითხული შეტყობინებები
                </p>
              </div>

              {/* Messages List */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {contactMessages
                  .sort((a, b) => {
                    // Sort by status first (new messages first), then by date (newest first)
                    if (a.status === 'new' && b.status !== 'new') return -1;
                    if (a.status !== 'new' && b.status === 'new') return 1;
                    return new Date(b.created_at) - new Date(a.created_at);
                  })
                  .map((message) => {
                    const isUnread = message.status === 'new';
                    const isExpanded = expandedMessages.has(message.id);
                    
                    return (
                      <div
                        key={message.id}
                        className={`relative transition-all duration-300 cursor-pointer hover:bg-opacity-80 ${
                          isUnread 
                            ? darkMode 
                              ? 'bg-blue-900/20 border-l-4 border-l-blue-500 animate-pulse' 
                              : 'bg-blue-50 border-l-4 border-l-blue-500'
                            : ''
                        } ${
                          isExpanded 
                            ? darkMode ? 'bg-gray-700' : 'bg-gray-50'
                            : darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => toggleMessageExpansion(message.id)}
                        style={{
                          animation: isUnread ? 'fadeInOut 2s infinite' : 'none'
                        }}
                      >
                        {/* Compact Message Row */}
                        <div className="px-6 py-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 flex-1 min-w-0">
                              {/* Status Indicator */}
                              <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                                isUnread 
                                  ? 'bg-blue-500 shadow-lg shadow-blue-500/50' 
                                  : message.status === 'replied' 
                                    ? 'bg-green-500' 
                                    : 'bg-gray-400'
                              }`}></div>
                              
                              {/* Sender Info */}
                              <div className="flex-shrink-0">
                                <p className={`text-sm font-semibold ${
                                  isUnread 
                                    ? darkMode ? 'text-white' : 'text-gray-900'
                                    : darkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                  {message.name}
                                </p>
                                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {message.email}
                                </p>
                              </div>
                              
                              {/* Subject & Preview */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h4 className={`text-sm font-medium truncate ${
                                    isUnread 
                                      ? darkMode ? 'text-white' : 'text-gray-900'
                                      : darkMode ? 'text-gray-300' : 'text-gray-700'
                                  }`}>
                                    {message.subject}
                                  </h4>
                                  {!isExpanded && (
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                      message.status === 'new' ? 'bg-red-100 text-red-800' :
                                      message.status === 'replied' ? 'bg-green-100 text-green-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {message.status === 'new' ? 'ახალი' : 
                                       message.status === 'read' ? 'წაკითხული' : 
                                       message.status === 'replied' ? 'პასუხგაცემული' : message.status}
                                    </span>
                                  )}
                                </div>
                                {!isExpanded && (
                                  <p className={`text-sm truncate mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {message.message.length > 60 
                                      ? `${message.message.substring(0, 60)}...` 
                                      : message.message}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            {/* Time & Phone */}
                            <div className="flex flex-col items-end space-y-1 flex-shrink-0">
                              <span className={`text-xs ${
                                isUnread 
                                  ? darkMode ? 'text-blue-400' : 'text-blue-600'
                                  : darkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                {formatDateTime(message.created_at)}
                              </span>
                              {message.phone && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(`tel:${message.phone}`, '_self');
                                  }}
                                  className={`p-1 rounded-full hover:bg-blue-100 ${darkMode ? 'hover:bg-blue-900' : ''} transition-colors`}
                                  title={message.phone}
                                >
                                  <Phone className={`w-3 h-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Expanded Content */}
                          {isExpanded && (
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>ტელეფონი:</p>
                                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {message.phone || 'არ არის მითითებული'}
                                  </p>
                                </div>
                                <div>
                                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>სრული თარიღი:</p>
                                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {new Date(message.created_at).toLocaleString('ka-GE')}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="mb-6">
                                <p className={`text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>სრული შეტყობინება:</p>
                                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
                                  <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                    {message.message}
                                  </p>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-3">
                                {message.status !== 'read' && message.status !== 'replied' && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className={`${
                                      darkMode 
                                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                    }`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateMessageStatus(message.id, 'read');
                                    }}
                                  >
                                    ✓ წაკითხულად მონიშვნა
                                  </Button>
                                )}
                                {message.status !== 'replied' && (
                                  <Button 
                                    size="sm" 
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateMessageStatus(message.id, 'replied');
                                    }}
                                  >
                                    ✉️ პასუხგაცემულად მონიშვნა
                                  </Button>
                                )}
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-blue-600 border-blue-300 hover:bg-blue-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(`mailto:${message.email}?subject=Re: ${message.subject}`, '_self');
                                  }}
                                >
                                  📧 პასუხის გაგზავნა
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                
                {contactMessages.length === 0 && (
                  <div className="px-6 py-12 text-center">
                    <MessageSquare className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-400' : 'text-gray-300'}`} />
                    <h3 className={`mt-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      შეტყობინებები არ არის
                    </h3>
                    <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      ახალი კონტაქტის შეტყობინებები აქ გამოჩნდება
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Testimonials Tab */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <div className="grid gap-4">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className={`${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'} shadow-sm`}>
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
                          <CardTitle className={darkMode ? 'text-white' : 'text-gray-800'}>{testimonial.name}</CardTitle>
                          <CardDescription className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{testimonial.position}</CardDescription>
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
                        <Badge variant="outline" className={
                          testimonial.is_active 
                            ? darkMode 
                              ? 'border-green-500 text-green-400 bg-green-900/20' 
                              : 'border-green-500 text-green-600 bg-green-50'
                            : darkMode
                              ? 'border-gray-500 text-gray-400 bg-gray-800/50'
                              : 'border-gray-400 text-gray-600 bg-gray-50'
                        }>
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
                            <Label className={darkMode ? 'text-gray-300' : 'text-gray-600'}>ქართული სახელი</Label>
                            <Input
                              value={editForm.name}
                              onChange={(e) => setEditForm(prev => ({...prev, name: e.target.value}))}
                              className={`mt-1 ${
                                darkMode 
                                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                  : 'bg-white border-gray-300 text-gray-900'
                              }`}
                            />
                          </div>
                          <div>
                            <Label className={darkMode ? 'text-gray-300' : 'text-gray-600'}>ინგლისური სახელი</Label>
                            <Input
                              value={editForm.name_en}
                              onChange={(e) => setEditForm(prev => ({...prev, name_en: e.target.value}))}
                              className={`mt-1 ${
                                darkMode 
                                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                  : 'bg-white border-gray-300 text-gray-900'
                              }`}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className={darkMode ? 'text-gray-300' : 'text-gray-600'}>ქართული პოზიცია</Label>
                            <Input
                              value={editForm.position}
                              onChange={(e) => setEditForm(prev => ({...prev, position: e.target.value}))}
                              className={`mt-1 ${
                                darkMode 
                                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                  : 'bg-white border-gray-300 text-gray-900'
                              }`}
                            />
                          </div>
                          <div>
                            <Label className={darkMode ? 'text-gray-300' : 'text-gray-600'}>ინგლისური პოზიცია</Label>
                            <Input
                              value={editForm.position_en}
                              onChange={(e) => setEditForm(prev => ({...prev, position_en: e.target.value}))}
                              className={`mt-1 ${
                                darkMode 
                                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                  : 'bg-white border-gray-300 text-gray-900'
                              }`}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className={darkMode ? 'text-gray-300' : 'text-gray-600'}>ქართული ტექსტი</Label>
                            <Textarea
                              value={editForm.text_ka}
                              onChange={(e) => setEditForm(prev => ({...prev, text_ka: e.target.value}))}
                              rows={3}
                              className={`mt-1 ${
                                darkMode 
                                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                  : 'bg-white border-gray-300 text-gray-900'
                              }`}
                            />
                          </div>
                          <div>
                            <Label className={darkMode ? 'text-gray-300' : 'text-gray-600'}>ინგლისური ტექსტი</Label>
                            <Textarea
                              value={editForm.text_en}
                              onChange={(e) => setEditForm(prev => ({...prev, text_en: e.target.value}))}
                              rows={3}
                              className={`mt-1 ${
                                darkMode 
                                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                  : 'bg-white border-gray-300 text-gray-900'
                              }`}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className={darkMode ? 'text-gray-300' : 'text-gray-600'}>ფოტო URL</Label>
                            <Input
                              value={editForm.image}
                              onChange={(e) => setEditForm(prev => ({...prev, image: e.target.value}))}
                              placeholder="https://images.unsplash.com/photo-..."
                              className={`mt-1 ${
                                darkMode 
                                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                  : 'bg-white border-gray-300 text-gray-900'
                              }`}
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
                            <Label className={darkMode ? 'text-gray-300' : 'text-gray-600'}>რეიტინგი</Label>
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
                            className={`${
                              darkMode 
                                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                            }`}
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
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>ქართული ტექსტი</p>
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>"{testimonial.text_ka}"</p>
                          </div>
                          <div>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>ინგლისური ტექსტი</p>
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>"{testimonial.text_en}"</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className={`${
                              darkMode 
                                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                            }`}
                            onClick={() => startEditTestimonial(testimonial)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            რედაქტირება
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className={`${
                              darkMode
                                ? 'text-red-400 border-red-500 hover:bg-red-900/20'
                                : 'text-red-600 border-red-300 hover:bg-red-50'
                            }`}
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

            {/* Edit Request Modal */}
            {editingRequest && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className={`w-full max-w-2xl p-6 rounded-xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      🛠️ მოთხოვნის რედაქტირება
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={cancelEditRequest}
                      className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        სახელი
                      </label>
                      <Input
                        value={editRequestForm.name}
                        onChange={(e) => setEditRequestForm({...editRequestForm, name: e.target.value})}
                        className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}
                        placeholder="კლიენტის სახელი"
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        ელექტრონული ფოსტა
                      </label>
                      <Input
                        type="email"
                        value={editRequestForm.email}
                        onChange={(e) => setEditRequestForm({...editRequestForm, email: e.target.value})}
                        className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}
                        placeholder="example@gmail.com"
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        ტელეფონი
                      </label>
                      <Input
                        value={editRequestForm.phone}
                        onChange={(e) => setEditRequestForm({...editRequestForm, phone: e.target.value})}
                        className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}
                        placeholder="+995 555 123 456"
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        მოწყობილობის ტიპი
                      </label>
                      <select
                        value={editRequestForm.device_type}
                        onChange={(e) => setEditRequestForm({...editRequestForm, device_type: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-md ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="hdd">HDD - მყარი დისკი</option>
                        <option value="ssd">SSD - სოლიდ სტეიტ დისკი</option>
                        <option value="raid">RAID - მასივი</option>
                        <option value="flash">Flash - ფლეშ მეხსიერება</option>
                        <option value="server">Server - სერვერი</option>
                        <option value="phone">Phone - ტელეფონი</option>
                        <option value="other">სხვა</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        სისწრაფე
                      </label>
                      <select
                        value={editRequestForm.urgency}
                        onChange={(e) => setEditRequestForm({...editRequestForm, urgency: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-md ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="low">დაბალი</option>
                        <option value="medium">საშუალო</option>
                        <option value="high">მაღალი</option>
                        <option value="critical">კრიტიკული</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      პრობლემის აღწერა
                    </label>
                    <textarea
                      rows={4}
                      value={editRequestForm.problem_description}
                      onChange={(e) => setEditRequestForm({...editRequestForm, problem_description: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-md resize-none ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="აღწერეთ რა პრობლემა ხდება..."
                    />
                  </div>
                  
                  <div className="flex gap-3 justify-end">
                    <Button
                      variant="outline"
                      onClick={cancelEditRequest}
                      className={darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}
                    >
                      გაუქმება
                    </Button>
                    <Button
                      onClick={() => saveEditRequest(editingRequest)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      შენახვა
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;