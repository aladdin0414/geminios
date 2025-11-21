
import React, { useState } from 'react';
import { DOCK_APPS } from '../constants';
import { AppType } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { ContextMenu, ContextMenuItem } from './ContextMenu';

interface DockProps {
  onAppClick: (type: AppType) => void;
  onAppClose: (type: AppType) => void;
  openApps: AppType[];
}

export const Dock: React.FC<DockProps> = ({ onAppClick, onAppClose, openApps }) => {
  const { t } = useLanguage();
  const [contextMenu, setContextMenu] = useState<{
      show: boolean;
      x: number;
      y: number;
      appId?: AppType;
  }>({ show: false, x: 0, y: 0 });

  const handleContextMenu = (e: React.MouseEvent, appId: AppType) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Calculate position to show menu ABOVE the cursor since Dock is at bottom
      // A simplified visual fix to prevent menu going off-screen
      const menuHeightEstimate = 150; 
      const adjustedY = Math.min(e.clientY, window.innerHeight - menuHeightEstimate);

      setContextMenu({
          show: true,
          x: e.clientX,
          y: adjustedY,
          appId
      });
  };

  const getMenuItems = (): ContextMenuItem[] => {
      if (!contextMenu.appId) return [];
      const isOpen = openApps.includes(contextMenu.appId);
      
      return [
          { 
              label: 'context.open', 
              action: () => contextMenu.appId && onAppClick(contextMenu.appId) 
          },
          { separator: true },
          {
             label: 'context.keepInDock',
             checked: true, // Static dock for this demo, so always checked
             action: () => {} 
          },
          { separator: true },
          {
              label: 'context.quit',
              disabled: !isOpen,
              action: () => contextMenu.appId && onAppClose(contextMenu.appId)
          }
      ];
  };

  return (
    <>
      <div 
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 pointer-events-auto"
          onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
      >
        <div className="bg-white/20 dark:bg-black/20 backdrop-blur-xl border border-white/20 rounded-2xl p-3 shadow-2xl flex items-end gap-3">
          {DOCK_APPS.map((app) => {
            const isOpen = openApps.includes(app.id);
            return (
              <div key={app.id} className="group relative flex flex-col items-center gap-1">
                <button
                  onClick={() => onAppClick(app.id)}
                  onContextMenu={(e) => handleContextMenu(e, app.id)}
                  className={`
                    ${app.color} w-12 h-12 rounded-xl flex items-center justify-center
                    shadow-lg transition-all duration-300 ease-out
                    hover:-translate-y-2 hover:scale-110
                  `}
                >
                  <app.icon size={24} />
                </button>
                {/* Tooltip */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap">
                  {t(app.name)}
                </div>
                {/* Open Indicator */}
                <div className={`w-1 h-1 rounded-full bg-white/80 ${isOpen ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Render ContextMenu outside the transformed Dock container to fix positioning */}
      {contextMenu.show && (
        <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            items={getMenuItems()}
            onClose={() => setContextMenu({ ...contextMenu, show: false })}
        />
      )}
    </>
  );
};
