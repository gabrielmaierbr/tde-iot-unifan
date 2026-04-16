import React from 'react';
import DeviceCard from './DeviceCard';
import Switch from '../ui/Switch';
import { useDevice } from '../../hooks/useDevice';

export default function ToggleDevice({ deviceId, device }) {
  const { updateDeviceState } = useDevice();

  const handleToggle = (newState) => {
    updateDeviceState(deviceId, { power: newState });
  };

  return (
    <DeviceCard device={device}>
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${device.state?.power ? 'text-primary' : 'text-gray-500'}`}>
          {device.state?.power ? 'Ligado' : 'Desligado'}
        </span>
        <Switch 
          isOn={!!device.state?.power} 
          onToggle={handleToggle} 
          disabled={false}
        />
      </div>
    </DeviceCard>
  );
}
