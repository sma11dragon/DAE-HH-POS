import React, { useState } from 'react';
import { Transaction } from '../types';
import { theme } from '../theme';
import { Button, Card } from '../components/UI';
import { 
  ArrowLeft, 
  CreditCard, 
  Banknote, 
  Zap, 
  Ticket, 
  User, 
  QrCode, 
  Truck,
  Receipt,
  Printer,
  CheckCircle2
} from 'lucide-react';

interface TransactionDetailProps {
  transaction: Transaction;
  onBack: () => void;
  onPaymentComplete: () => void;
}

interface ReceiptItem {
  id: number;
  name: string;
  type: 'Fuel' | 'Product';
  qty: number;
  price: number;
  total: number;
  details?: string; // e.g., "Pump 3"
}

export const TransactionDetailScreen: React.FC<TransactionDetailProps> = ({ transaction, onBack, onPaymentComplete }) => {
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [autoCashEnabled, setAutoCashEnabled] = useState(false);

  // Mock Receipt Data based on the transaction
  const receiptItems: ReceiptItem[] = [
    { 
      id: 1, 
      name: transaction.product || 'Fuel', 
      type: 'Fuel', 
      qty: parseFloat(transaction.amount.replace('$', '')) / 2.5, 
      price: 2.50, 
      total: parseFloat(transaction.amount.replace('$', '')),
      details: 'Pump 3'
    },
    // Add a mock product if the amount is high enough, just for demo
    ...(parseFloat(transaction.amount.replace('$', '')) > 50 ? [{
      id: 2,
      name: 'Motor Oil 5W-30',
      type: 'Product' as const,
      qty: 1,
      price: 12.50,
      total: 12.50
    }] : [])
  ];

  const subtotal = receiptItems.reduce((acc, item) => acc + item.total, 0);
  const tax = subtotal * 0.07;
  const total = subtotal + tax;

  const handlePaymentSelect = (method: string) => {
    setSelectedMethod(method);
    setShowPaymentModal(true);
  };

  return (
    <div className={`${theme.layout.screen} relative`}>
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-600 shrink-0">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-base font-bold text-slate-900 truncate">Transaction Details</h1>
        </div>
        <button className="text-slate-400 hover:text-slate-600 shrink-0">
            <Printer size={20} />
        </button>
      </div>
      
      <div className={`flex-1 overflow-y-auto ${theme.layout.screenPadding} flex flex-col gap-4 pb-6`}>
        
        {/* Receipt Card */}
        <Card className="flex flex-col overflow-hidden border-0 shadow-md shrink-0">
            {/* Receipt Header */}
            <div className="bg-slate-50 border-b border-slate-100 p-4 flex flex-col items-center gap-1 border-dashed border-b-2">
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 mb-1">
                    <Receipt size={20} />
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Due</div>
                <div className="text-3xl font-black text-slate-900">${total.toFixed(2)}</div>
                <div className="text-[10px] text-slate-400 font-mono">{transaction.id} • {transaction.time}</div>
            </div>

            {/* Line Items */}
            <div className="p-4 flex flex-col gap-4 bg-white">
                {receiptItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-start">
                        <div className="flex flex-col">
                            <span className="font-bold text-slate-800 text-sm">{item.name}</span>
                            <span className="text-xs text-slate-500">
                                {item.type === 'Fuel' 
                                    ? `${item.qty.toFixed(2)}L @ $${item.price.toFixed(2)}/L` 
                                    : `${item.qty} x $${item.price.toFixed(2)}`
                                }
                            </span>
                            {item.details && <span className="text-[10px] text-slate-400 mt-0.5">{item.details}</span>}
                        </div>
                        <span className="font-bold text-slate-900 text-sm">${item.total.toFixed(2)}</span>
                    </div>
                ))}
            </div>

            {/* Summary */}
            <div className="bg-white p-4 border-t border-slate-100 flex flex-col gap-2 text-xs">
                <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                    <span>Tax (7%)</span>
                    <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                    <span>Discount</span>
                    <span>$0.00</span>
                </div>
                <div className="border-t border-slate-200 my-1"></div>
                <div className="flex justify-between font-bold text-slate-900 text-sm">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>
        </Card>

        {/* Action Buttons - Consistent with Home Screen */}
        <div className="flex flex-col gap-3 shrink-0">
            {/* Row 1: Coupon & Member */}
            <div className="flex gap-3">
                <Button variant="outline" className="flex-1 bg-white shadow-sm" icon={<Ticket size={16} />}>
                    Coupon
                </Button>
                <Button variant="outline" className="flex-1 bg-white shadow-sm" icon={<User size={16} />}>
                    Member
                </Button>
            </div>
            
            {/* Row 2: Payment Toggle (Full Width) */}
            <Button 
                variant={showPaymentMethods ? "primary" : "outline"}
                className={`w-full shadow-sm ${showPaymentMethods ? '' : 'bg-white'}`}
                icon={<CreditCard size={16} />} 
                onClick={() => setShowPaymentMethods(!showPaymentMethods)}
            >
                Payment
            </Button>

            {/* Row 3: Auto Cash Toggle (Card) */}
            <Card 
                className="p-3 flex justify-between items-center bg-white border-slate-200 shadow-sm cursor-pointer"
                onClick={() => setAutoCashEnabled(!autoCashEnabled)}
            >
                <div className="flex items-center gap-2">
                    <div className="p-1 bg-slate-50 border border-slate-100 rounded text-slate-600">
                        <Zap size={14} fill="currentColor" />
                    </div>
                    <span className="text-slate-700 font-semibold text-xs">Auto-Cash Mode</span>
                </div>
                <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${autoCashEnabled ? 'bg-[#466E9B]' : 'bg-slate-200'}`}>
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition shadow-sm ${autoCashEnabled ? 'translate-x-4' : 'translate-x-1'}`} />
                </div>
            </Card>
        </div>

        {/* Payment Methods Section (Collapsible) */}
        {showPaymentMethods && (
            <div className="animate-slide-up flex flex-col gap-3 pb-6 shrink-0">
                <h3 className="text-sm font-bold text-slate-700 px-1">Select Payment Method</h3>
                <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="justify-start px-3 py-3 h-auto bg-white border-slate-200 shadow-sm hover:border-slate-300" onClick={() => handlePaymentSelect('QR Code')}>
                        <div className="bg-slate-100 p-2 rounded text-slate-600 mr-2 shrink-0">
                            <QrCode size={18} />
                        </div>
                        <div className="flex flex-col items-start overflow-hidden">
                            <span className="text-sm font-bold text-slate-800 truncate w-full text-left">QR Code</span>
                            <span className="text-[10px] text-slate-500 truncate w-full text-left">Scan to pay</span>
                        </div>
                    </Button>
                    
                    <Button variant="outline" className="justify-start px-3 py-3 h-auto bg-white border-slate-200 shadow-sm hover:border-slate-300" onClick={() => handlePaymentSelect('Cash')}>
                        <div className="bg-emerald-50 p-2 rounded text-emerald-600 mr-2 shrink-0">
                            <Banknote size={18} />
                        </div>
                        <div className="flex flex-col items-start overflow-hidden">
                            <span className="text-sm font-bold text-slate-800 truncate w-full text-left">Cash</span>
                            <span className="text-[10px] text-slate-500 truncate w-full text-left">Pay at counter</span>
                        </div>
                    </Button>

                    <Button variant="outline" className="justify-start px-3 py-3 h-auto bg-white border-slate-200 shadow-sm hover:border-slate-300" onClick={() => handlePaymentSelect('Bank Card')}>
                        <div className="bg-blue-50 p-2 rounded text-blue-600 mr-2 shrink-0">
                            <CreditCard size={18} />
                        </div>
                        <div className="flex flex-col items-start overflow-hidden">
                            <span className="text-sm font-bold text-slate-800 truncate w-full text-left">Bank Card</span>
                            <span className="text-[10px] text-slate-500 truncate w-full text-left">Credit / Debit</span>
                        </div>
                    </Button>

                    <Button variant="outline" className="justify-start px-3 py-3 h-auto bg-white border-slate-200 shadow-sm hover:border-slate-300" onClick={() => handlePaymentSelect('Fleet Card')}>
                        <div className="bg-amber-50 p-2 rounded text-amber-600 mr-2 shrink-0">
                            <Truck size={18} />
                        </div>
                        <div className="flex flex-col items-start overflow-hidden">
                            <span className="text-sm font-bold text-slate-800 truncate w-full text-left">Fleet Card</span>
                            <span className="text-[10px] text-slate-500 truncate w-full text-left">Corporate</span>
                        </div>
                    </Button>
                </div>
            </div>
        )}

        {/* Payment Confirmation Modal */}
        {showPaymentModal && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                <Card className="w-full max-w-sm bg-white shadow-xl p-6 flex flex-col gap-4">
                    <div className="flex flex-col items-center text-center gap-2">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-2">
                            <CheckCircle2 size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Payment Collected?</h3>
                        <p className="text-sm text-slate-500">
                            Confirm that you have received the <span className="font-bold text-slate-900">{selectedMethod}</span> payment of <span className="font-bold text-slate-900">${total.toFixed(2)}</span>.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                        <Button variant="outline" onClick={() => setShowPaymentModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={onPaymentComplete}>
                            Confirm
                        </Button>
                    </div>
                </Card>
            </div>
        )}

      </div>
    </div>
  );
};

