import React, { useState } from 'react';
import { Settings, User, Lock } from 'lucide-react';
import { theme } from '../theme';
import { Button, Input } from '../components/UI';
import { DAEIconMark, DAEWordmark } from '../components/DAELogo';

interface LoginScreenProps {
  onLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="z-10 flex flex-col items-center justify-center flex-1 px-8 max-w-sm mx-auto w-full">

        {/* DAE Logo */}
        <div className="mb-10 flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#3271ae' }}>
            <DAEIconMark size={36} color="white" />
          </div>
          <DAEWordmark size={22} color="#3271ae" />
          <p className="text-slate-400 text-[10px] tracking-widest uppercase font-medium -mt-1">Digital Assistant for Energy</p>
        </div>

        {/* Language & Settings Row */}
        <div className="w-full flex justify-between items-center text-sm mb-8">
          <div className="flex gap-3 font-medium text-slate-400">
            <span className="text-slate-900 cursor-pointer border-b-2 pb-0.5" style={{ borderColor: '#3271ae' }}>中文</span>
            <span className="cursor-pointer hover:text-slate-700 transition-colors">EN</span>
            <span className="cursor-pointer hover:text-slate-700 transition-colors">VN</span>
            <span className="cursor-pointer hover:text-slate-700 transition-colors">Khmer</span>
          </div>
          <button className="flex items-center justify-center p-2 -mr-2 text-slate-400 hover:text-[#3271ae] transition-colors rounded-full hover:bg-slate-50">
            <Settings size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="w-full space-y-4">
          <Input
            icon={<User size={18} />}
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Cashier / Manager ID"
          />
          <Input
            icon={<Lock size={18} />}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <Button onClick={onLogin} variant="accent" fullWidth size="lg" className="mt-2">
            Sign In
          </Button>
        </div>
      </div>

      <div className="pb-6 text-center">
        <p className={theme.typography.caption}>SN:VB09204701066</p>
      </div>
    </div>
  );
};
