import React from 'react';
import { motion } from 'framer-motion';

export default function FillProgressBar({ percentage, status }) {
  const getStatusColor = () => {
    switch (status) {
      case 'cheia': return '#FF1744';
      case 'atencao': return '#FFEA00';
      case 'normal':
      default: return '#00E676';
    }
  };

  const color = getStatusColor();
  const safePercentage = Math.min(Math.max(percentage || 0, 0), 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-1">
        <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Nível</span>
        <span className="text-xs font-mono font-bold" style={{ color }}>{safePercentage}%</span>
      </div>
      <div className="h-1.5 w-full bg-[#111820] rounded-sm overflow-hidden border border-white/5 relative">
        {/* Glow effect under the bar */}
        <div 
          className="absolute top-0 bottom-0 left-0 opacity-30 blur-sm transition-all duration-700 ease-out"
          style={{ width: `${safePercentage}%`, backgroundColor: color }}
        />
        {/* Actual progress bar */}
        <motion.div 
          className="h-full relative z-10"
          initial={{ width: 0 }}
          animate={{ width: `${safePercentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
        />
      </div>
    </div>
  );
}
