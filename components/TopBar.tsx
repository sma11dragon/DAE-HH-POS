import React, { useEffect, useState } from 'react';
import { Wifi, Printer, Battery } from 'lucide-react';
import { DAEIconMark, DAEWordmark } from './DAELogo';
import { theme } from '../theme';

/**
 * Unified App Header — replaces both TopBar (phone status bar) and old Header.
 * Shows: [DAE logo mark + wordmark] | [live time + date] | [connectivity status]
 */
export const Header: React.FC<{ title?: React.ReactNode; subtitle?: string }> = ({ title, subtitle }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock connectivity — replace with real state when integrated
  const wifiOk = true;
  const printerOk = true;
  const batteryLevel = 82; // percent — replace with real battery API when integrated

  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toISOString().split('T')[0];

  return (
    <div className="shrink-0">
      {/* Primary brand bar — DAE blue */}
      <div className="bg-[#3271ae] px-4 py-2.5 flex items-center justify-between select-none">
        {/* Left: Logo */}
        <div className="flex items-center gap-1.5">
          <DAEIconMark size={18} color="white" />
          <DAEWordmark size={13} color="white" />
        </div>

        {/* Center: Live time + date */}
        <div className="flex flex-col items-center leading-none gap-0.5">
          <span className="text-white font-bold text-sm">{timeStr}</span>
          <span className="text-white/60 text-[10px] font-mono">{dateStr}</span>
        </div>

        {/* Right: Connectivity icons */}
        <div className="flex items-center gap-2">
          <Wifi size={15} className={wifiOk ? 'text-emerald-300' : 'text-white/30'} />
          <Printer size={15} className={printerOk ? 'text-emerald-300' : 'text-white/30'} />
          {/* Battery level — icon + label side by side */}
          <div className="flex items-center gap-0.5">
            <Battery size={15} className={batteryLevel > 20 ? 'text-emerald-300' : 'text-red-400'} />
            <span className={`text-[10px] font-bold tabular-nums leading-none ${batteryLevel > 20 ? 'text-emerald-300' : 'text-red-400'}`}>
              {batteryLevel}%
            </span>
          </div>
        </div>
      </div>

      {/* Optional screen-level title row */}
      {(title || subtitle) && (
        <div className="bg-white border-b border-slate-100 px-4 py-2">
          {title && <div className={theme.typography.h2}>{title}</div>}
          {subtitle && <p className={`${theme.typography.caption} mt-0.5`}>{subtitle}</p>}
        </div>
      )}
    </div>
  );
};
