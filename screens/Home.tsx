import React, { useState } from 'react';
import { Screen, Transaction } from '../types';
import { Header } from '../components/TopBar';
import { theme } from '../theme';
import { Button, Card } from '../components/UI';
import { 
  Zap, 
  CreditCard, 
  Ticket, 
  ShoppingBag, 
  Fuel, 
  AlertTriangle, 
  Clock, 
  CheckCircle2,
  XCircle,
  Droplets,
  Ban,
  ChevronRight,
  Tag
} from 'lucide-react';

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
  onSelectTransaction: (transaction: Transaction) => void;
}

type NozzleStatus = 'Idle' | 'Fueling' | 'Payment' | 'Error' | 'Offline' | 'Suspended';

interface Nozzle {
  id: number;
  number: number;
  product: string;
  volume: string;
  amount: string;
  status: NozzleStatus;
}

interface Pump {
  id: number;
  nozzles: Nozzle[];
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, onSelectTransaction }) => {
  const [autoCashEnabled, setAutoCashEnabled] = useState(false);

  // Mock Data for 3 Pumps, 6 Nozzles each
  const pumps: Pump[] = [
    {
      id: 1,
      nozzles: [
        { id: 101, number: 1, product: '92', volume: '0.00L', amount: '$0.00', status: 'Idle' },
        { id: 102, number: 2, product: '95', volume: '12.50L', amount: '$28.50', status: 'Fueling' },
        { id: 103, number: 3, product: '98', volume: '0.00L', amount: '$0.00', status: 'Idle' },
        { id: 104, number: 4, product: 'Diesel', volume: '45.20L', amount: '$68.90', status: 'Payment' },
        { id: 105, number: 5, product: 'AdBlue', volume: '0.00L', amount: '$0.00', status: 'Idle' },
        { id: 106, number: 6, product: 'Prem', volume: '0.00L', amount: '$0.00', status: 'Offline' },
      ]
    },
    {
      id: 2,
      nozzles: [
        { id: 201, number: 1, product: '92', volume: '0.00L', amount: '$0.00', status: 'Idle' },
        { id: 202, number: 2, product: '95', volume: '0.00L', amount: '$0.00', status: 'Idle' },
        { id: 203, number: 3, product: '98', volume: '5.20L', amount: '$12.40', status: 'Payment' },
        { id: 204, number: 4, product: 'Diesel', volume: '0.00L', amount: '$0.00', status: 'Error' },
        { id: 205, number: 5, product: 'AdBlue', volume: '0.00L', amount: '$0.00', status: 'Idle' },
        { id: 206, number: 6, product: 'Prem', volume: '0.00L', amount: '$0.00', status: 'Idle' },
      ]
    },
    {
      id: 3,
      nozzles: [
        { id: 301, number: 1, product: '92', volume: '0.00L', amount: '$0.00', status: 'Idle' },
        { id: 302, number: 2, product: '95', volume: '0.00L', amount: '$0.00', status: 'Idle' },
        { id: 303, number: 3, product: '98', volume: '0.00L', amount: '$0.00', status: 'Idle' },
        { id: 304, number: 4, product: 'Diesel', volume: '0.00L', amount: '$0.00', status: 'Idle' },
        { id: 305, number: 5, product: 'AdBlue', volume: '0.00L', amount: '$0.00', status: 'Idle' },
        { id: 306, number: 6, product: 'Prem', volume: '0.00L', amount: '$0.00', status: 'Idle' },
      ]
    }
  ];

  // Mock Pending Transactions derived from "Payment" status nozzles
  const pendingTransactions: Transaction[] = [
    { id: 'TXN-104', time: '10:42 AM', type: 'Fuel', staff: 'Admin', amount: '$68.90', status: 'Pending', product: 'Diesel', nozzleNumber: 4, volume: '45.20L' },
    { id: 'TXN-203', time: '10:45 AM', type: 'Fuel', staff: 'Admin', amount: '$12.40', status: 'Pending', product: '98', nozzleNumber: 3, volume: '5.20L' },
  ];

  const getStatusStyles = (status: NozzleStatus) => {
    switch (status) {
      case 'Idle': return { border: 'border-emerald-500', bg: 'bg-emerald-50/30', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-800' };
      case 'Fueling': return { border: 'border-yellow-400', bg: 'bg-yellow-50/30', text: 'text-yellow-800', badge: 'bg-yellow-100 text-yellow-800' };
      case 'Payment': return { border: 'border-rose-500', bg: 'bg-rose-50/30', text: 'text-rose-700', badge: 'bg-rose-100 text-rose-800' };
      case 'Error': return { border: 'border-red-600', bg: 'bg-red-50/30', text: 'text-red-800', badge: 'bg-red-100 text-red-800' };
      case 'Offline': return { border: 'border-slate-400', bg: 'bg-slate-50/30', text: 'text-slate-600', badge: 'bg-slate-200 text-slate-700' };
      case 'Suspended': return { border: 'border-orange-500', bg: 'bg-orange-50/30', text: 'text-orange-800', badge: 'bg-orange-100 text-orange-800' };
      default: return { border: 'border-slate-300', bg: 'bg-slate-50', text: 'text-slate-600', badge: 'bg-slate-100 text-slate-600' };
    }
  };

  const getStatusIcon = (status: NozzleStatus) => {
    switch (status) {
      case 'Idle': return <CheckCircle2 size={12} />;
      case 'Fueling': return <Droplets size={12} className="animate-bounce" />;
      case 'Payment': return <CreditCard size={12} />;
      case 'Error': return <AlertTriangle size={12} />;
      case 'Offline': return <Ban size={12} />;
      case 'Suspended': return <XCircle size={12} />;
      default: return <Fuel size={12} />;
    }
  };

  return (
    <div className={theme.layout.screen}>
      <Header />
      
      <div className={`flex-1 overflow-y-auto ${theme.layout.screenPadding} pb-24`}>
        
        {/* Pumps Grid */}
        <div className="flex flex-col gap-6 mb-6">
          {pumps.map((pump) => (
            <div key={pump.id} className="flex flex-col">
              {/* Pump Header */}
              <div className="flex items-center gap-2 mb-2 px-1">
                <div className="bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded">
                  PUMP {pump.id}
                </div>
                <div className="h-px bg-slate-200 flex-1"></div>
              </div>

              {/* Nozzles Grid - 3 columns, no gap */}
              <div className="grid grid-cols-3 gap-1 w-full">
                {pump.nozzles.map((nozzle) => {
                  const styles = getStatusStyles(nozzle.status);
                  return (
                    <div 
                      key={nozzle.id} 
                      className={`relative p-2 flex flex-col justify-between h-28 border-2 ${styles.border} ${styles.bg} transition-all`}
                    >
                      {/* Top: Nozzle # */}
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-bold bg-white/80 px-1.5 rounded border border-slate-100 shadow-sm text-slate-700">
                          #{nozzle.number}
                        </span>
                      </div>

                      {/* Status Row (Below Number) */}
                      <div className={`flex items-center gap-1 mb-1 px-1 py-0.5 rounded w-fit ${styles.badge}`}>
                        {getStatusIcon(nozzle.status)}
                        <span className="text-[8px] font-bold uppercase tracking-wider">
                          {nozzle.status}
                        </span>
                      </div>
                      
                      {/* Middle: Product Name */}
                      <div className="flex-1 flex items-center mt-1">
                        <span className={`text-sm font-black tracking-tight ${styles.text} leading-none`}>
                          {nozzle.product}
                        </span>
                      </div>

                      {/* Bottom: Volume and Amount */}
                      <div className="flex flex-col items-start mt-1">
                        <div className="text-[10px] text-slate-500 font-mono leading-tight">
                          {nozzle.volume}
                        </div>
                        <div className="text-xs font-bold text-slate-900 leading-tight">
                          {nozzle.amount}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons - Archive Style + Fast Key */}
        <div className="flex flex-col gap-3 mb-6">
            {/* Row 1: Coupon & Payment */}
            <div className="flex gap-3">
                <Button variant="outline" className="flex-1 bg-white shadow-sm" icon={<Tag size={16} />}>
                    Coupon
                </Button>
                <Button variant="outline" className="flex-1 bg-white shadow-sm" icon={<CreditCard size={16} />}>
                    Payment
                </Button>
            </div>

            {/* Row 2: Fast Key */}
            <Button 
                variant="primary" 
                className="w-full shadow-sm" 
                icon={<ShoppingBag size={16} />}
                onClick={() => onNavigate(Screen.FAST_KEY)}
            >
                Fast Key
            </Button>

            {/* Row 3: Auto-Cash Mode Toggle */}
            <Card 
                className="p-3 flex justify-between items-center bg-white border-slate-200 shadow-sm"
                onClick={() => setAutoCashEnabled(!autoCashEnabled)}
            >
                <div className="flex items-center gap-2">
                    <div className="p-1 bg-slate-50 border border-slate-100 rounded text-slate-600">
                        <Zap size={14} fill="currentColor" />
                    </div>
                    <span className="text-slate-700 font-semibold text-xs">Auto-Cash Mode</span>
                </div>
                
                {/* Toggle Switch */}
                <div className={`relative inline-flex h-5 w-9 items-center rounded-full cursor-pointer transition-colors ${autoCashEnabled ? 'bg-[#466E9B]' : 'bg-slate-200'}`}>
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition shadow-sm ${autoCashEnabled ? 'translate-x-4' : 'translate-x-1'}`} />
                </div>
            </Card>
        </div>

        {/* Pending Transactions */}
        {pendingTransactions.length > 0 && (
          <div className="animate-fade-in">
            <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
              <Clock size={16} className="text-amber-500" />
              Pending Transactions
            </h3>
            <div className="flex flex-col gap-3">
              {pendingTransactions.map((txn) => (
                <Card 
                  key={txn.id} 
                  className="p-0 flex flex-row items-stretch overflow-hidden group hover:border-amber-300 transition-all border border-slate-200 shadow-sm"
                  onClick={() => onSelectTransaction(txn)}
                >
                   <div className="w-1.5 bg-amber-500 h-full shrink-0"></div>
                   <div className="flex-1 p-3 flex justify-between items-center">
                      <div className="flex flex-col gap-0.5 w-full">
                        {/* Row 1: Pump + Nozzle + Time */}
                        <div className="flex items-center justify-between text-xs text-slate-500 w-full">
                            <span className="font-bold text-slate-700">
                                Pump {txn.id.split('-')[1].charAt(0)} #{txn.nozzleNumber}
                            </span>
                            <span>{txn.time}</span>
                        </div>

                        {/* Row 2: Price + Product */}
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-bold text-slate-900 text-lg">{txn.amount}</span>
                          <span className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">{txn.product}</span>
                        </div>

                        {/* Row 3: Volume */}
                        <div className="text-xs text-slate-500 font-mono">
                            {txn.volume}
                        </div>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-full text-slate-400 group-hover:bg-slate-100 transition-colors ml-3 shrink-0">
                          <ChevronRight size={18} />
                      </div>
                   </div>
                </Card>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

