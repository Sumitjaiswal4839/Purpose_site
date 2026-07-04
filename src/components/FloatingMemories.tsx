"use client";

import { useEffect, useRef, useCallback } from "react";

// Romantic placeholder images (replace with your own in /public/memories/)
const MEMORY_IMAGES = [
  "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1551292831-023188e78222?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=200&h=200&fit=crop",
];

const HEART_COLORS = [
  "#ff6b9d", "#ff4785", "#c44dff", "#ff6b6b",
  "#ffd93d", "#ff8c42", "#ff4dac", "#a78bfa",
];

interface FloatingItem {
  id: number;
  el: HTMLDivElement;
  timer: ReturnType<typeof setTimeout>;
}

export default function FloatingMemories() {
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const itemsRef = useRef<FloatingItem[]>([]);
  const counterRef = useRef(0);
  const speedRef = useRef(1500); // ms between spawns

  // Burst effect — scatter mini hearts on click
  const burstHearts = useCallback((x: number, y: number) => {
    const count = 12;
    for (let i = 0; i < count; i++) {
      const heart = document.createElement("div");
      heart.innerHTML = "❤️";
      heart.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        font-size: ${10 + Math.random() * 14}px;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        animation: heartBurst 0.8s ease-out forwards;
        --dx: ${(Math.random() - 0.5) * 160}px;
        --dy: ${-(Math.random() * 120 + 40)}px;
      `;
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 850);
    }
  }, []);

  const removeItem = useCallback((id: number) => {
    itemsRef.current = itemsRef.current.filter((item) => {
      if (item.id === id) {
        clearTimeout(item.timer);
        if (item.el.parentNode) item.el.parentNode.removeChild(item.el);
        return false;
      }
      return true;
    });
  }, []);

  const createFloatingImage = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const id = ++counterRef.current;
    const size = 72 + Math.floor(Math.random() * 48); // 72–120px
    const src = MEMORY_IMAGES[Math.floor(Math.random() * MEMORY_IMAGES.length)];
    const leftPct = 5 + Math.random() * 85; // 5%–90%
    const duration = 5000 + Math.random() * 4000; // 5s–9s
    const swayX = (Math.random() - 0.5) * 60; // -30px to +30px
    const rotateDeg = (Math.random() - 0.5) * 20; // -10° to +10°
    const delay = Math.random() * 500;
    const glowColor = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];

    const wrapper = document.createElement("div");
    wrapper.style.cssText = `
      position: absolute;
      bottom: -160px;
      left: ${leftPct}%;
      width: ${size}px;
      height: ${size}px;
      cursor: pointer;
      pointer-events: auto;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 0 24px ${glowColor}88, 0 0 48px ${glowColor}44;
      border: 2px solid ${glowColor}66;
      animation: floatUp ${duration}ms ${delay}ms cubic-bezier(0.4, 0, 0.6, 1) forwards;
      --sway: ${swayX}px;
      --rotate: ${rotateDeg}deg;
      z-index: 5;
      transition: transform 0.15s ease, opacity 0.15s ease;
      will-change: transform, opacity;
    `;

    const img = document.createElement("img");
    img.src = src;
    img.alt = "memory";
    img.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      pointer-events: none;
      user-select: none;
    `;
    img.draggable = false;

    // Hover glow pulse
    wrapper.addEventListener("mouseenter", () => {
      wrapper.style.transform = "scale(1.08)";
      wrapper.style.boxShadow = `0 0 36px ${glowColor}cc, 0 0 72px ${glowColor}66`;
    });
    wrapper.addEventListener("mouseleave", () => {
      wrapper.style.transform = "";
      wrapper.style.boxShadow = `0 0 24px ${glowColor}88, 0 0 48px ${glowColor}44`;
    });

    // Click → burst + remove
    wrapper.addEventListener("click", (e) => {
      e.stopPropagation();
      burstHearts(e.clientX, e.clientY);
      wrapper.style.transform = "scale(0) rotate(20deg)";
      wrapper.style.opacity = "0";
      setTimeout(() => removeItem(id), 300);
    });

    wrapper.appendChild(img);
    container.appendChild(wrapper);

    const timer = setTimeout(() => removeItem(id), duration + delay + 500);
    itemsRef.current.push({ id, el: wrapper, timer });
  }, [burstHearts, removeItem]);

  // Gradually increase speed (typing master style difficulty)
  const startSpawning = useCallback(() => {
    intervalRef.current = setInterval(() => {
      createFloatingImage();
    }, speedRef.current);

    // Speed up every 15s
    const speedUp = setInterval(() => {
      if (speedRef.current > 700) {
        speedRef.current = Math.max(700, speedRef.current - 150);
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(createFloatingImage, speedRef.current);
      } else {
        clearInterval(speedUp);
      }
    }, 15000);

    return () => clearInterval(speedUp);
  }, [createFloatingImage]);

  useEffect(() => {
    const cleanup = startSpawning();
    // Spawn 2 immediately so screen isn't empty
    setTimeout(createFloatingImage, 100);
    setTimeout(createFloatingImage, 600);

    return () => {
      cleanup();
      if (intervalRef.current) clearInterval(intervalRef.current);
      itemsRef.current.forEach((item) => {
        clearTimeout(item.timer);
        if (item.el.parentNode) item.el.parentNode.removeChild(item.el);
      });
      itemsRef.current = [];
    };
  }, [startSpawning, createFloatingImage]);

  return (
    <>
      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0)       translateX(0)              rotate(0deg);   opacity: 0;   }
          8%   { opacity: 1; }
          50%  { transform: translateY(-55vh)   translateX(var(--sway))    rotate(calc(var(--rotate) * 0.5)); opacity: 1; }
          92%  { opacity: 1; }
          100% { transform: translateY(-115vh)  translateX(calc(var(--sway) * -0.6)) rotate(var(--rotate)); opacity: 0; }
        }

        @keyframes heartBurst {
          0%   { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.3); opacity: 0; }
        }
      `}</style>

      {/* Portal glow — where images "emerge" from */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "120px",
          background:
            "linear-gradient(to top, rgba(255,71,133,0.18) 0%, rgba(196,77,255,0.10) 50%, transparent 100%)",
          filter: "blur(18px)",
          pointerEvents: "none",
          zIndex: 4,
        }}
      />

      {/* Floating container */}
      <div
        ref={containerRef}
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
          zIndex: 3,
        }}
      />
    </>
  );
}
