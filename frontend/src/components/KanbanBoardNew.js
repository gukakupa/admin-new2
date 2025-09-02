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
  MapPin
} from 'lucide-react';

const KanbanBoard = ({ serviceRequests, updateServiceRequest }) => {
  const [columns, setColumns] = useState([
    {
      id: 'unread',
      title: '📥 ახალი მოთხოვნები',
      color: 'bg-red-500',
      items: []
    },
    {
      id: 'pending',
      title: '⏳ მომლოდინე',
      color: 'bg-orange-500',
      items: []
    },
    {
      id: 'in_progress',
      title: '🔧 მუშავდება',
      color: 'bg-blue-500',
      items: []
    },
    {
      id: 'completed',
      title: '✅ დასრულებული',
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

  const KanbanCard = ({ item, columnId }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, item, columnId)}
      className="group bg-white p-4 rounded-xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-gray-200 transition-all duration-300 cursor-move mb-4 hover:scale-105 hover:-translate-y-1"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <Badge 
          variant="outline" 
          className="text-xs font-semibold bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 border-blue-200 px-3 py-1 rounded-full"
        >
          {item.case_id}
        </Badge>
        <Badge className={`${getPriorityColor(item.urgency)} text-xs px-3 py-1 rounded-full font-medium shadow-sm`}>
          {item.urgency === 'critical' ? '🚨' : 
           item.urgency === 'high' ? '🔥' : 
           item.urgency === 'medium' ? '⚡' :
           '📋'}
        </Badge>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <h4 className="font-bold text-gray-900 text-base leading-tight">
          {item.name || 'უცნობი კლიენტი'}
        </h4>
        
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
          <p className="text-sm text-gray-700 leading-relaxed">
            <span className="font-semibold text-gray-900">{item.device_type || 'უცნობი'}</span>
            {item.problem_description && (
              <>
                <br />
                <span className="text-gray-600">{item.problem_description}</span>
              </>
            )}
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
          <Clock className="h-3 w-3 text-blue-500" />
          <span className="font-medium text-gray-700">{getTimeElapsed(item.created_at)}</span>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex gap-2">
            {item.phone && (
              <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-700 font-medium">Phone</span>
              </div>
            )}
            {item.email && (
              <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-blue-700 font-medium">Email</span>
              </div>
            )}
            {item.price && (
              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-xs text-yellow-700 font-medium">{item.price}₾</span>
              </div>
            )}
          </div>
          
          <Button 
            size="sm"
            variant="ghost"
            className="p-2 h-8 w-8 hover:bg-gray-100 rounded-full transition-colors group-hover:bg-blue-50 group-hover:text-blue-600"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCard(item);
            }}
          >
            <Eye className="h-4 w-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">📋 პროექტ მენეჯმენტი</h2>
          <p className="text-gray-600">Kanban Board - საქმეების ვიზუალური მართვა</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white text-gray-900 border-gray-300 hover:bg-gray-50">
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
          <Card key={column.id} className="p-3">
            <CardContent className="p-0">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${column.color}`}></div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{column.items.length}</p>
                  <p className="text-xs text-gray-600">{column.title.replace(/[📥⏳🔧✅]/g, '').trim()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 overflow-x-auto min-h-screen">
        {columns.map((column) => (
          <div
            key={column.id}
            className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl p-6 min-h-96 shadow-sm border border-gray-200"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${column.color} shadow-sm`}></div>
                <h3 className="font-bold text-gray-800 text-lg">{column.title}</h3>
              </div>
              <Badge 
                variant="outline" 
                className="text-sm font-semibold bg-white text-gray-600 border-gray-300 px-3 py-1 rounded-full shadow-sm"
              >
                {column.items.length}
              </Badge>
            </div>

            {/* Cards */}
            <div className="space-y-3">
              {column.items.map((item) => (
                <KanbanCard key={item.id} item={item} columnId={column.id} />
              ))}
              
              {column.items.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                    <Plus className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-500">ცარიელია</p>
                  <p className="text-xs text-gray-400 mt-1">ჩამოათრიეთ ტასკი აქ</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Task Form Modal */}
      {(showTaskForm || editingTask) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-black">
                {editingTask ? 'ტასკის რედაქტირება' : 'ახალი ტასკი'}
              </h3>
              <button 
                onClick={() => {
                  setShowTaskForm(false);
                  setEditingTask(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-black">სახელი გვარი *</Label>
                <Input
                  value={taskForm.name}
                  onChange={(e) => setTaskForm({...taskForm, name: e.target.value})}
                  placeholder="გიორგი თბილისელი"
                  className="mt-1 text-black bg-white border-gray-300"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium text-black">ტელეფონის ნომერი *</Label>
                <Input
                  value={taskForm.phone}
                  onChange={(e) => setTaskForm({...taskForm, phone: e.target.value})}
                  placeholder="+995598123456"
                  className="mt-1 text-black bg-white border-gray-300"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium text-black">ემაილი *</Label>
                <Input
                  type="email"
                  value={taskForm.email}
                  onChange={(e) => setTaskForm({...taskForm, email: e.target.value})}
                  placeholder="user@example.com"
                  className="mt-1 text-black bg-white border-gray-300"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium text-black">მოწყობილობის ტიპი *</Label>
                <select
                  value={taskForm.device_type}
                  onChange={(e) => setTaskForm({...taskForm, device_type: e.target.value})}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black bg-white"
                >
                  <option value="">აირჩიეთ...</option>
                  <option value="SSD">SSD</option>
                  <option value="HDD">HDD</option>
                  <option value="USB">USB მოწყობილობა</option>
                  <option value="Memory Card">მეხსიერების ბარათი</option>
                  <option value="RAID">RAID სისტემა</option>
                  <option value="Server">სერვერი</option>
                </select>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-black">სისწრაფის დონე</Label>
                <select
                  value={taskForm.urgency}
                  onChange={(e) => setTaskForm({...taskForm, urgency: e.target.value})}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black bg-white"
                >
                  <option value="low">📋 დაბალი</option>
                  <option value="medium">⚡ საშუალო</option>
                  <option value="high">🔥 მაღალი</option>
                  <option value="critical">🚨 კრიტიკული</option>
                </select>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-black">ფასის მაჩვენებელი (₾)</Label>
                <Input
                  type="number"
                  value={taskForm.price}
                  onChange={(e) => setTaskForm({...taskForm, price: e.target.value})}
                  placeholder="150"
                  className="mt-1 text-black bg-white border-gray-300"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium text-black">დაწყების თარიღი</Label>
                <Input
                  type="date"
                  value={taskForm.started_at}
                  onChange={(e) => setTaskForm({...taskForm, started_at: e.target.value})}
                  className="mt-1 text-black bg-white border-gray-300"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium text-black">დასრულების თარიღი</Label>
                <Input
                  type="date"
                  value={taskForm.completed_at}
                  onChange={(e) => setTaskForm({...taskForm, completed_at: e.target.value})}
                  className="mt-1 text-black bg-white border-gray-300"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <Label className="text-sm font-medium text-black">დაზიანების აღწერა *</Label>
              <Textarea
                value={taskForm.damage_description}
                onChange={(e) => setTaskForm({...taskForm, damage_description: e.target.value})}
                placeholder="მოწყობილობა არ იხსნება, სავარაუდოდ წყლის დაზიანება..."
                className="mt-1 min-h-20 text-black bg-white border-gray-300"
              />
            </div>
            
            <div className="flex gap-3 pt-4 border-t mt-6">
              <Button 
                onClick={editingTask ? editTask : createTask}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!taskForm.name || !taskForm.phone || !taskForm.email || !taskForm.device_type || !taskForm.damage_description}
              >
                <Save className="h-4 w-4 mr-2" />
                {editingTask ? 'შენახვა' : 'შექმნა'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowTaskForm(false);
                  setEditingTask(null);
                  resetForm();
                }}
                className="border-gray-300 text-black hover:bg-gray-50"
              >
                გაუქმება
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Card Detail Modal */}
      {selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-black">საქმის დეტალები</h3>
              <button 
                onClick={() => setSelectedCard(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">საქმის ID</label>
                  <p className="text-lg font-mono text-black">{selectedCard.case_id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">სტატუსი</label>
                  <Badge className={getPriorityColor(selectedCard.urgency)}>
                    {selectedCard.status === 'unread' ? 'ახალი' :
                     selectedCard.status === 'pending' ? 'მომლოდინე' :
                     selectedCard.status === 'in_progress' ? 'მუშავდება' :
                     selectedCard.status === 'completed' ? 'დასრულებული' : 'არქივი'}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">კლიენტი</label>
                  <p className="font-medium text-black">{selectedCard.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">ტელეფონი</label>
                  <p className="text-blue-600 text-black">{selectedCard.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">ემაილი</label>
                  <p className="text-blue-600 text-black">{selectedCard.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">ფასი</label>
                  <p className="font-medium text-black">
                    {selectedCard.price ? `${selectedCard.price}₾` : 'არ არის მითითებული'}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">მოწყობილობა</label>
                <p className="text-black">{selectedCard.device_type}</p>
              </div>
              
              {selectedCard.problem_description && (
                <div>
                  <label className="text-sm font-medium text-gray-600">პრობლემის აღწერა</label>
                  <p className="text-sm bg-gray-50 p-3 rounded text-black">{selectedCard.problem_description}</p>
                </div>
              )}

              {(selectedCard.started_at || selectedCard.completed_at) && (
                <div className="grid grid-cols-2 gap-4">
                  {selectedCard.started_at && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">დაწყების თარიღი</label>
                      <p className="text-black">{new Date(selectedCard.started_at).toLocaleDateString('ka-GE')}</p>
                    </div>
                  )}
                  {selectedCard.completed_at && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">დასრულების თარიღი</label>
                      <p className="text-black">{new Date(selectedCard.completed_at).toLocaleDateString('ka-GE')}</p>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex gap-3 pt-4 border-t">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => openEditForm(selectedCard)}>
                  <Edit className="h-4 w-4 mr-2" />
                  რედაქტირება
                </Button>
                <Button size="sm" variant="outline" className="border-gray-300 text-black hover:bg-gray-50">
                  <Phone className="h-4 w-4 mr-2" />
                  დარეკვა
                </Button>
                <Button size="sm" variant="outline" className="border-gray-300 text-black hover:bg-gray-50">
                  <Mail className="h-4 w-4 mr-2" />
                  ემაილი
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