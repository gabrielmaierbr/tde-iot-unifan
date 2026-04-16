import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb, Fan, Plug, Tv, Speaker, Blinds, Thermometer, Droplets } from 'lucide-react';
import { useDevice } from '../../hooks/useDevice';
import { useRooms } from '../../hooks/useRooms';
import { showSuccess, showError } from '../../utils/alerts';

const icons = [
  { name: 'Lightbulb', icon: Lightbulb },
  { name: 'Fan', icon: Fan },
  { name: 'Plug', icon: Plug },
  { name: 'Tv', icon: Tv },
  { name: 'Speaker', icon: Speaker },
  { name: 'Blinds', icon: Blinds },
  { name: 'Thermometer', icon: Thermometer },
  { name: 'Droplets', icon: Droplets }
];

export default function AddDeviceModal({ isOpen, onClose }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('toggle');
  const [roomId, setRoomId] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Lightbulb');
  const [loading, setLoading] = useState(false);
  
  const { rooms } = useRooms();
  const { addDevice } = useDevice();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !roomId) return;

    setLoading(true);
    const result = await addDevice({
      name: name.trim(),
      type,
      roomId,
      icon: selectedIcon,
      state: { power: false, ...(type === 'range' ? { value: 0 } : {}) }
    });
    setLoading(false);
    
    if (result.success) {
      showSuccess('Dispositivo adicionado!');
      // Reset form
      setName('');
      setType('toggle');
      setRoomId('');
      setSelectedIcon('Lightbulb');
      onClose();
    } else {
      showError('Erro ao adicionar dispositivo');
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
              <h3 className="text-lg font-medium text-white">Adicionar Dispositivo</h3>
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
                    Nome do Dispositivo
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Lâmpada do Teto"
                    className="w-full bg-base-bg border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Cômodo
                  </label>
                  <select
                    required
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="w-full bg-base-bg border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  >
                    <option value="" disabled>Selecione um cômodo</option>
                    {Object.entries(rooms || {})
                      .sort((a, b) => (a[1].order || 0) - (b[1].order || 0))
                      .map(([id, room]) => (
                      <option key={id} value={id}>{room.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Tipo de Controle
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all ${
                      type === 'toggle' ? 'bg-primary/20 border-primary text-primary' : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                    }`}>
                      <input type="radio" value="toggle" checked={type === 'toggle'} onChange={() => setType('toggle')} className="hidden" />
                      <span className="text-sm font-medium">On / Off</span>
                    </label>
                    <label className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all ${
                      type === 'range' ? 'bg-primary/20 border-primary text-primary' : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                    }`}>
                      <input type="radio" value="range" checked={type === 'range'} onChange={() => setType('range')} className="hidden" />
                      <span className="text-sm font-medium">Deslizante (0-100%)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ícone
                  </label>
                  <div className="grid grid-cols-4 gap-2">
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
                  disabled={loading || !name.trim() || !roomId}
                  className="px-6 py-2 rounded-lg text-sm font-medium bg-primary text-surface-bg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Adicionando...' : 'Adicionar'}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
