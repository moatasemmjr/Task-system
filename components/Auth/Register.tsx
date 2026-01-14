
import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { UserPlus, ArrowRight } from 'lucide-react';

interface RegisterProps {
  onRegister: (user: User) => void;
  onBackToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister, onBackToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.USER);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: Date.now().toString(),
      username,
      password,
      role
    };
    onRegister(newUser);
  };

  return (
    <div className="min-h-screen bg-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-md p-8 md:p-12">
        <button onClick={onBackToLogin} className="flex items-center text-indigo-600 mb-6 hover:underline font-medium">
          <ArrowRight size={18} className="ml-1" /> العودة للدخول
        </button>
        
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
            <UserPlus size={32} />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">إنشاء حساب جديد</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">اسم المستخدم</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">نوع الحساب</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all appearance-none bg-no-repeat bg-[right_1rem_center]"
              style={{backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236366f1'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundSize: '1.5em'}}
            >
              <option value={UserRole.USER}>مستخدم عادي</option>
              <option value={UserRole.SUPERVISOR}>مشرف</option>
              <option value={UserRole.ADMIN}>مدير نظام</option>
            </select>
          </div>
          
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-600/30"
          >
            تسجيل
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
