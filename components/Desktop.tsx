
import React, { useState, useCallback } from 'react';
import { DesktopItem } from '../types';
import { DesktopIcon } from './DesktopIcon';
import { ContextMenu, ContextMenuItem } from './ContextMenu';

interface DesktopProps {
  children: React.ReactNode;
  items: DesktopItem[];
  onOpenItem: (item: DesktopItem) => void;
  onMoveItem?: (id: string, x: number, y: number) => void;
  onDeleteItem?: (id: string) => void;
  onCreateFolder?: (gridX: number, gridY: number) => void;
  onCreateFile?: (gridX: number, gridY: number) => void;
  onOpenSettings?: () => void;
  onRenameItem?: (id: string, newName: string) => void;
  onSortItems?: () => void;
  wallpaper: string;
}

export const Desktop: React.FC<DesktopProps> = ({ 
  children, 
  items, 
  onOpenItem, 
  onMoveItem, 
  onDeleteItem,
  onCreateFolder,
  onCreateFile,
  onOpenSettings,
  onRenameItem,
  onSortItems,
  wallpaper 
}) => {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  
  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{
    show: boolean;
    x: number;
    y: number;
    type: 'DESKTOP' | 'ICON';
    targetId?: string;
    gridPos?: { x: number, y: number }; // Store grid pos for creating items at click location
  }>({ show: false, x: 0, y: 0, type: 'DESKTOP' });

  // Grid Constants (Duplicated from DesktopIcon logic for now, ideally shared)
  const GRID_WIDTH = 100;
  const GRID_HEIGHT = 110;
  const MARGIN_TOP = 40; 
  const MARGIN_RIGHT = 10;

  const calculateGridPos = (clientX: number, clientY: number) => {
    const screenWidth = window.innerWidth;
    const distanceFromRight = screenWidth - clientX;
    
    const x = Math.max(0, Math.floor((distanceFromRight - MARGIN_RIGHT) / GRID_WIDTH));
    const y = Math.max(0, Math.floor((clientY - MARGIN_TOP) / GRID_HEIGHT));
    return { x, y };
  };

  const handleBackgroundClick = () => {
    setSelectedId(null);
    setRenamingId(null);
    if (contextMenu.show) setContextMenu({ ...contextMenu, show: false });
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    if (e.dataTransfer) {
       e.dataTransfer.effectAllowed = "move";
    }
    if (contextMenu.show) setContextMenu({ ...contextMenu, show: false });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Allow drop
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedId || !onMoveItem) return;

    const { x: dropX, y: dropY } = calculateGridPos(e.clientX, e.clientY);

    // Collision Detection & Resolution
    const isOccupied = (x: number, y: number) => {
      return items.some(item => 
        item.id !== draggedId && 
        item.gridPos.x === x && 
        item.gridPos.y === y
      );
    };

    let finalX = dropX;
    let finalY = dropY;

    if (isOccupied(finalX, finalY)) {
      let found = false;
      let radius = 1;
      const maxRadius = 10; 

      while (!found && radius <= maxRadius) {
        for (let x = dropX - radius; x <= dropX + radius; x++) {
          for (let y = dropY - radius; y <= dropY + radius; y++) {
            if (x >= 0 && y >= 0) { 
              if (!isOccupied(x, y)) {
                finalX = x;
                finalY = y;
                found = true;
                break;
              }
            }
          }
          if (found) break;
        }
        radius++;
      }
    }

    onMoveItem(draggedId, finalX, finalY);
    setDraggedId(null);
  };

  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const gridPos = calculateGridPos(e.clientX, e.clientY);
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      type: 'DESKTOP',
      gridPos
    });
  };

  const handleIconContextMenu = (e: React.MouseEvent, item: DesktopItem) => {
    e.preventDefault();
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      type: 'ICON',
      targetId: item.id
    });
  };
  
  const handleRenameSubmit = (id: string, newName: string) => {
      onRenameItem?.(id, newName);
      setRenamingId(null);
  };

  // Generate Menu Items
  const getMenuItems = (): ContextMenuItem[] => {
    if (contextMenu.type === 'DESKTOP') {
      return [
        { 
          label: 'desktop.newFolder', 
          action: () => contextMenu.gridPos && onCreateFolder?.(contextMenu.gridPos.x, contextMenu.gridPos.y) 
        },
        { 
          label: 'desktop.newFile', 
          action: () => contextMenu.gridPos && onCreateFile?.(contextMenu.gridPos.x, contextMenu.gridPos.y) 
        },
        { separator: true },
        { label: 'desktop.refresh', action: () => window.location.reload() },
        { label: 'desktop.sort', action: () => onSortItems?.() },
        { separator: true },
        { label: 'desktop.changeWallpaper', action: onOpenSettings },
      ];
    } else if (contextMenu.type === 'ICON' && contextMenu.targetId) {
      const item = items.find(i => i.id === contextMenu.targetId);
      if (!item) return [];

      const isTrashable = item.type !== 'APP'; // Don't delete system shortcuts (for now)

      return [
        { label: 'context.open', action: () => onOpenItem(item) },
        { separator: true },
        { label: 'context.getInfo', action: () => alert(`Info for ${item.label}`) },
        { 
          label: 'context.rename', 
          disabled: item.type === 'APP',
          action: () => setRenamingId(item.id) 
        }, 
        { separator: true },
        { 
          label: 'context.delete', 
          danger: true, 
          disabled: !isTrashable,
          action: () => onDeleteItem?.(item.id) 
        },
      ];
    }
    return [];
  };

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden bg-cover bg-center select-none transition-all duration-500"
      style={{ backgroundImage: `url(${wallpaper})` }}
      onClick={handleBackgroundClick}
      onContextMenu={handleDesktopContextMenu}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />

      {/* Desktop Icons Layer */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {items.map((item) => (
          <DesktopIcon
            key={item.id}
            item={item}
            isSelected={selectedId === item.id}
            isRenaming={renamingId === item.id}
            onSelect={setSelectedId}
            onOpen={onOpenItem}
            onDragStart={handleDragStart}
            onContextMenu={handleIconContextMenu}
            onRename={(newName) => handleRenameSubmit(item.id, newName)}
          />
        ))}
      </div>

      {/* Context Menu */}
      {contextMenu.show && (
        <ContextMenu 
          x={contextMenu.x} 
          y={contextMenu.y} 
          items={getMenuItems()} 
          onClose={() => setContextMenu({ ...contextMenu, show: false })} 
        />
      )}

      {/* Children (Windows, Dock, MenuBar) */}
      <div className="relative z-10 w-full h-full pointer-events-none">
         {children}
      </div>
    </div>
  );
};
