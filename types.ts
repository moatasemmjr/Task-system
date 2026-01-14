
export enum UserRole {
  ADMIN = 'مدير النظام',
  SUPERVISOR = 'مشرف',
  USER = 'مستخدم عادي'
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  password?: string;
}

export interface Task {
  id: string;
  studentName?: string;
  type: string;
  description: string;
  duration: number; // in minutes
  createdAt: string; // ISO string
  userId: string;
  username: string;
  rating?: number;
  ratingComment?: string;
}

export interface Attendance {
  id: string;
  studentId?: string; // University ID
  studentName: string;
  shift: string; // "9-11", "11-1", "1-3"
  date: string; // ISO date
  recordedBy: string; // User ID
  recordedByName: string;
}

export interface TaskType {
  id: string;
  name: string;
}
