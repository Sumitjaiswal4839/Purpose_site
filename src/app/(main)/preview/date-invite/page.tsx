"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Coffee, Wine, Film, Palmtree, MapPin, Heart, Wind } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function DateInviteTheme() {
  const [step, setStep] = useState(0); // 0 = main ask, 1 = options, 2 = success
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [started, setStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const dateOptions = [
    { id: "temple", title: "Temple Date", icon: <MapPin className="w-8 h-8 text-orange-500" />, desc: "Peaceful morning & blessings 🛕", color: "bg-orange-50 border-orange-200 hover:border-orange-500 hover:shadow-orange-500/20" },
    { id: "coffee", title: "Coffee Date", icon: <Coffee className="w-8 h-8 text-amber-600" />, desc: "Deep talks over espresso ☕", color: "bg-amber-50 border-amber-200 hover:border-amber-500 hover:shadow-amber-500/20" },
    { id: "movie", title: "Movie Night", icon: <Film className="w-8 h-8 text-indigo-500" />, desc: "Popcorn & a blockbuster 🍿", color: "bg-indigo-50 border-indigo-200 hover:border-indigo-500 hover:shadow-indigo-500/20" },
    { id: "dinner", title: "Dinner Romance", icon: <Wine className="w-8 h-8 text-rose-600" />, desc: "Candlelight & fine dining 🍷", color: "bg-rose-50 border-rose-200 hover:border-rose-500 hover:shadow-rose-500/20" },
    { id: "drive", title: "Long Drive", icon: <Wind className="w-8 h-8 text-teal-500" />, desc: "Music and empty roads 🛣️", color: "bg-teal-50 border-teal-200 hover:border-teal-500 hover:shadow-teal-500/20" },
    { id: "streetfood", title: "Street Food", icon: <Palmtree className="w-8 h-8 text-lime-600" />, desc: "Spicy golgappas & fun 🌮", color: "bg-lime-50 border-lime-200 hover:border-lime-500 hover:shadow-lime-500/20" }
  ];

  const handleSelect = (option: any) => {
    setSelectedDate(option);
    setStep(2);
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-[#FFFBF0] flex items-center justify-center cursor-pointer" onClick={() => {
          setStarted(true);
          setTimeout(() => audioRef.current?.play().catch(console.log), 100);
      }}>
         <h2 className="text-2xl font-bold px-8 py-4 rounded-full bg-white text-rose-500 shadow-xl animate-pulse flex items-center gap-2 border border-rose-100">
           <Heart className="w-6 h-6 fill-rose-500" /> Tap to Open Envelope
         </h2>
         <audio ref={audioRef} src="https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3" loop />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF0] flex flex-col items-center justify-center relative font-sans overflow-hidden p-6">
      <audio ref={audioRef} src="https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3" loop />
      {/* Soft patterned background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(#000 2px, transparent 2px)", backgroundSize: "30px 30px" }} />

      <AnimatePresence mode="wait">
        {/* Step 0: The Ask */}
        {step === 0 && (
          <motion.div 
            key="ask"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white p-10 md:p-14 rounded-[3rem] shadow-2xl border border-rose-100 max-w-lg w-full text-center relative z-10"
          >
            <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-rose-500 fill-rose-500 animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Are you free?</h1>
            <p className="text-gray-500 text-lg mb-10 leading-relaxed font-medium">I've been meaning to ask you out. Would you like to go on a date with me this weekend?</p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setStep(1)}
                className="w-full bg-rose-500 text-white font-bold py-4 rounded-xl text-lg hover:bg-rose-600 shadow-lg active:scale-95 transition-all"
              >
                Yes, absolutely!
              </button>
              <button className="w-full bg-gray-50 text-gray-400 font-bold py-4 rounded-xl hover:bg-gray-100 transition-colors">
                Wait, let me think
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 1: The Options */}
        {step === 1 && (
          <motion.div 
            key="options"
            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, y: -50 }}
            className="w-full max-w-4xl relative z-10"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">You choose the vibe!</h2>
              <p className="text-lg text-gray-500">Pick any date style you love the most, and I'll handle the rest.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {dateOptions.map((opt, i) => (
                 <motion.div
                   key={opt.id}
                   initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                   onClick={() => handleSelect(opt)}
                   className={`p-6 rounded-3xl cursor-pointer transition-all duration-300 border-2 group shadow-sm ${opt.color} flex flex-col items-center text-center`}
                 >
                   <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                     {opt.icon}
                   </div>
                   <h3 className="text-xl font-bold text-gray-900 mb-2">{opt.title}</h3>
                   <p className="text-gray-600 text-sm font-medium">{opt.desc}</p>
                 </motion.div>
               ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Final Confirmation */}
        {step === 2 && selectedDate && (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-10 md:p-14 rounded-[3rem] shadow-2xl border border-rose-100 max-w-lg w-full text-center relative z-10"
          >
            <div className="mb-8">
               <span className="text-6xl drop-shadow-md">🎉</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">It's a Date!</h2>
            <div className={`inline-block px-6 py-3 rounded-2xl border-2 mb-8 ${selectedDate.color}`}>
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2 justify-center">
                {selectedDate.title} {selectedDate.icon}
              </h3>
            </div>
            <p className="text-gray-500 text-lg mb-8 leading-relaxed">Perfect pick! I'll sort out all the arrangements and let you know the exact time. Get ready! ✨</p>
            
            <button 
              onClick={() => window.location.reload()}
              className="bg-gray-900 text-white font-bold px-8 py-3 rounded-full hover:bg-black transition-colors shadow-lg w-full"
            >
              See you then!
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Link href="/templates" className="absolute top-6 left-6 z-50 text-gray-400 hover:text-gray-800 flex items-center gap-2 font-medium">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>
    </div>
  );
}
