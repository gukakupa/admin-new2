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
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const KanbanBoard = ({ serviceRequests, updateServiceRequest, darkMode = false }) => {
  const [columns, setColumns] = useState([
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
    },
    {
      id: 'picked_up',
      title: 'გატანილი',
      color: 'bg-purple-500',
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
    // Load manual tasks from localStorage
    const manualTasks = JSON.parse(localStorage.getItem('kanban_manual_tasks') || '[]');
    console.log('📂 Loaded manual tasks from localStorage:', manualTasks);
    
    // Only show service requests that are approved for Kanban
    const approvedRequests = serviceRequests.filter(request => request.approved_for_kanban === true);
    console.log('✅ Approved service requests:', approvedRequests);
    
    // Combine approved service requests with manual tasks
    const allKanbanTasks = [...approvedRequests, ...manualTasks];
    console.log('🔗 Combined Kanban tasks:', allKanbanTasks);
    
    // Group all tasks by status
    const groupedTasks = allKanbanTasks.reduce((acc, task) => {
      const status = task.status || 'pending';
      if (!acc[status]) acc[status] = [];
      acc[status].push(task);
      return acc;
    }, {});

    // Update columns with combined tasks
    setColumns(prevColumns => 
      prevColumns.map(column => ({
        ...column,
        items: groupedTasks[column.id] || []
      }))
    );
  }, [serviceRequests]);

  // Function to move task left or right between columns
  const moveTaskHorizontal = async (taskId, currentColumnId, direction) => {
    const columnOrder = ['pending', 'in_progress', 'completed', 'picked_up'];
    const currentIndex = columnOrder.indexOf(currentColumnId);
    
    let targetIndex;
    if (direction === 'left' && currentIndex > 0) {
      targetIndex = currentIndex - 1;
    } else if (direction === 'right' && currentIndex < columnOrder.length - 1) {
      targetIndex = currentIndex + 1;
    } else {
      return; // Can't move further
    }
    
    const targetColumnId = columnOrder[targetIndex];
    
    // Find the task
    const task = columns.find(col => col.id === currentColumnId)?.items.find(item => item.id === taskId);
    if (!task) return;
    
    console.log(`🔄 Moving task ${taskId} from ${currentColumnId} to ${targetColumnId}`);
    
    try {
      // Check if it's a manual Kanban task
      if (task.is_manual || task.id.startsWith('kanban_')) {
        // Update in localStorage
        const manualTasks = JSON.parse(localStorage.getItem('kanban_manual_tasks') || '[]');
        const updatedManualTasks = manualTasks.map(t => 
          t.id === taskId ? { ...t, status: targetColumnId } : t
        );
        localStorage.setItem('kanban_manual_tasks', JSON.stringify(updatedManualTasks));
        
        // Update local state
        setColumns(prevColumns => 
          prevColumns.map(column => {
            if (column.id === currentColumnId) {
              return {
                ...column,
                items: column.items.filter(item => item.id !== taskId)
              };
            }
            if (column.id === targetColumnId) {
              return {
                ...column,
                items: [...column.items, { ...task, status: targetColumnId }]
              };
            }
            return column;
          })
        );
        
      } else if (updateServiceRequest) {
        // Update service request via API
        await updateServiceRequest(taskId, { status: targetColumnId });
      }
    } catch (error) {
      console.error('❌ Error moving task:', error);
    }
  };

  const handleDragStart = (e, item, columnId) => {
    console.log('🎯 DRAG START:', {
      itemId: item.id,
      caseId: item.case_id,
      fromColumn: columnId,
      updateFunction: typeof updateServiceRequest
    });
    setDraggedItem({ item, sourceColumn: columnId });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetColumnId) => {
    e.preventDefault();
    console.log('🎯 DROP ATTEMPT:', {
      targetColumn: targetColumnId,
      draggedItem: draggedItem ? {
        id: draggedItem.item.id,
        caseId: draggedItem.item.case_id,
        sourceColumn: draggedItem.sourceColumn
      } : null,
      updateFunction: typeof updateServiceRequest,
      hasUpdateFunction: !!updateServiceRequest
    });
    
    if (!draggedItem || draggedItem.sourceColumn === targetColumnId) {
      console.log('❌ No valid drag or same column');
      setDraggedItem(null);
      return;
    }

    console.log('✅ VALID DROP - Moving task:', draggedItem.item.case_id, 'from', draggedItem.sourceColumn, 'to', targetColumnId);

    try {
      // Check if it's a manual Kanban task
      if (draggedItem.item.is_manual || draggedItem.item.id.startsWith('kanban_')) {
        console.log('🔄 Updating manual task status in localStorage');
        
        // Update in localStorage
        const manualTasks = JSON.parse(localStorage.getItem('kanban_manual_tasks') || '[]');
        const updatedManualTasks = manualTasks.map(task => 
          task.id === draggedItem.item.id 
            ? { ...task, status: targetColumnId }
            : task
        );
        localStorage.setItem('kanban_manual_tasks', JSON.stringify(updatedManualTasks));
        console.log('✅ Manual task status updated in localStorage');
        
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
        
      } else if (updateServiceRequest && draggedItem.item.id) {
        // Update service request via API
        console.log('🔄 API UPDATE STARTING...');
        const result = await updateServiceRequest(draggedItem.item.id, { status: targetColumnId });
        console.log('✅ API UPDATE SUCCESS:', result);
      } else {
        console.log('❌ NO UPDATE FUNCTION OR ID:', {
          hasFunction: !!updateServiceRequest,
          hasId: !!draggedItem.item.id,
          itemId: draggedItem.item.id
        });
        
        // Fallback to local state update only
        console.log('🔄 LOCAL UPDATE FALLBACK...');
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
        console.log('✅ LOCAL UPDATE COMPLETED');
      }
    } catch (error) {
      console.error('❌ ERROR updating task status:', error);
      // Even if API fails, try local update
      console.log('🔄 ERROR FALLBACK - LOCAL UPDATE...');
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
      console.log('✅ ERROR FALLBACK COMPLETED');
    } finally {
      setDraggedItem(null);
      console.log('🏁 DRAG OPERATION FINISHED');
    }
  };

  // Move task up or down within the same column
  const moveTask = (taskId, columnId, direction) => {
    console.log('🔄 MOVE TASK:', { taskId, columnId, direction });
    
    setColumns(prevColumns => 
      prevColumns.map(column => {
        if (column.id !== columnId) return column;
        
        const items = [...column.items];
        const currentIndex = items.findIndex(item => item.id === taskId);
        
        if (currentIndex === -1) return column;
        
        let newIndex;
        if (direction === 'up') {
          newIndex = Math.max(0, currentIndex - 1);
        } else {
          newIndex = Math.min(items.length - 1, currentIndex + 1);
        }
        
        if (newIndex === currentIndex) return column; // No movement needed
        
        // Swap items
        [items[currentIndex], items[newIndex]] = [items[newIndex], items[currentIndex]];
        
        console.log('✅ MOVED TASK:', direction, 'from index', currentIndex, 'to', newIndex);
        
        return {
          ...column,
          items
        };
      })
    );
  };

  const createTask = async () => {
    console.log('🎯 CREATE MANUAL KANBAN TASK');
    console.log('📋 Current taskForm state:', taskForm);
    
    try {
      // Validation
      if (!taskForm.name || !taskForm.device_type || !taskForm.damage_description) {
        console.log('❌ Validation failed - missing required fields:', {
          name: taskForm.name,
          device_type: taskForm.device_type,
          damage_description: taskForm.damage_description
        });
        alert('გთხოვთ შეავსოთ ყველა საჭირო ველი (სახელი, მოწყობილობა, პრობლემა)');
        return;
      }

      console.log('🔄 Creating manual Kanban task (localStorage only)...');
      
      // Create manual task for Kanban only (not service request)
      const newTask = {
        id: `kanban_${Date.now()}`,
        case_id: `KB${new Date().getFullYear()}${String(Date.now()).slice(-4)}`,
        name: taskForm.name,
        phone: taskForm.phone || '',
        email: taskForm.email || `${taskForm.name.toLowerCase().replace(' ', '.')}@manual.local`,
        device_type: taskForm.device_type,
        problem_description: taskForm.damage_description,
        urgency: taskForm.urgency || 'medium',
        price: taskForm.price ? parseFloat(taskForm.price) : null,
        created_at: new Date().toISOString(),
        status: 'pending',
        is_manual: true,  // Flag to identify manual Kanban tasks
        approved_for_kanban: true
      };

      console.log('📋 Manual Kanban task created:', newTask);

      // Save to localStorage
      const existingManualTasks = JSON.parse(localStorage.getItem('kanban_manual_tasks') || '[]');
      existingManualTasks.push(newTask);
      localStorage.setItem('kanban_manual_tasks', JSON.stringify(existingManualTasks));
      console.log('💾 Saved to localStorage');

      // Add to local state immediately
      setColumns(prevColumns => 
        prevColumns.map(column => 
          column.id === 'pending' 
            ? { ...column, items: [...column.items, newTask] }
            : column
        )
      );

      // Reset form and close modal
      resetForm();
      setShowTaskForm(false);
      console.log('🎉 Manual Kanban task creation completed successfully!');

    } catch (error) {
      console.error('❌ Error creating manual task:', error);
      alert('შეცდომა: ტასკის შექმნა ვერ მოხერხდა. ' + error.message);
    }
  };

  const editTask = async () => {
    try {
      console.log('🔄 Editing task...', editingTask);
      
      if (editingTask.is_manual || editingTask.id.startsWith('kanban_')) {
        // Update manual task in localStorage
        console.log('📝 Updating manual Kanban task in localStorage');
        
        const manualTasks = JSON.parse(localStorage.getItem('kanban_manual_tasks') || '[]');
        const updatedManualTasks = manualTasks.map(task => 
          task.id === editingTask.id 
            ? {
                ...task,
                name: taskForm.name,
                phone: taskForm.phone,
                email: taskForm.email,
                device_type: taskForm.device_type,
                problem_description: taskForm.damage_description,
                urgency: taskForm.urgency,
                price: taskForm.price ? parseFloat(taskForm.price) : null
              }
            : task
        );
        
        localStorage.setItem('kanban_manual_tasks', JSON.stringify(updatedManualTasks));
        console.log('✅ Manual task updated in localStorage');
        
        // Update local state
        const updatedTask = {
          ...editingTask,
          name: taskForm.name,
          phone: taskForm.phone,
          email: taskForm.email,
          device_type: taskForm.device_type,
          problem_description: taskForm.damage_description,
          urgency: taskForm.urgency,
          price: taskForm.price ? parseFloat(taskForm.price) : null
        };

        setColumns(prevColumns => 
          prevColumns.map(column => ({
            ...column,
            items: column.items.map(item => 
              item.id === editingTask.id ? updatedTask : item
            )
          }))
        );
        
      } else if (updateServiceRequest && editingTask.id) {
        // Update service request via API
        console.log('🌐 Updating service request via API');
        await updateServiceRequest(editingTask.id, {
          name: taskForm.name,
          email: taskForm.email,
          phone: taskForm.phone,
          device_type: taskForm.device_type,
          problem_description: taskForm.damage_description,
          urgency: taskForm.urgency,
          price: taskForm.price ? parseFloat(taskForm.price) : null
        });
        console.log('✅ Service request updated via API');
      }

      resetForm();
      setEditingTask(null);
      setSelectedCard(null);
    } catch (error) {
      console.error('❌ Error editing task:', error);
      alert('შეცდომა: ტასკის რედაქტირება ვერ მოხერხდა. ' + error.message);
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
      className={`group relative rounded-lg border transition-all duration-200 cursor-move mb-1 hover:shadow-lg ${
        draggedItem?.item?.id === item.id 
          ? 'opacity-50 scale-95 transform rotate-1' 
          : 'hover:shadow-lg hover:scale-102'
      } ${
        darkMode 
          ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
      style={{ userSelect: 'none' }}
    >
      {/* Ultra Compact Card Content */}
      <div className="p-2">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            {/* Tiny Avatar */}
            <div 
              className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}
              style={{
                background: item.urgency === 'critical' ? '#ef4444' :
                           item.urgency === 'high' ? '#f97316' :
                           item.urgency === 'medium' ? '#3b82f6' : '#6b7280'
              }}
            >
              {item.name ? item.name.charAt(0).toUpperCase() : 'U'}
            </div>
            
            {/* Name & Case ID */}
            <div className="flex-1 min-w-0">
              <h4 className={`text-xs font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {item.name || 'უცნობი კლიენტი'}
              </h4>
              <p className={`text-xs ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                {item.case_id}
              </p>
            </div>
          </div>
          
          {/* Price */}
          {item.price && (
            <div className={`text-xs font-bold px-1.5 py-0.5 rounded ${
              darkMode ? 'bg-green-900 text-green-400' : 'bg-green-100 text-green-700'
            }`}>
              {item.price}₾
            </div>
          )}
        </div>

        {/* Device Type & Status */}
        <div className="flex items-center justify-between mb-1">
          <div className={`text-xs px-1.5 py-0.5 rounded ${
            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
          }`}>
            {item.device_type?.toUpperCase() || 'უცნობი'}
          </div>
          <div className="text-xs text-gray-500">
            {getTimeElapsed(item.created_at)}
          </div>
        </div>

        {/* Problem Description - Ultra Compact */}
        {item.problem_description && (
          <p className={`text-xs leading-tight ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
            {item.problem_description.length > 30 
              ? `${item.problem_description.substring(0, 30)}...` 
              : item.problem_description}
          </p>
        )}

        {/* Actions Row - Split Layout */}
        <div className="flex items-center justify-between mt-1">
          {/* Left Side - Contact buttons */}
          <div className="flex items-center gap-1">
            {/* Phone */}
            {item.phone && (
              <button 
                onClick={() => window.open(`tel:${item.phone}`, '_self')}
                className={`p-1 rounded-md text-xs ${
                  darkMode 
                    ? 'bg-blue-900 text-blue-400 hover:bg-blue-800' 
                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                } transition-colors transform hover:scale-105`}
                title={item.phone}
              >
                <Phone className="w-3 h-3" />
              </button>
            )}
            
            {/* Email */}
            {item.email && (
              <button 
                onClick={() => window.open(`mailto:${item.email}`, '_self')}
                className={`p-1 rounded-md text-xs ${
                  darkMode 
                    ? 'bg-green-900 text-green-400 hover:bg-green-800' 
                    : 'bg-green-100 text-green-600 hover:bg-green-200'
                } transition-colors transform hover:scale-105`}
                title={item.email}
              >
                <Mail className="w-3 h-3" />
              </button>
            )}
            
            {/* View Details */}
            <button 
              onClick={() => setSelectedCard(item)}
              className={`p-1 rounded-md text-xs ${
                darkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } transition-colors transform hover:scale-105`}
              title="დეტალების ნახვა"
            >
              <Eye className="w-3 h-3" />
            </button>
          </div>
          
          {/* Center - Move Left/Right Buttons Only */}
          <div className="flex gap-1">
            <button 
              onClick={() => moveTaskHorizontal(item.id, columnId, 'left')}
              disabled={columnId === 'pending'}
              className={`p-1.5 rounded-md text-sm transition-all duration-200 ${
                columnId === 'pending'
                  ? 'opacity-30 cursor-not-allowed bg-gray-200'
                  : darkMode 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 shadow-md hover:shadow-lg' 
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-400 hover:to-blue-500 shadow-md hover:shadow-lg'
              } transform hover:scale-105 active:scale-95`}
              title="მარცხნივ გადატანა"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
            
            <button 
              onClick={() => moveTaskHorizontal(item.id, columnId, 'right')}
              disabled={columnId === 'picked_up'}
              className={`p-1.5 rounded-md text-sm transition-all duration-200 ${
                columnId === 'picked_up'
                  ? 'opacity-30 cursor-not-allowed bg-gray-200'
                  : darkMode 
                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-500 hover:to-green-600 shadow-md hover:shadow-lg' 
                    : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-400 hover:to-green-500 shadow-md hover:shadow-lg'
              } transform hover:scale-105 active:scale-95`}
              title="მარჯვნივ გადატანა"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          
          {/* Right Side - Empty for balance */}
          <div className="w-8"></div>
        </div>
        
        {/* Priority Indicator - Bottom Right */}
        <div className="absolute bottom-1 right-1">
          <div 
            className="w-2 h-2 rounded-full"
            style={{
              background: item.urgency === 'critical' ? '#ef4444' :
                         item.urgency === 'high' ? '#f97316' :
                         item.urgency === 'medium' ? '#3b82f6' : '#6b7280'
            }}
          ></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 w-full max-w-none">
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
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, rgba(147, 197, 253, 0.8), rgba(99, 102, 241, 0.8));
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, rgba(147, 197, 253, 1), rgba(99, 102, 241, 1));
        }
      `}</style>
      
      {/* Add Task Button - Minimal */}
      <div className="flex justify-end mb-4">
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white" 
          onClick={() => setShowTaskForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          ახალი ტასკი
        </Button>
      </div>

      {/* Compact Kanban Board - Matches Header Style */}
      <div className="grid grid-cols-4 gap-3 min-h-screen w-full max-w-none">
        {columns.map((column) => (
          <div
            key={column.id}
            className={`relative rounded-lg border transition-all duration-200 overflow-hidden ${
              darkMode 
                ? 'bg-gray-800 border-gray-700 shadow-md' 
                : 'bg-white border-gray-200 shadow-md'
            }`}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDrop={(e) => handleDrop(e, column.id)}
            style={{
              minHeight: '500px'
            }}
          >
            {/* Compact Header */}
            <div 
              className={`px-3 py-2 border-b ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              }`}
              style={{
                background: column.id === 'picked_up' ? 'rgba(168, 85, 247, 0.1)' :
                           column.id === 'pending' ? 'rgba(249, 115, 22, 0.1)' :
                           column.id === 'in_progress' ? 'rgba(59, 130, 246, 0.1)' :
                           'rgba(34, 197, 94, 0.1)'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{
                      background: column.id === 'picked_up' ? '#a855f7' :
                                 column.id === 'pending' ? '#f97316' :
                                 column.id === 'in_progress' ? '#3b82f6' :
                                 '#22c55e'
                    }}
                  ></div>
                  <h3 className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {column.title}
                  </h3>
                </div>
                <div 
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-200' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {column.items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0)}₾
                </div>
              </div>
            </div>

            {/* Compact Cards Container */}
            <div 
              className="px-2 py-1 space-y-1 overflow-y-auto" 
              style={{ 
                maxHeight: 'calc(100vh - 200px)'
              }}
            >
              {column.items.map((item) => (
                <KanbanCard key={item.id} item={item} columnId={column.id} />
              ))}
              
              {column.items.length === 0 && (
                <div className={`text-center py-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <div 
                    className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2 border-2 border-dashed ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600' 
                        : 'bg-gray-100 border-gray-300'
                    }`}
                  >
                    <Plus className={`h-4 w-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    ცარიელია
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
                  onClick={() => {
                    console.log('🎯 SAVE BUTTON CLICKED!');
                    console.log('📋 editingTask:', editingTask);
                    console.log('📋 taskForm:', taskForm);
                    if (editingTask) {
                      editTask();
                    } else {
                      createTask();
                    }
                  }}
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
                      onClick={() => openEditForm(selectedCard)}
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