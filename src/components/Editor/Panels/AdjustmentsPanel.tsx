"use client";

import React from "react";
import { Sun, Contrast, Droplets, RotateCcw } from "lucide-react";

interface Props {
  brightness: number;
  setBrightness: (v: number) => void;
  contrast: number;
  setContrast: (v: number) => void;
  saturation: number;
  setSaturation: (v: number) => void;
}

const AdjustmentsPanel: React.FC<Props> = ({
  brightness,
  setBrightness,
  contrast,
  setContrast,
  saturation,
  setSaturation,
}) => {
  const controls = [
    { label: "Brightness", icon: <Sun className="w-4 h-4" />, value: brightness, setter: setBrightness, color: "text-yellow-400" },
    { label: "Contrast", icon: <Contrast className="w-4 h-4" />, value: contrast, setter: setContrast, color: "text-blue-400" },
    { label: "Saturation", icon: <Droplets className="w-4 h-4" />, value: saturation, setter: setSaturation, color: "text-rose-400" },
  ];

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
          Fine Tuning
        </h3>
        <button 
          onClick={() => { setBrightness(100); setContrast(100); setSaturation(100); }}
          className="text-gray-500 hover:text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-8">
        {controls.map((control) => (
          <div key={control.label} className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-3">
                <span className={control.color}>{control.icon}</span>
                <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{control.label}</span>
              </div>
              <span className="text-white font-mono text-xs font-bold">{control.value}%</span>
            </div>
            <div className="relative group">
              <input
                type="range"
                min="0"
                max="200"
                value={control.value}
                onChange={(e) => control.setter(Number(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-pink-500 transition-all hover:bg-white/20"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdjustmentsPanel;
