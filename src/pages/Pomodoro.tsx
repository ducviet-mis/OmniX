import { useState } from 'react';
import { Card } from '../components/Card';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { cn } from '../utils/cn';

export function Pomodoro() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'pomodoro' | 'shortBreak' | 'longBreak' | 'custom'>('pomodoro');
  
  const [showSettings, setShowSettings] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(25);

  const [intervalId, setIntervalId] = useState<number | null>(null);

  const startTimer = () => {
    if (isActive) return;
    setIsActive(true);
    const id = window.setInterval(() => {
      setTimeLeft(time => {
        if (time <= 1) {
          clearInterval(id);
          setIsActive(false);
          return 0;
        }
        return time - 1;
      });
    }, 1000);
    setIntervalId(id);
  };

  const pauseTimer = () => {
    setIsActive(false);
    if (intervalId) window.clearInterval(intervalId);
  };

  const resetTimer = () => {
    pauseTimer();
    if (mode === 'pomodoro') setTimeLeft(25 * 60);
    else if (mode === 'shortBreak') setTimeLeft(5 * 60);
    else if (mode === 'longBreak') setTimeLeft(15 * 60);
    else setTimeLeft(customMinutes * 60);
  };

  const switchMode = (newMode: 'pomodoro' | 'shortBreak' | 'longBreak' | 'custom') => {
    setMode(newMode);
    pauseTimer();
    if (newMode === 'pomodoro') setTimeLeft(25 * 60);
    else if (newMode === 'shortBreak') setTimeLeft(5 * 60);
    else if (newMode === 'longBreak') setTimeLeft(15 * 60);
    else setTimeLeft(customMinutes * 60);
  };

  const handleApplyCustom = () => {
    setMode('custom');
    pauseTimer();
    setTimeLeft(customMinutes * 60);
    setShowSettings(false);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <Card className="p-8 w-full max-w-md text-center bg-white relative">
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full"
        >
          <Settings className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-slate-800 mb-6">Đồng hồ tự học</h2>
        
        {showSettings ? (
          <div className="mb-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Tùy chỉnh thời gian (phút)</h3>
            <div className="flex items-center space-x-3">
              <input 
                type="number" min="1" max="180" 
                value={customMinutes}
                onChange={(e) => setCustomMinutes(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <button 
                onClick={handleApplyCustom}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 whitespace-nowrap"
              >
                Áp dụng
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center space-x-2 mb-8 bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => switchMode('pomodoro')}
              className={cn("px-4 py-2 text-sm font-medium rounded-md transition-colors", mode === 'pomodoro' ? "bg-white shadow-sm text-slate-900" : "text-slate-500")}
            >
              Pomodoro
            </button>
            <button 
              onClick={() => switchMode('shortBreak')}
              className={cn("px-4 py-2 text-sm font-medium rounded-md transition-colors", mode === 'shortBreak' ? "bg-white shadow-sm text-slate-900" : "text-slate-500")}
            >
              Nghỉ ngắn
            </button>
            <button 
              onClick={() => switchMode('longBreak')}
              className={cn("px-4 py-2 text-sm font-medium rounded-md transition-colors", mode === 'longBreak' ? "bg-white shadow-sm text-slate-900" : "text-slate-500")}
            >
              Nghỉ dài
            </button>
          </div>
        )}

        <div className="text-8xl font-black text-slate-800 mb-8 font-mono tracking-tight">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        <div className="flex justify-center space-x-4">
          {isActive ? (
            <button
              onClick={pauseTimer}
              className="flex items-center justify-center w-16 h-16 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md hover:shadow-lg"
            >
              <Pause className="w-8 h-8 fill-current" />
            </button>
          ) : (
            <button
              onClick={startTimer}
              className="flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
              <Play className="w-8 h-8 fill-current ml-1" />
            </button>
          )}
          <button
            onClick={resetTimer}
            className="flex items-center justify-center w-16 h-16 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>
      </Card>
    </div>
  );
}
