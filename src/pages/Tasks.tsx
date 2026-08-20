import { useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import { type TaskStatus } from '../types';
import { Card } from '../components/Card';
import { cn } from '../utils/cn';
import { Plus, GripVertical, Trash2 } from 'lucide-react';

const COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'TODO', title: 'Cần làm', color: 'bg-slate-100' },
  { id: 'IN_PROGRESS', title: 'Đang làm', color: 'bg-blue-50' },
  { id: 'DONE', title: 'Hoàn thành', color: 'bg-green-50' }
];

export function Tasks() {
  const { tasks, addTask, updateTaskStatus, removeTask } = useTaskStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  
  // Trạng thái cho cột đang được drag over để thêm highlight
  const [dragOverCol, setDragOverCol] = useState<TaskStatus | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    // Để có hiệu ứng mờ cho phần tử gốc
    setTimeout(() => {
      (e.target as HTMLElement).classList.add('opacity-50');
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).classList.remove('opacity-50');
    setDragOverCol(null);
  };

  const handleDragOver = (e: React.DragEvent, colId: TaskStatus) => {
    e.preventDefault(); // Cho phép drop
    if (dragOverCol !== colId) {
      setDragOverCol(colId);
    }
  };

  const handleDragLeave = () => {
    setDragOverCol(null);
  };

  const handleDrop = (e: React.DragEvent, colId: TaskStatus) => {
    e.preventDefault();
    setDragOverCol(null);
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      updateTaskStatus(taskId, colId);
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    addTask({
      title: newTaskTitle,
      status: 'TODO',
      priority: 'MEDIUM',
    });
    setNewTaskTitle('');
    setIsAdding(false);
  };

  const priorityColors = {
    HIGH: 'text-red-700 bg-red-100',
    MEDIUM: 'text-yellow-700 bg-yellow-100',
    LOW: 'text-green-700 bg-green-100',
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Bảng Bài tập</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm mới
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddTask} className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <input
            type="text"
            autoFocus
            placeholder="Tên bài tập..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="mt-3 flex justify-end space-x-2">
            <button type="button" onClick={() => setIsAdding(false)} className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-md">Hủy</button>
            <button type="submit" className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">Lưu</button>
          </div>
        </form>
      )}

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
        {COLUMNS.map(column => {
          const columnTasks = tasks.filter(t => t.status === column.id);
          const isDragOver = dragOverCol === column.id;
          
          return (
            <Card 
              key={column.id} 
              className={cn(
                "p-4 flex flex-col h-full transition-colors", 
                column.color,
                isDragOver ? "ring-2 ring-blue-400 bg-opacity-70" : ""
              )}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800">{column.title}</h3>
                <span className="bg-white text-slate-500 text-xs px-2 py-1 rounded-full shadow-sm font-medium">
                  {columnTasks.length}
                </span>
              </div>
              
              <div className="flex-1 space-y-3 min-h-[200px]">
                {columnTasks.map(task => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onDragEnd={handleDragEnd}
                    className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 cursor-grab active:cursor-grabbing group transition-all hover:shadow-md"
                  >
                    <div className="flex items-start">
                      <div className="mt-1 mr-2 text-slate-400 opacity-50 group-hover:opacity-100">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-slate-900 pr-6 relative">
                          {task.title}
                          <button 
                            onClick={() => removeTask(task.id)}
                            className="absolute -right-2 -top-1 p-1 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </h4>
                        {task.description && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{task.description}</p>
                        )}
                        <div className="mt-3 flex items-center justify-between">
                          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", priorityColors[task.priority])}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {columnTasks.length === 0 && (
                  <div className="h-20 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-slate-400 text-sm">
                    Kéo thả vào đây
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
