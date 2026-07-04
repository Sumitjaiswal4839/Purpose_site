"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Sparkles, Type, Layout, Music, Check, Wand2, Search, Plus } from "lucide-react";
import { templateRegistry } from "@/lib/templateRegistry";

interface Song {
  id?: string;
  title: string;
  artist?: string;
  artwork?: string;
  url: string;
  duration: string;
}

const overlays = [
  { id: "clean", name: "Clean", icon: <Layout className="w-4 h-4" /> },
  { id: "hearts", name: "Floating Hearts", icon: <Sparkles className="w-4 h-4 text-pink-500" /> },
  { id: "petals", name: "Rose Petals", icon: <Wand2 className="w-4 h-4 text-red-500" /> },
  { id: "highlights", name: "Box Highlights", icon: <Type className="w-4 h-4 text-indigo-500" /> }
];

const typography = [
  { id: "elegant", name: "Elegant Serif", class: "font-serif" },
  { id: "playful", name: "Playful Sans", class: "font-sans font-bold" },
  { id: "romantic", name: "Romantic Script", class: "italic font-serif" }
];

interface StylingPanelProps {
  selectedOverlay: string;
  onOverlaySelect: (id: string) => void;
  selectedTypography: string;
  onTypographySelect: (id: string) => void;
  selectedInspiration: string;
  onInspirationSelect: (id: string) => void;
  selectedSong: string | null;
  onSongSelect: (song: Song) => void;
}

const StylingPanel: React.FC<StylingPanelProps> = ({
  selectedOverlay,
  onOverlaySelect,
  selectedTypography,
  onTypographySelect,
  selectedInspiration,
  onInspirationSelect,
  selectedSong,
  onSongSelect,
}) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicSearchQuery, setMusicSearchQuery] = useState("");
  const [musicResults, setMusicResults] = useState<Song[]>([]);
  const [isSearchingMusic, setIsSearchingMusic] = useState(false);

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, [audio]);

  const searchMusic = async () => {
    if (!musicSearchQuery.trim()) return;
    setIsSearchingMusic(true);
    try {
      const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(musicSearchQuery)}&media=music&limit=10`);
      const data = await res.json();
      const formatted = data.results.map((r: any) => ({
        id: r.trackId.toString(),
        title: r.trackName,
        artist: r.artistName,
        artwork: r.artworkUrl100,
        url: r.previewUrl,
        duration: "0:30"
      }));
      setMusicResults(formatted);
    } catch (error) {
      console.error("Music search failed", error);
    } finally {
      setIsSearchingMusic(false);
    }
  };

  const handlePlaySong = (song: Song) => {
    if (audio) {
      if (selectedSong === song.title) {
        if (isPlaying) {
          audio.pause();
          setIsPlaying(false);
        } else {
          audio.play();
          setIsPlaying(true);
        }
        return;
      }
      audio.pause();
    }

    const newAudio = new Audio(song.url);
    newAudio.play().catch(e => console.log("Audio play failed:", e));
    setAudio(newAudio);
    setIsPlaying(true);
    onSongSelect(song);
  };

  const defaultSongs: Song[] = [
    { title: "Soft Piano (Classic)", url: "/songs/soft-piano.mp3", duration: "2:45" },
    { title: "Acoustic Love", url: "/songs/acoustic-love.mp3", duration: "3:10" },
    { title: "Cinematic Strings", url: "/songs/cinematic-strings.mp3", duration: "2:50" },
  ];

  return (
    <div className="flex flex-col gap-12 w-full max-w-7xl mx-auto px-4">
      {/* Visual Options Row */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-6 px-1">
              <Sparkles className="w-5 h-5 text-pink-500" />
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-800">Interactive VFX Overlay</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {overlays.map((o) => (
                <button
                  key={o.id}
                  onClick={() => onOverlaySelect(o.id)}
                  className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${
                    selectedOverlay === o.id 
                      ? "bg-white border-pink-500 shadow-xl scale-105 text-pink-600" 
                      : "bg-gray-50 border-transparent text-gray-400 hover:bg-white/80"
                  }`}
                >
                  {o.icon}
                  <span className="text-[10px] font-black uppercase tracking-widest">{o.name}</span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6 px-1">
              <Type className="w-5 h-5 text-indigo-500" />
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-800">Typography Style</h3>
            </div>
            <div className="space-y-3">
              {typography.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onTypographySelect(t.id)}
                  className={`w-full p-6 rounded-[1.5rem] border-2 transition-all flex justify-between items-center ${
                    selectedTypography === t.id 
                      ? "bg-white border-indigo-500 shadow-lg text-indigo-900" 
                      : "bg-gray-50 border-transparent text-gray-500 hover:bg-white/80"
                  }`}
                >
                  <span className={`text-xl ${t.class}`}>{t.name}</span>
                  {selectedTypography === t.id && <Check className="w-5 h-5 text-indigo-500" />}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Audio Search & Library */}
        <div className="bg-gray-950 rounded-[2.5rem] p-8 lg:p-10 relative overflow-hidden shadow-2xl flex flex-col min-h-[600px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-3">
              <Music className="w-5 h-5 text-emerald-400" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400/80">Global Score Library</h3>
            </div>
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>

          {/* Search Bar */}
          <div className="relative mb-8 z-10">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search Instagram/TikTok songs..." 
              value={musicSearchQuery}
              onChange={(e) => setMusicSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchMusic()}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-24 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
            <button 
              onClick={searchMusic}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-500 text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-400 transition-colors"
            >
              {isSearchingMusic ? "..." : "Search"}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 relative z-10">
            {musicResults.length > 0 ? (
              <div className="space-y-3">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Search Results</p>
                {musicResults.map(s => (
                  <div key={s.id} className={`p-4 rounded-2xl flex items-center justify-between transition-all ${selectedSong === s.title ? "bg-white/10 border border-emerald-500/30" : "bg-white/5 hover:bg-white/[0.08]"}`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={s.artwork} className="w-10 h-10 rounded-lg shrink-0" />
                      <div className="min-w-0">
                        <p className="text-white font-bold text-xs truncate">{s.title}</p>
                        <p className="text-gray-500 text-[10px] truncate">{s.artist}</p>
                      </div>
                    </div>
                    <button onClick={() => handlePlaySong(s)} className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedSong === s.title && isPlaying ? "bg-emerald-500 text-white" : "bg-white/10 text-white"}`}>
                      {selectedSong === s.title && isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </button>
                  </div>
                ))}
              </div>
            ) : null}

            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Recommended for You</p>
            {defaultSongs.map((s) => (
              <div key={s.title} className={`p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between ${selectedSong === s.title ? "bg-white/10 border-emerald-500/50" : "bg-white/5 border-transparent"}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedSong === s.title ? "bg-emerald-500 text-white" : "bg-white/10 text-gray-400"}`}><Music className="w-5 h-5" /></div>
                  <div><p className="text-white font-bold text-sm">{s.title}</p><p className="text-[10px] text-gray-500 font-black tracking-widest">{s.duration}</p></div>
                </div>
                <button onClick={() => handlePlaySong(s)} className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedSong === s.title && isPlaying ? "bg-white text-black" : "bg-white/10 text-white"}`}>
                  {selectedSong === s.title && isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🎨 Visual Inspiration & Archetypes (Templates) */}
      <section className="mt-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-800">Visual Inspiration & Archetypes</h3>
            <p className="text-sm text-gray-500 font-medium italic">Select a movement style to automatically configure your experience.</p>
          </div>
          <div className="flex items-center gap-2 bg-pink-50 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-ping" />
            <span className="text-[10px] font-black text-pink-600 uppercase tracking-widest">Live Suggestions</span>
          </div>
        </div>
        
        <div className="flex gap-6 overflow-x-auto pb-8 pt-2 px-2 -mx-2 custom-scrollbar">
          {templateRegistry.map((template, idx) => (
            <motion.div 
              key={template.id}
              whileHover={{ y: -10 }}
              onClick={() => {
                onInspirationSelect(template.id);
                // Auto-configure associated styles
                if (template.id === 'snake-trail') {
                  onOverlaySelect('petals');
                  onTypographySelect('romantic');
                } else if (template.id === 'floating-memories') {
                  onOverlaySelect('hearts');
                  onTypographySelect('elegant');
                } else if (template.id === 't01') {
                  onOverlaySelect('highlights');
                  onTypographySelect('playful');
                }
              }}
              className={`w-80 shrink-0 bg-white rounded-[2.5rem] border-2 transition-all cursor-pointer overflow-hidden group shadow-sm hover:shadow-2xl ${selectedInspiration === template.id ? 'border-pink-500 ring-4 ring-pink-50' : 'border-gray-100'}`}
            >
              <div className="h-44 bg-gray-100 relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br from-rose-400 to-pink-500 opacity-20 group-hover:opacity-40 transition-opacity`} />
                <div className="absolute inset-0 flex items-center justify-center">
                   <Sparkles className={`w-12 h-12 text-rose-400 opacity-30 group-hover:scale-125 transition-transform duration-500`} />
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                   <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-gray-800">{template.type}</div>
                   <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:bg-pink-500 group-hover:text-white transition-colors">
                     <Plus className="w-5 h-5" />
                   </div>
                </div>
              </div>
              <div className="p-8">
                <h5 className="font-bold text-gray-800 mb-2 flex items-center justify-between text-lg">
                  {template.title}
                  {template.badge && <span className="text-[8px] bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full">{template.badge}</span>}
                </h5>
                <p className="text-xs text-gray-500 leading-relaxed italic font-medium">"{template.desc}"</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default StylingPanel;
