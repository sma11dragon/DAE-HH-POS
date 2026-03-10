import React, { useState } from 'react';
import { LogOut, Printer, Wifi, Info, ChevronRight, Shield } from 'lucide-react';
import { DAEIconMark, DAEWordmark } from '../components/DAELogo';
import { Header } from '../components/TopBar';

interface SettingsScreenProps {
  onSignOut: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onSignOut }) => {
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  const settingsGroups = [
    {
      title: 'Connectivity',
      items: [
        { icon: <Wifi size={18} className="text-[#3271ae]" />, label: 'Network Status', value: 'Connected', action: null },
        { icon: <Printer size={18} className="text-[#3271ae]" />, label: 'Printer', value: 'Online', action: null },
      ],
    },
    {
      title: 'Session',
      items: [
        { icon: <Info size={18} className="text-slate-500" />, label: 'Cashier', value: 'Dara Chan',     action: null },
        { icon: <Shield size={18} className="text-slate-500" />, label: 'Site', value: 'Tela New Town', action: null },
      ],
    },
  ];

  return (
    <div className="flex-1 flex flex-col w-full bg-slate-50 overflow-hidden">

      {/* Unified Header */}
      <Header />

      <div className="flex-1 overflow-y-auto px-4 pb-6 pt-3 flex flex-col gap-4">

        {/* DAE Branding Block */}
        <div className="flex flex-col items-center py-6 gap-2">
          <div className="w-16 h-16 bg-[#3271ae] rounded-2xl flex items-center justify-center shadow-md">
            <DAEIconMark size={36} color="white" />
          </div>
          <div className="flex flex-col items-center gap-0.5 mt-1">
            <DAEWordmark size={20} color="#3271ae" />
            <span className="text-[10px] text-slate-400 italic">Digital Assistant for Energy</span>
          </div>
          <span className="text-[10px] text-slate-300 mt-1">v1.0.0 • DAE POS Handheld</span>
        </div>

        {/* Settings Groups */}
        {settingsGroups.map(group => (
          <div key={group.title}>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
              {group.title}
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
              {group.items.map(item => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 px-4 py-3.5"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <span className="flex-1 text-sm font-medium text-slate-700">{item.label}</span>
                  <span className="text-xs text-slate-400">{item.value}</span>
                  {item.action && <ChevronRight size={14} className="text-slate-300" />}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Sign Out */}
        <div className="mt-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
            Account
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <button
              onClick={() => setShowSignOutConfirm(true)}
              className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-rose-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
                <LogOut size={16} className="text-rose-500" />
              </div>
              <span className="flex-1 text-sm font-semibold text-rose-600 text-left">Sign Out</span>
              <ChevronRight size={14} className="text-rose-300" />
            </button>
          </div>
        </div>

      </div>

      {/* Sign Out Confirmation */}
      {showSignOutConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in p-6">
          <div className="w-full max-w-xs bg-white rounded-2xl shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                <LogOut size={22} className="text-rose-500" />
              </div>
              <h3 className="text-base font-bold text-slate-900">End Session?</h3>
              <p className="text-sm text-slate-500">You will be signed out. Ensure all pending transactions are cleared first.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowSignOutConfirm(false)}
                className="h-11 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm active:scale-95 transition-transform"
              >
                Cancel
              </button>
              <button
                onClick={onSignOut}
                className="h-11 rounded-xl bg-rose-500 text-white font-bold text-sm active:scale-95 transition-transform"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
