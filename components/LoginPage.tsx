import React, { useState, useEffect } from 'react';
import { User, ArrowRight, Power, RefreshCw, Moon, Globe } from 'lucide-react';
import { WALLPAPER_URL } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const { t, language, setLanguage } = useLanguage();
  const [password, setPassword] = useState('');
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none">
      {/* Background with blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 transform scale-105"
        style={{ backgroundImage: `url(${WALLPAPER_URL})` }}
      >
        <div className="absolute inset-0 bg-black/20 backdrop-blur-lg" />
      </div>

      {/* Language Toggle */}
      <div className="absolute top-8 right-8 z-50">
         <button 
           onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
           className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-sm transition-colors border border-white/10"
         >
            <Globe size={14} />
            <span>{language === 'en' ? 'English' : '中文'}</span>
         </button>
      </div>

      <div className="relative z-10 flex flex-col h-full items-center justify-between py-12 text-white">
        {/* Top Section: Clock */}
        <div className="flex flex-col items-center mt-12">
          <div className="text-7xl font-thin tracking-tight text-white/90 drop-shadow-lg">
            {date.toLocaleTimeString(language === 'zh' ? 'zh-CN' : 'en-US', { hour: 'numeric', minute: '2-digit', hour12: false })}
          </div>
          <div className="text-xl font-medium text-white/80 mt-2 drop-shadow-md">
            {date.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Middle Section: User & Login */}
        <div className="flex flex-col items-center gap-6 w-full max-w-xs">
          <div className="relative">
            <div className="w-28 h-28 bg-gradient-to-b from-slate-300 to-slate-400 rounded-full flex items-center justify-center shadow-2xl border-2 border-white/20">
              <User size={64} className="text-slate-700 opacity-80" strokeWidth={1.5} />
            </div>
          </div>
          
          <div className="text-2xl font-semibold drop-shadow-md">{t('login.guest')}</div>

          <form onSubmit={handleSubmit} className="relative w-full flex justify-center">
            <div className="relative w-48 group">
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('login.password')}
                className="w-full bg-white/20 hover:bg-white/30 focus:bg-white/30 backdrop-blur-md border border-white/20 rounded-full pl-4 pr-10 py-1.5 text-sm text-white placeholder-white/50 focus:outline-none transition-all shadow-lg text-center"
                autoFocus
                />
                <button 
                    type="submit"
                    className={`absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/20 hover:bg-white/40 transition-opacity duration-200 ${password ? 'opacity-100 cursor-pointer' : 'opacity-0 pointer-events-none'}`}
                >
                    <ArrowRight size={14} className="text-white" />
                </button>
            </div>
          </form>
          
          <p className="text-[11px] text-white/50 mt-2 font-medium">{t('login.instruction')}</p>
        </div>

        {/* Bottom Section: Action Buttons */}
        <div className="flex gap-8 mb-8">
          <ActionButton icon={Moon} label={t('system.sleep')} />
          <ActionButton icon={RefreshCw} label={t('system.restart')} />
          <ActionButton icon={Power} label={t('system.shutdown')} />
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ icon: Icon, label }: { icon: any, label: string }) => (
  <button className="flex flex-col items-center gap-2 group opacity-80 hover:opacity-100 transition-all">
    <div className="w-10 h-10 rounded-full bg-black/20 group-hover:bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 transition-colors">
      <Icon size={18} className="text-white" />
    </div>
    <span className="text-[11px] font-medium">{label}</span>
  </button>
);