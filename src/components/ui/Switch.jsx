import React from 'react';
import { motion } from 'framer-motion';

export default function Switch({ isOn, onToggle, disabled = false }) {
  return (
    <button
      type="button"
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface-bg disabled:opacity-50 disabled:cursor-not-allowed ${
        isOn ? 'bg-primary' : 'bg-white/10'
      }`}
      role="switch"
      aria-checked={isOn}
      onClick={() => {
        if (!disabled && onToggle) onToggle(!isOn);
      }}
      disabled={disabled}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 ${
          isOn ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
