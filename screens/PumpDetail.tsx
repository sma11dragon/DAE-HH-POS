import React, { useState, useEffect } from 'react';
import { Header } from '../components/TopBar';
import { ActionFooter } from '../components/ActionFooter';
import { RefreshCw, ArrowLeft, QrCode, Layers, CreditCard, Banknote, ChevronRight } from 'lucide-react';
import { theme } from '../theme';
import { Button, Card, ModalOverlay } from '../components/UI';
import { getFuelColor } from '../config/fuelProducts';

interface PumpDetailProps {
  pumpId: number;
  onBack: () => void;
  showToast?: (msg: string) => void;
}

type ViewState = 'MAIN' | 'SETTLEMENT';

export const PumpDetail: React.FC<PumpDetailProps> = ({ pumpId, onBack, showToast }) => {
  const [selectedNozzle, setSelectedNozzle] = useState<number | null>(null);
  const [transactionState, setTransactionState] = useState<'IDLE' | 'FUELING' | 'COMPLETED'>('IDLE');
  const [volume, setVolume] = useState(0);
  const [viewState, setViewState] = useState<ViewState>('MAIN');
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (transactionState === 'FUELING') {
      interval = setInterval(() => {
        setVolume((prev) => {
          if (prev >= 1.23) {
            setTransactionState('COMPLETED');
            return 1.23;
          }
          return prev + 0.05;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [transactionState]);

  const handleNozzleClick = (nozzleId: number) => {
    setSelectedNozzle(nozzleId);
    setVolume(0);
    setTransactionState('FUELING');
  };

  const handlePaymentClick = () => {
    if (transactionState === 'COMPLETED' || transactionState === 'FUELING') {
        setViewState('SETTLEMENT');
    }
  };

  const handleFinish = () => {
      setShowPaymentSuccess(false);
      setSelectedNozzle(null);
      setTransactionState('IDLE');
      setViewState('MAIN');
      onBack();
  }

  const nozzleData = [
      { id: 1, name: 'Revvo 90',           price: 0.88 },
      { id: 2, name: 'Revvo 92',           price: 0.97 },
      { id: 3, name: 'Revvo 95',           price: 1.12 },
      { id: 4, name: 'Primus Diesel Plus', price: 0.93 },
  ];

  const getNozzleColor = (name: string): string => getFuelColor(name);

  const currentNozzle = nozzleData.find(n => n.id === selectedNozzle);
  const totalAmount = currentNozzle ? (volume * currentNozzle.price).toFixed(2) : '0.00';
  const totalLocal = currentNozzle ? (parseFloat(totalAmount) * 5535).toFixed(0) : '0';

  const DetailRow = ({ label, value, highlight = false, isSecondary = false }: any) => (
      <div className={`flex justify-between py-2 border-b border-slate-50 ${theme.typography.body}`}>
          <span className="text-slate-500 font-medium text-xs">{label}</span>
          <span className={`font-bold text-sm ${highlight ? 'text-slate-900' : (isSecondary ? 'text-slate-400' : 'text-slate-800')}`}>{value}</span>
      </div>
  );

  const TransactionDetailsList = () => (
    <Card className="p-4 space-y-0.5">
        <DetailRow label="Product" value={currentNozzle?.name || '--'} />
        <DetailRow label="Nozzle" value={currentNozzle?.id || '--'} />
        <DetailRow label="Price" value={`${currentNozzle?.price.toFixed(2) || '0.00'}`} />
        <DetailRow label="Volume" value={`${volume.toFixed(2)} L`} highlight />
        <DetailRow label="Total" value={`${totalAmount} USD`} />
        <div className="flex justify-between py-2 text-xs">
            <span className="text-slate-500 font-medium">Coupon</span>
            <span className="text-slate-300">--</span>
        </div>
    </Card>
  );

  // Define the custom header title content
  const headerTitle = (
      <div className="flex justify-between items-center w-full">
          <button 
            className="text-slate-500 hover:bg-slate-50 p-1 -ml-2 rounded-full transition-colors flex items-center justify-center" 
            onClick={viewState === 'SETTLEMENT' ? () => setViewState('MAIN') : onBack}
          >
              <ArrowLeft size={20} />
          </button>
          
          <span className="text-lg font-bold" style={{ color: '#3271ae' }}>Pump {pumpId}</span>
          
          <button 
            className="text-slate-500 hover:bg-slate-50 p-1 -mr-2 rounded-full transition-colors flex items-center justify-center" 
            onClick={() => setSelectedNozzle(null)}
          >
              <RefreshCw size={20} />
          </button>
      </div>
  );

  return (
    <div className={theme.layout.screen}>
      <Header title={headerTitle} />

      <div className={`flex-1 flex flex-col ${theme.layout.screenPadding} overflow-y-auto w-full`}>
        
        {viewState === 'MAIN' && (
             <div className="mb-6 shrink-0 w-full space-y-3">
                 <h3 className="text-sm font-bold px-1 mb-3" style={{ color: '#3271ae' }}>Select Fuel Point</h3>
                {nozzleData.map((nozzle) => {
                    const isSelected = selectedNozzle === nozzle.id;
                    const productColor = getNozzleColor(nozzle.name);
                    const idColor = isSelected ? '#FFC107' : productColor;
                    
                    return (
                        <button 
                            key={nozzle.id}
                            onClick={() => !selectedNozzle && handleNozzleClick(nozzle.id)}
                            disabled={selectedNozzle !== null && !isSelected}
                            className={`relative w-full bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden text-left transition-all duration-200 group
                            ${isSelected ? 'ring-2 ring-[#FFC107] ring-offset-2' : 'hover:border-slate-300'}
                            ${selectedNozzle && !isSelected ? 'opacity-40 grayscale' : ''}`}
                        >
                            <div className="flex items-center px-5 py-4">
                                {/* Numbers - Size matched to Home screen pump buttons */}
                                <div className="flex items-baseline mr-6 min-w-[3rem]">
                                    <span className="text-2xl font-bold leading-none" style={{ color: idColor }}>{nozzle.id}</span>
                                </div>

                                {/* Info */}
                                <div className="flex-1 flex flex-col justify-center">
                                    <span className="font-bold text-slate-900 text-lg leading-tight">{nozzle.name}</span>
                                    <span className="text-xs text-slate-500 font-medium mt-0.5">Available</span>
                                </div>

                                {/* Icon - ChevronRight in circle */}
                                <div className="bg-slate-100 p-2 rounded-full text-slate-400 group-hover:bg-slate-200 transition-colors">
                                    <ChevronRight size={18} />
                                </div>
                            </div>

                            {/* Bottom Color Strip - Use Yellow if selected, else product color */}
                            <div className="h-1.5 w-full" style={{ backgroundColor: isSelected ? '#FFC107' : productColor }} />
                        </button>
                    );
                })}
            </div>
        )}

        {/* Action Footer or Settlement View */}
        {viewState === 'MAIN' ? (
            <>
                {/* Changed Order: Receipt displayed ABOVE Footer buttons */}
                {selectedNozzle && currentNozzle && (
                    <div className="mb-4 animate-slide-up pb-2">
                        <TransactionDetailsList />
                    </div>
                )}

                <div onClick={handlePaymentClick} className={transactionState === 'COMPLETED' ? "animate-pulse" : ""}>
                    <ActionFooter />
                </div>
            </>
        ) : (
             <div className="flex-1 flex flex-col animate-slide-up h-full w-full">
                  <TransactionDetailsList />
                  
                  {/* Settlement Total - Neutral Background */}
                  <div className="mt-4 bg-slate-50 border border-slate-200 p-4 rounded-md flex justify-between items-center mb-4">
                      <span className="font-bold text-slate-700 text-sm">Payable</span>
                      <div className="text-right">
                          <span className="block text-lg font-extrabold text-slate-900">{totalAmount} USD</span>
                          <span className="block text-[10px] text-slate-500 opacity-80">{totalLocal} KHR</span>
                      </div>
                  </div>

                  {/* Confirm Button - DAE brand blue */}
                  <Button variant="primary" className="py-3 mb-4 font-bold shadow-sm" style={{ backgroundColor: '#3271ae' }} fullWidth onClick={() => setShowPaymentSuccess(true)}>
                    Confirm
                  </Button>

                  {/* Payment Methods - All Neutral Outlines */}
                  <div className="grid grid-cols-2 gap-2 mt-auto pb-4 w-full">
                       <Button variant="outline" className="flex-col gap-1 py-3 h-auto" onClick={() => setShowPaymentSuccess(true)}>
                           <Banknote size={20} className="text-slate-600" />
                           <span className="text-[10px]">Cash</span>
                       </Button>
                       <Button variant="outline" className="flex-col gap-1 py-3 h-auto" onClick={() => setShowPaymentSuccess(true)}>
                           <QrCode size={20} className="text-slate-600" />
                           <span className="text-[10px]">QR</span>
                       </Button>
                       <Button variant="outline" className="flex-col gap-1 py-3 h-auto" onClick={() => setShowPaymentSuccess(true)}>
                           <CreditCard size={20} className="text-slate-600" />
                           <span className="text-[10px]">Card</span>
                       </Button>
                       <Button variant="outline" className="flex-col gap-1 py-3 h-auto" onClick={() => showToast?.('Other payments: coming soon')}>
                           <Layers size={20} className="text-slate-600" />
                           <span className="text-[10px]">Other</span>
                       </Button>
                  </div>
              </div>
        )}
        <div className="h-2"></div>
      </div>

      {showPaymentSuccess && (
          <ModalOverlay>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Payment Completed</h3>
              <p className="text-slate-500 text-sm mb-6">Print the receipt?</p>
              <div className="grid grid-cols-2 gap-3">
                  <Button variant="ghost" onClick={handleFinish}>Yes</Button>
                  <Button variant="primary" onClick={handleFinish}>Print</Button>
              </div>
          </ModalOverlay>
      )}
    </div>
  );
};