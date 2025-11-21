
import React, { useRef, useState, useEffect } from 'react';
import { X, Minus, Square } from 'lucide-react';
import { WindowState } from '../types';

interface WindowProps {
  windowState: WindowState;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onResize: (id: string, width: number, height: number, x: number, y: number) => void;
}

export const Window: React.FC<WindowProps> = ({
  windowState,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onMove,
  onResize
}) => {
  const { id, title, position, size, zIndex, content, isMinimized, isMaximized } = windowState;
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  
  const MENU_BAR_HEIGHT = 32;
  // Dock is 16px bottom + 12px pad + 48px icon + 12px pad = 88px total height
  const DOCK_HEIGHT_ALLOWANCE = 88; 

  // Resize refs
  const resizeRef = useRef({ 
    startX: 0, startY: 0, 
    startWidth: 0, startHeight: 0, 
    startLeft: 0, startTop: 0,
    direction: '' 
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isResizing) return; // Don't drag if we are resizing
    
    e.stopPropagation(); // Prevent clicking through to desktop
    onFocus(id);
    
    // Only allow drag if clicking the header AND not maximized
    if (isMaximized) return;

    const headerHeight = 40; 
    const rect = windowRef.current?.getBoundingClientRect();
    
    // Check if click is in header area
    if (rect && e.clientY - rect.top <= headerHeight) {
      setIsDragging(true);
      dragOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  // Window Move Logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && windowRef.current) {
        e.preventDefault();
        const newX = e.clientX - dragOffset.current.x;
        let newY = e.clientY - dragOffset.current.y;
        
        // Constrain to Menu Bar height
        if (newY < MENU_BAR_HEIGHT) {
            newY = MENU_BAR_HEIGHT;
        }
        
        windowRef.current.style.left = `${newX}px`;
        windowRef.current.style.top = `${newY}px`;
      }
    };

    const handleMouseUp = () => {
      if (isDragging && windowRef.current) {
        setIsDragging(false);
        const currentLeft = parseFloat(windowRef.current.style.left);
        const currentTop = parseFloat(windowRef.current.style.top);
        onMove(id, currentLeft, currentTop);
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, id, onMove]);


  // Resize Logic
  const startResize = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation(); // Prevent dragging window
    e.preventDefault();
    if (isMaximized) return;

    onFocus(id);
    setIsResizing(true);
    
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: size.width,
      startHeight: size.height,
      startLeft: position.x,
      startTop: position.y,
      direction
    };
  };

  useEffect(() => {
    const handleResizeMove = (e: MouseEvent) => {
      if (!isResizing) return;
      e.preventDefault();

      const { startX, startY, startWidth, startHeight, startLeft, startTop, direction } = resizeRef.current;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startLeft;
      let newY = startTop;
      
      const MIN_WIDTH = 400;
      const MIN_HEIGHT = 300;

      if (direction.includes('e')) {
        newWidth = Math.max(MIN_WIDTH, startWidth + deltaX);
      }
      if (direction.includes('w')) {
        const w = Math.max(MIN_WIDTH, startWidth - deltaX);
        newWidth = w;
        newX = startLeft + (startWidth - w);
      }
      if (direction.includes('s')) {
        newHeight = Math.max(MIN_HEIGHT, startHeight + deltaY);
      }
      if (direction.includes('n')) {
        let h = Math.max(MIN_HEIGHT, startHeight - deltaY);
        let y = startTop + (startHeight - h);
        
        // Constrain to Menu Bar height
        if (y < MENU_BAR_HEIGHT) {
            y = MENU_BAR_HEIGHT;
            h = (startTop + startHeight) - MENU_BAR_HEIGHT;
        }
        
        newHeight = h;
        newY = y;
      }

      onResize(id, newWidth, newHeight, newX, newY);
    };

    const handleResizeUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeUp);
    };
  }, [isResizing, id, onResize]);


  if (isMinimized) return null;

  // Styles based on state (Normal vs Maximized)
  const windowStyle = isMaximized 
    ? {
        top: '32px', // Match MenuBar height
        left: 0,
        width: '100%',
        height: `calc(100% - 32px - ${DOCK_HEIGHT_ALLOWANCE}px)`,
        zIndex: zIndex,
        borderRadius: '0 0 12px 12px', // Slight rounding at bottom
        boxShadow: 'none' // Remove shadow when maximized
      }
    : {
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex: zIndex,
      };

  return (
    <div
      ref={windowRef}
      onMouseDown={handleMouseDown}
      onContextMenu={(e) => e.stopPropagation()} // Stop context menu propagation to allow default browser menu or app menu
      style={windowStyle}
      className={`
        absolute flex flex-col
        bg-white dark:bg-slate-900 
        ${!isMaximized ? 'rounded-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden shadow-2xl' : ''}
        backdrop-blur-xl
        ${(isDragging || isResizing) ? 'transition-none' : 'transition-[width,height,box-shadow] duration-200 ease-in-out'}
        ${isResizing ? 'select-none pointer-events-none' : ''} 
      `}
    >
      {/* Resize Handles */}
      {!isMaximized && (
        <>
          {/* Edges */}
          <div onMouseDown={(e) => startResize(e, 'n')} className="absolute top-0 left-0 right-0 h-1.5 cursor-n-resize z-50 hover:bg-blue-500/10 transition-colors" />
          <div onMouseDown={(e) => startResize(e, 's')} className="absolute bottom-0 left-0 right-0 h-1.5 cursor-s-resize z-50 hover:bg-blue-500/10 transition-colors" />
          <div onMouseDown={(e) => startResize(e, 'w')} className="absolute top-0 bottom-0 left-0 w-1.5 cursor-w-resize z-50 hover:bg-blue-500/10 transition-colors" />
          <div onMouseDown={(e) => startResize(e, 'e')} className="absolute top-0 bottom-0 right-0 w-1.5 cursor-e-resize z-50 hover:bg-blue-500/10 transition-colors" />
          
          {/* Corners */}
          <div onMouseDown={(e) => startResize(e, 'nw')} className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize z-50" />
          <div onMouseDown={(e) => startResize(e, 'ne')} className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize z-50" />
          <div onMouseDown={(e) => startResize(e, 'sw')} className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize z-50" />
          <div onMouseDown={(e) => startResize(e, 'se')} className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50" />
        </>
      )}

      {/* Traffic Lights Header */}
      <div 
        className={`
          h-10 bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 
          flex items-center px-4 justify-between flex-shrink-0 select-none
          ${isResizing ? 'pointer-events-auto' : ''}
        `}
        onDoubleClick={() => onMaximize(id)} 
      >
        <div className="flex items-center gap-2 group z-20">
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(id); }}
            className="w-3 h-3 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 text-transparent hover:text-red-900 transition-colors shadow-sm"
          >
            <X size={8} strokeWidth={3} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onMinimize(id); }}
            className="w-3 h-3 rounded-full bg-yellow-500 flex items-center justify-center hover:bg-yellow-600 text-transparent hover:text-yellow-900 transition-colors shadow-sm"
          >
            <Minus size={8} strokeWidth={3} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onMaximize(id); }}
            className="w-3 h-3 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600 text-transparent hover:text-green-900 transition-colors shadow-sm"
          >
            <Square size={6} strokeWidth={3} fill="currentColor" />
          </button>
        </div>
        <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex-1 text-center mr-14 pointer-events-none">
          {title}
        </div>
      </div>

      {/* Content */}
      <div className={`flex-1 relative overflow-hidden ${isResizing ? 'pointer-events-none' : 'cursor-auto'}`} onMouseDown={(e) => e.stopPropagation()}>
        {content}
        {/* Overlay during resize to prevent iframe capturing mouse events */}
        {isResizing && <div className="absolute inset-0 z-50 bg-transparent" />}
      </div>
    </div>
  );
};
