
import { AppType, DesktopItem } from './types';
import { 
  MessageSquare, 
  Info, 
  Settings, 
  Terminal, 
  Folder,
  FileText,
  Briefcase,
  Image as ImageIcon,
  Music,
  Compass,
  Gamepad2,
  LayoutGrid,
  StickyNote
} from 'lucide-react';

export const INITIAL_WINDOW_WIDTH = 600;
export const INITIAL_WINDOW_HEIGHT = 450;

// Default wallpaper (Ventura)
export const WALLPAPER_URL = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop";

export const WALLPAPERS = [
  { id: 'sierra', url: "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=2070&auto=format&fit=crop", name: "Sierra" },
  { id: 'monterey', url: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=2074&auto=format&fit=crop", name: "Abstract" },
  { id: 'ventura', url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop", name: "Ventura" },
  { id: 'sonoma', url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000&auto=format&fit=crop", name: "Sonoma" },
  { id: 'aurora', url: "https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?q=80&w=2000&auto=format&fit=crop", name: "Aurora" },
];

export const DOCK_APPS = [
  {
    id: AppType.FINDER,
    name: 'app.finder',
    icon: Folder, 
    color: 'bg-blue-600 text-white'
  },
  {
    id: AppType.BROWSER,
    name: 'app.safari',
    icon: Compass,
    color: 'bg-white text-blue-500'
  },
  {
    id: AppType.APP_STORE,
    name: 'app.appstore',
    icon: LayoutGrid,
    color: 'bg-blue-500 text-white'
  },
  {
    id: AppType.GEMINI_ASSISTANT,
    name: 'app.gemini',
    icon: MessageSquare,
    color: 'bg-gradient-to-tr from-blue-500 to-purple-600 text-white'
  },
  {
    id: AppType.TEXT_EDITOR,
    name: 'app.texteditor',
    icon: StickyNote,
    color: 'bg-yellow-400 text-white'
  },
  {
    id: AppType.MINESWEEPER,
    name: 'app.minesweeper',
    icon: Gamepad2,
    color: 'bg-emerald-500 text-white'
  },
  {
    id: AppType.TERMINAL,
    name: 'app.terminal',
    icon: Terminal,
    color: 'bg-slate-800 text-white'
  },
  {
    id: AppType.SYSTEM_PREFS,
    name: 'app.settings',
    icon: Settings,
    color: 'bg-slate-500 text-white'
  },
  {
    id: AppType.ABOUT,
    name: 'app.about',
    icon: Info,
    color: 'bg-indigo-500 text-white'
  }
];

export const DESKTOP_ITEMS: DesktopItem[] = [
  {
    id: 'shortcut-gemini',
    type: 'APP',
    label: 'desktop.shortcut.gemini',
    icon: MessageSquare,
    appId: AppType.GEMINI_ASSISTANT,
    gridPos: { x: 0, y: 0 }
  },
  {
    id: 'shortcut-safari',
    type: 'APP',
    label: 'desktop.shortcut.safari',
    icon: Compass,
    appId: AppType.BROWSER,
    gridPos: { x: 0, y: 1 }
  },
  {
    id: 'folder-projects',
    type: 'FOLDER',
    label: 'desktop.folder.projects',
    icon: Briefcase,
    gridPos: { x: 0, y: 2 }
  },
  {
    id: 'folder-design',
    type: 'FOLDER',
    label: 'desktop.folder.design',
    icon: ImageIcon,
    gridPos: { x: 1, y: 0 }
  },
  {
    id: 'file-notes',
    type: 'FILE',
    label: 'desktop.file.notes',
    icon: FileText,
    gridPos: { x: 1, y: 1 }
  },
  {
    id: 'file-music',
    type: 'FILE',
    label: 'desktop.file.music',
    icon: Music,
    gridPos: { x: 1, y: 2 }
  }
];

export const SYSTEM_FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
