import React from 'react';
import { WALLPAPER_URL } from '../constants';

interface DesktopProps {
  children: React.ReactNode;
}

export const Desktop: React.FC<DesktopProps> = ({ children }) => {
  return (
    <div 
      className="relative w-screen h-screen overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${WALLPAPER_URL})` }}
    >
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />
      {children}
    </div>
  );
};