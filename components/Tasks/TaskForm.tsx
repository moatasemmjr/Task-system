
import React, { useState } from 'react';
import { User, Task } from '../../types';
import { TASK_TYPES } from '../../constants';
import { Save, Send } from 'lucide-react';

interface TaskFormProps {
  user: User;
  onTaskSubmit: (task: Task) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ user, onTaskSubmit }) => {
  const [studentName, setStudentName] = useState('');
  const [type, setType] = useState(TASK_TYPES[0].name);
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState<number>(15);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: Task = {
      id: Date.now().toString(),
      studentName,
      type,
      description,
      duration,
      createdAt: new Date().toISOString(),
      userId: user.id,
      username: user.username
    };
    onTaskSubmit(newTask);
    setStudentName('');
    setDescription('');
    setDuration(15);
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="bg-indigo-100 p-2 rounded-lg ml-3 text-indigo-600">
          <Send size={20} />
        </span>
        توثيق مهمة جديدة
      </h3>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">اسم الطالب (اختياري)</label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
              placeholder="اسم الطالب"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">نوع المهمة</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TASK_TYPES.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.name)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                    type === t.name 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-600' 
                      : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                  }`}
                >
                  <span className="mb-1">{t.icon}</span>
                  <span className="text-xs font-bold">{t.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">الوقت المستغرق (بالدقائق)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">وصف المهمة</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none"
              placeholder="أدخل تفاصيل المهمة..."
              rows={4}
              required
            ></textarea>
          </div>
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="flex items-center space-x-2 space-x-reverse bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-600/30"
          >
            <Save size={20} />
            <span>حفظ المهمة</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
