import React from 'react';
import { DesktopItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface DesktopIconProps {
  item: DesktopItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onOpen: (item: DesktopItem) => void;
  onDragStart?: (e: React.DragEvent, id: string) => void;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ 
  item, 
  isSelected, 
  onSelect, 
  onOpen,
  onDragStart,
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

  // Grid configuration
  const GRID_WIDTH = 100;
  const GRID_HEIGHT = 110;
  const MARGIN_TOP = 40; // Spacing for MenuBar
  const MARGIN_LEFT = 10;

  // Helper for icon styling based on type
  const getIconStyles = () => {
    switch(item.type) {
      case 'FOLDER':
        return 'text-blue-400 fill-blue-400/20';
      case 'APP':
        return 'text-purple-400 fill-purple-400/20';
      case 'FILE':
        return 'text-slate-200 fill-slate-200/20';
      default:
        return 'text-slate-300';
    }
  };
  
  return (
    <div 
      className={`
        absolute flex flex-col items-center gap-1 group cursor-pointer pointer-events-auto transition-transform
        active:scale-95
      `}
      style={{
        width: '96px',
        left: MARGIN_LEFT + (item.gridPos.x * GRID_WIDTH),
        top: MARGIN_TOP + (item.gridPos.y * GRID_HEIGHT)
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      draggable
      onDragStart={(e) => onDragStart?.(e, item.id)}
    >
      <div className={`
        w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-150 relative
        ${isSelected ? 'bg-white/20 border border-white/30 shadow-sm' : 'hover:bg-white/10'}
      `}>
        <Icon 
            size={42} 
            strokeWidth={1.5}
            className={`${getIconStyles()} drop-shadow-md filter`} 
        />
      </div>
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