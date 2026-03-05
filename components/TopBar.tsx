import React, { useEffect, useState } from 'react';
import { Battery, Wifi, Signal, User } from 'lucide-react';
import { theme } from '../theme';

export const TopBar: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`bg-white text-slate-900 text-xs px-5 py-2 flex justify-between items-center border-b border-slate-100 select-none`}>
      <div className="font-medium tracking-wide">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      <div className="flex gap-3 items-center text-slate-400">
        <Signal size={14} className="text-slate-600" />
        <Wifi size={14} className="text-slate-600" />
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-medium text-slate-600">98%</span>
          <Battery size={16} className="text-slate-600" />
        </div>
      </div>
    </div>
  );
};

export const Header: React.FC<{ title?: React.ReactNode; subtitle?: string; showProfile?: boolean }> = ({ title, subtitle, showProfile = true }) => {
  return (
    <div className="px-5 py-3 bg-white shadow-sm z-10 shrink-0 border-b border-slate-50">
      <div className="flex flex-col gap-2">
          {/* Line 1: Logo, Company Name, Profile Icon */}
          <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                  {/* Minimal Logo with Brand Color */}
                  <div className="w-6 h-6 bg-[#466E9B] rounded flex items-center justify-center text-white font-bold text-xs">
                      V
                  </div>
                  <div className="font-bold text-slate-900 text-sm tracking-tight">Vivo SPBU MT Haryono</div>
              </div>
              
              {showProfile && (
                 <div className="bg-slate-100 p-1.5 rounded-full text-slate-500">
                    <User size={16} />
                 </div>
              )}
          </div>

          {/* Line 2: Date/Time and Person Name */}
          <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium">
             <div>Wed, Feb 11 • {new Date().toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}</div>
             {showProfile && <div>Andi Pratama</div>}
          </div>
      </div>

      {(title || subtitle) && (
        <div className="mt-3 pt-2 border-t border-slate-50">
            {title && (
                <div className={theme.typography.h2}>{title}</div>
            )}
            {subtitle && <p className={theme.typography.body + " mt-1"}>{subtitle}</p>}
        </div>
      )}
    </div>
  );
};