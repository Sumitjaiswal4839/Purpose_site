"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send, Heart, ArrowLeft, CheckCircle2, User, Mail, MessageSquare, AlertCircle } from "lucide-react";
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

export default function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState({ name: "", email: "", feedback: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      showToast("Please select a rating first ⭐", "error");
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("/api/custom-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.name,
          customerEmail: formData.email,
          description: formData.feedback,
          requestType: "feedback",
          rating,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
        showToast("Feedback received! Shukriya 💖", "success");
      } else {
        setStatus("error");
        showToast(data.error || "Kuch gadbad ho gayi, try again.", "error");
      }
    } catch (err: any) {
      setStatus("error");
      showToast(err.message || "Network error. Please retry.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] page-fade-in">
      {/* Toast */}
      <AnimatePresence>{toast && <Toast message={toast.message} type={toast.type} />}</AnimatePresence>

      <div className="max-w-2xl mx-auto px-6 pt-28 pb-20">

        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-rose-500 transition-colors mb-10 group text-sm font-medium"
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
              className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-rose-100/30 border border-rose-100/60 relative overflow-hidden"
            >
              {/* Decorative blob */}
              <div className="absolute top-0 right-0 w-56 h-56 bg-rose-50 rounded-full blur-[80px] -mr-28 -mt-28 pointer-events-none" />

              <div className="text-center mb-10 relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-amber-300/30 rotate-3"
                >
                  <Star className="w-8 h-8 text-white fill-current" />
                </motion.div>
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 font-serif tracking-tight">
                  Aapka Experience? ⭐
                </h1>
                <p className="text-gray-400 font-medium text-sm leading-relaxed">
                  Humein bataiye humein aur kya behtar karna chahiye.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">

                {/* Star Rating */}
                <div className="flex flex-col items-center gap-3 py-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">Rate Your Experience</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="transition-all duration-200 hover:scale-125 active:scale-95"
                      >
                        <Star
                          className={`w-9 h-9 transition-all ${
                            (hoverRating || rating) >= star
                              ? "text-amber-400 fill-current drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]"
                              : "text-gray-200"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <p className="text-xs font-bold text-amber-500">
                      {["", "Poor 😞", "Fair 😐", "Good 🙂", "Great 😊", "Excellent! 🤩"][rating]}
                    </p>
                  )}
                </div>

                {/* Name + Email */}
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Your Name</label>
                    <div className="relative group">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-rose-400 transition-colors" />
                      <input
                        required
                        type="text"
                        placeholder="Rahul Kumar"
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-10 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-50 transition-all"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-rose-400 transition-colors" />
                      <input
                        required
                        type="email"
                        placeholder="rahul@example.com"
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-10 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-50 transition-all"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Your Message</label>
                  <div className="relative group">
                    <MessageSquare className="absolute left-3.5 top-4 w-4 h-4 text-gray-300 group-focus-within:text-rose-400 transition-colors" />
                    <textarea
                      required
                      rows={4}
                      placeholder="Share your thoughts, suggestions…"
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-10 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-50 transition-all resize-none"
                      value={formData.feedback}
                      onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  disabled={status === "submitting"}
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-4 rounded-2xl font-black text-base shadow-lg shadow-rose-300/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed group"
                >
                  {status === "submitting" ? (
                    <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Sending...</span>
                  ) : (
                    <><Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /> Submit Feedback</>
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
                className="w-20 h-20 bg-emerald-500 rounded-[1.5rem] flex items-center justify-center mx-auto mb-7 shadow-[0_16px_40px_rgba(16,185,129,0.3)]"
              >
                <CheckCircle2 className="w-10 h-10 text-white stroke-[2.5]" />
              </motion.div>
              <h2 className="text-4xl font-black text-gray-900 mb-4 font-serif">Shukriya! ❤️</h2>
              <p className="text-gray-500 text-base mb-10 max-w-sm mx-auto leading-[1.7]">
                Aapka feedback humare liye bahut keemti hai. Hum is par zaroor kaam karenge.
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
          Built with <Heart className="w-3 h-3 text-rose-400 fill-current" /> for love.
        </p>
      </div>
    </div>
  );
}
