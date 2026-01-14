
import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { Shield, Trash2, UserPlus, ShieldCheck, UserX } from 'lucide-react';

interface UserManagementProps {
  users: User[];
  onUpdateUsers: (users: User[]) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, onUpdateUsers }) => {
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<UserRole>(UserRole.USER);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: Date.now().toString(),
      username: newUsername,
      password: newPassword,
      role: newRole
    };
    onUpdateUsers([...users, newUser]);
    setNewUsername('');
    setNewPassword('');
    setShowAddUser(false);
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      onUpdateUsers(users.filter(u => u.id !== id));
    }
  };

  const handleChangeRole = (id: string, role: UserRole) => {
    onUpdateUsers(users.map(u => u.id === id ? { ...u, role } : u));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-800">إدارة المستخدمين</h3>
        <button 
          onClick={() => setShowAddUser(true)}
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold flex items-center hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/30"
        >
          <UserPlus size={18} className="ml-2" /> إضافة مستخدم
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-4 px-6 text-right text-xs font-bold text-gray-500 uppercase">اسم المستخدم</th>
              <th className="py-4 px-6 text-right text-xs font-bold text-gray-500 uppercase">الصلاحية</th>
              <th className="py-4 px-6 text-center text-xs font-bold text-gray-500 uppercase">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6 font-bold text-gray-800">{u.username}</td>
                <td className="py-4 px-6">
                  <select 
                    value={u.role}
                    onChange={(e) => handleChangeRole(u.id, e.target.value as UserRole)}
                    className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-sm font-bold border-none outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value={UserRole.ADMIN}>مدير نظام</option>
                    <option value={UserRole.SUPERVISOR}>مشرف</option>
                    <option value={UserRole.USER}>مستخدم عادي</option>
                  </select>
                </td>
                <td className="py-4 px-6 text-center">
                  <button 
                    onClick={() => handleDeleteUser(u.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full animate-in zoom-in-95 duration-200">
            <h4 className="text-xl font-bold mb-6 flex items-center">
              <UserPlus size={24} className="ml-2 text-indigo-600" />
              إضافة مستخدم جديد
            </h4>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">اسم المستخدم</label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">كلمة المرور</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">الصلاحية</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                >
                  <option value={UserRole.USER}>مستخدم عادي</option>
                  <option value={UserRole.SUPERVISOR}>مشرف</option>
                  <option value={UserRole.ADMIN}>مدير نظام</option>
                </select>
              </div>
              <div className="flex space-x-3 space-x-reverse pt-4">
                <button type="submit" className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold">حفظ</button>
                <button type="button" onClick={() => setShowAddUser(false)} className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
