"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  Heart, Sparkles, Star, Gift, Check, ArrowRight, Play, Wand2, 
  ShieldCheck, MailOpen, Quote, ChevronLeft, ChevronRight, 
  Camera, Music, Monitor, Layout, Rocket, Globe, MessageCircle, Share2
} from "lucide-react";
import Link from "next/link";

// --- Components ---

const FloatingHeart = ({ delay = 0, x = "50%", size = 20, duration = 15 }) => (
  <motion.div
    initial={{ y: "110vh", x, opacity: 0, scale: 0 }}
    animate={{ 
      y: "-10vh", 
      opacity: [0, 1, 1, 0],
      scale: [0, 1, 1, 0.5],
      rotate: [0, 45, -45, 0]
    }}
    transition={{ 
      duration, 
      delay, 
      repeat: Infinity, 
      ease: "linear" 
    }}
    className="absolute pointer-events-none text-rose-300/30"
  >
    <Heart size={size} fill="currentColor" />
  </motion.div>
);

const TestimonialSlider = () => {
  const testimonials = [
    { name: "Ananya R.", role: "Mumbai", text: "Maine apne anniversary ke liye 'Starry Night' theme use kiya tha. He was totally shocked! Best decision ever.", rating: 5 },
    { name: "Rahul S.", role: "Delhi", text: "The transition from our old photos to the proposal question was so smooth. Highly recommend!", rating: 5 },
    { name: "Ishani M.", role: "Bangalore", text: "Budget-friendly but looks like I spent thousands on a web developer. Amazing service.", rating: 5 }
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-lg mt-12 px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white/40 backdrop-blur-md p-6 rounded-2xl border border-white/50 shadow-sm text-left"
        >
          <Quote className="text-rose-400 w-8 h-8 mb-4 opacity-50" />
          <p className="text-gray-700 italic mb-4 font-medium">"{testimonials[index].text}"</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-900">{testimonials[index].name}</p>
              <p className="text-xs text-gray-500">{testimonials[index].role}</p>
            </div>
            <div className="flex gap-0.5">
              {[...Array(testimonials[index].rating)].map((_, i) => (
                <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default function Home() {
  const { scrollYProgress } = useScroll();
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);
  const [previewName, setPreviewName] = useState("Your Partner");

  useEffect(() => {
    const handleScroll = () => setShowFloatingCTA(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const themes = [
    { title: "Midnight Galaxy", tag: "Most Popular", img: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=800", href: "/preview/long-distance" },
    { title: "Cherry Blossom", tag: "Romantic", img: "https://images.unsplash.com/photo-1522383225653-ed111181a951?q=80&w=800", href: "/preview/crush" },
    { title: "Vintage Letter", tag: "Classic", img: "https://images.unsplash.com/photo-1516410529446-2c777cb7366d?q=80&w=800", href: "/preview/secret-admirer" },
    { title: "Neon Future", tag: "Modern", img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800", href: "/preview/snake-trail" }
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#FAFAFA] font-sans selection:bg-rose-200 page-fade-in">
      
      {/* --- BACKGROUND ENHANCEMENTS --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        {/* Floating Hearts */}
        {[...Array(15)].map((_, i) => {
          const x = `${(i * 17 + 11) % 100}%`;
          const size = 15 + ((i * 7 + 5) % 21);
          const duration = 10 + ((i * 3 + 4) % 11);
          return (
            <FloatingHeart 
              key={i} 
              delay={i * 1.5} 
              x={x} 
              size={size} 
              duration={duration} 
            />
          );
        })}
        
        {/* Animated Gradients */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-64 -left-64 w-[800px] h-[800px] bg-rose-400/10 rounded-full blur-[150px]"
        />
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 -right-32 w-[600px] h-[600px] bg-purple-400/10 rounded-full blur-[130px]"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-soft-light"></div>
      </div>

      <main className="flex-1 w-full flex flex-col">
        
        {/* --- 1. HERO SECTION --- */}
        <section className="max-w-7xl mx-auto px-6 pt-32 md:pt-48 pb-32 flex flex-col items-center text-center relative w-full">
          <motion.div
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.5 }}
             className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-rose-50 border border-rose-100 shadow-sm mb-10 text-xs font-black tracking-widest uppercase text-rose-600"
          >
             <Sparkles className="w-3 h-3" /> The Digital Proposal Revolution
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter text-gray-900 mb-8 leading-[1.1] md:leading-[0.95] max-w-5xl"
          >
            Magic to make them say{" "}
            <span className="gradient-text drop-shadow-sm">"YES!"</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-lg md:text-xl text-gray-500 mb-12 max-w-2xl font-medium leading-[1.7]"
          >
            Stop using boring texts. Create high-end, cinematic proposal pages with music, VFX, and interactive surprises in under 2 minutes.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto z-10"
          >
            <Link href="/create" className="inline-flex h-14 items-center justify-center gap-3 rounded-full bg-gray-900 px-10 text-white font-black text-lg transition-all hover:scale-105 shadow-xl hover:shadow-rose-500/20 active:scale-95 group">
              <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" /> Start Creating
            </Link>
            <Link href="/templates" className="inline-flex h-14 items-center justify-center gap-3 rounded-full bg-white border-2 border-gray-100 px-10 font-black text-gray-900 text-lg transition-all hover:bg-gray-50 hover:border-rose-200 shadow-sm active:scale-95">
              <Play className="w-5 h-5 text-rose-500 fill-rose-500" /> Browse Templates
            </Link>
          </motion.div>

          <TestimonialSlider />
        </section>

        {/* --- 2. TRUST BAR --- */}
        <section className="w-full py-12 border-y border-gray-100 bg-white/50 backdrop-blur-sm">
           <div className="max-w-7xl mx-auto px-6">
              <p className="text-center text-gray-400 text-xs font-bold uppercase tracking-[0.3em] mb-8">Trusted by couples across India</p>
              <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20">
                {[
                  { value: "18+", label: "Ready Templates" },
                  { value: "2 Min", label: "To Build" },
                  { value: "₹99", label: "Starting Price" },
                  { value: "100%", label: "Private & Secure" },
                  { value: "24hr", label: "Custom Delivery" },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-1">
                    <span className="text-2xl font-black text-gray-900">{item.value}</span>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.label}</span>
                  </div>
                ))}
              </div>
           </div>
        </section>

        {/* --- 3. THEME SHOWCASE --- */}
        <section className="w-full max-w-7xl mx-auto px-6 py-32">
           <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="max-w-xl">
                 <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">Pick a vibe that fits your story.</h2>
                 <p className="text-gray-500 text-lg font-medium">From minimal chic to over-the-top cinematic experiences. We have a theme for every love story.</p>
              </div>
              <Link href="/templates" className="text-rose-600 font-bold flex items-center gap-2 hover:gap-4 transition-all pb-2 border-b-2 border-rose-100">
                 View All Templates <ArrowRight size={20} />
              </Link>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {themes.map((theme, i) => (
                <Link href={theme.href} key={i}>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative h-[420px] rounded-3xl overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-rose-500/20 transition-all duration-500"
                >
                   <Image src={theme.img} alt={theme.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                   <div className="absolute top-6 right-6">
                      <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase px-3 py-1 rounded-full border border-white/30">{theme.tag}</span>
                   </div>
                   <div className="absolute bottom-8 left-8 right-8">
                      <h3 className="text-white text-2xl font-black mb-2">{theme.title}</h3>
                      <button className="bg-white text-gray-900 w-full py-3 rounded-2xl font-bold opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">Preview Theme</button>
                   </div>
                </motion.div>
                </Link>
              ))}
           </div>
        </section>

        {/* --- 4. INTERACTIVE LIVE PREVIEW WIDGET --- */}
        <section className="w-full bg-rose-50 py-32 px-6">
           <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                 <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 leading-tight">See the magic in real-time.</h2>
                 <p className="text-xl text-gray-600 mb-10 leading-relaxed font-medium">Type your partner's name below and see how it instantly transforms into a cinematic masterpiece.</p>
                 
                 <div className="space-y-4">
                    <div className="bg-white p-4 rounded-3xl shadow-sm border border-rose-100 flex items-center gap-4">
                       <div className="bg-rose-100 p-3 rounded-2xl text-rose-500"><Star size={24} /></div>
                       <input 
                        type="text" 
                        placeholder="Enter Partner's Name..." 
                        value={previewName}
                        onChange={(e) => setPreviewName(e.target.value)}
                        className="flex-1 bg-transparent border-none focus:ring-0 font-bold text-xl text-gray-800 placeholder:text-gray-300"
                       />
                    </div>
                    <div className="flex gap-4 text-sm text-gray-400 font-bold px-4">
                       <span className="flex items-center gap-1"><Check size={14} className="text-green-500" /> High-Resolution</span>
                       <span className="flex items-center gap-1"><Check size={14} className="text-green-500" /> Custom Music</span>
                    </div>
                 </div>
              </div>

              <div className="relative">
                 <div className="absolute -inset-4 bg-gradient-to-tr from-rose-400 to-purple-500 rounded-[3rem] blur-3xl opacity-20 animate-pulse" />
                 <motion.div 
                    layout
                    className="relative bg-white rounded-[3rem] shadow-2xl border border-white overflow-hidden aspect-[4/5] md:aspect-square flex flex-col"
                 >
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                       <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-400" />
                          <div className="w-3 h-3 rounded-full bg-amber-400" />
                          <div className="w-3 h-3 rounded-full bg-green-400" />
                       </div>
                       <span className="text-[10px] font-mono text-gray-400 bg-gray-50 px-3 py-1 rounded-full uppercase tracking-tighter">live_preview.vfx</span>
                    </div>
                    <div className="flex-1 bg-gray-900 relative flex items-center justify-center p-12 text-center overflow-hidden">
                       <Image src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800" alt="Preview Bg" fill className="object-cover opacity-40 blur-sm" />
                       <div className="relative z-10 flex flex-col items-center">
                          <motion.div 
                            animate={{ scale: [1, 1.2, 1] }} 
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-rose-500 mb-8"
                          >
                             <Heart size={80} fill="currentColor" />
                          </motion.div>
                          <h3 className="text-white text-3xl md:text-5xl font-serif italic mb-4">Dearest {previewName || "Love"}...</h3>
                          <p className="text-rose-200 font-medium tracking-widest uppercase text-xs">A special message awaits you.</p>
                       </div>
                       <div className="absolute bottom-10 left-10 right-10 flex gap-2">
                          <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                             <motion.div initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="h-full bg-rose-500 w-1/2" />
                          </div>
                          <div className="h-1 flex-1 bg-white/20 rounded-full" />
                          <div className="h-1 flex-1 bg-white/20 rounded-full" />
                       </div>
                    </div>
                 </motion.div>
              </div>
           </div>
        </section>

        {/* --- 5. FEATURES ENHANCED --- */}
        <section className="w-full max-w-7xl mx-auto px-6 py-24 md:py-32 text-center">
           <h2 className="text-3xl md:text-6xl font-black text-gray-900 mb-16 tracking-tighter reveal">Designed to drop jaws.</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Visuals First", icon: <Layout className="w-10 h-10" />, desc: "High-end transitions and particle systems that look like they cost millions.", color: "bg-blue-50 text-blue-500" },
                { title: "Music & SFX", icon: <Music className="w-10 h-10" />, desc: "Sync your favorite songs with on-screen beats for maximum emotional impact.", color: "bg-purple-50 text-purple-500" },
                { title: "Device Optimized", icon: <Monitor className="w-10 h-10" />, desc: "Looks stunning on iPhone, Android, or Desktop. No blurry text, ever.", color: "bg-emerald-50 text-emerald-500" }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -10 }}
                  className="bg-white p-10 rounded-[2.5rem] border border-gray-100 hover:border-rose-200 transition-all duration-500 group shadow-sm hover:shadow-xl hover:shadow-rose-500/10 reveal"
                >
                   <div className={`${item.color} w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-10 group-hover:scale-110 transition-transform`}>
                      {item.icon}
                   </div>
                   <h3 className="text-2xl font-black text-gray-900 mb-4">{item.title}</h3>
                   <p className="text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
           </div>
        </section>

        {/* --- 6. METRICS --- */}
        <section className="w-full bg-gray-900 py-32 px-6 rounded-[4rem] mb-32 max-w-[95%] mx-auto overflow-hidden relative">
           <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 blur-[100px] rounded-full" />
           <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center relative z-10">
              {[
                { label: "Templates Ready", value: "18+" },
                { label: "Build Time", value: "2 Min" },
                { label: "Starting Price", value: "₹99" },
                { label: "Custom Delivery", value: "24hr" }
              ].map((stat, i) => (
                <div key={i} className="space-y-2">
                   <h3 className="text-5xl md:text-6xl font-black text-white">{stat.value}</h3>
                   <p className="text-rose-400 text-xs font-black uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
           </div>
        </section>

        {/* --- 7. FINAL CTA --- */}
        <section className="w-full px-6 mb-32">
           <div className="max-w-6xl mx-auto bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 rounded-[4rem] p-16 md:p-32 text-center relative overflow-hidden shadow-2xl">
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
             
             <motion.div
               animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
               transition={{ duration: 4, repeat: Infinity }}
               className="mx-auto w-24 h-24 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center mb-12 border border-white/30 shadow-2xl"
             >
               <Rocket className="w-10 h-10 text-white" />
             </motion.div>

             <h2 className="text-3xl md:text-6xl font-black text-white mb-8 relative z-10 leading-tight tracking-tighter">Your love story deserves magic.</h2>
             <p className="text-rose-100 text-lg md:text-xl mb-10 max-w-xl mx-auto relative z-10 font-medium">Join 40,000+ others who created a moment that stays forever.</p>
             
             <Link href="/create" className="inline-flex h-16 relative z-10 items-center justify-center gap-3 rounded-full bg-white px-12 text-gray-900 font-black text-xl transition-all hover:scale-105 shadow-2xl hover:shadow-white/20 active:scale-95">
               Create My Link Now <ArrowRight className="w-5 h-5" />
             </Link>
           </div>
        </section>

      </main>

      {/* --- 8. FLOATING CTA (desktop only) --- */}
      <AnimatePresence>
        {showFloatingCTA && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-10 right-8 z-[60] hidden md:block"
          >
            <Link 
              href="/create" 
              className="bg-rose-600 text-white pl-5 pr-6 py-3.5 rounded-full shadow-2xl shadow-rose-600/40 flex items-center gap-2.5 font-bold text-sm hover:scale-110 hover:bg-rose-500 transition-all active:scale-95 group"
            >
              <Wand2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              Create Now
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
