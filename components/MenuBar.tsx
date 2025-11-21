import React, { useState, useEffect } from 'react';
import { Apple, Wifi, Battery, Search, Command } from 'lucide-react';

export const MenuBar: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const formattedDate = time.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="fixed top-0 left-0 w-full h-8 bg-slate-200/30 dark:bg-slate-900/30 backdrop-blur-xl border-b border-white/10 z-50 flex items-center justify-between px-4 text-xs font-medium text-slate-800 dark:text-white shadow-sm select-none">
      <div className="flex items-center gap-4">
        <Apple size={16} className="cursor-pointer hover:opacity-70" />
        <span className="font-bold hidden sm:block">GeminiOS</span>
        <span className="hidden sm:block cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded">File</span>
        <span className="hidden sm:block cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded">Edit</span>
        <span className="hidden sm:block cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded">View</span>
        <span className="hidden sm:block cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded">Go</span>
        <span className="hidden sm:block cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded">Window</span>
        <span className="hidden sm:block cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded">Help</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 opacity-80">
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