import React from 'react';
import { FileText, Tag, Settings, ShoppingCart } from 'lucide-react';
import { Screen } from '../types';
import { DAEIconMark } from './DAELogo';
import { useAppContext } from '../AppContext';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const { cartCount } = useAppContext();
  const isHome = currentScreen === Screen.HOME || currentScreen === Screen.PUMP_DETAIL;
  const isCart = currentScreen === Screen.FAST_KEY;

  const itemClass = (active: boolean) =>
    `flex flex-col items-center justify-center py-2 px-1 flex-1 transition-all duration-150 ${
      active ? 'text-[#FFC107]' : 'text-white/60 hover:text-white/90'
    }`;

  return (
    <div className="bg-[#3271ae] border-t border-[#245d9a] flex items-stretch shrink-0 shadow-[0_-2px_12px_rgba(0,0,0,0.15)]">

      {/* History */}
      <button
        onClick={() => onNavigate(Screen.HISTORY)}
        className={itemClass(currentScreen === Screen.HISTORY)}
      >
        <FileText size={20} strokeWidth={currentScreen === Screen.HISTORY ? 2.5 : 1.8} />
        <span className="text-[10px] font-medium mt-0.5">History</span>
      </button>

      {/* Prices */}
      <button
        onClick={() => onNavigate(Screen.PRICE_CHECK)}
        className={itemClass(currentScreen === Screen.PRICE_CHECK)}
      >
        <Tag size={20} strokeWidth={currentScreen === Screen.PRICE_CHECK ? 2.5 : 1.8} />
        <span className="text-[10px] font-medium mt-0.5">Prices</span>
      </button>

      {/* Home — center, DAE icon mark, elevated */}
      <button
        onClick={() => onNavigate(Screen.HOME)}
        className="flex flex-col items-center justify-center py-1 px-3 relative"
      >
        <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-150 active:scale-95 ${
          isHome
            ? 'bg-[#FFC107] shadow-[#FFC107]/40'
            : 'bg-white/15 hover:bg-white/20'
        }`}>
          <DAEIconMark size={22} color={isHome ? '#3271ae' : 'white'} />
        </div>
        <span className={`text-[10px] font-bold mt-0.5 ${isHome ? 'text-[#FFC107]' : 'text-white/60'}`}>Home</span>
      </button>

      {/* Cart */}
      <button
        onClick={() => onNavigate(Screen.FAST_KEY)}
        className={`${itemClass(isCart)} relative`}
      >
        <div className="relative">
          <ShoppingCart size={20} strokeWidth={isCart ? 2.5 : 1.8} />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-0.5 rounded-full bg-red-500 flex items-center justify-center text-[9px] font-black text-white leading-none">
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-medium mt-0.5">Cart</span>
      </button>

      {/* Settings */}
      <button
        onClick={() => onNavigate(Screen.SETTINGS)}
        className={itemClass(currentScreen === Screen.SETTINGS)}
      >
        <Settings size={20} strokeWidth={currentScreen === Screen.SETTINGS ? 2.5 : 1.8} />
        <span className="text-[10px] font-medium mt-0.5">Settings</span>
      </button>

    </div>
  );
};
