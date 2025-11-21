import { AppType } from './types';
import { 
  MessageSquare, 
  Info, 
  Settings, 
  Terminal, 
  Cpu,
  Folder
} from 'lucide-react';

export const INITIAL_WINDOW_WIDTH = 600;
export const INITIAL_WINDOW_HEIGHT = 450;

// Using a high-quality landscape from Unsplash that resembles MacOS wallpapers
export const WALLPAPER_URL = "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=2070&auto=format&fit=crop";

export const DOCK_APPS = [
  {
    id: AppType.GEMINI_ASSISTANT,
    name: 'Gemini AI',
    icon: MessageSquare,
    color: 'bg-blue-500'
  },
  {
    id: AppType.TERMINAL,
    name: 'Terminal',
    icon: Terminal,
    color: 'bg-gray-800'
  },
  {
    id: AppType.SYSTEM_PREFS,
    name: 'System Settings',
    icon: Settings,
    color: 'bg-gray-400'
  },
  {
    id: AppType.ABOUT,
    name: 'About',
    icon: Info,
    color: 'bg-indigo-500'
  }
];

export const SYSTEM_FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";