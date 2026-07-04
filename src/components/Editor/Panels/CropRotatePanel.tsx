"use client";

import React from "react";
import { RotateCw, RotateCcw, Maximize, Crop } from "lucide-react";

interface Props {
  rotation: number;
  setRotation: (v: number) => void;
}

const CropRotatePanel: React.FC<Props> = ({ rotation, setRotation }) => (
  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6">
    <h3 className="text-white text-xs font-black uppercase tracking-widest mb-6">Geometry & Framing</h3>
    
    <div className="grid grid-cols-2 gap-4">
      <button
        onClick={() => setRotation(rotation - 90)}
        className="flex flex-col items-center gap-3 p-6 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all group"
      >
        <RotateCcw className="w-6 h-6 text-gray-400 group-hover:text-pink-400 transition-colors" />
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Left 90°</span>
      </button>
      
      <button
        onClick={() => setRotation(rotation + 90)}
        className="flex flex-col items-center gap-3 p-6 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all group"
      >
        <RotateCw className="w-6 h-6 text-gray-400 group-hover:text-pink-400 transition-colors" />
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Right 90°</span>
      </button>

      <button
        onClick={() => setRotation(0)}
        className="col-span-2 flex items-center justify-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all group"
      >
        <Maximize className="w-4 h-4 text-gray-500 group-hover:text-white" />
        <span className="text-[10px] font-black text-gray-500 group-hover:text-white uppercase tracking-widest">Reset Orientation</span>
      </button>
    </div>
  </div>
);

export default CropRotatePanel;
