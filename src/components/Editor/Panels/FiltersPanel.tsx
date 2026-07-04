"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

const filters = [
  { name: "Original", style: "none" },
  { name: "Vintage", style: "sepia(50%) contrast(110%)" },
  { name: "Cinematic", style: "contrast(130%) brightness(90%) saturate(120%)" },
  { name: "Warm", style: "sepia(30%) saturate(140%)" },
  { name: "Cool", style: "hue-rotate(-15deg) saturate(120%)" },
  { name: "Dramatic", style: "contrast(160%) brightness(80%)" },
  { name: "Soft", style: "blur(0.5px) brightness(110%)" },
  { name: "Neon", style: "saturate(200%) hue-rotate(45deg)" },
  { name: "Sepia", style: "sepia(100%)" },
  { name: "Fade", style: "brightness(110%) contrast(80%)" }
];

interface Props {
  filter: string;
  setFilter: (f: string) => void;
  previewImage?: string;
}

const FiltersPanel: React.FC<Props> = ({ filter, setFilter, previewImage }) => (
  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-pink-500" /> Color Grading
      </h3>
    </div>
    
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
      {filters.map((f, i) => (
        <motion.button
          key={f.name}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setFilter(f.name)}
          className={`relative group rounded-2xl overflow-hidden border-2 transition-all ${
            filter === f.name ? "border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.3)]" : "border-transparent"
          }`}
        >
          <div className="aspect-square bg-gray-800 relative">
            {previewImage ? (
              <img 
                src={previewImage} 
                alt={f.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                style={{ filter: f.style }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900" />
            )}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
          </div>
          <div className={`absolute inset-0 flex items-center justify-center opacity-0 transition-opacity ${filter === f.name ? 'opacity-100' : ''}`}>
             <div className="bg-pink-500 text-white p-1 rounded-full"><Check className="w-4 h-4 stroke-[4]" /></div>
          </div>
          <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-md py-1.5 text-[8px] font-black text-white uppercase tracking-tighter text-center">
            {f.name}
          </div>
        </motion.button>
      ))}
    </div>
  </div>
);

export default FiltersPanel;
