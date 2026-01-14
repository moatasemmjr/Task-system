
import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { LogIn, UserPlus } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
  onGoToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onGoToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const savedUsersStr = localStorage.getItem('users');
    const savedUsers: User[] = savedUsersStr ? JSON.parse(savedUsersStr) : [];
    
    const foundUser = savedUsers.find(u => u.username === username && u.password === password);
    
    if (foundUser) {
      onLogin(foundUser);
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-4xl flex flex-col md:flex-row">
        <div className="bg-indigo-600 text-white p-12 md:w-5/12 flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-6">مرحباً بك مجدداً</h1>
          <p className="text-indigo-100 leading-relaxed mb-8">
            قم بتسجيل الدخول للوصول إلى نظام توثيق المهام وإدارة التقارير والإحصائيات الخاصة بك.
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-2 h-2 bg-indigo-300 rounded-full"></div>
              <p className="text-sm">توثيق سريع للمهام</p>
            </div>
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-2 h-2 bg-indigo-300 rounded-full"></div>
              <p className="text-sm">تحليلات ذكية بالذكاء الاصطناعي</p>
            </div>
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-2 h-2 bg-indigo-300 rounded-full"></div>
              <p className="text-sm">تقارير مفصلة</p>
            </div>
          </div>
        </div>

        <div className="p-12 md:w-7/12">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
              <LogIn size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">تسجيل الدخول</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">اسم المستخدم</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                placeholder="أدخل اسم المستخدم"
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
                placeholder="••••••••"
                required
              />
            </div>
            
            {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}
            
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-600/30"
            >
              دخول
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={onGoToRegister}
              className="text-indigo-600 font-semibold flex items-center justify-center mx-auto hover:underline"
            >
              <UserPlus size={18} className="ml-2" />
              إنشاء حساب جديد
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
