import React, { useState } from 'react';
import { Transaction, TransactionItem } from '../types';
import { Button, Card } from '../components/UI';
import { DAEIconMark } from '../components/DAELogo';
import { MOCK_COUPONS } from '../mockData';
import {
  ArrowLeft,
  CreditCard,
  Banknote,
  Ticket,
  User,
  QrCode,
  Truck,
  Printer,
  CheckCircle2,
  ShoppingBag,
  X,
  Search,
  Tag,
  Phone,
  ScanLine,
  UserCheck,
  UserPlus,
  Star,
  AtSign,
} from 'lucide-react';

interface MockMember {
  id: string;
  name: string;
  phone: string;
  email?: string;
  tier: 'Silver' | 'Gold' | 'Platinum';
  points: number;
  since: string;
}

const MOCK_MEMBERS: MockMember[] = [
  { id: 'MBR-0042', name: 'Sopheak Meng', phone: '012345678', email: 'sopheak@email.com', tier: 'Gold', points: 1840, since: 'Jan 2024' },
  { id: 'MBR-0091', name: 'Dara Pich', phone: '097654321', tier: 'Silver', points: 420, since: 'Aug 2024' },
  { id: 'MBR-0017', name: 'Ratana Keo', phone: '085112233', email: 'ratana.keo@gmail.com', tier: 'Platinum', points: 6200, since: 'Mar 2023' },
];

const TIER_CONFIG = {
  Silver:   { bg: 'bg-slate-100',   text: 'text-slate-600',   border: 'border-slate-200' },
  Gold:     { bg: 'bg-amber-50',    text: 'text-amber-600',   border: 'border-amber-200' },
  Platinum: { bg: 'bg-[#3271ae]/8', text: 'text-[#3271ae]',   border: 'border-[#3271ae]/20' },
};

interface TransactionDetailProps {
  transaction: Transaction;
  onBack: () => void;
  onPaymentComplete: () => void;
  onAddItems: () => void;
  showToast?: (msg: string) => void;
}

interface ReceiptItem {
  id: number;
  name: string;
  type: 'Fuel' | 'Product';
  qty: number;
  price: number;
  total: number;
  details?: string;
}


export const TransactionDetailScreen: React.FC<TransactionDetailProps> = ({
  transaction,
  onBack,
  onPaymentComplete,
  onAddItems,
  showToast,
}) => {
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [memberId, setMemberId] = useState('');
  const [memberLookedUp, setMemberLookedUp] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<typeof MOCK_COUPONS[0] | null>(null);

  // Member modal state
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [memberPhone, setMemberPhone] = useState('');
  const [memberSearched, setMemberSearched] = useState(false);
  const [foundMember, setFoundMember] = useState<MockMember | null>(null);
  const [linkedMember, setLinkedMember] = useState<MockMember | null>(null);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');

  const resetMemberModal = () => {
    setShowMemberModal(false);
    setMemberPhone('');
    setMemberSearched(false);
    setFoundMember(null);
    setShowRegisterForm(false);
    setRegName('');
    setRegEmail('');
  };

  const handleMemberSearch = () => {
    const match = MOCK_MEMBERS.find(m => m.phone === memberPhone.replace(/\s/g, ''));
    setFoundMember(match ?? null);
    setMemberSearched(true);
  };

  const handleLinkMember = (member: MockMember) => {
    setLinkedMember(member);
    resetMemberModal();
    showToast?.(`Member ${member.name} linked`);
  };

  const handleRegisterAndLink = () => {
    if (!regName.trim()) return;
    const newMember: MockMember = {
      id: `MBR-${String(Math.floor(1000 + Math.random() * 9000))}`,
      name: regName.trim(),
      phone: memberPhone,
      email: regEmail.trim() || undefined,
      tier: 'Silver',
      points: 0,
      since: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    };
    handleLinkMember(newMember);
  };

  const fuelTotal = parseFloat(transaction.amount.replace('$', ''));

  const baseReceiptItems: ReceiptItem[] = [
    {
      id: 1,
      name: transaction.product || 'Fuel',
      type: 'Fuel',
      qty: fuelTotal / 2.5,
      price: 2.50,
      total: fuelTotal,
      details: `Nozzle #${transaction.nozzleNumber ?? 'N/A'}`,
    },
    ...(fuelTotal > 50 ? [{
      id: 2,
      name: 'Motor Oil 5W-30',
      type: 'Product' as const,
      qty: 1,
      price: 12.50,
      total: 12.50,
    }] : []),
  ];

  // Additional items from Fast Key
  const addedItems: ReceiptItem[] = (transaction.additionalItems || []).map((item: TransactionItem) => ({
    id: item.id + 100,
    name: item.name,
    type: 'Product' as const,
    qty: item.qty,
    price: item.price,
    total: item.qty * item.price,
  }));

  const receiptItems = [...baseReceiptItems, ...addedItems];

  const subtotal = receiptItems.reduce((acc, item) => acc + item.total, 0);
  const tax = subtotal * 0.07;

  // Coupon discount
  let couponDiscount = 0;
  if (appliedCoupon) {
    couponDiscount = appliedCoupon.type === 'percent'
      ? subtotal * appliedCoupon.discount
      : appliedCoupon.discount;
  }

  const total = subtotal + tax - couponDiscount;

  const handlePaymentSelect = (method: string) => {
    setSelectedMethod(method);
    setShowPaymentModal(true);
  };

  const handleMemberLookup = () => {
    setMemberLookedUp(true);
    // Auto-apply eligible coupons
    const autoCoupon = MOCK_COUPONS.find(c => c.auto);
    if (autoCoupon) setAppliedCoupon(autoCoupon);
  };

  return (
    <div className="flex-1 flex flex-col w-full bg-slate-50 overflow-hidden relative">

      {/* Screen Header — DAE brand blue */}
      <div className="bg-[#3271ae] px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 -ml-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-base font-bold text-white">Transaction Details</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-white/70 hover:text-white p-1.5 hover:bg-white/10 rounded-full transition-colors" onClick={() => showToast?.('Printing receipt...')}>
            <Printer size={18} />
          </button>
          <DAEIconMark size={16} color="rgba(255,255,255,0.4)" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 pb-6">

        {/* Total Due Hero */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col items-center gap-1">
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Total Due</span>
          <span className="text-4xl font-black text-slate-900">${total.toFixed(2)}</span>
          <span className="text-[10px] text-slate-400 font-mono">{transaction.id} • {transaction.time}</span>
          {appliedCoupon && (
            <div className="mt-1 px-2 py-0.5 bg-emerald-100 rounded-full flex items-center gap-1">
              <Tag size={10} className="text-emerald-600" />
              <span className="text-[10px] font-semibold text-emerald-700">{appliedCoupon.label} applied</span>
            </div>
          )}
        </div>

        {/* Receipt Items */}
        <Card className="flex flex-col overflow-hidden border border-slate-200 shadow-sm">
          {/* Line Items */}
          <div className="p-4 flex flex-col gap-3 bg-white">
            {receiptItems.map((item) => (
              <div key={item.id} className="flex justify-between items-start gap-2">
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-bold text-slate-800 text-sm truncate">{item.name}</span>
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
          <div className="bg-slate-50 border-t border-slate-100 px-4 py-3 flex flex-col gap-1.5 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Tax (7%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Coupon ({appliedCoupon.label})</span>
                <span>-${couponDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-slate-200 my-0.5" />
            <div className="flex justify-between font-bold text-slate-900 text-sm">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          {/* Row 1: Coupon + Member + Add Items — hidden once payment flow is open */}
          {!showPaymentMethods && (
            <div className="flex gap-2">
              <button
                className="flex-1 h-11 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold active:scale-[0.98] transition-transform shadow-sm"
                onClick={() => setShowCouponModal(true)}
              >
                <Ticket size={14} className="text-[#3271ae]" />
                Coupon
              </button>
              <button
                className={`flex-1 h-11 flex items-center justify-center gap-1.5 rounded-xl border text-xs font-semibold active:scale-[0.98] transition-transform shadow-sm ${
                  linkedMember
                    ? 'border-[#3271ae]/30 bg-[#3271ae]/5 text-[#3271ae]'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
                onClick={() => setShowMemberModal(true)}
              >
                {linkedMember ? <UserCheck size={14} /> : <User size={14} className="text-[#3271ae]" />}
                {linkedMember ? linkedMember.name.split(' ')[0] : 'Member'}
              </button>
              <button
                className="flex-1 h-11 flex items-center justify-center gap-1.5 rounded-xl border border-[#3271ae] bg-[#3271ae]/5 text-[#3271ae] text-xs font-semibold active:scale-[0.98] transition-transform shadow-sm"
                onClick={onAddItems}
              >
                <ShoppingBag size={14} />
                Add Items
              </button>
            </div>
          )}

          {/* Row 2: Payment CTA */}
          <button
            className={`w-full h-14 font-bold text-base rounded-xl shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${
              showPaymentMethods
                ? 'bg-slate-100 text-slate-600 border border-slate-200'
                : 'bg-[#FFC107] text-slate-900'
            }`}
            onClick={() => setShowPaymentMethods(!showPaymentMethods)}
          >
            <CreditCard size={20} />
            {showPaymentMethods ? 'Cancel Payment' : 'Collect Payment'}
          </button>
        </div>

        {/* Payment Methods (collapsible) */}
        {showPaymentMethods && (
          <div className="flex flex-col gap-2 pb-2">
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'QR Code', sub: 'Scan to pay', icon: <QrCode size={18} />, bg: 'bg-slate-100', color: 'text-slate-600', method: 'QR Code' },
                { label: 'Cash', sub: 'Pay at counter', icon: <Banknote size={18} />, bg: 'bg-emerald-50', color: 'text-emerald-600', method: 'Cash' },
                { label: 'Bank Card', sub: 'Credit / Debit', icon: <CreditCard size={18} />, bg: 'bg-blue-50', color: 'text-blue-600', method: 'Bank Card' },
                { label: 'Fleet Card', sub: 'Corporate', icon: <Truck size={18} />, bg: 'bg-amber-50', color: 'text-amber-600', method: 'Fleet Card' },
              ].map(({ label, sub, icon, bg, color, method }) => (
                <button
                  key={method}
                  onClick={() => handlePaymentSelect(method)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl border border-slate-200 bg-white active:scale-[0.98] transition-transform shadow-sm text-left"
                >
                  <div className={`p-2 rounded-lg ${bg} ${color} shrink-0`}>{icon}</div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">{label}</div>
                    <div className="text-[10px] text-slate-500">{sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Coupon / Member Modal */}
      {showCouponModal && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-slate-900/30 animate-fade-in">
          <div className="w-full bg-white rounded-t-2xl p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Coupon & Member Lookup</h3>
              <button
                onClick={() => { setShowCouponModal(false); setMemberLookedUp(false); setMemberId(''); }}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X size={18} />
              </button>
            </div>

            {/* Member ID input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Member ID or phone"
                value={memberId}
                onChange={e => setMemberId(e.target.value)}
                className="flex-1 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-[#3271ae] focus:ring-1 focus:ring-[#3271ae]/30"
              />
              <button
                onClick={handleMemberLookup}
                className="px-4 py-2.5 bg-[#3271ae] text-white rounded-xl text-sm font-semibold flex items-center gap-1.5 active:scale-95 transition-transform whitespace-nowrap shrink-0"
              >
                <Search size={15} />
                Search
              </button>
            </div>

            {/* Coupon results */}
            {memberLookedUp && (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-slate-500">Available coupons for member <strong className="text-slate-700">{memberId || 'MBR-0042'}</strong>:</p>
                {MOCK_COUPONS.map(coupon => (
                  <button
                    key={coupon.id}
                    onClick={() => { setAppliedCoupon(coupon); setShowCouponModal(false); }}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all active:scale-[0.98] ${
                      appliedCoupon?.id === coupon.id
                        ? 'border-emerald-400 bg-emerald-50'
                        : 'border-slate-200 bg-white hover:border-[#3271ae]/40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#3271ae]/10 rounded-lg flex items-center justify-center">
                        <Tag size={14} className="text-[#3271ae]" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-semibold text-slate-800">{coupon.label}</div>
                        {coupon.auto && <div className="text-[10px] text-emerald-600 font-medium">Auto-apply eligible</div>}
                      </div>
                    </div>
                    {appliedCoupon?.id === coupon.id
                      ? <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                      : <span className="text-xs text-[#3271ae] font-semibold">Apply</span>
                    }
                  </button>
                ))}
              </div>
            )}

            {appliedCoupon && !memberLookedUp && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span className="text-sm font-semibold text-emerald-700">{appliedCoupon.label} applied</span>
                <button onClick={() => setAppliedCoupon(null)} className="ml-auto text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Member Modal */}
      {showMemberModal && (
        <>
          <div
            className="absolute inset-0 z-40 bg-slate-900/30 animate-fade-in"
            onClick={resetMemberModal}
          />
          <div className="absolute bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl animate-slide-up flex flex-col max-h-[88vh]">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-8 h-1 rounded-full bg-slate-200" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#3271ae]/10 flex items-center justify-center">
                  <User size={18} className="text-[#3271ae]" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-base">
                    {showRegisterForm ? 'New Member' : 'Member Lookup'}
                  </div>
                  <div className="text-xs text-slate-400">
                    {showRegisterForm ? 'Quick registration' : 'Scan or enter phone number'}
                  </div>
                </div>
              </div>
              <button
                onClick={resetMemberModal}
                className="p-2 rounded-full text-slate-400 hover:bg-slate-50 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto px-5 pb-8 flex flex-col gap-4">

              {!showRegisterForm ? (
                <>
                  {/* Phone input row */}
                  <div className="flex gap-2">
                    <div className="flex-1 flex items-center gap-2 border border-slate-200 rounded-xl px-3 focus-within:border-[#3271ae] focus-within:ring-1 focus-within:ring-[#3271ae]/30 transition-all bg-white">
                      <Phone size={14} className="text-slate-400 shrink-0" />
                      <input
                        type="tel"
                        placeholder="Phone number..."
                        value={memberPhone}
                        onChange={e => { setMemberPhone(e.target.value); setMemberSearched(false); setFoundMember(null); }}
                        onKeyDown={e => e.key === 'Enter' && handleMemberSearch()}
                        className="flex-1 py-2.5 text-sm text-slate-800 outline-none bg-transparent"
                      />
                    </div>
                    <button
                      onClick={handleMemberSearch}
                      className="px-4 py-2.5 bg-[#3271ae] text-white rounded-xl text-sm font-semibold flex items-center gap-1.5 active:scale-95 transition-transform shrink-0"
                    >
                      <Search size={15} />
                      Search
                    </button>
                  </div>

                  {/* Scan QR hint */}
                  <button
                    onClick={() => showToast?.('QR scan coming soon')}
                    className="flex items-center justify-center gap-2 h-10 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs font-medium active:scale-[0.98] transition-transform"
                  >
                    <ScanLine size={14} />
                    Scan Member QR Code
                  </button>

                  {/* Search result */}
                  {memberSearched && (
                    foundMember ? (
                      /* Found */
                      <div className="flex flex-col gap-3">
                        <div className={`rounded-xl border p-4 flex flex-col gap-3 ${TIER_CONFIG[foundMember.tier].border} bg-white`}>
                          {/* Avatar + name */}
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-black ${TIER_CONFIG[foundMember.tier].bg} ${TIER_CONFIG[foundMember.tier].text}`}>
                              {foundMember.name.split(' ').map(p => p[0]).join('').slice(0, 2)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-slate-900 text-sm">{foundMember.name}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{foundMember.id}</div>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TIER_CONFIG[foundMember.tier].bg} ${TIER_CONFIG[foundMember.tier].text}`}>
                              {foundMember.tier}
                            </span>
                          </div>

                          {/* Stats row */}
                          <div className="grid grid-cols-3 gap-2">
                            <div className="flex flex-col items-center bg-slate-50 rounded-lg py-2">
                              <div className="flex items-center gap-1 text-amber-500 mb-0.5">
                                <Star size={11} fill="currentColor" />
                                <span className="text-xs font-black text-slate-800">{foundMember.points.toLocaleString()}</span>
                              </div>
                              <span className="text-[10px] text-slate-400">Points</span>
                            </div>
                            <div className="flex flex-col items-center bg-slate-50 rounded-lg py-2">
                              <Phone size={11} className="text-slate-400 mb-0.5" />
                              <span className="text-[10px] text-slate-600 font-medium truncate w-full text-center px-1">{foundMember.phone}</span>
                            </div>
                            <div className="flex flex-col items-center bg-slate-50 rounded-lg py-2">
                              <span className="text-[10px] font-black text-slate-800">Since</span>
                              <span className="text-[10px] text-slate-400">{foundMember.since}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleLinkMember(foundMember)}
                          className="w-full h-12 rounded-xl bg-[#3271ae] text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                        >
                          <UserCheck size={16} />
                          Link to Transaction
                        </button>
                      </div>
                    ) : (
                      /* Not found */
                      <div className="flex flex-col items-center gap-4 py-4">
                        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                          <User size={24} className="text-slate-400" />
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-bold text-slate-700">No member found</div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            No account linked to <span className="font-mono font-medium text-slate-600">{memberPhone}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => { setRegName(''); setRegEmail(''); setShowRegisterForm(true); }}
                          className="w-full h-12 rounded-xl bg-[#3271ae] text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                        >
                          <UserPlus size={16} />
                          Register New Member
                        </button>
                      </div>
                    )
                  )}
                </>
              ) : (
                /* Registration form */
                <>
                  <div className="flex flex-col gap-3">
                    {/* Name — required */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Full Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Sopheak Meng"
                        value={regName}
                        onChange={e => setRegName(e.target.value)}
                        className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-[#3271ae] focus:ring-1 focus:ring-[#3271ae]/30 transition-all"
                      />
                    </div>

                    {/* Phone — pre-filled, editable */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Phone *</label>
                      <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 focus-within:border-[#3271ae] focus-within:ring-1 focus-within:ring-[#3271ae]/30 transition-all bg-white">
                        <Phone size={14} className="text-slate-400 shrink-0" />
                        <input
                          type="tel"
                          value={memberPhone}
                          onChange={e => setMemberPhone(e.target.value)}
                          className="flex-1 py-2.5 text-sm text-slate-800 outline-none bg-transparent"
                        />
                      </div>
                    </div>

                    {/* Email — optional */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Email <span className="font-normal normal-case text-slate-400">(optional)</span></label>
                      <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 focus-within:border-[#3271ae] focus-within:ring-1 focus-within:ring-[#3271ae]/30 transition-all bg-white">
                        <AtSign size={14} className="text-slate-400 shrink-0" />
                        <input
                          type="email"
                          placeholder="email@example.com"
                          value={regEmail}
                          onChange={e => setRegEmail(e.target.value)}
                          className="flex-1 py-2.5 text-sm text-slate-800 outline-none bg-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowRegisterForm(false)}
                      className="h-12 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm active:scale-95 transition-transform shrink-0"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleRegisterAndLink}
                      disabled={!regName.trim() || !memberPhone.trim()}
                      className="flex-1 h-12 rounded-xl bg-[#3271ae] text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-40"
                    >
                      <UserCheck size={16} />
                      Register & Link
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* Payment Confirmation Modal */}
      {showPaymentModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-1">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Confirm Payment?</h3>
              <p className="text-sm text-slate-500">
                Received <span className="font-bold text-slate-900">{selectedMethod}</span> payment of{' '}
                <span className="font-bold text-slate-900">${total.toFixed(2)}</span>?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="h-11 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm active:scale-95 transition-transform"
              >
                Cancel
              </button>
              <button
                onClick={onPaymentComplete}
                className="h-11 rounded-xl bg-[#FFC107] text-slate-900 font-bold text-sm active:scale-95 transition-transform"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
