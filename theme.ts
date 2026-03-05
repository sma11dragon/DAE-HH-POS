export const theme = {
  colors: {
    primary: {
      main: 'bg-[#466E9B]', // Steel Blue from reference image
      hover: 'hover:bg-[#36587d]',
      text: 'text-[#466E9B]',
      bgLight: 'bg-[#466E9B]/10',
      border: 'border-[#466E9B]',
    },
    accent: {
      main: 'bg-[#FFC107]', // Vibrant Yellow
      hover: 'hover:bg-[#e0a800]',
      text: 'text-[#FFC107]',
      bgLight: 'bg-[#FFC107]/10',
      border: 'border-[#FFC107]',
    },
    neutral: {
      bg: 'bg-slate-50',
      surface: 'bg-white',
      border: 'border-slate-200',
      text: {
        primary: 'text-slate-900',
        secondary: 'text-slate-500',
        tertiary: 'text-slate-400',
        inverse: 'text-white',
      }
    },
    state: {
      success: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      error: 'text-rose-700 bg-rose-50 border-rose-200',
      warning: 'text-amber-700 bg-amber-50 border-amber-200',
      info: 'text-[#466E9B] bg-[#466E9B]/5 border-[#466E9B]/20',
    }
  },
  typography: {
    h1: 'text-2xl font-bold text-slate-900 tracking-tight',
    h2: 'text-lg font-bold text-slate-800',
    h3: 'text-base font-semibold text-slate-800',
    body: 'text-sm text-slate-600 leading-relaxed',
    caption: 'text-xs text-slate-500',
    label: 'text-xs font-semibold text-slate-500 uppercase tracking-wide',
  },
  layout: {
    radius: 'rounded-md', // Subtle 6px rounding
    card: 'bg-white rounded-md shadow-sm border border-slate-200',
    screenPadding: 'p-4',
    screen: 'flex-1 flex flex-col w-full bg-slate-50 overflow-hidden',
  },
  animation: {
    click: 'active:scale-95 transition-transform duration-100',
    hover: 'transition-colors duration-200',
  }
};