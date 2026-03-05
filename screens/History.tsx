import React from 'react';
import { Header } from '../components/TopBar';
import { Transaction } from '../types';
import { Printer, ArrowLeft, RefreshCcw } from 'lucide-react';
import { theme } from '../theme';
import { Button, Card } from '../components/UI';

interface HistoryScreenProps {
  onBack: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ onBack }) => {
  const transactions: Transaction[] = [
    { id: '13825', time: '13:39', type: 'Sale', staff: 'kefuqu', amount: '1.37', status: 'Completed', product: 'EA95' },
    { id: '13824', time: '12:15', type: 'Sale', staff: 'kefuqu', amount: '20.00', status: 'Completed', product: 'DO' },
    { id: '13823', time: '11:42', type: 'Sale', staff: 'admin', amount: '5.50', status: 'Completed', product: 'EA92' },
    { id: '13822', time: '10:05', type: 'Void', staff: 'admin', amount: '0.00', status: 'Pending', product: 'EA95' },
    { id: '13821', time: '09:30', type: 'Sale', staff: 'admin', amount: '10.00', status: 'Completed', product: 'EA95' },
    { id: '13820', time: '09:15', type: 'Sale', staff: 'kefuqu', amount: '45.00', status: 'Completed', product: 'DO' },
    { id: '13821', time: '09:30', type: 'Sale', staff: 'admin', amount: '10.00', status: 'Completed', product: 'EA95' },
    { id: '13820', time: '09:15', type: 'Sale', staff: 'kefuqu', amount: '45.00', status: 'Completed', product: 'DO' },
  ];

  return (
    <div className={theme.layout.screen}>
      <Header title="Historical Transactions" />
      
      {/* Top Action Bar - ALL NEUTRAL BUTTONS */}
      <div className="px-4 py-3 bg-white border-b border-slate-200 flex gap-2 shrink-0 overflow-x-auto no-scrollbar">
          {/* Back Button -> White (Outline) now */}
          <Button variant="outline" onClick={onBack} size="sm" icon={<ArrowLeft size={14} />}>
              Back
          </Button>
          <div className="flex gap-2 ml-auto">
             <Button variant="outline" size="sm" icon={<RefreshCcw size={14} />}>
                Refund
            </Button>
            <Button variant="outline" size="sm" icon={<Printer size={14} />}>
                Print
            </Button>
          </div>
      </div>

      {/* Scrollable List */}
      <div className={`flex-1 overflow-y-auto ${theme.layout.screenPadding} space-y-3 w-full`}>
        {transactions.map((tx, idx) => (
            <Card key={`${tx.id}-${idx}`} className="p-3 flex flex-col gap-2 hover:border-slate-300 transition-colors w-full">
                <div className="flex justify-between items-start w-full">
                    <div className="min-w-0 flex-1 pr-2">
                        <div className="flex items-center gap-2 mb-1">
                             <span className="font-bold text-slate-900 text-sm truncate">{tx.product || 'Fuel'}</span>
                             <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase shrink-0
                                ${tx.status === 'Completed' ? 'bg-slate-100 text-slate-600' : 'bg-slate-100 text-slate-400'}`}>
                                {tx.status}
                             </span>
                        </div>
                        <div className="text-xs text-slate-500 font-mono truncate">
                            {tx.time} • #{tx.id}
                        </div>
                    </div>
                    <div className="text-right shrink-0">
                        <div className="font-bold text-base text-slate-800">${tx.amount}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Staff: {tx.staff}</div>
                    </div>
                </div>
                
                {/* Actions Row within Card */}
                <div className="flex gap-2 pt-2 border-t border-slate-50 mt-1">
                    <button className="text-xs font-semibold text-slate-700 hover:text-slate-900">Details</button>
                    <button className="text-xs font-semibold text-slate-400 hover:text-slate-600 ml-auto">Reprint</button>
                </div>
            </Card>
        ))}
        {/* Padding for bottom nav */}
        <div className="h-2"></div>
      </div>
    </div>
  );
};