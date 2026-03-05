import React from 'react';
import { Tag, CreditCard, Zap } from 'lucide-react';
import { Button, Card } from './UI';

interface ActionFooterProps {
    onClick?: () => void;
    className?: string;
}

export const ActionFooter: React.FC<ActionFooterProps> = ({ onClick, className = '' }) => (
  <div className={`mt-auto pt-4 ${className}`} onClick={onClick}>
    <div className="flex gap-3 mb-3">
        <Button variant="outline" className="flex-1" icon={<Tag size={16} />}>
            Coupon
        </Button>
        <Button variant="outline" className="flex-1" icon={<CreditCard size={16} />}>
            Payment
        </Button>
    </div>

    {/* Auto-Cash Mode Card - White Background (was Neutral/Gray) */}
    <Card className="p-3 flex justify-between items-center bg-white border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
            <div className="p-1 bg-slate-50 border border-slate-100 rounded text-slate-600">
                <Zap size={14} fill="currentColor" />
            </div>
            <span className="text-slate-700 font-semibold text-xs">Auto-Cash Mode</span>
        </div>
        
        {/* Toggle Switch - Uses Brand Blue */}
        <div className="relative inline-flex h-5 w-9 items-center rounded-full bg-[#466E9B]/20 cursor-pointer transition-colors hover:bg-[#466E9B]/30">
            <span className="translate-x-4 inline-block h-3.5 w-3.5 transform rounded-full bg-[#466E9B] transition shadow-sm" />
        </div>
    </Card>
  </div>
);