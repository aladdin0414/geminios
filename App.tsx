import React, { useState, useCallback } from 'react';
import { Desktop } from './components/Desktop';
import { MenuBar } from './components/MenuBar';
import { Dock } from './components/Dock';
import { Window } from './components/Window';
import { AppType, WindowState } from './types';
import { DOCK_APPS, INITIAL_WINDOW_HEIGHT, INITIAL_WINDOW_WIDTH } from './constants';
import { GeminiChat } from './components/apps/GeminiChat';
import { AboutApp } from './components/apps/About';

// Initial state of apps
const getAppContent = (type: AppType) => {
  switch (type) {
    case AppType.GEMINI_ASSISTANT:
      return <GeminiChat />;
    case AppType.ABOUT:
      return <AboutApp />;
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

  // Generate a safe initial position so windows don't perfectly overlap
  const getInitialPosition = (index: number) => ({
    x: 100 + (index * 30),
    y: 80 + (index * 30)
  });

  const openApp = (type: AppType) => {
    // Check if already open
    const existingWindow = windows.find(w => w.type === type);
    
    if (existingWindow) {
      // If minimized, unminimize. Always bring to front.
      setWindows(prev => prev.map(w => 
        w.id === existingWindow.id 
          ? { ...w, isMinimized: false, zIndex: nextZIndex } 
          : w
      ));
      setNextZIndex(prev => prev + 1);
      return;
    }

    // Create new window
    const appInfo = DOCK_APPS.find(a => a.id === type);
    if (!appInfo) return;

    const newWindow: WindowState = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title: appInfo.name,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      position: getInitialPosition(windows.length),
      size: { width: INITIAL_WINDOW_WIDTH, height: INITIAL_WINDOW_HEIGHT },
      zIndex: nextZIndex,
      content: getAppContent(type)
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

  const openAppIds = windows.map(w => w.type);

  // Auto-open Gemini Chat on load
  React.useEffect(() => {
     if (windows.length === 0) {
         openApp(AppType.GEMINI_ASSISTANT);
     }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Desktop>
      <MenuBar />
      
      {/* Window Layer */}
      <div className="relative w-full h-full pointer-events-none">
        {windows.map(window => (
           // Pointer events auto re-enabled in Window component content
           <div key={window.id} className="pointer-events-auto"> 
              <Window
                windowState={window}
                onClose={closeWindow}
                onMinimize={minimizeWindow}
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