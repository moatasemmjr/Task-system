
import React from 'react';
import { User } from '../../types';
import { NAV_ITEMS } from '../../constants';
import { Bell, User as UserIcon } from 'lucide-react';

interface HeaderProps {
  user: User;
  activeTab: string;
}

const Header: React.FC<HeaderProps> = ({ user, activeTab }) => {
  const currentNavItem = NAV_ITEMS.find(item => item.id === activeTab);

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
      <div className="flex items-center">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <span className="ml-2 text-indigo-600">{currentNavItem?.icon}</span>
          {currentNavItem?.label}
        </h2>
      </div>

      <div className="flex items-center space-x-4 space-x-reverse">
        <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center bg-gray-50 border border-gray-100 rounded-full px-3 py-1.5">
          <div className="text-left ml-3 hidden sm:block">
            <p className="text-sm font-semibold text-gray-900 leading-none">{user.username}</p>
            <p className="text-xs text-indigo-600 font-medium">{user.role}</p>
          </div>
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 ring-2 ring-indigo-50">
            <UserIcon size={18} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
