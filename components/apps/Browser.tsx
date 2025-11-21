import React, { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Lock, Search } from 'lucide-react';

export const Browser: React.FC = () => {
  const [url, setUrl] = useState('https://www.wikipedia.org');
  const [currentSrc, setCurrentSrc] = useState('https://www.wikipedia.org');
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleNavigate = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!url) return;
    
    let targetUrl = url;
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = `https://${targetUrl}`;
    }
    
    setIsLoading(true);
    setCurrentSrc(targetUrl);
    // Reset loading state after a timeout since we can't reliably detect iframe load for cross-origin
    setTimeout(() => setIsLoading(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNavigate();
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-slate-900">
      {/* Browser Toolbar */}
      <div className="h-12 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center px-4 gap-4">
        <div className="flex items-center gap-2 text-slate-500">
          <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
            <ArrowLeft size={16} />
          </button>
          <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
            <ArrowRight size={16} />
          </button>
          <button 
            className={`p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors ${isLoading ? 'animate-spin' : ''}`}
            onClick={() => handleNavigate()}
          >
            <RotateCw size={14} />
          </button>
        </div>

        {/* Address Bar */}
        <div className="flex-1 relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
            <Lock size={12} />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-slate-200/50 dark:bg-slate-900/50 border-transparent focus:border-blue-500/50 focus:bg-white dark:focus:bg-slate-900 rounded-lg pl-8 pr-4 py-1.5 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            placeholder="Search or enter website name"
          />
        </div>
        
        <div className="text-slate-500">
             <Search size={16} className="cursor-pointer hover:text-slate-700" />
        </div>
      </div>

      {/* Web Content Area */}
      <div className="flex-1 relative bg-white w-full h-full">
        <iframe
          ref={iframeRef}
          src={currentSrc}
          title="Browser"
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
        
        {/* Overlay for when iframe refuses to load (common with major sites due to X-Frame-Options) */}
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center opacity-0 transition-opacity duration-500 delay-1000">
             {/* This is just a helper visual, in a real app we'd handle errors better */}
        </div>
      </div>
    </div>
  );
};