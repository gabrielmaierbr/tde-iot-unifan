import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import MapView from '../components/layout/MapView';
import { useLixeiras } from '../hooks/useLixeiras';

export default function Dashboard() {
  const [selectedLixeira, setSelectedLixeira] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { lixeiras, loading } = useLixeiras();

  return (
    <div className="min-h-screen bg-base-bg flex flex-col font-sans overflow-hidden">
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar 
          selectedLixeira={selectedLixeira} 
          setSelectedLixeira={(lixeira) => {
            setSelectedLixeira(lixeira);
            setIsSidebarOpen(false);
          }} 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 relative w-full">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center text-[#00E676] font-mono text-sm tracking-widest">
              INICIALIZANDO DADOS GEOESPACIAIS...
            </div>
          ) : (
            <MapView 
              lixeiras={lixeiras}
              selectedLixeira={selectedLixeira} 
              setSelectedLixeira={setSelectedLixeira} 
            />
          )}
        </main>
      </div>
    </div>
  );
}
