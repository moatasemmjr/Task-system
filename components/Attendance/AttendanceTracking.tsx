
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { User, Attendance } from '../../types';
import { SHIFTS } from '../../constants';
import { 
  UserCheck, 
  Search, 
  Clock, 
  Trash2, 
  Calendar, 
  UserPlus, 
  CheckCircle, 
  X,
  AlertCircle
} from 'lucide-react';

interface AttendanceTrackingProps {
  user: User;
  attendanceRecords: Attendance[];
  onAddRecord: (record: Attendance) => void;
  onDeleteRecord: (id: string) => void;
}

const AttendanceTracking: React.FC<AttendanceTrackingProps> = ({ 
  user, 
  attendanceRecords, 
  onAddRecord, 
  onDeleteRecord 
}) => {
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [selectedShift, setSelectedShift] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const suggestionRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // تحديد الفترة الحالية تلقائياً
  useEffect(() => {
    const hour = new Date().getHours();
    const currentShift = SHIFTS.find(s => hour >= s.start && hour < s.end);
    if (currentShift) {
      setSelectedShift(currentShift.label);
    } else {
      setSelectedShift(SHIFTS[0].label);
    }
  }, []);

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // استخراج قاعدة بيانات الطلاب الفريدة من السجلات
  const knownStudents = useMemo(() => {
    const studentsMap = new Map();
    // ترتيب السجلات من الأحدث للأقدم لضمان الحصول على أحدث صيغة للاسم
    [...attendanceRecords].reverse().forEach(r => {
      const key = (r.studentId || r.studentName).toLowerCase();
      if (!studentsMap.has(key)) {
        studentsMap.set(key, { id: r.studentId, name: r.studentName });
      }
    });
    return Array.from(studentsMap.values());
  }, [attendanceRecords]);

  // تصفية الاقتراحات
  const suggestions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return [];
    return knownStudents.filter(s => 
      s.name.toLowerCase().includes(term) || 
      (s.id && s.id.includes(term))
    ).slice(0, 6);
  }, [searchTerm, knownStudents]);

  // التحقق مما إذا كان الطالب مسجلاً اليوم في نفس الفترة
  const isAlreadyRecorded = useMemo(() => {
    const today = new Date().toDateString();
    return attendanceRecords.some(r => 
      new Date(r.date).toDateString() === today && 
      r.shift === selectedShift && 
      ((studentId && r.studentId === studentId) || (studentName && r.studentName === studentName))
    );
  }, [attendanceRecords, studentId, studentName, selectedShift]);

  const handleSelectStudent = (student: { id?: string, name: string }) => {
    setStudentId(student.id || '');
    setStudentName(student.name);
    setSearchTerm('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelectStudent(suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || isAlreadyRecorded) return;

    const newRecord: Attendance = {
      id: Date.now().toString(),
      studentId: studentId.trim() || undefined,
      studentName: studentName.trim(),
      shift: selectedShift,
      date: new Date().toISOString(),
      recordedBy: user.id,
      recordedByName: user.username
    };

    onAddRecord(newRecord);
    setStudentId('');
    setStudentName('');
    setSearchTerm('');
    searchInputRef.current?.focus();
  };

  const resetForm = () => {
    setStudentId('');
    setStudentName('');
    setSearchTerm('');
  };

  const todayRecords = useMemo(() => {
    const today = new Date().toDateString();
    return attendanceRecords.filter(r => new Date(r.date).toDateString() === today);
  }, [attendanceRecords]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Search & Registration Section */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <span className="bg-indigo-600 p-2 rounded-xl ml-3 text-white shadow-lg shadow-indigo-200">
              <UserPlus size={20} />
            </span>
            تسجيل حضور الطلاب الذكي
          </h3>
          <div className="flex items-center space-x-2 space-x-reverse bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
            <Calendar size={16} className="text-indigo-500" />
            <span className="text-sm font-bold text-gray-600">
              {new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Quick Search Panel */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative" ref={suggestionRef}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mr-1">البحث الذكي عن طالب</label>
                {searchTerm && (
                    <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-red-500 transition-colors">
                        <X size={14} />
                    </button>
                )}
              </div>
              <div className="relative group">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(true);
                    setSelectedIndex(-1);
                  }}
                  className="w-full pr-12 pl-4 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all font-bold text-gray-700 shadow-sm"
                  placeholder="الرقم الجامعي أو الاسم..."
                />
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-30 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-3 bg-indigo-50/50 border-b border-gray-50 flex items-center justify-between">
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">نتائج مطابقة</span>
                      <span className="text-[10px] text-gray-400">استخدم الأسهم ↕ للتنقل</span>
                  </div>
                  {suggestions.map((student, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectStudent(student)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between p-4 transition-all text-right border-b last:border-0 border-gray-50 group ${
                        selectedIndex === idx ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ml-3 transition-colors ${
                            selectedIndex === idx ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-600'
                        }`}>
                          {student.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className={`font-bold ${selectedIndex === idx ? 'text-white' : 'text-gray-800'}`}>{student.name}</span>
                          <span className={`text-[10px] ${selectedIndex === idx ? 'text-indigo-200' : 'text-gray-400'}`}>رقم: {student.id || 'غير متوفر'}</span>
                        </div>
                      </div>
                      <CheckCircle size={18} className={`transition-opacity ${selectedIndex === idx ? 'opacity-100 text-indigo-200' : 'opacity-0 group-hover:opacity-100 text-indigo-400'}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form Panel */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/30 p-6 rounded-3xl border-2 border-dashed border-gray-100 relative">
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-2 mr-1 uppercase">بيانات الطالب</label>
                <div className="space-y-3">
                    <input
                        type="text"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        className="w-full px-5 py-3.5 rounded-xl border border-white bg-white shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-mono"
                        placeholder="الرقم الجامعي..."
                    />
                    <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="w-full px-5 py-3.5 rounded-xl border border-white bg-white shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold"
                        placeholder="اسم الطالب الكامل..."
                        required
                    />
                </div>
              </div>
            </div>

            <div className="space-y-5 flex flex-col">
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-gray-400 mb-2 mr-1 uppercase">الفترة الزمنية</label>
                <select
                  value={selectedShift}
                  onChange={(e) => setSelectedShift(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-xl border border-white bg-white shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all appearance-none bg-no-repeat bg-[left_1.2rem_center] font-bold text-indigo-600"
                  style={{backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236366f1'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundSize: '1.4em'}}
                >
                  {SHIFTS.map(s => (
                    <option key={s.id} value={s.label}>{s.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-3 space-x-reverse">
                <button
                  type="submit"
                  disabled={isAlreadyRecorded || !studentName.trim()}
                  className={`flex-1 py-4 rounded-xl font-black text-white transition-all shadow-lg flex items-center justify-center ${
                    isAlreadyRecorded 
                        ? 'bg-amber-100 text-amber-600 shadow-none cursor-not-allowed border border-amber-200' 
                        : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-indigo-600/30'
                  }`}
                >
                  {isAlreadyRecorded ? (
                      <>
                        <AlertCircle size={20} className="ml-2" />
                        مسجل مسبقاً
                      </>
                  ) : (
                      <>
                        <UserCheck size={20} className="ml-2" />
                        تأكيد الحضور
                      </>
                  )}
                </button>
                {(studentName || studentId) && (
                    <button 
                        type="button" 
                        onClick={resetForm}
                        className="p-4 bg-white border border-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                        <Trash2 size={20} />
                    </button>
                )}
              </div>
            </div>
            
            {isAlreadyRecorded && (
                <div className="absolute inset-x-0 -bottom-4 flex justify-center animate-in slide-in-from-top-2">
                    <div className="bg-amber-600 text-white text-[10px] px-4 py-1.5 rounded-full font-black shadow-xl shadow-amber-600/20 flex items-center">
                        <AlertCircle size={12} className="ml-1.5" />
                        هذا الطالب تم تسجيل حضوره بالفعل لهذه الفترة اليوم
                    </div>
                </div>
            )}
          </form>
        </div>
      </div>

      {/* Today's Attendance Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center">
            <div className="bg-emerald-600 p-2.5 rounded-xl ml-4 text-white shadow-lg shadow-emerald-200">
              <CheckCircle size={20} />
            </div>
            <div>
                <h3 className="text-lg font-bold text-gray-800">سجل الحضور اليومي</h3>
                <p className="text-[10px] text-gray-400">مجموع الحضور الموثق حتى اللحظة</p>
            </div>
          </div>
          <div className="flex items-center bg-emerald-50 text-emerald-700 px-5 py-2 rounded-2xl ring-1 ring-emerald-100">
            <span className="text-xl font-black ml-1">{todayRecords.length}</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">طلاب</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="text-right py-5 px-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">الطالب المستفيد</th>
                <th className="text-right py-5 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">المعرف</th>
                <th className="text-right py-5 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">الفترة المسجلة</th>
                <th className="text-right py-5 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">الوقت الفعلي</th>
                <th className="text-center py-5 px-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">تحكم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {todayRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-200">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <Search size={40} className="opacity-20" />
                      </div>
                      <p className="font-black text-xl text-gray-300">السجل فارغ لليوم</p>
                      <p className="text-xs text-gray-400 mt-1">يمكنك البدء بالبحث عن اسم الطالب وتسجيله</p>
                    </div>
                  </td>
                </tr>
              ) : (
                todayRecords.map(record => (
                  <tr key={record.id} className="hover:bg-indigo-50/20 transition-all group border-transparent hover:border-indigo-100 border-l-4">
                    <td className="py-5 px-8">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500 font-black text-xs ml-4 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                          {record.studentName.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-gray-800 group-hover:text-indigo-700 transition-colors">{record.studentName}</span>
                            <span className="text-[10px] text-gray-400">بواسطة: {record.recordedByName}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                        <span className="px-3 py-1.5 bg-gray-50 text-gray-500 rounded-lg text-xs font-mono font-bold border border-gray-100">
                            {record.studentId || 'بدون رقم'}
                        </span>
                    </td>
                    <td className="py-5 px-6">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-[10px] font-black border border-indigo-100">
                        <Clock size={12} className="ml-1.5" />
                        {record.shift}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-700">
                                {new Date(record.date).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="text-[9px] text-gray-400">توقيت محلي</span>
                        </div>
                    </td>
                    <td className="py-5 px-8 text-center">
                      <button 
                        onClick={() => onDeleteRecord(record.id)}
                        className="p-3 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all opacity-40 group-hover:opacity-100"
                        title="حذف هذا السجل"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracking;
