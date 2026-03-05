import React from 'react';
import { Screen } from '../types';
import { Header } from '../components/TopBar';
import { ActionFooter } from '../components/ActionFooter';
import { theme } from '../theme';
import { Card } from '../components/UI';
import { ChevronRight } from 'lucide-react';

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
  onSelectPump: (pumpId: number) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, onSelectPump }) => {
  const getPumpStatus = (id: number) => {
      if (id === 9 || id === 12) return { status: 'Fueling', stripColor: 'bg-blue-600', textColor: 'text-blue-600' };
      if (id === 8) return { status: 'Reserved', stripColor: 'bg-amber-500', textColor: 'text-amber-600' };
      if (id === 11) return { status: 'Offline', stripColor: 'bg-slate-400', textColor: 'text-slate-500' };
      return { status: 'Available', stripColor: 'bg-emerald-500', textColor: 'text-emerald-600' };
  };

  return (
    <div className={theme.layout.screen}>
      <Header title="Select Fuel Pump" />
      
      <div className={`flex-1 flex flex-col ${theme.layout.screenPadding} overflow-y-auto w-full`}>
        <div className="flex flex-col gap-3 mb-4 w-full">
            {[7, 8, 9, 10, 11, 12].map((pump) => {
                const { status, stripColor, textColor } = getPumpStatus(pump);
                return (
                <Card 
                    key={pump}
                    onClick={() => onSelectPump(pump)}
                    className="flex flex-row items-stretch overflow-hidden group hover:border-slate-300 transition-all border border-slate-200 shadow-sm h-20 pl-0 py-0"
                >
                    {/* Left Colored Strip */}
                    <div className={`w-1.5 ${stripColor} h-full shrink-0`}></div>
                    
                    {/* Content */}
                    <div className="flex-1 flex items-center justify-between px-4">
                        {/* Number and Status in same row */}
                        <div className="flex items-center gap-3">
                            <span className="text-slate-900 font-bold text-2xl leading-none">{pump}</span>
                            <div className={`text-[11px] font-bold uppercase tracking-wide px-2 py-1 bg-slate-50 rounded ${textColor}`}>
                                {status}
                            </div>
                        </div>
                        
                        {/* Right Arrow in Grey Circle */}
                        <div className="bg-slate-100 p-2 rounded-full text-slate-400 group-hover:bg-slate-200 transition-colors">
                            <ChevronRight size={18} />
                        </div>
                    </div>
                </Card>
            )})}
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        <ActionFooter />
        <div className="h-2"></div>
      </div>
    </div>
  );
};