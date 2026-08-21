import { useState } from 'react';
import { useScheduleStore } from '../store/scheduleStore';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '../utils/cn';

const DAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
const DAY_INDEXES = [1, 2, 3, 4, 5, 6, 0]; // 0 = Chủ nhật

export function Schedule() {
  const { events, addEvent, removeEvent } = useScheduleStore();
  const [isAdding, setIsAdding] = useState(false);
  
  const [newEvent, setNewEvent] = useState({
    title: '',
    dayOfWeek: 1,
    startTime: '07:00',
    endTime: '07:45',
    type: 'MAIN' as const
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title) return;
    addEvent(newEvent);
    setIsAdding(false);
    setNewEvent({ ...newEvent, title: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Thời khóa biểu</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm lịch học
        </button>
      </div>

      <Modal isOpen={isAdding} onClose={() => setIsAdding(false)} title="Thêm lịch học mới">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Môn học / Sự kiện</label>
            <input required type="text" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500" placeholder="VD: Toán, Học thêm Lý..." />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Thứ</label>
              <select value={newEvent.dayOfWeek} onChange={e => setNewEvent({...newEvent, dayOfWeek: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500">
                {DAY_INDEXES.map((d, i) => <option key={d} value={d}>{DAYS[i]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Loại</label>
              <select value={newEvent.type} onChange={e => setNewEvent({...newEvent, type: e.target.value as any})} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500">
                <option value="MAIN">Học chính</option>
                <option value="EXTRA">Học thêm</option>
                <option value="EXAM">Lịch thi</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Bắt đầu</label>
              <input required type="time" value={newEvent.startTime} onChange={e => setNewEvent({...newEvent, startTime: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kết thúc</label>
              <input required type="time" value={newEvent.endTime} onChange={e => setNewEvent({...newEvent, endTime: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500" />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-100 font-medium">Hủy</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">Thêm lịch</button>
          </div>
        </form>
      </Modal>

      <div className="grid grid-cols-1 xl:grid-cols-7 gap-4">
        {DAY_INDEXES.map((dayIdx, i) => {
          const dayEvents = events.filter(e => e.dayOfWeek === dayIdx).sort((a, b) => a.startTime.localeCompare(b.startTime));
          
          return (
            <Card key={dayIdx} className="min-h-[400px] flex flex-col bg-white">
              <div className="p-3 bg-slate-100 border-b border-slate-200 text-center font-bold text-slate-700">
                {DAYS[i]}
              </div>
              <div className="p-2 flex-1 space-y-2">
                {dayEvents.map(evt => (
                  <div 
                    key={evt.id} 
                    className={cn(
                      "p-3 rounded-md border text-sm group relative",
                      evt.type === 'MAIN' ? "bg-blue-50 border-blue-200 text-blue-900" :
                      evt.type === 'EXTRA' ? "bg-emerald-50 border-emerald-200 text-emerald-900" :
                      "bg-rose-50 border-rose-200 text-rose-900"
                    )}
                  >
                    <button 
                      onClick={() => removeEvent(evt.id)}
                      className="absolute top-2 right-2 text-red-400 hover:text-red-600 hidden group-hover:block"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="font-semibold pr-4">{evt.title}</div>
                    <div className="text-xs mt-1 opacity-80">{evt.startTime} - {evt.endTime}</div>
                  </div>
                ))}
                {dayEvents.length === 0 && (
                  <div className="text-center text-slate-400 text-sm mt-4 italic">Trống</div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
