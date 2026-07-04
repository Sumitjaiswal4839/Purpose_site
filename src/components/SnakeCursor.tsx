"use client";

import { useEffect, useRef } from "react";

interface SnakeCursorProps {
  /** Array of image URLs to use as snake segments */
  images?: string[];
  /** Size of each segment in px (default 48) */
  segmentSize?: number;
  /** Speed multiplier for the head (0–1, default 0.2) */
  headSpeed?: number;
  /** Speed multiplier for body segments (0–1, default 0.15) */
  bodySpeed?: number;
}

// Default placeholder images used when no images are provided (snake-trail demo)
const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=80&h=80&fit=crop",
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=80&h=80&fit=crop",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=80&h=80&fit=crop",
  "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=80&h=80&fit=crop",
  "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=80&h=80&fit=crop",
  "https://images.unsplash.com/photo-1551292831-023188e78222?w=80&h=80&fit=crop",
];

export default function SnakeCursor({
  images,
  segmentSize = 48,
  headSpeed = 0.2,
  bodySpeed = 0.15,
}: SnakeCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const resolvedImages = images && images.length > 0 ? images : DEFAULT_IMAGES;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const imgs = Array.from(
      container.querySelectorAll<HTMLImageElement>(".snake-img")
    );
    const positions = imgs.map(() => ({ x: -300, y: -300 }));
    let mouseX = -300;
    let mouseY = -300;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    // Touch support for mobile
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    const animate = () => {
      // Head follows cursor
      positions[0].x += (mouseX - positions[0].x) * headSpeed;
      positions[0].y += (mouseY - positions[0].y) * headSpeed;

      // Each body segment follows the one ahead
      for (let i = 1; i < imgs.length; i++) {
        positions[i].x += (positions[i - 1].x - positions[i].x) * bodySpeed;
        positions[i].y += (positions[i - 1].y - positions[i].y) * bodySpeed;
      }

      imgs.forEach((img, i) => {
        img.style.transform = `translate(${positions[i].x - segmentSize / 2}px, ${
          positions[i].y - segmentSize / 2
        }px)`;
        img.style.zIndex = String(imgs.length - i);
      });

      rafId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      cancelAnimationFrame(rafId);
    };
  }, [segmentSize, headSpeed, bodySpeed]);

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[999]"
      aria-hidden="true"
    >
      {resolvedImages.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          draggable={false}
          className="snake-img absolute rounded-full object-cover border-2 border-white shadow-lg will-change-transform select-none"
          style={{
            width: segmentSize,
            height: segmentSize,
            opacity: Math.max(0.15, 1 - i * (0.7 / resolvedImages.length)),
            top: 0,
            left: 0,
          }}
        />
      ))}
    </div>
  );
}
