"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrainTrack, Image as ImageIcon, MessageCircleHeart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function TrainJourneyTheme() {
  const [currentCarriage, setCurrentCarriage] = useState(-1);
  const [started, setStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const images = [
    { src: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop", text: "Jab hum pehli baar mile the... 🚂" },
    { src: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop", text: "The day I realized you are the one! ✨" },
    { src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop", text: "Every journey with you is beautiful." },
    { src: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop", text: "And this train has no final stop. I love you! ❤️" }
  ];

  useEffect(() => {
    if (!started) return;
    
    if (audioRef.current) {
        audioRef.current.volume = 0.5;
        audioRef.current.play().catch(console.log);
    }
    
    // Play horn sound robustly
    const horn = new Audio("https://cdn.pixabay.com/audio/2022/03/15/audio_7314d3a2b4.mp3");
    horn.volume = 0.4;
    horn.play().catch(e => console.log("Horn play failed"));

    let carriageIndex = 0;
    setCurrentCarriage(0);

    const interval = setInterval(() => {
      carriageIndex++;
      if (carriageIndex >= images.length) {
        clearInterval(interval);
        setTimeout(() => setCurrentCarriage(99), 1000); // end state
      } else {
        setCurrentCarriage(carriageIndex);
      }
    }, 6000); // Holds for 6 seconds per carriage

    return () => clearInterval(interval);
  }, [started]);

  return (
    <div className="min-h-screen bg-neutral-950 flex justify-center items-center overflow-hidden relative font-sans">
      <audio ref={audioRef} src="https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3" loop />
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center brightness-[0.25] opacity-50" />
      
      {/* Steam Smoke Effects */}
      {started && (
        <div className="absolute inset-0 z-10 opacity-30 mix-blend-screen pointer-events-none">
          {[...Array(6)].map((_, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, x: -200, y: 100, scale: 1 }}
               animate={{ opacity: [0, 0.5, 0], x: 500 + i*100, y: -200, scale: 3 }}
               transition={{ duration: 10, repeat: Infinity, delay: i * 2, ease: "linear" }}
               className="w-64 h-64 bg-gray-300 rounded-full blur-[80px] absolute bottom-1/4"
             />
          ))}
        </div>
      )}

      {/* Intro Screen */}
      {!started && (
        <motion.div className="z-20 text-center text-white flex flex-col items-center">
          <div className="w-24 h-24 bg-red-900/40 rounded-full flex items-center justify-center mb-6 border border-red-500/30">
            <span className="text-6xl">🚂</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-wider text-amber-100">The Love Express</h1>
          <p className="text-amber-100/60 mb-8 max-w-sm">Hop on board as we take a ride through our most beautiful memories.</p>
          <button 
            onClick={() => setStarted(true)}
            className="px-8 py-3 bg-gradient-to-r from-red-600 to-amber-600 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_20px_rgba(220,38,38,0.5)]"
          >
            Start Journey
          </button>
        </motion.div>
      )}

      {/* Train Track Overlay */}
      {started && (
         <div className="absolute bottom-10 left-0 w-full h-[5px] bg-neutral-800 z-10 shadow-[0_5px_0_10px_#171717]">
            <motion.div 
               initial={{ backgroundPosition: "0px 0px" }}
               animate={{ backgroundPosition: "100px 0px" }}
               transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
               className="w-full h-full bg-[linear-gradient(90deg,_#404040_50%,_transparent_50%))] bg-[length:20px_100%]" 
            />
         </div>
      )}

      {/* Carriages */}
      <AnimatePresence mode="wait">
        {started && currentCarriage >= 0 && currentCarriage < images.length && (
          <motion.div 
            key={currentCarriage}
            className="absolute z-20 flex flex-col items-center bottom-28 md:bottom-auto w-[90%] md:w-[600px] h-auto"
            initial={{ x: "100vw", opacity: 1, scale: 0.9 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: "-100vw", opacity: 0.5, scale: 0.8 }}
            transition={{ duration: 1.5, type: "spring", bounce: 0.2 }}
          >
            {/* The Train Carriage Box */}
            <div className="bg-[#1A1A1A] w-full rounded-2xl border-[4px] border-amber-900/50 shadow-2xl relative overflow-hidden">
               {/* Roof */}
               <div className="w-full h-8 bg-[#303030] border-b-2 border-black/50 shadow-inner rounded-t-xl" />
               
               {/* Window containing image */}
               <div className="p-6 md:p-8 flex flex-col items-center gap-6">
                 <div className="w-full relative aspect-[4/3] rounded-xl overflow-hidden border-4 border-[#333] shadow-inner bg-black">
                   <Image src={images[currentCarriage].src} alt="Memory" fill className="object-cover" />
                 </div>
                 
                 {/* Secret Message Overlay */}
                 <div className="w-full bg-[#111] p-4 rounded-xl border border-amber-500/20 shadow-lg text-center">
                    <p className="text-amber-100/90 text-lg md:text-xl font-serif italic">"{images[currentCarriage].text}"</p>
                 </div>
               </div>

               {/* Carriage Wheels Base */}
               <div className="w-full h-4 bg-gradient-to-b from-[#222] to-black border-t border-[#444]" />
            </div>

            {/* Wheels */}
            <div className="flex justify-between w-[80%] px-8 -mt-2">
               {[1, 2].map(w => (
                 <motion.div 
                   key={w}
                   animate={{ rotate: 360 }}
                   transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                   className="w-16 h-16 rounded-full border-4 border-neutral-600 bg-neutral-800 flex items-center justify-center relative shadow-lg"
                 >
                   <div className="w-full h-1 bg-neutral-600 absolute" />
                   <div className="w-1 h-full bg-neutral-600 absolute" />
                   <div className="w-2 h-2 rounded-full bg-amber-500 absolute" />
                 </motion.div>
               ))}
            </div>
          </motion.div>
        )}

        {started && currentCarriage === 99 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="z-30 text-center p-8 bg-black/60 backdrop-blur-xl rounded-3xl border border-rose-500/30"
          >
            <h2 className="text-5xl font-black text-rose-500 mb-4">Happy Anniversary! ❤️</h2>
            <p className="text-white text-lg">Thank you for riding with me on this beautiful journey.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <Link href="/templates" className="absolute top-6 left-6 z-50 text-white/50 hover:text-white flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>
    </div>
  );
}
