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
    },
    {
      id: 'archived',
      title: '📦 არქივი',
      color: 'bg-gray-500',
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
    urgency: 'normal',
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
      // Update service request status
      await updateServiceRequest(draggedItem.item.id, { status: targetColumnId });
      
      // Update local state
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
    } catch (error) {
      console.error('Error updating service request:', error);
      setDraggedItem(null);
    }
  };

  const getPriorityColor = (urgency) => {
    switch (urgency) {
      case 'emergency': return 'bg-red-100 text-red-800 border-red-200';
      case 'urgent': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const createTask = async () => {
    try {
      const newTask = {
        id: `manual_${Date.now()}`, // Temporary ID for frontend
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

      // Add to columns
      setColumns(prevColumns => 
        prevColumns.map(column => 
          column.id === 'unread' 
            ? { ...column, items: [...column.items, newTask] }
            : column
        )
      );

      // Reset form
      setTaskForm({
        name: '',
        phone: '',
        email: '',
        device_type: '',
        damage_description: '',
        urgency: 'normal',
        price: '',
        started_at: '',
        completed_at: ''
      });
      
      setShowTaskForm(false);
      console.log('ახალი ტასკი შეიქმნა:', newTask);
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

      // Update in columns
      setColumns(prevColumns => 
        prevColumns.map(column => ({
          ...column,
          items: column.items.map(item => 
            item.id === editingTask.id ? updatedTask : item
          )
        }))
      );

      // Reset form
      setTaskForm({
        name: '',
        phone: '',
        email: '',
        device_type: '',
        damage_description: '',
        urgency: 'normal',
        price: '',
        started_at: '',
        completed_at: ''
      });
      
      setEditingTask(null);
      setSelectedCard(null);
      console.log('ტასკი განახლდა:', updatedTask);
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const openEditForm = (task) => {
    setTaskForm({
      name: task.name || '',
      phone: task.phone || '',
      email: task.email || '',
      device_type: task.device_type || '',
      damage_description: task.problem_description || '',
      urgency: task.urgency || 'normal',
      price: task.price ? task.price.toString() : '',
      started_at: task.started_at ? task.started_at.split('T')[0] : '',
      completed_at: task.completed_at ? task.completed_at.split('T')[0] : ''
    });
    setEditingTask(task);
    setSelectedCard(null);
  };

  const KanbanCard = ({ item, columnId }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, item, columnId)}
      className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-move mb-3"
    >
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-2">
        <Badge variant="outline" className="text-xs font-medium">
          {item.case_id}
        </Badge>
        <Badge className={getPriorityColor(item.urgency)}>
          {item.urgency === 'emergency' ? '🚨' : 
           item.urgency === 'urgent' ? '⚡' : 
           '📋'}
        </Badge>
      </div>

      {/* Compact Content */}
      <div className="space-y-1">
        <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
          {item.name}
        </h4>
        
        <p className="text-xs text-gray-600 line-clamp-1">
          {item.device_type} - {item.problem_description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {item.phone && <div className="w-2 h-2 bg-green-400 rounded-full" title="ტელეფონი"></div>}
            {item.email && <div className="w-2 h-2 bg-blue-400 rounded-full" title="ემაილი"></div>}
            {item.price && <div className="w-2 h-2 bg-yellow-400 rounded-full" title="ფასი"></div>}
          </div>
          
          <Button 
            size="xs"
            variant="ghost"
            className="text-xs px-2 py-1 h-6"
            onClick={() => setSelectedCard(item)}
          >
            <Eye className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, item, columnId)}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-move mb-3"
      onClick={() => setSelectedCard(item)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <Badge variant="outline" className="text-xs font-medium">
          {item.case_id}
        </Badge>
        <Badge className={getPriorityColor(item.urgency)}>
          {item.urgency === 'emergency' ? '🚨 საავარია' : 
           item.urgency === 'urgent' ? '⚡ სასწრაფო' : 
           '📋 ჩვეულებრივი'}
        </Badge>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
          {item.device_type} - {item.problem_type}
        </h4>
        
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <User className="h-3 w-3" />
          <span>{item.name}</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Clock className="h-3 w-3" />
          <span>{getTimeElapsed(item.created_at)}</span>
        </div>

        {(item.started_at || item.completed_at) && (
          <div className="space-y-1">
            {item.started_at && (
              <div className="flex items-center gap-2 text-xs text-blue-600">
                <Play className="h-3 w-3" />
                <span>დაწყებული: {new Date(item.started_at).toLocaleDateString('ka-GE')}</span>
              </div>
            )}
            {item.completed_at && (
              <div className="flex items-center gap-2 text-xs text-green-600">
                <CheckCircle className="h-3 w-3" />
                <span>დასრულებული: {new Date(item.completed_at).toLocaleDateString('ka-GE')}</span>
              </div>
            )}
          </div>
        )}

        {item.price && (
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-xs text-gray-600">ღირებულება:</span>
            <span className="text-sm font-medium text-green-600">{item.price}₾</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t">
        <div className="flex gap-1">
          {item.phone && (
            <div className="w-2 h-2 bg-green-400 rounded-full" title="ტელეფონი არსებობს"></div>
          )}
          {item.email && (
            <div className="w-2 h-2 bg-blue-400 rounded-full" title="ემაილი არსებობს"></div>
          )}
          {item.description && (
            <div className="w-2 h-2 bg-purple-400 rounded-full" title="აღწერა არსებობს"></div>
          )}
        </div>
        
        <button 
          className="text-gray-400 hover:text-gray-600 p-1"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedCard(item);
          }}
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {columns.map((column) => (
          <Card key={column.id} className="p-3">
            <CardContent className="p-0">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${column.color}`}></div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{column.items.length}</p>
                  <p className="text-xs text-gray-600">{column.title.replace(/[📥⏳🔧✅📦]/g, '').trim()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 overflow-x-auto min-h-screen">
        {columns.map((column) => (
          <div
            key={column.id}
            className="bg-gray-50 rounded-lg p-4 min-h-96"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                <h3 className="font-medium text-gray-900">{column.title}</h3>
              </div>
              <Badge variant="outline" className="text-xs">
                {column.items.length}
              </Badge>
            </div>

            {/* Cards */}
            <div className="space-y-3">
              {column.items.map((item) => (
                <KanbanCard key={item.id} item={item} columnId={column.id} />
              ))}
              
              {column.items.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Plus className="h-6 w-6" />
                  </div>
                  <p className="text-sm">ცარიელია</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Card Detail Modal */}
      {selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">საქმის დეტალები</h3>
              <button 
                onClick={() => setSelectedCard(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">საქმის ID</label>
                  <p className="text-lg font-mono">{selectedCard.case_id}</p>
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
              
              <div>
                <label className="text-sm font-medium text-gray-600">კლიენტი</label>
                <p>{selectedCard.name}</p>
                <p className="text-sm text-gray-600">{selectedCard.email}</p>
                <p className="text-sm text-gray-600">{selectedCard.phone}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">მოწყობილობა</label>
                <p>{selectedCard.device_type} - {selectedCard.problem_type}</p>
              </div>
              
              {selectedCard.description && (
                <div>
                  <label className="text-sm font-medium text-gray-600">აღწერა</label>
                  <p className="text-sm bg-gray-50 p-3 rounded">{selectedCard.description}</p>
                </div>
              )}
              
              <div className="flex gap-3 pt-4 border-t">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Edit className="h-4 w-4 mr-2" />
                  რედაქტირება
                </Button>
                <Button size="sm" variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50">
                  <Eye className="h-4 w-4 mr-2" />
                  ნახვა
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