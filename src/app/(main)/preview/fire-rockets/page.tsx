"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function FireRocketsTheme() {
  const images = [
    { src: "https://images.unsplash.com/photo-1549471013-3364d7220b75?q=80&w=800&auto=format&fit=crop", text: "The day it all started... 🔥" },
    { src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop", text: "Remember this crazy night? ✨" },
    { src: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop", text: "You make every moment magical." },
    { src: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop", text: "Here's to a million more fireworks! 🎆" }
  ];

  const [activeRocket, setActiveRocket] = useState<number | null>(null);
  const [exploded, setExploded] = useState<number | null>(null);
  const [launched, setLaunched] = useState<number[]>([]);
  const [started, setStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const launchRef = useRef<HTMLAudioElement>(null);

  const handleTap = (idx: number) => {
    if (launched.includes(idx)) return;
    
    if (launchRef.current) {
        launchRef.current.currentTime = 0;
        launchRef.current.play().catch(console.log);
    }
    
    setLaunched([...launched, idx]);
    setActiveRocket(idx);
    
    // Simulate rocket fly time before explosion
    setTimeout(() => {
      setExploded(idx);
    }, 1000);
  };

  const closeExplosion = () => {
    setExploded(null);
    setActiveRocket(null);
  };

  if (!started) {
     return (
       <div className="min-h-screen bg-slate-950 flex items-center justify-center cursor-pointer" onClick={() => {
          setStarted(true);
          setTimeout(() => audioRef.current?.play().catch(console.log), 100);
       }}>
          <h2 className="text-2xl font-bold px-8 py-4 rounded-full bg-slate-900 border border-slate-700 text-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)] animate-pulse">Tap to Ignite 🎆</h2>
          <audio ref={audioRef} src="https://cdn.pixabay.com/audio/2021/08/04/audio_3d1ef916ff.mp3" loop />
       </div>
     );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-end overflow-hidden relative font-sans">
      <audio ref={audioRef} src="https://cdn.pixabay.com/audio/2021/08/04/audio_3d1ef916ff.mp3" loop />
      <audio ref={launchRef} src="https://cdn.pixabay.com/audio/2021/08/09/audio_d0c91bdbe7.mp3" />
      {/* Night Sky Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-950 to-black z-0" />
      {[...Array(50)].map((_, i) => (
        <div 
          key={i} 
          className="absolute bg-white rounded-full opacity-30 animate-pulse" 
          style={{ width: Math.random()*3, height: Math.random()*3, top: `${Math.random()*80}%`, left: `${Math.random()*100}%`, animationDuration: `${Math.random()*3 + 1}s` }} 
        />
      ))}

      <h1 className="absolute top-16 text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-orange-500 z-10 text-center px-4">
        Ignite the Memories
        <br/><span className="text-lg text-yellow-200/50 font-normal mt-2 block">Tap the rockets to launch them!</span>
      </h1>

      <div className="relative w-full max-w-4xl h-[300px] flex justify-center items-end px-4 gap-8 md:gap-16 pb-12 z-20">
        {images.map((img, idx) => {
          const isLaunched = launched.includes(idx);
          const isCurrentTarget = activeRocket === idx;

          return (
            <motion.div 
              key={idx}
              className="relative cursor-pointer flex flex-col items-center"
              initial={{ y: 0 }}
              animate={isLaunched ? { y: -800, scale: 0.5, opacity: 0 } : { y: 0, opacity: 1 }}
              transition={isLaunched ? { duration: 1, ease: "easeIn" } : { duration: 0.3 }}
              onClick={() => handleTap(idx)}
            >
              {!isLaunched && (
                <motion.div 
                   animate={{ opacity: [0.5, 1, 0.5] }} 
                   transition={{ duration: 1.5, repeat: Infinity }}
                   className="bg-yellow-500 text-yellow-950 text-xs font-bold px-3 py-1 rounded-full mb-3 shadow-[0_0_15px_rgba(234,179,8,0.5)] border border-yellow-200"
                >
                  Tap Me!
                </motion.div>
              )}
              
              {/* Rocket Body */}
              <div className="w-10 h-28 bg-gradient-to-b from-red-600 to-red-800 rounded-t-full relative shadow-lg">
                <div className="w-full h-6 bg-white/20 mt-4" />
                <div className="w-ull h-6 bg-yellow-400/80 mt-2" />
                
                {/* Fins */}
                <div className="absolute -left-3 bottom-0 w-3 h-8 bg-black skew-y-[45deg]" />
                <div className="absolute -right-3 bottom-0 w-3 h-8 bg-black skew-y-[-45deg]" />
              </div>

              {/* Fire Thruster */}
              {(isLaunched && isCurrentTarget) && (
                <motion.div 
                  className="w-4 h-16 bg-gradient-to-b from-yellow-400 via-orange-500 to-transparent blur-sm rounded-full mt-2" 
                  animate={{ scaleY: [1, 1.5, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 0.1, repeat: Infinity }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Explosion & Image Reveal */}
      <AnimatePresence>
        {exploded !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          >
            <div className="absolute inset-0 pointer-events-none">
               {/* Simple fireworks burst effect */}
               {[...Array(12)].map((_, i) => (
                 <motion.div
                   key={i}
                   initial={{ x: "-50%", y: "-50%", scale: 0 }}
                   animate={{ 
                     x: `calc(-50% + ${Math.cos(i * 30 * (Math.PI/180)) * 300}px)`, 
                     y: `calc(-50% + ${Math.sin(i * 30 * (Math.PI/180)) * 300}px)`,
                     scale: [0, 2, 0],
                     opacity: [0, 1, 0]
                   }}
                   transition={{ duration: 1.5, ease: "easeOut" }}
                   className={`absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-gradient-to-r ${['from-red-500','from-yellow-400','from-blue-500','from-purple-500'][i%4]} to-white shadow-[0_0_20px_white]`}
                 />
               ))}
            </div>

            <motion.div 
              initial={{ scale: 0.5, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: -100 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="bg-white p-4 rounded-[2rem] shadow-[0_0_50px_rgba(236,72,153,0.3)] max-w-lg w-full relative z-10"
            >
              <div className="relative w-full aspect-square rounded-[1.5rem] overflow-hidden mb-6">
                <Image src={images[exploded].src} alt="Memory" fill className="object-cover" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 text-center mb-6 px-4">
                {images[exploded].text}
              </h2>
              
              <button 
                onClick={closeExplosion}
                className="w-full py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold flex flex-col items-center gap-1 active:scale-95 transition-transform"
              >
                <span>Awesome!</span>
                <span className="text-xs text-gray-400 font-normal">Close & launch next</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion */}
      <AnimatePresence>
        {launched.length === 4 && exploded === null && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 text-center"
          >
            <div className="bg-gradient-to-r from-red-600 to-orange-500 p-10 rounded-3xl shadow-[0_0_100px_rgba(239,68,68,0.5)] border border-white/20">
              <Sparkles className="w-16 h-16 text-yellow-300 mx-auto mb-6" />
              <h2 className="text-5xl font-black text-white mb-4">You lit up my life!</h2>
              <p className="text-white/80 text-xl font-medium">Thank you for every moment.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Link href="/templates" className="absolute top-6 left-6 z-50 text-white/50 hover:text-white flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>
    </div>
  );
}
