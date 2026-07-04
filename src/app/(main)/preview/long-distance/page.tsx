"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Stars, MapPin, Rocket } from "lucide-react";
import Link from "next/link";

export default function LongDistanceTheme() {
  const [stage, setStage] = useState(0);
  const [noHoverCount, setNoHoverCount] = useState(0);

  const handleNoHover = () => {
    setNoHoverCount((prev) => prev + 1);
  };

  useEffect(() => {
    // Intro sequence
    const t1 = setTimeout(() => setStage(1), 3000);
    const t2 = setTimeout(() => setStage(2), 6000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

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
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-blue-100 overflow-hidden relative font-sans">
      
      {/* Starry Background */}
      <div className="absolute inset-0 z-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: Math.random() * 0.5 + 0.1 }}
            animate={{ opacity: [0.1, 1, 0.1] }}
            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity }}
            className="absolute bg-white rounded-full"
            style={{ 
              width: Math.random() * 3 + 1, 
              height: Math.random() * 3 + 1,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`
            }}
          />
        ))}
        {/* Shooting Stars */}
        <motion.div
          animate={{ x: [1000, -1000], y: [-500, 500] }}
          transition={{ duration: 5, repeat: Infinity, delay: 2, ease: "linear" }}
          className="absolute top-0 right-0 w-32 h-[1px] bg-gradient-to-r from-transparent to-cyan-300"
          style={{ transform: "rotate(-45deg)" }}
        />
      </div>

      <AnimatePresence mode="wait">
        {stage === 0 && (
          <motion.div 
            key="stage0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 1 }}
            className="relative z-10 flex flex-col items-center"
          >
            <MapPin className="w-16 h-16 text-cyan-500 mb-6 animate-bounce" />
            <h1 className="text-4xl md:text-6xl font-light tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-200">
              Miles Apart.
            </h1>
          </motion.div>
        )}

        {stage === 1 && (
          <motion.div 
            key="stage1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 1 }}
            className="relative z-10 flex flex-col items-center"
          >
            <Stars className="w-16 h-16 text-blue-400 mb-6 animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-light tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-300">
              But close at heart.
            </h1>
          </motion.div>
        )}

        {stage === 2 && (
          <motion.div 
            key="stage2"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
            className="relative z-10 w-full max-w-2xl bg-slate-900/60 backdrop-blur-xl p-8 md:p-12 rounded-[3rem] border border-blue-500/20 shadow-[0_0_50px_rgba(56,189,248,0.1)]"
          >
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center border border-blue-500/30 shadow-[0_0_30px_rgba(56,189,248,0.3)]">
              <Rocket className="w-8 h-8 text-cyan-400" />
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 mt-6">
              Will you bridge the distance with me?
            </h2>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed font-light">
              We might not share the same timezone right now, but I want to share the rest of my life with you. Will you be mine?
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 h-auto sm:h-20">
              <button 
                onClick={() => setStage(3)}
                className="w-full sm:w-auto bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 px-12 rounded-full text-lg shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-105"
              >
                Yes, a million times!
              </button>

              <div onMouseEnter={handleNoHover} style={getNoButtonStyles()} className="w-full sm:w-auto transition-all duration-200">
                <button className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-4 px-12 rounded-full text-lg shadow-sm border border-slate-700">
                  Not right now
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {stage === 3 && (
          <motion.div 
            key="stage3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative z-10 flex flex-col items-center"
          >
            <motion.div animate={{ rotate: 360, scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
              <Heart className="w-32 h-32 text-cyan-400 fill-cyan-400 drop-shadow-[0_0_40px_rgba(34,211,238,0.8)]" />
            </motion.div>
            <h1 className="text-5xl font-bold mt-10 text-white">Distance means nothing now!</h1>
            <p className="text-xl text-cyan-200 mt-4">I love you beyond the stars. ✨</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor Return */}
      <Link href="/create" className="absolute top-6 left-6 text-slate-500 hover:text-white transition-colors text-sm font-medium z-50">
        ← Back to Editor
      </Link>
    </div>
  );
}
