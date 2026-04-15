import React from 'react';
import { Hammer, Wrench } from 'lucide-react';

export function LogoIcon({ className = "w-10 h-10 text-primary" }) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Wrench: filled, inherits text color (white on landing page, primary colored in navbar to stay visible) */}
      <Wrench 
        className="absolute text-current" 
        style={{ width: '100%', height: '100%', fill: 'currentColor' }} 
        strokeWidth={1} 
      />
      {/* Hammer: solid orange, mirrored */}
      <Hammer 
        className="absolute" 
        style={{ width: '100%', height: '100%', transform: 'scaleX(-1)', fill: '#ff6d00', color: '#ff6d00' }} 
        strokeWidth={1} 
      />
    </div>
  );
}
