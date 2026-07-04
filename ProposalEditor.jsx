import { useState, useRef, useEffect, useCallback, useReducer } from "react";

// ============================================================
// PROJECT SCHEMA (TypeScript-style as JS constants)
// ============================================================
const DEFAULT_PROJECT = {
  id: crypto.randomUUID(),
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
// FEATURE REGISTRY - 30 Categories × 10 Features
// ============================================================
const FEATURE_REGISTRY = {
  "Visual Filters": {
    icon: "🎨",
    color: "#c850c0",
    features: ["Vintage", "Cyberpunk", "Cinematic", "B&W", "Sepia", "Neon Glow", "Warm Tone", "Cool Tone", "Fade", "Dream"],
  },
  "Text Engine": {
    icon: "✍️",
    color: "#4facfe",
    features: ["3D Text", "Glow Effect", "Curved Text", "Shadow Text", "Outlined", "Gradient Fill", "Script Font", "Bold Impact", "Elegant Serif", "Handwritten"],
  },
  "Animations": {
    icon: "⚡",
    color: "#f093fb",
    features: ["Typewriter", "Bounce In", "Fade Up", "Scramble", "Glitch", "Zoom In", "Slide Left", "Rotate In", "Elastic", "Wave"],
  },
  "Transitions": {
    icon: "🔀",
    color: "#43e97b",
    features: ["Cross Dissolve", "Heart Wipe", "Page Flip", "Zoom Blur", "Glitch Slide", "Iris Open", "Swipe Right", "Pixel Burst", "Morph", "Ripple"],
  },
  "Dynamic Overlays": {
    icon: "✨",
    color: "#fa709a",
    features: ["Heart Rain", "Snowfall", "Bokeh", "Lens Flare", "Film Grain", "Light Leak", "Dust Particles", "Fireflies", "Rain Drops", "Stars"],
  },
  "Audio Engine": {
    icon: "🎵",
    color: "#a18cd1",
    features: ["Waveform Viz", "Fade In/Out", "Beat Sync", "Voiceover Dim", "Equalizer", "Reverb", "Echo", "Pitch Shift", "Bass Boost", "Stereo Pan"],
  },
  "Stickers": {
    icon: "💫",
    color: "#ffecd2",
    features: ["Animated Hearts", "Cute Animals", "Rings", "Flowers", "Stars", "Emojis", "Confetti", "Ribbons", "Crowns", "Wings"],
  },
  "Frames": {
    icon: "🖼️",
    color: "#fd79a8",
    features: ["Polaroid", "Film Strip", "Neon Frame", "Doodle Border", "Rose Gold", "Vintage Film", "Heart Frame", "Flower Border", "Minimal Line", "Ornate Gold"],
  },
  "Backgrounds": {
    icon: "🌌",
    color: "#6c5ce7",
    features: ["Parallax", "Gradient Gen", "Video BG", "Animated Mesh", "Bokeh BG", "Aurora", "Galaxy", "Underwater", "Petals", "Confetti Rain"],
  },
  "AI Tools": {
    icon: "🤖",
    color: "#00cec9",
    features: ["Auto Caption", "Poem Generator", "Smart Crop", "Style Transfer", "Color Match", "Face Enhance", "BG Remover", "Voice Clone", "Music Gen", "Script Writer"],
  },
  "Particles": {
    icon: "💥",
    color: "#e17055",
    features: ["Heart Burst", "Fireworks", "Sparkle Trail", "Confetti Pop", "Star Shower", "Bubble Float", "Petal Fall", "Lightning", "Smoke", "Glitter"],
  },
  "Masking": {
    icon: "💗",
    color: "#ff6b9d",
    features: ["Heart Mask", "Circle Mask", "Diamond Mask", "Star Mask", "Cloud Shape", "Floral Mask", "Custom Path", "Text Mask", "Arrow Shape", "Hexagon"],
  },
  "Color Grading": {
    icon: "🎭",
    color: "#fdcb6e",
    features: ["HSL Sliders", "RGB Curves", "Exposure", "Contrast", "Saturation", "Vibrance", "Highlights", "Shadows", "Clarity", "Dehaze"],
  },
  "Timing Controls": {
    icon: "⏱️",
    color: "#74b9ff",
    features: ["Slow Motion", "Fast Forward", "Reverse Play", "Speed Ramp", "Freeze Frame", "Loop", "Ping Pong", "Time Stretch", "Keyframe Ease", "Motion Blur"],
  },
  "Preset Layouts": {
    icon: "📐",
    color: "#55efc4",
    features: ["Story Mode", "Grid 2×2", "Collage Split", "Magazine", "Timeline Strip", "Mosaic", "Diptych", "Triptych", "Full Bleed", "Minimal White"],
  },
  "Interactive": {
    icon: "👆",
    color: "#a29bfe",
    features: ["Yes/No Button", "Multi-Choice", "Click Reveal", "Swipe Card", "Quiz Mode", "Rating Stars", "Poll Widget", "Countdown", "Progress Bar", "Flip Card"],
  },
  "Export": {
    icon: "📤",
    color: "#00b894",
    features: ["4K Render", "Mobile Preview", "PDF Summary", "GIF Export", "WebM Video", "MP4 Share", "Story Format", "Square Format", "Portrait Mode", "Landscape"],
  },
  "Social": {
    icon: "📱",
    color: "#e84393",
    features: ["Safe Zone Grid", "Music Link", "Caption Export", "Hashtag Gen", "Story Frames", "Reel Format", "TikTok Size", "YouTube Short", "Watermark", "QR Code"],
  },
  "Gesture Support": {
    icon: "🤌",
    color: "#81ecec",
    features: ["Pinch Zoom", "Drag Layer", "Rotate Handle", "Swipe Switch", "Long Press", "Double Tap", "Two-Finger Pan", "Edge Snap", "Snap to Grid", "Align Guides"],
  },
  "3D Effects": {
    icon: "🔮",
    color: "#d63031",
    features: ["3D Flip", "Parallax Depth", "Tilt Effect", "3D Carousel", "Depth Map", "Shadow Cast", "Perspective", "Isometric", "Cube Wrap", "Sphere Wrap"],
  },
  "Photo Tools": {
    icon: "📷",
    color: "#fdcb6e",
    features: ["Smart Crop", "Auto Enhance", "Remove BG", "Retouch", "Blemish Fix", "Teeth Whiten", "Skin Smooth", "Eye Enhance", "Hair Color", "Makeup FX"],
  },
  "Typography": {
    icon: "🔤",
    color: "#6c5ce7",
    features: ["50+ Fonts", "Font Pairing", "Letter Spacing", "Line Height", "Word Spacing", "Drop Cap", "Text Path", "Baseline Shift", "Font Scale", "Character Style"],
  },
  "Music Library": {
    icon: "🎸",
    color: "#e17055",
    features: ["Romantic BGM", "Wedding March", "Pop Hits", "Classical", "Instrumental", "Acoustic", "EDM Beat", "Chill Lo-Fi", "Epic Cinematic", "Jazz Lounge"],
  },
  "Story Templates": {
    icon: "📖",
    color: "#74b9ff",
    features: ["Proposal Story", "Anniversary", "Valentine", "Wedding Day", "Love Letter", "First Date", "Memory Lane", "Future Plans", "Travel Together", "Custom Story"],
  },
  "Collaboration": {
    icon: "👥",
    color: "#55efc4",
    features: ["Share Link", "Co-edit Mode", "Comment Thread", "Version History", "Review Mode", "Approval Flow", "Team Assets", "Brand Kit", "Permissions", "Live Cursor"],
  },
  "Layer Controls": {
    icon: "📚",
    color: "#a29bfe",
    features: ["Group Layers", "Lock Layer", "Hide/Show", "Blend Mode", "Opacity Slider", "Flatten", "Duplicate", "Merge Down", "Smart Layer", "Layer Effects"],
  },
  "Responsive": {
    icon: "📏",
    color: "#fd79a8",
    features: ["Mobile View", "Tablet View", "Desktop View", "Auto Reflow", "Safe Zones", "Breakpoints", "Fluid Type", "Responsive Grid", "Adaptive Layout", "Preview Mode"],
  },
  "Brand Kit": {
    icon: "💼",
    color: "#00b894",
    features: ["Custom Colors", "Logo Upload", "Font Upload", "Brand Guidelines", "Color Palette", "Icon Set", "Pattern Library", "Watermark", "Template Lock", "Style Guide"],
  },
  "Timeline Master": {
    icon: "⏸️",
    color: "#e84393",
    features: ["Multi-Track", "Magnetic Snap", "Frame Scrub", "Keyframe Edit", "Duration Handle", "Ripple Edit", "Split Clip", "Trim In/Out", "Timeline Zoom", "Marker Flag"],
  },
  "Security": {
    icon: "🔐",
    color: "#81ecec",
    features: ["JWT Auth", "Auto Save", "Version Lock", "Watermark Protect", "Password Gate", "Expiry Date", "Download Limit", "View Count", "IP Restrict", "Audit Log"],
  },
};

// ============================================================
// EDITOR STORE (Zustand-like using useReducer)
// ============================================================
function editorReducer(state, action) {
  switch (action.type) {
    case "ADD_LAYER":
      return { ...state, layers: [...state.layers, { id: crypto.randomUUID(), ...action.payload, createdAt: Date.now() }] };
    case "REMOVE_LAYER":
      return { ...state, layers: state.layers.filter((l) => l.id !== action.id) };
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
    { id: "l1", type: "text", content: "Will You Marry Me?", x: 50, y: 30, fontSize: 48, color: "#fff", font: "serif", filter: null },
    { id: "l2", type: "shape", shape: "heart", x: 40, y: 55, size: 80, color: "#ff6b9d" },
    { id: "l3", type: "text", content: "You are my everything ❤️", x: 20, y: 75, fontSize: 20, color: "#ffecd2", font: "script" },
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
function Canvas({ layers, selectedLayerId, activeFilter, onSelectLayer }) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const [time, setTime] = useState(0);

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

  const filterStyles = {
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

  function addParticle(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: crypto.randomUUID(),
      x,
      y,
      vx: (Math.random() - 0.5) * 3,
      vy: -Math.random() * 4 - 1,
      life: 1,
      size: Math.random() * 12 + 6,
      emoji: ["❤️", "💕", "✨", "💗", "🌸"][Math.floor(Math.random() * 5)],
    }));
    setParticles((p) => [...p, ...newParticles]);
    setTimeout(() => setParticles((p) => p.filter((x) => !newParticles.find((n) => n.id === x.id))), 2000);
  }

  return (
    <div
      onClick={addParticle}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "9/16",
        background: "linear-gradient(135deg, #1a0a2e 0%, #16213e 50%, #0f3460 100%)",
        borderRadius: 12,
        overflow: "hidden",
        cursor: "crosshair",
        ...fStyle,
      }}
    >
      {/* Animated BG stars */}
      {Array.from({ length: 20 }, (_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            background: "#fff",
            borderRadius: "50%",
            left: `${(i * 17 + 3) % 100}%`,
            top: `${(i * 23 + 7) % 100}%`,
            opacity: 0.3 + Math.sin(time + i) * 0.3,
            transition: "opacity 0.1s",
          }}
        />
      ))}

      {/* Heart rain overlay */}
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={`heart-${i}`}
          style={{
            position: "absolute",
            left: `${(i * 20 + 10) % 100}%`,
            top: `${((time * 15 + i * 25) % 120) - 10}%`,
            fontSize: 16 + (i % 3) * 6,
            opacity: 0.4,
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          ❤️
        </div>
      ))}

      {/* Layers */}
      {layers.map((layer) => (
        <div
          key={layer.id}
          onClick={(e) => { e.stopPropagation(); onSelectLayer(layer.id); }}
          style={{
            position: "absolute",
            left: `${layer.x}%`,
            top: `${layer.y}%`,
            transform: "translateX(-50%)",
            cursor: "pointer",
            outline: selectedLayerId === layer.id ? "2px dashed #c850c0" : "none",
            outlineOffset: 4,
            borderRadius: 4,
            userSelect: "none",
          }}
        >
          {layer.type === "text" && (
            <div
              style={{
                fontSize: layer.fontSize,
                color: layer.color,
                fontFamily: layer.font === "script" ? "Georgia, serif" : "Georgia, serif",
                fontWeight: layer.font === "script" ? 400 : 700,
                textShadow: "0 2px 20px rgba(0,0,0,0.8)",
                whiteSpace: "nowrap",
                animation: "floatAnim 3s ease-in-out infinite",
              }}
            >
              {layer.content}
            </div>
          )}
          {layer.type === "shape" && layer.shape === "heart" && (
            <div style={{ fontSize: layer.size, animation: "pulseHeart 1.5s ease-in-out infinite" }}>❤️</div>
          )}
        </div>
      ))}

      {/* Click particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: p.size,
            pointerEvents: "none",
            animation: "particleFly 1.5s ease-out forwards",
            userSelect: "none",
          }}
        >
          {p.emoji}
        </div>
      ))}

      {/* Active filter label */}
      <div style={{
        position: "absolute",
        top: 8,
        right: 8,
        background: "rgba(0,0,0,0.5)",
        color: "#ffecd2",
        fontSize: 10,
        padding: "2px 8px",
        borderRadius: 20,
        backdropFilter: "blur(4px)",
      }}>
        {activeFilter}
      </div>

      <style>{`
        @keyframes floatAnim {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-6px); }
        }
        @keyframes pulseHeart {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        @keyframes particleFly {
          0% { opacity: 1; transform: translate(0, 0) scale(1); }
          100% { opacity: 0; transform: translate(calc(var(--vx, 20px)), calc(var(--vy, -60px))) scale(0.3); }
        }
      `}</style>
    </div>
  );
}

// ============================================================
// TIMELINE COMPONENT
// ============================================================
function Timeline({ currentTime, duration, isPlaying, onTimeChange, onTogglePlay }) {
  const tracks = [
    { id: 1, label: "❤️ Main Title", color: "#c850c0", start: 0, end: 8 },
    { id: 2, label: "📷 Photo 1", color: "#4facfe", start: 2, end: 12 },
    { id: 3, label: "🎵 Music", color: "#43e97b", start: 0, end: 30 },
    { id: 4, label: "✨ Overlay", color: "#fa709a", start: 5, end: 20 },
    { id: 5, label: "📝 Caption", color: "#a18cd1", start: 10, end: 25 },
  ];

  const progress = (currentTime / duration) * 100;

  return (
    <div style={{ background: "#0d0d1a", borderTop: "1px solid #2a1a4e", padding: "8px 12px" }}>
      {/* Transport controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <button onClick={onTogglePlay} style={{
          background: "#c850c0",
          border: "none",
          borderRadius: "50%",
          width: 28,
          height: 28,
          color: "#fff",
          cursor: "pointer",
          fontSize: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          {isPlaying ? "⏸" : "▶"}
        </button>
        <span style={{ color: "#888", fontSize: 11, fontFamily: "monospace" }}>
          {currentTime.toFixed(1)}s / {duration}s
        </span>
        <div style={{ flex: 1, background: "#1a0a2e", borderRadius: 4, height: 4, position: "relative", cursor: "pointer" }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const t = ((e.clientX - rect.left) / rect.width) * duration;
            onTimeChange(Math.max(0, Math.min(duration, t)));
          }}
        >
          <div style={{ width: `${progress}%`, height: "100%", background: "#c850c0", borderRadius: 4 }} />
          <div style={{
            position: "absolute",
            top: "50%",
            left: `${progress}%`,
            transform: "translate(-50%, -50%)",
            width: 10,
            height: 10,
            background: "#fff",
            borderRadius: "50%",
            boxShadow: "0 0 6px #c850c0",
          }} />
        </div>
      </div>

      {/* Tracks */}
      <div style={{ overflowX: "auto" }}>
        {tracks.map((track) => (
          <div key={track.id} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
            <div style={{ width: 80, fontSize: 10, color: "#888", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {track.label}
            </div>
            <div style={{ flex: 1, height: 16, background: "#1a0a2e", borderRadius: 3, position: "relative" }}>
              <div style={{
                position: "absolute",
                left: `${(track.start / duration) * 100}%`,
                width: `${((track.end - track.start) / duration) * 100}%`,
                height: "100%",
                background: track.color,
                borderRadius: 3,
                opacity: 0.8,
              }} />
              {/* Playhead */}
              <div style={{
                position: "absolute",
                left: `${progress}%`,
                top: 0,
                bottom: 0,
                width: 1,
                background: "#fff",
                opacity: 0.6,
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// FEATURE PANEL
// ============================================================
function FeaturePanel({ activeCategory, activeFilter, onFilterChange, onAddLayer }) {
  const category = FEATURE_REGISTRY[activeCategory];
  if (!category) return null;

  return (
    <div style={{ padding: 12, height: "100%", overflowY: "auto" }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#ffecd2", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
        <span>{category.icon}</span> {activeCategory}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        {category.features.map((feat) => (
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
              textAlign: "left",
              transition: "all 0.15s",
              fontWeight: activeFilter === feat ? 600 : 400,
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
// LAYERS PANEL
// ============================================================
function LayersPanel({ layers, selectedLayerId, onSelect, onRemove }) {
  return (
    <div style={{ padding: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#888", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Layers</div>
      {layers.length === 0 && <div style={{ color: "#555", fontSize: 12 }}>No layers yet. Click canvas to add particles!</div>}
      {[...layers].reverse().map((layer) => (
        <div
          key={layer.id}
          onClick={() => onSelect(layer.id)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 8px",
            borderRadius: 8,
            background: selectedLayerId === layer.id ? "rgba(200,80,192,0.2)" : "rgba(255,255,255,0.04)",
            border: selectedLayerId === layer.id ? "1px solid #c850c0" : "1px solid transparent",
            marginBottom: 4,
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: 14 }}>{layer.type === "text" ? "✍️" : "❤️"}</span>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ fontSize: 11, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {layer.type === "text" ? layer.content : `${layer.shape} shape`}
            </div>
            <div style={{ fontSize: 10, color: "#888" }}>{layer.type}</div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(layer.id); }}
            style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 14, padding: 0, lineHeight: 1 }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// PROPERTY INSPECTOR
// ============================================================
function PropertyInspector({ layer, onUpdate }) {
  if (!layer) return (
    <div style={{ padding: 16, color: "#555", fontSize: 12 }}>
      Select a layer to edit its properties
    </div>
  );

  return (
    <div style={{ padding: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#888", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Properties</div>
      {layer.type === "text" && (
        <>
          <label style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 4 }}>Text Content</label>
          <input
            value={layer.content}
            onChange={(e) => onUpdate(layer.id, { content: e.target.value })}
            style={{ width: "100%", background: "#1a0a2e", border: "1px solid #2a1a4e", borderRadius: 6, color: "#fff", padding: "6px 8px", fontSize: 12, marginBottom: 10, boxSizing: "border-box" }}
          />
          <label style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 4 }}>Font Size: {layer.fontSize}px</label>
          <input
            type="range" min="12" max="72" value={layer.fontSize}
            onChange={(e) => onUpdate(layer.id, { fontSize: +e.target.value })}
            style={{ width: "100%", marginBottom: 10, accentColor: "#c850c0" }}
          />
          <label style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 4 }}>Color</label>
          <input
            type="color" value={layer.color}
            onChange={(e) => onUpdate(layer.id, { color: e.target.value })}
            style={{ width: "100%", height: 36, border: "none", borderRadius: 6, cursor: "pointer", marginBottom: 10, background: "none" }}
          />
        </>
      )}
      <label style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 4 }}>Position X: {layer.x.toFixed(0)}%</label>
      <input
        type="range" min="0" max="100" value={layer.x}
        onChange={(e) => onUpdate(layer.id, { x: +e.target.value })}
        style={{ width: "100%", marginBottom: 10, accentColor: "#4facfe" }}
      />
      <label style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 4 }}>Position Y: {layer.y.toFixed(0)}%</label>
      <input
        type="range" min="0" max="100" value={layer.y}
        onChange={(e) => onUpdate(layer.id, { y: +e.target.value })}
        style={{ width: "100%", accentColor: "#4facfe" }}
      />
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function ProposalEditor() {
  const [state, dispatch] = useReducer(editorReducer, INITIAL_STATE);
  const [saveStatus, setSaveStatus] = useState("saved");
  const [rightTab, setRightTab] = useState("layers");
  const saveTimerRef = useRef(null);
  const playTimerRef = useRef(null);

  // Auto-save debouncing
  useEffect(() => {
    setSaveStatus("unsaved");
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      setSaveStatus("saving...");
      setTimeout(() => setSaveStatus("saved ✓"), 600);
    }, 2000);
    return () => clearTimeout(saveTimerRef.current);
  }, [state.layers, state.activeFilter]);

  // Playback
  useEffect(() => {
    if (state.isPlaying) {
      playTimerRef.current = setInterval(() => {
        dispatch({ type: "SET_TIME", time: Math.min(state.timeline.currentTime + 0.1, state.timeline.duration) });
      }, 100);
    } else {
      clearInterval(playTimerRef.current);
    }
    return () => clearInterval(playTimerRef.current);
  }, [state.isPlaying, state.timeline.currentTime]);

  function updateLayer(id, updates) {
    // In real app this goes through the Zustand store
    dispatch({ type: "ADD_LAYER", payload: { ...state.layers.find((l) => l.id === id), ...updates, id } });
    dispatch({ type: "REMOVE_LAYER", id });
  }

  const selectedLayer = state.layers.find((l) => l.id === state.selectedLayerId);

  const categories = Object.keys(FEATURE_REGISTRY);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      background: "#0a0a18",
      color: "#fff",
      fontFamily: "system-ui, sans-serif",
      overflow: "hidden",
    }}>
      {/* TOP BAR */}
      <div style={{
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        height: 48,
        background: "#12122a",
        borderBottom: "1px solid #2a1a4e",
        gap: 12,
        flexShrink: 0,
      }}>
        <div style={{ fontSize: 18, background: "linear-gradient(90deg, #c850c0, #4facfe)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700 }}>
          💍 ProposalEditor
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 11, color: saveStatus === "saved ✓" ? "#43e97b" : saveStatus === "saving..." ? "#ffd700" : "#fa709a" }}>
          {saveStatus}
        </div>
        <button
          onClick={() => dispatch({ type: "UNDO" })}
          style={{ background: "rgba(255,255,255,0.07)", border: "1px solid #2a1a4e", borderRadius: 6, color: "#ccc", padding: "4px 10px", cursor: "pointer", fontSize: 12 }}
        >
          ↩ Undo
        </button>
        <button
          onClick={() => dispatch({ type: "REDO" })}
          style={{ background: "rgba(255,255,255,0.07)", border: "1px solid #2a1a4e", borderRadius: 6, color: "#ccc", padding: "4px 10px", cursor: "pointer", fontSize: 12 }}
        >
          ↪ Redo
        </button>
        <button
          style={{ background: "linear-gradient(90deg, #c850c0, #4facfe)", border: "none", borderRadius: 8, color: "#fff", padding: "6px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}
          onClick={() => alert("🎉 Finalizing & sending to payment gateway!\n\nJWT-signed session would redirect to:\nhttps://yoursaas.com/checkout?project_id=" + state.project.id)}
        >
          Finalize & Share 💝
        </button>
      </div>

      {/* MAIN LAYOUT */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* LEFT SIDEBAR - Categories */}
        <div style={{
          width: 56,
          background: "#12122a",
          borderRight: "1px solid #2a1a4e",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "8px 0",
          gap: 2,
          flexShrink: 0,
        }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => dispatch({ type: "SET_CATEGORY", category: cat })}
              title={cat}
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                border: state.activeCategory === cat ? `2px solid ${FEATURE_REGISTRY[cat].color}` : "2px solid transparent",
                background: state.activeCategory === cat ? `${FEATURE_REGISTRY[cat].color}22` : "transparent",
                fontSize: 18,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.15s",
                flexShrink: 0,
              }}
            >
              {FEATURE_REGISTRY[cat].icon}
            </button>
          ))}
        </div>

        {/* FEATURE PANEL */}
        <div style={{
          width: 200,
          background: "#0f0f22",
          borderRight: "1px solid #2a1a4e",
          overflowY: "auto",
          flexShrink: 0,
        }}>
          <FeaturePanel
            activeCategory={state.activeCategory}
            activeFilter={state.activeFilter}
            onFilterChange={(f) => dispatch({ type: "UPDATE_FILTER", filter: f })}
            onAddLayer={(payload) => dispatch({ type: "ADD_LAYER", payload })}
          />
        </div>

        {/* CANVAS AREA */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#080816",
          padding: 16,
          gap: 12,
          minWidth: 0,
          overflow: "hidden",
        }}>
          <div style={{ maxWidth: 280, width: "100%" }}>
            <Canvas
              layers={state.layers}
              selectedLayerId={state.selectedLayerId}
              activeFilter={state.activeFilter}
              onSelectLayer={(id) => dispatch({ type: "SELECT_LAYER", id })}
            />
          </div>
          <div style={{ fontSize: 10, color: "#555" }}>Click canvas to add particle effects • Click layers to select</div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{
          width: 220,
          background: "#0f0f22",
          borderLeft: "1px solid #2a1a4e",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", borderBottom: "1px solid #2a1a4e" }}>
            {["layers", "props"].map((tab) => (
              <button
                key={tab}
                onClick={() => setRightTab(tab)}
                style={{
                  flex: 1,
                  padding: "8px 0",
                  background: rightTab === tab ? "#1a0a2e" : "transparent",
                  border: "none",
                  color: rightTab === tab ? "#c850c0" : "#666",
                  fontSize: 11,
                  cursor: "pointer",
                  borderBottom: rightTab === tab ? "2px solid #c850c0" : "2px solid transparent",
                  textTransform: "capitalize",
                }}
              >
                {tab === "layers" ? "🗂 Layers" : "⚙️ Props"}
              </button>
            ))}
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {rightTab === "layers" ? (
              <LayersPanel
                layers={state.layers}
                selectedLayerId={state.selectedLayerId}
                onSelect={(id) => dispatch({ type: "SELECT_LAYER", id })}
                onRemove={(id) => dispatch({ type: "REMOVE_LAYER", id })}
              />
            ) : (
              <PropertyInspector
                layer={selectedLayer}
                onUpdate={updateLayer}
              />
            )}
          </div>

          {/* Volume Control */}
          <div style={{ padding: 12, borderTop: "1px solid #2a1a4e" }}>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 6 }}>🎵 Master Volume: {Math.round(state.volume * 100)}%</div>
            <input
              type="range" min="0" max="1" step="0.01" value={state.volume}
              onChange={(e) => dispatch({ type: "SET_VOLUME", volume: +e.target.value })}
              style={{ width: "100%", accentColor: "#43e97b" }}
            />
          </div>
        </div>
      </div>

      {/* TIMELINE */}
      <div style={{ flexShrink: 0 }}>
        <Timeline
          currentTime={state.timeline.currentTime}
          duration={state.timeline.duration}
          isPlaying={state.isPlaying}
          onTimeChange={(t) => dispatch({ type: "SET_TIME", time: t })}
          onTogglePlay={() => dispatch({ type: "TOGGLE_PLAY" })}
        />
      </div>
    </div>
  );
}
