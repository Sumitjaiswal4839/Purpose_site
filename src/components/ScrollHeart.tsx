"use client";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Heart } from "lucide-react";

export default function ScrollHeart() {
  const { scrollYProgress } = useScroll();
  
  // Heart ki vertical movement (Y-axis) pure page ke scroll ke sath
  // We use percentages to ensure it stays within view bounds
  const y = useTransform(scrollYProgress, [0, 1], ["5%", "85%"]);
  
  // Heart ka size thoda change hoga scroll pe for dynamic feel
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1]);
  
  // Heart ki opacity thodi kam ho sakti hai middle mein content readability ke liye
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 0.3, 0.3, 0.8]);
  
  // Smooth movement ke liye spring physics
  const smoothY = useSpring(y, { stiffness: 60, damping: 20 });

  return (
    <div className="fixed inset-0 pointer-events-none z-[40] overflow-hidden">
      {/* The Sparkling Heart — pinned to right edge */}
      <motion.div
        style={{ y: smoothY, scale, opacity, right: "1.5rem", x: 0 }}
        className="absolute flex items-center justify-center"
      >
        {/* Heart Icon with Glow */}
        <div className="relative">
          <Heart 
            className="w-7 h-7 text-rose-400/60 fill-current filter drop-shadow-[0_0_12px_rgba(255,20,147,0.4)]" 
          />
          
          {/* Sparkling Particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.8, 0],
                x: [0, (i % 2 === 0 ? 40 : -40) * Math.random()],
                y: [0, (i < 4 ? 40 : -40) * Math.random()],
              }}
              transition={{
                duration: 2 + Math.random(),
                repeat: Infinity,
                delay: i * 0.3,
              }}
              className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-pink-300 rounded-full blur-[1px]"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
