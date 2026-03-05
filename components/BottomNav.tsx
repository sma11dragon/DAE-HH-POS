import React from 'react';
import { Home, FileText, Tag, LogOut } from 'lucide-react';
import { Screen } from '../types';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  // Navigation styling logic
  const navItemClass = (active: boolean) => 
    `flex flex-col items-center justify-center py-2 px-1 flex-1 transition-colors ${
        active 
        ? 'bg-[#FFC107] text-[#466E9B] rounded-t-md' 
        : 'text-white/70 hover:text-white'
    }`;
  
  // Icon Size helper
  const iconSize = 24;

  return (
    <div className="bg-[#466E9B] border-t border-[#36587d] flex justify-between items-stretch shrink-0 px-0 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] pt-1">
      
      <button onClick={() => onNavigate(Screen.HOME)} className={navItemClass(currentScreen === Screen.HOME || currentScreen === Screen.PUMP_DETAIL)}>
        <Home size={iconSize} strokeWidth={currentScreen === Screen.HOME ? 2.5 : 2} />
        <span className="text-[10px] font-bold mt-1">Home</span>
      </button>

      <button onClick={() => onNavigate(Screen.HISTORY)} className={navItemClass(currentScreen === Screen.HISTORY)}>
        <FileText size={iconSize} strokeWidth={currentScreen === Screen.HISTORY ? 2.5 : 2} />
        <span className="text-[10px] font-medium mt-1">History</span>
      </button>

      <button onClick={() => onNavigate(Screen.PRICE_CHECK)} className={navItemClass(currentScreen === Screen.PRICE_CHECK)}>
        <Tag size={iconSize} strokeWidth={currentScreen === Screen.PRICE_CHECK ? 2.5 : 2} />
        <span className="text-[10px] font-medium mt-1">Prices</span>
      </button>

      <button onClick={() => onNavigate(Screen.EOS)} className={navItemClass(currentScreen === Screen.EOS)}>
        <LogOut size={iconSize} strokeWidth={currentScreen === Screen.EOS ? 2.5 : 2} />
        <span className="text-[10px] font-medium mt-1">Sign Out</span>
      </button>
    </div>
  );
};