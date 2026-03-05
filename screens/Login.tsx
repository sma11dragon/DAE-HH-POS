import React, { useState } from 'react';
import { Settings, User, Lock } from 'lucide-react';
import { theme } from '../theme';
import { Button, Input } from '../components/UI';

interface LoginScreenProps {
  onLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className={`flex flex-col h-full bg-white relative`}>
      
      
      <div className="z-10 flex flex-col items-center justify-center flex-1 px-8 max-w-sm mx-auto w-full">
        {/* Logo Area */}
        <div className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-[#466E9B] tracking-tight">DAE</h1>
            <p className="text-slate-400 text-xs tracking-widest uppercase mt-1 font-medium">Digital Assistant for Energy</p>
        </div>

        {/* Language & Settings Row */}
        <div className="w-full flex justify-between items-center text-sm mb-10">
            <div className="flex gap-3 font-medium text-slate-400">
                <span className="text-slate-900 cursor-pointer border-b-2 border-[#466E9B] pb-0.5">中文</span>
                <span className="cursor-pointer hover:text-slate-700 transition-colors">EN</span>
                <span className="cursor-pointer hover:text-slate-700 transition-colors">VN</span>
                <span className="cursor-pointer hover:text-slate-700 transition-colors">Khmer</span>
            </div>
            <button className={`flex items-center justify-center p-2 -mr-2 text-slate-400 hover:text-[#466E9B] transition-colors rounded-full hover:bg-slate-50`}>
                <Settings size={20} />
            </button>
        </div>

        {/* Welcome Text */}
        <div className="w-full text-center mb-8">
            <h2 className="text-lg font-medium text-slate-500">Welcome Back</h2>
            <h1 className="text-2xl font-bold text-slate-800 mt-1">Retail System</h1>
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

            <Button onClick={onLogin} fullWidth size="lg" className="mt-4 shadow-lg shadow-[#466E9B]/10">
                Login
            </Button>
        </div>
      </div>

      <div className="pb-6 text-center">
        <p className={theme.typography.caption}>SN:VB09204701066</p>
      </div>
    </div>
  );
};