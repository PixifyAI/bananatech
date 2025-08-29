/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';

interface StylizePanelProps {
  onApplyStylize: (prompt: string) => void;
  isLoading: boolean;
}

const PresetButton: React.FC<{ name: string, prompt: string, onClick: (prompt: string) => void, isSelected: boolean, disabled: boolean }> = ({ name, prompt, onClick, isSelected, disabled }) => (
    <button
        onClick={() => onClick(prompt)}
        disabled={disabled}
        className={`w-full h-full flex items-center justify-center text-center bg-zinc-800 border border-zinc-700 text-zinc-200 font-semibold py-3 px-1 rounded-md transition-all duration-200 ease-in-out hover:bg-zinc-700 hover:border-zinc-600 active:scale-95 text-xs disabled:opacity-50 disabled:cursor-not-allowed ${isSelected ? 'ring-2 ring-offset-2 ring-offset-zinc-900 ring-yellow-400' : ''}`}
    >
        {name}
    </button>
);

const StylizePanel: React.FC<StylizePanelProps> = ({ onApplyStylize, isLoading }) => {
  const [selectedPresetPrompt, setSelectedPresetPrompt] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');

  const filters = [
    { name: 'Synthwave', prompt: 'Apply a vibrant 80s synthwave aesthetic with neon magenta and cyan glows, and subtle scan lines.' },
    { name: 'Anime', prompt: 'Give the image a vibrant Japanese anime style, with bold outlines, cel-shading, and saturated colors.' },
    { name: 'Lomo', prompt: 'Apply a Lomography-style cross-processing film effect with high-contrast, oversaturated colors, and dark vignetting.' },
    { name: 'Hologram', prompt: 'Transform the image into a futuristic holographic projection with digital glitch effects and chromatic aberration.' },
  ];

  const adjustments = [
    { name: 'Blur Background', prompt: 'Apply a realistic depth-of-field effect, making the background blurry while keeping the main subject in sharp focus.' },
    { name: 'Enhance Details', prompt: 'Slightly enhance the sharpness and details of the image without making it look unnatural.' },
    { name: 'Warmer Light', prompt: 'Adjust the color temperature to give the image warmer, golden-hour style lighting.' },
    { name: 'Studio Light', prompt: 'Add dramatic, professional studio lighting to the main subject.' },
  ];

  const activePrompt = selectedPresetPrompt || customPrompt;

  const handlePresetClick = (prompt: string) => {
    setSelectedPresetPrompt(prompt);
    setCustomPrompt('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomPrompt(e.target.value);
    setSelectedPresetPrompt(null);
  };

  const handleApply = () => {
    if (activePrompt) {
      onApplyStylize(activePrompt);
    }
  };

  return (
    <div className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg p-4 flex flex-col gap-4 animate-fade-in backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-center text-zinc-300">Stylize Image</h3>
      
      <details className="w-full" open>
        <summary className="text-md font-semibold text-zinc-400 cursor-pointer hover:text-zinc-200 transition-colors">Creative Filters</summary>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-3">
            {filters.map(p => <PresetButton key={p.name} {...p} onClick={handlePresetClick} isSelected={selectedPresetPrompt === p.prompt} disabled={isLoading} />)}
        </div>
      </details>
      
      <div className="w-full h-px bg-zinc-700/50 my-1"></div>

      <details className="w-full">
        <summary className="text-md font-semibold text-zinc-400 cursor-pointer hover:text-zinc-200 transition-colors">Pro Adjustments</summary>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-3">
            {adjustments.map(p => <PresetButton key={p.name} {...p} onClick={handlePresetClick} isSelected={selectedPresetPrompt === p.prompt} disabled={isLoading} />)}
        </div>
      </details>
      
      <div className="w-full h-px bg-zinc-700/50 my-1"></div>

      <input
        type="text"
        value={customPrompt}
        onChange={handleCustomChange}
        placeholder="Or describe a custom style..."
        className="flex-grow bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-lg p-4 focus:ring-2 focus:ring-yellow-400 focus:outline-none transition w-full disabled:cursor-not-allowed disabled:opacity-60 text-base"
        disabled={isLoading}
      />

      {activePrompt && (
        <div className="animate-fade-in flex flex-col gap-4 pt-2">
            <button
                onClick={handleApply}
                className="w-full bg-yellow-400 text-black font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-yellow-500/20 hover:bg-yellow-300 hover:shadow-xl hover:shadow-yellow-500/30 hover:-translate-y-px active:scale-95 active:shadow-inner text-base disabled:bg-zinc-600 disabled:text-zinc-400 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
                disabled={isLoading || !activePrompt.trim()}
            >
                Apply Style
            </button>
        </div>
      )}
    </div>
  );
};

export default StylizePanel;