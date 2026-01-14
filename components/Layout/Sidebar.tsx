
import React from 'react';
import { NAV_ITEMS } from '../../constants';
import { UserRole } from '../../types';
import { LogOut, ChevronLeft } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, userRole, onLogout }) => {
  const filteredNavItems = NAV_ITEMS.filter(item => item.roles.includes(userRole));

  return (
    <aside className="w-64 bg-indigo-900 text-white flex-shrink-0 flex flex-col h-screen sticky top-0 hidden md:flex">
      <div className="p-6 flex items-center justify-center border-b border-indigo-800">
        <div className="bg-indigo-500 p-2 rounded-lg mr-2">
          <ChevronLeft className="text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">نظام المهام</h1>
      </div>
      
      <nav className="flex-1 mt-6 px-4 space-y-1">
        {filteredNavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
              activeTab === item.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
                : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
            }`}
          >
            <span className={`ml-3 ${activeTab === item.id ? 'text-white' : 'text-indigo-400 group-hover:text-indigo-200'}`}>
              {item.icon}
            </span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-indigo-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center px-4 py-3 text-red-300 hover:bg-red-900/30 hover:text-red-100 rounded-xl transition-colors group"
        >
          <LogOut size={20} className="ml-3 text-red-400 group-hover:text-red-300" />
          <span className="font-medium">تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
