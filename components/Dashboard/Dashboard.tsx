
import React, { useMemo } from 'react';
import { Task, User, UserRole } from '../../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend 
} from 'recharts';
import { Clock, CheckCircle2, TrendingUp, Star } from 'lucide-react';

interface DashboardProps {
  tasks: Task[];
  user: User;
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

const Dashboard: React.FC<DashboardProps> = ({ tasks, user }) => {
  const filteredTasks = useMemo(() => {
    if (user.role === UserRole.USER) return tasks.filter(t => t.userId === user.id);
    return tasks;
  }, [tasks, user]);

  const stats = useMemo(() => {
    const total = filteredTasks.length;
    const avgDuration = total ? Math.round(filteredTasks.reduce((acc, t) => acc + t.duration, 0) / total) : 0;
    const avgRating = filteredTasks.filter(t => t.rating).length 
      ? (filteredTasks.reduce((acc, t) => acc + (t.rating || 0), 0) / filteredTasks.filter(t => t.rating).length).toFixed(1) 
      : '0.0';
    
    // Group by type for pie chart
    const typeCount = filteredTasks.reduce((acc: any, t) => {
      acc[t.type] = (acc[t.type] || 0) + 1;
      return acc;
    }, {});
    const pieData = Object.entries(typeCount).map(([name, value]) => ({ name, value }));

    // Group by date for line chart (last 7 days)
    const dateCount = filteredTasks.reduce((acc: any, t) => {
      const date = new Date(t.createdAt).toLocaleDateString('ar-EG');
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
    const lineData = Object.entries(dateCount).map(([date, count]) => ({ date, count })).slice(-7);

    return { total, avgDuration, avgRating, pieData, lineData };
  }, [filteredTasks]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="إجمالي المهام" value={stats.total} icon={<CheckCircle2 />} color="bg-indigo-500" />
        <StatCard title="متوسط الوقت (دقيقة)" value={stats.avgDuration} icon={<Clock />} color="bg-purple-500" />
        <StatCard title="متوسط التقييم" value={stats.avgRating} icon={<Star />} color="bg-amber-500" />
        <StatCard title="معدل النمو" value="+12%" icon={<TrendingUp />} color="bg-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Distribution */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">توزيع أنواع المهام</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Trend */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">نشاط المهام الأسبوعي</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.lineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Performance Insights */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-8 rounded-3xl text-white">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h3 className="text-2xl font-bold mb-2">هل تريد نظرة أعمق؟</h3>
            <p className="text-indigo-100 opacity-90 max-w-xl">
              يمكنك زيارة صفحة التحليلات الذكية للحصول على توقعات مدعومة بالذكاء الاصطناعي حول عبء العمل وتوصيات لزيادة الإنتاجية بناءً على تاريخ مهامك.
            </p>
          </div>
          <button className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors">
            استكشاف التحليلات
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center group hover:shadow-md transition-shadow">
    <div className={`${color} p-4 rounded-2xl text-white mr-4 shadow-lg ring-4 ring-gray-50`}>
      {/* Fix: Verify the icon is a valid React element and cast to any to allow dynamic prop injection for 'size' */}
      {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 24 }) : icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h4 className="text-2xl font-bold text-gray-800">{value}</h4>
    </div>
  </div>
);

export default Dashboard;
