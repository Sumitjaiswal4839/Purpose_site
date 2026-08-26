"use client";

import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  HeartCrack, Volume2, VolumeX, Heart, Sparkles,
  ChevronDown, Clock, ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";

interface ProposalData {
  partnerName: string;
  yourName: string;
  question: string;
  mediaUrls?: string[];
  musicTrack: string;
  fontStyle?: string;
  filterType?: string;
  effectType?: string;
  customerEmail: string;
  currentViews: number;
  maxViews: number;
  expiresAt: string;
}

// Move YesNoButtons OUTSIDE component
function YesNoButtons({
  accepted,
  noCount,
  noOffset,
  handleYes,
  handleNoHover,
  noLabel,
}: {
  accepted: boolean;
  noCount: number;
  noOffset: { x: number; y: number };
  handleYes: () => void;
  handleNoHover: () => void;
  noLabel: string;
}) {
  return accepted ? (
    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
      <p className="text-4xl md:text-6xl font-black text-emerald-400 mb-4">IT&apos;S A YES! 💍💖</p>
      <p className="text-rose-200/70 text-xl italic mt-4">&quot;Pyaar karo, propose karo.&quot;</p>
    </motion.div>
  ) : (
    <div className="flex flex-wrap gap-5 justify-center items-center min-h-[100px] relative mt-6">
      <button
        onClick={handleYes}
        style={{ transform: `scale(${1 + noCount * 0.12})` }}
        className="bg-emerald-500 text-white px-14 py-5 rounded-full font-black text-2xl shadow-[0_20px_60px_rgba(16,185,129,0.4)] hover:scale-110 active:scale-95 transition-all z-40"
      >
        YES! 💍
      </button>
      <motion.button
        animate={{ x: noOffset.x, y: noOffset.y }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onMouseEnter={handleNoHover}
        onTouchStart={handleNoHover}
        onClick={noCount >= 5 ? handleYes : handleNoHover}
        className="bg-white/10 backdrop-blur-xl border border-white/20 text-white px-14 py-5 rounded-full font-black text-2xl hover:bg-white/20 transition-all cursor-pointer z-50"
      >
        {noLabel}
      </motion.button>
    </div>
  );
}

export default function SecretClientPage({
  proposalData: initialData,
  token,
}: {
  proposalData: ProposalData | null;
  token: string;
}) {
  const [loading, setLoading]         = useState(!initialData);
  const [allowed, setAllowed]         = useState(!!initialData);
  const [reason, setReason]           = useState("");
  const [proposalData, setProposalData] = useState<ProposalData | null>(initialData);
  const [isMuted, setIsMuted]         = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [timeLeft, setTimeLeft]       = useState("");
  const [accepted, setAccepted]       = useState(false);
  const [noCount, setNoCount]         = useState(0);
  const [noOffset, setNoOffset]       = useState({ x: 0, y: 0 });
  const [timelineRevealed, setTimelineRevealed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Issue #23 fix: store the interval ref so it can be cleared on unmount
  const expiryTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startExpiryTimer = useCallback((expiryDate: string) => {
    // Clear any previous interval before creating a new one
    if (expiryTimerRef.current) clearInterval(expiryTimerRef.current);

    expiryTimerRef.current = setInterval(() => {
      const distance = new Date(expiryDate).getTime() - Date.now();
      if (distance < 0) {
        if (expiryTimerRef.current) clearInterval(expiryTimerRef.current);
        setTimeLeft("EXPIRED");
        setAllowed(false);
        setReason("expired");
      } else {
        const d = Math.floor(distance / 86400000);
        const h = Math.floor((distance % 86400000) / 3600000);
        const m = Math.floor((distance % 3600000) / 60000);
        setTimeLeft(`${d}d ${h}h ${m}m`);
      }
    }, 1000);
  }, []);

  const verifyToken = useCallback(async () => {
    try {
      const res = await fetch("/api/links/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (data.allowed) {
        setProposalData(data.data);
        setAllowed(true);
        startExpiryTimer(data.data.expiresAt);
      } else {
        setAllowed(false);
        setReason(data.reason);
      }
    } catch {
      setAllowed(false);
      setReason("error");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Disable right-click + verify token on mount
  useEffect(() => {
    const prevent = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", prevent);

    if (!initialData) {
      verifyToken();
    } else {
      // Even with SSR data provided, still call verifyToken to enforce payment gate
      // and increment view counter. This fixes the SSR view-count bypass (Issue #19).
      verifyToken();
    }

    // Issue #23 fix: clean up the expiry timer interval on unmount
    return () => {
      document.removeEventListener("contextmenu", prevent);
      if (expiryTimerRef.current) clearInterval(expiryTimerRef.current);
    };
  }, [initialData, verifyToken]);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  };

  const startExperience = () => {
    setShowContent(true);
    audioRef.current?.play().catch(() => {});
  };

  const handleYes = () => {
    setAccepted(true);
    const end = Date.now() + 6000;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 200 };
    const rng = (min: number, max: number) => Math.random() * (max - min) + min;
    const interval = setInterval(() => {
      const tl = end - Date.now();
      if (tl <= 0) return clearInterval(interval);
      const count = 50 * (tl / 6000);
      confetti({ ...defaults, particleCount: count, origin: { x: rng(0.1, 0.3), y: Math.random() - 0.2 }, colors: ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#ff6bd6"] });
      confetti({ ...defaults, particleCount: count, origin: { x: rng(0.7, 0.9), y: Math.random() - 0.2 }, colors: ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#ff6bd6"] });
    }, 250);
  };

  const handleNoHover = () => {
    setNoOffset({ x: (Math.random() - 0.5) * 350, y: (Math.random() - 0.5) * 350 });
    setNoCount((c) => c + 1);
  };

  const noLabel = useMemo(() => 
    ["No 💔", "Are you sure? 🥺", "Think again! 😭", "Pleaaase? 🧸", "You can't say no! 😉", "Yes! ❤️"][Math.min(noCount, 5)],
    [noCount]
  );

  // Auto scroll logic when Chat Timeline gets revealed
  useEffect(() => {
    if (accepted) {
      const timer = setTimeout(() => {
        setTimelineRevealed(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [accepted]);

  // ── Loading ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-rose-950 flex flex-col items-center justify-center">
        <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <Heart className="w-16 h-16 text-rose-500 fill-current" />
        </motion.div>
        <p className="text-rose-200 text-[10px] font-black uppercase tracking-[0.3em] mt-6 animate-pulse">Decrypting Memory…</p>
      </div>
    );
  }

  // ── Blocked / Expired ─────────────────────────────────────────────
  if (!allowed) {
    const messages: Record<string, string> = {
      limit_reached: "This private link has reached its view limit. A beautiful secret is now locked forever.",
      expired:       "This memory has faded with time (Expired).",
      "not-verified": "This link is awaiting activation. Please contact the sender.",
      "not-found":   "Invalid or broken link token.",
      error:         "Connection issue. Please try again.",
    };
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white max-w-md w-full p-10 rounded-[3rem] shadow-2xl text-center border border-rose-100">
          <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <HeartCrack className="w-12 h-12 text-rose-500" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 mb-4 font-serif">Link Inactive 🔒</h1>
          <p className="text-slate-500 mb-8 leading-relaxed italic">
            {messages[reason] ?? "Something went wrong."}
          </p>
          <Link href="/" className="block bg-gray-900 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-black transition-all uppercase tracking-widest text-xs text-center">
            Create New Memory
          </Link>
        </motion.div>
      </div>
    );
  }

  const hasMedia = proposalData?.mediaUrls && proposalData.mediaUrls.length > 0;

  return (
    <div className={`min-h-screen bg-black overflow-x-hidden relative select-none ${proposalData?.fontStyle === "romantic" ? "font-serif italic" : proposalData?.fontStyle === "elegant" ? "font-serif" : "font-sans"}`}>
      {/* Screenshot/Recording protection Watermark */}
      <div className="fixed inset-0 pointer-events-none z-[999] opacity-[0.03] select-none flex flex-wrap gap-12 p-8 overflow-hidden font-mono text-[9px] uppercase tracking-widest text-white">
        {Array.from({ length: 48 }).map((_, i) => (
          <span key={i} className="rotate-12 transform">
            {proposalData?.partnerName} ♡ {proposalData?.yourName}
          </span>
        ))}
      </div>

      <audio ref={audioRef} loop src={proposalData?.musicTrack} />

      <AnimatePresence>
        {/* ── Intro splash ─────────────────────────────────────────────── */}
        {!showContent && (
          <motion.div key="intro" exit={{ opacity: 0, scale: 1.1 }} className="fixed inset-0 z-50 bg-rose-950 flex flex-col items-center justify-center p-8 text-center overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-md">
              <div className="w-24 h-24 bg-gradient-to-br from-rose-500 to-pink-600 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-[0_20px_50px_rgba(225,29,72,0.5)] rotate-12">
                <Heart className="w-10 h-10 text-white fill-current" />
              </div>
              <p className="text-rose-300/60 font-black uppercase tracking-[0.4em] text-[10px] mb-4">A Private Experience for {proposalData?.partnerName}</p>
              <h1 className="text-5xl md:text-6xl font-black text-white mb-12 italic tracking-tighter leading-[0.9]">Unlock Your<br />Surprise</h1>
              <button onClick={startExperience} className="bg-white text-rose-950 px-12 py-6 rounded-full font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 mx-auto group">
                Tap to Reveal 💌 <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-all" />
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* ── Main experience ───────────────────────────────────────────── */}
        {showContent && proposalData && (
          <motion.div key="experience" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative h-screen">
            {/* HUD top bar */}
            <div className="fixed top-0 left-0 w-full p-6 z-[100] flex justify-between items-start pointer-events-none">
              <div className="space-y-2">
                <div className="bg-white/10 backdrop-blur-3xl px-5 py-2.5 rounded-2xl border border-white/20 flex items-center gap-2.5 pointer-events-auto">
                  <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Memory Active</span>
                </div>
                {timeLeft && (
                  <div className="bg-black/40 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/5 flex items-center gap-2 pointer-events-auto">
                    <Clock className="w-3 h-3 text-rose-400" />
                    <span className="text-[9px] font-black uppercase text-rose-200">{timeLeft}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-3 pointer-events-auto">
                <div className="bg-white/5 backdrop-blur-3xl px-4 py-2.5 rounded-2xl border border-white/10 flex items-center gap-2">
                  <ShieldAlert className="w-3 h-3 text-rose-400" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Protected</span>
                </div>
                <button onClick={toggleMute} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all">
                  {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
                </button>
              </div>
            </div>

            {/* Bottom Watermark */}
            <div className="fixed bottom-8 left-8 z-[100] opacity-30 flex items-center gap-2 pointer-events-none">
              <div className="w-5 h-5 bg-white/10 rounded-lg flex items-center justify-center"><Heart className="w-3 h-3 text-white" /></div>
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/60">Made via Purpose 🏹</span>
            </div>

            {/* ── Snap-scroll slides / Stages ─────────────────────────────── */}
            <div className="snap-y snap-mandatory h-screen overflow-y-scroll custom-scrollbar scroll-smooth">
              {!hasMedia ? (
                <div className="snap-start h-screen w-full relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-rose-950 via-black to-purple-950">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(225,29,72,0.2)_0%,_transparent_70%)]" />
                  <div className="relative z-30 flex flex-col items-center p-12 text-center max-w-2xl">
                    <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                      <Heart className="w-24 h-24 text-rose-500 fill-current mb-10 drop-shadow-[0_0_40px_rgba(244,63,94,0.6)]" />
                    </motion.div>
                    <h2 className="text-6xl md:text-8xl font-black mb-6 italic tracking-tighter text-white">Hi {proposalData.partnerName}</h2>
                    <p className="text-rose-200/70 text-xl font-medium italic mb-10">A special message from {proposalData.yourName} ❤️</p>
                    <h3 className="text-3xl md:text-5xl font-black mb-8 tracking-tighter drop-shadow-2xl text-white">{proposalData.question}</h3>
                    <YesNoButtons
                      accepted={accepted}
                      noCount={noCount}
                      noOffset={noOffset}
                      handleYes={handleYes}
                      handleNoHover={handleNoHover}
                      noLabel={noLabel}
                    />
                  </div>
                </div>
              ) : (
                (proposalData.mediaUrls || []).map((url: string, i: number) => {
                  const isStage1 = i === 1;
                  const isStage2 = i === 2;

                  return (
                    <div key={i} className="snap-start h-screen w-full relative flex items-center justify-center overflow-hidden">
                      <Image 
                        src={url} 
                        alt={`Memory ${i}`} 
                        fill
                        className="absolute inset-0 w-full h-full object-cover scale-110" 
                        style={{ filter: proposalData.filterType || "" }}
                      />
                      {proposalData.effectType === "hearts" && <div className="absolute inset-0 z-20 pointer-events-none opacity-40 bg-[url('https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif')] bg-cover mix-blend-screen scale-125" />}
                      {proposalData.effectType === "petals" && <div className="absolute inset-0 z-20 pointer-events-none opacity-30 bg-[url('https://media.giphy.com/media/l41lTfJvP2uX7O5tC/giphy.gif')] bg-cover mix-blend-screen scale-150" />}
                      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-gradient-to-t from-black/90 via-transparent to-black/60 p-12 text-center">
                        {i === 0 && (
                          <motion.div initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 1 }}>
                            <h2 className="text-7xl md:text-9xl font-black mb-8 drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] tracking-tighter italic text-white">Hi {proposalData.partnerName}</h2>
                            <p className="text-xl md:text-2xl text-rose-200/80 font-medium italic">A message from {proposalData.yourName} ❤️</p>
                            <div className="mt-8 bg-white/10 px-6 py-2 rounded-full border border-white/20 inline-block text-xs font-semibold tracking-wider text-rose-200">
                              Stage 1: The Memory Beginning ✨
                            </div>
                          </motion.div>
                        )}

                        {isStage1 && (
                          <div className="max-w-md bg-black/60 border border-pink-500/30 p-8 rounded-3xl backdrop-blur-md">
                            <Sparkles className="w-10 h-10 text-pink-400 mx-auto mb-4 animate-spin" />
                            <h3 className="text-xl font-bold text-white mb-2">Stage 2: Surprise Unlocked! 🧸</h3>
                            <p className="text-sm text-gray-300">
                              &quot;Har ek pal tumhare saath ek nayi story hai. Humne jo time sath bitaya hai, wo mere life ka sabse precious gift hai.&quot;
                            </p>
                          </div>
                        )}

                        {isStage2 && (
                          <div className="max-w-md bg-black/60 border border-purple-500/30 p-8 rounded-3xl backdrop-blur-md">
                            <Heart className="w-10 h-10 text-rose-500 fill-current mx-auto mb-4 animate-bounce" />
                            <h3 className="text-xl font-bold text-white mb-2">Stage 3: Secret Message 💌</h3>
                            <p className="text-sm text-gray-300 italic">
                              &quot;Main tumse dur hokar bhi hamesha tumhare kareeb rehta hoon. Yeh link sirf ek medium hai mere dil ki baat batane ka.&quot;
                            </p>
                          </div>
                        )}

                        {i === (proposalData.mediaUrls?.length ?? 0) - 1 && (
                          <motion.div initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} className="max-w-3xl mx-auto w-full px-4 z-40">
                            {accepted ? (
                              <div className="text-center w-full max-h-[85vh] overflow-y-auto pr-2 custom-scrollbar">
                                <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_80px_rgba(244,63,94,0.8)] animate-pulse">
                                  <Heart className="w-10 h-10 fill-current text-white animate-bounce" />
                                </div>
                                <h2 className="text-4xl md:text-7xl font-black mb-4 leading-[0.85] tracking-tighter text-white drop-shadow-2xl">IT&apos;S A YES! 💍💖</h2>
                                <p className="text-xl text-rose-200/90 font-serif italic mb-6">&quot;I love you, now and forever. Pyaar karo, propose karo.&quot;</p>
                                
                                {timelineRevealed && (
                                  <motion.div 
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-zinc-950/90 border border-zinc-800 p-6 rounded-[2.5rem] text-left max-w-lg mx-auto mb-8 shadow-2xl"
                                  >
                                    <div className="flex items-center gap-3 border-b border-zinc-800 pb-3 mb-4">
                                      <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-lg">W</div>
                                      <div>
                                        <h4 className="text-sm font-bold text-white">Our Timeline Feed 💬</h4>
                                        <p className="text-[10px] text-zinc-500">Chronological exported memories</p>
                                      </div>
                                    </div>
                                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar text-xs font-sans">
                                      <div className="bg-zinc-900 border border-zinc-800/40 p-3 rounded-2xl max-w-[85%]">
                                        <p className="text-zinc-400 font-bold mb-1">{proposalData.yourName}:</p>
                                        <p className="text-zinc-200">First time I saw you. Best day of my life.</p>
                                        <span className="text-[8px] text-zinc-500 block text-right mt-1">11:11 AM</span>
                                      </div>
                                      <div className="bg-emerald-900/40 border border-emerald-800/40 p-3 rounded-2xl max-w-[85%] ml-auto">
                                        <p className="text-emerald-400 font-bold mb-1">{proposalData.partnerName}:</p>
                                        <p className="text-zinc-200">Everything changed when our paths crossed. ❤️</p>
                                        <span className="text-[8px] text-emerald-600 block text-right mt-1">11:12 AM</span>
                                      </div>
                                      <div className="bg-zinc-900 border border-zinc-800/40 p-3 rounded-2xl max-w-[85%]">
                                        <p className="text-zinc-400 font-bold mb-1">{proposalData.yourName}:</p>
                                        <p className="text-zinc-200">I promise to stand by your side. Forever.</p>
                                        <span className="text-[8px] text-zinc-500 block text-right mt-1">11:15 AM</span>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}

                                <button onClick={() => window.open(`mailto:${proposalData.customerEmail}?subject=I SAID YES! 💍&body=I opened your secret link and I said YES! 💖`, "_blank")} className="bg-emerald-500 text-white px-10 py-4 rounded-full font-black text-lg shadow-lg hover:scale-105 transition-all">
                                  Send Email Response ✉️
                                </button>
                              </div>
                            ) : (
                              <div>
                                <div className="w-24 h-24 bg-rose-600 rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_0_80px_rgba(225,29,72,0.6)] animate-pulse">
                                  <Heart className="w-12 h-12 fill-current text-white" />
                                </div>
                                <h2 className="text-5xl md:text-7xl font-black mb-10 leading-[0.9] tracking-tighter drop-shadow-2xl text-white">{proposalData.question}</h2>
                                <YesNoButtons
                                  accepted={accepted}
                                  noCount={noCount}
                                  noOffset={noOffset}
                                  handleYes={handleYes}
                                  handleNoHover={handleNoHover}
                                  noLabel={noLabel}
                                />
                              </div>
                            )}
                          </motion.div>
                        )}
                        {i < (proposalData.mediaUrls?.length ?? 0) - 1 && (
                          <div className="absolute bottom-12 flex flex-col items-center gap-3 opacity-40">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Swipe Up</span>
                            <ChevronDown className="w-6 h-6 animate-bounce text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* View counter */}
            <div className="fixed bottom-8 right-8 z-[100] pointer-events-none">
              <div className="bg-black/60 backdrop-blur-2xl p-5 rounded-[2rem] border border-white/10 flex items-center gap-5 pointer-events-auto">
                <div className="relative w-14 h-14">
                  <svg className="w-full h-full rotate-[-90deg]">
                    <circle cx="28" cy="28" r="24" fill="none" stroke="currentColor" strokeWidth="3" className="text-white/10" />
                    <circle cx="28" cy="28" r="24" fill="none" stroke="currentColor" strokeWidth="3" className="text-rose-500" strokeDasharray={150} strokeDashoffset={150 - 150 * (proposalData.currentViews / proposalData.maxViews)} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white">
                    {proposalData.currentViews}/{proposalData.maxViews}
                  </div>
                </div>
                <div className="pr-2">
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-0.5">Protection</p>
                  <p className="text-xs font-bold text-white uppercase">{proposalData.currentViews >= proposalData.maxViews ? "Final Reveal" : "Link Secure"}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}