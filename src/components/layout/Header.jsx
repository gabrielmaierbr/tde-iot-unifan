import React from 'react';
import { Activity, Wifi, WifiOff, Menu } from 'lucide-react';
import { useDevices } from '../../hooks/useDevices';

export default function Header({ onMenuClick }) {
  const { devices } = useDevices();
  
  // Calculate if any device is online (or if Firebase auth is generally online)
  // Check if internet connection is generally available
  const isOnline = navigator.onLine;

  const onlineDevices = Object.values(devices).filter(d => d.online).length;
  const totalDevices = Object.values(devices).length;

  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-4 bg-surface-bg border-b border-white/5">
      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 rounded-lg text-gray-400 hover:text-white transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="p-2 bg-primary/10 rounded-lg">
          <Activity className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-xl font-semibold tracking-wide text-white">
          IoT<span className="text-primary font-bold">Control</span>
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="w-5 h-5 text-online" />
          ) : (
            <WifiOff className="w-5 h-5 text-offline" />
          )}
          <span className={`text-sm font-medium ${isOnline ? 'text-online' : 'text-offline'}`}>
            {isOnline ? 'Sistema Online' : 'Offline'}
          </span>
        </div>
        {totalDevices > 0 && (
          <div className="text-sm text-gray-400 border-l border-white/10 pl-4 hidden sm:block">
            {onlineDevices} / {totalDevices} devices online
          </div>
        )}
      </div>
    </header>
  );
}
