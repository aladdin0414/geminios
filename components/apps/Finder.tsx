import React from 'react';
import { Folder, FileText, Image, Music, HardDrive, Cloud, Clock, Download } from 'lucide-react';

interface FinderProps {
  title?: string;
}

export const Finder: React.FC<FinderProps> = ({ title = "Finder" }) => {
  const sidebarItems = [
    { name: 'AirDrop', icon: Cloud },
    { name: 'Recents', icon: Clock },
    { name: 'Applications', icon: HardDrive },
    { name: 'Desktop', icon: HardDrive },
    { name: 'Documents', icon: FileText },
    { name: 'Downloads', icon: Download },
  ];

  const mockFiles = [
    { name: 'Resume.pdf', icon: FileText, date: 'Today, 10:23 AM', size: '1.2 MB' },
    { name: 'Budget_2024.xlsx', icon: FileText, date: 'Yesterday, 2:15 PM', size: '45 KB' },
    { name: 'Screenshot 001.png', icon: Image, date: 'Oct 24, 2024', size: '2.4 MB' },
    { name: 'Project_Logo.svg', icon: Image, date: 'Oct 20, 2024', size: '12 KB' },
    { name: 'Podcast_Intro.mp3', icon: Music, date: 'Sep 15, 2024', size: '8.5 MB' },
    { name: 'Archive.zip', icon: Folder, date: 'Aug 01, 2024', size: '154 MB' },
  ];

  return (
    <div className="flex h-full w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-b-xl overflow-hidden">
      {/* Sidebar */}
      <div className="w-48 bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-xl border-r border-slate-200 dark:border-slate-700 flex flex-col pt-4 pb-2">
        <div className="px-4 mb-2 text-xs font-semibold text-slate-400">Favorites</div>
        {sidebarItems.map((item, idx) => (
          <div key={idx} className="px-4 py-1.5 flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700/50 cursor-pointer transition-colors text-sm">
             <item.icon size={16} className="text-blue-500" />
             <span>{item.name}</span>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
        {/* Toolbar */}
        <div className="h-10 border-b border-slate-200 dark:border-slate-700 flex items-center px-4 gap-4 bg-slate-50 dark:bg-slate-800/30">
           <div className="flex items-center gap-2">
              <div className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"><Folder size={16}/></div>
           </div>
           <span className="font-semibold text-sm">{title}</span>
        </div>
        
        {/* File List */}
        <div className="flex-1 overflow-y-auto p-4">
           <div className="grid grid-cols-4 gap-4">
              {mockFiles.map((file, i) => (
                  <div key={i} className="group flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer">
                      <file.icon size={48} className="text-slate-400 group-hover:text-blue-500 transition-colors" strokeWidth={1} />
                      <span className="text-xs text-center font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate w-full">{file.name}</span>
                  </div>
              ))}
           </div>
        </div>
        
        {/* Status Bar */}
        <div className="h-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center px-4 text-xs text-slate-400">
           {mockFiles.length} items, 420 GB available
        </div>
      </div>
    </div>
  );
};