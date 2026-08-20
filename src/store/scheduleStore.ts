import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type ClassSchedule } from '../types';

interface ScheduleState {
  events: ClassSchedule[];
  addEvent: (event: Omit<ClassSchedule, 'id'>) => void;
  removeEvent: (id: string) => void;
}

const initialEvents: ClassSchedule[] = [
  { id: '1', title: 'Toán', dayOfWeek: 1, startTime: '07:00', endTime: '07:45', type: 'MAIN' },
  { id: '2', title: 'Ngữ Văn', dayOfWeek: 1, startTime: '07:50', endTime: '08:35', type: 'MAIN' },
  { id: '3', title: 'Học thêm Lý', dayOfWeek: 2, startTime: '18:00', endTime: '19:30', type: 'EXTRA' },
];

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set) => ({
      events: initialEvents,
      addEvent: (event) => set((state) => ({
        events: [...state.events, { ...event, id: Date.now().toString() }]
      })),
      removeEvent: (id) => set((state) => ({
        events: state.events.filter((e) => e.id !== id)
      }))
    }),
    { name: 'schedule-storage' }
  )
);
