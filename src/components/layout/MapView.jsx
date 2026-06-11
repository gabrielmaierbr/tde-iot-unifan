import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { createTrashBinIcon } from '../ui/TrashBinMarker';
import LixeiraDrawer from '../modals/LixeiraDrawer';

// Component to handle auto-panning to selected marker
function MapController({ selectedLixeira, lixeiras }) {
  const map = useMap();

  useEffect(() => {
    if (selectedLixeira && lixeiras[selectedLixeira]?.location) {
      const loc = lixeiras[selectedLixeira].location;
      if (loc.lat && loc.lng) {
        map.flyTo([loc.lat, loc.lng], 18, { animate: true, duration: 1.5 });
      }
    }
  }, [selectedLixeira, lixeiras, map]);

  return null;
}

export default function MapView({ lixeiras, selectedLixeira, setSelectedLixeira }) {
  const defaultCenter = [-12.199110, -38.969515]; // Uefs
  const firstLixeira = Object.values(lixeiras || {})[0];
  const center = firstLixeira?.location?.lat ? [firstLixeira.location.lat, firstLixeira.location.lng] : defaultCenter;

  return (
    <div className="relative w-full h-full bg-[#0B0F13]">
      <MapContainer
        center={center}
        zoom={16}
        className="w-full h-full z-0"
        zoomControl={false}
      >
        {/* Dark theme map tiles (CartoDB Dark Matter) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <MapController selectedLixeira={selectedLixeira} lixeiras={lixeiras} />

        {Object.entries(lixeiras || {}).map(([id, lixeira]) => {
          if (!lixeira.location || !lixeira.location.lat || !lixeira.location.lng) return null;

          const status = lixeira.state?.status || 'normal';

          return (
            <Marker
              key={id}
              position={[lixeira.location.lat, lixeira.location.lng]}
              icon={createTrashBinIcon(status)}
              eventHandlers={{
                click: () => {
                  setSelectedLixeira(id);
                },
              }}
            />
          );
        })}
      </MapContainer>

      {/* Decorative Overlays for Industrial Look */}
      <div className="absolute inset-0 pointer-events-none border-[8px] border-[#0B0F13]/50 z-10 mix-blend-overlay" />
      <div className="absolute top-4 right-4 bg-[#111820]/90 backdrop-blur-md px-4 py-2 border border-[#00E676]/30 text-[#00E676] font-mono text-[10px] tracking-widest z-20 rounded-sm">
        RASTREAMENTO EM TEMPO REAL
      </div>

      {/* Drawer */}
      <LixeiraDrawer
        isOpen={!!selectedLixeira}
        onClose={() => setSelectedLixeira(null)}
        lixeira={selectedLixeira && lixeiras[selectedLixeira] ? { ...lixeiras[selectedLixeira], id: selectedLixeira } : null}
      />
    </div>
  );
}
