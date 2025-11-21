import React from 'react';
import { Cpu, Zap } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const AboutApp: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-8">
      <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-3xl shadow-2xl flex items-center justify-center mb-6">
        <Cpu size={48} className="text-white" />
      </div>
      <h1 className="text-2xl font-bold mb-2">{t('about.title')}</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{t('about.version')}</p>
      
      <div className="w-full max-w-xs bg-slate-100 dark:bg-slate-800 rounded-xl p-4 text-sm space-y-3 border border-slate-200 dark:border-slate-700">
        <div className="flex justify-between">
          <span className="text-slate-500">{t('about.processor')}</span>
          <span className="font-medium">Google Gemini 2.5</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">{t('about.memory')}</span>
          <span className="font-medium">Infinite Context</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">{t('about.graphics')}</span>
          <span className="font-medium">Tailwind CSS Render</span>
        </div>
      </div>

      <div className="mt-8 text-xs text-slate-400 text-center">
        <p>{t('about.designed')}</p>
        <p>© 2024 GeminiOS Project.</p>
      </div>
    </div>
  );
};