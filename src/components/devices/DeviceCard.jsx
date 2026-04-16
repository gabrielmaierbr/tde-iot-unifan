import React from 'react';
import { motion } from 'framer-motion';
import { getIcon } from '../layout/Sidebar';
import DeviceStatusBadge from './DeviceStatusBadge';

export default function DeviceCard({ device, children }) {
  // A device is considered offline if lastSeen is older than 60 seconds
  // Assuming ESP32 pushes updates frequently
  const isOnline = device.online; 

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`relative flex flex-col p-5 rounded-2xl border transition-all duration-300 h-full ${
        device.state?.power 
          ? 'bg-surface-bg border-primary/30 shadow-[0_0_15px_rgba(0,212,255,0.1)]' 
          : 'bg-surface-bg border-white/5 opacity-80 hover:opacity-100'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${
          device.state?.power ? 'bg-primary/20 text-primary' : 'bg-white/5 text-gray-400'
        }`}>
          {getIcon(device.icon)}
        </div>
        <DeviceStatusBadge isOnline={isOnline} lastSeen={device.lastSeen} />
      </div>

      <div className="flex-1">
        <h3 className="text-base font-medium text-white mb-1 truncate">{device.name}</h3>
      </div>

      <div className="mt-4">
        {children}
      </div>
    </motion.div>
  );
}
