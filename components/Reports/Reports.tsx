import React, { useState, useMemo } from 'react';
import { Task, User } from '../../types';
import { TASK_TYPES } from '../../constants';
import { FileDown, Search, Filter, Download } from 'lucide-react';

interface ReportsProps {
  tasks: Task[];
  users: User[];
}

const Reports: React.FC<ReportsProps> = ({ tasks, users }) => {
  const [dateFilter, setDateFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const typeMatch = typeFilter === 'all' || task.type === typeFilter;
      const userMatch = userFilter === 'all' || task.userId === userFilter;
      
      let dateMatch = true;
      const taskDate = new Date(task.createdAt);
      const now = new Date();
      
      if (dateFilter === 'daily') {
        dateMatch = taskDate.toDateString() === now.toDateString();
      } else if (dateFilter === 'weekly') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateMatch = taskDate >= weekAgo;
      } else if (dateFilter === 'monthly') {
        dateMatch = taskDate.getMonth() === now.getMonth() && taskDate.getFullYear() === now.getFullYear();
      }
      
      return typeMatch && userMatch && dateMatch;
    });
  }, [tasks, dateFilter, typeFilter, userFilter]);

  // --- التحسين الأساسي لاستخراج التقارير بالعربي ---
  const exportData = () => {
    // 1. تعريف العناوين
    const headers = ["نوع المهمة", "الطالب", "المدة (د)", "التاريخ", "المسؤول", "التقييم"];

    // 2. تجهيز البيانات وتنسيق التاريخ والعدم
    const rows = filteredTasks.map(t => [
      t.type,
      t.studentName || 'غير محدد',
      t.duration,
      new Date(t.createdAt).toLocaleDateString('ar-EG'),
      t.username,
      t.rating || 'بدون تقييم'
    ]);

    // 3. تحويل البيانات إلى نص CSV مع الفصل بفاصلة
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(",")) // وضع علامات تنصيص لتجنب مشاكل الفواصل
      .join("\n");

    // 4. السحر: إضافة UTF-8 BOM ليظهر العربي بوضوح في Excel
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // 5. إنشاء الرابط وتحميل الملف
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `تقرير_${dateFilter}_${new Date().toLocaleDateString('ar-EG')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6" dir="rtl"> {/* التأكد من اتجاه الصفحة عربي */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <Filter size={20} className="ml-2 text-indigo-600" />
            فلترة التقارير
          </h3>
          <div className="flex gap-2">
            <button 
              onClick={exportData}
              className="flex items-center bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-700 transition-colors"
            >
              <FileDown size={18} className="ml-2" /> تصدير Excel (عربي)
            </button>
            <button 
              onClick={() => window.print()} // خيار بديل وسريع لتصدير PDF حالياً
              className="flex items-center bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-700 transition-colors"
            >
              <Download size={18} className="ml-2" /> طباعة تقرير
            </button>
          </div>
        </div>

        {/* أدوات الفلترة */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 mr-2">الفترة الزمنية</label>
            <select 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">كل الأوقات</option>
              <option value="daily">اليوم</option>
              <option value="weekly">هذا الأسبوع</option>
              <option value="monthly">هذا الشهر</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 mr-2">نوع المهمة</label>
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">كل الأنواع</option>
              {TASK_TYPES.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 mr-2">المستخدم</label>
            <select 
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">كل المستخدمين</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* الجدول المعروض */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 bg-gray-50 border-b border-gray-100 flex items-center">
          <Search size={18} className="ml-2 text-gray-400" />
          <p className="text-sm font-bold text-gray-600">نتائج البحث: {filteredTasks.length} سجل</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead>
              <tr className="bg-white border-b border-gray-100">
                <th className="py-4 px-6 font-bold text-gray-500">التاريخ</th>
                <th className="py-4 px-6 font-bold text-gray-500">المهمة</th>
                <th className="py-4 px-6 font-bold text-gray-500">المسؤول</th>
                <th className="py-4 px-6 font-bold text-gray-500">المدة</th>
                <th className="py-4 px-6 font-bold text-gray-500">التقييم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTasks.map(t => (
                <tr key={t.id} className="hover:bg-indigo-50/30 transition-colors">
                  <td className="py-4 px-6 text-gray-600">{new Date(t.createdAt).toLocaleDateString('ar-EG')}</td>
                  <td className="py-4 px-6 font-bold text-gray-800">{t.type}</td>
                  <td className="py-4 px-6 text-gray-600">{t.username}</td>
                  <td className="py-4 px-6 text-indigo-600 font-bold">{t.duration} د</td>
                  <td className="py-4 px-6 font-bold text-amber-500">{t.rating || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;