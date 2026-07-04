"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ghost, HeartHandshake, Skull, HeartPulse } from "lucide-react";
import Link from "next/link";

export default function FriendZoneTheme() {
  const [stage, setStage] = useState(0);
  const [noHoverCount, setNoHoverCount] = useState(0);

  const handleNext = () => setStage(prev => prev + 1);

  const getNoButtonStyles = () => {
    if (noHoverCount === 0) return {};
    const x = Math.random() * 200 - 100;
    const y = Math.random() * 200 - 100;
    return {
      transform: `translate(${x}px, ${y}px)`,
      position: "relative" as "relative",
    };
  };

  return (
    <div className="min-h-screen bg-violet-950 flex flex-col items-center justify-center p-6 text-center text-violet-100 overflow-hidden relative font-sans">
      
      {/* Background blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
         <motion.div 
           animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} 
           transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
           className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/30 blur-[150px] rounded-full"
         />
         <motion.div 
           animate={{ scale: [1, 1.5, 1], x: [0, 100, 0] }} 
           transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
           className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-600/30 blur-[120px] rounded-full"
         />
      </div>

      <AnimatePresence mode="wait">
        {stage === 0 && (
          <motion.div 
            key="stage0"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -100 }}
            className="relative z-10 flex flex-col items-center max-w-xl"
          >
            <Ghost className="w-24 h-24 text-violet-300 mb-8 animate-bounce" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
              I survived the absolute worst place on Earth.
            </h1>
            <button 
              onClick={handleNext}
              className="mt-8 px-8 py-4 bg-violet-800 hover:bg-violet-700 text-white font-bold rounded-xl transition-colors shadow-lg active:scale-95"
            >
              Where?
            </button>
          </motion.div>
        )}

        {stage === 1 && (
          <motion.div 
            key="stage1"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative z-10 flex flex-col items-center max-w-xl"
          >
            <Skull className="w-24 h-24 text-stone-400 mb-8" />
            <h1 className="text-5xl md:text-7xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-br from-stone-200 to-stone-500 uppercase tracking-tighter">
              THE FRIEND ZONE
            </h1>
            <p className="text-xl text-violet-300 mb-10">It was dark. We called each other "bro". It was terrifying.</p>
            <button 
              onClick={handleNext}
              className="px-8 py-4 bg-stone-700 hover:bg-stone-600 text-white font-bold rounded-xl transition-colors shadow-lg active:scale-95"
            >
              Okay, but...
            </button>
          </motion.div>
        )}

        {stage === 2 && (
          <motion.div 
            key="stage2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className="relative z-10 flex flex-col items-center max-w-xl"
          >
            <HeartHandshake className="w-20 h-20 text-fuchsia-400 mb-8" />
            <h1 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              But honestly? I don't want to just be friends anymore.
            </h1>
            <p className="text-xl text-fuchsia-200 mb-10 leading-relaxed">
              Every time you laugh, every time we hang out, I keep thinking about how lucky I'd be if you were mine. 
            </p>
            <button 
              onClick={handleNext}
              className="px-10 py-4 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-bold rounded-full transition-all shadow-[0_0_20px_rgba(192,38,211,0.5)] hover:scale-105 active:scale-95"
            >
              So I'm asking...
            </button>
          </motion.div>
        )}

        {stage === 3 && (
          <motion.div 
            key="stage3"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 flex flex-col items-center w-full max-w-2xl bg-white/10 backdrop-blur-2xl p-10 md:p-14 rounded-[3rem] border border-white/20 shadow-2xl"
          >
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
               <HeartPulse className="w-24 h-24 text-fuchsia-500 mb-6" />
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8">
              Will you be my Girlfriend?
            </h2>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 w-full">
              <button 
                onClick={() => setStage(4)}
                className="w-full sm:w-auto bg-fuchsia-500 hover:bg-fuchsia-400 text-white font-bold py-4 px-12 rounded-full text-xl shadow-[0_0_30px_rgba(217,70,239,0.5)] transition-all hover:scale-110"
              >
                YES! Finally!
              </button>

              <div onMouseEnter={() => setNoHoverCount(c => c + 1)} style={getNoButtonStyles()} className="w-full sm:w-auto transition-all duration-200">
                <button className="w-full sm:w-auto bg-violet-900/50 hover:bg-violet-800 text-violet-300 font-bold py-4 px-12 rounded-full text-lg border border-violet-700 backdrop-blur-sm">
                  Let's stay friends
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {stage === 4 && (
          <motion.div 
            key="stage4"
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.6 }}
            className="relative z-10 flex flex-col items-center"
          >
            <h1 className="text-6xl md:text-8xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-pink-500">
              PROMOTION UNLOCKED!
            </h1>
            <p className="text-2xl text-violet-200 mt-4">Goodbye Friend Zone, Hello Boyfriend material! 🎉</p>
          </motion.div>
        )}
      </AnimatePresence>

      <Link href="/create" className="absolute top-6 left-6 text-violet-400 hover:text-white transition-colors text-sm font-medium z-50">
        ← Back to Editor
      </Link>
    </div>
  );
}
