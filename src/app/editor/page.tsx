"use client";

import React, { useState, useRef, useEffect, useCallback, useReducer } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, Scan, Check, AlertCircle, X, Heart, ChevronDown, Trash2 } from "lucide-react";

// ============================================================
// PROJECT SCHEMA
// ============================================================
const DEFAULT_PROJECT = {
  id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36),
  title: "My Proposal",
  version: "2.0",
  createdAt: Date.now(),
  updatedAt: Date.now(),
  canvas: { width: 1080, height: 1920, background: "#1a0a2e" },
  layers: [],
  timeline: { duration: 30, fps: 30, currentTime: 0, tracks: [] },
  audio: { tracks: [], masterVolume: 0.8 },
  settings: { quality: "4k", theme: "romantic", autoSave: true },
  metadata: { tags: [], description: "" },
};

// ============================================================
// FEATURE REGISTRY
// ============================================================
const FEATURE_REGISTRY: Record<string, any> = {
  "Visual Filters": { icon: "🎨", color: "#c850c0", features: ["Vintage", "Cyberpunk", "Cinematic", "B&W", "Sepia", "Neon Glow", "Warm Tone", "Cool Tone", "Fade", "Dream"] },
  "Text Engine": { icon: "✍️", color: "#4facfe", features: ["3D Text", "Glow Effect", "Curved Text", "Shadow Text", "Outlined", "Gradient Fill", "Script Font", "Bold Impact", "Elegant Serif", "Handwritten"] },
  "Animations": { icon: "⚡", color: "#f093fb", features: ["Typewriter", "Bounce In", "Fade Up", "Scramble", "Glitch", "Zoom In", "Slide Left", "Rotate In", "Elastic", "Wave"] },
  "Transitions": { icon: "🔀", color: "#43e97b", features: ["Cross Dissolve", "Heart Wipe", "Page Flip", "Zoom Blur", "Glitch Slide", "Iris Open", "Swipe Right", "Pixel Burst", "Morph", "Ripple"] },
  "Dynamic Overlays": { icon: "✨", color: "#fa709a", features: ["Heart Rain", "Snowfall", "Bokeh", "Lens Flare", "Film Grain", "Light Leak", "Dust Particles", "Fireflies", "Rain Drops", "Stars"] },
  "Audio Engine": { icon: "🎵", color: "#a18cd1", features: ["Waveform Viz", "Fade In/Out", "Beat Sync", "Voiceover Dim", "Equalizer", "Reverb", "Echo", "Pitch Shift", "Bass Boost", "Stereo Pan"] },
  "Stickers": { icon: "💫", color: "#ffecd2", features: ["Animated Hearts", "Cute Animals", "Rings", "Flowers", "Stars", "Emojis", "Confetti", "Ribbons", "Crowns", "Wings"] },
  "Frames": { icon: "🖼️", color: "#fd79a8", features: ["Polaroid", "Film Strip", "Neon Frame", "Doodle Border", "Rose Gold", "Vintage Film", "Heart Frame", "Flower Border", "Minimal Line", "Ornate Gold"] },
  "Backgrounds": { icon: "🌌", color: "#6c5ce7", features: ["Parallax", "Gradient Gen", "Video BG", "Animated Mesh", "Bokeh BG", "Aurora", "Galaxy", "Underwater", "Petals", "Confetti Rain"] },
  "AI Tools": { icon: "🤖", color: "#00cec9", features: ["Auto Caption", "Poem Generator", "Smart Crop", "Style Transfer", "Color Match", "Face Enhance", "BG Remover", "Voice Clone", "Music Gen", "Script Writer"] },
  "Particles": { icon: "💥", color: "#e17055", features: ["Heart Burst", "Fireworks", "Sparkle Trail", "Confetti Pop", "Star Shower", "Bubble Float", "Petal Fall", "Lightning", "Smoke", "Glitter"] },
};

// ============================================================
// EDITOR STORE
// ============================================================
function editorReducer(state: any, action: any) {
  switch (action.type) {
    case "ADD_LAYER":
      return { ...state, layers: [...state.layers, { id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36), ...action.payload, createdAt: Date.now() }] };
    case "REMOVE_LAYER":
      return { ...state, layers: state.layers.filter((l: any) => l.id !== action.id) };
    case "SELECT_LAYER":
      return { ...state, selectedLayerId: action.id };
    case "UPDATE_FILTER":
      return { ...state, activeFilter: action.filter };
    case "SET_TIME":
      return { ...state, timeline: { ...state.timeline, currentTime: action.time } };
    case "TOGGLE_PLAY":
      return { ...state, isPlaying: !state.isPlaying };
    case "SET_CATEGORY":
      return { ...state, activeCategory: action.category };
    case "SET_VOLUME":
      return { ...state, volume: action.volume };
    case "UNDO":
      if (state.history.length === 0) return state;
      const prev = state.history[state.history.length - 1];
      return { ...prev, future: [state, ...state.future], history: state.history.slice(0, -1) };
    case "REDO":
      if (state.future.length === 0) return state;
      const next = state.future[0];
      return { ...next, history: [...state.history, state], future: state.future.slice(1) };
    default:
      return state;
  }
}

const INITIAL_STATE = {
  project: DEFAULT_PROJECT,
  layers: [
    { id: "l1", type: "text", content: "Will You Marry Me?", x: 50, y: 25, fontSize: 42, color: "#fff", font: "serif", filter: null },
    { id: "l2", type: "shape", shape: "heart", x: 50, y: 52, size: 80, color: "#ff6b9d" },
    { id: "l3", type: "text", content: "You are my everything ❤️", x: 50, y: 72, fontSize: 18, color: "#ffecd2", font: "script" },
  ],
  selectedLayerId: null,
  activeCategory: "Visual Filters",
  activeFilter: "Cinematic",
  isPlaying: false,
  timeline: { currentTime: 0, duration: 30 },
  volume: 0.8,
  history: [],
  future: [],
  autoSaveStatus: "saved",
};

// ============================================================
// CANVAS COMPONENT
// ============================================================
function Canvas({ layers, selectedLayerId, activeFilter, onSelectLayer }: any) {
  const canvasRef = useRef<any>(null);
  const animFrameRef = useRef<any>(null);
  const [particles, setParticles] = useState<any[]>([]);
  const [time, setTime] = useState(0);
  const [canvasSize, setCanvasSize] = useState(0);

  // Measure canvas width to scale font sizes proportionally
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      setCanvasSize(entries[0].contentRect.width);
    });
    ro.observe(el);
    setCanvasSize(el.offsetWidth);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let t = 0;
    function loop() {
      t += 0.016;
      setTime(t);
      animFrameRef.current = requestAnimationFrame(loop);
    }
    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  const filterStyles: Record<string, any> = {
    Cinematic: { filter: "contrast(1.1) brightness(0.9) saturate(0.85)" },
    Vintage: { filter: "sepia(0.5) contrast(1.1) brightness(1.05)" },
    Cyberpunk: { filter: "hue-rotate(30deg) saturate(2) contrast(1.2)" },
    "B&W": { filter: "grayscale(1) contrast(1.2)" },
    Sepia: { filter: "sepia(0.8)" },
    "Neon Glow": { filter: "saturate(2) brightness(1.1) contrast(1.1)" },
    "Warm Tone": { filter: "sepia(0.3) saturate(1.4) brightness(1.05)" },
    "Cool Tone": { filter: "hue-rotate(180deg) saturate(0.8) brightness(1.05)" },
    Fade: { filter: "brightness(1.3) saturate(0.6) contrast(0.9)" },
    Dream: { filter: "brightness(1.2) saturate(1.3) blur(0px)" },
  };

  const fStyle = filterStyles[activeFilter] || {};

  // Scale factor: canvas is designed at 360px wide reference
  const scale = canvasSize > 0 ? canvasSize / 360 : 1;

  function addParticle(e: any) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(),
      x, y,
      vx: (Math.random() - 0.5) * 3,
      vy: -Math.random() * 4 - 1,
      life: 1,
      size: Math.random() * 12 + 6,
      emoji: ["❤️", "💕", "✨", "💗", "🌸"][Math.floor(Math.random() * 5)],
    }));
    setParticles((p) => [...p, ...newParticles]);
    setTimeout(() => setParticles((p) => p.filter((x: any) => !newParticles.find((n: any) => n.id === x.id))), 2000);
  }

  return (
    <div
      ref={canvasRef}
      onClick={addParticle}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "9/16",
        background: "linear-gradient(135deg, #1a0a2e 0%, #16213e 50%, #0f3460 100%)",
        borderRadius: 12,
        overflow: "hidden",
        cursor: "crosshair",
        boxShadow: "0 0 0 1px rgba(200,80,192,0.3), 0 20px 60px rgba(0,0,0,0.6)",
        ...fStyle,
      }}
    >
      {/* Starfield */}
      {Array.from({ length: 20 }, (_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 2,
            height: 2,
            background: "#fff",
            borderRadius: "50%",
            left: `${(i * 17 + 3) % 100}%`,
            top: `${(i * 23 + 7) % 100}%`,
            opacity: 0.3 + Math.sin(time + i) * 0.3,
            transition: "opacity 0.1s",
          }}
        />
      ))}

      {/* Layers */}
      {layers.map((layer: any) => (
        <div
          key={layer.id}
          onClick={(e) => { e.stopPropagation(); onSelectLayer(layer.id); }}
          style={{
            position: "absolute",
            // Clamp x so layer never goes outside canvas bounds (5%–95%)
            left: `clamp(5%, ${layer.x}%, 95%)`,
            top: `clamp(2%, ${layer.y}%, 96%)`,
            // Use translate(-50%) only for centering — but clamp prevents edge bleed
            transform: "translateX(-50%)",
            // Hard limit width so text wraps inside canvas
            maxWidth: "88%",
            width: "max-content",
            cursor: "pointer",
            outline: selectedLayerId === layer.id ? "2px dashed #c850c0" : "none",
            outlineOffset: 4,
            borderRadius: 4,
            userSelect: "none",
          }}
        >
          {layer.type === "text" && (
            <div style={{
              fontSize: Math.max(10, layer.fontSize * scale),
              color: layer.color,
              fontFamily: "Georgia, serif",
              fontWeight: layer.font === "script" ? 400 : 700,
              textShadow: "0 2px 20px rgba(0,0,0,0.8)",
              whiteSpace: "normal",
              wordBreak: "break-word",
              overflowWrap: "break-word",
              textAlign: "center",
              lineHeight: 1.25,
              // Ensure text never bleeds outside
              maxWidth: `${Math.floor(canvasSize * 0.88)}px`,
            }}>
              {layer.content}
            </div>
          )}
          {layer.type === "shape" && layer.shape === "heart" && (
            <div style={{ fontSize: Math.max(20, layer.size * scale), lineHeight: 1 }}>❤️</div>
          )}
        </div>
      ))}

      {/* Particles */}
      {particles.map((p: any) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: p.size,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  );
}

// ============================================================
// TIMELINE COMPONENT
// ============================================================
function Timeline({ currentTime, duration, isPlaying, onTimeChange, onTogglePlay }: any) {
  const tracks = [
    { id: 1, label: "❤️ Main Title", color: "#c850c0", start: 0, end: 8 },
    { id: 2, label: "📷 Photo 1", color: "#4facfe", start: 2, end: 12 },
    { id: 3, label: "🎵 Music", color: "#43e97b", start: 0, end: 30 },
  ];

  const progress = (currentTime / duration) * 100;

  return (
    <div style={{ background: "#0d0d1a", borderTop: "1px solid #2a1a4e", padding: "8px 12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <button onClick={onTogglePlay} style={{ background: "#c850c0", border: "none", borderRadius: "50%", width: 28, height: 28, color: "#fff", cursor: "pointer", fontSize: 12 }}>
          {isPlaying ? "⏸" : "▶"}
        </button>
        <span style={{ color: "#888", fontSize: 11, fontFamily: "monospace" }}>{currentTime.toFixed(1)}s / {duration}s</span>
        <div style={{ flex: 1, background: "#1a0a2e", borderRadius: 4, height: 4, position: "relative", cursor: "pointer" }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const t = ((e.clientX - rect.left) / rect.width) * duration;
            onTimeChange(Math.max(0, Math.min(duration, t)));
          }}
        >
          <div style={{ width: `${progress}%`, height: "100%", background: "#c850c0", borderRadius: 4 }} />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// FEATURE PANEL
// ============================================================
function FeaturePanel({ activeCategory, activeFilter, onFilterChange, onAddLayer }: any) {
  const category = FEATURE_REGISTRY[activeCategory];
  if (!category) return null;

  return (
    <div style={{ padding: 12, height: "100%", overflowY: "auto" }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#ffecd2", marginBottom: 10 }}>
        {category.icon} {activeCategory}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        {category.features.map((feat: any) => (
          <button
            key={feat}
            onClick={() => {
              if (activeCategory === "Visual Filters") onFilterChange(feat);
              if (activeCategory === "Text Engine") onAddLayer({ type: "text", content: feat, x: 50, y: 50, fontSize: 24, color: category.color, font: "serif" });
              if (activeCategory === "Particles") onAddLayer({ type: "shape", shape: "heart", x: Math.random() * 80 + 10, y: Math.random() * 80 + 10, size: 40, color: category.color });
            }}
            style={{
              background: activeFilter === feat ? category.color : "rgba(255,255,255,0.07)",
              border: activeFilter === feat ? `1px solid ${category.color}` : "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              color: activeFilter === feat ? "#fff" : "#ccc",
              fontSize: 11,
              padding: "6px 8px",
              cursor: "pointer",
            }}
          >
            {feat}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// LAYERS PANEL & PROPERTIES
// ============================================================
function LayersPanel({ layers, selectedLayerId, onSelect, onRemove }: any) {
  return (
    <div style={{ padding: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#888", marginBottom: 8, textTransform: "uppercase" }}>Layers</div>
      {[...layers].reverse().map((layer: any) => (
        <div key={layer.id} onClick={() => onSelect(layer.id)} style={{ display: "flex", gap: 8, padding: "6px 8px", background: selectedLayerId === layer.id ? "rgba(200,80,192,0.2)" : "transparent", cursor: "pointer" }}>
          <span>{layer.type === "text" ? "✍️" : "❤️"}</span>
          <span style={{ fontSize: 11 }}>{layer.type === "text" ? layer.content : layer.shape}</span>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================
export default function EditorPage() {
  const [state, dispatch] = useReducer(editorReducer, INITIAL_STATE);

  // Payment & Preview States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'error'>('pending');
  const [paymentError, setPaymentError] = useState("");
  const [generatedToken, setGeneratedToken] = useState("");

  // ── Hydration-safe mount guard ────────────────────────────────────────────
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [formData, setFormData] = useState({
    partnerName: "Partner",
    yourName: "You",
    customerEmail: "email@example.com",
    question: "Will you marry me?",
  });

  const handleFinalize = () => setShowLivePreview(true);

  const handlePayNow = async () => {
    if (!formData.customerEmail || formData.customerEmail === "email@example.com") {
      setPaymentError("Please enter a valid email before paying.");
      setPaymentStatus('error');
      return;
    }
    setPaymentStatus('processing');
    setPaymentError("");
    try {
      // Step 1 — Save proposal to DB
      const saveRes = await fetch("/api/proposals/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          yourName: formData.yourName,
          partnerName: formData.partnerName,
          customerEmail: formData.customerEmail,
          question: formData.question,
          mediaUrls: [],
          musicTrack: state.activeFilter,
          effectType: "hearts",
          filterType: state.activeFilter,
          fontStyle: "elegant",
        }),
      });
      const saveData = await saveRes.json();
      if (!saveRes.ok || !saveData.success) {
        setPaymentError(saveData.error || "Failed to save proposal.");
        setPaymentStatus('error');
        return;
      }

      // Step 2 — Log payment order (non-blocking notify)
      await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 99,
          planType: "premium",
          customerName: formData.yourName,
          customerEmail: formData.customerEmail,
          partnerName: formData.partnerName,
          transactionId: saveData.proposal?.transactionId,
          proposalId: saveData.proposal?.id,
        }),
      }).catch(() => {/* silent */});

      setGeneratedToken(saveData.proposal?.token || "");
      setPaymentStatus('success');
    } catch (err: any) {
      setPaymentError(err.message || "Connection error. Please try again.");
      setPaymentStatus('error');
    }
  };

  // Prevent SSR hydration mismatch for crypto.randomUUID usage
  if (!mounted) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#0a0a18", color: "#fff", fontFamily: "system-ui, sans-serif", overflow: "hidden" }}>
      {/* TOP BAR */}
      <div style={{ display: "flex", alignItems: "center", padding: "0 12px", height: 48, background: "#12122a", borderBottom: "1px solid #2a1a4e", gap: 8, flexShrink: 0 }}>
        <div style={{ fontSize: 15, background: "linear-gradient(90deg, #c850c0, #4facfe)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700, whiteSpace: "nowrap" }}>
          💍 ProposalEditor
        </div>
        <div style={{ flex: 1 }} />
        <button style={{ background: "linear-gradient(90deg, #c850c0, #4facfe)", border: "none", borderRadius: 8, color: "#fff", padding: "6px 14px", cursor: "pointer", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }} onClick={handleFinalize}>
          Finalize & Share 💝
        </button>
      </div>

      {/* MAIN EDITOR LAYOUT */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>

        {/* LEFT SIDEBAR - Categories (hidden on mobile) */}
        <div className="hidden sm:flex" style={{ width: 52, background: "#12122a", borderRight: "1px solid #2a1a4e", overflowY: "auto", flexDirection: "column", alignItems: "center", padding: "8px 0", gap: 2, flexShrink: 0 }}>
          {Object.keys(FEATURE_REGISTRY).map((cat: string) => (
            <button key={cat} onClick={() => dispatch({ type: "SET_CATEGORY", category: cat })} title={cat} style={{ width: 38, height: 38, borderRadius: 8, border: state.activeCategory === cat ? `2px solid ${FEATURE_REGISTRY[cat].color}` : "2px solid transparent", background: state.activeCategory === cat ? `${FEATURE_REGISTRY[cat].color}22` : "transparent", fontSize: 16, cursor: "pointer", flexShrink: 0 }}>
              {FEATURE_REGISTRY[cat].icon}
            </button>
          ))}
        </div>

        {/* FEATURE PANEL (hidden on mobile) */}
        <div className="hidden md:block" style={{ width: 180, background: "#0f0f22", borderRight: "1px solid #2a1a4e", flexShrink: 0, overflowY: "auto" }}>
          <FeaturePanel activeCategory={state.activeCategory} activeFilter={state.activeFilter} onFilterChange={(f: any) => dispatch({ type: "UPDATE_FILTER", filter: f })} onAddLayer={(payload: any) => dispatch({ type: "ADD_LAYER", payload })} />
        </div>

        {/* CANVAS AREA — fills all remaining space, canvas centered and height-constrained */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#080816", padding: "12px", overflow: "hidden", minWidth: 0 }}>
          {/* 
            Canvas wrapper: constrain by height so the 9:16 canvas never overflows vertically.
            max-height = 100% of parent, width = auto from aspect-ratio.
          */}
          <div style={{
            height: "100%",
            maxHeight: "100%",
            aspectRatio: "9/16",
            maxWidth: "100%",
            display: "flex",
            alignItems: "stretch",
          }}>
            <Canvas
              layers={state.layers}
              selectedLayerId={state.selectedLayerId}
              activeFilter={state.activeFilter}
              onSelectLayer={(id: any) => dispatch({ type: "SELECT_LAYER", id })}
            />
          </div>
        </div>

        {/* RIGHT SIDEBAR — Layers (hidden on mobile) */}
        <div className="hidden sm:block" style={{ width: 200, background: "#0f0f22", borderLeft: "1px solid #2a1a4e", flexShrink: 0, overflowY: "auto" }}>
          <LayersPanel layers={state.layers} selectedLayerId={state.selectedLayerId} onSelect={(id: any) => dispatch({ type: "SELECT_LAYER", id })} onRemove={(id: any) => dispatch({ type: "REMOVE_LAYER", id })} />
        </div>
      </div>

      {/* TIMELINE */}
      <div style={{ flexShrink: 0 }}>
        <Timeline currentTime={state.timeline.currentTime} duration={state.timeline.duration} isPlaying={state.isPlaying} onTimeChange={(t: any) => dispatch({ type: "SET_TIME", time: t })} onTogglePlay={() => dispatch({ type: "TOGGLE_PLAY" })} />
      </div>

      {/* MOBILE BOTTOM TOOLBAR — visible only on small screens */}
      <div className="flex sm:hidden" style={{ background: "#12122a", borderTop: "1px solid #2a1a4e", padding: "8px 12px", gap: 6, overflowX: "auto", flexShrink: 0 }}>
        {Object.keys(FEATURE_REGISTRY).map((cat: string) => (
          <button
            key={cat}
            onClick={() => dispatch({ type: "SET_CATEGORY", category: cat })}
            title={cat}
            style={{
              minWidth: 40, height: 40, borderRadius: 8, flexShrink: 0,
              border: state.activeCategory === cat ? `2px solid ${FEATURE_REGISTRY[cat].color}` : "2px solid transparent",
              background: state.activeCategory === cat ? `${FEATURE_REGISTRY[cat].color}22` : "rgba(255,255,255,0.05)",
              fontSize: 18, cursor: "pointer",
            }}
          >
            {FEATURE_REGISTRY[cat].icon}
          </button>
        ))}
      </div>

      {/* LIVE PREVIEW & PAYMENT OVERLAY */}
      <AnimatePresence>
         {showLivePreview && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black overflow-hidden flex flex-col">
             
             <div className="absolute top-8 left-8 right-8 z-[210] flex justify-between items-center text-white">
                <div className="bg-white/10 backdrop-blur-3xl px-6 py-2.5 rounded-full border border-white/20 flex items-center gap-3">
                   <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                   <span className="text-[10px] font-black uppercase tracking-[0.3em]">Live Render Mode</span>
                </div>
                <button onClick={() => setShowLivePreview(false)} className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center font-black hover:scale-110 transition-all shadow-2xl shadow-white/20"><X className="w-6 h-6" /></button>
             </div>

             <div className="flex-1 bg-rose-950 flex flex-col items-center justify-center p-8 text-center text-white font-serif">
                <div className="w-full h-full relative snap-y snap-mandatory overflow-y-scroll overflow-x-hidden scroll-smooth">
                    {/* Slide 1 */}
                    <div className="snap-start h-screen w-full relative flex flex-col items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-rose-900 to-black opacity-80" />
                        <div className="relative z-30 flex flex-col items-center p-12">
                            <motion.div initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 1 }}>
                                <h1 className="text-6xl md:text-9xl font-black mb-8 italic tracking-tighter drop-shadow-2xl">Hi {formData.partnerName}</h1>
                                <p className="text-xl md:text-2xl text-rose-200/80 font-medium italic">Wait till the end. Sending love from {formData.yourName} ❤️</p>
                            </motion.div>
                            <div className="mt-40 animate-bounce bg-white/10 p-5 rounded-full backdrop-blur-xl border border-white/20"><ChevronDown className="w-8 h-8 text-white/50" /></div>
                        </div>
                    </div>
                    {/* Slide 2 */}
                    <div className="snap-start h-screen w-full relative flex flex-col items-center justify-center overflow-hidden">
                        <div className="relative z-30 flex flex-col items-center p-12">
                            <motion.div initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} className="mt-20">
                                <div className="w-32 h-32 bg-rose-600 rounded-full flex items-center justify-center mx-auto mb-12 shadow-[0_0_80px_rgba(225,29,72,0.6)] animate-pulse">
                                  <Heart className="w-16 h-16 fill-current text-white" />
                                </div>
                                <h2 className="text-5xl md:text-8xl font-black mb-16 leading-[0.85] tracking-tighter drop-shadow-2xl">{formData.question}</h2>
                                <div className="flex flex-wrap gap-6 justify-center">
                                  <button className="bg-emerald-500 text-white px-16 py-6 rounded-full font-black text-2xl shadow-[0_20px_60px_rgba(16,185,129,0.4)]">YES! 💍</button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
             </div>

             <div className="fixed bottom-8 left-8 right-8 z-[210] pointer-events-none flex justify-between items-end">
                <div className="bg-black/60 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/10 flex items-center gap-6 pointer-events-auto">
                   <div>
                      <h5 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Preview Logic</h5>
                      <p className="text-xs font-bold text-white uppercase italic">Cinematic Verification</p>
                   </div>
                </div>
                <button onClick={() => { setShowLivePreview(false); setShowPaymentModal(true); }} className="bg-rose-600 px-10 py-5 rounded-full text-lg font-black uppercase tracking-widest text-white shadow-2xl pointer-events-auto hover:bg-rose-500">
                   Pay & Get Link
                </button>
             </div>
           </motion.div>
         )}
      </AnimatePresence>

      {/* PAYMENT MODAL */}
      <AnimatePresence>
          {showPaymentModal && (
            <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => (paymentStatus === 'pending' || paymentStatus === 'error') && setShowPaymentModal(false)} />
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-[3rem] p-4 md:p-10 max-w-4xl w-full relative z-[310] shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex flex-col border border-pink-100 max-h-[95vh] overflow-hidden">
                <button onClick={() => setShowPaymentModal(false)} className="absolute top-8 right-8 text-gray-300 hover:text-gray-600 z-50 p-2 hover:bg-gray-50 rounded-full transition-all"><Trash2 className="w-6 h-6" /></button>
                
                {paymentStatus === 'pending' && (
                  <div className="flex flex-col md:flex-row gap-10 overflow-y-auto pr-2 w-full mt-4 text-black">
                    <div className="flex-1 flex flex-col items-center text-center py-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-rose-100 rounded-[2rem] flex items-center justify-center text-pink-600 mb-6 flex-shrink-0 shadow-inner"><QrCode className="w-10 h-10" /></div>
                      <h3 className="text-3xl font-black text-gray-800 mb-2 font-serif">Unlock Link 💘</h3>
                      <p className="text-gray-500 text-sm mb-10 px-6 font-medium italic">Pay <span className="font-black text-gray-800">₹99</span> via any UPI app to activate your special memory forever.</p>
                      <div className="w-64 h-64 bg-white rounded-[2.5rem] p-6 border-2 border-dashed border-pink-200 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center group mb-8">
                         <QrCode className="w-32 h-32 text-gray-400" />
                         <span className="text-xs text-gray-500 mt-4">Scan using any UPI App</span>
                      </div>
                    </div>
                    <div className="hidden md:block w-px bg-gray-100 self-stretch my-20" />
                    <div className="flex-1 text-left flex flex-col py-6">
                      <div className="flex-1 space-y-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 border-b border-gray-50 pb-3">Your Details</p>
                        <input type="text" placeholder="Your Name" value={formData.yourName} onChange={e => setFormData(f => ({...f, yourName: e.target.value}))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400 transition-colors" />
                        <input type="text" placeholder="Partner's Name" value={formData.partnerName} onChange={e => setFormData(f => ({...f, partnerName: e.target.value}))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400 transition-colors" />
                        <input type="email" placeholder="Your Email (required)" value={formData.customerEmail === "email@example.com" ? "" : formData.customerEmail} onChange={e => setFormData(f => ({...f, customerEmail: e.target.value}))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400 transition-colors" />
                        <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl">
                          <p className="font-black text-rose-900 text-xs uppercase tracking-tighter mb-1">Step 2: Submit Verification</p>
                          <p className="text-rose-700 text-xs italic">"QR scan karke payment karne ke baad hi 'Payment Completed' press karein."</p>
                        </div>
                      </div>
                      <div className="space-y-3 mt-6">
                        <button onClick={handlePayNow} className="w-full bg-gray-900 text-white py-5 rounded-[1.5rem] font-black hover:bg-black shadow-[0_20px_40px_rgba(0,0,0,0.2)] active:scale-95 transition-all text-lg flex items-center justify-center gap-3">Payment Completed ✓</button>
                        <div className="flex items-center justify-center gap-3 text-[9px] text-gray-400 font-bold uppercase tracking-[0.3em] opacity-40"><span>Verified</span><span>•</span><span>Secure</span><span>•</span><span>Encrypted</span></div>
                      </div>
                    </div>
                  </div>
                )}

                {paymentStatus === 'processing' && (
                  <div className="py-24 flex flex-col items-center text-center grow justify-center text-black">
                    <div className="w-24 h-24 border-[6px] border-rose-50 border-t-rose-600 rounded-full animate-spin mb-10 shadow-inner" />
                    <h3 className="text-4xl font-black text-gray-800 mb-3 font-serif italic">Processing Verification...</h3>
                  </div>
                )}

                {paymentStatus === 'error' && (
                  <div className="py-20 flex flex-col items-center text-center grow justify-center text-black px-8">
                    <div className="w-20 h-20 bg-red-100 rounded-[2rem] flex items-center justify-center text-red-500 mb-8"><AlertCircle className="w-10 h-10" /></div>
                    <h3 className="text-3xl font-black text-gray-800 mb-3 font-serif">Something went wrong</h3>
                    <p className="text-red-500 font-medium mb-8 max-w-sm">{paymentError}</p>
                    <button onClick={() => setPaymentStatus('pending')} className="bg-gray-900 text-white px-10 py-4 rounded-full font-black hover:bg-black transition-all">Try Again</button>
                  </div>
                )}

                {paymentStatus === 'success' && (
                   <div className="py-16 flex flex-col items-center w-full text-center overflow-y-auto px-6 text-black">
                     <div className="w-24 h-24 bg-emerald-500 rounded-[2rem] flex items-center justify-center text-white mb-10 shadow-[0_20px_50px_rgba(16,185,129,0.4)] animate-bounce"><Check className="w-12 h-12 stroke-[4]" /></div>
                     <h3 className="text-5xl font-black text-gray-900 mb-4 font-serif italic">Your Link is Live! 🚀</h3>
                     <p className="text-gray-500 font-medium italic mb-10">Surprise is ready to be delivered. Share the secret link below.</p>
                     
                     <div className="w-full max-w-2xl bg-gray-50 border-2 border-dashed border-emerald-200 p-8 rounded-[2.5rem] mb-12">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4">Secret Memory Link</p>
                        <div className="bg-white p-4 rounded-2xl border border-emerald-100 flex items-center justify-between gap-4 shadow-inner">
                           <p className="text-sm font-mono font-bold text-gray-700 truncate">https://purpose.site/secret/{generatedToken}</p>
                           <button onClick={() => { navigator.clipboard.writeText(`https://purpose.site/secret/${generatedToken}`); alert("Link Copied! 💘"); }} className="bg-emerald-500 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg hover:bg-emerald-600 transition-all">Copy</button>
                        </div>
                     </div>
                     <button onClick={() => setShowPaymentModal(false)} className="bg-gray-950 text-white px-16 py-5 rounded-full font-black text-lg hover:scale-105 active:scale-95 shadow-2xl transition-all uppercase tracking-widest">Done</button>
                   </div>
                )}
              </motion.div>
            </div>
          )}
      </AnimatePresence>
    </div>
  );
}
