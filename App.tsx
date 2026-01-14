
import React, { useState, useEffect, useCallback } from 'react';
import { User, UserRole, Task, Attendance } from './types';
import { NAV_ITEMS } from './constants';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import TaskForm from './components/Tasks/TaskForm';
import TaskList from './components/Tasks/TaskList';
import TaskImport from './components/Tasks/TaskImport';
import Reports from './components/Reports/Reports';
import Analytics from './components/Analytics/Analytics';
import UserManagement from './components/Admin/UserManagement';
import KnowledgeBase from './components/Knowledge/KnowledgeBase';
import AttendanceTracking from './components/Attendance/AttendanceTracking';
import CallCenterStats from './components/CallCenter/CallCenterStats';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isRegistering, setIsRegistering] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Load initial data
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) setUser(JSON.parse(savedUser));

    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) setTasks(JSON.parse(savedTasks));

    const savedAttendance = localStorage.getItem('attendance');
    if (savedAttendance) setAttendance(JSON.parse(savedAttendance));

    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      const admin: User = { id: '1', username: 'admin', role: UserRole.ADMIN, password: 'password' };
      localStorage.setItem('users', JSON.stringify([admin]));
      setUsers([admin]);
    }
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const addTask = (task: Task) => {
    const newTasks = [task, ...tasks];
    setTasks(newTasks);
    localStorage.setItem('tasks', JSON.stringify(newTasks));
  };

  const addBulkTasks = (newBulkTasks: Task[]) => {
    const updatedTasks = [...newBulkTasks, ...tasks];
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    alert(`تم استيراد ${newBulkTasks.length} مهمة بنجاح!`);
  };

  const updateTask = (updatedTask: Task) => {
    const newTasks = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
    setTasks(newTasks);
    localStorage.setItem('tasks', JSON.stringify(newTasks));
  };

  const deleteTask = (taskId: string) => {
    const newTasks = tasks.filter(t => t.id !== taskId);
    setTasks(newTasks);
    localStorage.setItem('tasks', JSON.stringify(newTasks));
  };

  const addAttendanceRecord = (record: Attendance) => {
    const newRecords = [record, ...attendance];
    setAttendance(newRecords);
    localStorage.setItem('attendance', JSON.stringify(newRecords));
  };

  const deleteAttendanceRecord = (id: string) => {
    const newRecords = attendance.filter(r => r.id !== id);
    setAttendance(newRecords);
    localStorage.setItem('attendance', JSON.stringify(newRecords));
  };

  const handleRegister = (newUser: User) => {
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setIsRegistering(false);
    alert('تم إنشاء الحساب بنجاح. يمكنك الآن تسجيل الدخول.');
  };

  if (!user) {
    return isRegistering ? (
      <Register onRegister={handleRegister} onBackToLogin={() => setIsRegistering(false)} />
    ) : (
      <Login onLogin={handleLogin} onGoToRegister={() => setIsRegistering(true)} />
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard tasks={tasks} user={user} />;
      case 'attendance':
        return (
          <AttendanceTracking 
            user={user} 
            attendanceRecords={attendance} 
            onAddRecord={addAttendanceRecord}
            onDeleteRecord={deleteAttendanceRecord}
          />
        );
      case 'callCenter':
        return <CallCenterStats tasks={tasks} />;
      case 'newTask':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <TaskForm user={user} onTaskSubmit={addTask} />
              </div>
              <div className="lg:col-span-1">
                <TaskImport user={user} onImportTasks={addBulkTasks} />
              </div>
            </div>
            <TaskList tasks={tasks} user={user} onEdit={updateTask} onDelete={deleteTask} />
          </div>
        );
      case 'reports':
        return <Reports tasks={tasks} users={users} />;
      case 'analytics':
        return <Analytics tasks={tasks} />;
      case 'users':
        return <UserManagement users={users} onUpdateUsers={(newUsers) => {
          setUsers(newUsers);
          localStorage.setItem('users', JSON.stringify(newUsers));
        }} />;
      case 'knowledge':
        return <KnowledgeBase />;
      default:
        return <Dashboard tasks={tasks} user={user} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userRole={user.role} 
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header user={user} activeTab={activeTab} />
        <main className="p-4 md:p-8 flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
