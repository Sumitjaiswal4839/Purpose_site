"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import Link from "next/link";

export default function CrushTheme() {
  const [isAccepted, setIsAccepted] = useState(false);
  const [noHoverCount, setNoHoverCount] = useState(0);

  const getNoButtonStyles = () => {
    if (noHoverCount === 0) return {};
    const x = Math.random() * 200 - 100;
    const y = Math.random() * 200 - 100;
    return {
      transform: `translate(${x}px, ${y}px)`,
      position: "relative" as "relative",
    };
  };

  // Butterfly SVG component for animation
  const Butterfly = ({ delay, xOffset }: { delay: number, xOffset: number }) => (
    <motion.div
      initial={{ y: "110vh", x: xOffset, opacity: 0, scale: 0.5 }}
      animate={{ 
        y: "-10vh", 
        x: [xOffset, xOffset + 50, xOffset - 50, xOffset],
        opacity: [0, 1, 1, 0],
        scale: [0.5, 1, 1.2, 0.8]
      }}
      transition={{ duration: 15, delay: delay, repeat: Infinity, ease: "linear" }}
      className="absolute z-0 pointer-events-none"
    >
      <svg width="40" height="40" viewBox="0 0 100 100" className="drop-shadow-lg opacity-60">
        <motion.path 
          animate={{ scaleX: [1, 0.2, 1] }}
          transition={{ duration: 0.3, repeat: Infinity, ease: "easeInOut" }}
          d="M50 50 C 20 0, 0 30, 48 50 C 0 70, 20 100, 50 50 C 80 100, 100 70, 52 50 C 100 30, 80 0, 50 50" 
          fill="url(#butterflyGrad)"
        />
        <defs>
          <linearGradient id="butterflyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#fb7185" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-rose-50 flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/60 via-rose-100/40 to-rose-200/50" />
        
        {/* Animated Butterflies */}
        <Butterfly delay={0} xOffset={200} />
        <Butterfly delay={3} xOffset={-150} />
        <Butterfly delay={7} xOffset={400} />
        <Butterfly delay={11} xOffset={-300} />
        <Butterfly delay={5} xOffset={0} />
        <Butterfly delay={14} xOffset={300} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 w-full max-w-3xl bg-white/40 backdrop-blur-3xl rounded-[3rem] p-10 md:p-16 border border-white/60 shadow-[0_20px_60px_rgba(225,29,72,0.1)]"
      >
        {!isAccepted ? (
          <>
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                <Heart className="w-24 h-24 text-rose-500 fill-rose-500/20" />
                <Sparkles className="absolute -top-4 -right-4 w-10 h-10 text-pink-400 animate-pulse" />
              </div>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-serif text-rose-950 mb-6 italic tracking-tight">
              I have a crush on you.
            </h1>
            
            <p className="text-xl md:text-2xl text-rose-800/80 mb-12 font-light leading-relaxed">
              I can't pretend anymore. Every time I see you, my day instantly gets better. 
              Would you do me the absolute honor of letting me take you out on a date?
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 h-auto sm:h-20">
              <button 
                onClick={() => setIsAccepted(true)}
                className="w-full sm:w-auto bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold py-4 px-12 rounded-full text-xl shadow-[0_10px_25px_rgba(225,29,72,0.4)] transition-all hover:scale-105 active:scale-95"
              >
                Yes, I'd love to!
              </button>

              <div onMouseEnter={() => setNoHoverCount(c => c + 1)} style={getNoButtonStyles()} className="w-full sm:w-auto transition-all duration-200">
                <button className="w-full sm:w-auto bg-white hover:bg-rose-50 text-rose-600 font-bold py-4 px-12 rounded-full text-lg shadow-sm border border-rose-200 transition-colors">
                  I don't think so
                </button>
              </div>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-10"
          >
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>
              <Heart className="w-32 h-32 text-rose-500 fill-rose-500 mx-auto mb-8 drop-shadow-[0_0_20px_rgba(244,63,94,0.5)]" />
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-serif text-rose-900 mb-6 italic">
              Best day ever! 🥰
            </h1>
            <p className="text-xl text-rose-700">Get ready for the best date of your life.</p>
          </motion.div>
        )}
      </motion.div>

      <Link href="/create" className="absolute top-6 left-6 text-rose-400 hover:text-rose-600 transition-colors text-sm font-medium z-50 flex items-center gap-2">
        ← Exit Preview
      </Link>
    </div>
  );
}
