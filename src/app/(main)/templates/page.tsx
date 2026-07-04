"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { 
  Heart, Sparkles, Smile, MessageCircleHeart, 
  MapPin, Mail, Play, ArrowRight, Lock, CalendarHeart, Cake, Coffee, Search, Menu, X, Star
} from "lucide-react";

export default function TemplatesPage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const occasions = [
    { id: "love", name: "Love & Relationships ❤️", icon: <Heart className="w-4 h-4" />, count: 24 },
    { id: "family", name: "Family & Birthdays 👨‍👩‍👧", icon: <Smile className="w-4 h-4" />, count: 12 },
    { id: "friends", name: "Friends & Success 🤝", icon: <Coffee className="w-4 h-4" />, count: 10 },
    { id: "fun", name: "Fun & Mischief 😂", icon: <Sparkles className="w-4 h-4" />, count: 6 },
    { id: "sorry", name: "Apology & Sorry 🥺", icon: <MessageCircleHeart className="w-4 h-4" />, count: 3 },
  ];

  const [activeCategory, setActiveCategory] = useState("love");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");

  const themes = [
    {
      title: "Secret Scratch Card",
      category: "fun",
      description: "Literally scratch the smartphone screen with your finger to reveal a deep hidden memory underneath.",
      icon: <Sparkles className="w-6 h-6 text-yellow-500" />,
      color: "from-yellow-400 to-amber-600",
      bgClass: "bg-yellow-50",
      imageUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800",
      premium: true,
      price: 149,
      badge: "HOT",
      rating: 4.9,
      usedCount: 1200,
      href: "/preview/scratch-card"
    },
    {
      title: "Lock & Key Vault",
      category: "love",
      description: "Ask them to enter your special anniversary date. Once correct, the vault visually unlocks a romantic letter.",
      icon: <Lock className="w-6 h-6 text-slate-600" />,
      color: "from-slate-700 to-slate-900",
      bgClass: "bg-slate-100",
      imageUrl: "https://images.unsplash.com/photo-1549471013-3364d7220b75?q=80&w=800",
      premium: true,
      price: 199,
      rating: 4.9,
      usedCount: 3400,
      href: "/preview/lock-key"
    },
    {
      title: "Crush Propose",
      category: "love",
      description: "A classic, elegant red & pink theme with drifting butterflies to formally confess your feelings.",
      icon: <Heart className="w-6 h-6 text-rose-500" />,
      color: "from-rose-400 to-pink-500",
      bgClass: "bg-rose-50",
      imageUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7",
      premium: false,
      price: 0,
      rating: 4.6,
      usedCount: 15000,
      href: "/preview/crush"
    },
    {
      title: "Best Friend → GF",
      category: "love",
      description: "Warm, nostalgic aesthetics built around a timeline of your favorite shared memories.",
      icon: <Smile className="w-6 h-6 text-amber-500" />,
      color: "from-amber-400 to-orange-400",
      bgClass: "bg-amber-50",
      imageUrl: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486",
      premium: false,
      price: 0,
      rating: 4.7,
      usedCount: 8200,
      href: "/preview/best-friend-gf"
    },
    {
      title: "Friend Zone Escape",
      category: "love",
      description: "Playful and funny at first, gradually shifting into an emotional and serious confession.",
      icon: <MessageCircleHeart className="w-6 h-6 text-purple-500" />,
      color: "from-purple-400 to-indigo-500",
      imageUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2",
      bgClass: "bg-purple-50",
      premium: true,
      price: 99,
      rating: 4.8,
      usedCount: 4100,
      href: "/preview/friendzone"
    },
    {
      title: "Valentine Special",
      category: "love",
      description: "The grand gesture. Includes falling rose petals, cinematic typography, and candlelight glow.",
      icon: <Sparkles className="w-6 h-6 text-red-600" />,
      color: "from-red-500 to-rose-700",
      bgClass: "bg-red-50",
      imageUrl: "https://images.unsplash.com/photo-1549471013-3364d7220b75",
      premium: true,
      price: 99,
      badge: "TRENDING",
      rating: 4.9,
      usedCount: 5600,
      href: "/preview/valentine"
    },
    {
      title: "Long Distance Love",
      category: "love",
      description: "Starry night sky theme with a 'miles apart but close at heart' animation intro.",
      icon: <MapPin className="w-6 h-6 text-blue-400" />,
      color: "from-blue-400 to-cyan-500",
      bgClass: "bg-blue-50",
      imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3",
      premium: true,
      price: 149,
      rating: 4.8,
      usedCount: 2300,
      href: "/preview/long-distance"
    },
    {
      title: "Secret Admirer",
      category: "love",
      description: "Starts with a sealed wax romantic envelope that physically animates open on screen to reveal you.",
      icon: <Mail className="w-6 h-6 text-stone-500" />,
      color: "from-stone-500 to-zinc-700",
      bgClass: "bg-stone-50",
      imageUrl: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8",
      premium: true,
      price: 149,
      rating: 4.7,
      usedCount: 1900,
      href: "/preview/secret-admirer"
    },
    {
      title: "Dambo Birthday Magic",
      category: "family",
      description: "A magical starry night with an automated typewriter message, photo-dropping balloons, and a secret letter.",
      icon: <Cake className="w-6 h-6 text-pink-500" />,
      color: "from-pink-400 to-purple-500",
      bgClass: "bg-pink-50",
      imageUrl: "https://images.unsplash.com/photo-1507504031003-b417219a0fde",
      premium: true,
      price: 199,
      rating: 4.8,
      usedCount: 2100,
      href: "/preview/birthday-dambo"
    },
    {
      title: "50th Golden Jubilee",
      category: "family",
      description: "A majestic, cinematic timeline celebrating 50 years. Features golden particle dust, elegant typography.",
      icon: <Star className="w-6 h-6 text-yellow-600" />,
      color: "from-amber-200 to-yellow-600",
      bgClass: "bg-amber-50/50",
      imageUrl: "https://images.unsplash.com/photo-1519689680058-324335c77eba",
      premium: true,
      price: 249,
      rating: 4.9,
      usedCount: 450,
      href: "/preview/golden-anniversary"
    },
    {
      title: "Steam Engine Journey",
      category: "love",
      description: "A magical steam train rides across the screen blowing its horn, each carriage carrying a custom photo memory.",
      icon: <Heart className="w-6 h-6 text-emerald-500" />,
      color: "from-emerald-400 to-teal-600",
      bgClass: "bg-emerald-50",
      imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=800",
      premium: true,
      price: 299,
      rating: 5.0,
      usedCount: 850,
      href: "/preview/train-journey"
    },
    {
      title: "Fire Rockets Surprise",
      category: "love",
      description: "Interactive fire rockets sit on the screen. Tap them to launch them into the sky where they explode into memories.",
      icon: <Sparkles className="w-6 h-6 text-orange-500" />,
      color: "from-orange-400 to-red-600",
      bgClass: "bg-orange-50",
      imageUrl: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=800",
      premium: true,
      price: 249,
      rating: 4.8,
      usedCount: 1100,
      href: "/preview/fire-rockets"
    },
    {
      title: "Floating Polaroids",
      category: "family",
      description: "Beautiful Helium balloons float onto the screen randomly dragging threads attached to your personal photo memories.",
      icon: <Cake className="w-6 h-6 text-sky-500" />,
      color: "from-sky-400 to-blue-500",
      bgClass: "bg-sky-50",
      imageUrl: "https://images.unsplash.com/photo-1507504031003-b417219a0fde?q=80&w=800",
      premium: true,
      price: 199,
      rating: 4.7,
      usedCount: 1600,
      href: "/preview/floating-balloons"
    },
    {
      title: "Baby Kiss Delivery",
      category: "love",
      description: "A super cute baby character slowly walks holding a thread dragging 4 photo memories, leaving an exploding kiss.",
      icon: <Smile className="w-6 h-6 text-pink-500" />,
      color: "from-pink-300 to-rose-400",
      bgClass: "bg-pink-50",
      imageUrl: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800",
      premium: true,
      price: 299,
      rating: 4.9,
      usedCount: 780,
      href: "/preview/baby-kiss"
    },
    {
      title: "The Long Ride 🚘",
      category: "love",
      description: "A fun interactive experience where a car drives up to ask them on an impromptu long ride.",
      icon: <MapPin className="w-6 h-6 text-indigo-500" />,
      color: "from-indigo-400 to-purple-600",
      bgClass: "bg-indigo-50",
      imageUrl: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=800",
      premium: true,
      price: 149,
      rating: 4.6,
      usedCount: 3200,
      href: "/preview/long-ride"
    },
    {
      title: "Interactive Date Invite",
      category: "love",
      description: "Ask them out beautifully and let them pick the exact vibe they want: Coffee, Movie, or Fine Dining!",
      icon: <Coffee className="w-6 h-6 text-amber-600" />,
      color: "from-amber-100 to-orange-300",
      bgClass: "bg-orange-50",
      imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800",
      premium: true,
      price: 199,
      rating: 4.8,
      usedCount: 2400,
      href: "/preview/date-invite"
    },
    {
      title: "Memories Snake Trail",
      category: "love",
      description: "A cinematic trail of your most precious memories follows your cursor everywhere.",
      icon: <Sparkles className="w-6 h-6 text-rose-400" />,
      color: "from-rose-400 to-purple-600",
      bgClass: "bg-rose-50",
      imageUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7",
      premium: true,
      price: 149,
      rating: 4.9,
      usedCount: 1500,
      href: "/preview/snake-trail"
    },
    {
      title: "Floating Memories 🫧",
      category: "love",
      description: "A magical experience where your photos float like bubbles. Pop them to reveal a hidden romantic message.",
      icon: <Sparkles className="w-6 h-6 text-blue-400" />,
      color: "from-blue-300 to-indigo-500",
      bgClass: "bg-blue-50",
      imageUrl: "https://images.unsplash.com/photo-1507504031003-b417219a0fde",
      premium: true,
      price: 199,
      rating: 4.7,
      usedCount: 2100,
      href: "/preview/floating-memories"
    },
    {
      title: "I'm So Sorry 🥺",
      category: "sorry",
      description: "An emotional collage of your best photos with deep, heartfelt background music and a slow-scrolling apology letter.",
      icon: <MessageCircleHeart className="w-6 h-6 text-blue-500" />,
      color: "from-blue-400 to-indigo-500",
      bgClass: "bg-blue-50",
      imageUrl: "https://images.unsplash.com/photo-1516410529446-2c777cb7366d?q=80&w=800",
      premium: true,
      price: 99,
      badge: "NEW",
      rating: 4.8,
      usedCount: 450,
      href: "/preview/sorry"
    },
    {
      title: "The Ultimate Prank 😈",
      category: "fun",
      description: "Starts like a beautiful romantic proposal but mid-way plays a hilarious meme or jumpscare.",
      icon: <Sparkles className="w-6 h-6 text-orange-600" />,
      color: "from-orange-500 to-red-600",
      bgClass: "bg-orange-50",
      imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800",
      premium: true,
      price: 149,
      badge: "FUN",
      rating: 5.0,
      usedCount: 890,
      href: "/preview/prank"
    },
    {
      title: "Corporate Farewell",
      category: "friends",
      description: "A digital memory book for colleagues. Professional yet touching timeline of project wins and team photos.",
      icon: <Coffee className="w-6 h-6 text-slate-500" />,
      color: "from-slate-400 to-slate-600",
      bgClass: "bg-slate-50",
      imageUrl: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800",
      premium: true,
      price: 199,
      badge: "PRO",
      rating: 4.7,
      usedCount: 320,
      href: "/preview/farewell"
    }
  ];

  const filteredThemes = themes.filter(t => {
    const categoryMatch = activeCategory === 'love'
      ? ['love', 'proposals', 'anniversaries', 'dates'].includes(t.category)
      : t.category === activeCategory;
    const searchMatch = !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const priceMatch = priceFilter === 'all' || (priceFilter === 'free' && t.price === 0) || (priceFilter === 'paid' && t.price > 0);
    return categoryMatch && searchMatch && priceMatch;
  });

  const suggestions = searchQuery.length > 1 ? themes.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 4) : [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row pt-20 page-fade-in">
      
      <div className="md:hidden flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3 sticky top-20 z-30">
        <span className="font-bold text-gray-800 flex items-center gap-2">
          Occasions & Themes
        </span>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-pink-50 text-pink-600 rounded-lg">
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {(mobileMenuOpen) && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-200 overflow-hidden sticky top-[132px] z-30"
          >
            <div className="p-4 space-y-2">
              {occasions.map((occ) => (
                 <button 
                   key={occ.id}
                   onClick={() => { setActiveCategory(occ.id); setMobileMenuOpen(false); }}
                   className={`w-full flex justify-between items-center px-4 py-3 rounded-xl transition-all ${activeCategory === occ.id ? 'bg-pink-50 text-pink-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                 >
                   <div className="flex items-center gap-3">
                     <span className={activeCategory === occ.id ? 'text-pink-500' : 'text-gray-400'}>{occ.icon}</span>
                     {occ.name}
                   </div>
                   <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">{occ.count}</span>
                 </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <aside className="w-full md:w-72 bg-white border-r border-gray-200 min-h-screen md:h-[calc(100vh-80px)] md:sticky md:top-20 z-10 hidden sm:flex flex-col">
        <div className="p-6">
           <div className="relative mb-8">
             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
             <input 
               type="text" 
               placeholder="Search templates..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all shadow-sm" 
             />
             <AnimatePresence>
                {suggestions.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden"
                  >
                    {suggestions.map(s => (
                      <button 
                        key={s.title}
                        onClick={() => { setSearchQuery(s.title); }}
                        className="w-full text-left px-4 py-2 text-xs hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        <Search className="w-3 h-3 text-gray-300" />
                        <span className="font-medium text-gray-700">{s.title}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
             </AnimatePresence>
           </div>

           <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 px-2">Price Filter</p>
           <div className="flex gap-2 mb-8 px-2">
              <button 
                onClick={() => setPriceFilter('all')}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${priceFilter === 'all' ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-200 text-gray-500'}`}
              >All</button>
              <button 
                onClick={() => setPriceFilter('free')}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${priceFilter === 'free' ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-gray-200 text-gray-500'}`}
              >Free</button>
              <button 
                onClick={() => setPriceFilter('paid')}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${priceFilter === 'paid' ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white border-gray-200 text-gray-500'}`}
              >Paid</button>
           </div>

           <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 px-2">Occasions Directory</p>
           
           <div className="space-y-1">
             {occasions.map((occ) => (
                  <button 
                    key={occ.id}
                    onClick={() => setActiveCategory(occ.id)}
                    className={`w-full flex justify-between items-center px-4 py-3 rounded-xl transition-all relative ${activeCategory === occ.id ? 'bg-pink-50 text-pink-700 font-bold shadow-sm border border-pink-100' : 'text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-100'}`}
                  >
                    <div className="flex items-center gap-3 text-sm relative z-10">
                      <span className={activeCategory === occ.id ? 'text-pink-500' : 'text-gray-400'}>{occ.icon}</span>
                      {occ.name}
                    </div>
                    {activeCategory === occ.id && (
                      <motion.div 
                        layoutId="active-occ"
                        className="absolute right-2 w-1 h-5 bg-pink-500 rounded-full"
                      />
                    )}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full relative z-10 ${activeCategory === occ.id ? 'bg-pink-200 text-pink-800' : 'bg-gray-100 text-gray-500'}`}>
                      {occ.count}
                    </span>
                  </button>
             ))}
           </div>
        </div>

        <div className="mt-auto p-6 bg-gradient-to-t from-gray-50 to-white/0 border-t border-gray-100">
           <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-5 rounded-2xl border border-indigo-400 shadow-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-white/20 transition-all" />
             <h4 className="font-black text-white text-base mb-1">Custom Request</h4>
             <p className="text-[11px] text-indigo-100 mb-4 leading-tight">Have a unique idea? We'll build it for you in <span className="text-yellow-400 font-bold">24 hours!</span></p>
             <Link href="/custom-request">
               <button className="w-full bg-white text-indigo-700 text-xs font-black py-2.5 rounded-xl hover:bg-yellow-400 hover:text-gray-900 transition-all shadow-lg active:scale-95">Get Started Now</button>
             </Link>
           </div>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 pb-32 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto">
          
          <div className="mb-10">
            <motion.h1 
              key={activeCategory}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl md:text-5xl font-bold text-gray-900 mb-3"
            >
              {occasions.find(o => o.id === activeCategory)?.name || "Templates"}
            </motion.h1>
            <p className="text-gray-500">Pick a cinematic experience and customize it perfectly.</p>
          </div>

          {filteredThemes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredThemes.map((theme, idx) => (
                <div key={theme.title} className="flex flex-col h-full gap-2">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group cursor-pointer hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-500 relative flex flex-col h-full"
                >
                  <div className="absolute top-4 left-4 z-20 flex gap-2">
                    {theme.badge && (
                      <div className="bg-rose-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-lg animate-pulse">
                        {theme.badge}
                      </div>
                    )}
                    {theme.premium && (
                      <div className="bg-white/90 backdrop-blur text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 text-gray-800 shadow-sm">
                        <Lock className="w-3 h-3 text-yellow-500" /> PRO
                      </div>
                    )}
                  </div>

                  <div className={`h-48 w-full ${theme.bgClass} relative overflow-hidden flex flex-col justify-center items-center`}>
                    {theme.imageUrl && (
                      <div className="absolute inset-0">
                        <Image src={`${theme.imageUrl}?q=80&w=800&auto=format&fit=crop`} alt={theme.title} fill className="object-cover opacity-60 mix-blend-multiply group-hover:scale-105 transition-transform duration-700" />
                      </div>
                    )}
                    <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${theme.color} transition-opacity duration-300 group-hover:opacity-40`}></div>
                    
                    <motion.div 
                      animate={{ y: hoveredIndex === idx ? -5 : 0, scale: hoveredIndex === idx ? 1.1 : 1 }}
                      className={`w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center relative z-10 transition-transform duration-300`}
                    >
                      {theme.icon}
                    </motion.div>
                    
                    <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all duration-300 z-10 ${hoveredIndex === idx ? 'opacity-100' : 'opacity-0'}`}>
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-900 shadow-xl transform scale-75 group-hover:scale-100 transition-all duration-300 delay-100">
                          <Play className="w-5 h-5 ml-1 fill-current" />
                        </div>
                        <span className="text-white text-[10px] font-bold tracking-widest uppercase">Quick Preview</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="text-xl font-bold text-gray-800">{theme.title}</h3>
                       <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-[10px] font-bold text-gray-700">{theme.rating}</span>
                       </div>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4">{theme.description}</p>
                    
                    <div className="mt-auto">
                       <div className="flex items-center gap-2 mb-4">
                          <div className="flex -space-x-2">
                             {[...Array(3)].map((_, i) => (
                               <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-gray-200" />
                             ))}
                          </div>
                          <span className="text-[10px] text-gray-400 font-bold">Used {theme.usedCount.toLocaleString()}+ times</span>
                       </div>
                       <div className="pt-5 border-t border-gray-100 flex items-center justify-between">
                          {theme.price === 0 ? (
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">Free Tier</span>
                          ) : (
                            <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full">₹{theme.price} Lite</span>
                          )}
                          
                          <Link 
                            href={theme.href || "/editor"}
                            className="text-gray-900 font-bold text-sm flex items-center gap-1 hover:text-pink-600 transition-colors"
                          >
                            Preview  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                          </Link>
                       </div>
                    </div>
                  </div>
                </motion.div>
              </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
               <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 mb-6">
                 {occasions.find(o => o.id === activeCategory)?.icon || <Cake />}
               </div>
               <h3 className="text-2xl font-bold text-gray-800 mb-2">No themes found</h3>
               <p className="text-gray-500 max-w-sm mb-6">Try adjusting your search or filters to find what you're looking for.</p>
               <button onClick={() => { setSearchQuery(""); setPriceFilter("all"); }} className="bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-full font-bold text-sm transition-colors shadow-lg active:scale-95">
                 Clear all filters
               </button>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}
