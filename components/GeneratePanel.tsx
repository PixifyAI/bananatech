/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';

interface GeneratePanelProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

const PresetButton: React.FC<{ name: string, onClick: () => void, disabled: boolean }> = ({ name, onClick, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="w-full h-full flex items-center justify-center text-center bg-zinc-800 border border-zinc-700 text-zinc-200 font-semibold py-3 px-1 rounded-md transition-all duration-200 ease-in-out hover:bg-zinc-700 hover:border-zinc-600 active:scale-95 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
    >
        {name}
    </button>
);


const GeneratePanel: React.FC<GeneratePanelProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState('');

  const presets = [
    { name: 'Photorealistic', prompt: 'A photorealistic close-up portrait of an elderly Japanese ceramicist, his weathered hands shaping a clay pot. The scene is illuminated by soft, natural window light, creating a serene, focused atmosphere. Captured with a 85mm f/1.8 lens, emphasizing the fine wrinkles and textures of his skin and the clay.' },
    { name: 'Sticker', prompt: 'A kawaii-style sticker of a happy red panda, featuring big expressive eyes and a fluffy tail. The design should have thick, bold outlines and simple, cel-shaded coloring. The background must be transparent.' },
    { name: 'Add Text', prompt: "Create a modern, minimalist logo for a coffee shop called 'The Daily Grind' in a clean, sans-serif font. The design should be a simple black and white line art style, with a coffee cup icon integrated." },
    { name: 'Product Mockup', prompt: 'A high-resolution, studio-lit product photograph of a minimalist ceramic coffee mug on a plain, light gray background. The lighting is a three-point softbox setup to eliminate shadows and highlight the smooth texture of the mug. The camera angle is a straight-on eye-level shot to showcase its simple, elegant form. Ultra-realistic, with sharp focus.' },
  ];

  const handleApply = () => {
    if (prompt) {
      onGenerate(prompt);
    }
  };
  
  const handlePresetClick = (presetPrompt: string) => {
    setPrompt(presetPrompt);
  };


  return (
    <div className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg p-4 flex flex-col gap-4 animate-fade-in backdrop-blur-sm">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-zinc-300">Generate Image from Text</h3>
        <p className="text-sm text-zinc-400 mt-1">Describe the image you want to create.</p>
      </div>

       <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {presets.map(p => <PresetButton key={p.name} name={p.name} onClick={() => handlePresetClick(p.prompt)} disabled={isLoading} />)}
        </div>
      
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., A majestic banana floating in space, digital art"
        className="flex-grow bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-lg p-4 focus:ring-2 focus:ring-yellow-400 focus:outline-none transition w-full disabled:cursor-not-allowed disabled:opacity-60 text-base min-h-[120px]"
        disabled={isLoading}
      />

        <button
            onClick={handleApply}
            className="w-full bg-yellow-400 text-black font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-yellow-500/20 hover:bg-yellow-300 hover:shadow-xl hover:shadow-yellow-500/30 hover:-translate-y-px active:scale-95 active:shadow-inner text-base disabled:bg-zinc-600 disabled:text-zinc-400 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
            disabled={isLoading || !prompt.trim()}
        >
            Generate Image
        </button>
    </div>
  );
};

export default GeneratePanel;