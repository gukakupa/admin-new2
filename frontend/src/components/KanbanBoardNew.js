import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { 
  Plus, 
  Clock, 
  User, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Play,
  Archive,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  X,
  Save,
  Phone,
  Mail,
  MapPin,
  Package,
  FileText,
  DollarSign,
  Settings
} from 'lucide-react';

const KanbanBoard = ({ serviceRequests, updateServiceRequest, darkMode = false }) => {
  const [columns, setColumns] = useState([
    {
      id: 'unread',
      title: 'შეტყობინება',
      color: 'bg-red-500',
      items: []
    },
    {
      id: 'pending',
      title: 'მომლოდინე',
      color: 'bg-orange-500',
      items: []
    },
    {
      id: 'in_progress',
      title: 'მუშავდება',
      color: 'bg-blue-500',
      items: []
    },
    {
      id: 'completed',
      title: 'დასრულებული',
      color: 'bg-green-500',
      items: []
    }
  ]);

  const [draggedItem, setDraggedItem] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  const [taskForm, setTaskForm] = useState({
    name: '',
    phone: '',
    email: '',
    device_type: '',
    damage_description: '',
    urgency: 'medium',
    price: '',
    started_at: '',
    completed_at: ''
  });

  useEffect(() => {
    // Group service requests by status
    const groupedRequests = serviceRequests.reduce((acc, request) => {
      const status = request.status || 'unread';
      if (!acc[status]) acc[status] = [];
      acc[status].push(request);
      return acc;
    }, {});

    // Update columns with requests
    setColumns(prevColumns => 
      prevColumns.map(column => ({
        ...column,
        items: groupedRequests[column.id] || []
      }))
    );
  }, [serviceRequests]);

  const handleDragStart = (e, item, columnId) => {
    setDraggedItem({ item, sourceColumn: columnId });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, targetColumnId) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem.sourceColumn === targetColumnId) {
      setDraggedItem(null);
      return;
    }

    try {
      // For manually created tasks, just update local state
      if (draggedItem.item.id.startsWith('manual_')) {
        setColumns(prevColumns => 
          prevColumns.map(column => {
            if (column.id === draggedItem.sourceColumn) {
              return {
                ...column,
                items: column.items.filter(item => item.id !== draggedItem.item.id)
              };
            }
            if (column.id === targetColumnId) {
              return {
                ...column,
                items: [...column.items, { ...draggedItem.item, status: targetColumnId }]
              };
            }
            return column;
          })
        );
      } else {
        // For API-sourced tasks, try to update via API
        if (updateServiceRequest) {
          await updateServiceRequest(draggedItem.item.id, { status: targetColumnId });
        }
        
        // Update local state regardless
        setColumns(prevColumns => 
          prevColumns.map(column => {
            if (column.id === draggedItem.sourceColumn) {
              return {
                ...column,
                items: column.items.filter(item => item.id !== draggedItem.item.id)
              };
            }
            if (column.id === targetColumnId) {
              return {
                ...column,
                items: [...column.items, { ...draggedItem.item, status: targetColumnId }]
              };
            }
            return column;
          })
        );
      }

      setDraggedItem(null);
      console.log(`Task ${draggedItem.item.case_id} moved from ${draggedItem.sourceColumn} to ${targetColumnId}`);
    } catch (error) {
      console.error('Error updating service request:', error);
      // Still update local state even if API call fails
      setColumns(prevColumns => 
        prevColumns.map(column => {
          if (column.id === draggedItem.sourceColumn) {
            return {
              ...column,
              items: column.items.filter(item => item.id !== draggedItem.item.id)
            };
          }
          if (column.id === targetColumnId) {
            return {
              ...column,
              items: [...column.items, { ...draggedItem.item, status: targetColumnId }]
            };
          }
          return column;
        })
      );
      setDraggedItem(null);
    }
  };

  const createTask = async () => {
    try {
      const newTask = {
        id: `manual_${Date.now()}`,
        case_id: `DL${new Date().getFullYear()}${String(Date.now()).slice(-4)}`,
        name: taskForm.name,
        phone: taskForm.phone,
        email: taskForm.email,
        device_type: taskForm.device_type,
        problem_description: taskForm.damage_description,
        urgency: taskForm.urgency,
        price: taskForm.price ? parseFloat(taskForm.price) : null,
        started_at: taskForm.started_at || null,
        completed_at: taskForm.completed_at || null,
        created_at: new Date().toISOString(),
        status: 'unread'
      };

      setColumns(prevColumns => 
        prevColumns.map(column => 
          column.id === 'unread' 
            ? { ...column, items: [...column.items, newTask] }
            : column
        )
      );

      resetForm();
      setShowTaskForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const editTask = async () => {
    try {
      const updatedTask = {
        ...editingTask,
        name: taskForm.name,
        phone: taskForm.phone,
        email: taskForm.email,
        device_type: taskForm.device_type,
        problem_description: taskForm.damage_description,
        urgency: taskForm.urgency,
        price: taskForm.price ? parseFloat(taskForm.price) : null,
        started_at: taskForm.started_at || null,
        completed_at: taskForm.completed_at || null
      };

      setColumns(prevColumns => 
        prevColumns.map(column => ({
          ...column,
          items: column.items.map(item => 
            item.id === editingTask.id ? updatedTask : item
          )
        }))
      );

      resetForm();
      setEditingTask(null);
      setSelectedCard(null);
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const resetForm = () => {
    setTaskForm({
      name: '',
      phone: '',
      email: '',
      device_type: '',
      damage_description: '',
      urgency: 'medium',
      price: '',
      started_at: '',
      completed_at: ''
    });
  };

  const openEditForm = (task) => {
    setTaskForm({
      name: task.name || '',
      phone: task.phone || '',
      email: task.email || '',
      device_type: task.device_type || '',
      damage_description: task.problem_description || '',
      urgency: task.urgency || 'medium',
      price: task.price ? task.price.toString() : '',
      started_at: task.started_at ? task.started_at.split('T')[0] : '',
      completed_at: task.completed_at ? task.completed_at.split('T')[0] : ''
    });
    setEditingTask(task);
    setSelectedCard(null);
  };

  const getPriorityColor = (urgency) => {
    switch (urgency) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-blue-500 text-white';
      case 'emergency': return 'bg-red-500 text-white';
      case 'urgent': return 'bg-orange-500 text-white';
      case 'normal': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTimeElapsed = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInHours = Math.floor((now - created) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'ახლა';
    if (diffInHours < 24) return `${diffInHours} საათის წინ`;
    return `${Math.floor(diffInHours / 24)} დღის წინ`;
  };

  const [hoveredIcon, setHoveredIcon] = useState(null);

  const KanbanCard = ({ item, columnId }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, item, columnId)}
      className={`group relative rounded-lg border transition-all duration-200 cursor-pointer mb-2 hover:shadow-md ${
        darkMode 
          ? 'bg-gray-800 border-gray-700 hover:border-gray-600 hover:bg-gray-750' 
          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg'
      }`}
      style={{
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Compact Header Row */}
      <div className={`px-3 py-2 flex items-center justify-between ${
        darkMode ? 'border-gray-700' : 'border-gray-100'
      }`}>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Avatar Circle - Smaller */}
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0 ${
            item.urgency === 'critical' ? 'bg-red-500' :
            item.urgency === 'high' ? 'bg-orange-500' :
            item.urgency === 'medium' ? 'bg-blue-500' : 'bg-gray-500'
          }`}>
            {item.name ? item.name.charAt(0).toUpperCase() : 'U'}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {item.name || 'უცნობი კლიენტი'}
            </p>
            <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {item.case_id}
            </p>
          </div>
        </div>
        
        {/* Priority & Price Row */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <div className={`w-2 h-2 rounded-full ${
            item.urgency === 'critical' ? 'bg-red-500' :
            item.urgency === 'high' ? 'bg-orange-500' :
            item.urgency === 'medium' ? 'bg-blue-500' : 'bg-gray-400'
          }`}></div>
          {item.price && (
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              darkMode 
                ? 'bg-green-900 bg-opacity-50 text-green-400' 
                : 'bg-green-100 text-green-800'
            }`}>
              {item.price}₾
            </span>
          )}
        </div>
      </div>

      {/* Compact Content Row */}
      <div className="px-3 py-2">
        <div className="flex items-center justify-between">
          {/* Device & Description */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                darkMode 
                  ? 'bg-gray-700 text-gray-300' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {item.device_type?.toUpperCase() || 'უცნობი'}
              </span>
              <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {getTimeElapsed(item.created_at)}
              </span>
            </div>
            
            {/* Problem Description - One Line Only */}
            {item.problem_description && (
              <p className={`text-xs leading-tight truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {item.problem_description.length > 50 
                  ? `${item.problem_description.substring(0, 50)}...` 
                  : item.problem_description}
              </p>
            )}
          </div>
          
          {/* Actions - Horizontal */}
          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
            {/* Phone */}
            {item.phone && (
              <div 
                className={`relative p-1 rounded cursor-pointer transition-all duration-200 ${
                  darkMode ? 'bg-blue-900 bg-opacity-50 hover:bg-blue-800 hover:bg-opacity-70' : 'bg-blue-100 hover:bg-blue-200'
                }`}
                onClick={() => window.open(`tel:${item.phone}`, '_self')}
                onMouseEnter={() => setHoveredIcon(`phone-${item.id}`)}
                onMouseLeave={() => setHoveredIcon(null)}
              >
                <Phone className={`w-3 h-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                {/* Phone Tooltip */}
                {hoveredIcon === `phone-${item.id}` && (
                  <div 
                    className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap z-50 ${
                      darkMode 
                        ? 'bg-gray-900 text-white shadow-xl border border-gray-700' 
                        : 'bg-gray-800 text-white shadow-xl'
                    }`}
                    style={{
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
                      animation: 'fadeIn 0.2s ease-in-out'
                    }}
                  >
                    📞 {item.phone}
                    <div 
                      className={`absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent ${
                        darkMode ? 'border-t-gray-900' : 'border-t-gray-800'
                      }`}
                      style={{ borderBottomWidth: 0 }}
                    ></div>
                  </div>
                )}
              </div>
            )}
            
            {/* Eye Icon */}
            <div 
              className={`p-1 rounded cursor-pointer transition-all duration-200 ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedCard(item);
              }}
            >
              <Eye className={`w-3 h-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* CSS Animation Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>📋 პროექტ მენეჯმენტი</h2>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Kanban Board - საქმეების ვიზუალური მართვა</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className={`${
            darkMode 
              ? 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600' 
              : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
          }`}>
            <Calendar className="h-4 w-4 mr-2" />
            კალენდარი
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setShowTaskForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            ახალი ტასკი
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {columns.map((column) => (
          <Card key={column.id} className={`p-3 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <CardContent className="p-0">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${column.color}`}></div>
                <div>
                  <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{column.items.length}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{column.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Kanban Board - Full Width Columns */}
      <div className="grid grid-cols-4 gap-2 min-h-screen">
        {columns.map((column) => (
          <div
            key={column.id}
            className={`rounded-lg border transition-all duration-200 ${
              darkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-gray-50 border-gray-200'
            }`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
            style={{
              minHeight: '500px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* Compact Column Header */}
            <div className={`px-3 py-3 border-b flex flex-col items-center justify-center text-center ${
              darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-white'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2 h-2 rounded-full ${column.color}`}></div>
                <h3 className={`font-bold text-sm tracking-wide ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {column.title}
                </h3>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                darkMode 
                  ? 'bg-gray-700 text-gray-300' 
                  : 'bg-gray-200 text-gray-700'
              }`}>
                {column.items.length}
              </div>
            </div>

            {/* Cards Container */}
            <div className="p-2 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 250px)' }}>
              {column.items.map((item) => (
                <KanbanCard key={item.id} item={item} columnId={column.id} />
              ))}
              
              {column.items.length === 0 && (
                <div className={`text-center py-6 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                    darkMode 
                      ? 'bg-gray-700 border-2 border-dashed border-gray-600' 
                      : 'bg-gray-200 border-2 border-dashed border-gray-300'
                  }`}>
                    <Plus className={`h-4 w-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                  </div>
                  <p className={`text-xs font-medium ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {column.id === 'unread' ? 'ახალი შეტყობინებები არ არის' :
                     column.id === 'pending' ? 'მომლოდინე ტასკები არ არის' :
                     column.id === 'in_progress' ? 'მიმდინარე სამუშაოები არ არის' :
                     'დასრულებული ტასკები არ არის'}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modern Task Form Modal */}
      {(showTaskForm || editingTask) && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl transform transition-all ${
            darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white'
          }`} style={{ 
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)',
            animation: 'slideInUp 0.3s ease-out'
          }}>
            
            {/* Header */}
            <div className={`px-8 py-6 border-b ${
              darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    editingTask 
                      ? (darkMode ? 'bg-blue-900 bg-opacity-50' : 'bg-blue-100')
                      : (darkMode ? 'bg-green-900 bg-opacity-50' : 'bg-green-100')
                  }`}>
                    {editingTask ? (
                      <Edit className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    ) : (
                      <Plus className={`w-6 h-6 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                    )}
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {editingTask ? '✏️ ტასკის რედაქტირება' : '✨ ახალი ტასკის შექმნა'}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {editingTask ? 'ამ ფორმით შეგიძლიათ დაარედაქტიროთ არსებული ტასკი' : 'შეავსეთ ყველა საჭირო ველი ახალი ტასკის შესაქმნელად'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setShowTaskForm(false);
                    setEditingTask(null);
                    resetForm();
                  }}
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-8 py-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="space-y-6">
                
                {/* Personal Information Section */}
                <div>
                  <h4 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <User className="w-5 h-5 text-blue-500" />
                    პირადი ინფორმაცია
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        სახელი გვარი *
                      </label>
                      <Input
                        value={taskForm.name}
                        onChange={(e) => setTaskForm({...taskForm, name: e.target.value})}
                        placeholder="მაგ: გიორგი თბილისელი"
                        className={`h-12 text-base ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        ტელეფონის ნომერი *
                      </label>
                      <Input
                        value={taskForm.phone}
                        onChange={(e) => setTaskForm({...taskForm, phone: e.target.value})}
                        placeholder="მაგ: +995 555 123 456"
                        className={`h-12 text-base ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        ელექტრონული ფოსტა *
                      </label>
                      <Input
                        type="email"
                        value={taskForm.email}
                        onChange={(e) => setTaskForm({...taskForm, email: e.target.value})}
                        placeholder="მაგ: user@example.com"
                        className={`h-12 text-base ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Device Information Section */}
                <div>
                  <h4 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <Package className="w-5 h-5 text-orange-500" />
                    მოწყობილობის ინფორმაცია
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        მოწყობილობის ტიპი *
                      </label>
                      <select
                        value={taskForm.device_type}
                        onChange={(e) => setTaskForm({...taskForm, device_type: e.target.value})}
                        className={`w-full h-12 px-4 rounded-lg border text-base ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="">აირჩიეთ მოწყობილობა...</option>
                        <option value="hdd">HDD - მყარი დისკი</option>
                        <option value="ssd">SSD - სოლიდ სტეიტ დისკი</option>
                        <option value="raid">RAID - მასივი</option>
                        <option value="usb">USB - ფლეშ მეხსიერება</option>
                        <option value="sd">SD Card - მეხსიერების ბარათი</option>
                        <option value="other">სხვა</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        სისწრაფის დონე
                      </label>
                      <select
                        value={taskForm.urgency}
                        onChange={(e) => setTaskForm({...taskForm, urgency: e.target.value})}
                        className={`w-full h-12 px-4 rounded-lg border text-base ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="low">🟢 დაბალი - სტანდარტული</option>
                        <option value="medium">🟡 საშუალო - რეკომენდებული</option>
                        <option value="high">🟠 მაღალი - სასწრაფო</option>
                        <option value="critical">🔴 კრიტიკული - ავარიული</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Problem Description Section */}
                <div>
                  <h4 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <FileText className="w-5 h-5 text-red-500" />
                    პრობლემის აღწერა
                  </h4>
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      რა პრობლემა აქვს მოწყობილობას? *
                    </label>
                    <textarea
                      rows={4}
                      value={taskForm.damage_description}
                      onChange={(e) => setTaskForm({...taskForm, damage_description: e.target.value})}
                      placeholder="დეტალურად აღწერეთ პრობლემა: რა მოხდა, როდის დაიწყო, რა სიმპტომები აღმოაჩინეთ..."
                      className={`w-full p-4 rounded-lg border text-base resize-none ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>
                </div>

                {/* Optional Information */}
                <div>
                  <h4 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <DollarSign className="w-5 h-5 text-green-500" />
                    დამატებითი ინფორმაცია
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        შეფასებული ღირებულება (₾)
                      </label>
                      <Input
                        type="number"
                        value={taskForm.price}
                        onChange={(e) => setTaskForm({...taskForm, price: e.target.value})}
                        placeholder="მაგ: 150"
                        className={`h-12 text-base ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className={`px-8 py-6 border-t flex items-center justify-between ${
              darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                * აღნიშნული ველები სავალდებულოა
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowTaskForm(false);
                    setEditingTask(null);
                    resetForm();
                  }}
                  className={`px-6 py-3 ${
                    darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  გაუქმება
                </Button>
                <Button
                  onClick={editingTask ? editTask : createTask}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold"
                >
                  {editingTask ? '💾 განახლება' : '✨ შექმნა'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modern Card Detail Modal */}
      {selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl transform transition-all ${
            darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white'
          }`} style={{ 
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)',
            animation: 'slideInUp 0.3s ease-out'
          }}>
            
            {/* Header */}
            <div className={`px-8 py-6 border-b ${
              darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white ${
                    selectedCard.urgency === 'critical' ? 'bg-red-500' :
                    selectedCard.urgency === 'high' ? 'bg-orange-500' :
                    selectedCard.urgency === 'medium' ? 'bg-blue-500' : 'bg-gray-500'
                  }`}>
                    {selectedCard.name ? selectedCard.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h3 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      🔍 საქმის დეტალები
                    </h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        darkMode ? 'bg-blue-900 bg-opacity-50 text-blue-400' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {selectedCard.case_id}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        selectedCard.urgency === 'critical' ? 'bg-red-100 text-red-800' :
                        selectedCard.urgency === 'high' ? 'bg-orange-100 text-orange-800' :
                        selectedCard.urgency === 'medium' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedCard.urgency === 'low' ? '🟢 დაბალი' :
                         selectedCard.urgency === 'medium' ? '🟡 საშუალო' :
                         selectedCard.urgency === 'high' ? '🟠 მაღალი' :
                         '🔴 კრიტიკული'}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCard(null)}
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-8 py-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="space-y-8">
                
                {/* Client Information Section */}
                <div>
                  <h4 className={`text-xl font-semibold mb-6 flex items-center gap-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <User className="w-6 h-6 text-blue-500" />
                    კლიენტის ინფორმაცია
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <label className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>სახელი გვარი</label>
                      <p className={`text-lg font-semibold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedCard.name}</p>
                    </div>
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <label className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>ტელეფონი</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="w-4 h-4 text-blue-500" />
                        <p className={`text-lg font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                          <a href={`tel:${selectedCard.phone}`} className="hover:underline">
                            {selectedCard.phone}
                          </a>
                        </p>
                      </div>
                    </div>
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <label className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>ელექტრონული ფოსტა</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4 text-green-500" />
                        <p className={`text-lg font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                          <a href={`mailto:${selectedCard.email}`} className="hover:underline">
                            {selectedCard.email}
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Device & Service Information */}
                <div>
                  <h4 className={`text-xl font-semibold mb-6 flex items-center gap-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <Package className="w-6 h-6 text-orange-500" />
                    მოწყობილობა & სერვისი
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <label className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>მოწყობილობის ტიპი</label>
                      <div className="flex items-center gap-3 mt-2">
                        <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                          {selectedCard.device_type === 'hdd' ? '🖴' :
                           selectedCard.device_type === 'ssd' ? '💾' :
                           selectedCard.device_type === 'raid' ? '🏗️' :
                           selectedCard.device_type === 'usb' ? '🔌' :
                           selectedCard.device_type === 'sd' ? '💳' : '🔧'}
                        </div>
                        <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {selectedCard.device_type?.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <label className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>შეფასებული ღირებულება</label>
                      <div className="flex items-center gap-2 mt-2">
                        <DollarSign className="w-5 h-5 text-green-500" />
                        <p className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                          {selectedCard.price ? `${selectedCard.price}₾` : 'არ არის მითითებული'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Problem Description */}
                {selectedCard.problem_description && (
                  <div>
                    <h4 className={`text-xl font-semibold mb-6 flex items-center gap-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <FileText className="w-6 h-6 text-red-500" />
                      პრობლემის აღწერა
                    </h4>
                    <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                      <p className={`text-base leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {selectedCard.problem_description}
                      </p>
                    </div>
                  </div>
                )}

                {/* Timeline Information */}
                {(selectedCard.created_at || selectedCard.started_at || selectedCard.completed_at) && (
                  <div>
                    <h4 className={`text-xl font-semibold mb-6 flex items-center gap-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <Clock className="w-6 h-6 text-purple-500" />
                      დროის მონაცემები
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                        <label className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>შექმნის თარიღი</label>
                        <p className={`text-lg font-semibold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {new Date(selectedCard.created_at).toLocaleDateString('ka-GE')}
                        </p>
                      </div>
                      {selectedCard.started_at && (
                        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                          <label className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>დაწყების თარიღი</label>
                          <p className={`text-lg font-semibold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {new Date(selectedCard.started_at).toLocaleDateString('ka-GE')}
                          </p>
                        </div>
                      )}
                      {selectedCard.completed_at && (
                        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                          <label className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>დასრულების თარიღი</label>
                          <p className={`text-lg font-semibold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {new Date(selectedCard.completed_at).toLocaleDateString('ka-GE')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div>
                  <h4 className={`text-xl font-semibold mb-6 flex items-center gap-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <Settings className="w-6 h-6 text-indigo-500" />
                    მოქმედებები
                  </h4>
                  <div className="flex flex-wrap gap-4">
                    <Button
                      onClick={() => window.open(`tel:${selectedCard.phone}`, '_self')}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
                    >
                      <Phone className="w-4 h-4" />
                      დარეკვა
                    </Button>
                    <Button
                      onClick={() => window.open(`mailto:${selectedCard.email}`, '_self')}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3"
                    >
                      <Mail className="w-4 h-4" />
                      ემაილი
                    </Button>
                    <Button
                      onClick={() => {
                        setEditingTask(selectedCard);
                        setSelectedCard(null);
                      }}
                      variant="outline"
                      className={`flex items-center gap-2 px-6 py-3 ${
                        darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Edit className="w-4 h-4" />
                      რედაქტირება
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className={`px-8 py-4 border-t ${
              darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex justify-between items-center">
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  ბოლოს განახლდა: {new Date(selectedCard.created_at).toLocaleString('ka-GE')}
                </div>
                <Button
                  onClick={() => setSelectedCard(null)}
                  variant="outline"
                  className={`${
                    darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  დახურვა
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;