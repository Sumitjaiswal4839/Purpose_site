"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function PreviewPage() {
  const [noHoverCount, setNoHoverCount] = useState(0);
  const [isAccepted, setIsAccepted] = useState(false);

  // Math for the evading button
  const handleNoHover = () => {
    setNoHoverCount((prev) => prev + 1);
  };

  const getNoButtonStyles = () => {
    if (noHoverCount === 0) return {};
    
    // Move the button somewhere random. Math.random * limits
    const x = Math.random() * 200 - 100;
    const y = Math.random() * 200 - 100;
    
    return {
      transform: `translate(${x}px, ${y}px)`,
      position: "relative" as "relative",
    };
  };

  if (isAccepted) {
    return (
      <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center p-6 text-center">
        <motion.div
           initial={{ scale: 0 }}
           animate={{ scale: 1 }}
           transition={{ type: "spring", bounce: 0.5 }}
        >
          <Heart className="w-32 h-32 text-red-500 fill-red-500 mx-auto mb-8 animate-pulse" />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-gray-800 mb-6"
        >
          Yay! I love you too! ❤️
        </motion.h1>
        <p className="text-xl text-gray-600">I can't wait to spend the rest of my life with you.</p>

        <Link href="/create" className="mt-20 text-gray-400 hover:text-gray-600 underline">
          Exit Preview
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-8 leading-tight">
          Will you marry me?
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 mb-12">
          You are the best thing that ever happened to me. I promise to always be by your side, through all the ups and downs. 
        </p>

        <div className="flex justify-center items-center gap-6 mt-8 h-32">
           <button 
             onClick={() => setIsAccepted(true)}
             className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-10 rounded-full text-xl shadow-lg transition-transform hover:scale-110"
           >
             YES!
           </button>

           <div onMouseEnter={handleNoHover} style={getNoButtonStyles()} className="transition-all duration-200">
             <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-4 px-10 rounded-full text-xl shadow-sm">
               No
             </button>
           </div>
        </div>
      </motion.div>

      <Link href="/create" className="absolute top-6 left-6 bg-white/50 px-4 py-2 rounded-full text-sm font-bold text-gray-600 hover:bg-white transition-colors">
        ← Back to Editor
      </Link>
    </div>
  );
}
