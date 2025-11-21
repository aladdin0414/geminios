
import React, { useState } from 'react';
import { Sliders, Monitor, Image as ImageIcon, Globe, ChevronRight, Moon, Sun, Smartphone, HardDrive } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { WALLPAPERS } from '../../constants';

interface SystemSettingsProps {
  isDark: boolean;
  setTheme: (isDark: boolean) => void;
  wallpaper: string;
  setWallpaper: (url: string) => void;
}

type SettingsTab = 'general' | 'appearance' | 'wallpaper' | 'language';

export const SystemSettings: React.FC<SystemSettingsProps> = ({ isDark, setTheme, wallpaper, setWallpaper }) => {
  const { t, language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  const sidebarItems = [
    { id: 'general', icon: Sliders, label: 'settings.sidebar.general', color: 'bg-gray-400' },
    { id: 'appearance', icon: Monitor, label: 'settings.sidebar.appearance', color: 'bg-blue-500' },
    { id: 'wallpaper', icon: ImageIcon, label: 'settings.sidebar.desktop', color: 'bg-cyan-500' },
    { id: 'language', icon: Globe, label: 'settings.sidebar.language', color: 'bg-green-500' },
  ];

  const renderSidebar = () => (
    <div className="w-1/3 max-w-[200px] bg-slate-100/50 dark:bg-slate-800/50 border-r border-slate-200 dark:border-slate-700 pt-4 h-full flex flex-col">
      <div className="px-4 pb-4">
        <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center">
               <Sliders className="text-slate-600 dark:text-slate-200" size={20}/>
            </div>
            <div>
               <div className="font-bold text-sm leading-none mb-1">{t('app.settings')}</div>
               <div className="text-[10px] text-slate-500">Apple ID</div>
            </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as SettingsTab)}
            className={`
              w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm transition-colors
              ${activeTab === item.id 
                ? 'bg-blue-500 text-white' 
                : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'}
            `}
          >
            <div className={`w-6 h-6 rounded-md ${item.color} flex items-center justify-center text-white shadow-sm`}>
               <item.icon size={14} />
            </div>
            <span className="truncate">{t(item.label)}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'appearance':
        return (
          <div className="p-6 max-w-2xl">
            <h2 className="text-xl font-bold mb-6">{t('settings.appearance.mode')}</h2>
            <div className="grid grid-cols-3 gap-4 max-w-md">
              {/* Light Mode */}
              <button 
                onClick={() => setTheme(false)}
                className="flex flex-col items-center gap-2 group"
              >
                <div className={`w-full aspect-video rounded-xl border-2 overflow-hidden shadow-sm transition-all ${!isDark ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-slate-200 dark:border-slate-700'}`}>
                  <div className="w-full h-full bg-[#eef2f6] relative">
                     <div className="absolute top-2 left-2 w-8 h-full bg-white shadow-sm rounded-tl-md"></div>
                     <div className="absolute top-2 left-12 right-2 h-full bg-white shadow-sm rounded-tr-md flex items-center justify-center">
                        <Sun size={16} className="text-slate-400"/>
                     </div>
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('settings.appearance.light')}</span>
              </button>

              {/* Dark Mode */}
              <button 
                onClick={() => setTheme(true)}
                className="flex flex-col items-center gap-2 group"
              >
                <div className={`w-full aspect-video rounded-xl border-2 overflow-hidden shadow-sm transition-all ${isDark ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-slate-200 dark:border-slate-700'}`}>
                  <div className="w-full h-full bg-[#1e293b] relative">
                     <div className="absolute top-2 left-2 w-8 h-full bg-slate-800 shadow-sm rounded-tl-md"></div>
                     <div className="absolute top-2 left-12 right-2 h-full bg-slate-800 shadow-sm rounded-tr-md flex items-center justify-center">
                        <Moon size={16} className="text-slate-500"/>
                     </div>
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('settings.appearance.dark')}</span>
              </button>

               {/* Auto (Mock) */}
               <button 
                className="flex flex-col items-center gap-2 group opacity-50 cursor-not-allowed"
              >
                <div className="w-full aspect-video rounded-xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm bg-gradient-to-r from-[#eef2f6] to-[#1e293b]">
                </div>
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('settings.appearance.auto')}</span>
              </button>
            </div>
          </div>
        );

      case 'wallpaper':
        return (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">{t('settings.desktop.wallpapers')}</h2>
            <div className="grid grid-cols-3 gap-4">
              {WALLPAPERS.map((wp) => (
                <button
                  key={wp.id}
                  onClick={() => setWallpaper(wp.url)}
                  className={`
                    relative aspect-video rounded-lg overflow-hidden border-2 transition-all
                    ${wallpaper === wp.url ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-transparent hover:border-slate-300'}
                  `}
                >
                  <img src={wp.url} alt={wp.name} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[10px] p-1 text-center backdrop-blur-sm">
                    {wp.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'language':
        return (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">{t('settings.sidebar.language')}</h2>
            
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
                  <span className="text-sm font-medium">{t('settings.language.select')}</span>
              </div>
              <div className="p-2">
                <button 
                    onClick={() => setLanguage('en')}
                    className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm ${language === 'en' ? 'bg-blue-500 text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                >
                    <span>English</span>
                    {language === 'en' && <div className="w-2 h-2 bg-white rounded-full"/>}
                </button>
                <button 
                    onClick={() => setLanguage('zh')}
                    className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm ${language === 'zh' ? 'bg-blue-500 text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                >
                    <span>简体中文</span>
                    {language === 'zh' && <div className="w-2 h-2 bg-white rounded-full"/>}
                </button>
              </div>
            </div>
          </div>
        );

      case 'general':
      default:
        return (
          <div className="p-6 space-y-6">
            <div className="flex flex-col items-center mb-8">
                 <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-700 mb-4 overflow-hidden">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/MacOS_wordmark_%282017%29.svg/320px-MacOS_wordmark_%282017%29.svg.png" alt="OS" className="w-full h-full object-cover p-4 opacity-50" />
                 </div>
                 <h2 className="text-2xl font-bold">GeminiOS 1.0</h2>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
               <div className="flex items-center justify-between p-3">
                  <span className="text-sm font-medium text-slate-500">{t('settings.general.device')}</span>
                  <span className="text-sm font-semibold">Gemini's MacBook Pro</span>
               </div>
               <div className="flex items-center justify-between p-3">
                  <span className="text-sm font-medium text-slate-500">{t('settings.general.model')}</span>
                  <span className="text-sm font-semibold">MacBook Pro (14-inch, 2025)</span>
               </div>
               <div className="flex items-center justify-between p-3">
                  <span className="text-sm font-medium text-slate-500">Chip</span>
                  <span className="text-sm font-semibold">Apple M4 Max</span>
               </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-1">
                <div className="flex items-center gap-4 p-3">
                    <HardDrive size={24} className="text-slate-400"/>
                    <div className="flex-1">
                        <div className="flex justify-between mb-1">
                             <span className="text-sm font-medium">{t('settings.general.storage')}</span>
                             <span className="text-xs text-slate-500">420 GB / 1 TB</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[42%]"></div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-full w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      {renderSidebar()}
      <div className="flex-1 h-full overflow-y-auto bg-white dark:bg-slate-900">
        {renderContent()}
      </div>
    </div>
  );
};
