import React from 'react';
import { theme } from '../theme';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'accent';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  icon,
  size = 'md',
  ...props 
}) => {
  const sizeStyles = {
    sm: 'py-2 px-3 text-xs',
    md: 'py-3 px-4 text-sm',
    lg: 'py-4 px-6 text-base',
  };

  const baseStyles = `flex items-center justify-center gap-2 font-semibold ${theme.layout.radius} transition-all ${theme.animation.click} ${sizeStyles[size]}`;
  
  const variants = {
    // Primary: DAE Blue
    primary: "bg-[#3271ae] text-white hover:bg-[#245d9a] shadow-sm border border-transparent",

    // Accent: Yellow with dark text
    accent: "bg-[#FFC107] text-[#3271ae] hover:bg-[#e0a800] shadow-sm border border-transparent",

    // Secondary: Strictly Neutral (Gray/Slate)
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200",
    
    // Danger: Red (Keep for critical actions only)
    danger: "bg-rose-600 text-white hover:bg-rose-700 shadow-sm",
    
    // Ghost: Transparent neutral
    ghost: "bg-transparent hover:bg-slate-100 text-slate-600",
    
    // Outline: White with Gray border
    outline: "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <div onClick={onClick} className={`${theme.layout.card} ${className} ${onClick ? 'cursor-pointer ' + theme.animation.click : ''}`}>
    {children}
  </div>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { icon?: React.ReactNode; label?: string }> = ({ icon, className = '', label, ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>}
    <div className="relative group w-full">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          {icon}
        </div>
      )}
      <input 
        className={`block w-full ${icon ? 'pl-10' : 'pl-3'} pr-3 py-3 border border-slate-300 ${theme.layout.radius} leading-5 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3271ae]/20 focus:border-[#3271ae] transition-all text-sm font-medium ${className}`}
        {...props}
      />
    </div>
  </div>
);

export const ModalOverlay: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-fade-in">
    <div className={`bg-white w-full rounded-2xl shadow-2xl p-6 animate-scale-in relative`}>
      {children}
    </div>
  </div>
);

export const Toast: React.FC<{ message: string | null }> = ({ message }) => {
  if (!message) return null;
  return (
    <div className="absolute bottom-20 left-0 right-0 z-[60] flex justify-center px-6 pointer-events-none">
      <div className="bg-slate-900/90 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg backdrop-blur-sm animate-toast-in">
        {message}
      </div>
    </div>
  );
};