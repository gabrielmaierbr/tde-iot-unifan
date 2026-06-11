import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLixeiras } from '../../hooks/useLixeiras';
import LixeiraCard from '../devices/LixeiraCard';
import { Map, Plus, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Sidebar({ selectedLixeira, setSelectedLixeira, isOpen, onClose }) {
  const { lixeiras, loading } = useLixeiras();
  const { logout, currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      toast.error('Erro ao sair da conta');
    }
  };

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
            className="md:hidden fixed inset-0 bg-[#0B0F13]/80 z-20 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>
      <aside className={`fixed md:relative z-30 transition-transform duration-300 w-80 flex flex-col bg-[#0B0F13] border-r border-[#111820] h-[calc(100vh-73px)] ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-[0.2em]">Smart Bins</h2>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-3"
          >
            {/* Visão Geral (Mapa completo) */}
            <motion.div variants={itemVariants}>
              <button
                onClick={() => {
                  setSelectedLixeira(null);
                  if(window.innerWidth < 768) onClose();
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-md transition-all font-mono text-xs uppercase tracking-wider ${
                  selectedLixeira === null 
                    ? 'bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/20 shadow-[0_0_15px_rgba(0,230,118,0.1)]' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-[#111820] border border-transparent'
                }`}
              >
                <Map className="w-4 h-4 flex-shrink-0" />
                <span>Visão Geral do Mapa</span>
              </button>
            </motion.div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent my-4" />

            {loading ? (
              <div className="text-center text-xs font-mono text-gray-500 py-4">CARREGANDO SENSORES...</div>
            ) : Object.keys(lixeiras).length === 0 ? (
              <div className="text-center text-xs font-mono text-gray-500 py-4">NENHUMA LIXEIRA ATIVA</div>
            ) : (
              Object.entries(lixeiras).map(([id, lixeira]) => (
                <motion.div key={id} variants={itemVariants}>
                  <LixeiraCard 
                    lixeira={lixeira} 
                    isSelected={selectedLixeira === id}
                    onClick={() => {
                      setSelectedLixeira(id);
                      if(window.innerWidth < 768) onClose();
                    }}
                  />
                </motion.div>
              ))
            )}
          </motion.div>
        </div>

        {/* Logout Section */}
        <div className="p-4 border-t border-[#111820] bg-[#0B0F13]">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono text-gray-500 truncate pr-2">
              {currentUser?.email || 'Usuário'}
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
