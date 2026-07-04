"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, ArrowRight, Smile } from "lucide-react";
import Link from "next/link";

// ─── Demo photos (nostalgic/warm vibe) ────────────
const DEMO_PHOTOS = [
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=160&h=160&fit=crop",
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=160&h=160&fit=crop",
  "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=160&h=160&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=160&h=160&fit=crop",
  "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=160&h=160&fit=crop&crop=faces",
];

const GLOW_COLORS = ["#fbbf24", "#fb923c", "#f59e0b", "#d97706", "#fcd34d", "#f97316"];

type Stage = "intro" | "floating" | "reveal" | "accepted";

export default function BestFriendToGFPreview() {
  const [stage, setStage] = useState<Stage>("intro");
  const [clickedCount, setClickedCount] = useState(0);
  const [noEscapes, setNoEscapes] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef  = useRef<ReturnType<typeof setInterval>>(undefined);
  const idRef        = useRef(0);

  const burst = useCallback((x: number, y: number) => {
    for (let i = 0; i < 12; i++) {
      const el = document.createElement("span");
      const angle = (i / 12) * Math.PI * 2;
      const dist  = 40 + Math.random() * 70;
      el.textContent = ["❤️","✨","🌟","💖","🍂","✨"][Math.floor(Math.random()*6)];
      el.style.cssText = `
        position:fixed; left:${x}px; top:${y}px; font-size:${14+Math.random()*12}px;
        pointer-events:none; z-index:9999;
        transform:translate(-50%,-50%);
        animation: fmBurst 0.85s ease-out forwards;
        --dx:${Math.cos(angle)*dist}px; --dy:${Math.sin(angle)*dist - 30}px;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 900);
    }
  }, []);

  const spawnImage = useCallback(() => {
    const container = containerRef.current;
    if (!container || stage !== "floating") return;
    const id   = ++idRef.current;
    const src  = DEMO_PHOTOS[Math.floor(Math.random() * DEMO_PHOTOS.length)];
    const size = 80 + Math.floor(Math.random() * 60);
    const left = 5 + Math.random() * 85;
    const dur  = 6000 + Math.random() * 4000;
    const sway = (Math.random() - 0.5) * 80;
    const glow = GLOW_COLORS[Math.floor(Math.random() * GLOW_COLORS.length)];

    const wrap = document.createElement("div");
    wrap.style.cssText = `
      position:absolute; bottom:-180px; left:${left}%;
      width:${size}px; height:${size}px;
      border-radius:24px; overflow:hidden; cursor:pointer;
      box-shadow:0 0 25px ${glow}99, 0 0 60px ${glow}44;
      border:3px solid white;
      animation: fmFloatUp ${dur}ms cubic-bezier(0.4,0,0.6,1) forwards;
      --sway:${sway}px;
      transition: transform 0.2s ease;
      pointer-events: auto;
      will-change: transform;
    `;

    const img = document.createElement("img");
    img.src = src; img.style.cssText = "width:100%;height:100%;object-fit:cover;display:block;pointer-events:none;";

    wrap.addEventListener("mouseenter", () => { wrap.style.transform = "scale(1.15) rotate(-3deg)"; });
    wrap.addEventListener("mouseleave", () => { wrap.style.transform = ""; });
    wrap.addEventListener("click", (e) => {
      burst(e.clientX, e.clientY);
      wrap.style.transform = "scale(0) rotate(20deg)";
      wrap.style.opacity = "0";
      setClickedCount((c) => {
        const next = c + 1;
        if (next >= 5) setStage("reveal");
        return next;
      });
      setTimeout(() => wrap.remove(), 300);
    });

    wrap.appendChild(img);
    container.appendChild(wrap);
    setTimeout(() => { if (wrap.parentNode) wrap.remove(); }, dur + 500);
  }, [stage, burst]);

  useEffect(() => {
    if (stage !== "floating") {
      clearInterval(intervalRef.current);
      return;
    }
    spawnImage(); spawnImage();
    intervalRef.current = setInterval(spawnImage, 1500);
    return () => clearInterval(intervalRef.current);
  }, [stage, spawnImage]);

  const getNoStyle = () => {
    if (noEscapes === 0) return {};
    return {
      transform: `translate(${(Math.random()-0.5)*250}px, ${(Math.random()-0.5)*150}px)`,
      transition: "transform 0.2s ease",
    };
  };

  return (
    <>
      <style>{`
        @keyframes fmFloatUp {
          0%   { transform:translateY(0) translateX(0) rotate(0deg); opacity:0; }
          10%  { opacity:1; }
          50%  { transform:translateY(-55vh) translateX(var(--sway)) rotate(4deg); opacity:1; }
          100% { transform:translateY(-115vh) translateX(calc(var(--sway)*-0.5)) rotate(-4deg); opacity:0; }
        }
        @keyframes fmBurst {
          0%   { transform:translate(-50%,-50%) scale(1); opacity:1; }
          100% { transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) scale(0.2); opacity:0; }
        }
      `}</style>

      <div className="min-h-screen bg-[#1a0f00] flex flex-col items-center justify-center overflow-hidden relative select-none font-sans">
        
        {/* Warm Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-900/10 blur-[150px] rounded-full" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-64"
               style={{ background: "linear-gradient(to top, rgba(251,191,36,0.1), transparent)", filter: "blur(40px)" }} />
        </div>

        <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 3 }} />

        <Link href="/templates" className="absolute top-8 left-8 text-amber-200/40 hover:text-amber-200 transition-colors z-20 font-bold tracking-widest uppercase text-xs">
          ← All Templates
        </Link>

        <AnimatePresence mode="wait">
          {stage === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -40 }}
              className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl"
            >
              <div className="w-24 h-24 bg-amber-500/20 rounded-3xl flex items-center justify-center mb-10 border border-amber-500/30 rotate-6 shadow-2xl shadow-amber-500/20">
                <Smile className="w-12 h-12 text-amber-400" />
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight italic">
                More Than<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                  Just Friends.
                </span>
              </h1>
              <p className="text-amber-100/60 text-xl mb-12 font-medium max-w-lg">
                Hamaari dosti ke wo saare pal aaj hawa mein ud rahe hain. Har photo hamari kahani kehti hai.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStage("floating")}
                className="bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-xl px-12 py-5 rounded-2xl shadow-2xl shadow-amber-500/30"
              >
                Let's Relive Them ✨
              </motion.button>
            </motion.div>
          )}

          {stage === "floating" && (
            <motion.div
              key="floating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative z-10 flex flex-col items-center text-center px-6"
            >
              <div className="mb-8 w-24 h-24 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col items-center justify-center shadow-2xl rotate-3">
                <span className="text-4xl font-black text-amber-400">{clickedCount}</span>
                <span className="text-[10px] text-amber-200/50 uppercase font-black tracking-widest">captured</span>
              </div>
              <h2 className="text-3xl font-black text-white mb-4 italic">
                {clickedCount < 3 ? "Humari yaadon ko catch karo..." : "Just a few more! 💛"}
              </h2>
              <div className="w-64 h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
                  animate={{ width: `${(clickedCount / 5) * 100}%` }}
                />
              </div>
            </motion.div>
          )}

          {stage === "reveal" && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10 w-full max-w-xl mx-6 bg-white/5 backdrop-blur-3xl rounded-[3rem] p-10 md:p-16 border border-white/10 shadow-2xl text-center"
            >
              <Heart className="w-16 h-16 text-rose-500 fill-rose-500 mx-auto mb-10" />
              <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight italic">
                Dost se thoda<br/>
                <span className="text-amber-400">zyada hona hai?</span>
              </h2>
              <p className="text-white/60 text-xl leading-relaxed mb-12 font-medium italic">
                "Itne saalon ki dosti, itni saari yaadein... Par ab main thak gaya hoon sirf 'best friend' kehlane se. Main tujhe apni duniya banana chahta hoon."
              </p>
              <div className="flex flex-col gap-4">
                <button
                  onClick={(e) => { burst(e.clientX, e.clientY); setStage("accepted"); }}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black py-5 rounded-2xl text-2xl shadow-xl hover:scale-105 transition-transform"
                >
                  YES! I'd Love To ❤️
                </button>
                <div onMouseEnter={() => setNoEscapes(n => n + 1)} style={getNoStyle()}>
                  <button className="w-full bg-white/5 text-white/30 font-bold py-4 rounded-2xl border border-white/10">
                    {noEscapes > 0 ? "Pakde gaye! 😄" : "Nahi..."}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {stage === "accepted" && (
            <motion.div
              key="accepted"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative z-10 flex flex-col items-center text-center px-6"
            >
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                <Heart className="w-32 h-32 text-rose-500 fill-rose-500 shadow-2xl" />
              </motion.div>
              <h1 className="text-6xl md:text-8xl font-black text-white mt-10 mb-6 italic">
                Finally! 💍
              </h1>
              <p className="text-amber-200 text-2xl font-medium italic mb-12">Dosti ab Ishq ban gayi. 💕</p>
              <Link href="/templates" className="bg-white/10 hover:bg-white/20 px-10 py-4 rounded-full text-white font-bold transition-all border border-white/20">
                Back to Explorer
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
