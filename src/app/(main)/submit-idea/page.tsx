"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Send, Heart, ArrowLeft, Rocket, Sparkles, User, Mail, FileText, AlignLeft, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

// ── Inline Toast ──────────────────────────────────────────────────────────
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

export default function SubmitIdeaPage() {
  const [formData, setFormData] = useState({ name: "", email: "", ideaTitle: "", description: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/custom-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.name,
          customerEmail: formData.email,
          description: `TITLE: ${formData.ideaTitle}\n\nDESCRIPTION: ${formData.description}`,
          requestType: "idea",
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
        showToast("Idea submitted! We'll review it soon 🚀", "success");
      } else {
        setStatus("error");
        showToast(data.error || "Submission failed. Please retry.", "error");
      }
    } catch (err: any) {
      setStatus("error");
      showToast(err.message || "Network error. Please retry.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] page-fade-in">
      <AnimatePresence>{toast && <Toast message={toast.message} type={toast.type} />}</AnimatePresence>

      <div className="max-w-2xl mx-auto px-6 pt-28 pb-20">

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-indigo-500 transition-colors mb-10 group text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <AnimatePresence mode="wait">
          {status !== "success" ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-indigo-100/30 border border-indigo-100/60 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-56 h-56 bg-indigo-50 rounded-full blur-[80px] -mr-28 -mt-28 pointer-events-none" />

              <div className="text-center mb-10 relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-indigo-300/30 -rotate-3"
                >
                  <Lightbulb className="w-8 h-8 text-white fill-current" />
                </motion.div>
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 font-serif tracking-tight">
                  Aapka Idea? 💡
                </h1>
                <p className="text-gray-400 font-medium text-sm leading-relaxed">
                  Hum naye themes aur features ke liye hamesha excited rehte hain!
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                {/* Name + Email */}
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Your Name</label>
                    <div className="relative group">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-indigo-400 transition-colors" />
                      <input
                        required
                        type="text"
                        placeholder="Innovator Name"
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-10 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50 transition-all"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-indigo-400 transition-colors" />
                      <input
                        required
                        type="email"
                        placeholder="creative@mind.com"
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-10 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50 transition-all"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Idea Title */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Idea Title</label>
                  <div className="relative group">
                    <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                      required
                      type="text"
                      placeholder="e.g. Space Voyage Theme"
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-10 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50 transition-all"
                      value={formData.ideaTitle}
                      onChange={(e) => setFormData({ ...formData, ideaTitle: e.target.value })}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Explain Your Vision</label>
                  <div className="relative group">
                    <AlignLeft className="absolute left-3.5 top-4 w-4 h-4 text-gray-300 group-focus-within:text-indigo-400 transition-colors" />
                    <textarea
                      required
                      rows={5}
                      placeholder="Describe the animations, music, or feel you imagine…"
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-10 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50 transition-all resize-none"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  disabled={status === "submitting"}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-2xl font-black text-base shadow-lg shadow-indigo-300/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2.5 disabled:opacity-60 group"
                >
                  {status === "submitting" ? (
                    <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Launching Idea...</span>
                  ) : (
                    <><Rocket className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-1 transition-transform" /> Submit My Idea</>
                  )}
                </button>
              </form>
            </motion.div>

          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 px-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                className="w-20 h-20 bg-indigo-500 rounded-[1.5rem] flex items-center justify-center mx-auto mb-7 shadow-[0_16px_40px_rgba(99,102,241,0.3)]"
              >
                <Sparkles className="w-10 h-10 text-white stroke-[2]" />
              </motion.div>
              <h2 className="text-4xl font-black text-gray-900 mb-4 font-serif">Incredible! 🚀</h2>
              <p className="text-gray-500 text-base mb-10 max-w-sm mx-auto leading-[1.7]">
                Aapka idea humare list mein add ho gaya. Agar hum use select karte hain, to hum aapko notify karenge!
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-gray-900 text-white font-black text-sm px-8 py-4 rounded-full hover:bg-black active:scale-95 transition-all shadow-lg"
              >
                Return Home
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-xs text-gray-400 mt-8 flex items-center justify-center gap-1">
          Where creativity meets <Heart className="w-3 h-3 text-rose-400 fill-current" /> technology.
        </p>
      </div>
    </div>
  );
}
