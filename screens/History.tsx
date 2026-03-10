import React, { useState } from 'react';
import { Header } from '../components/TopBar';
import { Printer, ArrowLeft, RefreshCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { theme } from '../theme';
import { Button, Card } from '../components/UI';
import { useAppContext } from '../AppContext';
import { getFuelColor } from '../config/fuelProducts';

type FilterTab = 'All' | 'Paid' | 'Pending';

interface HistoryScreenProps {
  onBack: () => void;
  showToast?: (msg: string) => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ onBack, showToast }) => {
  const [activeTab, setActiveTab]           = useState<FilterTab>('All');
  const [selectedTxnId, setSelectedTxnId]   = useState<string | null>(null);
  const [expandedDetailId, setExpandedDetailId] = useState<string | null>(null);
  const { transactions } = useAppContext();

  const filtered = transactions.filter((tx) => {
    if (activeTab === 'Paid')    return tx.status === 'Completed';
    if (activeTab === 'Pending') return tx.status === 'Pending';
    return true;
  });

  const selectedTxn = filtered.find(tx => tx.id === selectedTxnId) ?? null;

  const handleCardTap = (txId: string) => {
    setSelectedTxnId(prev => prev === txId ? null : txId);
  };

  const toggleDetail = (e: React.MouseEvent, txId: string) => {
    e.stopPropagation();
    setExpandedDetailId(prev => prev === txId ? null : txId);
  };

  const handleReprint = (e: React.MouseEvent, txId: string) => {
    e.stopPropagation();
    showToast?.(`Printing receipt ${txId}...`);
  };

  const handleRefund = () => {
    if (!selectedTxn) { showToast?.('Select a transaction first'); return; }
    if (selectedTxn.status !== 'Completed') { showToast?.('Only completed transactions can be refunded'); return; }
    showToast?.(`Refund initiated for ${selectedTxn.id}`);
  };

  const handlePrint = () => {
    if (!selectedTxn) { showToast?.('Select a transaction first'); return; }
    showToast?.(`Printing receipt ${selectedTxn.id}...`);
  };

  const statusBadge = (status: string) => {
    if (status === 'Completed') return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    if (status === 'Pending')   return 'bg-amber-50 text-amber-700 border border-amber-200';
    return 'bg-slate-100 text-slate-500';
  };

  const TABS: FilterTab[] = ['All', 'Paid', 'Pending'];

  return (
    <div className={theme.layout.screen}>
      <Header title="Transaction History" />

      {/* Filter Tabs */}
      <div className="px-4 pt-3 pb-0 bg-white shrink-0">
        <div className="flex gap-1 border-b border-slate-100">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSelectedTxnId(null); setExpandedDetailId(null); }}
              className={`px-4 py-3 text-xs font-semibold transition-colors border-b-2 -mb-px min-h-[44px] flex items-center ${
                activeTab === tab
                  ? 'border-[#3271ae] text-[#3271ae]'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-4 py-2.5 bg-white border-b border-slate-100 flex gap-2 shrink-0">
        <Button variant="outline" onClick={onBack} size="sm" className="h-11" icon={<ArrowLeft size={14} />}>
          Back
        </Button>
        <div className="flex gap-2 ml-auto">
          <Button
            variant="outline"
            size="sm"
            className={`h-11 transition-colors ${selectedTxn?.status === 'Completed' ? 'border-red-300 text-red-600 hover:bg-red-50' : ''}`}
            icon={<RefreshCcw size={14} />}
            onClick={handleRefund}
          >
            Refund
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`h-11 transition-colors ${selectedTxn ? 'border-[#3271ae] text-[#3271ae] hover:bg-[#3271ae]/5' : ''}`}
            icon={<Printer size={14} />}
            onClick={handlePrint}
          >
            Print
          </Button>
        </div>
      </div>


      {/* Scrollable List */}
      <div className={`flex-1 overflow-y-auto ${theme.layout.screenPadding} space-y-2.5 w-full`}>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <span className="text-sm">No transactions</span>
          </div>
        )}

        {filtered.map((tx, idx) => {
          const isSelected = selectedTxnId === tx.id;
          const isExpanded = expandedDetailId === tx.id;

          return (
            <div
              key={`${tx.id}-${idx}`}
              onClick={() => handleCardTap(tx.id)}
              className={`rounded-xl border overflow-hidden cursor-pointer transition-all duration-150 w-full ${
                isSelected
                  ? 'border-slate-400 bg-slate-200'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >

              <div className="p-3">
                {/* Row 1: Product name + amount */}
                <div className="flex items-center justify-between gap-2 w-full">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: getFuelColor(tx.product || '') }}
                    />
                    <span className="font-bold text-slate-900 text-sm truncate">{tx.product || 'Fuel'}</span>
                  </div>
                  <span className="font-bold text-base text-slate-800 shrink-0">${tx.amount}</span>
                </div>

                {/* Row 2: Time + ID + Staff + Status badge */}
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-slate-400 font-mono">{tx.time} · #{tx.id}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">{tx.staff}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase shrink-0 ${statusBadge(tx.status)}`}>
                      {tx.status}
                    </span>
                  </div>
                </div>

                {/* Action row */}
                <div className="flex gap-3 pt-2 mt-1.5 border-t border-slate-100">
                  <button
                    className={`flex items-center gap-1 text-xs font-semibold transition-colors ${
                      isExpanded ? 'text-[#3271ae]' : 'text-[#3271ae]/70 hover:text-[#3271ae]'
                    }`}
                    onClick={(e) => toggleDetail(e, tx.id)}
                  >
                    {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    Details
                  </button>
                  <button
                    className="text-xs font-semibold text-slate-400 hover:text-slate-600 ml-auto transition-colors"
                    onClick={(e) => handleReprint(e, tx.id)}
                  >
                    Reprint
                  </button>
                </div>

                {/* Expandable details panel */}
                {isExpanded && (
                  <div
                    className="mt-2 pt-2 border-t border-slate-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                      {[
                        { label: 'Type',    value: tx.type },
                        { label: 'Staff',   value: tx.staff },
                        { label: 'Volume',  value: tx.volume ?? '—' },
                        { label: 'Payment', value: tx.paymentMethod ?? '—' },
                        { label: 'Status',  value: tx.status },
                        { label: 'Txn ID',  value: `#${tx.id}` },
                      ].map(row => (
                        <div key={row.label} className="flex flex-col">
                          <span className="text-[10px] text-slate-400 font-medium">{row.label}</span>
                          <span className="text-[11px] font-semibold text-slate-700">{row.value}</span>
                        </div>
                      ))}
                    </div>
                    {tx.status === 'Completed' && (
                      <button
                        className="mt-2.5 text-[11px] font-semibold text-[#3271ae] hover:text-[#255e9b] transition-colors"
                        onClick={() => showToast?.(`Printing receipt ${tx.id}...`)}
                      >
                        Print Receipt →
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div className="h-4" />
      </div>
    </div>
  );
};
