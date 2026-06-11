import React from 'react';
import { motion } from 'framer-motion';

export default function FillStatusBadge({ status }) {
  const getStatusConfig = () => {
    switch (status) {
      case 'cheia':
        return { color: 'bg-[#FF1744]', text: 'CHEIA', glow: 'shadow-[0_0_10px_rgba(255,23,68,0.8)]', pulse: true };
      case 'atencao':
        return { color: 'bg-[#FFEA00]', text: 'ATENÇÃO', glow: 'shadow-[0_0_10px_rgba(255,234,0,0.5)]', pulse: true };
      case 'normal':
      default:
        return { color: 'bg-[#00E676]', text: 'NORMAL', glow: 'shadow-[0_0_10px_rgba(0,230,118,0.4)]', pulse: false };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`flex items-center gap-2 bg-[#1A242E]/80 backdrop-blur-md px-2.5 py-1 rounded-sm border border-white/5`}>
      <div className="relative flex h-2 w-2">
        {config.pulse && (
          <motion.span 
            animate={{ scale: [1, 2, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: status === 'cheia' ? 0.8 : 2, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute inline-flex h-full w-full rounded-full ${config.color} opacity-75`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.color} ${config.glow}`}></span>
      </div>
      <span className="text-[10px] font-mono font-bold text-gray-200 tracking-widest">
        {config.text}
      </span>
    </div>
  );
}
