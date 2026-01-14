
import React, { useMemo, useState, useEffect } from 'react';
import { Task } from '../../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Cell, PieChart, Pie, Legend
} from 'recharts';
import { PhoneCall, Users, Clock, Zap, PhoneForwarded, Database, Globe, RefreshCw, AlertTriangle, ExternalLink } from 'lucide-react';

interface CallCenterStatsProps {
  tasks: Task[];
}

const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#2563eb', '#1d4ed8'];

const CallCenterStats: React.FC<CallCenterStatsProps> = ({ tasks }) => {
  const [sourceType, setSourceType] = useState<'local' | 'google_sheet'>('local');
  const [sheetUrl, setSheetUrl] = useState(localStorage.getItem('cc_sheet_url') || '');
  const [sheetData, setSheetData] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // جلب البيانات من Google Sheets
  const fetchSheetData = async () => {
    if (!sheetUrl) {
      setError('يرجى إدخال رابط CSV الخاص بجوجل شيت');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // الرابط يجب أن يكون بصيغة export?format=csv
      let fetchUrl = sheetUrl;
      if (sheetUrl.includes('/edit')) {
        fetchUrl = sheetUrl.replace(/\/edit.*$/, '/export?format=csv');
      }

      const response = await fetch(fetchUrl);
      const csvText = await response.text();
      
      const lines = csvText.split('\n');
      const headers = lines[0].split(',');
      
      const formattedData: Task[] = lines.slice(1).filter(line => line.trim()).map((line, index) => {
        const values = line.split(',');
        // نفترض ترتيب الأعمدة: اسم الطالب، النوع، الوصف، المدة، التاريخ، المستخدم
        return {
          id: `sheet-${index}`,
          studentName: values[0]?.replace(/"/g, ''),
          type: values[1]?.replace(/"/g, '') || 'كول سنتر',
          description: values[2]?.replace(/"/g, '') || '',
          duration: parseInt(values[3]) || 15,
          createdAt: values[4]?.replace(/"/g, '') || new Date().toISOString(),
          userId: 'remote',
          username: values[5]?.replace(/"/g, '') || 'موظف عن بعد'
        };
      });

      setSheetData(formattedData);
      localStorage.setItem('cc_sheet_url', sheetUrl);
    } catch (err) {
      setError('فشل جلب البيانات. تأكد من أن الملف "منشور على الويب" بصيغة CSV');
    } finally {
      setLoading(false);
    }
  };

  // اختيار مصدر البيانات النشط
  const activeTasks = useMemo(() => {
    if (sourceType === 'local') {
      return tasks.filter(t => t.type === 'كول سنتر');
    }
    return sheetData;
  }, [sourceType, tasks, sheetData]);

  const stats = useMemo(() => {
    const totalCalls = activeTasks.length;
    const avgCallDuration = totalCalls ? Math.round(activeTasks.reduce((acc, t) => acc + t.duration, 0) / totalCalls) : 0;
    
    const userPerformance = activeTasks.reduce((acc: any, t) => {
      acc[t.username] = (acc[t.username] || 0) + 1;
      return acc;
    }, {});
    const performanceData = Object.entries(userPerformance).map(([name, calls]) => ({ name, calls }));

    const hourlyDistribution = activeTasks.reduce((acc: any, t) => {
      const date = new Date(t.createdAt);
      if (!isNaN(date.getTime())) {
        const hour = date.getHours();
        const label = `${hour}:00`;
        acc[label] = (acc[label] || 0) + 1;
      }
      return acc;
    }, {});
    const hourlyData = Object.entries(hourlyDistribution)
      .map(([hour, count]) => ({ hour, count }))
      .sort((a, b) => parseInt(a.hour) - parseInt(b.hour));

    const topics = { 'تقني': 0, 'استفسار عام': 0, 'شكاوى': 0, 'أخرى': 0 };
    activeTasks.forEach(t => {
      const desc = (t.description || "").toLowerCase();
      if (desc.includes('مشكلة') || desc.includes('عطل')) topics['تقني']++;
      else if (desc.includes('كيف') || desc.includes('متى')) topics['استفسار عام']++;
      else if (desc.includes('شكوى') || desc.includes('بطيء')) topics['شكاوى']++;
      else topics['أخرى']++;
    });
    const topicData = Object.entries(topics).map(([name, value]) => ({ name, value }));

    return { totalCalls, avgCallDuration, performanceData, hourlyData, topicData };
  }, [activeTasks]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Data Source Selector */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className={`p-3 rounded-2xl transition-colors ${sourceType === 'local' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400 cursor-pointer'}`} onClick={() => setSourceType('local')}>
              <Database size={20} />
            </div>
            <div className={`p-3 rounded-2xl transition-colors ${sourceType === 'google_sheet' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400 cursor-pointer'}`} onClick={() => setSourceType('google_sheet')}>
              <Globe size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">مصدر بيانات الكول سنتر</h3>
              <p className="text-xs text-gray-400">اختر جلب البيانات من النظام المحلي أو Google Sheets</p>
            </div>
          </div>

          {sourceType === 'google_sheet' && (
            <div className="flex-1 max-w-xl flex items-center gap-3">
              <input 
                type="text" 
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                placeholder="رابط Google Sheet (CSV)..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none transition-all text-sm"
              />
              <button 
                onClick={fetchSheetData}
                disabled={loading}
                className="bg-emerald-600 text-white p-2.5 rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-50"
              >
                {loading ? <RefreshCw size={20} className="animate-spin" /> : <RefreshCw size={20} />}
              </button>
            </div>
          )}
        </div>
        
        {sourceType === 'google_sheet' && (
          <div className="mt-4 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start">
            <AlertTriangle size={18} className="text-blue-600 ml-3 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-700 leading-relaxed">
              <strong>تعليمات:</strong> تأكد من أن ملف جوجل شيت "منشور على الويب" بصيغة CSV. 
              الترتيب المطلوب للأعمدة: (الاسم، النوع، الوصف، المدة، التاريخ، الموظف).
              <a href="https://support.google.com/docs/answer/183965" target="_blank" className="flex items-center mt-1 font-bold underline">
                شرح النشر على الويب <ExternalLink size={12} className="mr-1" />
              </a>
            </div>
          </div>
        )}
        {error && <p className="mt-3 text-red-500 text-xs font-bold mr-2">{error}</p>}
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-blue-50 flex items-center">
          <div className="bg-blue-500 p-4 rounded-2xl text-white ml-4 shadow-lg shadow-blue-200">
            <PhoneCall size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 mb-1">إجمالي المكالمات</p>
            <h4 className="text-2xl font-black text-gray-800">{stats.totalCalls}</h4>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-blue-50 flex items-center">
          <div className="bg-sky-500 p-4 rounded-2xl text-white ml-4 shadow-lg shadow-sky-200">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 mb-1">متوسط زمن الاستجابة</p>
            <h4 className="text-2xl font-black text-gray-800">{stats.avgCallDuration} دقيقة</h4>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-blue-50 flex items-center">
          <div className="bg-indigo-500 p-4 rounded-2xl text-white ml-4 shadow-lg shadow-indigo-200">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 mb-1">عدد الموظفين النشطين</p>
            <h4 className="text-2xl font-black text-gray-800">{stats.performanceData.length}</h4>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-blue-50 flex items-center">
          <div className="bg-emerald-500 p-4 rounded-2xl text-white ml-4 shadow-lg shadow-emerald-200">
            <Zap size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 mb-1">حالة البيانات</p>
            <h4 className="text-xl font-bold text-gray-800">{sourceType === 'local' ? 'نظام محلي' : 'جوجل شيت'}</h4>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* أداء الفريق */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
            <PhoneForwarded size={20} className="ml-2 text-blue-600" />
            أداء موظفي الكول سنتر
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.performanceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="calls" fill="#3b82f6" radius={[0, 10, 10, 0]} barSize={30} label={{ position: 'right', fontSize: 12, fontWeight: 'bold' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* أوقات الذروة */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
            <Clock size={20} className="ml-2 text-blue-600" />
            توزيع المكالمات خلال اليوم
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.hourlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{borderRadius: '12px'}} />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={4} dot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* تصنيف الاستفسارات */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-800 mb-6">تحليل نوعية الاستفسارات الواردة من المصدر</h3>
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.topicData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.topicData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="middle" align="right" layout="vertical" />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 mt-4 md:mt-0 px-6">
              <div className="space-y-4">
                {stats.topicData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="font-bold text-gray-700">{item.name}</span>
                    <span className="bg-white px-3 py-1 rounded-lg text-blue-600 font-black shadow-sm">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallCenterStats;
