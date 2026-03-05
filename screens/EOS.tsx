import React from 'react';
import { Button } from '../components/UI';
import { theme } from '../theme';
import { AlertTriangle, X } from 'lucide-react';

interface EOSProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const EOSScreen: React.FC<EOSProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="absolute inset-0 z-50 bg-white flex flex-col animate-slide-up">
        {/* Close Button Top Right */}
        <div className="flex justify-end p-5 shrink-0">
            <button onClick={onCancel} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors">
                <X size={24} />
            </button>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center p-8 -mt-10">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mb-6 shadow-sm border border-amber-100">
                <AlertTriangle size={40} strokeWidth={1.5} />
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-2">End Shift?</h2>
            
            <div className="text-slate-600 text-base leading-relaxed mb-10 text-center max-w-xs">
                Please ensure that all fuel dispensers are in standby mode before proceeding.
                <div className="mt-4 p-3 bg-slate-50 rounded border border-slate-100 text-xs text-slate-400">
                    Data loss may occur if shift is ended during active fueling operations.
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
                <Button variant="secondary" onClick={onCancel} size="lg">
                    Cancel
                </Button>
                <Button variant="danger" onClick={onConfirm} size="lg">
                    Confirm
                </Button>
            </div>
        </div>
    </div>
  );
};