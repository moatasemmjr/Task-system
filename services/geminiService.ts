
import { GoogleGenAI, Type } from "@google/genai";
import { Task } from "../types";

// Always initialize the SDK with a named apiKey parameter and ensure it's retrieved directly from process.env
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const getSmartInsights = async (tasks: Task[]) => {
  const ai = getAI();
  const tasksSummary = tasks.map(t => ({
    type: t.type,
    duration: t.duration,
    date: t.createdAt
  }));

  const prompt = `بناءً على المهام التالية في نظام إدارة المهام، قدم تحليلاً ذكياً باللغة العربية يتضمن:
  1. توقع فترات الضغط القادمة.
  2. نصائح لتحسين الإنتاجية.
  3. ملاحظات حول توزيع الوقت.
  المهام: ${JSON.stringify(tasksSummary.slice(-50))}`;

  try {
    // Correctly using 'gemini-3-flash-preview' for basic text summarization tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    // Access response text via the .text property (not a method)
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "عذراً، تعذر الحصول على التحليلات الذكية في الوقت الحالي.";
  }
};

export const queryKnowledgeBase = async (query: string) => {
  const ai = getAI();
  const prompt = `أنت مساعد خبير في نظام إدارة المهام المدرسية والتقنية. أجب عن السؤال التالي باللغة العربية: ${query}`;

  try {
    // Correctly using 'gemini-3-flash-preview' for simple Q&A tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    // Access response text via the .text property (not a method)
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "عذراً، تعذر الوصول إلى قاعدة المعرفة.";
  }
};
