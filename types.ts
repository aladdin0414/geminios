import React, { ReactNode } from 'react';

export enum AppType {
  GEMINI_ASSISTANT = 'GEMINI_ASSISTANT',
  ABOUT = 'ABOUT',
  SYSTEM_PREFS = 'SYSTEM_PREFS',
  TERMINAL = 'TERMINAL',
  FINDER = 'FINDER',
  BROWSER = 'BROWSER',
  MINESWEEPER = 'MINESWEEPER',
}

export interface WindowState {
  id: string;
  type: AppType;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  content?: ReactNode;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface IconProps {
  size?: number;
  className?: string;
}

export interface DesktopItem {
  id: string;
  type: 'APP' | 'FOLDER' | 'FILE';
  label: string;
  icon: React.ElementType;
  appId?: AppType;
  gridPos: { x: number; y: number };
}