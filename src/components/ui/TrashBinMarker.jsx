import React from 'react';
import { divIcon } from 'leaflet';
import { renderToString } from 'react-dom/server';
import { Trash2 } from 'lucide-react';

// We use renderToString to convert the React component to an HTML string for Leaflet's divIcon
export const createTrashBinIcon = (status, sequenceNumber = null) => {
  let colorClass = 'text-[#00E676] bg-[#00E676]/20 border-[#00E676]';
  let glowClass = 'shadow-[0_0_15px_rgba(0,230,118,0.5)]';
  let pulseClass = '';

  if (status === 'cheia') {
    colorClass = 'text-[#FF1744] bg-[#FF1744]/20 border-[#FF1744]';
    glowClass = 'shadow-[0_0_20px_rgba(255,23,68,0.8)]';
    pulseClass = 'animate-pulse';
  } else if (status === 'atencao') {
    colorClass = 'text-[#FFEA00] bg-[#FFEA00]/20 border-[#FFEA00]';
    glowClass = 'shadow-[0_0_15px_rgba(255,234,0,0.5)]';
  }

  const iconHtml = renderToString(
    <div className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 ${colorClass} ${glowClass} ${pulseClass} backdrop-blur-md transition-all duration-300`}>
      <Trash2 size={20} strokeWidth={2.5} />
      
      {sequenceNumber !== null && (
        <span className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 rounded-full bg-[#00E676] text-[#0B0F13] font-bold text-xs border-2 border-[#111820] shadow-lg z-10">
          {sequenceNumber}
        </span>
      )}

      {status === 'cheia' && sequenceNumber === null && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF1744] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF1744]"></span>
        </span>
      )}
    </div>
  );

  return divIcon({
    html: iconHtml,
    className: 'custom-leaflet-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20], // Center the icon
  });
};
