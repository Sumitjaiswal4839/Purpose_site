"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Gift } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function FloatingBalloonsTheme() {
  const [activeBalloon, setActiveBalloon] = useState<number | null>(null);
  
  const memories = [
    { src: "https://images.unsplash.com/photo-1518199266791-5375a83190b7", text: "Our first date, pure butterflies!" },
    { src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486", text: "You make life a giant party." },
    { src: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2", text: "Growing older but never boring with you." },
    { src: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8", text: "Happy Birthday my love! 🎈" }
  ];

  const [started, setStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const colors = ["bg-rose-400", "bg-sky-400", "bg-amber-400", "bg-indigo-400"];

  if (!started) {
    return (
      <div className="min-h-screen bg-[#FFF0F5] flex items-center justify-center cursor-pointer" onClick={() => {
          setStarted(true);
          setTimeout(() => audioRef.current?.play().catch(console.log), 100);
      }}>
         <h2 className="text-2xl font-bold border px-8 py-4 rounded-full bg-white text-rose-500 shadow-xl animate-pulse">Tap to Open Surprise 🎈</h2>
         <audio ref={audioRef} src="https://cdn.pixabay.com/audio/2022/10/25/audio_24345d8b24.mp3" loop />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF0F5] overflow-hidden flex flex-col pt-32 px-6 relative font-sans">
      <audio ref={audioRef} src="https://cdn.pixabay.com/audio/2022/10/25/audio_24345d8b24.mp3" loop />
      
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay pointer-events-none" />
      
      <div className="text-center z-10 relative mb-auto">
        <h1 className="text-5xl md:text-7xl font-black text-rose-500 mb-4 tracking-tight drop-shadow-sm">Pop the Memories</h1>
        <p className="text-xl text-rose-400/80 font-medium">Catch the balloons before they fly away to reveal a surprise!</p>
      </div>

      <div className="relative w-full h-[60vh] flex justify-center items-end max-w-5xl mx-auto pb-10">
        {memories.map((_, idx) => (
          <motion.div
             key={idx}
             className="absolute cursor-pointer flex flex-col items-center"
             initial={{ y: "120vh", x: (idx-1.5) * 150 }}
             animate={{ 
               y: ["120vh", "-20vh"], 
               x: [(idx-1.5)*150, (idx-1.5)*100, (idx-1.5)*200],
               rotate: [-5, 5, -5] 
             }}
             transition={{ 
               y: { duration: 15 + idx * 2, repeat: Infinity, ease: "linear", delay: idx * 2 },
               x: { duration: 4, repeat: Infinity, repeatType: "mirror" },
               rotate: { duration: 3, repeat: Infinity, repeatType: "mirror" }
             }}
             onClick={() => setActiveBalloon(idx)}
             whileHover={{ scale: 1.1 }}
             style={{ zIndex: 10 + idx }}
          >
             {/* The Balloon */}
             <div className={`w-20 md:w-28 aspect-[3/4] ${colors[idx]} rounded-t-[50%] rounded-b-[40%] relative shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.1),_0_10px_20px_rgba(0,0,0,0.1)]`}>
                <div className="absolute top-2 left-3 w-4 h-8 bg-white/40 rounded-full blur-[2px] transform -rotate-12" />
                {/* Knot */}
                <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-3 ${colors[idx]} rounded-full transform rotate-45`} />
             </div>
             
             {/* The Thread attached to an invisible payload or a tiny letter */}
             <div className="w-0.5 h-32 md:h-48 bg-gray-400/50 relative">
               {/* Tiny Photo Envelope */}
               <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-10 bg-white border border-gray-200 shadow-md transform rotate-12 flex items-center justify-center">
                 <Gift className="w-4 h-4 text-rose-300" />
               </div>
             </div>
          </motion.div>
        ))}
      </div>

      {/* Pop up reveal */}
      <AnimatePresence>
        {activeBalloon !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-rose-50/90 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setActiveBalloon(null)}
          >
            <motion.div 
              initial={{ scale: 0.8, y: 100, rotate: -10 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.8, y: 100, rotate: 10 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="bg-white p-4 pb-8 md:p-6 md:pb-12 rounded-sm shadow-2xl max-w-md w-full transform -rotate-2"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Polaroid Style */}
              <div className="w-full aspect-square relative bg-gray-100 mb-6 border border-gray-200">
                 <Image src={memories[activeBalloon].src} alt="Balloon Memory" fill className="object-cover" />
              </div>
              <p className="text-2xl md:text-3xl font-serif text-gray-800 text-center italic px-4">
                "{memories[activeBalloon].text}"
              </p>
              
              <button 
                onClick={() => setActiveBalloon(null)}
                className="mx-auto block mt-8 bg-rose-500 text-white font-bold px-8 py-3 rounded-full hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/30"
              >
                Let it fly away
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Link href="/templates" className="absolute top-6 left-6 z-50 text-gray-400 hover:text-gray-800 flex items-center gap-2 font-medium">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>
    </div>
  );
}
