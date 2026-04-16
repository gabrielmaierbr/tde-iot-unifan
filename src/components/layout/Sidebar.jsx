import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, LayoutTemplate, Home, Bed, Bath, ChefHat, Sofa, Waves, Monitor, Briefcase, Zap, Lightbulb, Fan, Plug, Tv, Speaker, Blinds, Thermometer, Droplets } from 'lucide-react';
import { useRooms } from '../../hooks/useRooms';
import AddRoomModal from '../modals/AddRoomModal';

// Add more icons later if needed
const iconMap = {
  Sofa, Home, Bed, Bath, ChefHat, Waves, Monitor, Briefcase, Zap, LayoutTemplate,
  Lightbulb, Fan, Plug, Tv, Speaker, Blinds, Thermometer, Droplets
};

export const getIcon = (iconName) => {
  const Icon = iconMap[iconName] || LayoutTemplate;
  return <Icon className="w-5 h-5 flex-shrink-0" />;
};

export default function Sidebar({ selectedRoom, setSelectedRoom, isOpen, onClose }) {
  const { rooms } = useRooms();
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="md:hidden fixed inset-0 bg-black/60 z-20 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>
      <aside className={`fixed md:relative z-30 transition-transform duration-300 w-64 flex flex-col bg-base-bg border-r border-white/5 h-[calc(100vh-73px)] ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      <div className="p-4 flex-1 overflow-y-auto">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4 px-2">Cômodos</h2>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-1"
        >
          <motion.div variants={itemVariants}>
            <button
              onClick={() => setSelectedRoom(null)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                selectedRoom === null 
                  ? 'bg-primary/20 text-primary font-medium' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              <LayoutTemplate className="w-5 h-5 flex-shrink-0" />
              <span>Visão Geral</span>
            </button>
          </motion.div>

          {Object.entries(rooms || {})
            .sort((a, b) => (a[1].order || 0) - (b[1].order || 0))
            .map(([roomId, room]) => (
            <motion.div key={roomId} variants={itemVariants}>
              <button
                onClick={() => setSelectedRoom(roomId)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all relative overflow-hidden group ${
                  selectedRoom === roomId 
                    ? 'bg-accent/20 text-accent font-medium' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                {selectedRoom === roomId && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-r-full" />
                )}
                {getIcon(room.icon)}
                <span className="truncate">{room.name}</span>
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={() => setIsAddRoomModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-white/10 text-gray-400 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Adicionar Cômodo
        </button>
      </div>

      <AddRoomModal isOpen={isAddRoomModalOpen} onClose={() => setIsAddRoomModalOpen(false)} />
    </aside>
    </>
  );
}
