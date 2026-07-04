"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clapperboard, HeartHandshake, Sparkles, Smile, Globe,
  BookHeart, Gift, Search, ArrowRight, Lightbulb, X
} from "lucide-react";
import Link from "next/link";

// ── colour tokens per category ─────────────────────────────────────────────
const CAT_STYLES: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  all:      { bg: "bg-rose-500",   text: "text-white",     border: "border-rose-500",   dot: "bg-rose-400"   },
  romantic: { bg: "bg-pink-500",   text: "text-white",     border: "border-pink-500",   dot: "bg-pink-400"   },
  filmy:    { bg: "bg-purple-500", text: "text-white",     border: "border-purple-500", dot: "bg-purple-400" },
  surprise: { bg: "bg-amber-500",  text: "text-white",     border: "border-amber-500",  dot: "bg-amber-400"  },
  funny:    { bg: "bg-orange-500", text: "text-white",     border: "border-orange-500", dot: "bg-orange-400" },
  creative: { bg: "bg-teal-500",   text: "text-white",     border: "border-teal-500",   dot: "bg-teal-400"   },
  deep:     { bg: "bg-indigo-500", text: "text-white",     border: "border-indigo-500", dot: "bg-indigo-400" },
};

const CARD_ACCENTS = [
  "from-rose-50 to-pink-50",
  "from-purple-50 to-indigo-50",
  "from-amber-50 to-yellow-50",
  "from-teal-50 to-emerald-50",
  "from-blue-50 to-cyan-50",
  "from-orange-50 to-red-50",
];

export default function IdeasVaultPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all",      name: "All Ideas",           icon: <Sparkles className="w-4 h-4" />,      count: 24 },
    { id: "romantic", name: "Emotional & Romantic", icon: <HeartHandshake className="w-4 h-4" />, count: 6  },
    { id: "filmy",    name: "Filmy Style",           icon: <Clapperboard className="w-4 h-4" />,  count: 5  },
    { id: "surprise", name: "Surprises",             icon: <Gift className="w-4 h-4" />,           count: 4  },
    { id: "funny",    name: "Fun & Cute",             icon: <Smile className="w-4 h-4" />,          count: 4  },
    { id: "creative", name: "Creative Concepts",     icon: <Globe className="w-4 h-4" />,          count: 3  },
    { id: "deep",     name: "Deep & Personal",       icon: <BookHeart className="w-4 h-4" />,      count: 3  },
  ];

  const ideas = [
    { category: "romantic", title: '"Our Journey" Timeline',     desc: "First chat se ab tak ki kahani. Present a timeline of memories.",                      tag: "Emotional"  },
    { category: "romantic", title: "Voice-over Memories",        desc: "Har memory ke saath voice-over: 'Tab mujhe nahi pata tha…'",                           tag: "Cinematic"  },
    { category: "romantic", title: "Future Vision",              desc: "Video of your plans: '5 saal baad hum…'",                                              tag: "Romantic"   },
    { category: "romantic", title: "B&W to Colorful",            desc: "Black & white past evolving into a colorful present transition.",                       tag: "Cinematic"  },
    { category: "romantic", title: "Handwritten Letters",        desc: "Showcase your actual letters visually fading in on screen.",                            tag: "Classic"    },
    { category: "romantic", title: "50 Reasons I Love You",      desc: "Numbered countdown of the top 50 things you adore about them.",                         tag: "Emotional"  },
    { category: "filmy",    title: "Bollywood Trailer",          desc: "Movie trailer voice: 'Ek ladka, ek ladki…'",                                            tag: "Filmy"      },
    { category: "filmy",    title: "Movie Poster Intro",         desc: "Start with a cinematic poster featuring both of you.",                                   tag: "Cinematic"  },
    { category: "filmy",    title: "DDLJ Vibe Dialogues",        desc: "Recreate their favorite dramatic movie dialogues.",                                      tag: "Filmy"      },
    { category: "filmy",    title: "Climax Scene Proposal",      desc: "Treat the final question like a blockbuster movie climax.",                              tag: "Drama"      },
    { category: "filmy",    title: "Parallel Universe",          desc: 'Filmy "flashback-present-future" interconnected story montage.',                        tag: "Cinematic"  },
    { category: "surprise", title: "Puzzle Video",               desc: "Video needs to be decoded. End reveals the actual proposal!",                            tag: "Interactive"},
    { category: "surprise", title: "QR Code Secret",             desc: "Flash a QR code inside the video that links to the 'Yes/No' page.",                     tag: "Tech"       },
    { category: "surprise", title: "Hidden Clues",               desc: "Har scene me ek clue, end scene reveals the final surprise location.",                  tag: "Mystery"    },
    { category: "surprise", title: "Interrupted Video",          desc: "Family members suddenly take over the video feed to hype it up.",                        tag: "Fun"        },
    { category: "funny",    title: "Bloopers & Fights",          desc: "A montage of your silliest fights and camera bloopers.",                                 tag: "Funny"      },
    { category: "funny",    title: "Expectation vs Reality",     desc: "Hilarious relationship video comparing expectations vs your real lives.",                 tag: "Comedy"     },
    { category: "funny",    title: "Funny Interview",            desc: "Sit down interview format: 'Why should she actually marry me?'",                         tag: "Comedy"     },
    { category: "funny",    title: "Meme-style Love Story",      desc: "Using trending memes like Bubu Dudu to express your love.",                              tag: "Viral"      },
    { category: "creative", title: "Google Search Style",        desc: "Typing 'Best Wife' into a mock Google search that reveals their photo.",                  tag: "Creative"   },
    { category: "creative", title: "Time-Lapse",                 desc: "A day-to-night transition building up to the final proposal text.",                      tag: "Cinematic"  },
    { category: "creative", title: "Seasons Concept",            desc: "Show summer to winter, proving love remains constant.",                                   tag: "Poetic"     },
    { category: "deep",     title: "Things I Never Said",        desc: "A raw, vulnerable video confessing deep feelings.",                                       tag: "Emotional"  },
    { category: "deep",     title: "Gratitude List",             desc: "Highlighting their exact efforts and how they changed your life.",                        tag: "Heartfelt"  },
    { category: "deep",     title: "Voice Notes Compilation",    desc: "Using real WhatsApp audio notes over a romantic song montage.",                          tag: "Personal"   },
  ];

  const filtered = useMemo(() => {
    return ideas.filter((idea) => {
      const catMatch = activeCategory === "all" || idea.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const searchMatch = !q || idea.title.toLowerCase().includes(q) || idea.desc.toLowerCase().includes(q) || idea.tag.toLowerCase().includes(q);
      return catMatch && searchMatch;
    });
  }, [activeCategory, searchQuery]);

  const activeCatStyle = CAT_STYLES[activeCategory] ?? CAT_STYLES.all;

  return (
    <div className="min-h-screen bg-[#FAFAFA] page-fade-in">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden pt-28 pb-16 px-6 text-center">
        {/* background blobs */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-rose-100/50 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-black uppercase tracking-widest mb-6"
        >
          <Lightbulb className="w-3.5 h-3.5" /> Inspiration Vault
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-black text-gray-900 mb-4 font-serif tracking-tight"
        >
          The <span className="gradient-text">Inspiration</span> Vault 💡
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-500 text-lg max-w-xl mx-auto leading-[1.7] mb-10"
        >
          {filtered.length} creative ideas — pick one, then build it in the editor.
        </motion.p>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative max-w-md mx-auto"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ideas, tags…"
            className="w-full bg-white border border-gray-200 rounded-full pl-11 pr-10 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300 shadow-sm transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      </div>

      {/* ── Category tabs ────────────────────────────────────────────────── */}
      <div className="px-6 pb-8 max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-center gap-2.5">
          {categories.map((cat) => {
            const active = activeCategory === cat.id;
            const s = CAT_STYLES[cat.id];
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm border transition-all duration-200 ${
                  active
                    ? `${s.bg} ${s.text} ${s.border} shadow-md`
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {cat.icon}
                {cat.name}
                <span
                  className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                    active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Ideas Grid ───────────────────────────────────────────────────── */}
      <div className="px-6 pb-24 max-w-7xl mx-auto">
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((idea, idx) => {
                const s = CAT_STYLES[idea.category] ?? CAT_STYLES.all;
                const accent = CARD_ACCENTS[idx % CARD_ACCENTS.length];
                return (
                  <motion.div
                    layout
                    key={idea.title}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, delay: idx * 0.04 }}
                    className={`bg-gradient-to-br ${accent} border border-white rounded-3xl p-7 shadow-sm hover:shadow-xl hover:shadow-rose-100 transition-all duration-300 group flex flex-col`}
                  >
                    {/* Tag badge */}
                    <div className="flex items-center justify-between mb-5">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>
                        {idea.tag}
                      </span>
                      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                    </div>

                    <h3 className="text-lg font-black text-gray-900 mb-2 leading-snug group-hover:text-rose-600 transition-colors">
                      {idea.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-[1.7] flex-1">{idea.desc}</p>

                    <div className="mt-6 pt-5 border-t border-white/60">
                      <Link
                        href="/create"
                        className="text-gray-700 hover:text-rose-600 font-bold text-xs flex items-center gap-1.5 transition-colors group-hover:gap-3"
                      >
                        Use this concept <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 mb-4">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No ideas found</h3>
              <p className="text-gray-400 text-sm mb-5">Try a different search or category.</p>
              <button
                onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
                className="bg-gray-900 text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-black transition-all"
              >
                Clear filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Pro Tips ─────────────────────────────────────────────────────── */}
      <div className="px-6 pb-16 max-w-7xl mx-auto">
        <div className="bg-gray-900 text-white rounded-[2.5rem] p-10 md:p-14 border border-gray-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px]" />
          <h2 className="text-2xl md:text-3xl font-black mb-8 flex items-center gap-3 relative z-10">
            <Sparkles className="text-yellow-400 w-6 h-6" /> Pro Tips
          </h2>
          <ul className="text-gray-300 space-y-4 max-w-2xl relative z-10">
            {[
              { emoji: "🌟", bold: "Keep it short:", text: "2-4 minutes max for highest emotional impact." },
              { emoji: "🎵", bold: "Audio matters:", text: "Use slow, cinematic piano or their favorite acoustic cover." },
              { emoji: "💯", bold: "Real emotions:", text: "The final shot should be your 100% genuine face or reaction." },
              { emoji: "💍", bold: "Clear Climax:", text: "Ensure the final proposal line holds on screen clearly." },
            ].map((tip) => (
              <li key={tip.bold} className="flex items-start gap-3 text-base">
                <span className="text-xl">{tip.emoji}</span>
                <span><strong className="text-white">{tip.bold}</strong> {tip.text}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 relative z-10">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 bg-white text-gray-900 font-black text-sm px-7 py-3.5 rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              Start Building Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
