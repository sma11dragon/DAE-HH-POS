import React, { useState } from 'react';
import { Transaction, TransactionItem } from '../types';
import { DAEIconMark } from '../components/DAELogo';
import { ArrowLeft, Plus, Minus, CheckCircle2 } from 'lucide-react';
import { MOCK_FAST_KEY_ITEMS } from '../mockData';

interface FastKeyScreenProps {
  onBack: () => void;
  sourceTransaction?: Transaction | null;
  onItemsConfirmed: (items: TransactionItem[]) => void;
}

export const FastKeyScreen: React.FC<FastKeyScreenProps> = ({ onBack, sourceTransaction, onItemsConfirmed }) => {
  const [cart, setCart] = useState<Record<number, number>>({}); // itemId → qty

  const addItem = (id: number) => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const removeItem = (id: number) => setCart(c => {
    const next = { ...c };
    if (next[id] <= 1) delete next[id];
    else next[id]--;
    return next;
  });

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = MOCK_FAST_KEY_ITEMS.reduce((sum, item) => sum + (cart[item.id] || 0) * item.price, 0);

  const handleConfirm = () => {
    const items: TransactionItem[] = MOCK_FAST_KEY_ITEMS
      .filter(item => cart[item.id])
      .map(item => ({ id: item.id, name: item.name, qty: cart[item.id], price: item.price }));
    onItemsConfirmed(items);
  };

  const isLinkedToTransaction = !!sourceTransaction;

  return (
    <div className="flex-1 flex flex-col w-full bg-slate-50 overflow-hidden">

      {/* Header — DAE brand style */}
      <div className="bg-[#3271ae] px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 -ml-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-base font-bold text-white">Fast Key</h1>
            {isLinkedToTransaction && (
              <p className="text-[10px] text-white/60">Adding to {sourceTransaction!.id}</p>
            )}
          </div>
        </div>
        <DAEIconMark size={16} color="rgba(255,255,255,0.4)" />
      </div>

      {/* Items Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {MOCK_FAST_KEY_ITEMS.map((item) => {
            const qty = cart[item.id] || 0;
            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
                  qty > 0 ? 'border-[#3271ae]/40 shadow-[#3271ae]/10' : 'border-slate-200'
                }`}
              >
                {/* Product photo + tap */}
                <button
                  className="w-full flex flex-col active:scale-[0.97] transition-transform"
                  onClick={() => addItem(item.id)}
                >
                  <div className="relative w-full">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-28 object-contain bg-white p-2"
                    />
                    {/* subtle dark gradient at bottom for text legibility */}
                    <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/30 to-transparent" />
                    {qty > 0 && (
                      <div className="absolute top-2 right-2 min-w-[22px] h-[22px] px-1 rounded-full bg-[#3271ae] flex items-center justify-center shadow-md">
                        <span className="text-[11px] font-black text-white">{qty}</span>
                      </div>
                    )}
                  </div>
                  <div className="px-3 py-2 text-left w-full">
                    <div className="font-bold text-slate-900 text-sm leading-tight">{item.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">${item.price.toFixed(2)}</div>
                  </div>
                </button>

                {/* Qty controls (shown when qty > 0) */}
                {qty > 0 && (
                  <div className="border-t border-slate-100 px-3 py-1.5 flex items-center justify-between bg-[#3271ae]/5">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 active:scale-90 transition-transform"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-black text-[#3271ae]">{qty}</span>
                    <button
                      onClick={() => addItem(item.id)}
                      className="w-10 h-10 rounded-full bg-[#3271ae] flex items-center justify-center text-white active:scale-90 transition-transform"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Cart Summary + Confirm */}
      {cartCount > 0 && (
        <div className="shrink-0 bg-white border-t border-slate-200 p-4 flex items-center gap-3">
          <div className="flex-1">
            <div className="text-xs text-slate-500">{cartCount} item{cartCount > 1 ? 's' : ''}</div>
            <div className="text-lg font-black text-slate-900">${cartTotal.toFixed(2)}</div>
          </div>
          <button
            onClick={handleConfirm}
            className="flex items-center gap-2 px-5 py-3 bg-[#FFC107] text-slate-900 rounded-xl font-bold text-sm active:scale-95 transition-transform shadow-md"
          >
            <CheckCircle2 size={16} />
            {isLinkedToTransaction ? 'Add to Bill' : 'Done'}
          </button>
        </div>
      )}
    </div>
  );
};
