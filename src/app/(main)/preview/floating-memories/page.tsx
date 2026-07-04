"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

// ─── Demo photos (replace with user's actual photos in production) ────────────
const DEMO_PHOTOS = [
  "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=160&h=160&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=160&h=160&fit=crop",
  "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=160&h=160&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=160&h=160&fit=crop",
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=160&h=160&fit=crop",
  "https://images.unsplash.com/photo-1551292831-023188e78222?w=160&h=160&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=160&h=160&fit=crop",
  "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=160&h=160&fit=crop",
  "https://images.unsplash.com/photo-1484678336699-cc0357c8e673?w=160&h=160&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1543050873-db3f72b8a191?w=160&h=160&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=160&h=160&fit=crop",
];

const GLOW_COLORS = ["#ff6b9d","#c44dff","#ff4785","#a78bfa","#ffd93d","#ff8c42"];

// ─── Stage definitions ─────────────────────────────────────────────────────────
type Stage = "intro" | "floating" | "reveal" | "accepted";

export default function FloatingMemoriesTemplate() {
  const [stage, setStage] = useState<Stage>("intro");
  const [clickedCount, setClickedCount] = useState(0);
  const [noEscapes, setNoEscapes] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef  = useRef<ReturnType<typeof setInterval>>(undefined);
  const idRef        = useRef(0);

  // ─── Burst particles ────────────────────────────────────────────────────────
  const burst = useCallback((x: number, y: number, emoji = "❤️") => {
    for (let i = 0; i < 12; i++) {
      const el = document.createElement("span");
      const angle = (i / 12) * Math.PI * 2;
      const dist  = 40 + Math.random() * 70;
      el.textContent = ["❤️","💖","✨","🌸","💫","💗"][Math.floor(Math.random()*6)];
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

  // ─── Spawn one floating image ───────────────────────────────────────────────
  const spawnImage = useCallback(() => {
    const container = containerRef.current;
    if (!container || stage !== "floating") return;
    const id   = ++idRef.current;
    const src  = DEMO_PHOTOS[Math.floor(Math.random() * DEMO_PHOTOS.length)];
    const size = 70 + Math.floor(Math.random() * 55);
    const left = 4 + Math.random() * 84;
    const dur  = 5500 + Math.random() * 4000;
    const sway = (Math.random() - 0.5) * 70;
    const glow = GLOW_COLORS[Math.floor(Math.random() * GLOW_COLORS.length)];

    const wrap = document.createElement("div");
    wrap.dataset.fmId = String(id);
    wrap.style.cssText = `
      position:absolute; bottom:-180px; left:${left}%;
      width:${size}px; height:${size}px;
      border-radius:18px; overflow:hidden; cursor:pointer;
      box-shadow:0 0 22px ${glow}99, 0 0 50px ${glow}44;
      border:2.5px solid ${glow}77;
      animation: fmFloatUp ${dur}ms cubic-bezier(0.4,0,0.6,1) forwards;
      --sway:${sway}px;
      transition: transform 0.18s ease, box-shadow 0.18s ease;
      pointer-events: auto;
      will-change: transform;
    `;

    const img = document.createElement("img");
    img.src = src; img.alt = "memory";
    img.style.cssText = "width:100%;height:100%;object-fit:cover;display:block;pointer-events:none;user-select:none;";
    img.draggable = false;

    wrap.addEventListener("mouseenter", () => {
      wrap.style.transform = "scale(1.1) rotate(-3deg)";
      wrap.style.boxShadow = `0 0 36px ${glow}cc, 0 0 80px ${glow}77`;
    });
    wrap.addEventListener("mouseleave", () => {
      wrap.style.transform = "";
      wrap.style.boxShadow = `0 0 22px ${glow}99, 0 0 50px ${glow}44`;
    });
    wrap.addEventListener("click", (e) => {
      burst(e.clientX, e.clientY);
      wrap.style.transform = "scale(0) rotate(20deg)";
      wrap.style.opacity = "0";
      setClickedCount((c) => {
        const next = c + 1;
        if (next >= 5) setStage("reveal"); // after 5 clicks → reveal
        return next;
      });
      setTimeout(() => wrap.remove(), 300);
    });

    wrap.appendChild(img);
    container.appendChild(wrap);
    setTimeout(() => { if (wrap.parentNode) wrap.remove(); }, dur + 500);
  }, [stage, burst]);

  // ─── Run spawn interval only during "floating" stage ───────────────────────
  useEffect(() => {
    if (stage !== "floating") {
      clearInterval(intervalRef.current);
      return;
    }
    spawnImage(); spawnImage(); // two immediate
    setTimeout(spawnImage, 800);
    intervalRef.current = setInterval(spawnImage, 1400);
    return () => clearInterval(intervalRef.current);
  }, [stage, spawnImage]);

  // ─── Cleanup on unmount ─────────────────────────────────────────────────────
  useEffect(() => () => clearInterval(intervalRef.current), []);

  // ─── Evading "No" button ────────────────────────────────────────────────────
  const getNoStyle = () => {
    if (noEscapes === 0) return {};
    return {
      transform: `translate(${(Math.random()-0.5)*220}px, ${(Math.random()-0.5)*120}px)`,
      transition: "transform 0.25s ease",
    };
  };

  // ══════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════════
  return (
    <>
      {/* Global keyframes */}
      <style>{`
        @keyframes fmFloatUp {
          0%   { transform:translateY(0) translateX(0) rotate(0deg); opacity:0; }
          8%   { opacity:1; }
          50%  { transform:translateY(-55vh) translateX(var(--sway)) rotate(4deg); opacity:1; }
          92%  { opacity:1; }
          100% { transform:translateY(-115vh) translateX(calc(var(--sway)*-0.5)) rotate(-4deg); opacity:0; }
        }
        @keyframes fmBurst {
          0%   { transform:translate(-50%,-50%) scale(1); opacity:1; }
          100% { transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) scale(0.2); opacity:0; }
        }
        @keyframes fmPulse {
          0%,100% { transform: scale(1); }
          50%      { transform: scale(1.06); }
        }
        @keyframes fmPortal {
          0%,100% { opacity:0.6; }
          50%      { opacity:1; }
        }
      `}</style>

      <div className="min-h-screen bg-[#0d0010] flex flex-col items-center justify-center overflow-hidden relative select-none">

        {/* ── Ambient background ── */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-rose-900/20 blur-[130px] rounded-full" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-40"
               style={{ background: "linear-gradient(to top, rgba(196,77,255,0.18), transparent)", filter: "blur(24px)", animation: "fmPortal 3s ease-in-out infinite" }} />
        </div>

        {/* ── Floating images container ── */}
        <div ref={containerRef} aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 3 }} />

        {/* ── Back link ── */}
        <Link href="/templates" className="absolute top-6 left-6 text-white/40 hover:text-white/80 transition-colors text-sm z-20">
          ← Templates
        </Link>

        {/* ══ STAGE: intro ══════════════════════════════════════════════════════ */}
        <AnimatePresence mode="wait">
          {stage === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(12px)" }}
              transition={{ duration: 0.9, type: "spring" }}
              className="relative z-10 flex flex-col items-center text-center px-6 max-w-xl"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="mb-8"
              >
                <Heart className="w-20 h-20 text-rose-500 fill-rose-500 drop-shadow-[0_0_30px_rgba(244,63,94,0.7)]" style={{ animation: "fmPulse 2s ease-in-out infinite" }} />
              </motion.div>

              <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight leading-tight">
                Our Memories<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400">
                  Are Floating
                </span>
              </h1>
              <p className="text-white/60 text-lg mb-10 font-light leading-relaxed">
                Every photo we've taken together is drifting up to the sky. 
                Pop them, catch them, or just watch them float…
              </p>

              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setStage("floating")}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-black text-lg px-10 py-4 rounded-full shadow-[0_0_40px_rgba(244,63,94,0.4)] hover:shadow-[0_0_60px_rgba(196,77,255,0.5)] transition-shadow"
              >
                <Sparkles className="w-5 h-5" /> Let Our Memories Fly
              </motion.button>

              <p className="mt-6 text-white/30 text-sm">Tap the floating photos to burst them with love ❤️</p>
            </motion.div>
          )}

          {/* ══ STAGE: floating ═══════════════════════════════════════════════════ */}
          {stage === "floating" && (
            <motion.div
              key="floating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6 }}
              className="relative z-10 flex flex-col items-center text-center px-6"
            >
              {/* Counter badge */}
              <motion.div
                key={clickedCount}
                initial={{ scale: 1.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-6 w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center shadow-xl"
              >
                <span className="text-3xl font-black text-white">{clickedCount}</span>
                <span className="text-[10px] text-white/50 uppercase tracking-widest">popped</span>
              </motion.div>

              <h2 className="text-2xl md:text-4xl font-black text-white mb-2">
                {clickedCount === 0 && "Tap a floating memory..."}
                {clickedCount === 1 && "One down! Keep going 💖"}
                {clickedCount === 2 && "You're on fire! 🔥"}
                {clickedCount === 3 && "Almost there... 💫"}
                {clickedCount === 4 && "One last one! ✨"}
              </h2>
              <p className="text-white/40 text-sm">Pop 5 memories to unlock a surprise</p>

              {/* Progress bar */}
              <div className="mt-6 w-64 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-rose-500 to-purple-500"
                  animate={{ width: `${(clickedCount / 5) * 100}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          )}

          {/* ══ STAGE: reveal ═════════════════════════════════════════════════════ */}
          {stage === "reveal" && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, scale: 0.8, y: 60 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, type: "spring", bounce: 0.4 }}
              className="relative z-10 w-full max-w-lg mx-6 bg-white/8 backdrop-blur-2xl rounded-[2.5rem] p-10 md:p-14 border border-white/15 shadow-[0_0_80px_rgba(244,63,94,0.2)] text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="mx-auto w-20 h-20 bg-rose-500/20 rounded-full flex items-center justify-center mb-8 border border-rose-500/30"
              >
                <Heart className="w-10 h-10 text-rose-400 fill-rose-400" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight"
              >
                You caught<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-purple-400">
                  our love story.
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-white/70 text-lg leading-relaxed mb-10 font-light"
              >
                Every memory we've made — every laugh, every moment, every photo — 
                has been floating in my heart since the day I met you. 
                I just wanted to ask you something...
              </motion.p>

              <motion.h3
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2, type: "spring" }}
                className="text-2xl md:text-3xl font-black text-white mb-10"
              >
                Will you be my Valentine? 💍
              </motion.h3>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.8 }}
                className="flex justify-center items-center gap-4 flex-wrap"
              >
                <button
                  onClick={(e) => { burst(e.clientX, e.clientY); setStage("accepted"); }}
                  className="bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black py-4 px-10 rounded-2xl text-xl shadow-[0_0_30px_rgba(244,63,94,0.5)] hover:scale-105 transition-transform"
                >
                  Yes, always! ❤️
                </button>

                <div
                  onMouseEnter={() => setNoEscapes((n) => n + 1)}
                  style={getNoStyle()}
                  className="relative"
                >
                  <button className="bg-white/10 text-white/50 font-bold py-4 px-8 rounded-2xl border border-white/20 text-lg cursor-default">
                    {noEscapes > 3 ? "Stop trying 😂" : noEscapes > 0 ? "Nope! 😄" : "No..."}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ══ STAGE: accepted ═══════════════════════════════════════════════════ */}
          {stage === "accepted" && (
            <motion.div
              key="accepted"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, type: "spring", bounce: 0.5 }}
              className="relative z-10 flex flex-col items-center text-center px-6"
            >
              {/* Particle hearts burst on entering */}
              {[...Array(24)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: (Math.random() - 0.5) * 600,
                    y: (Math.random() - 0.5) * 500 - 100,
                    opacity: 0,
                    scale: 0.2,
                  }}
                  transition={{ duration: 1.5, delay: Math.random() * 0.5, ease: "easeOut" }}
                  className="absolute text-2xl pointer-events-none"
                  style={{ zIndex: 20 }}
                >
                  {["❤️","💖","💗","✨","🌸","💫","🎉"][i % 7]}
                </motion.div>
              ))}

              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mb-8"
              >
                <Heart className="w-28 h-28 text-rose-500 fill-rose-500 drop-shadow-[0_0_50px_rgba(244,63,94,0.9)]" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight"
              >
                She said<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400">
                  YES! 🎉
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-white/60 text-xl font-light mb-10"
              >
                This is the beginning of forever. 💕
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                <Link
                  href="/create?template=floating-memories"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-8 py-3 rounded-full transition-all text-sm"
                >
                  Create yours <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
