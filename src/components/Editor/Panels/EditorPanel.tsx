"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Wand2, Eye, EyeOff, LayoutTemplate, Layers, ChevronRight } from "lucide-react";
import FiltersPanel from "./FiltersPanel";
import AdjustmentsPanel from "./AdjustmentsPanel";
import CropRotatePanel from "./CropRotatePanel";
import TextOverlayPanel from "./TextOverlayPanel";
import StickersPanel from "./StickersPanel";
import PreviewPanel from "./PreviewPanel";

interface Props {
  imageUrl: string;
}

const EditorPanel: React.FC<Props> = ({ imageUrl }) => {
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [textOverlay, setTextOverlay] = useState("");
  const [stickers, setStickers] = useState<string[]>([]);
  const [filter, setFilter] = useState("Original");
  const [showOriginal, setShowOriginal] = useState(false);
  const [activeTab, setActiveTab] = useState<"adjust" | "filter" | "frame" | "extra">("adjust");

  const autoEnhance = () => {
    setBrightness(115);
    setContrast(110);
    setSaturation(130);
    setFilter("Cinematic");
  };

  const tabs = [
    { id: "adjust", name: "Adjust", icon: <Layers className="w-4 h-4" /> },
    { id: "filter", name: "Filters", icon: <LayoutTemplate className="w-4 h-4" /> },
    { id: "frame", name: "Frame", icon: <ChevronRight className="w-4 h-4" /> },
    { id: "extra", name: "Stickers", icon: <Wand2 className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 w-full">
      {/* LEFT: Controls Sidebar */}
      <div className="lg:col-span-4 flex flex-col gap-6 order-2 lg:order-1">
        <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all ${
                activeTab === tab.id ? "bg-white/10 text-white shadow-xl" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab.icon}
              <span className="text-[9px] font-black uppercase tracking-widest">{tab.name}</span>
            </button>
          ))}
        </div>

        <div className="flex-1">
          {activeTab === "adjust" && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <AdjustmentsPanel
                brightness={brightness} setBrightness={setBrightness}
                contrast={contrast} setContrast={setContrast}
                saturation={saturation} setSaturation={setSaturation}
              />
            </motion.div>
          )}
          
          {activeTab === "filter" && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <FiltersPanel filter={filter} setFilter={setFilter} previewImage={imageUrl} />
            </motion.div>
          )}

          {activeTab === "frame" && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <CropRotatePanel rotation={rotation} setRotation={setRotation} />
            </motion.div>
          )}

          {activeTab === "extra" && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <TextOverlayPanel textOverlay={textOverlay} setTextOverlay={setTextOverlay} />
              <StickersPanel stickers={stickers} setStickers={setStickers} />
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={autoEnhance}
            className="flex items-center justify-center gap-3 py-5 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-500/20"
          >
            <Wand2 className="w-4 h-4" /> Auto Enhance
          </button>
          <button 
            onClick={() => setShowOriginal(!showOriginal)}
            className={`flex items-center justify-center gap-3 py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all border-2 ${
              showOriginal ? "bg-white text-black border-white" : "bg-white/5 text-gray-400 border-white/10 hover:border-white/20"
            }`}
          >
            {showOriginal ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showOriginal ? "Compare" : "Compare"}
          </button>
        </div>
      </div>

      {/* RIGHT: Preview Area */}
      <div className="lg:col-span-8 order-1 lg:order-2">
        <PreviewPanel
          imageUrl={imageUrl}
          brightness={brightness}
          contrast={contrast}
          saturation={saturation}
          rotation={rotation}
          filter={filter}
          textOverlay={textOverlay}
          stickers={stickers}
          showOriginal={showOriginal}
        />
      </div>
    </div>
  );
};

export default EditorPanel;
