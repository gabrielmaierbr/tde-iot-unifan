import React from 'react';
import DeviceCard from './DeviceCard';
import Switch from '../ui/Switch';
import Slider from '../ui/Slider';
import { useDevice } from '../../hooks/useDevice';

export default function RangeDevice({ deviceId, device }) {
  const { updateDeviceState } = useDevice();

  const handleToggle = (newState) => {
    updateDeviceState(deviceId, { power: newState });
  };

  const handleSliderChange = (newValue) => {
    // Also turn on if value > 0
    updateDeviceState(deviceId, { 
      value: newValue,
      power: newValue > 0 ? true : device.state?.power
    });
  };

  return (
    <DeviceCard device={device}>
      <div className="flex items-center justify-between mb-4">
        <span className={`text-sm font-medium ${device.state?.power ? 'text-primary' : 'text-gray-500'}`}>
          {device.state?.power ? `${device.state?.value || 0}%` : 'Desligado'}
        </span>
        <Switch 
          isOn={!!device.state?.power} 
          onToggle={handleToggle} 
          disabled={false}
        />
      </div>
      <div className="pt-2 mt-auto">
        <Slider 
          value={device.state?.value || 0} 
          onChange={handleSliderChange}
          disabled={!device.state?.power}
        />
      </div>
    </DeviceCard>
  );
}
