import React from 'react';
import { Button } from '../components/UI';
import { theme } from '../theme';
import { AlertTriangle, X, Receipt } from 'lucide-react';
import { MOCK_SHIFT_SUMMARY } from '../mockData';

interface EOSProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const EOSScreen: React.FC<EOSProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="absolute inset-0 z-50 bg-white flex flex-col animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#3271ae' }}>
            <Receipt size={16} color="white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">End of Shift</h2>
            <p className="text-[10px] text-slate-400">Shift summary</p>
          </div>
        </div>
        <button onClick={onCancel} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors">
          <X size={22} />
        </button>
      </div>

      <div className="flex-1 flex flex-col p-5 overflow-y-auto">
        {/* Shift Summary */}
        <div className="rounded-xl border border-slate-200 overflow-hidden mb-6">
          {MOCK_SHIFT_SUMMARY.map((row, i) => (
            <div
              key={row.label}
              className={`flex justify-between items-center px-4 py-3 ${i < MOCK_SHIFT_SUMMARY.length - 1 ? 'border-b border-slate-100' : ''} ${row.highlight ? 'bg-amber-50' : 'bg-white'}`}
            >
              <span className={`text-xs font-medium ${row.highlight ? 'text-amber-700' : 'text-slate-500'}`}>{row.label}</span>
              <span className={`text-sm font-bold ${row.highlight ? 'text-amber-700' : 'text-slate-900'}`}>
                {row.value}{row.unit ? ` ${row.unit}` : ''}
              </span>
            </div>
          ))}
        </div>

        {/* Warning */}
        <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100 mb-6">
          <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" strokeWidth={2} />
          <div>
            <p className="text-xs font-semibold text-amber-800 mb-0.5">Confirm before ending shift</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              Ensure all dispensers are in standby. Data loss may occur during active fueling.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-auto">
          <Button variant="secondary" onClick={onCancel} size="lg">
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} size="lg">
            End Shift
          </Button>
        </div>
      </div>
    </div>
  );
};
