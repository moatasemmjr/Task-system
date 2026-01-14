
import React, { useState } from 'react';
import { Task, User, UserRole } from '../../types';
import { Edit2, Trash2, Calendar, User as UserIcon, Star, CheckCircle } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  user: User;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, user, onEdit, onDelete }) => {
  const [ratingTarget, setRatingTarget] = useState<string | null>(null);
  const [stars, setStars] = useState(0);

  const filteredTasks = tasks.filter(t => 
    user.role === UserRole.ADMIN || user.role === UserRole.SUPERVISOR || t.userId === user.id
  );

  const isEditable = (createdAt: string) => {
    const taskDate = new Date(createdAt).toDateString();
    const today = new Date().toDateString();
    return taskDate === today;
  };

  const handleRatingSubmit = (task: Task) => {
    onEdit({ ...task, rating: stars });
    setRatingTarget(null);
    setStars(0);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800">المهام الأخيرة</h3>
        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
          إجمالي {filteredTasks.length} مهمة
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-right py-4 px-6 text-sm font-bold text-gray-500">المهمة</th>
              <th className="text-right py-4 px-6 text-sm font-bold text-gray-500">الطالب</th>
              <th className="text-right py-4 px-6 text-sm font-bold text-gray-500">المدة</th>
              <th className="text-right py-4 px-6 text-sm font-bold text-gray-500">التاريخ</th>
              <th className="text-right py-4 px-6 text-sm font-bold text-gray-500">المسؤول</th>
              <th className="text-right py-4 px-6 text-sm font-bold text-gray-500">التقييم</th>
              <th className="text-center py-4 px-6 text-sm font-bold text-gray-500">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-gray-400">لا توجد مهام حالياً</td>
              </tr>
            ) : (
              filteredTasks.map(task => (
                <tr key={task.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">{task.type}</span>
                      <span className="text-xs text-gray-500 truncate max-w-[200px]">{task.description}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-700">{task.studentName || '-'}</td>
                  <td className="py-4 px-6">
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-lg text-xs font-bold">
                      {task.duration} دقيقة
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar size={14} className="ml-1" />
                      {new Date(task.createdAt).toLocaleDateString('ar-EG')}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center text-xs text-gray-600">
                      <UserIcon size={14} className="ml-1" />
                      {task.username}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {task.rating ? (
                      <div className="flex items-center text-amber-500">
                        <Star size={16} fill="currentColor" />
                        <span className="mr-1 font-bold text-sm">{task.rating}</span>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setRatingTarget(task.id)}
                        className="text-gray-400 hover:text-amber-500 transition-colors"
                      >
                        <Star size={18} />
                      </button>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center space-x-2 space-x-reverse">
                      {isEditable(task.createdAt) ? (
                        <>
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => onDelete(task.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400">مؤرشف</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Rating Modal (Simple overlay) */}
      {ratingTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center">
            <h4 className="text-xl font-bold mb-4">تقييم الخدمة</h4>
            <div className="flex justify-center space-x-2 space-x-reverse mb-6">
              {[1, 2, 3, 4, 5].map(i => (
                <Star
                  key={i}
                  size={32}
                  className={`cursor-pointer transition-all ${i <= stars ? 'text-amber-500 fill-amber-500 scale-110' : 'text-gray-200'}`}
                  onClick={() => setStars(i)}
                />
              ))}
            </div>
            <div className="flex space-x-3 space-x-reverse">
              <button 
                onClick={() => handleRatingSubmit(tasks.find(t => t.id === ratingTarget)!)}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold"
              >
                تأكيد
              </button>
              <button 
                onClick={() => setRatingTarget(null)}
                className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
