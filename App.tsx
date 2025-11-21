import React, { useState, useCallback, useEffect } from 'react';
import { Desktop } from './components/Desktop';
import { MenuBar } from './components/MenuBar';
import { Dock } from './components/Dock';
import { Window } from './components/Window';
import { AppType, WindowState, DesktopItem } from './types';
import { DOCK_APPS, INITIAL_WINDOW_HEIGHT, INITIAL_WINDOW_WIDTH, DESKTOP_ITEMS } from './constants';
import { GeminiChat } from './components/apps/GeminiChat';
import { AboutApp } from './components/apps/About';
import { Finder } from './components/apps/Finder';
import { Browser } from './components/apps/Browser';

// Helper to get content based on app type
const getAppContent = (type: AppType, props?: any) => {
  switch (type) {
    case AppType.GEMINI_ASSISTANT:
      return <GeminiChat />;
    case AppType.ABOUT:
      return <AboutApp />;
    case AppType.FINDER:
      return <Finder title={props?.title} />;
    case AppType.BROWSER:
      return <Browser />;
    case AppType.SYSTEM_PREFS:
      return <div className="p-8 text-center text-slate-500">System Settings not implemented in demo.</div>;
    case AppType.TERMINAL:
      return <div className="p-4 bg-black h-full font-mono text-green-400 text-sm">gemini-os:~ user$ echo "Hello World"<br/>Hello World<br/>gemini-os:~ user$ _</div>;
    default:
      return null;
  }
};

const App: React.FC = () => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [nextZIndex, setNextZIndex] = useState(10);
  const [desktopItems, setDesktopItems] = useState<DesktopItem[]>(DESKTOP_ITEMS);

  // Generate a safe initial position so windows don't perfectly overlap
  const getInitialPosition = (index: number) => ({
    x: 100 + (index * 30),
    y: 80 + (index * 30)
  });

  const openApp = (type: AppType, props?: any) => {
    // For apps that should be single-instance (like Music or Chat), check if open
    // For Finder, we might want multiple windows, but for simplicity here, let's just focus if open, unless it's a different folder
    const existingWindow = windows.find(w => w.type === type && (!props?.title || w.title === props.title));
    
    if (existingWindow) {
      setWindows(prev => prev.map(w => 
        w.id === existingWindow.id 
          ? { ...w, isMinimized: false, zIndex: nextZIndex } 
          : w
      ));
      setNextZIndex(prev => prev + 1);
      return;
    }

    const appInfo = DOCK_APPS.find(a => a.id === type);
    // Fallback for non-dock apps (like Finder opened from desktop if not in dock list explicitly, though it is)
    const title = props?.title || appInfo?.name || 'Window';

    const newWindow: WindowState = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title: title,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      position: getInitialPosition(windows.length),
      size: { width: INITIAL_WINDOW_WIDTH, height: INITIAL_WINDOW_HEIGHT },
      zIndex: nextZIndex,
      content: getAppContent(type, props)
    };

    setWindows([...windows, newWindow]);
    setNextZIndex(prev => prev + 1);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
  };

  const toggleMaximizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMaximized: !w.isMaximized, zIndex: nextZIndex } : w
    ));
    setNextZIndex(prev => prev + 1);
  };

  const focusWindow = (id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, zIndex: nextZIndex } : w
    ));
    setNextZIndex(prev => prev + 1);
  };

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, position: { x, y } } : w
    ));
  }, []);

  const handleDesktopItemOpen = (item: DesktopItem) => {
    if (item.type === 'APP' && item.appId) {
      openApp(item.appId);
    } else if (item.type === 'FOLDER') {
      openApp(AppType.FINDER, { title: item.label });
    } else if (item.type === 'FILE') {
      // Simple file viewer using Finder app type but different title for now, or just alert
      // Let's open it in a "Text Editor" mock via Finder logic for now or just generic window
      openApp(AppType.TERMINAL); // Placeholder: Open terminal for files for now
    }
  };

  const handleDesktopItemMove = (id: string, x: number, y: number) => {
    setDesktopItems(prev => prev.map(item => 
      item.id === id ? { ...item, gridPos: { x, y } } : item
    ));
  };

  const openAppIds = windows.map(w => w.type);

  // Auto-open Gemini Chat on load
  useEffect(() => {
     if (windows.length === 0) {
         openApp(AppType.GEMINI_ASSISTANT);
     }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Desktop 
      items={desktopItems} 
      onOpenItem={handleDesktopItemOpen}
      onMoveItem={handleDesktopItemMove}
    >
      <MenuBar />
      
      {/* Window Layer */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
        {windows.map(window => (
           <div key={window.id} className="pointer-events-auto"> 
              <Window
                windowState={window}
                onClose={closeWindow}
                onMinimize={minimizeWindow}
                onMaximize={toggleMaximizeWindow}
                onFocus={focusWindow}
                onMove={moveWindow}
              />
           </div>
        ))}
      </div>

      <Dock 
        onAppClick={openApp} 
        openApps={openAppIds} 
      />
    </Desktop>
  );
};

export default App;