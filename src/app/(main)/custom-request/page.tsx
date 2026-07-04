"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Send, CheckCircle2, Loader2, Sparkles, User, Mail, Phone, Users, DollarSign, Calendar, MessageSquare, AlertCircle } from "lucide-react";

// ── Toast ─────────────────────────────────────────────────────────────────
function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className={`fixed bottom-24 md:bottom-10 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2.5 px-5 py-3 rounded-full shadow-xl text-sm font-bold whitespace-nowrap ${
        type === "success"
          ? "bg-emerald-600 text-white shadow-emerald-600/30"
          : "bg-red-600 text-white shadow-red-600/30"
      }`}
    >
      {type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      {message}
    </motion.div>
  );
}

export default function CustomRequestPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    forWhom: "",
    theme: "",
    budget: "Let me know",
    special: "",
    urgency: "Koi rush nahi"
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch("/api/custom-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        showToast("Request received! Hum contact karenge 💌", "success");
      } else {
        setError(data.error || "Kuch gadbad ho gayi. Please try again.");
        showToast(data.error || "Something went wrong.", "error");
      }
    } catch (err: any) {
      console.error(err);
      const msg = `Error: ${err.message || "Server connection failed"}.`;
      setError(msg);
      showToast("Connection failed. Please retry.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-rose-50/50 pt-32 pb-20 px-4 page-fade-in">
      {/* Toast */}
      <AnimatePresence>{toast && <Toast message={toast.message} type={toast.type} />}</AnimatePresence>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
           <motion.div 
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             className="w-20 h-20 bg-rose-200 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500 shadow-xl shadow-rose-200/50"
           >
              <Heart className="w-10 h-10 fill-current" />
           </motion.div>
           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-4xl md:text-5xl font-black mb-4 font-serif leading-[1.3] bg-gradient-to-r from-rose-600 via-pink-600 to-red-500 bg-clip-text text-transparent"
           >
             Kuch Khaas Chahiye? Batao Hame 💌
           </motion.h1>
           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-rose-700/80 text-lg leading-relaxed max-w-xl mx-auto"
           >
             Share your dream proposal or surprise idea. We will build a completely custom, stunning 3D web experience just for you.
           </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div 
              key="success"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[2.5rem] p-12 text-center shadow-2xl shadow-rose-100 border border-rose-100 relative overflow-hidden"
            >
               {/* Floating Heart Particles */}
               {[...Array(6)].map((_, i) => (
                 <motion.div
                   key={i}
                   initial={{ y: 100, x: Math.random() * 400 - 200, opacity: 0 }}
                   animate={{ y: -400, opacity: [0, 1, 0] }}
                   transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                   className="absolute bottom-0 text-rose-300 pointer-events-none"
                 >
                   <Heart size={20 + Math.random() * 20} fill="currentColor" />
                 </motion.div>
               ))}

               <div className="relative z-10">
                 <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-12 h-12" />
                 </div>
                 <h2 className="text-3xl font-bold text-gray-900 mb-4">Ho Jayega! 🎉</h2>
                 <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                   We've received your request. Hum <span className="font-bold text-rose-600">2-3 ghante</span> mein aapko WhatsApp karenge discuss karne ke liye! 💬
                 </p>
                 <button onClick={() => setSuccess(false)} className="bg-gray-50 text-gray-500 font-bold px-8 py-3 rounded-2xl hover:bg-gray-100 transition-all border border-gray-200">
                   Submit another request
                 </button>
               </div>
            </motion.div>
          ) : (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-rose-100/30 border border-rose-100 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-100 rounded-full blur-[80px] -mr-32 -mt-32 opacity-50 pointer-events-none" />
              
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Your Name</label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors">
                        <User className="w-5 h-5" />
                      </span>
                      <input 
                        required 
                        type="text" 
                        placeholder="Rahul Kumar" 
                        value={formData.name}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-all text-gray-800"
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Your Email</label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors">
                        <Mail className="w-5 h-5" />
                      </span>
                      <input 
                        required 
                        type="email" 
                        placeholder="rahul@example.com" 
                        value={formData.email}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-all text-gray-800"
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">WhatsApp Number</label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors">
                        <Phone className="w-5 h-5" />
                      </span>
                      <input 
                        required 
                        type="tel" 
                        placeholder="+91 xxxxx xxxxx" 
                        value={formData.phone}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-all text-gray-800"
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">For whom is this?</label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors">
                        <Users className="w-5 h-5" />
                      </span>
                      <input 
                        required 
                        type="text" 
                        placeholder="Crush ka naam, ya GF ka" 
                        value={formData.forWhom}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-all text-gray-800"
                        onChange={e => setFormData({...formData, forWhom: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-rose-500" /> What theme/vibe do you want?
                  </label>
                  <div className="relative group">
                    <span className="absolute left-4 top-4 text-slate-400 group-focus-within:text-rose-500 transition-colors">
                      <Sparkles className="w-5 h-5" />
                    </span>
                    <textarea 
                      required 
                      rows={4}
                      placeholder="E.g. A starry night sky that zooms into our first chat screenshot..." 
                      value={formData.theme}
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-all resize-none text-gray-800"
                      onChange={e => setFormData({...formData, theme: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Budget Range</label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors pointer-events-none z-10">
                        <DollarSign className="w-5 h-5" />
                      </span>
                      <select 
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-all mb-1 text-gray-800 appearance-none"
                        onChange={e => setFormData({...formData, budget: e.target.value})}
                        defaultValue="Let me know"
                      >
                        <option>Let me know</option>
                        <option>₹99 - ₹199</option>
                        <option>₹200 - ₹399</option>
                        <option>₹400+</option>
                      </select>
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium px-1">*Cost may vary based on complexity.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">How urgent is this?</label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors pointer-events-none z-10">
                        <Calendar className="w-5 h-5" />
                      </span>
                      <select 
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-all mb-1 text-gray-800 appearance-none"
                        onChange={e => setFormData({...formData, urgency: e.target.value})}
                        defaultValue="Koi rush nahi"
                      >
                        <option>Koi rush nahi</option>
                        <option>2-3 din</option>
                        <option>Aaj chahiye (Urgent)</option>
                      </select>
                    </div>
                    <p className="text-[10px] text-rose-400 font-bold px-1">*Urgent orders have ₹99 Express fee.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Special features/songs?</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-4 text-slate-400 group-focus-within:text-rose-500 transition-colors">
                      <MessageSquare className="w-5 h-5" />
                    </span>
                    <textarea 
                      rows={2}
                      placeholder="Koi specific gana ya elements add karne hai toh batao..." 
                      value={formData.special}
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-all resize-none text-gray-800"
                      onChange={e => setFormData({...formData, special: e.target.value})}
                    />
                  </div>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100"
                  >
                    {error}
                  </motion.div>
                )}

                <button 
                  disabled={loading}
                  type="submit" 
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-lg py-4.5 rounded-2xl shadow-lg shadow-rose-600/30 transition-all active:scale-95 flex justify-center items-center gap-2 cursor-pointer"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> Send Request</>}
                </button>

                <div className="pt-4 text-center">
                   <p className="text-xs text-gray-400">
                     Facing issues? <a href="https://wa.me/91XXXXXXXXXX" target="_blank" className="text-emerald-600 font-bold hover:underline">WhatsApp Us Directly</a>
                   </p>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
