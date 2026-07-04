"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCcw } from "lucide-react";
import Image from "next/image";

export default function ScratchCardReveal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScratched, setIsScratched] = useState(false);
  const [percentScratched, setPercentScratched] = useState(0);
  const [started, setStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Scratch Drawing variables
  let isDrawing = false;

  useEffect(() => {
    audioRef.current = new Audio("https://cdn.pixabay.com/audio/2022/03/15/audio_79ce32edbd.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;
  }, []);

  useEffect(() => {
    if (!started) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Make canvas scalable to container
    const width = containerRef.current?.offsetWidth || 300;
    const height = containerRef.current?.offsetHeight || 400;
    canvas.width = width;
    canvas.height = height;

    // Fill with metallic/gradient scratch coating
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#a1a1aa");
    gradient.addColorStop(0.5, "#d4d4d8");
    gradient.addColorStop(1, "#71717a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add overlay text
    ctx.font = "bold 24px Inter, sans-serif";
    ctx.fillStyle = "#27272a";
    ctx.textAlign = "center";
    ctx.fillText("RUB TO REVEAL", width / 2, height / 2);

    // Set brush for scratching
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 40;
    ctx.globalCompositeOperation = "destination-out"; // This makes it erase!

    const getMousePos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = ('clientX' in e) ? e.clientX : e.touches[0].clientX;
      const y = ('clientY' in e) ? e.clientY : e.touches[0].clientY;
      return { x: x - rect.left, y: y - rect.top };
    };

    const handleStart = (e: MouseEvent | TouchEvent) => {
      isDrawing = true;
      const { x, y } = getMousePos(e);
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      e.preventDefault(); // Prevent scrolling while scratching
      const { x, y } = getMousePos(e);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Check percentage cleared infrequently
      if (Math.random() > 0.9) {
          checkScratchPercent();
      }
    };

    const handleEnd = () => { isDrawing = false; };

    const checkScratchPercent = () => {
       const pixels = ctx.getImageData(0, 0, width, height).data;
       let transparentPixels = 0;
       for (let i = 3; i < pixels.length; i += 4) {
           if (pixels[i] === 0) transparentPixels++;
       }
       const clearPercentage = (transparentPixels / (pixels.length / 4)) * 100;
       setPercentScratched(clearPercentage);

       if (clearPercentage > 50 && !isScratched) {
           setIsScratched(true);
           // Fade out the rest of the canvas automatically
           canvas.style.transition = "opacity 1s ease";
           canvas.style.opacity = "0";
       }
    };

    // Attach events
    canvas.addEventListener("mousedown", handleStart);
    canvas.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    canvas.addEventListener("touchstart", handleStart, { passive: false });
    canvas.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleEnd);

    return () => {
      canvas.removeEventListener("mousedown", handleStart);
      canvas.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      canvas.removeEventListener("touchstart", handleStart);
      canvas.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    }
  }, [started, isScratched]);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        
       {/* Audio Tap to Start logic */}
       <AnimatePresence>
        {!started && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center p-4 border-2 border-white/10"
          >
            <div className="text-center bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] max-w-sm w-full border border-white/10">
               <motion.div
                 animate={{ scale: [1, 1.1, 1] }}
                 transition={{ repeat: Infinity, duration: 2 }}
                 className="w-16 h-16 bg-gradient-to-tr from-pink-500 to-amber-400 rounded-full mx-auto flex items-center justify-center shadow-[0_0_30px_#f472b6] mb-6"
               >
                 <Sparkles className="w-8 h-8 text-white" />
               </motion.div>
               
               <h1 className="text-2xl font-bold text-white mb-2 font-serif">Secret Scratch Card</h1>
               <p className="text-white/60 text-sm mb-8">Tap to grab a coin and reveal your surprise!</p>
               
               <button 
                 onClick={() => {
                   setStarted(true);
                   audioRef.current?.play().catch(()=>console.log("Audio block"));
                 }}
                 className="w-full bg-white text-slate-900 font-bold py-4 rounded-xl hover:scale-105 active:scale-95 transition-all"
               >
                 Give me the coin!
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-md text-center mb-8 relative z-10">
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500 font-serif">
           Lucky You!
        </h1>
        <p className="text-white/50 text-sm mt-2">Rub the ticket to claim your prize.</p>
      </div>

      {/* Card Container */}
      <div 
         ref={containerRef}
         className="w-full max-w-[320px] aspect-[3/4] relative bg-white p-4 rounded-[2rem] shadow-2xl shadow-yellow-500/20"
      >
          {/* Base Layer - The Hidden Secret */}
          <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative flex flex-col items-center justify-center bg-pink-50 p-6">
             <Image 
               src="https://images.unsplash.com/photo-1518199266791-5375a83190b7" 
               alt="Secret Memory"
               fill
               className="object-cover opacity-80"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-pink-900/90 via-pink-900/40 to-transparent" />
             
             <div className={`relative z-10 text-center transition-all duration-1000 transform ${isScratched ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
                <h2 className="text-3xl font-black text-white mb-2 font-serif tracking-wide drop-shadow-md">I love you!</h2>
                <p className="text-pink-100 italic text-sm font-medium drop-shadow-sm leading-relaxed">
                   Will you be my lucky charm forever?
                </p>
             </div>
          </div>

          {/* Top Layer - The Scratchable Canvas */}
          <canvas 
            ref={canvasRef} 
            className="absolute top-4 left-4 right-4 bottom-4 w-[calc(100%-32px)] h-[calc(100%-32px)] rounded-[1.5rem] cursor-pointer touch-none z-20 shadow-inner"
            style={{ pointerEvents: isScratched ? 'none' : 'auto' }}
          />

          {/* Coin Follower (Optional aesthetic) */}
          {started && !isScratched && (
             <motion.div 
               animate={{ rotate: [-10, 10, -10] }}
               transition={{ repeat: Infinity, duration: 1 }}
               className="absolute -right-6 -bottom-6 w-16 h-16 bg-gradient-to-br from-yellow-300 to-amber-600 rounded-full border-4 border-yellow-200 shadow-[0_0_15px_#f59e0b] flex items-center justify-center z-30 pointer-events-none"
             >
                <span className="text-white font-black opacity-80 text-lg">$</span>
             </motion.div>
          )}
      </div>

      <AnimatePresence>
        {isScratched && (
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="mt-8 relative z-10"
             >
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-full inline-flex items-center gap-2 border border-white/20"
                >
                   <RefreshCcw className="w-4 h-4" /> Scratch Again
                </button>
             </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
