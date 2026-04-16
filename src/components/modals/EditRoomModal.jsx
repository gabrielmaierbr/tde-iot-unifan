import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LayoutTemplate, Home, Bed, Bath, ChefHat, Sofa, Waves, Monitor, Briefcase, Zap } from 'lucide-react';
import { useRoomActions } from '../../hooks/useDevice';
import { showSuccess, showError } from '../../utils/alerts';

const icons = [
  { name: 'Sofa', icon: Sofa },
  { name: 'Home', icon: Home },
  { name: 'Bed', icon: Bed },
  { name: 'Bath', icon: Bath },
  { name: 'ChefHat', icon: ChefHat },
  { name: 'Waves', icon: Waves },
  { name: 'Monitor', icon: Monitor },
  { name: 'Briefcase', icon: Briefcase },
  { name: 'Zap', icon: Zap },
  { name: 'LayoutTemplate', icon: LayoutTemplate },
];

export default function EditRoomModal({ isOpen, onClose, room, roomId }) {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Sofa');
  const [loading, setLoading] = useState(false);
  const { updateRoom } = useRoomActions();

  useEffect(() => {
    if (room && isOpen) {
      setName(room.name || '');
      setSelectedIcon(room.icon || 'Sofa');
    }
  }, [room, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    const result = await updateRoom(roomId, {
      ...room,
      name: name.trim(),
      icon: selectedIcon
    });
    setLoading(false);
    
    if (result.success) {
      showSuccess('Cômodo atualizado!');
      onClose();
    } else {
      showError('Erro ao atualizar cômodo');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-surface-bg border border-white/10 rounded-2xl shadow-xl z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-lg font-medium text-white">Editar Cômodo</h3>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Nome do Cômodo
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Sala de Estar"
                    className="w-full bg-base-bg border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ícone
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {icons.map(({ name: iconName, icon: Icon }) => (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => setSelectedIcon(iconName)}
                        className={`p-3 border rounded-lg flex items-center justify-center transition-all ${
                          selectedIcon === iconName
                            ? 'bg-primary/20 border-primary text-primary'
                            : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading || !name.trim()}
                  className="px-6 py-2 rounded-lg text-sm font-medium bg-primary text-surface-bg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
