import React, { ReactNode } from 'react';

interface DeviceFrameProps {
  children: ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100 overflow-hidden">
      <div className="flex flex-row items-center justify-center gap-16 w-full h-full max-w-7xl px-4 md:px-8">
        {/* Left Side Title Info - scaling with viewport */}
        <div className="hidden md:flex flex-col items-start justify-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">DAE POS</h1>
          <h2 className="text-xl lg:text-2xl text-gray-500 font-light mt-2">Revamped Handheld UI</h2>
          <p className="mt-6 text-sm lg:text-base text-gray-400 max-w-xs leading-relaxed">
            A modernized minimal interface recreating the handheld POS flow.
            Optimized for touch interactions and high visibility.
          </p>
        </div>

        {/* The Device — fixed 360×800 logical pixels = Sunmi P3 at 2× DPR */}
        <div className="relative border-gray-800 bg-gray-800 border-[12px] rounded-[2.5rem] w-[360px] min-w-[360px] max-w-[360px] aspect-[9/20] shadow-2xl flex flex-col shrink-0">
          {/* Side button simulation */}
          <div className="h-[32px] w-[3px] bg-gray-800 absolute -left-[15px] top-[72px] rounded-l-lg"></div>
          <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[15px] top-[124px] rounded-l-lg"></div>
          <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[15px] top-[142px] rounded-r-lg"></div>
          
          <div className="rounded-[1.8rem] overflow-hidden w-full h-full bg-white relative flex flex-col">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};