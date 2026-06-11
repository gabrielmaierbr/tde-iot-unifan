import React, { useState } from 'react';
import { Activity, Wifi, WifiOff, Menu, Plus } from 'lucide-react';
import { useLixeiras } from '../../hooks/useLixeiras';
import AddLixeiraModal from '../modals/AddLixeiraModal';

export default function Header({ onMenuClick }) {
  const { lixeiras } = useLixeiras();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const isOnline = navigator.onLine;
  const totalBins = Object.values(lixeiras || {}).length;

  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-4 bg-[#0B0F13] border-b border-[#111820]">
      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 rounded-lg text-gray-400 hover:text-white transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="p-2 bg-[#00E676]/10 rounded-lg">
          <Activity className="w-6 h-6 text-[#00E676]" />
        </div>
        <h1 className="text-xl font-sans font-semibold tracking-wide text-white">
          Smart<span className="text-[#00E676] font-bold">Bin</span>
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="w-4 h-4 text-[#00E676]" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-500" />
          )}
          <span className={`text-xs font-mono uppercase tracking-wider hidden sm:inline-block ${isOnline ? 'text-[#00E676]' : 'text-red-500'}`}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>

        {totalBins > 0 && (
          <div className="text-sm font-mono text-gray-400 border-l border-[#111820] pl-4 hidden sm:block">
            {totalBins} LIXEIRAS ATIVAS
          </div>
        )}

        <div className="pl-2 sm:pl-4 sm:border-l border-[#111820]">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/30 hover:bg-[#00E676]/20 transition-all rounded-md font-mono text-xs uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline-block">Adicionar</span>
          </button>
        </div>
      </div>

      <AddLixeiraModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </header>
  );
}
