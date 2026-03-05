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

        {/* The Device */}
        {/* h-[90vh] ensures it fits on screen, aspect ratio keeps phone shape */}
        <div className="relative border-gray-800 bg-gray-800 border-[10px] md:border-[14px] rounded-[2.5rem] h-[90vh] max-h-[850px] aspect-[9/19] shadow-2xl flex flex-col shrink-0">
          {/* Camera notch simulation */}
          <div className="h-[32px] w-[3px] bg-gray-800 absolute -left-[13px] md:-left-[17px] top-[72px] rounded-l-lg"></div>
          <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[13px] md:-left-[17px] top-[124px] rounded-l-lg"></div>
          <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[13px] md:-right-[17px] top-[142px] rounded-r-lg"></div>
          
          <div className="rounded-[1.8rem] overflow-hidden w-full h-full bg-white relative flex flex-col">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};