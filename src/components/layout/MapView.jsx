import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Polyline } from 'react-leaflet';
import { createTrashBinIcon } from '../ui/TrashBinMarker';
import LixeiraDrawer from '../modals/LixeiraDrawer';
import MapRoutingControls from './MapRoutingControls';
import toast from 'react-hot-toast';
import { renderToString } from 'react-dom/server';
import { divIcon } from 'leaflet';
import { Home } from 'lucide-react';

import { getDerivedStatus } from '../../utils/deviceUtils';

// Component to handle auto-panning to selected marker
function MapController({ selectedLixeira, lixeiras, routeData }) {
  const map = useMap();

  useEffect(() => {
    if (selectedLixeira && lixeiras[selectedLixeira]?.location) {
      const loc = lixeiras[selectedLixeira].location;
      if (loc.lat && loc.lng) {
        map.flyTo([loc.lat, loc.lng], 18, { animate: true, duration: 1.5 });
      }
    }
  }, [selectedLixeira, lixeiras, map]);

  useEffect(() => {
    if (routeData && routeData.coords.length > 0) {
      map.fitBounds(routeData.coords, { padding: [50, 50], animate: true, duration: 1 });
    }
  }, [routeData, map]);

  return null;
}

const createBaseIcon = () => {
  const iconHtml = renderToString(
    <div className="relative flex items-center justify-center w-10 h-10 rounded-lg border-2 border-[#00B0FF] bg-[#00B0FF]/20 shadow-[0_0_15px_rgba(0,176,255,0.5)] backdrop-blur-md">
      <Home size={20} className="text-[#00B0FF]" />
      <span className="absolute -bottom-5 text-[10px] font-mono text-[#00B0FF] font-bold bg-[#0B0F13]/80 px-1 rounded">BASE</span>
    </div>
  );

  return divIcon({
    html: iconHtml,
    className: 'custom-leaflet-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

export default function MapView({ lixeiras, selectedLixeira, setSelectedLixeira }) {
  const defaultCenter = [-12.199110, -38.969515]; // Uefs Base
  const firstLixeira = Object.values(lixeiras || {})[0];
  const center = firstLixeira?.location?.lat ? [firstLixeira.location.lat, firstLixeira.location.lng] : defaultCenter;

  const [routeData, setRouteData] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [baseLocation, setBaseLocation] = useState(defaultCenter);

  const handleCalculateRoute = async () => {
    const binsToCollect = Object.entries(lixeiras || {}).filter(([id, lixeira]) => {
      const status = getDerivedStatus(lixeira.state?.fillLevel);
      const isCritical = status === 'cheia' || status === 'atencao';
      return isCritical && lixeira.location?.lat && lixeira.location?.lng;
    });

    if (binsToCollect.length === 0) {
      toast('Nenhuma lixeira precisa de coleta no momento.', { icon: 'ℹ️' });
      return;
    }

    if (binsToCollect.length > 25) {
      toast.error('Limite de 25 lixeiras excedido para o roteamento. Coletando as 25 mais críticas.');
      binsToCollect.sort((a, b) => (b[1].state?.fillLevel || 0) - (a[1].state?.fillLevel || 0));
      binsToCollect.length = 25;
    }

    setIsCalculating(true);

    let currentBaseLoc = { lat: defaultCenter[0], lng: defaultCenter[1] };

    try {
      if ('geolocation' in navigator) {
        const pos = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
        });
        currentBaseLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setBaseLocation([currentBaseLoc.lat, currentBaseLoc.lng]);
      }
    } catch (err) {
      console.warn('Erro ao obter localização:', err);
      toast.error('Não foi possível obter sua localização exata. Usando base padrão.');
      setBaseLocation(defaultCenter);
    }

    try {
      const coords = [
        `${currentBaseLoc.lng},${currentBaseLoc.lat}`,
        ...binsToCollect.map(([, bin]) => `${bin.location.lng},${bin.location.lat}`)
      ].join(';');

      // 1. Ida: Rota otimizada para coletar as lixeiras (termina na última lixeira do roteamento)
      const response = await fetch(`https://router.project-osrm.org/trip/v1/driving/${coords}?roundtrip=false&source=first&destination=any&geometries=geojson`);
      
      if (!response.ok) throw new Error('Falha na API de Roteamento OSRM');
      
      const data = await response.json();
      if (data.code !== 'Ok') throw new Error('Não foi possível calcular a rota');

      const trip = data.trips[0];
      const outboundCoords = trip.geometry.coordinates.map(coord => [coord[1], coord[0]]);
      
      const waypointsOrder = [];
      let maxIndex = -1;
      let lastWaypointRawIndex = 0;

      data.waypoints.forEach((wp, index) => {
        if (wp.waypoint_index > maxIndex) {
          maxIndex = wp.waypoint_index;
          lastWaypointRawIndex = index;
        }
        if (index > 0) {
          waypointsOrder.push({
            id: binsToCollect[index - 1][0],
            order: wp.waypoint_index
          });
        }
      });

      const lastWaypoint = data.waypoints[lastWaypointRawIndex];

      // 2. Volta: Rota da última lixeira de volta para a base
      const returnResponse = await fetch(`https://router.project-osrm.org/route/v1/driving/${lastWaypoint.location[0]},${lastWaypoint.location[1]};${currentBaseLoc.lng},${currentBaseLoc.lat}?geometries=geojson`);
      let returnCoords = [];
      if (returnResponse.ok) {
        const returnData = await returnResponse.json();
        if (returnData.code === 'Ok') {
          returnCoords = returnData.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
        }
      }

      setRouteData({
        outboundCoords,
        returnCoords,
        coords: [...outboundCoords, ...returnCoords], // For fitBounds
        distance: trip.distance / 1000,
        duration: trip.duration / 60,
        waypointsOrder,
        pendingBins: binsToCollect.map(b => b[0])
      });

      toast.success('Rotas de ida e volta geradas com sucesso!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao calcular rota. O serviço OSRM pode estar indisponível.');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleClearRoute = () => {
    setRouteData(null);
  };

  const getSequenceNumber = (id) => {
    if (!routeData) return null;
    const wp = routeData.waypointsOrder.find(w => w.id === id);
    return wp ? wp.order : null;
  };

  return (
    <div className="relative w-full h-full bg-[#0B0F13]">
      <MapContainer
        center={center}
        zoom={16}
        className="w-full h-full z-0"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <MapController selectedLixeira={selectedLixeira} lixeiras={lixeiras} routeData={routeData} />

        {/* Base Marker */}
        <Marker position={baseLocation} icon={createBaseIcon()} />

        {/* Route Line */}
        {routeData && (() => {
          const allCollected = routeData.pendingBins.every(id => getDerivedStatus(lixeiras[id]?.state?.fillLevel) === 'normal');
          const coords = allCollected ? routeData.returnCoords : routeData.outboundCoords;
          const color = allCollected ? "#4CAF50" : "#00B0FF";
          
          if (!coords || coords.length === 0) return null;

          return (
            <Polyline 
              positions={coords} 
              color={color} 
              weight={4} 
              opacity={0.8} 
              dashArray="10, 10" 
              className="animate-dash"
            />
          );
        })()}

        {Object.entries(lixeiras || {}).map(([id, lixeira]) => {
          if (!lixeira.location || !lixeira.location.lat || !lixeira.location.lng) return null;

          const status = getDerivedStatus(lixeira.state?.fillLevel);
          const sequenceNumber = getSequenceNumber(id);

          return (
            <Marker
              key={id}
              position={[lixeira.location.lat, lixeira.location.lng]}
              icon={createTrashBinIcon(status, sequenceNumber)}
              eventHandlers={{
                click: () => setSelectedLixeira(id),
              }}
            />
          );
        })}
      </MapContainer>

      <div className="absolute inset-0 pointer-events-none border-[8px] border-[#0B0F13]/50 z-10 mix-blend-overlay" />
      
      <MapRoutingControls 
        onCalculateRoute={handleCalculateRoute}
        onClearRoute={handleClearRoute}
        isCalculating={isCalculating}
        routeData={routeData}
      />

      {/* Drawer */}
      <LixeiraDrawer
        isOpen={!!selectedLixeira}
        onClose={() => setSelectedLixeira(null)}
        lixeira={selectedLixeira && lixeiras[selectedLixeira] ? { ...lixeiras[selectedLixeira], id: selectedLixeira } : null}
      />
    </div>
  );
}
