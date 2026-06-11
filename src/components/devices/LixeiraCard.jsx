import React from 'react';
import { Trash2, AlertTriangle, WifiOff } from 'lucide-react';
import FillStatusBadge from './FillStatusBadge';
import FillProgressBar from './FillProgressBar';
import { motion } from 'framer-motion';
import { getDerivedStatus } from '../../utils/deviceUtils';

export default function LixeiraCard({ lixeira, onClick, isSelected }) {
  const { name, state } = lixeira;
  const { fillLevel, lastSeen } = state || { fillLevel: 0, lastSeen: 0 };
  const status = getDerivedStatus(fillLevel);

  const [currentTime, setCurrentTime] = React.useState(Date.now());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isOnline = lastSeen ? (currentTime - lastSeen) < 60000 : false;

  // Helper for last seen time
  const timeAgo = () => {
    if (!lastSeen) return 'Nunca';
    const diff = Math.floor((currentTime - lastSeen) / 1000);
    if (diff < 60) return `há ${diff}s`;
    if (diff < 3600) return `há ${Math.floor(diff / 60)}min`;
    return `há ${Math.floor(diff / 3600)}h`;
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative w-full cursor-pointer overflow-hidden rounded-md border ${
        isSelected ? 'border-[#00B0FF] bg-[#1A242E]' : 'border-white/10 bg-[#0B0F13]'
      } p-4 transition-colors duration-200 group`}
    >
      {/* Background industrial texture/grid effect (subtle) */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '10px 10px' }} />

      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-sm ${isSelected ? 'bg-[#00B0FF]/20 text-[#00B0FF]' : 'bg-white/5 text-gray-400 group-hover:text-gray-200'}`}>
              <Trash2 size={16} />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-100">{name}</h3>
              <p className="text-[10px] font-mono text-gray-500">
                {isOnline ? `Visto ${timeAgo()}` : <span className="flex items-center gap-1 text-gray-400"><WifiOff size={10}/> Offline</span>}
              </p>
            </div>
          </div>
          <FillStatusBadge status={status} />
        </div>

        <FillProgressBar percentage={fillLevel} status={status} />
        
        {status === 'cheia' && (
          <div className="flex items-center gap-1 text-[#FF1744] text-[10px] mt-1 font-bold tracking-wide">
            <AlertTriangle size={12} />
            <span>COLETA NECESSÁRIA</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
