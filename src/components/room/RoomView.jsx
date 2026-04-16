import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useDevices } from '../../hooks/useDevices';
import { useRooms } from '../../hooks/useRooms';
import { useRoomActions } from '../../hooks/useDevice';
import ToggleDevice from '../devices/ToggleDevice';
import RangeDevice from '../devices/RangeDevice';
import AddDeviceModal from '../modals/AddDeviceModal';
import EditRoomModal from '../modals/EditRoomModal';
import { confirmDelete, showSuccess } from '../../utils/alerts';

export default function RoomView({ selectedRoom, setSelectedRoom }) {
  const { devices } = useDevices();
  const { rooms } = useRooms();
  const { removeRoom } = useRoomActions();
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);
  const [isEditRoomModalOpen, setIsEditRoomModalOpen] = useState(false);

  const handleDeleteRoom = async () => {
    const isConfirmed = await confirmDelete(
      'Excluir Cômodo?',
      'Tem certeza que deseja excluir este cômodo e todos os seus dispositivos?'
    );
    
    if (isConfirmed) {
      await removeRoom(selectedRoom);
      if (setSelectedRoom) setSelectedRoom(null);
      showSuccess('Cômodo excluído com sucesso!');
    }
  };

  // Filter devices based on selected room, or show all if null
  const filteredDevices = Object.entries(devices || {}).filter(
    ([, device]) => selectedRoom === null || device.roomId === selectedRoom
  );

  const currentRoomName = selectedRoom ? rooms[selectedRoom]?.name : 'Visão Geral';

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
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: { opacity: 1, scale: 1, y: 0 }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-white">{currentRoomName}</h2>
            {selectedRoom && (
              <div className="flex gap-1 ml-2">
                <button
                  onClick={() => setIsEditRoomModalOpen(true)}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                  title="Editar Cômodo"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDeleteRoom}
                  className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                  title="Excluir Cômodo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          <p className="text-gray-400 mt-1 text-sm">
            {filteredDevices.length} {filteredDevices.length === 1 ? 'dispositivo' : 'dispositivos'}
          </p>
        </div>
        
        <button
          onClick={() => setIsAddDeviceModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-surface-bg rounded-lg font-medium transition-all"
        >
          <Plus className="w-5 h-5" />
          Adicionar Dispositivo
        </button>
      </div>

      {filteredDevices.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center h-64 text-center border border-dashed border-white/10 rounded-2xl bg-white/5"
        >
          <div className="w-16 h-16 mb-4 rounded-full bg-white/5 flex items-center justify-center">
            <Plus className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Nenhum dispositivo encontrado</h3>
          <p className="text-gray-400 text-sm max-w-sm mb-6">
            Adicione seu primeiro dispositivo para começar a controlar o ambiente.
          </p>
          <button
            onClick={() => setIsAddDeviceModalOpen(true)}
            className="px-6 py-2 bg-primary text-surface-bg rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Adicionar Agora
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredDevices.map(([id, device]) => (
            <div key={id} className="h-full">
              {device.type === 'range' ? (
                <RangeDevice deviceId={id} device={device} />
              ) : (
                <ToggleDevice deviceId={id} device={device} />
              )}
            </div>
          ))}
        </div>
      )}

      <AddDeviceModal 
        isOpen={isAddDeviceModalOpen} 
        onClose={() => setIsAddDeviceModalOpen(false)} 
      />

      <EditRoomModal
        isOpen={isEditRoomModalOpen}
        onClose={() => setIsEditRoomModalOpen(false)}
        room={selectedRoom ? rooms[selectedRoom] : null}
        roomId={selectedRoom}
      />
    </div>
  );
}
