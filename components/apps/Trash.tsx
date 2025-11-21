import React, { useState } from 'react';
import { Trash2, File, RotateCcw, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface TrashItem {
  id: string;
  name: string;
  date: string;
  size: string;
}

export const Trash: React.FC = () => {
  const { t } = useLanguage();
  const [items, setItems] = useState<TrashItem[]>([
    { id: '1', name: 'old_design_v1.png', date: 'Yesterday', size: '2.4 MB' },
    { id: '2', name: 'Draft.docx', date: '2 days ago', size: '14 KB' },
    { id: '3', name: 'Untitled.txt', date: 'Last week', size: '0 KB' },
  ]);
  
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleEmptyTrash = () => {
    setItems([]);
    setSelectedId(null);
  };

  const handleRestore = () => {
    if (selectedId) {
      setItems(items.filter(i => i.id !== selectedId));
      setSelectedId(null);
      // In a real app, this would move the file back to desktop
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      {/* Toolbar */}
      <div className="h-12 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 bg-slate-50 dark:bg-slate-800/50">
        <div className="flex items-center gap-2">
             <span className="font-bold text-slate-700 dark:text-slate-300">{t('app.trash')}</span>
        </div>
        
        <div className="flex gap-2">
          {selectedId && (
             <button 
                onClick={handleRestore}
                className="px-3 py-1 text-xs font-medium bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded flex items-center gap-1 transition-colors"
             >
                <RotateCcw size={12} />
                {t('trash.restore')}
             </button>
          )}
          <button 
            onClick={handleEmptyTrash}
            disabled={items.length === 0}
            className="px-3 py-1 text-xs font-medium bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
          >
            {t('trash.empty')}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4" onClick={() => setSelectedId(null)}>
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Trash2 size={48} strokeWidth={1.5} />
            </div>
            <p className="text-sm">{t('trash.empty')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4 content-start">
            {items.map((item) => (
              <div 
                key={item.id}
                onClick={(e) => { e.stopPropagation(); setSelectedId(item.id); }}
                className={`
                    group flex flex-col items-center gap-2 p-3 rounded-lg cursor-pointer border
                    ${selectedId === item.id 
                        ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700' 
                        : 'bg-transparent border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'}
                `}
              >
                <div className="w-12 h-12 flex items-center justify-center text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                    <File size={40} strokeWidth={1} />
                </div>
                <div className="text-center w-full">
                    <div className={`text-xs font-medium truncate w-full ${selectedId === item.id ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                        {item.name}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.size}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer status */}
      <div className="h-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center px-4 text-xs text-slate-400">
         {items.length} {t('trash.items')}
      </div>
    </div>
  );
};