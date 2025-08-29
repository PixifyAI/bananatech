/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';

interface ExpandPanelProps {
  onApplyExpand: (prompt: string) => void;
  isLoading: boolean;
  isExpanding: boolean;
}

const ExpandPanel: React.FC<ExpandPanelProps> = ({ onApplyExpand, isLoading, isExpanding }) => {
  const [prompt, setPrompt] = useState('');

  const handleApply = () => {
    if (prompt) {
      onApplyExpand(prompt);
    }
  };

  return (
    <div className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg p-4 flex flex-col items-center gap-4 animate-fade-in backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-zinc-300">Generative Expand</h3>
      <p className="text-sm text-zinc-400 -mt-2 text-center">
        Drag the selection on the image to define the new canvas size. Then, describe what to fill the new space with.
      </p>

      <form onSubmit={(e) => { e.preventDefault(); handleApply(); }} className="w-full flex flex-col items-center gap-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'add a blue sky and clouds'"
          className="flex-grow bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-lg p-4 focus:ring-2 focus:ring-yellow-400 focus:outline-none transition w-full disabled:cursor-not-allowed disabled:opacity-60 text-base"
          disabled={isLoading}
        />

        <button
          type="submit"
          disabled={isLoading || !isExpanding || !prompt.trim()}
          className="w-full max-w-xs mt-2 bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-green-500/20 hover:bg-green-500 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-px active:scale-95 active:shadow-inner text-base disabled:bg-zinc-600 disabled:text-zinc-400 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
        >
          Apply Expand
        </button>
      </form>
    </div>
  );
};

export default ExpandPanel;
