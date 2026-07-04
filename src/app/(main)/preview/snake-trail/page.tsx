"use client";

import SnakeCursor from "@/components/SnakeCursor";
import { motion } from "framer-motion";
import { Heart, Sparkles, Wand2 } from "lucide-react";
import Link from "next/link";

export default function SnakeTrailPreview() {
  return (
    <div className="min-h-screen bg-black overflow-hidden relative flex flex-col items-center justify-center text-white">
      {/* The Snake Cursor Effect */}
      <SnakeCursor 
        headSpeed={0.2} 
        bodySpeed={0.15} 
        segmentSize={60} 
      />

      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500/20 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[150px] animate-pulse" delay-1000 />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-rose-300 text-sm font-bold"
        >
          <Sparkles className="w-4 h-4" /> Move your mouse/touch to see the magic!
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-black mb-6 tracking-tighter"
        >
          The <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-purple-400">Snake Trail</span> Experience
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg md:text-xl text-gray-400 mb-12 leading-relaxed"
        >
          A trail of your most precious memories follows every move you make. 
          Tap anywhere to release a burst of love.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link 
            href="/create?template=snake-trail" 
            className="px-8 py-4 bg-rose-600 hover:bg-rose-700 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-rose-600/30 flex items-center gap-2"
          >
            <Wand2 className="w-5 h-5" /> Customize This Template
          </Link>
          <div className="flex items-center gap-2 text-gray-500 font-medium">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" /> 
            <span>Perfect for Anniversaries</span>
          </div>
        </motion.div>
      </div>

      {/* Floating Instructions for Mobile */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 md:hidden">
        <div className="px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 text-xs text-gray-500">
          Touch and drag your finger across the screen
        </div>
      </div>
    </div>
  );
}
