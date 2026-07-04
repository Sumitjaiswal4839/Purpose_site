"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function BabyKissTheme() {
  const images = [
    { src: "https://images.unsplash.com/photo-1549471013-3364d7220b75", text: "When we were just kids..." },
    { src: "https://images.unsplash.com/photo-1518199266791-5375a83190b7", text: "Look at how far we've come!" },
    { src: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2", text: "You are the cutest person ever." },
    { src: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8", text: "To a lifetime of smiles together. 🍼💖" }
  ];

  const [step, setStep] = useState(0); // 0 = start, 1 = pulling, 2 = kiss
  const [kissGiven, setKissGiven] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const startAnimation = () => {
    if (audioRef.current) {
        audioRef.current.volume = 0.5;
        audioRef.current.play().catch(console.log);
    }
    setStep(1);
    
    // Simulate the pulling time
    setTimeout(() => {
      setStep(2);
      setTimeout(() => {
        setKissGiven(true);
      }, 1500);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col overflow-hidden relative font-sans">
      <audio ref={audioRef} src="https://cdn.pixabay.com/audio/2022/04/27/audio_653d9e29a9.mp3" loop />
      
      {/* Background Soft Hearts */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none flex flex-wrap gap-10 justify-center content-center overflow-hidden">
         {[...Array(20)].map((_, i) => (
           <Heart key={i} className="text-pink-300 w-12 h-12 rotate-[-20deg]" />
         ))}
      </div>

      <div className="w-full flex-1 relative z-20 flex flex-col justify-center px-4">
        
        {step === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md mx-auto"
          >
            <h1 className="text-5xl font-black text-rose-500 mb-6 drop-shadow-sm">A Special Delivery...</h1>
            <p className="text-lg text-rose-400 mb-8 font-medium">Someone tiny is bringing a huge surprise for you.</p>
            <button 
              onClick={startAnimation}
              className="bg-rose-500 text-white font-bold px-10 py-4 rounded-full text-xl hover:bg-rose-600 shadow-[0_10px_30px_rgba(244,63,94,0.3)] transition-transform hover:scale-105 active:scale-95"
            >
              Call them in!
            </button>
          </motion.div>
        )}

        {/* The Pulling Animation Sequence */}
        {step >= 1 && (
          <div className="relative w-full h-[600px] flex items-center justify-start overflow-hidden pt-20">
             
             {/* The String with Images */}
             <motion.div 
               initial={{ x: "100vw" }}
               animate={step === 1 ? { x: "20vw" } : { x: "15vw" }}
               transition={{ duration: 5, ease: "linear" }}
               className="flex items-center gap-12 border-b-2 border-dashed border-gray-400 relative z-10 pl-20 min-w-max pr-[50vw]"
             >
                {/* Images tied to the string */}
                {images.map((img, idx) => (
                  <motion.div 
                    key={idx}
                    className="relative pb-10"
                    animate={{ rotate: [-5, 5, -5] }}
                    transition={{ duration: 3, repeat: Infinity, delay: idx * 0.5 }}
                  >
                     <div className="w-1 h-10 bg-gray-400 mx-auto" />
                     <div className="w-48 md:w-64 bg-white p-3 pb-8 rounded-lg shadow-xl shrink-0">
                       <div className="w-full aspect-[4/3] relative rounded bg-gray-100 mb-4 overflow-hidden border border-gray-200">
                         <Image src={img.src} alt="Memories" fill className="object-cover" />
                       </div>
                       <p className="text-center text-sm md:text-base font-bold text-gray-700 font-serif leading-snug">
                         {img.text}
                       </p>
                     </div>
                  </motion.div>
                ))}
             </motion.div>

             {/* The Baby */}
             <motion.div 
               initial={{ x: "110vw" }}
               animate={step === 1 ? { x: "5vw" } : { x: "-20vw", opacity: 0 }}
               transition={step === 1 ? { duration: 5, ease: "linear" } : { duration: 2, ease: "easeIn" }}
               className="absolute z-20 text-[100px] md:text-[150px] leading-none filter drop-shadow-2xl"
               style={{ top: '250px' }}
             >
               <motion.div 
                 animate={{ y: [-10, 0, -10] }} 
                 transition={{ duration: 0.5, repeat: Infinity }}
               >
                 👶
               </motion.div>
             </motion.div>
          </div>
        )}

      </div>

      {/* The Kiss Finale overlay */}
      <AnimatePresence>
        {kissGiven && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-pink-100/90 backdrop-blur-sm pointer-events-none"
          >
             <motion.div 
               initial={{ scale: 0 }}
               animate={{ scale: [1, 1.5, 1], opacity: [1, 0] }}
               transition={{ duration: 2, ease: "easeOut" }}
               className="text-[150px] md:text-[250px] leading-none mb-10"
             >
               💋
             </motion.div>
             
             {/* Burst of hearts */}
             {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                  animate={{ 
                    opacity: 0, 
                    scale: 3, 
                    x: (Math.random() - 0.5) * 800, 
                    y: (Math.random() - 0.5) * 800 - 200 
                  }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute"
                >
                   <Heart className="w-10 h-10 text-rose-500 fill-rose-500" />
                </motion.div>
             ))}

             <motion.h2 
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 1 }}
               className="text-4xl md:text-6xl font-black text-rose-600 drop-shadow-md text-center mt-8 pointer-events-auto"
             >
               With all my love! ❤️
             </motion.h2>

             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }} className="mt-8 pointer-events-auto">
               <button onClick={() => window.location.reload()} className="bg-white text-rose-500 font-bold px-6 py-3 rounded-full shadow border border-rose-100">Play Again</button>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Link href="/templates" className="absolute top-6 left-6 z-50 text-gray-500 hover:text-gray-900 flex items-center gap-2 font-medium">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>
    </div>
  );
}
