
import React, { useState, useEffect, useRef } from 'react';
import { Battery, Wifi, Search, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface MenuBarProps {
  onLogout: () => void;
  onAboutClick: () => void;
  onSettingsClick: () => void;
  onAppStoreClick: () => void;
}

// Custom Apple Logo SVG to ensure perfect rendering without clipping
const AppleLogo = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="">
    <path d="M17.04 12.88c-.04-2.27 1.85-3.38 1.94-3.43-1.06-1.54-2.7-1.75-3.27-1.77-1.38-.14-2.71.82-3.41.82-.7 0-1.79-.8-2.94-.78-1.51.02-2.91.89-3.69 2.26-1.57 2.76-.4 6.84 1.13 9.07.75 1.1 1.64 2.33 2.81 2.29 1.12-.05 1.54-.73 2.9-.73 1.35 0 1.74.73 2.92.7 1.21-.02 1.98-1.1 2.72-2.2 0 0 .84-2.06 2.42-2.54l.16-.05c-.88-4.08-3.43-5.5-3.69-5.64zm-2.83-7.58c.68-.83 1.14-1.99 1.01-3.15-1.01.05-2.23.68-2.94 1.53-.64.74-1.2 1.95-1.05 3.08.02 0 1.16.05 2.98-1.46z"/>
  </svg>
);

// Custom Control Center Icon (Toggles)
const ControlCenterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 15h12" />
    <circle cx="9" cy="15" r="2.5" fill="currentColor" stroke="none"/>
    <path d="M6 9h12" />
    <circle cx="15" cy="9" r="2.5" fill="currentColor" stroke="none"/>
  </svg>
);

export const MenuBar: React.FC<MenuBarProps> = ({ onLogout, onAboutClick, onSettingsClick, onAppStoreClick }) => {
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

  // Format: "Sat Oct 24 10:23 AM"
  const dateTimeString = time.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).replace(/,/g, '');

  const MenuItem = ({ label, onClick, disabled = false }: { label: string, onClick?: () => void, disabled?: boolean }) => (
    <button 
      onClick={() => {
        if (!disabled && onClick) {
          onClick();
          setAppleMenuOpen(false);
        }
      }}
      className={`
        w-full text-left px-3 py-1 rounded text-[13px] mx-1 mb-0.5 block tracking-wide
        ${disabled 
          ? 'text-slate-400 cursor-default' 
          : 'hover:bg-blue-500 hover:text-white cursor-pointer active:bg-blue-600'}
      `}
    >
      {label}
    </button>
  );

  const MenuDivider = () => (
    <div className="h-px bg-slate-200 dark:bg-slate-700/50 my-1.5 mx-3" />
  );

  const TopBarButton = ({ children, onClick, active, className = "" }: { children: React.ReactNode, onClick?: () => void, active?: boolean, className?: string }) => (
     <div 
        onClick={onClick}
        className={`
            h-6 px-2 rounded flex items-center justify-center cursor-default transition-colors select-none
            hover:bg-white/10 active:bg-white/20
            ${active ? 'bg-white/20' : ''}
            ${className}
        `}
     >
        {children}
     </div>
  );

  return (
    <div 
        className="fixed top-0 left-0 w-full h-[32px] bg-[#E3E3E5]/50 dark:bg-[#1e1e1e]/40 backdrop-blur-3xl border-b border-white/5 z-50 flex items-center justify-between px-2 text-[13px] font-medium text-slate-900 dark:text-white shadow-sm select-none pointer-events-auto transition-colors duration-300"
        onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
    >
      
      {/* Left Side: App Menu */}
      <div className="flex items-center gap-1">
        {/* Apple Menu */}
        <div className="relative" ref={menuRef}>
          <TopBarButton active={isAppleMenuOpen} onClick={() => setAppleMenuOpen(!isAppleMenuOpen)} className="px-2.5">
            <AppleLogo />
          </TopBarButton>

          {isAppleMenuOpen && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-white/80 dark:bg-[#2d2d2d]/80 backdrop-blur-xl rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-white/20 dark:border-white/10 py-1.5 z-50 flex flex-col text-slate-900 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-100">
              <MenuItem label={t('system.about')} onClick={onAboutClick} />
              <MenuDivider />
              <MenuItem label={t('app.settings') + "..."} onClick={onSettingsClick} />
              <MenuItem label={t('app.appstore') + "..."} onClick={onAppStoreClick} />
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

        <TopBarButton><span className="font-bold tracking-tight">GeminiOS</span></TopBarButton>
        
        <div className="hidden md:flex items-center gap-0.5">
            <TopBarButton>{t('menu.file')}</TopBarButton>
            <TopBarButton>{t('menu.edit')}</TopBarButton>
            <TopBarButton>{t('menu.view')}</TopBarButton>
            <TopBarButton>{t('menu.go')}</TopBarButton>
            <TopBarButton>{t('menu.window')}</TopBarButton>
            <TopBarButton>{t('menu.help')}</TopBarButton>
        </div>
      </div>

      {/* Right Side: Status Icons */}
      <div className="flex items-center gap-3 px-1">
        <div className="hidden sm:flex items-center gap-4 opacity-90">
            {/* Language Switcher */}
            <div className="relative" ref={langRef}>
                <div 
                    className="cursor-pointer hover:opacity-70 transition-opacity"
                    onClick={() => setLangMenuOpen(!isLangMenuOpen)}
                >
                    <Globe size={14} strokeWidth={2} />
                </div>
                 {isLangMenuOpen && (
                    <div className="absolute top-full right-[-50px] mt-2 w-32 bg-white/80 dark:bg-[#2d2d2d]/80 backdrop-blur-xl rounded-lg shadow-xl border border-white/20 dark:border-white/10 py-1.5 z-50 flex flex-col text-slate-900 dark:text-slate-100">
                    <button 
                        onClick={() => { setLanguage('en'); setLangMenuOpen(false); }}
                        className={`text-left px-4 py-1 hover:bg-blue-500 hover:text-white text-xs ${language === 'en' ? 'font-bold' : ''}`}
                    >
                        English
                    </button>
                    <button 
                        onClick={() => { setLanguage('zh'); setLangMenuOpen(false); }}
                        className={`text-left px-4 py-1 hover:bg-blue-500 hover:text-white text-xs ${language === 'zh' ? 'font-bold' : ''}`}
                    >
                        中文
                    </button>
                    </div>
                )}
            </div>
            
            {/* Status Icons */}
            <div className="flex items-center gap-3">
                <Battery size={18} strokeWidth={2} className="opacity-80" />
                <Wifi size={16} strokeWidth={2.5} className="opacity-80" />
                <Search size={14} strokeWidth={2.5} className="opacity-80" />
            </div>
            
            {/* Control Center */}
            <div className="hover:bg-white/10 p-1 rounded transition-colors cursor-default">
                <ControlCenterIcon />
            </div>
        </div>

        {/* Clock */}
        <div className="flex items-center">
           <span className="text-[13px] tracking-wide font-medium min-w-[130px] text-right tabular-nums">
             {dateTimeString}
           </span>
        </div>
      </div>
    </div>
  );
};
