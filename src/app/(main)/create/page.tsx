"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  ArrowLeft, Save, Sparkles, Image as ImageIcon, Wand2, 
  Type, Music, Layout, MousePointerClick, PlayCircle, Film,
  Plus, Trash2, Check, SlidersHorizontal, Settings, Clock, Search, QrCode, X,
  Mail, User, Heart, AlertCircle, Copy, ExternalLink, Scan, ChevronDown, ArrowRight
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import CreativeCanvas from "@/components/Editor/CreativeCanvas";
import { AdvancedFilterPanel } from "@/components/Editor/AdvancedFilterPanel";
import { templateRegistry } from "@/lib/templateRegistry";

import BasicsForm from "@/components/BasicsForm";
import EditorPanel from "@/components/Editor/Panels/EditorPanel";
import StylingPanel from "@/components/Editor/StylingPanel";

export default function CreatePage() {
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const router = useRouter();

  // Form Data States
  const [formData, setFormData] = useState({
    partnerName: "",
    yourName: "",
    customerEmail: "",
    location: "",
    question: "Will you marry me?",
  });

  // Editor specific states
  const [activeFilterStyle, setActiveFilterStyle] = useState("");
  const [activeFilterName, setActiveFilterName] = useState("Original");
  const [generatedToken, setGeneratedToken] = useState("");
  const [selectedEffect, setSelectedEffect] = useState("hearts");
  const [selectedFont, setSelectedFont] = useState("elegant");
  const [selectedInspiration, setSelectedInspiration] = useState("memories");
  const [selectedTrack, setSelectedTrack] = useState("Soft Piano (Classic)");
  const [selectedTrackUrl, setSelectedTrackUrl] = useState("/songs/soft-piano.mp3");
  const [evadingNo, setEvadingNo] = useState(true);

  // Music Search States
  const [musicSearchQuery, setMusicSearchQuery] = useState("");
  const [musicResults, setMusicResults] = useState<any[]>([]);
  const [isSearchingMusic, setIsSearchingMusic] = useState(false);

  const searchMusic = async () => {
    if (!musicSearchQuery) return;
    setIsSearchingMusic(true);
    try {
      const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(musicSearchQuery)}&media=music&limit=10`);
      const data = await res.json();
      if (data.results) {
        setMusicResults(data.results.map((r: any) => ({
          id: r.trackId.toString(),
          name: r.trackName,
          artist: r.artistName,
          duration: new Date(r.trackTimeMillis).toISOString().substr(14, 5),
          previewUrl: r.previewUrl,
          artwork: r.artworkUrl100
        })));
      }
    } catch (e) {
      console.error("Music search failed", e);
    } finally {
      setIsSearchingMusic(false);
    }
  };

  // Payment states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'error'>('pending');
  const [hashLink, setHashLink] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [showLivePreview, setShowLivePreview] = useState(false);

  // Tenor GIF Integration
  const fallbackGifs = [
    { id: "1", media_formats: { gif: { url: "https://media.tenor.com/L7r056m3PsoAAAAi/bubu-dudu-kiss.gif" } }, content_description: "Bubu Dudu Kiss" },
    { id: "2", media_formats: { gif: { url: "https://media.tenor.com/978K-Y7kXGMAAAAi/bubu-dudu-love.gif" } }, content_description: "Bubu Dudu Love" },
    { id: "3", media_formats: { gif: { url: "https://media.tenor.com/n14AymtH-JkAAAAi/bubu-dudu.gif" } }, content_description: "Bubu Dudu Happy" },
    { id: "4", media_formats: { gif: { url: "https://media.tenor.com/7A2n2M6E2gQAAAAi/bubu-dudu-bubu.gif" } }, content_description: "Bubu Dudu Poke" },
    { id: "5", media_formats: { gif: { url: "https://media.tenor.com/eE_IfuFqSnsAAAAi/bubu-dudu.gif" } }, content_description: "Bubu Dudu Jump" },
    { id: "6", media_formats: { gif: { url: "https://media.tenor.com/gK9qS3eJ_CMAAAAi/bubu-dudu-hug.gif" } }, content_description: "Bubu Dudu Hug" },
  ];
  
  const [gifs, setGifs] = useState<any[]>(fallbackGifs);
  const [selectedGif, setSelectedGif] = useState<string | null>(null);

  useEffect(() => {
    const fetchGifs = async () => {
      try {
        const res = await fetch(`https://tenor.googleapis.com/v2/search?q=bubu+dudu&key=${process.env.NEXT_PUBLIC_TENOR_API_KEY || ""}&limit=6`);
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          setGifs(data.results);
        }
      } catch(e) {
        console.log("No API key configured, using default Bubu Dudu library");
      }
    };
    fetchGifs();
  }, []);

  useEffect(() => {
    const urls = files.map(file => URL.createObjectURL(file));
    // Combine with uploaded urls if they exist
    return () => urls.forEach(url => URL.revokeObjectURL(url));
  }, [files]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setUploadingMedia(true);
      setUploadError("");

      try {
        for (const file of newFiles) {
          const formData = new FormData();
          formData.append('file', file);
          const response = await fetch('/api/upload/image', {
            method: 'POST',
            body: formData,
          });
          const data = await response.json();
          if (data.success && data.url) {
            setPreviewUrls(prev => [...prev, data.url]);
          } else {
            setUploadError(`Failed to upload ${file.name}: ${data.error}`);
          }
        }
        setFiles(prev => [...prev, ...newFiles]);
      } catch (error: any) {
        setUploadError(error.message || "Failed to upload images");
      } finally {
        setUploadingMedia(false);
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    if (activeImageIndex >= index && activeImageIndex > 0) {
      setActiveImageIndex(prev => prev - 1);
    }
  };

  // filters are managed by AdvancedFilterPanel

  const effects = [
    { id: 'none', name: 'Clean', icon: <Layout className="w-5 h-5 mb-2" /> },
    { id: 'hearts', name: 'Floating Hearts', icon: <Sparkles className="w-5 h-5 mb-2 text-pink-500" /> },
    { id: 'petals', name: 'Rose Petals', icon: <Wand2 className="w-5 h-5 mb-2 text-red-500" /> },
    { id: 'bokeh', name: 'Bokeh Lights', icon: <Film className="w-5 h-5 mb-2 text-yellow-500" /> },
  ];

  const fonts = [
    { id: 'elegant', name: 'Elegant Serif', class: 'font-serif' },
    { id: 'playful', name: 'Playful Sans', class: 'font-sans' },
    { id: 'handwriting', name: 'Romantic Script', class: 'italic' },
  ];

  const audioTracks = [
    { id: 'piano', name: 'Soft Piano (Classic)', duration: '2:45' },
    { id: 'acoustic', name: 'Acoustic Love', duration: '3:10' },
    { id: 'orchestral', name: 'Cinematic Strings', duration: '2:30' },
    { id: 'lofi', name: 'Chill Lo-Fi', duration: '2:15' },
  ];

  return (
    <div className="min-h-screen bg-pink-50/50 p-4 md:p-8 relative overflow-hidden flex flex-col items-center">

      <div className="w-full max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-pink-600 transition-colors font-medium text-sm">
            <ArrowLeft className="mr-2 w-4 h-4" /> Back to Home
          </Link>
          <button 
            onClick={() => {
              localStorage.removeItem('proposalFormData');
              setFormData({ partnerName: "", yourName: "", customerEmail: "", location: "", question: "Will you marry me?" });
              setPreviewUrls([]);
              setFiles([]);
              setStep(1);
            }}
            className="text-xs font-medium text-gray-500 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
          >🔄 Clear Form</button>
        </div>

        {/* Stepper */}
        <div className="flex justify-between items-center mb-8 w-full relative px-4">
          <div className="absolute left-0 top-1/2 w-full h-1 bg-pink-200/50 -z-10 -translate-y-1/2 rounded" />
          <div className="absolute left-0 top-1/2 h-1 bg-gradient-to-r from-pink-400 to-rose-500 -z-10 -translate-y-1/2 rounded transition-all duration-500 ease-out" style={{ width: `${(step - 1) * 33.33}%` }} />
          {[ { num: 1, label: 'Basics' }, { num: 2, label: 'Timeline' }, { num: 3, label: 'Styling' }, { num: 4, label: 'Export' } ].map((s) => (
            <div key={s.num} className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-sm md:text-lg transition-all duration-300 ${step >= s.num ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg' : 'bg-white border-2 border-pink-100 text-gray-400'}`}>
                {step > s.num ? <Check className="w-5 h-5 md:w-6 md:h-6" /> : s.num}
              </div>
              <span className={`text-xs font-semibold ${step >= s.num ? 'text-pink-600' : 'text-gray-400'}`}>{s.label}</span>
            </div>
          ))}
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-[2.5rem] p-6 md:p-10 w-full min-h-[600px] flex flex-col relative shadow-2xl shadow-pink-200/40">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
                <BasicsForm 
                  formData={formData} 
                  updateFormData={(data) => setFormData(prev => ({ ...prev, ...data }))}
                  onNext={() => setStep(2)}
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col h-full">
                <div className="flex justify-between items-end mb-8">
                  <div><h2 className="text-3xl font-bold text-gray-800 mb-2 font-serif">Timeline Editor 🎬</h2><p className="text-gray-500">Customize each slide with cinematic effects and captions.</p></div>
                  <label className="bg-rose-600 text-white px-8 py-3 rounded-full font-bold hover:bg-rose-700 cursor-pointer flex items-center gap-2 shadow-lg shadow-rose-200">
                    <Plus className="w-5 h-5" /> {uploadingMedia ? "Uploading..." : "Add Photos"}
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploadingMedia} />
                  </label>
                </div>
                
                <div className="flex-1 mb-8">
                  {previewUrls.length > 0 ? (
                    <EditorPanel imageUrl={previewUrls[activeImageIndex]} />
                  ) : (
                    <div className="flex-1 bg-gray-50 border-4 border-dashed border-gray-100 rounded-[3rem] flex flex-col items-center justify-center py-20">
                      <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-6"><ImageIcon className="w-10 h-10 text-gray-400" /></div>
                      <h4 className="text-xl font-bold text-gray-400 mb-6 uppercase tracking-widest">No Content Yet</h4>
                      <label className="cursor-pointer bg-gray-900 text-white px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-2xl">
                         Upload First Photo
                         <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                      </label>
                    </div>
                  )}
                </div>
                <div className="mt-8 bg-gray-950 rounded-3xl p-6 border border-gray-800/50 flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                  {previewUrls.map((url, i) => (
                    <div key={i} onClick={() => setActiveImageIndex(i)} className={`h-24 w-24 shrink-0 rounded-2xl overflow-hidden relative cursor-pointer group transition-all ${activeImageIndex === i ? 'ring-4 ring-pink-500 scale-110 shadow-2xl shadow-pink-500/30' : 'opacity-40 hover:opacity-100'}`}>
                      <img src={url} className={`w-full h-full object-cover`} style={{ filter: activeFilterStyle }} />
                      <button onClick={(e) => {e.stopPropagation(); removeFile(i)}} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"><Trash2 className="w-3 h-3" /></button>
                      <div className="absolute bottom-2 right-2 bg-black/60 text-[8px] font-black text-white px-1.5 py-0.5 rounded uppercase tracking-tighter">Slide {i+1}</div>
                    </div>
                  ))}
                  {previewUrls.length === 0 && <div className="w-full flex items-center justify-center py-8 text-gray-600 font-bold text-xs uppercase tracking-[0.2em] italic opacity-50">Timeline starts here...</div>}
                </div>
                <div className="flex justify-between mt-12 pb-10">
                  <button onClick={() => setStep(1)} className="px-10 py-4 font-black text-gray-400 hover:text-gray-800 transition-colors uppercase tracking-[0.2em] text-[10px]">Go Back</button>
                  <button onClick={() => setStep(3)} className="bg-gray-950 text-white px-12 py-4 rounded-full font-black shadow-2xl hover:scale-105 transition-all text-sm tracking-widest flex items-center gap-2">Next: Style & Vibe <ArrowLeft className="rotate-180 w-4 h-4" /></button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col">
                <div className="mb-12 text-center">
                  <h2 className="text-4xl font-bold text-gray-800 mb-2 font-serif">Styling & Score 💎</h2>
                  <p className="text-gray-500 font-medium italic">Pick the perfect background score and romantic overlays.</p>
                </div>
                
                <StylingPanel 
                  selectedOverlay={selectedEffect}
                  onOverlaySelect={setSelectedEffect}
                  selectedTypography={selectedFont}
                  onTypographySelect={setSelectedFont}
                  selectedInspiration={selectedInspiration}
                  onInspirationSelect={setSelectedInspiration}
                  selectedSong={selectedTrack}
                  onSongSelect={(song: any) => {
                    setSelectedTrack(song.title);
                    setSelectedTrackUrl(song.url);
                  }}
                />

                <div className="flex justify-between mt-16 pb-10">
                  <button onClick={() => setStep(2)} className="px-10 py-4 font-black text-gray-400 hover:text-gray-800 transition-colors uppercase tracking-[0.2em] text-[10px]">Go Back</button>
                  <button onClick={() => setStep(4)} className="bg-gray-950 text-white px-16 py-5 rounded-full font-black shadow-2xl hover:scale-105 transition-all text-lg tracking-widest flex items-center gap-4 group">
                    Preview Final 🏹 <ArrowLeft className="rotate-180 w-6 h-6 group-hover:translate-x-2 transition-all" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-black text-gray-800 mb-4 font-serif">Final Review 🎩</h2>
                  <p className="text-gray-500 font-medium italic">Your creation is ready to be locked. One last look?</p>
                </div>
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                   <div className="space-y-6">
                      <div className="bg-gray-50/80 p-8 rounded-[2.5rem] border border-gray-100 relative group overflow-hidden">
                         <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-all"><Layout className="w-20 h-20" /></div>
                         <h4 className="font-black text-gray-400 text-[10px] uppercase tracking-widest mb-6">Project Metadata</h4>
                         <div className="space-y-4 font-serif text-gray-800">
                            <div className="flex justify-between border-b border-gray-200 pb-2"><span>Partner:</span><span className="font-black text-rose-500">{formData.partnerName || '—'}</span></div>
                            <div className="flex justify-between border-b border-gray-200 pb-2 text-sm"><span>Creator:</span><span className="font-bold italic">{formData.yourName || '—'}</span></div>
                            <div className="flex justify-between text-xs opacity-60"><span>Email:</span><span className="font-mono">{formData.customerEmail || '—'}</span></div>
                         </div>
                      </div>
                      <div className="bg-gray-950 p-8 rounded-[2.5rem] border border-gray-800 shadow-2xl">
                         <h4 className="font-black text-gray-500 text-[10px] uppercase tracking-widest mb-6">Technical Render</h4>
                         <div className="grid grid-cols-2 gap-4 text-white/50 text-[10px] font-black uppercase tracking-widest">
                            <div className="bg-white/5 p-4 rounded-2xl flex flex-col gap-1"><span className="text-white/30">VFX</span><span className="text-white text-xs">{selectedEffect}</span></div>
                            <div className="bg-white/5 p-4 rounded-2xl flex flex-col gap-1"><span className="text-white/30">Audio</span><span className="text-white text-xs">{selectedTrack}</span></div>
                         </div>
                      </div>
                   </div>
                   <div className="flex flex-col">
                      <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-[2.5rem] text-white flex-1 flex flex-col shadow-2xl relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-[60px]" />
                         <div className="flex justify-between items-start mb-10">
                            <div><h3 className="text-2xl font-black italic">Premium 🏹</h3><p className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-1">Proposal Access Pack</p></div>
                            <span className="text-3xl font-black text-rose-500">₹99</span>
                         </div>
                         <div className="space-y-4 mb-10">
                            {[ 'Secure Forever Link', 'Limited: 2 Opens', 'Custom Watermark', 'High-Res CDN Render', 'Instant Verification' ].map((f, i) => (
                              <div key={i} className="flex items-center gap-3 text-xs font-medium text-white/80"><Check className="w-4 h-4 text-emerald-400" /> {f}</div>
                            ))}
                         </div>
                         <div className="mt-auto space-x-4 flex">
                           <button onClick={() => setShowLivePreview(true)} className="flex-1 bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl transition-all flex items-center justify-center gap-2">Preview link</button>
                         </div>
                      </div>
                   </div>
                </div>
                <div className="flex justify-center flex-col items-center gap-6 mt-4">
                  <button 
                  onClick={() => { setShowPaymentModal(true); setPaymentStatus('pending'); setPaymentError(''); }}
                  className="bg-rose-600 text-white px-20 py-6 rounded-full font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(225,29,72,0.3)] flex items-center gap-4 group"
                >
                  Pay ₹99 & Lock Link <ArrowLeft className="rotate-180 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </button>
                <button onClick={() => setStep(3)} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-800 transition-colors">Wait, I want to edit more</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* PAYMENT MODAL */}
        <AnimatePresence>
          {showPaymentModal && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => (paymentStatus === 'pending' || paymentStatus === 'error') && setShowPaymentModal(false)} />
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-[3rem] p-4 md:p-10 max-w-4xl w-full relative z-[130] shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex flex-col border border-pink-100 max-h-[95vh] overflow-hidden">
                <button onClick={() => setShowPaymentModal(false)} className="absolute top-8 right-8 text-gray-300 hover:text-gray-600 z-50 p-2 hover:bg-gray-50 rounded-full transition-all"><X className="w-6 h-6" /></button>
                
                {paymentStatus === 'pending' && (
                  <div className="flex flex-col md:flex-row gap-10 overflow-y-auto pr-2 custom-scrollbar w-full mt-4">
                    <div className="flex-1 flex flex-col items-center text-center py-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-rose-100 rounded-[2rem] flex items-center justify-center text-pink-600 mb-6 flex-shrink-0 shadow-inner"><QrCode className="w-10 h-10" /></div>
                      <h3 className="text-3xl font-black text-gray-800 mb-2 font-serif">Unlock Link 💘</h3>
                      <p className="text-gray-500 text-sm mb-10 px-6 font-medium italic">Pay <span className="font-black text-gray-800">₹99</span> via any UPI app to activate your special memory forever.</p>
                      <div className="w-64 h-64 bg-white rounded-[2.5rem] p-6 border-2 border-dashed border-pink-200 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center group mb-8">
                        <img src="/api/payment/upi-qr" alt="Scan to pay" className="w-full h-full object-contain relative z-10" />
                        <div className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity"><QrCode className="w-16 h-16 text-gray-200" /><span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">Scan Service...</span></div>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-black text-pink-600 uppercase tracking-widest bg-rose-50 px-8 py-3 rounded-full border border-rose-100 shadow-sm animate-pulse"><Scan className="w-4 h-4" /> Step 1: Scan & Pay</div>
                    </div>
                    <div className="hidden md:block w-px bg-gray-100 self-stretch my-20" />
                    <div className="flex-1 text-left flex flex-col py-6">
                      <div className="flex-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8 border-b border-gray-50 pb-3">Final Configuration</p>
                        <div className="grid grid-cols-2 gap-4 mb-10">
                           <div className="bg-gray-50/50 p-5 rounded-[1.5rem] border border-gray-100"><p className="text-[8px] text-gray-400 font-black mb-1 uppercase tracking-tight">Access To</p><p className="font-black text-gray-800 truncate text-sm">{formData.partnerName}</p></div>
                           <div className="bg-gray-50/50 p-5 rounded-[1.5rem] border border-gray-100"><p className="text-[8px] text-gray-400 font-black mb-1 uppercase tracking-tight">Storage</p><p className="font-black text-rose-500 text-sm">Forever 🏛️</p></div>
                        </div>
                        <div className="bg-rose-50 border border-rose-100 p-6 rounded-[2rem] mb-10 relative group overflow-hidden">
                           <div className="flex gap-4 relative z-10 items-start">
                             <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center shrink-0 border border-rose-100"><Check className="w-6 h-6 text-rose-500" /></div>
                             <div><p className="font-black text-rose-900 mb-1 uppercase tracking-tighter text-xs">Step 2: Submit Verification</p><p className="text-rose-700 leading-relaxed font-medium text-xs italic">"QR scan karke payment karne ke baad hi 'Payment Completed' press karein."</p></div>
                           </div>
                        </div>
                      </div>
                      <div className="space-y-4 mt-auto">
                        <button 
                          onClick={async () => {
                            if (!formData.customerEmail) { setPaymentError("Email is required"); return; }
                            setPaymentStatus('processing');
                            try {
                               const saveRes = await fetch('/api/proposals/save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ yourName: formData.yourName, partnerName: formData.partnerName, customerEmail: formData.customerEmail, question: formData.question, mediaUrls: previewUrls, musicTrack: selectedTrack, effectType: selectedEffect, filterType: activeFilterStyle, fontStyle: selectedFont }) });
                               const saveData = await saveRes.json();
                               if (!saveRes.ok) { setPaymentError(saveData.error || "Save Failed"); setPaymentStatus('error'); return; }
                               setGeneratedToken(saveData.proposal?.token || "");
                               const payRes = await fetch('/api/payment/create-order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: 99, planType: 'premium', customerName: formData.yourName, customerEmail: formData.customerEmail, partnerName: formData.partnerName, transactionId: saveData.proposal?.transactionId, proposalId: saveData.proposal?.id }) });
                               const data = await payRes.json();
                               if (payRes.ok && data.success) { setTransactionId(data.transactionId || saveData.proposal?.transactionId); setPaymentStatus('success'); } else { setPaymentError(data.message || "Order Error"); setPaymentStatus('error'); }
                            } catch (err: any) { setPaymentError(err.message || "Conn Error"); setPaymentStatus('error'); }
                          }}
                          className="w-full bg-gray-900 text-white py-6 rounded-[1.5rem] font-black hover:bg-black shadow-[0_20px_40px_rgba(0,0,0,0.2)] active:scale-95 transition-all text-xl flex items-center justify-center gap-4 group"
                        >Payment Completed <ArrowLeft className="rotate-180 w-6 h-6 group-hover:translate-x-2 transition-all" /></button>
                        <div className="flex items-center justify-center gap-4 text-[9px] text-gray-400 font-bold uppercase tracking-[0.3em] opacity-40"><span>Verified</span><span>•</span><span>Secure</span><span>•</span><span>Encrypted</span></div>
                      </div>
                    </div>
                  </div>
                )}

                {paymentStatus === 'processing' && (
                  <div className="py-24 flex flex-col items-center text-center grow justify-center">
                    <div className="w-24 h-24 border-[6px] border-rose-50 border-t-rose-600 rounded-full animate-spin mb-10 shadow-inner" />
                    <h3 className="text-4xl font-black text-gray-800 mb-3 font-serif italic">Processing Verification...</h3>
                    <p className="text-gray-400 font-bold tracking-widest text-[10px] uppercase">Contacting administrative secure portal</p>
                  </div>
                )}

                {paymentStatus === 'success' && (
                   <div className="py-16 flex flex-col items-center w-full text-center overflow-y-auto px-6">
                     <div className="w-24 h-24 bg-emerald-500 rounded-[2rem] flex items-center justify-center text-white mb-10 shadow-[0_20px_50px_rgba(16,185,129,0.4)] animate-bounce"><Check className="w-12 h-12 stroke-[4]" /></div>
                     <h3 className="text-5xl font-black text-gray-900 mb-4 font-serif italic">Your Link is Live! 🚀</h3>
                     <p className="text-gray-500 font-medium italic mb-10">Surprise is ready to be delivered. Share the secret link below.</p>
                     
                     {/* SHAREABLE LINK BOX */}
                     <div className="w-full max-w-2xl bg-gray-50 border-2 border-dashed border-emerald-200 p-8 rounded-[2.5rem] mb-12">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4">Secret Memory Link</p>
                        <div className="bg-white p-4 rounded-2xl border border-emerald-100 flex items-center justify-between gap-4 shadow-inner">
                           <p className="text-sm font-mono font-bold text-gray-700 truncate">https://purpose.site/secret/{generatedToken}</p>
                           <button 
                             onClick={() => { 
                               navigator.clipboard.writeText(`https://purpose.site/secret/${generatedToken}`);
                               alert("Link Copied! 💘");
                             }}
                             className="bg-emerald-500 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg hover:bg-emerald-600 transition-all"
                           >Copy</button>
                        </div>
                        <div className="mt-8 flex flex-wrap gap-4 justify-center">
                           <button 
                             onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Hi, I have a secret for you... 🏹\n\nOpen here: https://purpose.site/secret/${generatedToken}`)}`, '_blank')}
                             className="bg-[#25D366] text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2"
                           >WhatsApp Share</button>
                           <button 
                             onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://purpose.site/secret/${generatedToken}`)}`, '_blank')}
                             className="bg-[#0077b5] text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2"
                           >LinkedIn Share</button>
                        </div>
                     </div>

                     <div className="grid md:grid-cols-2 gap-8 w-full max-w-2xl mb-12">
                        <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-[2rem] text-left">
                          <p className="font-black text-blue-900 mb-2 text-[10px] uppercase tracking-widest">Transaction Hash</p>
                          <p className="text-blue-800 font-mono text-[10px] break-all opacity-60">{transactionId}</p>
                        </div>
                        <div className="bg-rose-50/50 border border-rose-100 p-6 rounded-[2rem] text-left">
                          <p className="font-black text-rose-900 mb-2 text-[10px] uppercase tracking-widest">Safety Pack</p>
                          <p className="text-rose-800 text-[10px] font-bold italic">Encrypted & Self-Destructs after 2 views.</p>
                        </div>
                     </div>
                     <button onClick={() => setShowPaymentModal(false)} className="bg-gray-950 text-white px-16 py-5 rounded-full font-black text-lg hover:scale-105 active:scale-95 shadow-2xl transition-all uppercase tracking-widest">Done</button>
                   </div>
                )}

                {paymentStatus === 'error' && (
                  <div className="py-24 flex flex-col items-center w-full text-center">
                    <div className="w-24 h-24 bg-rose-100 rounded-[2rem] flex items-center justify-center text-rose-600 mb-10"><AlertCircle className="w-12 h-12" /></div>
                    <h3 className="text-4xl font-black text-gray-800 mb-4 font-serif italic">Alert! Verification Missed</h3>
                    <p className="text-rose-600 font-bold mb-12 max-w-md bg-rose-50 p-4 rounded-2xl">{paymentError}</p>
                    <div className="flex gap-6">
                      <button onClick={() => setPaymentStatus('pending')} className="bg-rose-500 text-white px-12 py-5 rounded-full font-black hover:bg-rose-600 shadow-xl transition-all">Try Again</button>
                      <button onClick={() => setShowPaymentModal(false)} className="bg-gray-100 text-gray-500 px-12 py-5 rounded-full font-black hover:bg-gray-200 transition-all">Dismiss</button>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

       {/* LIVE PREVIEW OVERLAY */}
       <AnimatePresence>
         {showLivePreview && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black overflow-hidden flex flex-col">
             {/* Audio element for preview */}
             <audio src={selectedTrackUrl || undefined} autoPlay loop />
             
             <div className="absolute top-8 left-8 right-8 z-[210] flex justify-between items-center text-white">
                <div className="bg-white/10 backdrop-blur-3xl px-6 py-2.5 rounded-full border border-white/20 flex items-center gap-3">
                   <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                   <span className="text-[10px] font-black uppercase tracking-[0.3em]">Live Render Mode</span>
                </div>
                <button onClick={() => setShowLivePreview(false)} className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center font-black hover:scale-110 transition-all shadow-2xl shadow-white/20"><X className="w-6 h-6" /></button>
             </div>

             <div className={`flex-1 bg-rose-950 flex flex-col items-center justify-center p-8 text-center text-white ${selectedFont === 'romantic' ? 'font-serif italic' : selectedFont === 'elegant' ? 'font-serif' : 'font-sans'}`}>
                {previewUrls.length > 0 ? (
                  <div className="w-full h-full relative snap-y snap-mandatory overflow-y-scroll overflow-x-hidden custom-scrollbar scroll-smooth">
                     {previewUrls.map((url, i) => (
                       <div key={i} className="snap-start h-screen w-full relative flex items-center justify-center overflow-hidden">
                          <img src={url} className="absolute inset-0 w-full h-full object-cover opacity-50 scale-110" style={{ filter: activeFilterStyle }} />
                          
                          {/* VFX Layer Preview */}
                          {selectedEffect === 'hearts' && (
                             <div className="absolute inset-0 z-20 pointer-events-none opacity-40 bg-[url('https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif')] bg-cover mix-blend-screen scale-125" />
                          )}
                          {selectedEffect === 'petals' && (
                             <div className="absolute inset-0 z-20 pointer-events-none opacity-30 bg-[url('https://media.giphy.com/media/l41lTfJvP2uX7O5tC/giphy.gif')] bg-cover mix-blend-screen scale-150" />
                          )}

                          <div className="relative z-30 flex flex-col items-center p-12">
                             {i === 0 && (
                               <motion.div initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 1 }}>
                                 <h1 className="text-6xl md:text-9xl font-black mb-8 italic tracking-tighter drop-shadow-2xl">Hi {formData.partnerName}</h1>
                                 <p className="text-xl md:text-2xl text-rose-200/80 font-medium italic">Wait till the end. Sending love from {formData.yourName} ❤️</p>
                               </motion.div>
                             )}
                             {i === previewUrls.length - 1 && (
                               <motion.div initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} className="mt-20">
                                 <div className="w-32 h-32 bg-rose-600 rounded-full flex items-center justify-center mx-auto mb-12 shadow-[0_0_80px_rgba(225,29,72,0.6)] animate-pulse">
                                    <Heart className="w-16 h-16 fill-current text-white" />
                                 </div>
                                 <h2 className="text-5xl md:text-8xl font-black mb-16 leading-[0.85] tracking-tighter drop-shadow-2xl">
                                   {formData.question}
                                 </h2>
                                 <div className="flex flex-wrap gap-6 justify-center">
                                    <button className="bg-emerald-500 text-white px-16 py-6 rounded-full font-black text-2xl shadow-[0_20px_60px_rgba(16,185,129,0.4)]">YES! 💍</button>
                                    <button className="bg-white/10 backdrop-blur-xl border border-white/20 text-white px-16 py-6 rounded-full font-black text-2xl">Always ❤️</button>
                                 </div>
                               </motion.div>
                             )}
                             {i < previewUrls.length - 1 && (
                               <div className="mt-40 animate-bounce bg-white/10 p-5 rounded-full backdrop-blur-xl border border-white/20"><ChevronDown className="w-8 h-8 text-white/50" /></div>
                             )}
                          </div>
                       </div>
                     ))}
                  </div>
                ) : (
                  <div className="space-y-8">
                     <div className="w-24 h-24 bg-rose-900 border border-rose-800 rounded-full flex items-center justify-center mx-auto animate-pulse"><Heart className="w-10 h-10 text-rose-500" /></div>
                     <h2 className="text-4xl font-black italic tracking-widest text-white/20 uppercase">No Content</h2>
                     <p className="text-rose-200/40 max-w-xs mx-auto font-medium">Please upload photos to see the live render.</p>
                  </div>
                )}
             </div>

             {/* View Counter Dashboard Preview */}
             <div className="fixed bottom-8 left-8 right-8 z-[210] pointer-events-none flex justify-between items-end">
                <div className="bg-black/60 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/10 flex items-center gap-6 pointer-events-auto">
                   <div className="relative w-16 h-16">
                      <svg className="w-full h-full rotate-[-90deg]">
                         <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-white/10" />
                         <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-rose-500" strokeDasharray={175} strokeDashoffset={175 - (175 * (0.5))} strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-black">0/2</div>
                   </div>
                   <div>
                      <h5 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Preview Logic</h5>
                      <p className="text-xs font-bold text-white uppercase italic">Cinematic Verification</p>
                   </div>
                </div>
                <div className="bg-rose-600 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-2xl pointer-events-auto">
                   Final Activation Required
                </div>
             </div>
           </motion.div>
         )}
       </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(225,29,72,0.1); border-radius: 10px; transition: all 0.3s; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(225,29,72,0.3); }
        .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }
      `}</style>
    </div>
  );
}
