/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { UploadIcon, DownloadIcon, UndoIcon, RedoIcon, EyeIcon } from './icons';

interface ActionsPanelProps {
  onUploadNew: () => void;
  onDownload: () => void;
  onUndo: () => void;
  canUndo: boolean;
  onRedo: () => void;
  canRedo: boolean;
  onReset: () => void;
  onCompare: (isComparing: boolean) => void;
  isOriginal: boolean;
}

const ActionsPanel: React.FC<ActionsPanelProps> = ({
  onUploadNew,
  onDownload,
  onUndo,
  canUndo,
  onRedo,
  canRedo,
  onReset,
  onCompare,
  isOriginal,
}) => {
  return (
    <div className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg p-4 flex flex-col gap-4 animate-fade-in backdrop-blur-sm">
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onUploadNew}
          className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-semibold py-3 px-4 rounded-md transition-all duration-200 ease-in-out active:scale-95 text-base"
        >
          <UploadIcon className="w-5 h-5" />
          Upload New
        </button>
        <button
          onClick={onDownload}
          className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 px-4 rounded-md transition-all duration-300 ease-in-out shadow-lg shadow-green-500/20 hover:bg-green-500 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-px active:scale-95 active:shadow-inner text-base"
        >
          <DownloadIcon className="w-5 h-5" />
          Download
        </button>
      </div>
      <div className="w-full h-px bg-zinc-700 my-1"></div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-semibold py-3 px-4 rounded-md transition-all duration-200 ease-in-out active:scale-95 text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <UndoIcon className="w-5 h-5" />
          Undo
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-semibold py-3 px-4 rounded-md transition-all duration-200 ease-in-out active:scale-95 text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RedoIcon className="w-5 h-5" />
          Redo
        </button>
        <button
          onClick={onReset}
          disabled={isOriginal}
          className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-semibold py-3 px-4 rounded-md transition-all duration-200 ease-in-out active:scale-95 text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset
        </button>
        <button
          onMouseDown={() => onCompare(true)}
          onMouseUp={() => onCompare(false)}
          onTouchStart={() => onCompare(true)}
          onTouchEnd={() => onCompare(false)}
          disabled={isOriginal}
          className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-semibold py-3 px-4 rounded-md transition-all duration-200 ease-in-out active:scale-95 text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <EyeIcon className="w-5 h-5" />
          Compare
        </button>
      </div>
    </div>
  );
};

export default ActionsPanel;
