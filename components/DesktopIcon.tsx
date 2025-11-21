
import React from 'react';
import { DesktopItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { DOCK_APPS } from '../constants';

interface DesktopIconProps {
  item: DesktopItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onOpen: (item: DesktopItem) => void;
  onDragStart?: (e: React.DragEvent, id: string) => void;
  onContextMenu?: (e: React.MouseEvent, item: DesktopItem) => void;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ 
  item, 
  isSelected, 
  onSelect, 
  onOpen,
  onDragStart,
  onContextMenu
}) => {
  const { t } = useLanguage();
  const Icon = item.icon;
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(item.id);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpen(item);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (onContextMenu) {
      e.stopPropagation(); // Prevent desktop context menu
      onSelect(item.id); // Select the item being right-clicked
      onContextMenu(e, item);
    }
  };

  // Grid configuration
  const GRID_WIDTH = 100;
  const GRID_HEIGHT = 110;
  const MARGIN_TOP = 40; // Spacing for MenuBar
  const MARGIN_RIGHT = 10; // Align to right

  // Helper for icon styling based on type
  // Returns the tailwind classes for the background container
  const getIconStyles = () => {
    if (item.type === 'APP' && item.appId) {
        const dockApp = DOCK_APPS.find(app => app.id === item.appId);
        if (dockApp) {
            return dockApp.color;
        }
    }

    switch(item.type) {
      case 'FOLDER':
        return 'bg-blue-400 text-white'; // Mac-like blue folder
      case 'FILE':
        return 'bg-slate-50 text-slate-500 border border-slate-200'; // White/light gray document
      default:
        return 'bg-slate-400 text-white';
    }
  };

  const containerStyles = getIconStyles();
  
  return (
    <div 
      className={`
        absolute flex flex-col items-center gap-1 group cursor-pointer pointer-events-auto transition-transform
        active:scale-95
      `}
      style={{
        width: '96px',
        right: MARGIN_RIGHT + (item.gridPos.x * GRID_WIDTH), // Use right positioning
        top: MARGIN_TOP + (item.gridPos.y * GRID_HEIGHT)
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      draggable
      onDragStart={(e) => onDragStart?.(e, item.id)}
    >
      {/* Icon Container (Squircle) */}
      <div className={`
        w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-200 relative
        ${containerStyles}
        ${isSelected ? 'ring-2 ring-white/70 brightness-110' : 'hover:brightness-110'}
      `}>
        <Icon 
            size={30} 
            strokeWidth={2}
            className="" 
        />
      </div>

      {/* Label */}
      <span className={`
        text-[11px] font-medium text-center px-1.5 py-0.5 rounded leading-tight select-none max-w-full truncate w-full
        ${isSelected 
          ? 'bg-blue-600 text-white' 
          : 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'}
      `}>
        {t(item.label)}
      </span>
    </div>
  );
};
