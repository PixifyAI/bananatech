

/**
@license
SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

// Main BananaTech logo - realistic banana icon
export const BananaIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="bananaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE135" />
        <stop offset="50%" stopColor="#FFC700" />
        <stop offset="100%" stopColor="#FFB000" />
      </linearGradient>
    </defs>
    <path 
      d="M17.5 4.5c-.8-.3-1.7-.4-2.6-.2-1.2.3-2.3 1-3.2 2-1.5 1.7-2.5 4-3.2 6.5-.4 1.4-.7 2.9-.8 4.4-.1.8-.1 1.6.1 2.3.2.7.6 1.3 1.2 1.6.6.3 1.3.3 2 .1 1.2-.4 2.3-1.2 3.2-2.2 1.5-1.7 2.5-4 3.2-6.5.4-1.4.7-2.9.8-4.4.1-.8.1-1.6-.1-2.3-.2-.7-.6-1.1-1.2-1.3zm-1.3 2.1c.1.3.1.7.1 1.1-.1 1.3-.4 2.6-.7 3.8-.6 2.2-1.5 4.2-2.7 5.6-.7.8-1.5 1.4-2.3 1.6-.4.1-.7.1-1-.1-.2-.1-.3-.3-.4-.6-.1-.3-.1-.7-.1-1.1.1-1.3.4-2.6.7-3.8.6-2.2 1.5-4.2 2.7-5.6.7-.8 1.5-1.4 2.3-1.6.4-.1.7-.1 1 .1.2.1.3.3.4.6z"
      fill="url(#bananaGradient)"
    />
    <path 
      d="M16.8 5.2c-.1-.1-.3-.2-.5-.2-.2 0-.4.1-.5.2-.1.1-.2.3-.2.5s.1.4.2.5c.1.1.3.2.5.2.2 0 .4-.1.5-.2.1-.1.2-.3.2-.5s-.1-.4-.2-.5z"
      fill="#8B6914"
    />
  </svg>
);


// Upload icon with banana theme
export const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
  </svg>
);

// Download icon with banana peel accent
export const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

// Undo icon with curved banana-like arrow
export const UndoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
  </svg>
);

// Redo icon with curved banana-like arrow
export const RedoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
  </svg>
);

// Eye icon with banana-shaped pupil
export const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const GenerateIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.572L16.5 21.75l-.398-1.178a3.375 3.375 0 00-2.456-2.456L12.5 17.25l1.178-.398a3.375 3.375 0 002.456-2.456L16.5 13.5l.398 1.178a3.375 3.375 0 002.456 2.456L20.5 17.25l-1.178.398a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
);

export const ComposeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125A2.25 2.25 0 014.5 4.875h15A2.25 2.25 0 0121.75 7.125v1.518a2.25 2.25 0 01-2.25 2.25H4.5A2.25 2.25 0 012.25 8.643V7.125z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.375A2.25 2.25 0 014.5 13.125h15A2.25 2.25 0 0121.75 15.375v1.518a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V15.375z" />
  </svg>
);

// Magic wand for Retouch
export const MagicWandIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4-2.245 4.5 4.5 0 011.13-6.884 3 3 0 005.78-1.128 2.25 2.25 0 012.4 2.245 4.5 4.5 0 01-1.13 6.884z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.04 21.534a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4-2.245 4.5 4.5 0 011.13-6.884 3 3 0 005.78-1.128 2.25 2.25 0 012.4 2.245 4.5 4.5 0 01-1.13 6.884zM8.25 6.75h.008v.008H8.25V6.75z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25h.008v.008H12V2.25zM15.75 6.75h.008v.008h-.008V6.75zM19.5 9.75h.008v.008H19.5V9.75z" />
  </svg>
);

export const PaletteIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.093 4.093a10.43 10.43 0 0111.314 0 10.43 10.43 0 014.502 8.007 10.43 10.43 0 01-4.502 8.007 10.43 10.43 0 01-11.314 0 10.43 10.43 0 01-4.502-8.007 10.43 10.43 0 014.502-8.007zM7.5 12a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm4.5-3.75a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm6 3.75a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-4.5 3.75a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
);

export const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
);

export const CropIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H4.5A2.25 2.25 0 002.25 6v12.75c0 1.242.984 2.25 2.19 2.25h12.75c1.206 0 2.19-.933 2.19-2.185V16.5M7.5 3.75v13.5m0-13.5H16.5m-9 0L20.25 20.25" />
    </svg>
);

export const ExpandIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L15 9m5.25 11.25v-4.5m0 4.5h-4.5m4.5 0L15 15" />
    </svg>
);

export const RemoveBgIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const CollageIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
);

export const ScenesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
);

export const LightingIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.82.161m-6.077-4.5a.75.75 0 00-1.06 0l-1.5 1.5a.75.75 0 000 1.06l1.5 1.5a.75.75 0 001.06 0l1.5-1.5a.75.75 0 000-1.06l-1.5-1.5zM12 21a.75.75 0 01-.75-.75V18a.75.75 0 011.5 0v2.25A.75.75 0 0112 21zM5.25 12a.75.75 0 01-.75-.75H3a.75.75 0 010-1.5h1.5a.75.75 0 01.75.75zM8.25 8.25a.75.75 0 01-.53-1.28L6 5.25a.75.75 0 011.06-1.06l1.72 1.72a.75.75 0 01-.53 1.28z" />
    </svg>
);

export const UpscaleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.25V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V8.25m-18 0V6a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6v2.25m-18 0h18M12 15.75l-3-3m0 0l3-3m-3 3h6" />
    </svg>
);