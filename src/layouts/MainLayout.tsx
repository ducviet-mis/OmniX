import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  GraduationCap, 
  KanbanSquare, 
  Calendar, 
  Calculator,
  Timer
} from 'lucide-react';
import { cn } from '../utils/cn';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Điểm số', href: '/grades', icon: GraduationCap },
  { name: 'Bài tập', href: '/tasks', icon: KanbanSquare },
  { name: 'Thời khóa biểu', href: '/schedule', icon: Calendar },
  { name: 'Công cụ', href: '/tools', icon: Calculator },
  { name: 'Pomodoro', href: '/pomodoro', icon: Timer },
];

export function MainLayout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="flex h-16 items-center px-6 border-b border-slate-200">
          <GraduationCap className="w-8 h-8 text-blue-600 mr-3" />
          <span className="text-xl font-bold text-slate-800">HS Dashboard</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || 
                            (item.href !== '/' && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                  isActive 
                    ? "bg-blue-50 text-blue-700" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon className={cn(
                  "mr-3 h-5 w-5",
                  isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-500"
                )} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-800">
            {navigation.find(n => location.pathname === n.href || (n.href !== '/' && location.pathname.startsWith(n.href)))?.name || 'Dashboard'}
          </h1>
        </header>
        
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
