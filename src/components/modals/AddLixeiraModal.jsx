import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin } from 'lucide-react';
import { database } from '../../firebase/config';
import { ref, set } from 'firebase/database';
import toast from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { createTrashBinIcon } from '../ui/TrashBinMarker';

function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapCenterUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

export default function AddLixeiraModal({ isOpen, onClose }) {
  const defaultLocation = [-12.199110, -38.969515]; // Default to Uefs

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    lat: defaultLocation[0].toString(),
    lng: defaultLocation[1].toString()
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const markerRef = useRef(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const position = marker.getLatLng();
          setFormData(prev => ({
            ...prev,
            lat: position.lat.toFixed(6),
            lng: position.lng.toFixed(6)
          }));
        }
      },
    }),
    []
  );

  const handleLocationSelect = (lat, lng) => {
    setFormData(prev => ({
      ...prev,
      lat: lat.toFixed(6),
      lng: lng.toFixed(6)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id || !formData.name || !formData.lat || !formData.lng) {
      toast.error('Todos os campos são obrigatórios');
      return;
    }

    setIsSubmitting(true);
    try {
      const binRef = ref(database, `lixeiras/${formData.id}`);
      await set(binRef, {
        name: formData.name,
        location: {
          lat: parseFloat(formData.lat),
          lng: parseFloat(formData.lng)
        },
        state: {
          fillLevel: 0,
          status: 'normal',
          lastSeen: Date.now()
        }
      });
      toast.success('Lixeira Smart implantada com sucesso');
      setFormData({ id: '', name: '', lat: defaultLocation[0].toString(), lng: defaultLocation[1].toString() });
      onClose();
    } catch (error) {
      console.error('Error adding bin:', error);
      toast.error('Falha ao implantar a Lixeira Smart');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine current map center from form data (if valid), otherwise fallback
  const currentLat = parseFloat(formData.lat);
  const currentLng = parseFloat(formData.lng);
  const isValidLocation = !isNaN(currentLat) && !isNaN(currentLng);
  const position = isValidLocation ? [currentLat, currentLng] : defaultLocation;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0B0F13]/80 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-[#111820] border border-[#2A313C] rounded-lg shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#2A313C] bg-[#0B0F13] shrink-0">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#00E676]" />
                <h2 className="text-sm font-mono font-bold text-white tracking-widest uppercase">
                  Cadastrar Nova Lixeira
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-gray-500 hover:text-white transition-colors rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">ID do Dispositivo (Único)</label>
                  <input
                    type="text"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    placeholder="ex: lixeira-01"
                    className="w-full bg-[#0B0F13] border border-[#2A313C] rounded-md px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#00E676]/50 focus:ring-1 focus:ring-[#00E676]/50 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Nome de Exibição</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="ex: Lixeira Entrada Principal"
                    className="w-full bg-[#0B0F13] border border-[#2A313C] rounded-md px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#00E676]/50 focus:ring-1 focus:ring-[#00E676]/50 transition-all"
                  />
                </div>
              </div>

              {/* Map Container for Location Selection */}
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Localização</label>
                  <span className="text-[10px] font-mono text-[#00E676]/70">Clique ou Arraste o Marcador</span>
                </div>
                <div className="h-64 w-full rounded-md border border-[#2A313C] overflow-hidden relative z-0">
                  <MapContainer
                    center={position}
                    zoom={17}
                    className="w-full h-full"
                    zoomControl={false}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                      url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />
                    <MapClickHandler onLocationSelect={handleLocationSelect} />
                    <MapCenterUpdater center={position} />
                    
                    {isValidLocation && (
                      <Marker
                        draggable={true}
                        eventHandlers={eventHandlers}
                        position={position}
                        ref={markerRef}
                        icon={createTrashBinIcon('normal')}
                      />
                    )}
                  </MapContainer>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.lat}
                    onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                    placeholder="-23.5505"
                    className="w-full bg-[#0B0F13] border border-[#2A313C] rounded-md px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#00E676]/50 focus:ring-1 focus:ring-[#00E676]/50 transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.lng}
                    onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                    placeholder="-46.6333"
                    className="w-full bg-[#0B0F13] border border-[#2A313C] rounded-md px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#00E676]/50 focus:ring-1 focus:ring-[#00E676]/50 transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-mono text-gray-400 hover:text-white transition-colors uppercase tracking-wider"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/30 hover:bg-[#00E676]/20 transition-all rounded-md font-mono text-xs uppercase tracking-wider disabled:opacity-50"
                >
                  {isSubmitting ? 'Cadastrando...' : 'Cadastrar Lixeira'}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
