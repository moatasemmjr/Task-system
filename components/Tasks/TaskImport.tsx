
import React, { useState } from 'react';
import { User, Task } from '../../types';
import { FileSpreadsheet, Upload, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

interface TaskImportProps {
  user: User;
  onImportTasks: (tasks: Task[]) => void;
}

const TaskImport: React.FC<TaskImportProps> = ({ user, onImportTasks }) => {
  const [sheetUrl, setSheetUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleImport = async () => {
    if (!sheetUrl) {
      setError('يرجى إدخال رابط CSV الخاص بملف Google Sheet');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // تحويل الرابط إلى صيغة التصدير كـ CSV
      let fetchUrl = sheetUrl;
      if (sheetUrl.includes('/edit')) {
        fetchUrl = sheetUrl.replace(/\/edit.*$/, '/export?format=csv');
      }

      const response = await fetch(fetchUrl);
      if (!response.ok) throw new Error('فشل الوصول للملف');
      
      const csvText = await response.text();
      const lines = csvText.split('\n');
      
      if (lines.length <= 1) {
        throw new Error('الملف فارغ أو غير متوافق');
      }

      const newTasks: Task[] = lines.slice(1)
        .filter(line => line.trim() !== '')
        .map((line, index) => {
          // التعامل مع الفواصل داخل النصوص (مثل "اسم، رباعي")
          const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          
          return {
            id: `import-${Date.now()}-${index}`,
            studentName: values[0]?.replace(/"/g, '').trim(),
            type: values[1]?.replace(/"/g, '').trim() || 'أخرى',
            description: values[2]?.replace(/"/g, '').trim() || 'استيراد جماعي',
            duration: parseInt(values[3]) || 15,
            createdAt: values[4]?.replace(/"/g, '').trim() || new Date().toISOString(),
            userId: user.id,
            username: user.username
          };
        });

      if (newTasks.length > 0) {
        onImportTasks(newTasks);
        setSuccess(true);
        setSheetUrl('');
      } else {
        throw new Error('لم يتم العثور على مهام صالحة في الملف');
      }
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء الاستيراد. تأكد من أن الملف "منشور على الويب" بصيغة CSV.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="flex items-center mb-6">
        <div className="bg-emerald-100 p-2 rounded-lg ml-3 text-emerald-600">
          <FileSpreadsheet size={20} />
        </div>
        <h3 className="text-lg font-bold text-gray-800">استيراد جماعي</h3>
      </div>

      <div className="space-y-4 flex-1">
        <p className="text-xs text-gray-500 leading-relaxed">
          يمكنك استيراد عشرات المهام دفعة واحدة عبر ربط ملف Google Sheet الخاص بك.
        </p>

        <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
          <p className="text-[10px] font-bold text-indigo-700 mb-2">تنسيق الأعمدة المطلوب:</p>
          <div className="grid grid-cols-2 gap-2 text-[9px] text-indigo-600">
            <span className="bg-white px-2 py-1 rounded border border-indigo-100">1. اسم الطالب</span>
            <span className="bg-white px-2 py-1 rounded border border-indigo-100">2. نوع المهمة</span>
            <span className="bg-white px-2 py-1 rounded border border-indigo-100">3. الوصف</span>
            <span className="bg-white px-2 py-1 rounded border border-indigo-100">4. المدة (د)</span>
            <span className="bg-white px-2 py-1 rounded border border-indigo-100">5. التاريخ</span>
          </div>
        </div>

        <div className="relative">
          <label className="block text-xs font-bold text-gray-400 mb-2 mr-1 uppercase">رابط Google Sheet (CSV)</label>
          <input
            type="text"
            value={sheetUrl}
            onChange={(e) => setSheetUrl(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none transition-all text-sm"
            placeholder="https://docs.google.com/spreadsheets/d/..."
          />
        </div>

        {error && (
          <div className="flex items-center text-red-500 text-[10px] font-bold bg-red-50 p-3 rounded-xl">
            <AlertCircle size={14} className="ml-2" />
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center text-emerald-600 text-[10px] font-bold bg-emerald-50 p-3 rounded-xl">
            <CheckCircle2 size={14} className="ml-2" />
            تم الاستيراد بنجاح!
          </div>
        )}
      </div>

      <button
        onClick={handleImport}
        disabled={loading}
        className="mt-6 w-full flex items-center justify-center bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
      >
        {loading ? <RefreshCw size={18} className="animate-spin ml-2" /> : <Upload size={18} className="ml-2" />}
        بدء الاستيراد
      </button>
    </div>
  );
};

export default TaskImport;
