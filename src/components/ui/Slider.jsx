import React from 'react';

export default function Slider({ value, onChange, disabled = false }) {
  return (
    <div className="w-full relative flex items-center h-4">
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => {
          if (!disabled && onChange) onChange(parseInt(e.target.value, 10));
        }}
        disabled={disabled}
        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface-bg disabled:opacity-50 disabled:cursor-not-allowed [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-md"
      />
      <div 
        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-l-lg pointer-events-none" 
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
