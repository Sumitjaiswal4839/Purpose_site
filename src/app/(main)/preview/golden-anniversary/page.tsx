"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Pencil, ArrowRight, Clock, Star, Play } from "lucide-react";
import Link from "next/link";

export default function GoldenAnniversaryTheme() {
  const [stage, setStage] = useState(0);

  // Auto progression for elegant feel
  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 4000);
    const t2 = setTimeout(() => setStage(2), 8000);
    const t3 = setTimeout(() => setStage(3), 12000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center relative overflow-hidden font-serif selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Golden Particle Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/20 via-neutral-950 to-black" />
        
        {/* Floating Gold Dust */}
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: ["100vh", "-10vh"],
              x: [Math.random() * 100 - 50, Math.random() * -100 + 50],
              opacity: [0, Math.random() * 0.8 + 0.2, 0]
            }}
            transition={{ 
              duration: 10 + Math.random() * 20, 
              repeat: Infinity, 
              delay: Math.random() * 10,
              ease: "linear" 
            }}
            className="absolute rounded-full bg-gradient-to-r from-amber-200 to-yellow-500"
            style={{
              left: `${Math.random() * 100}%`,
              width: Math.random() * 4 + 1,
              height: Math.random() * 4 + 1,
              boxShadow: "0 0 10px rgba(251, 191, 36, 0.5)"
            }}
          />
        ))}
      </div>

      {/* Main Content Animation */}
      <AnimatePresence mode="wait">
        {stage === 0 && (
          <motion.div 
            key="stage0"
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 1.5 }}
            className="relative z-10 flex flex-col items-center text-center px-4"
          >
            <Clock className="w-12 h-12 text-amber-500/50 mb-6" />
            <h1 className="text-4xl md:text-6xl font-light tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 uppercase">
              Half a Century.
            </h1>
          </motion.div>
        )}

        {stage === 1 && (
          <motion.div 
            key="stage1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 1.5 }}
            className="relative z-10 flex flex-col items-center text-center px-4"
          >
            <h1 className="text-5xl md:text-7xl font-light text-amber-500 mb-4 italic">
              18,250 Days.
            </h1>
            <p className="text-xl text-neutral-400 font-sans font-light tracking-[0.2em] uppercase">Of choosing each other</p>
          </motion.div>
        )}

        {stage === 2 && (
          <motion.div 
            key="stage2"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1.5 }}
            className="relative z-10 flex flex-col items-center text-center px-4"
          >
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
              <Star className="w-16 h-16 text-amber-400/30 mb-8" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-light text-neutral-200 leading-relaxed max-w-3xl">
              "To love and be loved is to feel the sun from both sides."
            </h1>
          </motion.div>
        )}

        {stage === 3 && (
          <motion.div 
            key="stage3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="relative z-10 flex flex-col items-center w-full max-w-4xl px-4"
          >
             {/* The Golden Hub Panel */}
             <div className="w-full bg-neutral-900/60 backdrop-blur-2xl p-10 md:p-16 rounded-[2rem] border border-amber-500/20 shadow-[0_0_100px_rgba(251,191,36,0.05)] text-center relative overflow-hidden">
               
               {/* Decorative corners */}
               <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-amber-500/30 rounded-tl-[2rem] m-2" />
               <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-amber-500/30 rounded-tr-[2rem] m-2" />
               <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-amber-500/30 rounded-bl-[2rem] m-2" />
               <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-amber-500/30 rounded-br-[2rem] m-2" />

               <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity }}>
                 <Heart className="w-20 h-20 text-amber-500 mb-8 mx-auto fill-amber-500/20" />
               </motion.div>

               <h2 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-yellow-600 mb-4 opacity-90 drop-shadow-lg">
                 50th Anniversary
               </h2>
               <h3 className="text-2xl md:text-3xl text-neutral-300 font-light mb-12 italic">
                 James & Eleanor
               </h3>

               <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                 <button className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-neutral-950 font-bold py-4 px-10 rounded-full text-lg shadow-[0_0_30px_rgba(251,191,36,0.2)] transition-all hover:scale-105 flex items-center justify-center gap-2">
                   <Play className="w-5 h-5 fill-current" /> Watch Our Video
                 </button>
               </div>

               <p className="text-neutral-500 text-sm mt-12 font-sans tracking-widest uppercase">1976 — Forever</p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Edit Button Overlay as requested by user */}
      <Link href="/create?theme=golden" className="fixed bottom-8 right-8 z-50 group">
         <motion.div 
           initial={{ y: 100 }} animate={{ y: 0 }}
           whileHover={{ scale: 1.05 }}
           className="bg-white px-6 py-3 md:py-4 rounded-full shadow-2xl flex items-center gap-3 border border-amber-100 cursor-pointer"
         >
           <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
             <Pencil className="w-4 h-4 text-amber-700" />
           </div>
           <div>
             <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-0.5">Preview Mode</p>
             <p className="text-sm font-semibold text-gray-900 group-hover:text-amber-600 transition-colors flex items-center gap-1">
               Edit this Template <ArrowRight className="w-3 h-3" />
             </p>
           </div>
         </motion.div>
      </Link>

    </div>
  );
}
