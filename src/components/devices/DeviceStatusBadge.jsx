import React from 'react';
import { motion } from 'framer-motion';

export default function DeviceStatusBadge({ isOnline, lastSeen }) {
  // If the device has not been seen for a long time, consider it offline. 
  // However, the ESP32 should manage the online flag directly.
  return (
    <div className="flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded-full border border-white/5">
      <div className="relative flex h-2 w-2">
        {isOnline && (
          <motion.span 
            animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inline-flex h-full w-full rounded-full bg-online opacity-75"
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${isOnline ? 'bg-online' : 'bg-offline'}`}></span>
      </div>
      <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
        {isOnline ? 'Online' : 'Offline'}
      </span>
    </div>
  );
}
