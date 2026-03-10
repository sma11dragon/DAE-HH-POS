import React, { useState } from 'react';
import { Screen, NozzleStatus, Nozzle } from '../types';
import { Header } from '../components/TopBar';
import {
  MapPin, User, Banknote, Info, X,
  Zap, AlertTriangle, PauseCircle,
  QrCode, CreditCard, Truck, Tag, Calendar, Gift,
} from 'lucide-react';
import { useAppContext } from '../AppContext';
import { getFuelName, getFuelColor } from '../config/fuelProducts';
import { MOCK_CASHIER_SUMMARY } from '../mockData';

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
  onSelectTransaction: (transaction: import('../types').Transaction) => void;
  showToast?: (msg: string) => void;
}

const STATUS_COLORS: Record<NozzleStatus, string> = {
  Idle:      '#466E9B',
  Fueling:   '#22C55E',
  Payment:   '#F59E0B',
  Error:     '#EF4444',
  Offline:   '#94A3B8',
  Suspended: '#F97316',
};

const STATUS_LEGEND: { status: NozzleStatus; label: string; desc: string }[] = [
  { status: 'Idle',      label: 'Idle',      desc: 'Ready, no activity' },
  { status: 'Fueling',   label: 'Fueling',   desc: 'Dispensing in progress' },
  { status: 'Payment',   label: 'Payment',   desc: 'Awaiting cashier action' },
  { status: 'Suspended', label: 'Suspended', desc: 'Manually paused' },
  { status: 'Error',     label: 'Error',     desc: 'Fault — attention needed' },
  { status: 'Offline',   label: 'Offline',   desc: 'No comms / disconnected' },
];

interface Promotion {
  date: string;
  title: string;
  offer: string;
  tag: string;
}

const PROMOTIONS: Promotion[] = [
  {
    date: '14 Feb 2026',
    title: 'Grand Launch — Tela Khmer Bati',
    offer: '50% discount coupon from Luna Coffee or Kimmo Spicy Noodles',
    tag: 'Opening',
  },
  {
    date: '7 Feb 2026',
    title: 'Tela Khmer Pich Nil is Open!',
    offer: '50% discount coupon from Luna Coffee or Kimmo Spicy Noodles',
    tag: 'Opening',
  },
  {
    date: '6 Feb 2026',
    title: 'Promotion — Tela Khmer Russey Keo',
    offer: 'Exclusive promotional offer for station customers',
    tag: 'Offer',
  },
  {
    date: '28 Jan 2026',
    title: 'Opening — Tela Khmer Kampong Cham',
    offer: 'Fuel purchase 10,000–159,900 ៛ = 1 free water bottle + 1 game coupon',
    tag: 'Opening',
  },
  {
    date: '23 Jan 2026',
    title: 'Opening — Tela Khmer Ang Snuol',
    offer: 'Fuel purchase 10,000–159,900 ៛ = 1 free water bottle + 1 game coupon',
    tag: 'Opening',
  },
  {
    date: '19 Jan 2026',
    title: 'Free Tela Khmer Bottle!',
    offer: 'Get a free Tela Khmer branded bottle at Russey Keo station',
    tag: 'Gift',
  },
];

const MOP_ICONS: Record<string, React.ReactNode> = {
  'Cash':       <Banknote  size={14} />,
  'QR Code':    <QrCode    size={14} />,
  'Bank Card':  <CreditCard size={14} />,
  'Fleet Card': <Truck     size={14} />,
};

function groupByPump(nozzles: Nozzle[]): { pumpId: number; nozzles: Nozzle[] }[] {
  const map = new Map<number, Nozzle[]>();
  for (const nozzle of nozzles) {
    const pumpId = Math.floor(nozzle.id / 100);
    if (!map.has(pumpId)) map.set(pumpId, []);
    map.get(pumpId)!.push(nozzle);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a - b)
    .map(([pumpId, nozzles]) => ({ pumpId, nozzles }));
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, onSelectTransaction, showToast }) => {
  const { nozzles, setNozzles, pendingTransactions } = useAppContext();

  const [autoSettleEnabled, setAutoSettleEnabled]   = useState(false);
  const [legendOpen, setLegendOpen]                 = useState(false);
  const [drawerNozzle, setDrawerNozzle]             = useState<Nozzle | null>(null);
  const [tooltipField, setTooltipField]             = useState<'volume' | 'amount' | null>(null);
  const [cashierDrawerOpen, setCashierDrawerOpen]   = useState(false);
  const [siteDrawerOpen, setSiteDrawerOpen]         = useState(false);

  const closeDrawer = () => { setDrawerNozzle(null); setTooltipField(null); };
  const toggleTooltip = (field: 'volume' | 'amount') =>
    setTooltipField(prev => prev === field ? null : field);
  const showsDailyTotals = (status: NozzleStatus) =>
    status !== 'Fueling' && status !== 'Payment';

  const pumpGroups = groupByPump(nozzles);

  const handleNozzleTap = (nozzle: Nozzle) => {
    if (nozzle.status === 'Payment') {
      const nozzleNum = nozzle.id % 100;
      const txn = pendingTransactions.find(t => t.nozzleNumber === nozzleNum);
      if (txn) onSelectTransaction(txn);
    } else if (nozzle.status !== 'Offline') {
      setDrawerNozzle(nozzle);
    }
  };

  const handleAutoCashToggle = () => {
    const next = !autoSettleEnabled;
    setAutoSettleEnabled(next);
    showToast?.(next ? 'Auto Cash enabled' : 'Auto Cash off');
  };

  const updateNozzleStatus = (nozzle: Nozzle, status: NozzleStatus) => {
    setNozzles(prev => prev.map(n => n.id === nozzle.id ? { ...n, status } : n));
  };

  const tileAnimClass = (status: NozzleStatus): string => {
    if (status === 'Fueling') return 'animate-pulse';
    if (status === 'Error')   return 'animate-error-glow';
    return '';
  };

  const tappable = (status: NozzleStatus) => status !== 'Offline';

  const summary = MOCK_CASHIER_SUMMARY;

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-slate-50">
      <Header />

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-6 pt-3 flex flex-col gap-3">

        {/* Site & Cashier Info */}
        <div className="flex gap-2 min-w-0">
          {/* Site tile — tappable → promotions drawer */}
          <div
            className="flex-1 min-w-0 rounded-xl border border-slate-200 bg-white px-2.5 py-2 flex items-center gap-1.5 cursor-pointer active:scale-[0.98] transition-transform active:bg-slate-50"
            onClick={() => setSiteDrawerOpen(true)}
          >
            <div className="w-6 h-6 rounded-lg bg-[#3271ae]/10 flex items-center justify-center shrink-0">
              <MapPin size={12} className="text-[#3271ae]" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[10px] text-slate-400 font-medium leading-none mb-0.5">Site</span>
              <span className="text-xs font-bold text-slate-800 truncate">Tela New Town</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#3271ae]/30 shrink-0" />
          </div>

          {/* Cashier tile — tappable → shift summary drawer */}
          <div
            className="flex-1 min-w-0 rounded-xl border border-slate-200 bg-white px-2.5 py-2 flex items-center gap-1.5 cursor-pointer active:scale-[0.98] transition-transform active:bg-slate-50"
            onClick={() => setCashierDrawerOpen(true)}
          >
            <div className="w-6 h-6 rounded-lg bg-[#3271ae]/10 flex items-center justify-center shrink-0">
              <User size={12} className="text-[#3271ae]" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[10px] text-slate-400 font-medium leading-none mb-0.5">Cashier</span>
              <span className="text-xs font-bold text-slate-800 truncate">Dara Chan</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#3271ae]/30 shrink-0" />
          </div>
        </div>

        {/* Nozzle Section */}
        <div>
          {/* Header row — Legend + Auto Cash together */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Nozzles</span>
            <div className="flex items-center gap-1.5">
              {/* Auto Cash — compact, inline */}
              <button
                onClick={handleAutoCashToggle}
                className={`h-7 px-2.5 rounded-lg text-[10px] font-semibold flex items-center gap-1 border transition-all active:scale-95 ${
                  autoSettleEnabled
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <Banknote size={11} strokeWidth={2} className={autoSettleEnabled ? 'text-white' : 'text-emerald-600'} />
                <span className="whitespace-nowrap">{autoSettleEnabled ? 'Settling' : 'Auto Cash'}</span>
              </button>

              {/* Legend toggle */}
              <button
                onClick={() => setLegendOpen(o => !o)}
                className={`h-7 px-2.5 rounded-lg text-[10px] font-semibold flex items-center gap-1 border transition-all active:scale-95 ${
                  legendOpen
                    ? 'bg-[#3271ae]/10 border-[#3271ae]/20 text-[#3271ae]'
                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                <Info size={11} />
                Legend
              </button>
            </div>
          </div>


          {/* Pump groups */}
          <div className="flex flex-col gap-3">
            {pumpGroups.map(({ pumpId, nozzles: pumpNozzles }) => (
              <div key={pumpId}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pump {pumpId}</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>
                <div className="grid grid-cols-6 gap-1.5">
                  {pumpNozzles.map((nozzle) => {
                    const nozzleNum = nozzle.id % 100;
                    const label     = String(nozzleNum).padStart(2, '0');
                    const color     = STATUS_COLORS[nozzle.status];
                    const isTappable = tappable(nozzle.status);
                    return (
                      <div
                        key={nozzle.id}
                        className={`h-16 rounded-xl flex flex-col items-center justify-center select-none transition-all duration-100 ${
                          isTappable ? 'active:scale-95 cursor-pointer' : 'cursor-default opacity-60'
                        } ${tileAnimClass(nozzle.status)}`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleNozzleTap(nozzle)}
                      >
                        <span className="text-sm font-black text-white leading-none">{label}</span>
                        <span className="text-[10px] text-white/80 mt-0.5 leading-none">{nozzle.product}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Transactions — directly below nozzles, no Payment CTA */}
        {pendingTransactions.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                Unpaid ({pendingTransactions.length})
              </span>
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {pendingTransactions.map((txn) => {
                const srcNozzle = nozzles.find(n => n.id % 100 === txn.nozzleNumber && n.status === 'Payment');
                const pumpNum = srcNozzle ? Math.floor(srcNozzle.id / 100) : null;
                return (
                  <div
                    key={txn.id}
                    className="rounded-xl border border-amber-200 bg-white overflow-hidden active:scale-[0.98] transition-transform cursor-pointer shadow-sm"
                    onClick={() => onSelectTransaction(txn)}
                  >
                    <div className="h-1 bg-amber-400" />
                    <div className="p-1.5">
                      <div className="text-[10px] text-slate-400 font-medium leading-tight">
                        {pumpNum ? `P${pumpNum} · ` : ''}N{txn.nozzleNumber}
                      </div>
                      <div className="text-[10px] font-bold text-slate-700 leading-tight truncate">{txn.product}</div>
                      <div className="text-[10px] text-slate-400 font-mono leading-tight">{txn.volume}</div>
                      <div className="mt-1 pt-1 border-t border-slate-100">
                        <div className="text-xs font-black text-amber-600">{txn.amount}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* ── Site promotions drawer ── */}
      {siteDrawerOpen && (
        <>
          <div
            className="absolute inset-0 z-40 bg-slate-900/30 animate-fade-in"
            onClick={() => setSiteDrawerOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl animate-slide-up flex flex-col max-h-[80vh]">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-8 h-1 rounded-full bg-slate-200" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#3271ae]/10 flex items-center justify-center">
                  <Tag size={18} className="text-[#3271ae]" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-base">Current Promotions</div>
                  <div className="text-xs text-slate-400">Tela New Town · {PROMOTIONS.length} active offers</div>
                </div>
              </div>
              <button
                onClick={() => setSiteDrawerOpen(false)}
                className="p-2 rounded-full text-slate-400 hover:bg-slate-50 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable promo list */}
            <div className="overflow-y-auto px-4 pb-8 flex flex-col gap-3">
              {PROMOTIONS.map((promo, i) => (
                <div key={i} className="rounded-xl border border-slate-100 bg-white shadow-sm">
                  {/* Color accent strip */}
                  <div className="h-1 bg-[#3271ae] rounded-t-xl" />
                  <div className="px-3.5 pt-3 pb-3.5 flex flex-col gap-2">
                    {/* Tag + date row */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        promo.tag === 'Opening'
                          ? 'bg-[#3271ae]/10 text-[#3271ae]'
                          : promo.tag === 'Gift'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-amber-50 text-amber-600'
                      }`}>
                        {promo.tag}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                        <Calendar size={10} />
                        {promo.date}
                      </div>
                    </div>

                    {/* Title */}
                    <div className="text-sm font-bold text-slate-800 leading-snug">{promo.title}</div>

                    {/* Offer detail */}
                    <div className="flex items-start gap-2">
                      <Gift size={12} className="text-slate-400 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-500 leading-relaxed">{promo.offer}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── Legend modal ── */}
      {legendOpen && (
        <>
          <div
            className="absolute inset-0 z-40 bg-black/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setLegendOpen(false)}
          />
          <div className="absolute inset-0 z-50 flex items-center justify-center px-5 pointer-events-none">
            <div className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto animate-scale-in">
              {/* Modal header */}
              <div className="bg-[#3271ae] px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info size={14} color="white" />
                  <span className="text-sm font-bold text-white">Nozzle Status</span>
                </div>
                <button
                  onClick={() => setLegendOpen(false)}
                  className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              {/* 2-col status grid */}
              <div className="p-4 grid grid-cols-2 gap-2">
                {STATUS_LEGEND.map((item) => (
                  <div key={item.status} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50">
                    <div
                      className="w-3 h-3 rounded-full shrink-0 mt-0.5"
                      style={{ backgroundColor: STATUS_COLORS[item.status] }}
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-700">{item.label}</div>
                      <div className="text-[10px] text-slate-400 leading-tight">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Nozzle detail drawer ── */}
      {drawerNozzle && (
        <>
          <div className="absolute inset-0 z-40 bg-slate-900/30 animate-fade-in" onClick={closeDrawer} />
          <div className="absolute bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl animate-slide-up pb-6">
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-8 h-1 rounded-full bg-slate-200" />
            </div>

            <div className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: STATUS_COLORS[drawerNozzle.status] }}
                >
                  <span className="text-base font-black text-white">
                    {String(drawerNozzle.id % 100).padStart(2, '0')}
                  </span>
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-base">
                    Pump {Math.floor(drawerNozzle.id / 100)} · Nozzle {drawerNozzle.id % 100}
                  </div>
                  <div className="text-xs font-semibold" style={{ color: STATUS_COLORS[drawerNozzle.status] }}>
                    {drawerNozzle.status}
                  </div>
                </div>
              </div>
              <button onClick={closeDrawer} className="p-2 rounded-full text-slate-400 hover:bg-slate-50 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="mx-5 rounded-xl border border-slate-100 overflow-hidden mb-4">
              {[
                { label: 'Product',   value: getFuelName(drawerNozzle.product) },
                { label: 'Price/L',   value: drawerNozzle.ppu },
                { label: 'Totalizer', value: drawerNozzle.totalizer },
              ].map((row) => (
                <div key={row.label} className="flex justify-between px-4 py-2.5 border-b border-slate-100 bg-white">
                  <span className="text-xs text-slate-500 font-medium">{row.label}</span>
                  <span className="text-xs font-bold text-slate-800">{row.value}</span>
                </div>
              ))}

              {/* Volume */}
              <div className="border-b border-slate-100 bg-white">
                <div className="flex justify-between items-center px-4 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-500 font-medium">Volume</span>
                    {showsDailyTotals(drawerNozzle.status) && (
                      <button
                        onClick={() => toggleTooltip('volume')}
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
                          tooltipField === 'volume' ? 'border-[#3271ae] text-[#3271ae]' : 'border-slate-300 text-slate-400'
                        }`}
                      >
                        <Info size={9} />
                      </button>
                    )}
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    {showsDailyTotals(drawerNozzle.status) ? drawerNozzle.dailyVolume : drawerNozzle.volume}
                  </span>
                </div>
                {tooltipField === 'volume' && (
                  <div className="px-4 pb-2.5 -mt-1">
                    <div className="text-[10px] text-[#3271ae] bg-[#3271ae]/8 rounded-lg px-2.5 py-1.5 font-medium">
                      Total volume dispensed today on this nozzle
                    </div>
                  </div>
                )}
              </div>

              {/* Amount */}
              <div className="bg-white">
                <div className="flex justify-between items-center px-4 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-500 font-medium">Amount</span>
                    {showsDailyTotals(drawerNozzle.status) && (
                      <button
                        onClick={() => toggleTooltip('amount')}
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
                          tooltipField === 'amount' ? 'border-[#3271ae] text-[#3271ae]' : 'border-slate-300 text-slate-400'
                        }`}
                      >
                        <Info size={9} />
                      </button>
                    )}
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    {showsDailyTotals(drawerNozzle.status) ? drawerNozzle.dailySales : drawerNozzle.amount}
                  </span>
                </div>
                {tooltipField === 'amount' && (
                  <div className="px-4 pb-2.5 -mt-1">
                    <div className="text-[10px] text-[#3271ae] bg-[#3271ae]/8 rounded-lg px-2.5 py-1.5 font-medium">
                      Total sales collected today on this nozzle
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Status-contextual actions */}
            <div className="px-5 flex gap-2">
              {drawerNozzle.status === 'Fueling' && (
                <button
                  className="flex-1 h-11 rounded-xl bg-orange-500 text-white text-sm font-bold active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                  onClick={() => { updateNozzleStatus(drawerNozzle, 'Suspended'); showToast?.('Nozzle suspended'); closeDrawer(); }}
                >
                  <PauseCircle size={16} /> Suspend
                </button>
              )}
              {drawerNozzle.status === 'Error' && (
                <button
                  className="flex-1 h-11 rounded-xl bg-red-500 text-white text-sm font-bold active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                  onClick={() => { updateNozzleStatus(drawerNozzle, 'Idle'); showToast?.('Error acknowledged'); closeDrawer(); }}
                >
                  <AlertTriangle size={16} /> Acknowledge
                </button>
              )}
              {drawerNozzle.status === 'Suspended' && (
                <button
                  className="flex-1 h-11 rounded-xl bg-[#3271ae] text-white text-sm font-bold active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                  onClick={() => { updateNozzleStatus(drawerNozzle, 'Idle'); showToast?.('Nozzle resumed'); closeDrawer(); }}
                >
                  <Zap size={16} /> Resume
                </button>
              )}
              <button
                className="h-11 px-4 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold active:scale-[0.98] transition-transform"
                onClick={closeDrawer}
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Cashier shift summary drawer ── */}
      {cashierDrawerOpen && (
        <>
          <div
            className="absolute inset-0 z-40 bg-slate-900/30 animate-fade-in"
            onClick={() => setCashierDrawerOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl animate-slide-up">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-8 h-1 rounded-full bg-slate-200" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#3271ae]/10 flex items-center justify-center">
                  <User size={18} className="text-[#3271ae]" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-base">Dara Chan</div>
                  <div className="text-xs text-slate-400">{summary.shift} Shift · from {summary.startTime}</div>
                </div>
              </div>
              <button
                onClick={() => setCashierDrawerOpen(false)}
                className="p-2 rounded-full text-slate-400 hover:bg-slate-50 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto max-h-[60vh] px-5 pb-8 flex flex-col gap-4">

              {/* Hero stats */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#3271ae]/5 border border-[#3271ae]/15 rounded-xl p-3 flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold text-[#3271ae] uppercase tracking-wide">Total Sales</span>
                  <span className="text-xl font-black text-slate-900">${summary.totalSales.toFixed(2)}</span>
                  <span className="text-[10px] text-slate-400">{summary.currency}</span>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">Total Volume</span>
                  <span className="text-xl font-black text-slate-900">{summary.totalVolume.toFixed(1)}</span>
                  <span className="text-[10px] text-slate-400">Litres</span>
                </div>
              </div>

              {/* By Product */}
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">By Product</div>
                <div className="rounded-xl border border-slate-100 overflow-hidden">
                  {/* Column headers */}
                  <div className="flex items-center px-3 py-1.5 bg-slate-50 border-b border-slate-100">
                    <span className="flex-1 text-[10px] text-slate-400 font-semibold">Product</span>
                    <span className="w-20 text-right text-[10px] text-slate-400 font-semibold">Sales</span>
                    <span className="w-20 text-right text-[10px] text-slate-400 font-semibold">Volume</span>
                  </div>
                  {summary.byProduct.map((p, i) => (
                    <div
                      key={p.code}
                      className={`flex items-center px-3 py-2.5 bg-white ${
                        i < summary.byProduct.length - 1 ? 'border-b border-slate-50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: getFuelColor(p.code) }}
                        />
                        <span className="text-xs font-semibold text-slate-700 truncate">{p.name}</span>
                      </div>
                      <span className="w-20 text-right text-xs font-bold text-slate-800">${p.sales.toFixed(2)}</span>
                      <span className="w-20 text-right text-xs text-slate-500 font-mono">{p.volume.toFixed(1)}L</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* By MOP */}
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">By Payment Method</div>
                <div className="rounded-xl border border-slate-100 overflow-hidden">
                  <div className="flex items-center px-3 py-1.5 bg-slate-50 border-b border-slate-100">
                    <span className="flex-1 text-[10px] text-slate-400 font-semibold">Method</span>
                    <span className="w-16 text-right text-[10px] text-slate-400 font-semibold">Txns</span>
                    <span className="w-20 text-right text-[10px] text-slate-400 font-semibold">Sales</span>
                  </div>
                  {summary.byMOP.map((m, i) => (
                    <div
                      key={m.method}
                      className={`flex items-center px-3 py-2.5 bg-white ${
                        i < summary.byMOP.length - 1 ? 'border-b border-slate-50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-slate-400 shrink-0">{MOP_ICONS[m.method]}</span>
                        <span className="text-xs font-semibold text-slate-700">{m.method}</span>
                      </div>
                      <span className="w-16 text-right text-xs text-slate-500">{m.count} txn</span>
                      <span className="w-20 text-right text-xs font-bold text-slate-800">${m.sales.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
};
