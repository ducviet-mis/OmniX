import React, { useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import { Task, TaskStatus } from '../types';
import { Card } from '../components/Card';
import { cn } from '../utils/cn';
import { Plus, GripVertical } from 'lucide-react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'TODO', title: 'Cần làm', color: 'bg-slate-100' },
  { id: 'IN_PROGRESS', title: 'Đang làm', color: 'bg-blue-50' },
  { id: 'DONE', title: 'Hoàn thành', color: 'bg-green-50' }
];

function SortableTaskItem({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityColors = {
    HIGH: 'text-red-700 bg-red-100',
    MEDIUM: 'text-yellow-700 bg-yellow-100',
    LOW: 'text-green-700 bg-green-100',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 cursor-default group"
    >
      <div className="flex items-start">
        <div 
          {...attributes} 
          {...listeners}
          className="mt-1 mr-2 cursor-grab text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-slate-900">{task.title}</h4>
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
  );
}

export function Tasks() {
  const { tasks, addTask, updateTaskStatus } = useTaskStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find(t => t.id === taskId);
    if (!activeTask) return;

    // Check if drop over a column
    const isOverColumn = COLUMNS.some(col => col.id === overId);
    if (isOverColumn && activeTask.status !== overId) {
      updateTaskStatus(taskId, overId as TaskStatus);
      return;
    }

    // Check if drop over another task
    const overTask = tasks.find(t => t.id === overId);
    if (overTask && activeTask.status !== overTask.status) {
      updateTaskStatus(taskId, overTask.status);
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

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLUMNS.map(column => {
            const columnTasks = tasks.filter(t => t.status === column.id);
            return (
              <Card key={column.id} className={cn("p-4 flex flex-col h-full", column.color)} id={column.id}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-800">{column.title}</h3>
                  <span className="bg-white text-slate-500 text-xs px-2 py-1 rounded-full shadow-sm font-medium">
                    {columnTasks.length}
                  </span>
                </div>
                
                <SortableContext items={columnTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                  <div className="flex-1 space-y-3 min-h-[200px]">
                    {columnTasks.map(task => (
                      <SortableTaskItem key={task.id} task={task} />
                    ))}
                  </div>
                </SortableContext>
              </Card>
            );
          })}
        </div>
      </DndContext>
    </div>
  );
}
