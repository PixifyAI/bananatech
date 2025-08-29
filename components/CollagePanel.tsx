/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { DownloadIcon } from './icons';

interface CollagePanelProps {
  onGenerateCollage: () => void;
  isLoading: boolean;
  collageImages: { style: string, url: string }[];
  onImageClick: (url: string) => void;
}

const CollagePanel: React.FC<CollagePanelProps> = ({ onGenerateCollage, isLoading, collageImages, onImageClick }) => {
  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const handleDownloadAll = () => {
    collageImages.forEach(({ url, style }, index) => {
      // Basic sanitization for filename
      const safeStyle = style.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      // Stagger downloads slightly to improve browser experience
      setTimeout(() => {
        handleDownload(url, `bananatech_collage_${safeStyle}.png`);
      }, index * 200);
    });
  };

  return (
    <div className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg p-6 flex flex-col items-center gap-6 animate-fade-in backdrop-blur-sm">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-zinc-200">AI Art Collage</h3>
        <p className="text-md text-zinc-400 mt-1 max-w-xl">
          Transform your image into 10 different artistic styles with a single click. This creative process may take a minute.
        </p>
      </div>

      {!isLoading && collageImages.length === 0 && (
        <button
          onClick={onGenerateCollage}
          disabled={isLoading}
          className="w-full max-w-xs bg-yellow-400 text-black font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-yellow-500/20 hover:bg-yellow-300 hover:shadow-xl hover:shadow-yellow-500/30 hover:-translate-y-px active:scale-95 active:shadow-inner text-lg disabled:bg-zinc-600 disabled:text-zinc-400 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
        >
          Generate Collage
        </button>
      )}

      {collageImages.length > 0 && !isLoading && (
        <>
          <button
            onClick={handleDownloadAll}
            className="flex items-center justify-center gap-2 w-full max-w-xs bg-green-600 text-white font-bold py-3 px-5 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-green-500/20 hover:bg-green-500 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-px active:scale-95 active:shadow-inner text-base"
          >
            <DownloadIcon className="w-5 h-5" />
            Download All
          </button>
          <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-4 animate-fade-in">
            {collageImages.map(({ style, url }) => {
              const safeStyle = style.replace(/[^a-z0-9]/gi, '_').toLowerCase();
              return (
              <div 
                key={style} 
                className="group relative rounded-lg overflow-hidden cursor-pointer shadow-lg aspect-square" 
                onClick={() => onImageClick(url)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onImageClick(url)}
                aria-label={`View ${style} style in fullscreen`}
              >
                <img src={url} alt={style} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <p className="text-white text-sm font-semibold drop-shadow-md">{style}</p>
                </div>
                 <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent opening the fullscreen view
                    handleDownload(url, `bananatech_collage_${safeStyle}.png`);
                  }}
                  className="absolute top-2 right-2 bg-black/50 p-2 rounded-full text-white hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                  aria-label={`Download ${style} image`}
                >
                  <DownloadIcon className="w-5 h-5" />
                </button>
              </div>
            )})}
          </div>
        </>
      )}
    </div>
  );
};

export default CollagePanel;