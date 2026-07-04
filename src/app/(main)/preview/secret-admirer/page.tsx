"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Stars } from "lucide-react";
import Link from "next/link";

export default function SecretAdmirerTheme() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [noHoverCount, setNoHoverCount] = useState(0);

  // Math for the evading "No" button
  const handleNoHover = () => {
    setNoHoverCount((prev) => prev + 1);
  };

  const getNoButtonStyles = () => {
    if (noHoverCount === 0) return {};
    const x = Math.random() * 200 - 100;
    const y = Math.random() * 200 - 100;
    return {
      transform: `translate(${x}px, ${y}px)`,
      position: "relative" as "relative",
    };
  };

  const openEnvelope = () => {
    if (isOpen) return;
    setIsOpen(true);
    setTimeout(() => setShowLetter(true), 1200); // Wait for flap to open then slide letter out
  };

  if (isAccepted) {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-6 text-center text-rose-100 overflow-hidden relative">
        {/* Firework / Sparkle effects */}
        <div className="absolute inset-0 z-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: "100vh", x: Math.random() * window.innerWidth, opacity: 1 }}
              animate={{ y: "-10vh", x: Math.random() * window.innerWidth, opacity: 0 }}
              transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, ease: "easeOut" }}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.8)]"
            />
          ))}
        </div>

        <motion.div
           initial={{ scale: 0 }}
           animate={{ scale: 1 }}
           transition={{ type: "spring", bounce: 0.5 }}
           className="relative z-10"
        >
          <Heart className="w-40 h-40 text-rose-500 fill-rose-500 mx-auto mb-8 animate-pulse drop-shadow-[0_0_30px_rgba(244,63,94,0.6)]" />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-serif italic mb-6 text-white text-shadow-xl z-10"
        >
          My Secret is Out.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl md:text-2xl text-stone-300 font-light z-10"
        >
          I'm so incredibly happy. I love you! ❤️
        </motion.p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden relative">
       {/* Background ambient lighting */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose-900/20 blur-[120px] rounded-full pointer-events-none" />

       <AnimatePresence mode="wait">
         {!showLetter ? (
           <motion.div 
             key="envelope-view"
             exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
             transition={{ duration: 0.8 }}
             className="relative flex flex-col items-center justify-center cursor-pointer group"
             onClick={openEnvelope}
           >
             {!isOpen && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-16 text-stone-200 font-serif italic tracking-widest flex items-center gap-2 group-hover:text-white transition-colors"
                >
                  <Stars className="w-4 h-4 text-yellow-500" /> Tap to Open <Stars className="w-4 h-4 text-yellow-500" />
                </motion.p>
             )}

             {/* The ENVELOPE */}
             <div className="relative w-80 h-56 mt-4 perspective-[1000px]">
               {/* Envelope Back */}
               <div className="absolute inset-0 bg-stone-300 rounded-lg shadow-2xl" />
               
               {/* The Letter inside the envelope */}
               <motion.div 
                  initial={{ y: 0 }}
                  animate={isOpen ? { y: -80 } : { y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
                  className="absolute left-4 right-4 h-48 bg-stone-100 rounded shadow-inner top-4"
               >
                 <div className="w-full h-full flex flex-col items-center justify-center opacity-30">
                    <div className="w-2/3 h-2 bg-stone-300 rounded mb-4" />
                    <div className="w-4/5 h-2 bg-stone-300 rounded mb-2" />
                    <div className="w-3/4 h-2 bg-stone-300 rounded" />
                 </div>
               </motion.div>

               {/* Envelope Front Flaps (Left/Right/Bottom) */}
               <div className="absolute inset-0 w-full h-full pointer-events-none">
                 <div className="absolute inset-0 bg-stone-200" style={{ clipPath: 'polygon(0 0, 0 100%, 100% 100%, 100% 0, 50% 50%)' }} />
                 <div className="absolute inset-0 bg-stone-200 drop-shadow-md" style={{ clipPath: 'polygon(0 100%, 50% 50%, 100% 100%)' }} />
               </div>

               {/* Envelope Top Flap (The part that opens) */}
               <motion.div 
                 initial={{ rotateX: 0 }}
                 animate={isOpen ? { rotateX: 180 } : { rotateX: 0 }}
                 transition={{ duration: 0.8, ease: "easeInOut" }}
                 style={{ transformOrigin: "top" }}
                 className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
               >
                 <div className="w-full h-full bg-stone-300 drop-shadow-xl" style={{ clipPath: 'polygon(0 0, 50% 50%, 100% 0)' }} />
                 
                 {/* Wax Seal */}
                 {!isOpen && (
                   <motion.div 
                     initial={{ scale: 0 }}
                     animate={{ scale: 1 }}
                     className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-red-800 rounded-full flex items-center justify-center shadow-lg border border-red-900 z-20"
                   >
                     <Heart className="w-6 h-6 text-red-300 fill-red-300" />
                   </motion.div>
                 )}
               </motion.div>
             </div>
           </motion.div>
         ) : (
           <motion.div 
             key="letter-view"
             initial={{ opacity: 0, scale: 0.8, y: 50 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             transition={{ duration: 1, type: "spring" }}
             className="w-full max-w-2xl bg-stone-100 rounded-lg p-8 md:p-16 shadow-[0_0_50px_rgba(0,0,0,0.5)] text-center relative"
           >
             {/* Wax seal watermark */}
             <div className="absolute top-8 right-8 opacity-10">
               <Heart className="w-24 h-24 text-red-900 fill-red-900" />
             </div>

             <motion.h2 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.5, duration: 0.8 }}
               className="text-3xl md:text-5xl font-serif text-stone-800 mb-8 italic"
             >
               For the longest time...
             </motion.h2>

             <motion.p 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 1.5, duration: 1 }}
               className="text-lg md:text-xl text-stone-600 mb-12 font-serif leading-relaxed"
             >
               I've kept this a secret. Every time we speak, my favorite moments are the ones spent with you. 
               I didn't know how to say this, so I built this instead.
             </motion.p>
             
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 3, duration: 0.5 }}
               className="mt-8 pt-8 border-t border-stone-300"
             >
               <h3 className="text-2xl font-bold text-stone-800 mb-8">Will you be mine?</h3>
               
               <div className="flex justify-center items-center gap-6 h-20">
                 <button 
                   onClick={() => setIsAccepted(true)}
                   className="bg-red-800 hover:bg-red-900 text-white font-serif font-bold py-3 px-10 rounded-sm text-lg shadow-lg transition-transform hover:scale-110 border border-red-900"
                 >
                   Yes, absolutely.
                 </button>

                 <div onMouseEnter={handleNoHover} style={getNoButtonStyles()} className="transition-all duration-200">
                   <button className="bg-stone-300 hover:bg-stone-400 text-stone-600 font-serif font-bold py-3 px-10 rounded-sm text-lg shadow-sm border border-stone-400">
                     No way
                   </button>
                 </div>
               </div>
             </motion.div>

           </motion.div>
         )}
       </AnimatePresence>

       {/* Link back to editor - standard feature */}
       <Link href="/create" className="absolute top-6 left-6 text-stone-400 hover:text-white transition-colors text-sm font-medium flex items-center gap-2">
         ← Back to Editor
       </Link>
    </div>
  );
}
