"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Heart, KeyRound } from "lucide-react";
import Image from "next/image";

export default function LockKeyTheme() {
  const [started, setStarted] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const correctPasscode = "1402"; // E.g. 14th Feb

  useEffect(() => {
    audioRef.current = new Audio("https://cdn.pixabay.com/audio/2022/10/14/audio_99320e8317.mp3"); // gentle piano
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;
  }, []);

  const handleKeyPress = (num: string) => {
    if (passcode.length < 4) {
      setPasscode(prev => prev + num);
      setError(false);
    }
  };

  const handleBackspace = () => {
    setPasscode(prev => prev.slice(0, -1));
    setError(false);
  };

  useEffect(() => {
    if (passcode.length === 4) {
      if (passcode === correctPasscode) {
        setTimeout(() => setIsUnlocked(true), 500);
      } else {
        setTimeout(() => {
          setError(true);
          setTimeout(() => {
            setPasscode("");
            setError(false);
          }, 600);
        }, 300);
      }
    }
  }, [passcode]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Audio Tap to Start */}
      <AnimatePresence>
        {!started && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-4"
          >
            <div className="text-center">
               <motion.div
                 animate={{ scale: [1, 1.2, 1] }}
                 transition={{ repeat: Infinity, duration: 2 }}
                 className="w-20 h-20 bg-rose-500/20 rounded-full mx-auto flex items-center justify-center mb-6"
               >
                 <Lock className="w-10 h-10 text-rose-500" />
               </motion.div>
               <h1 className="text-3xl font-bold text-white mb-4">Secured Memory</h1>
               <button 
                 onClick={() => {
                   setStarted(true);
                   audioRef.current?.play().catch(e=>console.log(e));
                 }}
                 className="bg-white text-slate-900 font-bold px-8 py-4 rounded-full active:scale-95 transition-all text-lg"
               >
                 Attempt Unlock
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lock UI */}
      <AnimatePresence mode="wait">
        {!isUnlocked && started ? (
          <motion.div 
            key="lock-screen"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 1.1 }}
            className="w-full max-w-sm flex flex-col items-center"
          >
             <motion.div 
               animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
               transition={{ duration: 0.4 }}
               className={`w-20 h-20 rounded-full flex items-center justify-center mb-10 transition-colors ${error ? 'bg-red-500/20 text-red-500' : 'bg-slate-800 text-slate-400'}`}
             >
                <Lock className="w-8 h-8" />
             </motion.div>

             <h2 className="text-white text-2xl font-medium mb-2">Enter Anniversary</h2>
             <p className="text-slate-500 text-sm mb-12">Hint: Valentine's Date (DDMM)</p>

             {/* Code Dots */}
             <div className="flex gap-6 mb-12">
               {[0, 1, 2, 3].map(i => (
                 <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all ${i < passcode.length ? 'bg-white border-white' : 'border-slate-600 bg-transparent'} ${error && i < passcode.length ? 'bg-red-500 border-red-500' : ''}`} />
               ))}
             </div>

             {/* Numpad */}
             <div className="grid grid-cols-3 gap-x-8 gap-y-6 w-full max-w-[280px]">
                {[1,2,3,4,5,6,7,8,9].map(num => (
                  <button 
                    key={num}
                    onClick={() => handleKeyPress(num.toString())}
                    className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 text-white text-2xl font-light focus:bg-slate-800 active:scale-90 transition-all flex items-center justify-center mx-auto"
                  >
                    {num}
                  </button>
                ))}
                <div />
                <button 
                  onClick={() => handleKeyPress("0")}
                  className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 text-white text-2xl font-light focus:bg-slate-800 active:scale-90 transition-all flex items-center justify-center mx-auto"
                >
                  0
                </button>
                <button 
                  onClick={handleBackspace}
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-slate-500 active:scale-90 transition-all"
                >
                  <KeyRound className="w-6 h-6" />
                </button>
             </div>
          </motion.div>
        ) : isUnlocked ? (
          <motion.div 
            key="unlocked-screen"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, duration: 1 }}
            className="w-full max-w-md bg-white rounded-[2rem] p-6 relative overflow-hidden shadow-[0_0_50px_rgba(244,63,94,0.3)]"
          >
             <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-rose-500/20 to-transparent" />
             
             <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-6 mt-4 shadow-xl">
               <Image 
                 src="https://images.unsplash.com/photo-1549471013-3364d7220b75" 
                 alt="Memory"
                 fill
                 className="object-cover"
               />
             </div>

             <div className="text-center relative z-10 px-4">
                <motion.div
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="mx-auto w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-4"
                >
                   <Unlock className="w-6 h-6" />
                </motion.div>
                <h2 className="text-3xl font-bold text-slate-800 mb-3 font-serif">You have the key to my heart</h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  Happy Valentine's Day! No password in the world could keep my feelings hidden from you.
                </p>
                <button className="w-full bg-rose-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-rose-500/30 flex justify-center items-center gap-2">
                   <Heart className="w-5 h-5 fill-current" /> Save Memory
                </button>
             </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
