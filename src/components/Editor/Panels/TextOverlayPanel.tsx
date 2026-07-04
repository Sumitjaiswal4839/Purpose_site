"use client";

import React from "react";
import { Type, MessageCircleHeart } from "lucide-react";

interface Props {
  textOverlay: string;
  setTextOverlay: (t: string) => void;
}

const TextOverlayPanel: React.FC<Props> = ({ textOverlay, setTextOverlay }) => (
  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
        <Type className="w-4 h-4 text-indigo-400" /> Caption Overlay
      </h3>
    </div>
    
    <div className="relative">
      <MessageCircleHeart className="absolute left-4 top-4 w-5 h-5 text-gray-600" />
      <textarea
        placeholder="Type a special message for this slide..."
        value={textOverlay}
        onChange={(e) => setTextOverlay(e.target.value)}
        className="w-full bg-black/20 border-2 border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 transition-all min-h-[120px] resize-none font-medium"
      />
    </div>
    <p className="mt-4 text-[9px] text-gray-500 font-bold uppercase tracking-widest text-center italic">"This text will float over your image beautifully"</p>
  </div>
);

export default TextOverlayPanel;
