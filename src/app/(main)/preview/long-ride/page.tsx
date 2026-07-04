"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Wind, Map, Car, Music } from "lucide-react";
import Link from "next/link";

export default function LongRideTheme() {
  const [stage, setStage] = useState(0); // 0 = empty road, 1 = car arrives, 2 = asks out, 3 = zoom off
  const [started, setStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!started) return;
    const t = setTimeout(() => {
      setStage(1);
      setTimeout(() => setStage(2), 2000);
    }, 1000);
    return () => clearTimeout(t);
  }, [started]);

  const acceptRide = () => {
    setStage(3);
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center cursor-pointer" onClick={() => {
          setStarted(true);
          setTimeout(() => audioRef.current?.play().catch(console.log), 100);
      }}>
         <h2 className="text-2xl font-bold px-8 py-4 rounded-full bg-slate-800 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.4)] animate-pulse border border-slate-700">
           Tap to step outside 🌃
         </h2>
         <audio ref={audioRef} src="https://cdn.pixabay.com/audio/2022/10/18/audio_31c85d8be9.mp3" loop />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center overflow-hidden relative font-sans perspective-1000">
      <audio ref={audioRef} src="https://cdn.pixabay.com/audio/2022/10/18/audio_31c85d8be9.mp3" loop />
      {/* City/Sunset Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-purple-900 to-orange-800 z-0" />
      <div className="absolute inset-0 z-0 opacity-40 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none" />

      {/* Sun/Moon */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-full blur-[2px] shadow-[0_0_80px_rgba(245,158,11,0.6)]" />

      {/* Road */}
      <div className="absolute bottom-0 w-full h-1/3 bg-slate-950 z-10 border-t-4 border-slate-700 relative overflow-hidden flex items-center">
         {/* Road dash lines moving */}
         <motion.div 
           animate={stage === 3 ? { x: ["0%", "-100%"] } : { x: 0 }}
           transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
           className="absolute w-[200%] h-2 flex gap-20 left-0"
         >
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-32 h-full bg-yellow-500/50" />
            ))}
         </motion.div>
      </div>

      <div className="w-full h-full absolute inset-0 z-20 flex flex-col justify-end pb-[20vh] items-center pointer-events-none">
        
        <AnimatePresence>
          {stage >= 1 && stage < 3 && (
            <motion.div 
              initial={{ x: "-120vw" }}
              animate={{ x: 0 }}
              exit={{ x: "120vw" }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="relative pointer-events-auto"
            >
              {/* Car Graphic using Emoji for fun, or custom UI */}
              <div className="relative text-[150px] md:text-[200px] leading-none drop-shadow-2xl">
                 🚘
                 {/* Guy in the car */}
                 <motion.div 
                   animate={{ rotate: [-5, 5, -5] }}
                   transition={{ duration: 3, repeat: Infinity }}
                   className="absolute top-10 left-16 text-[80px] md:text-[100px] z-[-1]"
                 >
                   👦🏻
                 </motion.div>
                 
                 {/* Music notes from car */}
                 <motion.div 
                   animate={{ y: [-10, -40], opacity: [0, 1, 0], x: [0, 20] }}
                   transition={{ duration: 2, repeat: Infinity }}
                   className="absolute -top-10 right-0 text-3xl"
                 >
                   🎵
                 </motion.div>
              </div>

              {/* Dialog Box */}
              {stage === 2 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="absolute -top-32 md:-top-40 left-1/2 -translate-x-1/2 w-64 md:w-80 bg-white p-6 rounded-3xl rounded-br-none shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-indigo-100"
                >
                  <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-2">Hey!</h3>
                  <p className="text-slate-600 font-medium mb-4 leading-snug">The weather is perfect right now... Want to go on a long ride with me?</p>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={acceptRide}
                      className="flex-1 bg-indigo-600 text-white font-bold py-2 rounded-xl hover:bg-indigo-700 transition shadow-lg active:scale-95"
                    >
                      Sit inside
                    </button>
                    <button className="flex-1 bg-slate-100 text-slate-500 font-bold py-2 rounded-xl hover:bg-slate-200 transition">
                      Busy
                    </button>
                  </div>
                </motion.div>
              )}

            </motion.div>
          )}

          {stage === 3 && (
            <motion.div 
              initial={{ x: 0 }}
              animate={{ x: "150vw" }}
              transition={{ duration: 1.5, ease: "easeIn" }}
              className="relative text-[150px] md:text-[200px] leading-none drop-shadow-2xl"
            >
              🚘
              <div className="absolute top-10 left-16 text-[80px] md:text-[100px] z-[-1]">👦🏻</div>
              <div className="absolute top-10 right-10 text-[80px] md:text-[100px] z-[-1]">👧🏻</div>
              {/* Speed lines */}
              <div className="absolute top-1/2 -left-20 w-32 h-2 bg-white/50 rounded-full" />
              <div className="absolute top-1/3 -left-32 w-16 h-2 bg-white/30 rounded-full" />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Final Screen */}
      <AnimatePresence>
        {stage === 3 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md"
          >
             <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-gradient-to-br from-indigo-900 to-purple-900 border border-indigo-500/30 p-10 md:p-14 rounded-[3rem] text-center shadow-[0_0_100px_rgba(79,70,229,0.3)] max-w-lg w-full">
               <Car className="w-16 h-16 text-indigo-400 mx-auto mb-6" />
               <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Pack your favorite playlist!</h2>
               <p className="text-indigo-200 text-lg mb-8">I'll pick you up at 7 PM. It's just gonna be us, the road, and the music. 🌌💖</p>
               <button onClick={() => window.location.reload()} className="bg-white text-indigo-900 font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform">See you!</button>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Link href="/templates" className="absolute top-6 left-6 z-50 text-white/50 hover:text-white flex items-center gap-2 font-medium">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>
    </div>
  );
}
