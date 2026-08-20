import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '../utils/cn';

export function Pomodoro() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'pomodoro' | 'shortBreak' | 'longBreak'>('pomodoro');

  useEffect(() => {
    let interval: number | null = null;
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // alert('Hết giờ!');
    }
    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const switchMode = (newMode: 'pomodoro' | 'shortBreak' | 'longBreak') => {
    setMode(newMode);
    setIsActive(false);
    if (newMode === 'pomodoro') setTimeLeft(25 * 60);
    if (newMode === 'shortBreak') setTimeLeft(5 * 60);
    if (newMode === 'longBreak') setTimeLeft(15 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <Card className="p-8 w-full max-w-md text-center bg-white">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Đồng hồ tự học</h2>
        
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

        <div className="text-8xl font-black text-slate-800 mb-8 font-mono tracking-tight">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setIsActive(!isActive)}
            className="flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
          </button>
          <button
            onClick={() => switchMode(mode)}
            className="flex items-center justify-center w-16 h-16 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>
      </Card>
    </div>
  );
}
