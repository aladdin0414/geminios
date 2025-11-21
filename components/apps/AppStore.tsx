
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Search, Star, LayoutGrid, Gamepad2, PenTool, Briefcase, Music, Code, Download } from 'lucide-react';

export const AppStore: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('discover');

  const sidebarItems = [
    { id: 'discover', label: 'store.discover', icon: LayoutGrid },
    { id: 'arcade', label: 'store.arcade', icon: Gamepad2 },
    { id: 'create', label: 'store.create', icon: PenTool },
    { id: 'work', label: 'store.work', icon: Briefcase },
    { id: 'play', label: 'store.play', icon: Music },
    { id: 'develop', label: 'store.develop', icon: Code },
  ];

  const featuredApps = [
    { name: 'Gemini AI', category: 'Productivity', rating: 5.0, icon: 'bg-gradient-to-br from-blue-500 to-purple-600', installed: true },
    { name: 'Xcode', category: 'Developer Tools', rating: 4.8, icon: 'bg-blue-600', installed: false },
    { name: 'Final Cut Pro', category: 'Video', rating: 4.7, icon: 'bg-pink-600', installed: false },
    { name: 'Logic Pro', category: 'Music', rating: 4.9, icon: 'bg-slate-800', installed: false },
    { name: 'Slack', category: 'Business', rating: 4.5, icon: 'bg-[#4A154B]', installed: false },
    { name: 'Figma', category: 'Graphics', rating: 4.8, icon: 'bg-black', installed: false },
  ];

  const AppCard = ({ app }: { app: any }) => (
    <div className="flex flex-col p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all">
      <div className="flex gap-4 mb-3">
        <div className={`w-16 h-16 rounded-[14px] shadow-sm ${app.icon} flex items-center justify-center text-white font-bold text-xl`}>
           {app.name[0]}
        </div>
        <div className="flex flex-col justify-center">
           <h3 className="font-semibold text-sm leading-tight">{app.name}</h3>
           <p className="text-xs text-slate-500 dark:text-slate-400">{app.category}</p>
           <div className="flex items-center gap-0.5 mt-1">
               {[...Array(5)].map((_, i) => (
                   <Star key={i} size={10} className={`${i < Math.floor(app.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} />
               ))}
           </div>
        </div>
      </div>
      <div className="mt-auto">
         <button className={`
            w-full py-1 px-3 rounded-full text-xs font-bold transition-colors
            ${app.installed 
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'}
         `}>
            {app.installed ? t('store.open') : t('store.get')}
         </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-full w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      {/* Sidebar */}
      <div className="w-48 flex flex-col bg-slate-50 dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-700 pt-6 pb-2">
        <div className="px-4 mb-4">
             <div className="relative">
                <Search className="absolute left-2 top-1.5 text-slate-400" size={14} />
                <input 
                    type="text" 
                    placeholder={t('browser.search')} 
                    className="w-full bg-slate-200/50 dark:bg-slate-800 border-transparent rounded-lg pl-8 pr-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
             </div>
        </div>
        <div className="flex-1 px-2 space-y-1">
           {sidebarItems.map((item) => (
               <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                    ${activeTab === item.id 
                        ? 'bg-slate-200 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-medium' 
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'}
                  `}
               >
                  <item.icon size={18} className={activeTab === item.id ? 'text-blue-500' : 'text-slate-400'} />
                  <span>{t(item.label)}</span>
               </button>
           ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 h-full overflow-y-auto p-6">
          {/* Hero Section */}
          <div className="w-full h-64 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 mb-8 relative overflow-hidden shadow-lg text-white flex items-center p-8">
             <div className="relative z-10 max-w-md">
                <span className="text-blue-200 font-bold text-xs uppercase tracking-wider mb-2 block">{t('store.featured')}</span>
                <h1 className="text-4xl font-bold mb-4">Gemini AI</h1>
                <p className="text-blue-100 mb-6 text-sm leading-relaxed">Experience the next generation of AI assistance right on your desktop. Smart, fast, and integrated.</p>
                <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-bold text-sm hover:bg-blue-50 transition-colors">
                    {t('store.open')}
                </button>
             </div>
             <div className="absolute right-[-50px] bottom-[-50px] opacity-20">
                <LayoutGrid size={300} />
             </div>
          </div>

          <div className="flex items-center justify-between mb-4">
             <h2 className="text-xl font-bold">{t('store.discover')}</h2>
             <button className="text-blue-500 text-xs font-medium hover:underline">See All</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
             {featuredApps.map((app, idx) => (
                 <AppCard key={idx} app={app} />
             ))}
          </div>
      </div>
    </div>
  );
};
