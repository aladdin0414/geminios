import React, { useState } from 'react';
import { WALLPAPER_URL } from '../constants';
import { DesktopItem } from '../types';
import { DesktopIcon } from './DesktopIcon';

interface DesktopProps {
  children: React.ReactNode;
  items: DesktopItem[];
  onOpenItem: (item: DesktopItem) => void;
  onMoveItem?: (id: string, x: number, y: number) => void;
}

export const Desktop: React.FC<DesktopProps> = ({ children, items, onOpenItem, onMoveItem }) => {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleBackgroundClick = () => {
    setSelectedId(null);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    if (e.dataTransfer) {
       e.dataTransfer.effectAllowed = "move";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Allow drop
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedId || !onMoveItem) return;

    // Grid Layout Configuration (Must match DesktopIcon)
    const GRID_WIDTH = 100;
    const GRID_HEIGHT = 110;
    const MARGIN_TOP = 40; 
    const MARGIN_LEFT = 10;

    // Calculate Grid Position
    const dropX = Math.max(0, Math.floor((e.clientX - MARGIN_LEFT) / GRID_WIDTH));
    const dropY = Math.max(0, Math.floor((e.clientY - MARGIN_TOP) / GRID_HEIGHT));

    // Collision Detection & Resolution
    // Function to check if a spot is taken
    const isOccupied = (x: number, y: number) => {
      return items.some(item => 
        item.id !== draggedId && 
        item.gridPos.x === x && 
        item.gridPos.y === y
      );
    };

    let finalX = dropX;
    let finalY = dropY;

    // If occupied, find the nearest empty slot
    if (isOccupied(finalX, finalY)) {
      let found = false;
      let radius = 1;
      const maxRadius = 10; // Prevent infinite loops

      while (!found && radius <= maxRadius) {
        // Simple spiral/square search around the target
        for (let x = dropX - radius; x <= dropX + radius; x++) {
          for (let y = dropY - radius; y <= dropY + radius; y++) {
            if (x >= 0 && y >= 0) { // Ensure within bounds
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

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden bg-cover bg-center select-none"
      style={{ backgroundImage: `url(${WALLPAPER_URL})` }}
      onClick={handleBackgroundClick}
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
            onSelect={setSelectedId}
            onOpen={onOpenItem}
            onDragStart={handleDragStart}
          />
        ))}
      </div>

      {/* Children (Windows, Dock, MenuBar) */}
      <div className="relative z-10 w-full h-full pointer-events-none">
         {children}
      </div>
    </div>
  );
};