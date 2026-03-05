import React from 'react';
import { Screen } from '../types';
import { Header } from '../components/TopBar';
import { theme } from '../theme';
import { Card } from '../components/UI';
import { Droplets, Wrench, Coffee, ShoppingBag, ArrowLeft } from 'lucide-react';

interface FastKeyScreenProps {
  onBack: () => void;
}

export const FastKeyScreen: React.FC<FastKeyScreenProps> = ({ onBack }) => {
  const items = [
    { id: 1, name: 'Water', icon: <Droplets size={32} />, price: '$1.50', color: 'bg-blue-50 text-blue-600' },
    { id: 2, name: 'Lubricants', icon: <Wrench size={32} />, price: '$12.00', color: 'bg-slate-100 text-slate-600' },
    { id: 3, name: 'Coffee', icon: <Coffee size={32} />, price: '$2.50', color: 'bg-amber-50 text-amber-700' },
    { id: 4, name: 'Snacks', icon: <ShoppingBag size={32} />, price: '$3.00', color: 'bg-emerald-50 text-emerald-600' },
    { id: 5, name: 'Car Wash', icon: <Droplets size={32} className="rotate-180" />, price: '$8.00', color: 'bg-cyan-50 text-cyan-600' },
    { id: 6, name: 'AdBlue', icon: <Droplets size={32} />, price: '$15.00', color: 'bg-indigo-50 text-indigo-600' },
  ];

  return (
    <div className={theme.layout.screen}>
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-600">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-slate-900">Fast Key Items</h1>
      </div>
      
      <div className={`flex-1 overflow-y-auto ${theme.layout.screenPadding}`}>
        <div className="grid grid-cols-2 gap-3">
          {items.map((item) => (
            <Card 
              key={item.id}
              className="flex flex-col items-center justify-center p-6 gap-3 hover:border-slate-300 transition-all active:scale-95"
              onClick={() => {}} // Placeholder for adding to cart
            >
              <div className={`p-4 rounded-full ${item.color}`}>
                {item.icon}
              </div>
              <div className="text-center">
                <div className="font-bold text-slate-900">{item.name}</div>
                <div className="text-sm text-slate-500 font-medium">{item.price}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
