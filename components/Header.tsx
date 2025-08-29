/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { BananaIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="w-full py-4 px-8 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center justify-center gap-3">
          <BananaIcon className="w-7 h-7 text-yellow-400" />
          <h1 className="text-xl font-bold tracking-tight text-zinc-100">
            Bananatech
          </h1>
      </div>
    </header>
  );
};

export default Header;