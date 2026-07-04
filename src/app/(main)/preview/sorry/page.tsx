"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Mail, Sparkles, ArrowLeft, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";

const DEMO_PHOTOS = [
  "https://images.unsplash.com/photo-1518199266791-5375a83190b7",
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2",
  "https://images.unsplash.com/photo-1516410529446-2c777cb7366d",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486",
];

export default function SorryTemplatePreview() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCollage, setShowCollage] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowCollage(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center overflow-hidden relative selection:bg-rose-500/30">
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <Link href="/templates" className="absolute top-8 left-8 flex items-center gap-2 text-white/40 hover:text-white transition-colors z-50 text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Templates
      </Link>

      <button 
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-8 right-8 p-3 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all z-50"
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="sealed"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -40 }}
            className="relative z-10 flex flex-col items-center text-center px-6"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="mb-12 relative cursor-pointer group"
              onClick={() => setIsOpen(true)}
            >
              <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full scale-150 group-hover:bg-rose-500/30 transition-colors duration-1000" />
              <Mail className="w-24 h-24 text-white relative z-10 drop-shadow-2xl" strokeWidth={1} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <Heart className="w-8 h-8 text-rose-500 fill-rose-500 animate-pulse" />
              </div>
            </motion.div>
            
            <h1 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">I have something to say...</h1>
            <p className="text-white/40 text-lg font-light mb-12 max-w-sm mx-auto leading-relaxed">
              Main janta hoon maine galti ki hai. Please ek baar ye letter padh lo? 🥺
            </p>
            
            <button
              onClick={() => setIsOpen(true)}
              className="px-12 py-5 bg-white text-black font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-white/10 flex items-center gap-3 group"
            >
              Open My Heart
              <Sparkles className="w-5 h-5 text-indigo-600 group-hover:rotate-12 transition-transform" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="opened"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-4xl min-h-screen p-8 md:p-20 relative z-10 overflow-y-auto custom-scrollbar flex flex-col items-center"
          >
            {/* The Floating Collage Background */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
              {DEMO_PHOTOS.map((url, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: (i % 2 === 0 ? -100 : 100), y: 100 * (i + 1) }}
                  animate={{ opacity: 1, x: (i % 2 === 0 ? -200 : 200), y: (i % 2 === 0 ? -100 : 100) }}
                  transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", delay: i * 2 }}
                  className="absolute w-64 h-80 rounded-2xl overflow-hidden border border-white/10 hidden md:block"
                  style={{ top: `${20 + i * 15}%`, left: '50%' }}
                >
                  <img src={url} className="w-full h-full object-cover" alt="" />
                </motion.div>
              ))}
            </div>

            {/* The Scrolling Letter */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="w-full max-w-2xl bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 md:p-20 shadow-2xl relative mb-20"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#0a0a0f] border border-white/10 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
              </div>

              <div className="prose prose-invert prose-lg max-w-none text-center italic">
                <p className="text-white/40 mb-8 uppercase tracking-[0.4em] text-xs font-black">My Dearest,</p>
                
                <h2 className="text-3xl md:text-5xl font-black text-white mb-10 not-italic tracking-tighter">I'm Truly Sorry.</h2>
                
                <div className="space-y-8 text-white/70 font-medium leading-relaxed">
                  <p>
                    Mujhe pata hai ki mere words aur mere actions ne tumhein hurt kiya hai. Aur ye dekh kar mera dil rota hai.
                  </p>
                  
                  <p>
                    Pura din bas wahi baatein dimag mein ghoomti rehti hain... kaash maine wo na kaha hota. Kaash maine tumhe sahi se samjha hota.
                  </p>
                  
                  <p>
                    Tum meri life ka wo part ho jise main kabhi khona nahi chahta. Humari memories, hamari wo lambi baatein, hamari har choti khushi... wo sab mere liye sab kuch hain.
                  </p>
                  
                  <p className="text-white text-xl">
                    Kya tum mujhe ek aur chance de sakte ho?
                  </p>
                </div>

                <div className="mt-20 pt-10 border-t border-white/5">
                   <p className="text-white/40 text-sm mb-12">Click below to forgive me</p>
                   
                   <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                     <button
                       onClick={() => alert("Forgiven! ❤️ (Preview Mode)")}
                       className="px-12 py-5 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black rounded-2xl shadow-2xl shadow-rose-500/20 hover:scale-105 active:scale-95 transition-all"
                     >
                       I Forgive You ❤️
                     </button>
                     <button className="text-white/20 hover:text-white/40 transition-colors font-bold text-sm">
                       Let's talk first...
                     </button>
                   </div>
                </div>
              </div>
            </motion.div>

            <Link href="/create?template=sorry" className="bg-white/10 hover:bg-white/20 border border-white/10 px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all mb-20">
              Create your own version
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;
        }
      `}</style>
    </div>
  );
}
