
import React from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  BarChart3, 
  Users, 
  Settings, 
  HelpCircle,
  LogOut,
  Mail,
  Monitor,
  Wrench,
  BookOpen,
  UserCheck,
  PhoneCall,
  PieChart
} from 'lucide-react';

export const TASK_TYPES = [
  { id: '1', name: 'تفعيل بريد', icon: <Mail size={18} /> },
  { id: '2', name: 'كلاس روم', icon: <BookOpen size={18} /> },
  { id: '3', name: 'دعم فني', icon: <Wrench size={18} /> },
  { id: '4', name: 'تدريب', icon: <Monitor size={18} /> },
  { id: '6', name: 'كول سنتر', icon: <PhoneCall size={18} /> },
  { id: '5', name: 'أخرى', icon: <Settings size={18} /> },
];

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'لوحة التحكم', icon: <LayoutDashboard size={20} />, roles: ['مدير النظام', 'مشرف', 'مستخدم عادي'] },
  { id: 'attendance', label: 'تسجيل الحضور', icon: <UserCheck size={20} />, roles: ['مدير النظام', 'مشرف', 'مستخدم عادي'] },
  { id: 'callCenter', label: 'إحصائيات الكول سنتر', icon: <PhoneCall size={20} />, roles: ['مدير النظام', 'مشرف'] },
  { id: 'newTask', label: 'توثيق مهمة', icon: <PlusCircle size={20} />, roles: ['مدير النظام', 'مشرف', 'مستخدم عادي'] },
  { id: 'reports', label: 'التقارير', icon: <FileText size={20} />, roles: ['مدير النظام', 'مشرف'] },
  { id: 'analytics', label: 'تحليلات ذكية', icon: <BarChart3 size={20} />, roles: ['مدير النظام', 'مشرف'] },
  { id: 'users', label: 'المستخدمين', icon: <Users size={20} />, roles: ['مدير النظام'] },
  { id: 'knowledge', label: 'قاعدة المعرفة', icon: <HelpCircle size={20} />, roles: ['مدير النظام', 'مشرف', 'مستخدم عادي'] },
];

export const SHIFTS = [
  { id: 'shift1', label: '9:00 - 11:00', start: 9, end: 11 },
  { id: 'shift2', label: '11:00 - 1:00', start: 11, end: 13 },
  { id: 'shift3', label: '1:00 - 3:00', start: 13, end: 15 },
];
