import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import RoomView from '../components/room/RoomView';

export default function Dashboard() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-base-bg flex flex-col font-sans overflow-hidden">
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar 
          selectedRoom={selectedRoom} 
          setSelectedRoom={(room) => {
            setSelectedRoom(room);
            setIsSidebarOpen(false);
          }} 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 relative w-full">
          <RoomView selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom} />
        </main>
      </div>
    </div>
  );
}
