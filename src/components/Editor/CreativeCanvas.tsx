"use client";

import React, { useEffect, useRef, useState } from "react";
import { AssetLibrary } from "./AssetLibrary";
import { Download, Type, Image as ImageIcon, Camera } from "lucide-react";

// @ts-ignore - we ignore fabric typescript check if it isn't fully installed yet
import * as fabric from "fabric";

export default function CreativeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasInstance, setCanvasInstance] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && canvasRef.current && !canvasInstance) {
      try {
        const initCanvas = new (fabric as any).Canvas(canvasRef.current, {
           width: 600,
           height: 400,
           backgroundColor: "#fff",
        });
        setCanvasInstance(initCanvas);
      } catch(e) {
        console.error("Fabric not installed correctly yet", e);
      }
    }
    return () => {
       if (canvasInstance) {
           canvasInstance.dispose();
       }
    }
  }, []);

  const addText = (fontFamily: string) => {
    if (!canvasInstance) return;
    const text = new (fabric as any).IText("Edit Me", {
      left: 100,
      top: 100,
      fontFamily,
      fill: fontFamily === "cursive" ? "#ff007f" : "#333",
      fontSize: 40,
    });
    // For neon glow
    if (fontFamily === "neon") {
        text.set({
           fill: '#fff',
           shadow: new (fabric as any).Shadow({
               color: '#00ffff',
               blur: 20,
               offsetX: 0,
               offsetY: 0
           })
        });
    }
    canvasInstance.add(text);
    canvasInstance.setActiveObject(text);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && canvasInstance) {
      const reader = new FileReader();
      reader.onload = (f) => {
        const data = f.target?.result as string;
        (fabric as any).Image.fromURL(data, (img: any) => {
          img.scaleToWidth(200);
          canvasInstance.add(img);
          canvasInstance.centerObject(img);
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const addSticker = (asset: string) => {
      if (!canvasInstance) return;
      const text = new (fabric as any).IText(asset.length < 5 ? asset : "💖", {
         left: 150, top: 150, fontSize: 60, selectable: true
      });
      canvasInstance.add(text);
  };

  const applyFilter = (type: string) => {
      if (!canvasInstance) return;
      const obj = canvasInstance.getActiveObject();
      if (!obj || obj.type !== 'image') {
          alert('Please select an image to apply filters.');
          return;
      }
      
      let filter;
      if (type === 'bw') filter = new (fabric as any).Image.filters.Grayscale();
      if (type === 'sepia') filter = new (fabric as any).Image.filters.Sepia();
      if (type === 'glow') filter = new (fabric as any).Image.filters.Brightness({ brightness: 0.2 });
      if (type === 'vivid') filter = new (fabric as any).Image.filters.Contrast({ contrast: 0.3 });
      
      if (filter) {
          obj.filters = [filter];
          obj.applyFilters();
          canvasInstance.renderAll();
      }
  };

  return (
    <div className="flex h-[600px] w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
      
      {/* Sidebar Tool panel */}
      <div className="w-[80px] bg-white border-r border-slate-200 flex flex-col items-center py-6 gap-6">
        <label className="cursor-pointer flex flex-col items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 transition">
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border">
            <ImageIcon className="w-5 h-5" />
          </div>
          Upload
          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
        </label>

        <button onClick={() => addText('Arial')} className="flex flex-col items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 transition">
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border">
            <Type className="w-5 h-5" />
          </div>
          Text
        </button>

        <button onClick={() => addText('cursive')} className="flex flex-col items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 transition">
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border font-serif italic text-lg">
            C
          </div>
          Cursive
        </button>

        <button onClick={() => addText('neon')} className="flex flex-col items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 transition">
          <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center shadow-[0_0_15px_#0ff] border border-cyan-400 text-cyan-400 font-black">
            N
          </div>
          Neon
        </button>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col relative bg-slate-200 p-8 items-center justify-center">
         
         {/* Filter Bar (If Image Active) */}
         <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md flex gap-4 text-sm font-medium z-10">
            <button onClick={() => applyFilter('none')} className="hover:text-indigo-500">Normal</button>
            <button onClick={() => applyFilter('bw')} className="hover:text-amber-700">B&W</button>
            <button onClick={() => applyFilter('sepia')} className="hover:text-amber-700">Retro</button>
            <button onClick={() => applyFilter('glow')} className="hover:text-amber-700">Glow</button>
            <button onClick={() => applyFilter('vivid')} className="hover:text-amber-700">Vivid</button>
         </div>

         <div className="shadow-2xl bg-white rounded-md overflow-hidden">
             <canvas ref={canvasRef} />
             {!canvasInstance && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-200 bg-opacity-75 z-50">
                   <p className="text-slate-500 font-mono">Loading Canvas Engine...</p>
                </div>
             )}
         </div>
      </div>

      {/* Asset Library Panel */}
      <AssetLibrary onAddAsset={addSticker} />
    </div>
  );
}
