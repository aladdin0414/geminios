import React, { useRef, useState, useEffect } from 'react';
import { X, Minus, Square } from 'lucide-react';
import { WindowState } from '../types';

interface WindowProps {
  windowState: WindowState;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onFocus: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
}

export const Window: React.FC<WindowProps> = ({
  windowState,
  onClose,
  onMinimize,
  onFocus,
  onMove
}) => {
  const { id, title, position, size, zIndex, content, isMinimized } = windowState;
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent clicking through to desktop
    onFocus(id);
    
    // Only allow drag if clicking the header
    const headerHeight = 40; 
    const rect = windowRef.current?.getBoundingClientRect();
    
    if (rect && e.clientY - rect.top <= headerHeight) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        onMove(id, newX, newY);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, id, onMove]);

  if (isMinimized) return null;

  return (
    <div
      ref={windowRef}
      onMouseDown={handleMouseDown}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex: zIndex,
      }}
      className={`
        absolute flex flex-col
        bg-white dark:bg-slate-900 
        rounded-xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50
        overflow-hidden backdrop-blur-xl
        transition-shadow duration-200
        ${isDragging ? 'cursor-grabbing' : 'cursor-default'}
      `}
    >
      {/* Traffic Lights Header */}
      <div className="h-10 bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center px-4 justify-between flex-shrink-0 select-none">
        <div className="flex items-center gap-2 group">
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(id); }}
            className="w-3 h-3 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 text-transparent hover:text-red-900 transition-colors"
          >
            <X size={8} strokeWidth={3} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onMinimize(id); }}
            className="w-3 h-3 rounded-full bg-yellow-500 flex items-center justify-center hover:bg-yellow-600 text-transparent hover:text-yellow-900 transition-colors"
          >
            <Minus size={8} strokeWidth={3} />
          </button>
          <button 
            className="w-3 h-3 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600 text-transparent hover:text-green-900 transition-colors"
          >
            <Square size={6} strokeWidth={3} fill="currentColor" />
          </button>
        </div>
        <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex-1 text-center mr-14">
          {title}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 relative overflow-hidden cursor-auto" onMouseDown={(e) => e.stopPropagation()}>
        {content}
      </div>
    </div>
  );
};