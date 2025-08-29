/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { Tool } from '../App';
import { GenerateIcon, MagicWandIcon, PaletteIcon, CropIcon, ExpandIcon, RemoveBgIcon, CollageIcon, ScenesIcon, LightingIcon, UpscaleIcon, ComposeIcon } from './icons';

interface ToolbarProps {
  activeTool: Tool;
  onSetTool: (tool: Tool) => void;
  hasImage: boolean;
}

const tools: { id: Tool; name: string; icon: React.FC<{ className?: string }>, requiresImage: boolean }[] = [
  { id: 'generate', name: 'Generate', icon: GenerateIcon, requiresImage: false },
  { id: 'retouch', name: 'Retouch', icon: MagicWandIcon, requiresImage: true },
  { id: 'stylize', name: 'Stylize', icon: PaletteIcon, requiresImage: true },
  { id: 'scenes', name: 'Scenes', icon: ScenesIcon, requiresImage: true },
  { id: 'lighting', name: 'Lighting', icon: LightingIcon, requiresImage: true },
  { id: 'compose', name: 'Compose', icon: ComposeIcon, requiresImage: true },
  { id: 'remove-bg', name: 'Remove BG', icon: RemoveBgIcon, requiresImage: true },
  { id: 'crop', name: 'Crop', icon: CropIcon, requiresImage: true },
  { id: 'expand', name: 'Expand', icon: ExpandIcon, requiresImage: true },
  { id: 'upscale', name: 'Upscale', icon: UpscaleIcon, requiresImage: true },
  { id: 'collage', name: 'Collage', icon: CollageIcon, requiresImage: true },
];

const Toolbar: React.FC<ToolbarProps> = ({ activeTool, onSetTool, hasImage }) => {
  return (
    <div className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg p-2 grid grid-cols-4 lg:grid-cols-6 gap-2 backdrop-blur-sm">
      {tools.map((tool) => {
        const isDisabled = tool.requiresImage && !hasImage;
        return (
            <button
              key={tool.id}
              onClick={() => onSetTool(tool.id)}
              disabled={isDisabled}
              className={`flex-1 flex flex-col items-center justify-center gap-1.5 px-3 py-2 rounded-md transition-all duration-200 ease-in-out active:scale-95 text-xs font-semibold ${
                activeTool === tool.id
                  ? 'bg-yellow-400 text-black shadow-md shadow-yellow-500/20'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
              } ${
                isDisabled ? 'opacity-40 cursor-not-allowed' : ''
              }`}
              aria-pressed={activeTool === tool.id}
              aria-label={`Select ${tool.name} tool`}
            >
              <tool.icon className="w-6 h-6" />
              <span>{tool.name}</span>
            </button>
        )
      })}
    </div>
  );
};

export default Toolbar;