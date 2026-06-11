import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { createTrashBinIcon } from '../ui/TrashBinMarker';
import { useLixeiraActions } from '../../hooks/useLixeiras';

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

export default function EditLixeiraModal({ isOpen, onClose, lixeira }) {
  const defaultLocation = [-12.199110, -38.969515];

  const [formData, setFormData] = useState({
    name: '',
    lat: defaultLocation[0].toString(),
    lng: defaultLocation[1].toString()
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateLixeira } = useLixeiraActions();
  
  const markerRef = useRef(null);

  useEffect(() => {
    if (isOpen && lixeira) {
      setFormData({
        name: lixeira.name || '',
        lat: lixeira.location?.lat?.toString() || defaultLocation[0].toString(),
        lng: lixeira.location?.lng?.toString() || defaultLocation[1].toString()
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, lixeira?.id]);

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
    if (!formData.name || !formData.lat || !formData.lng) {
      toast.error('O nome e a localização são obrigatórios');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await updateLixeira(lixeira.id, {
        name: formData.name,
        location: {
          lat: parseFloat(formData.lat),
          lng: parseFloat(formData.lng)
        }
      });
      
      if (response.success) {
        toast.success('Lixeira atualizada com sucesso');
        onClose();
      } else {
        toast.error('Falha ao atualizar a lixeira');
      }
    } catch (error) {
      console.error('Error updating bin:', error);
      toast.error('Falha ao atualizar a lixeira');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!lixeira) return null;

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
            className="fixed inset-0 bg-[#0B0F13]/80 backdrop-blur-sm z-50"
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
                  Editar Lixeira
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
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">ID do Dispositivo</label>
                <input
                  type="text"
                  value={lixeira.id}
                  disabled
                  className="w-full bg-[#0B0F13]/50 border border-[#2A313C]/50 rounded-md px-3 py-2 text-gray-500 font-mono text-sm cursor-not-allowed"
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
                        icon={createTrashBinIcon(lixeira.state?.status || 'normal')}
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
                  {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
