/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

interface LightingPanelProps {
  onApplyLighting: (prompt: string) => void;
  isLoading: boolean;
}

const LightingButton: React.FC<{ name: string, prompt: string, onClick: (prompt:string) => void, disabled: boolean }> = ({ name, prompt, onClick, disabled }) => (
    <button
        onClick={() => onClick(prompt)}
        disabled={disabled}
        className="w-full h-full flex items-center justify-center text-center bg-zinc-800 border border-zinc-700 text-zinc-200 font-semibold py-3 px-1 rounded-md transition-all duration-200 ease-in-out hover:bg-zinc-700 hover:border-zinc-600 active:scale-95 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
    >
        {name}
    </button>
);

const LightingPanel: React.FC<LightingPanelProps> = ({ onApplyLighting, isLoading }) => {
  const presets = [
    { name: 'Golden Hour', prompt: 'Bathe the image in the warm, soft, golden light of a sunset, creating long, soft shadows.' },
    { name: 'Neon Noir', prompt: 'Relight the image with dramatic, high-contrast neon lighting, with deep shadows and vibrant colors reminiscent of a noir film.' },
    { name: 'Moonlight', prompt: 'Apply a cool, ethereal moonlight effect to the image, with soft, silvery highlights and deep blue shadows.' },
    { name: 'Studio Softbox', prompt: 'Apply clean, professional studio lighting with a large softbox, creating soft, flattering light on the subject with minimal harsh shadows.' },
    { name: 'Cinematic', prompt: 'Apply a cinematic color grade with teal in the shadows and orange/yellow in the highlights for a modern, filmic look.' },
  ];
  
  return (
    <div className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg p-4 flex flex-col gap-4 animate-fade-in backdrop-blur-sm">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-zinc-300">Lighting Studio</h3>
        <p className="text-sm text-zinc-400 mt-1">Change the mood with professional lighting.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2">
        {presets.map(p => <LightingButton key={p.name} {...p} onClick={onApplyLighting} disabled={isLoading} />)}
      </div>
    </div>
  );
};

export default LightingPanel;