import React from 'react';
import { Route, X, Loader2, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MapRoutingControls({ 
  onCalculateRoute, 
  onClearRoute, 
  isCalculating, 
  routeData 
}) {
  return (
    <div className="absolute top-16 right-4 z-[400] flex flex-col gap-2 pointer-events-auto">
      <AnimatePresence mode="wait">
        {!routeData ? (
          <motion.button
            key="calc-btn"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={onCalculateRoute}
            disabled={isCalculating}
            className="flex items-center gap-2 bg-[#111820]/90 backdrop-blur-md px-4 py-3 border border-[#00E676]/50 text-[#00E676] font-mono text-xs uppercase tracking-widest rounded-lg shadow-lg hover:bg-[#00E676]/10 transition-all disabled:opacity-50 group"
          >
            {isCalculating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Route className="w-4 h-4 group-hover:scale-110 transition-transform" />
            )}
            {isCalculating ? 'Calculando...' : 'Otimizar Coleta'}
          </motion.button>
        ) : (
          <motion.div
            key="route-info"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-[#111820]/95 backdrop-blur-md border border-[#00B0FF]/30 rounded-lg shadow-2xl p-4 w-64 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2 text-[#00B0FF]">
                <Navigation className="w-4 h-4" />
                <span className="font-mono text-xs font-bold tracking-widest uppercase">Rota Ativa</span>
              </div>
              <button 
                onClick={onClearRoute}
                className="text-gray-500 hover:text-white transition-colors p-1"
                title="Limpar Rota"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-black/30 p-2 rounded border border-white/5">
                <div className="text-[10px] text-gray-500 font-mono uppercase mb-1">Distância</div>
                <div className="text-sm text-white font-mono">{routeData.distance.toFixed(1)} km</div>
              </div>
              <div className="bg-black/30 p-2 rounded border border-white/5">
                <div className="text-[10px] text-gray-500 font-mono uppercase mb-1">Tempo Est.</div>
                <div className="text-sm text-white font-mono">{Math.round(routeData.duration)} min</div>
              </div>
            </div>

            <div className="bg-[#00E676]/10 border border-[#00E676]/20 p-2 rounded text-center">
              <span className="text-[#00E676] font-mono text-[10px] uppercase tracking-wide">
                {routeData.waypointsOrder.length} Lixeiras na Rota
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
