"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

interface Props {
  imageUrl: string;
  brightness: number;
  contrast: number;
  saturation: number;
  rotation: number;
  filter: string;
  textOverlay: string;
  stickers: string[];
  showOriginal: boolean;
}

const PreviewPanel: React.FC<Props> = ({
  imageUrl,
  brightness,
  contrast,
  saturation,
  rotation,
  filter,
  textOverlay,
  stickers,
  showOriginal,
}) => {
  // Map filter names to CSS filter values
  const filterStyles: Record<string, string> = {
    "Original": "none",
    "Vintage": "sepia(50%) contrast(110%)",
    "Cinematic": "contrast(130%) brightness(90%) saturate(120%)",
    "Warm": "sepia(30%) saturate(140%)",
    "Cool": "hue-rotate(-15deg) saturate(120%)",
    "Dramatic": "contrast(160%) brightness(80%)",
    "Soft": "blur(0.5px) brightness(110%)",
    "Neon": "saturate(200%) hue-rotate(45deg)",
    "Sepia": "sepia(100%)",
    "Fade": "brightness(110%) contrast(80%)"
  };

  const selectedFilterStyle = filterStyles[filter] || "none";

  const style = {
    filter: showOriginal 
      ? "none" 
      : `${selectedFilterStyle} brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
    transform: `rotate(${rotation}deg)`,
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-ping" />
          <h3 className="text-white text-[10px] font-black uppercase tracking-widest">Live Viewport</h3>
        </div>
        <div className="bg-white/10 px-3 py-1 rounded-full text-[9px] font-black text-gray-400 uppercase tracking-tighter">
          {showOriginal ? "Original Source" : `Edited: ${filter}`}
        </div>
      </div>

      <div className="flex-1 bg-black rounded-[2.5rem] relative overflow-hidden group shadow-2xl border border-white/5 flex items-center justify-center p-8 min-h-[400px]">
        {/* Background Blur Effect */}
        <div 
          className="absolute inset-0 opacity-20 blur-3xl scale-110 pointer-events-none"
          style={{ 
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: style.filter
          }}
        />

        <div className="relative w-full h-full flex items-center justify-center">
          <motion.img 
            initial={false}
            animate={{ scale: 1 }}
            src={imageUrl} 
            alt="Preview" 
            className="max-h-full max-w-full object-contain rounded-xl shadow-2xl z-10"
            style={style}
          />

          <AnimatePresence>
            {!showOriginal && textOverlay && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute z-20 inset-x-0 bottom-12 flex justify-center px-8"
              >
                <div className="bg-black/40 backdrop-blur-md border border-white/10 px-8 py-4 rounded-2xl text-white text-center font-serif italic text-xl shadow-2xl max-w-lg">
                  {textOverlay}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!showOriginal && (
            <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
              {stickers.map((s, i) => (
                <motion.span 
                  key={i} 
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: (i * 15) % 30 - 15 }}
                  className="absolute text-4xl"
                  style={{ 
                    left: `${(i * 15 + 20) % 70 + 10}%`,
                    top: `${(i * 25 + 10) % 60 + 10}%`,
                  }}
                >
                  {s}
                </motion.span>
              ))}
            </div>
          )}
        </div>

        {/* Floating Indicator */}
        <div className="absolute top-6 left-6 z-40 bg-white/10 backdrop-blur-xl p-3 rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
           {showOriginal ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-pink-500" />}
           <span className="text-[10px] font-black text-white uppercase tracking-widest">{showOriginal ? "Viewing Raw" : "Viewing Render"}</span>
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;
