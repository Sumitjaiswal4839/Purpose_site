"use client";

import React from "react";
import { Smile, Trash2, Plus } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  stickers: string[];
  setStickers: (s: string[]) => void;
}

const availableStickers = ["⭐", "❤️", "🔥", "🎉", "🌸", "💍", "🏹", "💘", "✨", "🎈"];

const StickersPanel: React.FC<Props> = ({ stickers, setStickers }) => (
  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
        <Smile className="w-4 h-4 text-yellow-400" /> Memory Stickers
      </h3>
    </div>
    
    <div className="grid grid-cols-5 gap-3 mb-8">
      {availableStickers.map(sticker => (
        <motion.button 
          key={sticker} 
          whileHover={{ scale: 1.2, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setStickers([...stickers, sticker])}
          className="text-2xl p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-transparent hover:border-white/20"
        >
          {sticker}
        </motion.button>
      ))}
    </div>

    {stickers.length > 0 && (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Active ({stickers.length})</span>
          <button onClick={() => setStickers([])} className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline">Clear All</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {stickers.map((s, i) => (
            <motion.div 
              key={i} 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-white/10 px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10 group"
            >
              <span className="text-sm">{s}</span>
              <button 
                onClick={() => setStickers(stickers.filter((_, idx) => idx !== i))}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3 h-3 text-red-400" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default StickersPanel;
