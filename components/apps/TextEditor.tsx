
import React, { useState } from 'react';
import { Save, Type, AlignLeft, AlignCenter, AlignRight, Check } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const TextEditor: React.FC = () => {
  const { t } = useLanguage();
  const [content, setContent] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      {/* Toolbar */}
      <div className="h-10 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center px-2 gap-2">
        <button 
            onClick={handleSave}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors text-slate-600 dark:text-slate-300 flex items-center gap-1"
            title={t('editor.save')}
        >
           {isSaved ? <Check size={16} className="text-green-500" /> : <Save size={16} />}
           {isSaved && <span className="text-xs text-green-600 font-medium">{t('editor.saved')}</span>}
        </button>
        
        <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1" />

        <div className="flex items-center gap-1">
             <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors text-slate-600 dark:text-slate-300">
                <Type size={16} />
             </button>
        </div>

        <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1" />

        <div className="flex items-center gap-1">
            <button className="p-1.5 bg-slate-200 dark:bg-slate-700 rounded-md transition-colors text-slate-800 dark:text-slate-200">
                <AlignLeft size={16} />
            </button>
            <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors text-slate-600 dark:text-slate-300">
                <AlignCenter size={16} />
            </button>
            <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors text-slate-600 dark:text-slate-300">
                <AlignRight size={16} />
            </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 relative">
         <textarea
            className="w-full h-full resize-none p-6 focus:outline-none bg-transparent font-mono text-sm leading-relaxed"
            placeholder={t('editor.placeholder')}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            spellCheck={false}
         />
      </div>

      {/* Status Bar */}
      <div className="h-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 flex items-center justify-end">
         <span className="text-[10px] text-slate-400">
            {content.length} chars
         </span>
      </div>
    </div>
  );
};
