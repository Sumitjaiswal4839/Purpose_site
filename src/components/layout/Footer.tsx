import React from "react";
import Link from "next/link";
import { MessageCircle, Mail, Heart, Camera, Lightbulb, Star, ArrowRight, X, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-slate-950 text-slate-400 py-16 px-6 sm:px-10 mt-auto overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Gradient top border */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-rose-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Gradient section divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mb-12" />

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10">

          {/* Brand column */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-white">
              <div className="w-9 h-9 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/20">
                <Heart className="w-5 h-5 text-white fill-current" />
              </div>
              <h2 className="text-xl font-black tracking-tight">Purpose</h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-500 italic font-serif">
              "Creating digital memories for your special moments. Pyaar karo, propose karo."
            </p>
            <div className="flex gap-3">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/[0.05] flex items-center justify-center hover:bg-rose-500/20 hover:text-rose-400 transition-all border border-white/[0.06] hover:border-rose-500/30 hover:scale-110"
              >
                <X className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/[0.05] flex items-center justify-center hover:bg-rose-500/20 hover:text-rose-400 transition-all border border-white/[0.06] hover:border-rose-500/30 hover:scale-110"
              >
                <Camera className="w-3.5 h-3.5" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/[0.05] flex items-center justify-center hover:bg-emerald-500/20 hover:text-emerald-400 transition-all border border-white/[0.06] hover:border-emerald-500/30 hover:scale-110"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div className="space-y-5">
            <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em]">Explore</h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Home", href: "/" },
                { label: "Templates Vault", href: "/templates" },
                { label: "Create Your Link", href: "/create" },
                { label: "Ideas Vault", href: "/ideas" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="hover:text-rose-400 transition-colors flex items-center gap-2 group"
                  >
                    <Sparkles className="w-3 h-3 opacity-0 group-hover:opacity-100 text-rose-400 transition-all" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources — only pages that exist */}
          <div className="space-y-5">
            <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em]">Resources</h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: "FAQ", href: "/faq" },
                { label: "Submit Idea", href: "/submit-idea" },
                { label: "Give Feedback", href: "/feedback" },
                { label: "Custom Proposal Request", href: "/custom-request" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-slate-200 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-5">
            <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em]">Get in Touch</h4>
            <div className="space-y-3">
              <a
                href="mailto:hello@purpose.site"
                className="flex items-center gap-3 text-sm hover:text-white transition-colors group"
              >
                <Mail className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
                hello@purpose.site
              </a>
              <a
                href="#"
                className="flex items-center gap-3 text-sm hover:text-white transition-colors group"
              >
                <MessageCircle className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                WhatsApp Support
              </a>
              <div className="pt-3 p-4 rounded-2xl bg-gradient-to-br from-rose-500/8 to-indigo-500/8 border border-white/[0.05]">
                <p className="text-[10px] font-black uppercase text-rose-400 tracking-widest mb-1">Status</p>
                <p className="text-xs text-slate-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  Systems Operational
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gradient divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-600 font-medium">
            © {new Date().getFullYear()} Purpose Site. Built with{" "}
            <Heart className="w-3 h-3 inline text-rose-500 fill-current animate-pulse" /> for special moments.
          </p>
          <div className="flex items-center gap-5">
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-[0.25em]">Made in India 🇮🇳</span>
            <div className="w-px h-3 bg-white/[0.08]" />
            <p className="text-xs font-black text-rose-500/40 hover:text-rose-400 hover:scale-105 hover:-rotate-1 hover:drop-shadow-[0_0_8px_rgba(244,63,94,0.4)] transition-all duration-300 cursor-pointer uppercase tracking-widest select-none">
              Pyaar karo, propose karo ❤️
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
