"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cake, Mail, Gift, X, Sparkles, Heart, Cloud, PartyPopper, Star, Flame } from "lucide-react";
import Link from "next/link";

export default function BirthdayDamboTheme() {
  const [phase, setPhase] = useState(0);
  const [mailOpen, setMailOpen] = useState(false);
  const [showTypography, setShowTypography] = useState(false);

  const messages = [
    "Wishing you a beautiful day 💫",
    "Happy Birthday 🎉",
    "May you be blessed with joy and peace 🌟",
    "And may your heart be filled with happiness 💕",
    "You are truly appreciated ❤️",
    "Wishing you love and smiles always 🥰",
    "Hope your day is as amazing as you are 🎂✨"
  ];

  // Auto progression
  useEffect(() => {
    const t1 = setTimeout(() => setShowTypography(true), 1500);
    const t2 = setTimeout(() => setPhase(1), 12000); // Wait for typer
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const [balloons, setBalloons] = useState<Array<{
    id: number;
    color: string;
    delay: number;
    xOffset: number;
  }>>([]);

  // Generate balloons client-side only (window not available on server)
  useEffect(() => {
    setBalloons(
      Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        color: ['bg-red-500', 'bg-blue-500', 'bg-yellow-400', 'bg-emerald-500', 'bg-purple-500', 'bg-pink-500'][i % 6],
        delay: Math.random() * 5,
        xOffset: Math.random() * window.innerWidth - window.innerWidth / 2,
      }))
    );
  }, []);

  // Typewriter Component
  const Typewriter = ({ text, delay }: { text: string, delay: number }) => {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: delay, duration: 0.8 }}
        className="text-white md:text-xl font-medium tracking-wide mb-3"
        style={{ textShadow: "0px 2px 10px rgba(255,255,255,0.4)" }}
      >
        {text}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 overflow-hidden relative flex flex-col items-center justify-center font-sans">
      
      {/* Background Ambience & Dambo's Crazy Animations */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black opacity-80" />
        
        {/* Floating Clouds */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`cloud-${i}`}
            initial={{ x: "-20vw", opacity: 0.3 }}
            animate={{ x: "120vw", opacity: 0.1 }}
            transition={{ duration: 25 + Math.random() * 20, repeat: Infinity, delay: i * 5, ease: "linear" }}
            className="absolute"
            style={{ top: `${10 + Math.random() * 30}%`, left: 0 }}
          >
            <Cloud className="w-24 h-24 text-white" fill="white" />
          </motion.div>
        ))}

        {/* Shaking Gift Boxes on Bottom row */}
        <div className="absolute bottom-5 w-full flex justify-around px-10">
          {[...Array(6)].map((_, i) => (
             <motion.div 
               key={`gift-${i}`}
               animate={{ y: [0, -15, 0], rotate: [-5, 5, -5] }}
               transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
               className="text-pink-500 opacity-60"
             >
               <Gift className="w-10 h-10" fill="currentColor" />
             </motion.div>
          ))}
        </div>

        {/* Exploding Fireworks / Party Poppers */}
        {[...Array(5)].map((_, i) => (
           <motion.div
             key={`popper-${i}`}
             animate={{ scale: [0.5, 1.5, 0.5], opacity: [0, 0.8, 0], rotate: [0, 45, 90] }}
             transition={{ duration: 3, repeat: Infinity, delay: Math.random() * 3 }}
             className="absolute"
             style={{ top: `${Math.random() * 40}%`, left: `${Math.random() * 80 + 10}%` }}
           >
             <PartyPopper className={`w-12 h-12 ${['text-yellow-400', 'text-purple-400', 'text-pink-400', 'text-red-400'][i % 4]}`} />
           </motion.div>
        ))}

        {/* Original Confetti/Stars */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: ["0vh", "100vh"], 
              rotate: [0, 360],
              opacity: [0, 1, 0]
            }}
            transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5, ease: "linear" }}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10%`,
              width: Math.random() * 8 + 4,
              height: Math.random() * 8 + 4,
              backgroundColor: ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][Math.floor(Math.random() * 5)]
            }}
          />
        ))}
      </div>

      <AnimatePresence>
        {phase === 0 && (
           <motion.div 
             key="intro"
             exit={{ opacity: 0, scale: 0.9 }}
             transition={{ duration: 1 }}
             className="relative z-10 w-full max-w-xl px-6 flex flex-col items-center text-center"
           >
              <motion.div 
                animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="relative w-32 h-32 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center border border-pink-400/30 mb-8 shadow-[0_0_50px_rgba(244,63,94,0.3)]"
              >
                <Cake className="w-16 h-16 text-pink-400" />
                <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity }} className="absolute -top-4 text-yellow-500">
                  <Flame className="w-8 h-8 fill-yellow-400" />
                </motion.div>
              </motion.div>
              
              <div className="w-full h-80 flex flex-col items-start justify-center pl-4 md:pl-12 border-l-[3px] border-pink-500/50 ml-6 relative">
                 <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,1)]" />
                 <div className="absolute -left-[9px] bottom-0 w-4 h-4 rounded-full bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,1)]" />
                 
                 {showTypography && messages.map((msg, idx) => (
                   <Typewriter key={idx} text={msg} delay={idx * 1.5} />
                 ))}
              </div>
           </motion.div>
        )}

        {phase === 1 && (
          <motion.div 
            key="celebration"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 w-full h-full flex flex-col items-center justify-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 mb-6 drop-shadow-2xl text-center z-20">
              Happy Birthday, Dambo!
            </h1>
            <p className="text-xl text-white/80 font-light mb-12 z-20">A special day for a special person. 💖</p>
            
            {/* Balloon Release Sequence from original logic */}
            {balloons.map((balloon) => (
              <motion.div
                key={balloon.id}
                initial={{ y: "120vh", x: balloon.xOffset }}
                animate={{ y: "-20vh", x: balloon.xOffset + (Math.random() * 100 - 50) }}
                transition={{ duration: 10, delay: balloon.delay, repeat: Infinity, ease: "linear" }}
                className="absolute flex flex-col items-center"
              >
                <div className={`w-16 h-20 rounded-t-full rounded-bl-full rounded-br-full ${balloon.color} shadow-[inset_-5px_-5px_20px_rgba(0,0,0,0.2)] relative opacity-90`} style={{ borderBottomRightRadius: '20px', borderBottomLeftRadius: '20px' }}>
                   <div className="w-full h-full bg-white/20 absolute top-[-10px] left-[-10px] rounded-full blur-[5px]" />
                </div>
                <div className="w-0.5 h-32 bg-white/30" />
                <div className="w-20 h-28 bg-white p-1 shadow-xl -mt-4 transform rotate-3 z-10">
                  <div className={`w-full h-full bg-gray-200 flex items-center justify-center overflow-hidden`}>
                     <Gift className="w-6 h-6 text-gray-400" />
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setMailOpen(true)}
              className="mt-8 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 shadow-[0_10px_30px_rgba(244,63,94,0.4)] border border-pink-400 z-50 cursor-pointer"
            >
              <Mail className="w-6 h-6" /> Open Your Present
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Secret Mail Modal (Recreates the Dambo Card) */}
      <AnimatePresence>
        {mailOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setMailOpen(false)}
            />
            
            <motion.div 
              initial={{ scale: 0.5, y: 100, rotateX: 45 }}
              animate={{ scale: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.5, y: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="relative w-full max-w-lg bg-[#FFFAFA] p-8 md:p-10 rounded-2xl shadow-2xl z-10 overflow-hidden"
            >
              <button 
                onClick={() => setMailOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-rose-500 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-pink-400 via-rose-500 to-red-400" />
              
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-pink-100">
                <div>
                  <p className="text-pink-500 font-bold text-sm tracking-wider uppercase mb-1">To: Divya</p>
                  <h3 className="text-2xl font-serif font-bold text-gray-800">Happy Birthday Dear Dambo! 🤭</h3>
                </div>
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-pink-500" />
                </div>
              </div>

              <div className="text-gray-600 font-serif text-lg leading-relaxed space-y-4">
                <p>
                  My Dear Bandiriya, Bhole Baba always bless you with abundant enjoyment on your birthday and always!
                </p>
                <p>
                  Thank you for coming into my life to make my Sister, Bestie, My Golo Mulo Machish ki Dibiya 🤭😅
                  Because your name is Divya 😁
                </p>
                <div className="p-4 bg-rose-50 rounded-xl mt-6 border border-rose-100 italic text-rose-800 text-center">
                  "Sending you an infinite amount of love, joy, and happiness on your birthday!"
                </div>
              </div>
              
              <div className="mt-8 flex justify-end items-center gap-2 text-rose-400 font-bold">
                 From: Newton <Heart className="w-4 h-4 fill-current" />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Link href="/templates" className="absolute top-6 left-6 text-white/50 hover:text-white transition-colors text-sm font-medium z-50 flex items-center gap-2">
        ← Back to Templates
      </Link>
    </div>
  );
}
