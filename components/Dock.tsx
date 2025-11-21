import React from 'react';
import { DOCK_APPS } from '../constants';
import { AppType } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface DockProps {
  onAppClick: (type: AppType) => void;
  openApps: AppType[];
}

export const Dock: React.FC<DockProps> = ({ onAppClick, openApps }) => {
  const { t } = useLanguage();
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 pointer-events-auto">
      <div className="bg-white/20 dark:bg-black/20 backdrop-blur-xl border border-white/20 rounded-2xl p-3 shadow-2xl flex items-end gap-3">
        {DOCK_APPS.map((app) => {
          const isOpen = openApps.includes(app.id);
          return (
            <div key={app.id} className="group relative flex flex-col items-center gap-1">
              <button
                onClick={() => onAppClick(app.id)}
                className={`
                  ${app.color} w-12 h-12 rounded-xl flex items-center justify-center
                  shadow-lg transition-all duration-300 ease-out
                  hover:-translate-y-2 hover:scale-110
                `}
              >
                <app.icon size={24} />
              </button>
              {/* Tooltip */}
              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap">
                {t(app.name)}
              </div>
              {/* Open Indicator */}
              <div className={`w-1 h-1 rounded-full bg-white/80 ${isOpen ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
            </div>
          );
        })}
      </div>
    </div>
  );
};