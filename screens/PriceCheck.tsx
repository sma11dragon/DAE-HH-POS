import React, { useState } from 'react';
import { FuelProduct } from '../types';
import { Check, Tag, X } from 'lucide-react';
import { Button } from '../components/UI';
import { theme } from '../theme';

interface PriceCheckProps {
  onClose: () => void;
}

export const PriceCheckScreen: React.FC<PriceCheckProps> = ({ onClose }) => {
  const [hasChanges] = useState(false); // Mock state to disable button

  const products: FuelProduct[] = [
    { name: 'EA95', price: 1.12, currency: 'USD', secondPrice: 4500, secondCurrency: 'KHR' },
    { name: 'EA92', price: 0.97, currency: 'USD', secondPrice: 3900, secondCurrency: 'KHR' },
    { name: 'DO', price: 0.93, currency: 'USD', secondPrice: 3750, secondCurrency: 'KHR' },
  ];

  const getProductColor = (name: string) => {
      switch(name) {
          case 'EA95': return 'bg-amber-500';
          case 'EA92': return 'bg-blue-700';
          case 'DO': return 'bg-red-700';
          default: return 'bg-slate-800';
      }
  };

  return (
    <div className="absolute inset-0 z-50 bg-white flex flex-col animate-slide-up">
        {/* Full Width Header with Cross Button - Removed Divider */}
        <div className="flex justify-between items-center p-5 shrink-0">
            <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    <Tag size={20} />
                </div>
                <div>
                    <h2 className={theme.typography.h2}>Fuel Prices</h2>
                    <p className="text-xs text-slate-400">Current dispenser rates</p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors">
                <X size={24} />
            </button>
        </div>

        <div className="flex-1 p-5 pt-0 overflow-y-auto">
            <div className="overflow-hidden rounded-lg border border-slate-200 mb-6 bg-slate-50/50">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 text-[10px] uppercase tracking-wider">
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold">Product</th>
                            <th className="px-4 py-3 text-right font-semibold">USD</th>
                            <th className="px-4 py-3 text-right font-semibold">KHR</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {products.map((p) => (
                            <tr key={p.name} className="group hover:bg-slate-50 transition-colors relative overflow-hidden">
                                <td className="px-4 py-4 font-bold text-slate-800 relative">
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${getProductColor(p.name)}`}></div>
                                    {p.name}
                                </td>
                                <td className="px-4 py-4 text-right text-slate-700 font-mono text-base">{p.price.toFixed(2)}</td>
                                <td className="px-4 py-4 text-right text-slate-500 font-mono text-base">{p.secondPrice}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center text-xs text-slate-500 bg-slate-50 p-3 rounded border border-slate-200">
                    <span>Exchange Rate</span>
                    <span className="font-mono font-bold text-slate-700">1 USD = 4008.0 KHR</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-8">
                    <Button onClick={onClose} variant="secondary" size="lg">
                        Close
                    </Button>
                    {/* Disabled if no changes */}
                    <Button 
                        onClick={onClose} 
                        variant="primary" 
                        size="lg"
                        icon={<Check size={18} />}
                        disabled={!hasChanges}
                        className={!hasChanges ? 'opacity-50 cursor-not-allowed bg-slate-300 text-white hover:bg-slate-300' : ''}
                    >
                        Confirm
                    </Button>
                </div>
            </div>
        </div>
    </div>
  );
};