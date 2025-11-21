import { AppType, DesktopItem } from './types';
import { 
  MessageSquare, 
  Info, 
  Settings, 
  Terminal, 
  Cpu,
  Folder,
  FileText,
  Briefcase,
  Image as ImageIcon,
  Music,
  Compass
} from 'lucide-react';

export const INITIAL_WINDOW_WIDTH = 600;
export const INITIAL_WINDOW_HEIGHT = 450;

// Using a high-quality landscape from Unsplash that resembles MacOS wallpapers
export const WALLPAPER_URL = "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=2070&auto=format&fit=crop";

export const DOCK_APPS = [
  {
    id: AppType.FINDER,
    name: 'Finder',
    icon: Folder, // Using Folder as Finder icon for simplicity
    color: 'bg-blue-600 text-white'
  },
  {
    id: AppType.BROWSER,
    name: 'Safari',
    icon: Compass,
    color: 'bg-white text-blue-500'
  },
  {
    id: AppType.GEMINI_ASSISTANT,
    name: 'Gemini AI',
    icon: MessageSquare,
    color: 'bg-gradient-to-tr from-blue-500 to-purple-600 text-white'
  },
  {
    id: AppType.TERMINAL,
    name: 'Terminal',
    icon: Terminal,
    color: 'bg-slate-800 text-white'
  },
  {
    id: AppType.SYSTEM_PREFS,
    name: 'Settings',
    icon: Settings,
    color: 'bg-slate-500 text-white'
  },
  {
    id: AppType.ABOUT,
    name: 'About',
    icon: Info,
    color: 'bg-indigo-500 text-white'
  }
];

export const DESKTOP_ITEMS: DesktopItem[] = [
  {
    id: 'shortcut-gemini',
    type: 'APP',
    label: 'Gemini AI',
    icon: MessageSquare,
    appId: AppType.GEMINI_ASSISTANT,
    gridPos: { x: 0, y: 0 }
  },
  {
    id: 'shortcut-safari',
    type: 'APP',
    label: 'Safari',
    icon: Compass,
    appId: AppType.BROWSER,
    gridPos: { x: 0, y: 1 }
  },
  {
    id: 'folder-projects',
    type: 'FOLDER',
    label: 'Project Alpha',
    icon: Briefcase,
    gridPos: { x: 0, y: 2 }
  },
  {
    id: 'folder-design',
    type: 'FOLDER',
    label: 'Design Assets',
    icon: ImageIcon,
    gridPos: { x: 1, y: 0 }
  },
  {
    id: 'file-notes',
    type: 'FILE',
    label: 'Meeting Notes.txt',
    icon: FileText,
    gridPos: { x: 1, y: 1 }
  },
  {
    id: 'file-music',
    type: 'FILE',
    label: 'Chill Mix.mp3',
    icon: Music,
    gridPos: { x: 1, y: 2 }
  }
];

export const SYSTEM_FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";