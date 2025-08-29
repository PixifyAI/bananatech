/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { UploadIcon } from './icons';

interface ComposePanelProps {
  onCompose: (prompt: string) => void;
  isLoading: boolean;
  currentImageUrl: string | null;
  onFileSelect: (file: File | null) => void;
}

const ComposePanel: React.FC<ComposePanelProps> = ({ onCompose, isLoading, currentImageUrl, onFileSelect }) => {
  const [prompt, setPrompt] = useState('');
  const [image2, setImage2] = useState<File | null>(null);
  const [image2Url, setImage2Url] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  useEffect(() => {
    onFileSelect(image2);
    if (image2) {
      const url = URL.createObjectURL(image2);
      setImage2Url(url);
      return () => URL.revokeObjectURL(url);
    }
    setImage2Url(null);
  }, [image2, onFileSelect]);
  
  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      setImage2(files[0]);
    }
  };

  const handleApply = () => {
    if (prompt && currentImageUrl && image2) {
      onCompose(prompt);
    }
  };
  
  const presets = [
    { name: 'Composition', prompt: "Create a new image by taking the main subject from the second image and placing it into the scene of the first image. Ensure the lighting, shadows, and perspective match for a realistic composite." },
    { name: 'Style Transfer', prompt: "Transform the first image by applying the complete artistic style of the second image. Preserve the original composition of the first image but render it with the textures, color palette, and brushstrokes of the second." },
  ];

  return (
    <div className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg p-4 flex flex-col items-center gap-4 animate-fade-in backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-zinc-300">Compose with Two Images</h3>
      <p className="text-sm text-zinc-400 -mt-2 text-center">
        Combine two images or transfer the style from one to another.
      </p>

      <div className="w-full grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center gap-2">
            <p className="text-sm font-semibold text-zinc-400">Image 1 (Base)</p>
            {currentImageUrl && <img src={currentImageUrl} alt="Base image" className="w-full h-auto object-cover rounded-md aspect-square" />}
        </div>
        <div className="flex flex-col items-center gap-2">
            <p className="text-sm font-semibold text-zinc-400">Image 2 (Context)</p>
            {image2Url ? (
                <div className="relative w-full">
                    <img src={image2Url} alt="Context image" className="w-full h-auto object-cover rounded-md aspect-square" />
                    <button onClick={() => setImage2(null)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full px-2 text-xs">X</button>
                </div>
            ) : (
                <label 
                  htmlFor="compose-upload"
                  className={`relative flex flex-col items-center justify-center w-full aspect-square border-2 rounded-lg cursor-pointer transition-colors ${isDraggingOver ? 'border-yellow-400 bg-yellow-500/10' : 'border-dashed border-zinc-600 bg-zinc-800/50 hover:bg-zinc-800'}`}
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
                  onDragLeave={() => setIsDraggingOver(false)}
                  onDrop={(e) => { e.preventDefault(); setIsDraggingOver(false); handleFileChange(e.dataTransfer.files); }}
                >
                    <UploadIcon className="w-8 h-8 text-zinc-500 mb-2" />
                    <span className="text-xs text-center text-zinc-400 px-1">Upload or Drop</span>
                    <input id="compose-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e.target.files)} />
                </label>
            )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 w-full">
          {presets.map(p => (
              <button key={p.name} onClick={() => setPrompt(p.prompt)} disabled={isLoading} className={`w-full text-center text-sm bg-zinc-800 border border-zinc-700 text-zinc-200 font-semibold py-2 px-3 rounded-md transition-all duration-200 ease-in-out hover:bg-zinc-700 active:scale-95 disabled:opacity-50 ${prompt === p.prompt ? 'ring-2 ring-yellow-400' : ''}`}>
                  {p.name}
              </button>
          ))}
      </div>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe how to combine the images..."
        className="flex-grow bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-lg p-4 focus:ring-2 focus:ring-yellow-400 focus:outline-none transition w-full disabled:cursor-not-allowed disabled:opacity-60 text-base min-h-[100px]"
        disabled={isLoading}
      />

      <button
        type="button"
        onClick={handleApply}
        disabled={isLoading || !image2 || !prompt.trim()}
        className="w-full max-w-xs mt-2 bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-green-500/20 hover:bg-green-500 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-px active:scale-95 active:shadow-inner text-base disabled:bg-zinc-600 disabled:text-zinc-400 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
      >
        Apply Composition
      </button>
    </div>
  );
};

export default ComposePanel;