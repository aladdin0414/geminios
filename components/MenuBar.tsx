import React, { useState, useEffect, useRef } from 'react';
import { Apple, Wifi, Battery, Search, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface MenuBarProps {
  onLogout: () => void;
  onAboutClick: () => void;
}

export const MenuBar: React.FC<MenuBarProps> = ({ onLogout, onAboutClick }) => {
  const { t, language, setLanguage } = useLanguage();
  const [time, setTime] = useState(new Date());
  const [isAppleMenuOpen, setAppleMenuOpen] = useState(false);
  const [isLangMenuOpen, setLangMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setAppleMenuOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      clearInterval(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formattedTime = time.toLocaleTimeString(language === 'zh' ? 'zh-CN' : 'en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const formattedDate = time.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const MenuItem = ({ label, onClick, disabled = false }: { label: string, onClick?: () => void, disabled?: boolean }) => (
    <button 
      onClick={() => {
        if (!disabled && onClick) {
          onClick();
          setAppleMenuOpen(false);
        }
      }}
      className={`
        w-full text-left px-4 py-1.5 text-xs rounded-md mx-1 mb-0.5 block
        ${disabled 
          ? 'text-slate-400 cursor-default' 
          : 'hover:bg-blue-500 hover:text-white cursor-pointer'}
      `}
    >
      {label}
    </button>
  );

  const MenuDivider = () => (
    <div className="h-px bg-slate-200 dark:bg-slate-700/50 my-1 mx-1" />
  );

  return (
    <div className="fixed top-0 left-0 w-full h-8 bg-slate-200/30 dark:bg-slate-900/30 backdrop-blur-xl border-b border-white/10 z-50 flex items-center justify-between px-4 text-xs font-medium text-slate-800 dark:text-white shadow-sm select-none pointer-events-auto">
      <div className="flex items-center gap-4">
        {/* Apple Menu */}
        <div className="relative" ref={menuRef}>
          <div 
            className={`cursor-pointer hover:bg-white/20 rounded px-2 py-1 transition-colors ${isAppleMenuOpen ? 'bg-white/20' : ''}`}
            onClick={() => setAppleMenuOpen(!isAppleMenuOpen)}
          >
            <Apple size={16} className="fill-current" />
          </div>

          {isAppleMenuOpen && (
            <div className="absolute top-full left-0 mt-1 w-56 bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-lg shadow-2xl border border-slate-200/50 dark:border-slate-700/50 py-1.5 z-50 flex flex-col text-slate-800 dark:text-slate-200">
              <MenuItem label={t('system.about')} onClick={onAboutClick} />
              <MenuDivider />
              <MenuItem label="System Settings..." disabled />
              <MenuItem label="App Store..." disabled />
              <MenuDivider />
              <MenuItem label={t('system.sleep')} onClick={() => alert("Sleeping...")} />
              <MenuItem label={t('system.restart')} onClick={() => window.location.reload()} />
              <MenuItem label={t('system.shutdown')} onClick={() => alert("Shutting down...")} />
              <MenuDivider />
              <MenuItem label={t('system.lockscreen')} onClick={onLogout} />
              <MenuItem label={t('system.logout')} onClick={onLogout} />
            </div>
          )}
        </div>

        <span className="font-bold hidden sm:block">GeminiOS</span>
        <span className="hidden sm:block cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded">{t('menu.file')}</span>
        <span className="hidden sm:block cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded">{t('menu.edit')}</span>
        <span className="hidden sm:block cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded">{t('menu.view')}</span>
        <span className="hidden sm:block cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded">{t('menu.go')}</span>
        <span className="hidden sm:block cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded">{t('menu.window')}</span>
        <span className="hidden sm:block cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded">{t('menu.help')}</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 opacity-80">
            {/* Language Switcher in MenuBar */}
            <div className="relative" ref={langRef}>
                <div 
                    className="cursor-pointer hover:bg-white/20 p-1 rounded transition-colors"
                    onClick={() => setLangMenuOpen(!isLangMenuOpen)}
                >
                    <Globe size={14} />
                </div>
                 {isLangMenuOpen && (
                    <div className="absolute top-full right-0 mt-1 w-24 bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-lg shadow-2xl border border-slate-200/50 dark:border-slate-700/50 py-1.5 z-50 flex flex-col text-slate-800 dark:text-slate-200">
                    <button 
                        onClick={() => { setLanguage('en'); setLangMenuOpen(false); }}
                        className={`text-left px-4 py-1.5 hover:bg-blue-500 hover:text-white ${language === 'en' ? 'font-bold' : ''}`}
                    >
                        English
                    </button>
                    <button 
                        onClick={() => { setLanguage('zh'); setLangMenuOpen(false); }}
                        className={`text-left px-4 py-1.5 hover:bg-blue-500 hover:text-white ${language === 'zh' ? 'font-bold' : ''}`}
                    >
                        中文
                    </button>
                    </div>
                )}
            </div>
            <Battery size={16} />
            <Wifi size={16} />
            <Search size={14} />
        </div>
        <div className="flex items-center gap-2">
           <span>{formattedDate}</span>
           <span>{formattedTime}</span>
        </div>
      </div>
    </div>
  );
};