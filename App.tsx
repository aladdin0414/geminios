
import React, { useState, useCallback, useEffect } from 'react';
import { Desktop } from './components/Desktop';
import { MenuBar } from './components/MenuBar';
import { Dock } from './components/Dock';
import { Window } from './components/Window';
import { LoginPage } from './components/LoginPage';
import { AppType, WindowState, DesktopItem } from './types';
import { DOCK_APPS, INITIAL_WINDOW_HEIGHT, INITIAL_WINDOW_WIDTH, DESKTOP_ITEMS, WALLPAPER_URL } from './constants';
import { GeminiChat } from './components/apps/GeminiChat';
import { AboutApp } from './components/apps/About';
import { Finder } from './components/apps/Finder';
import { Browser } from './components/apps/Browser';
import { Minesweeper } from './components/apps/Minesweeper';
import { SystemSettings } from './components/apps/SystemSettings';
import { AppStore } from './components/apps/AppStore';
import { TextEditor } from './components/apps/TextEditor';
import { Trash } from './components/apps/Trash';
import { useLanguage } from './contexts/LanguageContext';
import { Folder, FileText } from 'lucide-react';

const App: React.FC = () => {
  const { t } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [nextZIndex, setNextZIndex] = useState(10);
  const [desktopItems, setDesktopItems] = useState<DesktopItem[]>(DESKTOP_ITEMS);
  
  // System State
  const [wallpaper, setWallpaper] = useState(WALLPAPER_URL);
  const [isDark, setIsDark] = useState(false);

  // Apply dark mode to html element
  useEffect(() => {
    if (isDark) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

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
        case AppType.MINESWEEPER:
        return <Minesweeper />;
        case AppType.APP_STORE:
        return <AppStore />;
        case AppType.TEXT_EDITOR:
        return <TextEditor />;
        case AppType.TRASH:
        return <Trash />;
        case AppType.SYSTEM_PREFS:
        return (
            <SystemSettings 
                isDark={isDark} 
                setTheme={setIsDark} 
                wallpaper={wallpaper}
                setWallpaper={setWallpaper}
            />
        );
        case AppType.TERMINAL:
        return <div className="p-4 bg-black h-full font-mono text-green-400 text-sm">gemini-os:~ user$ echo "Hello World"<br/>Hello World<br/>gemini-os:~ user$ _</div>;
        default:
        return null;
    }
  };

  // Generate a safe initial position so windows don't perfectly overlap
  const getInitialPosition = (index: number) => ({
    x: 100 + (index * 30),
    y: 80 + (index * 30)
  });

  // Get initial window size based on app type
  const getInitialSize = (type: AppType) => {
    if (type === AppType.MINESWEEPER) {
        return { width: 482, height: 628 };
    }
    return { width: INITIAL_WINDOW_WIDTH, height: INITIAL_WINDOW_HEIGHT };
  };

  const openApp = (type: AppType, props?: any) => {
    const appInfo = DOCK_APPS.find(a => a.id === type);
    const translatedAppName = appInfo ? t(appInfo.name) : 'Window';
    
    let windowTitle = translatedAppName;
    if (props?.title) {
        windowTitle = t(props.title);
    }

    const existingWindow = windows.find(w => w.type === type && w.title === windowTitle);
    
    if (existingWindow) {
      setWindows(prev => prev.map(w => 
        w.id === existingWindow.id 
          ? { ...w, isMinimized: false, zIndex: nextZIndex } 
          : w
      ));
      setNextZIndex(prev => prev + 1);
      return;
    }

    const newWindow: WindowState = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title: windowTitle,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      position: getInitialPosition(windows.length),
      size: getInitialSize(type),
      zIndex: nextZIndex,
      content: getAppContent(type, { ...props, title: windowTitle })
    };

    setWindows([...windows, newWindow]);
    setNextZIndex(prev => prev + 1);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  };

  const handleCloseApp = (type: AppType) => {
      setWindows(prev => prev.filter(w => w.type !== type));
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

  const resizeWindow = useCallback((id: string, width: number, height: number, x: number, y: number) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, size: { width, height }, position: { x, y } } : w
    ));
  }, []);

  // Desktop Management Logic
  const handleDesktopItemOpen = (item: DesktopItem) => {
    if (item.type === 'APP' && item.appId) {
      openApp(item.appId);
    } else if (item.type === 'FOLDER') {
      openApp(AppType.FINDER, { title: item.label });
    } else if (item.type === 'FILE') {
      if (item.id === 'file-notes') {
        openApp(AppType.TEXT_EDITOR);
      } else {
        openApp(AppType.TERMINAL); 
      }
    }
  };

  const handleDesktopItemMove = (id: string, x: number, y: number) => {
    setDesktopItems(prev => prev.map(item => 
      item.id === id ? { ...item, gridPos: { x, y } } : item
    ));
  };

  const handleCreateFolder = (gridX: number, gridY: number) => {
    const newId = `folder-${Date.now()}`;
    const newItem: DesktopItem = {
        id: newId,
        type: 'FOLDER',
        label: 'New Folder',
        icon: Folder,
        gridPos: { x: gridX, y: gridY }
    };
    setDesktopItems(prev => [...prev, newItem]);
  };

  const handleCreateFile = (gridX: number, gridY: number) => {
    const newId = `file-${Date.now()}`;
    const newItem: DesktopItem = {
        id: newId,
        type: 'FILE',
        label: 'Untitled.txt',
        icon: FileText,
        gridPos: { x: gridX, y: gridY }
    };
    setDesktopItems(prev => [...prev, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    setDesktopItems(prev => prev.filter(i => i.id !== id));
  };
  
  const handleRenameItem = (id: string, newName: string) => {
      if (!newName.trim()) return;
      setDesktopItems(prev => prev.map(item => 
          item.id === id ? { ...item, label: newName } : item
      ));
  };

  const handleSortItems = () => {
     const sorted = [...desktopItems].sort((a, b) => {
         const labelA = t(a.label) || a.label;
         const labelB = t(b.label) || b.label;
         return labelA.localeCompare(labelB);
     });
     
     // Re-layout items column by column from top-right
     // Assuming approx 6 items fit vertically
     const ITEMS_PER_COL = 6;
     
     const newItems = sorted.map((item, index) => ({
         ...item,
         gridPos: {
             x: Math.floor(index / ITEMS_PER_COL), 
             y: index % ITEMS_PER_COL
         }
     }));
     setDesktopItems(newItems);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setWindows([]); 
  };

  const openAppIds = windows.map(w => w.type);

  useEffect(() => {
     if (isLoggedIn && windows.length === 0) {
         openApp(AppType.GEMINI_ASSISTANT);
     }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <Desktop 
      items={desktopItems} 
      onOpenItem={handleDesktopItemOpen}
      onMoveItem={handleDesktopItemMove}
      onDeleteItem={handleDeleteItem}
      onCreateFolder={handleCreateFolder}
      onCreateFile={handleCreateFile}
      onOpenSettings={() => openApp(AppType.SYSTEM_PREFS)}
      onRenameItem={handleRenameItem}
      onSortItems={handleSortItems}
      wallpaper={wallpaper}
    >
      <MenuBar 
        onLogout={handleLogout}
        onAboutClick={() => openApp(AppType.ABOUT)}
        onSettingsClick={() => openApp(AppType.SYSTEM_PREFS)}
        onAppStoreClick={() => openApp(AppType.APP_STORE)}
      />
      
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
                onResize={resizeWindow}
              />
           </div>
        ))}
      </div>

      <Dock 
        onAppClick={openApp} 
        onAppClose={handleCloseApp}
        openApps={openAppIds} 
      />
    </Desktop>
  );
};

export default App;
