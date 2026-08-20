import { Card } from '../components/Card';
import { useGradeStore } from '../store/gradeStore';
import { useTaskStore } from '../store/taskStore';
import { calculateGPA, classifyAcademicPerformance, calculateTBM } from '../utils/gradeUtils';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export function Dashboard() {
  const subjects = useGradeStore((state) => state.subjects);
  const tasks = useTaskStore((state) => state.tasks);
  
  const gpa = calculateGPA(subjects);
  const performance = classifyAcademicPerformance(subjects);
  const pendingTasks = tasks.filter(t => t.status !== 'DONE').length;

  // Chuẩn bị dữ liệu cho Radar Chart
  const radarData = subjects
    .filter(s => !s.isEval)
    .map(s => {
      const tbm = calculateTBM(s);
      return {
        subject: s.name,
        score: tbm !== null ? tbm : 0,
        fullMark: 10,
      };
    })
    .filter(d => d.score > 0);

  // Dữ liệu giả lập cho Line Chart (tiến độ)
  const lineData = [
    { month: 'Tháng 9', gpa: 7.2 },
    { month: 'Tháng 10', gpa: 7.5 },
    { month: 'Tháng 11', gpa: 7.8 },
    { month: 'Tháng 12', gpa: gpa || 8.0 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-slate-500">Điểm Trung Bình (GPA)</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">{gpa !== null ? gpa : '--'}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-slate-500">Xếp loại Học Lực</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{performance}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-slate-500">Công việc đang chờ</h3>
          <p className="text-3xl font-bold text-orange-600 mt-2">{pendingTasks}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 h-[400px]">
          <h3 className="text-base font-semibold text-slate-800 mb-4">Phân tích năng lực các môn</h3>
          {radarData.length > 2 ? (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: '#94a3b8' }} />
                <Radar name="Điểm TBM" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              Nhập điểm ít nhất 3 môn để xem biểu đồ
            </div>
          )}
        </Card>

        <Card className="p-6 h-[400px]">
          <h3 className="text-base font-semibold text-slate-800 mb-4">Tiến độ học tập</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 10]} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="gpa" 
                name="GPA"
                stroke="#2563eb" 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
