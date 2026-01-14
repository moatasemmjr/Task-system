
import React, { useState } from 'react';
import { queryKnowledgeBase } from '../../services/geminiService';
import { Search, HelpCircle, Send, Book, Terminal, ShieldAlert } from 'lucide-react';

const KnowledgeBase: React.FC = () => {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    const result = await queryKnowledgeBase(query);
    setAnswer(result || '');
    setLoading(false);
  };

  const FAQS = [
    { q: "كيف أقوم بتفعيل بريد طالب؟", a: "توجه لصفحة المهام، اختر نوع المهمة 'تفعيل بريد' واملأ اسم الطالب وبياناته." },
    { q: "لماذا لا يمكنني حذف مهمة قديمة؟", a: "النظام يسمح بالتعديل والحذف فقط في نفس يوم إنشاء المهمة لضمان دقة التقارير وجودة البيانات." },
    { q: "كيف أستخرج تقريراً شهرياً؟", a: "من صفحة التقارير، اختر الفلتر الزمني 'هذا الشهر' ثم اضغط على زر 'تصدير Excel'." }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">قاعدة المعرفة الذكية</h2>
        <p className="text-gray-500">ابحث عن حلول للمشاكل الشائعة أو اطلب مساعدة الذكاء الاصطناعي</p>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
        <form onSubmit={handleQuery} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all text-lg shadow-inner"
            placeholder="اسأل الذكاء الاصطناعي... كيف أحل مشكلة كلاس روم؟"
          />
          <button 
            type="submit"
            disabled={loading}
            className="absolute left-3 top-2 bottom-2 px-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div> : <Send size={20} />}
          </button>
        </form>

        {answer && (
          <div className="mt-8 p-6 bg-indigo-50 rounded-2xl border border-indigo-100 animate-in fade-in duration-300">
            <div className="flex items-center mb-4 text-indigo-800 font-bold">
              <HelpCircle size={20} className="ml-2" />
              إجابة النظام الذكي
            </div>
            <div className="text-gray-700 whitespace-pre-wrap prose prose-indigo max-w-none">
              {answer}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <Book size={20} className="ml-2 text-indigo-600" />
            أدلة استخدام سريعة
          </h3>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50 hover:border-indigo-200 transition-colors cursor-pointer group">
                <h4 className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">{faq.q}</h4>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
            <div className="flex items-center text-amber-800 font-bold mb-3">
              <ShieldAlert size={20} className="ml-2" />
              تنبيهات هامة
            </div>
            <ul className="text-sm text-amber-700 space-y-2 list-disc pr-4">
              <li>تأكد دائماً من صحة البريد الإلكتروني قبل التفعيل.</li>
              <li>المهام التي تتجاوز 120 دقيقة تتطلب مراجعة المشرف.</li>
              <li>لا تشارك كلمة المرور الخاصة بك مع أي شخص.</li>
            </ul>
          </div>

          <div className="bg-gray-900 p-6 rounded-3xl text-white">
            <div className="flex items-center font-bold mb-4 text-emerald-400">
              <Terminal size={20} className="ml-2" />
              أدوات المطورين
            </div>
            <p className="text-xs text-gray-400 mb-4">اختصارات لوحة المفاتيح:</p>
            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between"><span className="text-gray-500">مهمة جديدة</span> <span>Ctrl + N</span></div>
              <div className="flex justify-between"><span className="text-gray-500">لوحة التحكم</span> <span>Ctrl + D</span></div>
              <div className="flex justify-between"><span className="text-gray-500">البحث</span> <span>Ctrl + F</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
