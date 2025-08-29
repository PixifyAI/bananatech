/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

interface ScenesPanelProps {
  onApplyScene: (prompt: string) => void;
  isLoading: boolean;
}

const SceneButton: React.FC<{ name: string, prompt: string, onClick: (prompt: string) => void, disabled: boolean }> = ({ name, prompt, onClick, disabled }) => (
    <button
        onClick={() => onClick(prompt)}
        disabled={disabled}
        className="w-full h-full flex items-center justify-center text-center bg-zinc-800 border border-zinc-700 text-zinc-200 font-semibold py-3 px-1 rounded-md transition-all duration-200 ease-in-out hover:bg-zinc-700 hover:border-zinc-600 active:scale-95 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
    >
        {name}
    </button>
);

const ScenesPanel: React.FC<ScenesPanelProps> = ({ onApplyScene, isLoading }) => {

  const scenes = [
    { name: 'Superhero Comic', prompt: 'Place the subject in a dynamic superhero comic book panel, with dramatic action lines and bold colors.' },
    { name: 'Outer Space', prompt: 'Place the subject in a realistic space suit floating in outer space, with a nebula and stars in the background.' },
    { name: 'Cyberpunk City', prompt: 'Composite the subject into a neon-lit, rainy cyberpunk city street at night, with towering holographic advertisements.' },
    { name: 'Enchanted Forest', prompt: 'Place the subject in a magical, enchanted forest at twilight, with glowing mushrooms and mystical light rays filtering through the trees.' },
    { name: 'Wild West', prompt: 'Place the subject in a classic Wild West town showdown at high noon, with dusty streets and wooden saloons.' },
    { name: 'Underwater', prompt: 'Place the subject in a breathtaking underwater kingdom, surrounded by bioluminescent coral reefs and ancient ruins.' },
    { name: 'Post-Apocalyptic', prompt: 'Place the subject in a gritty, post-apocalyptic wasteland, with rusted structures and a dramatic, dusty sky.' },
    { name: 'Fantasy Kingdom', prompt: 'Place the subject on a majestic balcony overlooking a sprawling fantasy kingdom, with castles and dragons in the distance.' },
  ];

  return (
    <div className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg p-4 flex flex-col gap-4 animate-fade-in backdrop-blur-sm">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-zinc-300">AI Scenes</h3>
        <p className="text-sm text-zinc-400 mt-1">Transport your subject to a new world.</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {scenes.map(p => <SceneButton key={p.name} {...p} onClick={onApplyScene} disabled={isLoading} />)}
      </div>
    </div>
  );
};

export default ScenesPanel;