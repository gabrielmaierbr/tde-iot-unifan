import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, WifiOff, MapPin, Activity, Edit2, Trash2 } from 'lucide-react';
import FillProgressBar from '../devices/FillProgressBar';
import FillStatusBadge from '../devices/FillStatusBadge';
import { useLixeiraActions } from '../../hooks/useLixeiras';
import EditLixeiraModal from './EditLixeiraModal';
import toast from 'react-hot-toast';
import { getDerivedStatus } from '../../utils/deviceUtils';

export default function LixeiraDrawer({ isOpen, onClose, lixeira }) {
  const { name, state, location } = lixeira || {};
  const { fillLevel, lastSeen } = state || { fillLevel: 0, lastSeen: 0 };
  const status = getDerivedStatus(fillLevel);
  
  const [currentTime, setCurrentTime] = React.useState(() => Date.now());
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { removeLixeira } = useLixeiraActions();

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!lixeira) return null;

  const isOnline = lastSeen ? (currentTime - lastSeen) < 60000 : false;

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir esta lixeira? Esta ação não pode ser desfeita.')) {
      const result = await removeLixeira(lixeira.id);
      if (result.success) {
        toast.success('Lixeira excluída com sucesso');
        onClose(); // Close drawer
      } else {
        toast.error('Erro ao excluir lixeira');
      }
    }
  };

  const timeAgo = () => {
    if (!lastSeen) return 'Nunca';
    const diff = Math.floor((currentTime - lastSeen) / 1000);
    if (diff < 60) return `há ${diff}s`;
    if (diff < 3600) return `há ${Math.floor(diff / 60)}min`;
    return `há ${Math.floor(diff / 3600)}h`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] md:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.5 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full md:w-96 bg-[#0B0F13]/95 backdrop-blur-xl border-l border-[#1A242E] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#1A242E]">
              <div>
                <h2 className="text-lg font-bold text-gray-100">{name}</h2>
                <div className="flex items-center gap-2 mt-1 text-xs font-mono text-gray-500">
                  {isOnline ? (
                    <span className="flex items-center gap-1 text-[#00E676]"><span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse"/> ONLINE</span>
                  ) : (
                    <span className="flex items-center gap-1 text-[#FF1744]"><WifiOff size={12}/> OFFLINE</span>
                  )}
                  <span>•</span>
                  <span>SINC. {timeAgo()}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="p-2 text-gray-400 hover:text-[#00E676] hover:bg-[#1A242E] rounded-md transition-colors"
                  title="Editar Lixeira"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={handleDelete}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-[#1A242E] rounded-md transition-colors"
                  title="Excluir Lixeira"
                >
                  <Trash2 size={18} />
                </button>
                <div className="w-px h-6 bg-[#1A242E] mx-1"></div>
                <button 
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-white hover:bg-[#1A242E] rounded-md transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 space-y-8 overflow-y-auto custom-scrollbar">
              
              {/* Main Status */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono tracking-widest text-gray-500 uppercase flex items-center gap-2">
                    <Activity size={14}/> Status de Capacidade
                  </h3>
                  <FillStatusBadge status={status} />
                </div>
                
                <div className="bg-[#111820] p-5 rounded-lg border border-[#1A242E] shadow-inner relative overflow-hidden">
                   {/* Background industrial texture/grid effect */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                       style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
                  
                  <FillProgressBar percentage={fillLevel} status={status} />
                  
                  <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs font-mono">
                    <span className="text-gray-500">VOLUME ESTIMADO</span>
                    <span className="text-gray-300 font-bold">{fillLevel}% CHEIO</span>
                  </div>
                </div>
              </div>

              {/* Location Data */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono tracking-widest text-gray-500 uppercase flex items-center gap-2">
                  <MapPin size={14}/> Dados de Telemetria
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#111820] p-3 rounded-md border border-[#1A242E]">
                    <div className="text-[10px] text-gray-500 font-mono mb-1">LATITUDE</div>
                    <div className="text-sm font-mono text-[#00B0FF]">{location?.lat?.toFixed(6) || 'N/A'}</div>
                  </div>
                  <div className="bg-[#111820] p-3 rounded-md border border-[#1A242E]">
                    <div className="text-[10px] text-gray-500 font-mono mb-1">LONGITUDE</div>
                    <div className="text-sm font-mono text-[#00B0FF]">{location?.lng?.toFixed(6) || 'N/A'}</div>
                  </div>
                </div>
              </div>
              
              {status === 'cheia' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#FF1744]/10 border border-[#FF1744]/30 rounded-md p-4 text-[#FF1744]"
                >
                  <h4 className="font-bold text-sm mb-1 uppercase tracking-wide">Ação Necessária</h4>
                  <p className="text-xs opacity-90">Esta lixeira atingiu a capacidade crítica e precisa de coleta imediata.</p>
                </motion.div>
              )}

            </div>
          </motion.div>

          <EditLixeiraModal 
            isOpen={isEditModalOpen} 
            onClose={() => setIsEditModalOpen(false)} 
            lixeira={{ ...lixeira, id: lixeira.id || lixeira.name }} 
          />
        </>
      )}
    </AnimatePresence>
  );
}
