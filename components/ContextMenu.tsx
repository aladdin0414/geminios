
import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Check } from 'lucide-react';

export interface ContextMenuItem {
  label?: string;
  action?: () => void;
  separator?: boolean;
  disabled?: boolean;
  danger?: boolean;
  checked?: boolean;
}

interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose }) => {
  const { t } = useLanguage();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Use mousedown to catch clicks anywhere
    document.addEventListener('mousedown', handleClickOutside);
    // Also close on window resize
    window.addEventListener('resize', onClose);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', onClose);
    };
  }, [onClose]);

  // Adjust position to prevent overflow (simple version)
  const style: React.CSSProperties = {
    top: y,
    left: x,
  };

  return (
    <div 
      ref={menuRef}
      className="fixed z-[9999] w-56 bg-white/90 dark:bg-[#2d2d2d]/90 backdrop-blur-xl rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.25)] border border-white/20 dark:border-white/10 py-1.5 text-slate-900 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-100 origin-top-left pointer-events-auto"
      style={style}
      onContextMenu={(e) => e.preventDefault()}
    >
      {items.map((item, index) => {
        if (item.separator) {
          return <div key={index} className="h-px bg-slate-200 dark:bg-slate-700/50 my-1.5 mx-1" />;
        }

        if (!item.label) return null;

        return (
          <button
            key={index}
            onClick={() => {
              if (!item.disabled && item.action) {
                item.action();
                onClose();
              }
            }}
            disabled={item.disabled}
            className={`
              w-full text-left px-3 py-1 rounded text-[13px] mx-1 mb-0.5 flex items-center gap-2 tracking-wide select-none
              ${item.disabled 
                ? 'text-slate-400 cursor-default' 
                : item.danger 
                  ? 'hover:bg-red-500 hover:text-white active:bg-red-600' 
                  : 'hover:bg-blue-500 hover:text-white active:bg-blue-600'}
            `}
            style={{ width: 'calc(100% - 8px)' }}
          >
            <span className="w-4 flex items-center justify-center flex-shrink-0">
                {item.checked && <Check size={12} strokeWidth={3} />}
            </span>
            <span>{t(item.label)}</span>
          </button>
        );
      })}
    </div>
  );
};
