/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

interface UpscalePanelProps {
  onApplyUpscale: () => void;
  isLoading: boolean;
}

const UpscalePanel: React.FC<UpscalePanelProps> = ({ onApplyUpscale, isLoading }) => {
  return (
    <div className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg p-6 flex flex-col items-center gap-4 animate-fade-in backdrop-blur-sm">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-zinc-300">AI Upscale</h3>
        <p className="text-sm text-zinc-400 -mt-1">
          Double the resolution of your image, enhancing details and sharpness for a high-quality result.
        </p>
      </div>
      <button 
        onClick={onApplyUpscale} 
        disabled={isLoading} 
        className="w-full max-w-xs mt-2 bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-green-500/20 hover:bg-green-500 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-px active:scale-95 active:shadow-inner text-base disabled:bg-zinc-600 disabled:text-zinc-400 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
      >
        Upscale Image (2x)
      </button>
    </div>
  );
};

export default UpscalePanel;
