import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, TaskStatus } from '../types';

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  removeTask: (id: string) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
}

const initialTasks: Task[] = [
  { id: '1', title: 'Làm bài tập Toán', status: 'TODO', priority: 'HIGH' },
  { id: '2', title: 'Soạn văn', status: 'IN_PROGRESS', priority: 'MEDIUM' },
  { id: '3', title: 'Đọc trước bài Lý', status: 'DONE', priority: 'LOW' },
];

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: initialTasks,
      
      addTask: (task) => set((state) => ({
        tasks: [...state.tasks, { ...task, id: Date.now().toString() }]
      })),

      removeTask: (id) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== id)
      })),

      updateTaskStatus: (id, status) => set((state) => ({
        tasks: state.tasks.map(t => 
          t.id === id ? { ...t, status } : t
        )
      })),

      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map(t => 
          t.id === id ? { ...t, ...updates } : t
        )
      }))
    }),
    {
      name: 'task-storage',
    }
  )
);
