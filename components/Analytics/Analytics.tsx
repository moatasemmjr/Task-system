
import React, { useState, useEffect } from 'react';
import { Task } from '../../types';
import { getSmartInsights } from '../../services/geminiService';
import { Sparkles, BrainCircuit, RefreshCw, Lightbulb } from 'lucide-react';

interface AnalyticsProps {
  tasks: Task[];
}

const Analytics: React.FC<AnalyticsProps> = ({ tasks }) => {
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchInsights = async () => {
    if (tasks.length === 0) {
      setInsights('يرجى إضافة بعض المهام أولاً للحصول على تحليلات ذكية.');
      return;
    }
    setLoading(true);
    const result = await getSmartInsights(tasks);
    setInsights(result || '');
    setLoading(false);
  };

  useEffect(() => {
    fetchInsights();
  }, [tasks.length]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600 animate-pulse">
          <BrainCircuit size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">التحليلات الذكية</h2>
        <p className="text-gray-500 max-w-lg mx-auto mb-8">
          نقوم باستخدام تقنيات الذكاء الاصطناعي (Gemini) لتحليل بياناتك وتقديم توصيات مخصصة وتوقعات مستقبلية لمساعدتك في التخطيط الأفضل.
        </p>
        
        <button 
          onClick={fetchInsights}
          disabled={loading}
          className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold flex items-center mx-auto hover:bg-indigo-700 transition-all disabled:opacity-50"
        >
          {loading ? <RefreshCw className="animate-spin ml-2" size={20} /> : <Sparkles className="ml-2" size={20} />}
          {loading ? 'جاري التحليل...' : 'تحديث التحليلات'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 min-h-[400px]">
          <div className="flex items-center mb-6">
            <Lightbulb size={24} className="text-amber-500 ml-2" />
            <h3 className="text-xl font-bold text-gray-800">تقرير الذكاء الاصطناعي</h3>
          </div>
          
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-3/4"></div>
              <div className="h-4 bg-gray-100 rounded w-5/6"></div>
              <div className="h-4 bg-gray-100 rounded w-1/2"></div>
              <div className="h-4 bg-gray-100 rounded w-2/3"></div>
            </div>
          ) : (
            <div className="prose prose-indigo max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
              {insights || 'لا توجد بيانات كافية حالياً.'}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
            <h4 className="font-bold text-indigo-800 mb-4">مؤشرات الأداء (KPIs)</h4>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl shadow-sm">
                <p className="text-xs text-gray-500 mb-1">نسبة المهام المنجزة في الوقت المحدد</p>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold text-indigo-600">92%</span>
                  <span className="text-xs text-emerald-500 font-bold">↑ 4%</span>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm">
                <p className="text-xs text-gray-500 mb-1">معدل التكرار للمهام التقنية</p>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold text-indigo-600">15%</span>
                  <span className="text-xs text-red-500 font-bold">↓ 2%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
            <h4 className="font-bold text-emerald-800 mb-2">توقع الضغط</h4>
            <p className="text-sm text-emerald-700">
              بناءً على النماذج السابقة، يتوقع النظام زيادة في مهام "تفعيل البريد" بنسبة 30% خلال الأسبوع الأول من الشهر القادم.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
