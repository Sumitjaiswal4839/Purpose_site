"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Sparkles, LayoutDashboard, Settings, Heart, Lock, Lightbulb, Mail, Wand2 } from "lucide-react";

export default function Navbar() {
  const [isHidden, setIsHidden] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Secret modal states
  const [showSecretModal, setShowSecretModal] = useState(false);
  const [secretKey, setSecretKey] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);

  const { scrollY } = useScroll();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAdmin(localStorage.getItem("adminAuth") === "true");
    }
  }, []);

  // Keyboard listener for 3x Spacebar
  useEffect(() => {
    let spaceCount = 0;
    let lastSpaceTime = 0;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === "Space") {
        const now = Date.now();
        if (now - lastSpaceTime < 500) {
          spaceCount++;
        } else {
          spaceCount = 1;
        }
        lastSpaceTime = now;
        if (spaceCount === 3) {
          e.preventDefault();
          if (!isAdmin) {
            setShowSecretModal(true);
            setSecretKey("");
            setErrorMsg(false);
          } else {
            router.push("/admin");
          }
          spaceCount = 0;
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAdmin, router]);

  // Hide navbar on scroll down
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
  });

  const handleSecretSubmit = () => {
    if (secretKey.toLowerCase() === "loveyou") {
      localStorage.setItem("adminAuth", "true");
      setIsAdmin(true);
      setShowSecretModal(false);
      router.push("/admin");
    } else {
      setErrorMsg(true);
      setSecretKey("");
    }
  };

  if (pathname === "/preview") return null;

  const navLinks = [
    { name: "Home", path: "/", icon: <Home className="w-4 h-4" /> },
    { name: "Templates", path: "/templates", icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "Ideas", path: "/ideas", icon: <Lightbulb className="w-4 h-4" /> },
    { name: "Custom Order", path: "/custom-request", icon: <Mail className="w-4 h-4" /> },
    ...(isAdmin ? [{ name: "Admin", path: "/admin", icon: <Settings className="w-4 h-4" /> }] : []),
  ];

  return (
    <>
      {/* ── Secret Admin Modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showSecretModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md"
            onClick={() => setShowSecretModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm border border-pink-100 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-rose-500" />
              <h3 className="text-xl font-bold mb-2 text-gray-800 flex items-center gap-3">
                <Lock className="w-5 h-5 text-rose-500" /> Root Access
              </h3>
              <p className="text-gray-400 text-sm mb-5">Enter root passkey to access admin.</p>
              <input
                type="password"
                autoFocus
                placeholder="Enter secret key..."
                value={secretKey}
                onChange={(e) => { setSecretKey(e.target.value); setErrorMsg(false); }}
                onKeyDown={(e) => { if (e.key === "Enter") handleSecretSubmit(); }}
                className={`w-full bg-gray-50 border ${errorMsg ? "border-red-400 focus:ring-red-500" : "border-gray-200 focus:ring-pink-500"} rounded-xl px-4 py-3 mb-1 focus:outline-none focus:ring-2 transition-all text-sm`}
              />
              <div className="h-5 mb-4">
                {errorMsg && <p className="text-red-500 text-xs font-medium">Access Denied. Invalid key.</p>}
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowSecretModal(false)} className="px-4 py-2 text-gray-400 hover:text-gray-900 font-medium transition-colors text-sm">
                  Cancel
                </button>
                <button
                  onClick={handleSecretSubmit}
                  className="bg-gray-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-black transition-colors text-sm active:scale-95"
                >
                  Authenticate
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── DESKTOP FLOATING NAVBAR ───────────────────────────────────────── */}
      <motion.nav
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: "-120%", opacity: 0 },
        }}
        animate={isHidden ? "hidden" : "visible"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-4 left-0 right-0 z-50 hidden md:flex justify-center w-full pointer-events-none"
      >
        <div className="bg-white/80 backdrop-blur-2xl border border-white/60 px-4 py-2 rounded-full shadow-lg shadow-rose-500/10 flex items-center gap-1 pointer-events-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mr-3 group pr-3 border-r border-gray-100">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="bg-gradient-to-tr from-rose-500 to-pink-400 text-white p-1.5 rounded-full shadow-sm shadow-rose-200"
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
            </motion.div>
            <span className="font-black text-gray-800 tracking-tight text-sm">Purpose</span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`relative px-3 py-1.5 rounded-full font-semibold transition-all duration-200 flex items-center gap-1.5 text-sm group ${
                    isActive
                      ? "text-rose-600"
                      : "text-gray-500 hover:text-gray-800 hover:bg-rose-50"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-rose-50 border border-rose-100 rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className={`transition-all duration-200 ${isActive ? "text-rose-500" : "text-gray-400 group-hover:text-rose-400"}`}>
                    {link.icon}
                  </span>
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* CTA Button */}
          <Link
            href="/create"
            className="ml-2 flex items-center gap-1.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-1.5 rounded-full font-bold text-sm shadow-md shadow-rose-300/40 hover:shadow-rose-400/50 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <Wand2 className="w-3.5 h-3.5" />
            Create Now
          </Link>
        </div>
      </motion.nav>

      {/* ── MOBILE BOTTOM NAV ─────────────────────────────────────────────── */}
      <motion.nav
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: "150%", opacity: 0 },
        }}
        animate={isHidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed bottom-4 left-3 right-3 z-50 md:hidden pointer-events-none"
      >
        <div className="bg-white/90 backdrop-blur-2xl border border-white/50 px-2 py-2 rounded-2xl shadow-xl shadow-rose-500/15 flex items-center justify-around pointer-events-auto">
          {navLinks.slice(0, 4).map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.name}
                href={link.path}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${
                  isActive ? "text-rose-500" : "text-gray-400"
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-all ${isActive ? "bg-rose-50 text-rose-500" : ""}`}>
                  {link.icon}
                </div>
                <span className="text-[9px] font-bold tracking-tight">{link.name}</span>
              </Link>
            );
          })}
          {/* Mobile CTA */}
          <Link
            href="/create"
            className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl bg-gradient-to-b from-rose-500 to-pink-500 text-white shadow-md shadow-rose-300/30 transition-all active:scale-95"
          >
            <div className="p-1.5">
              <Wand2 className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-bold">Create</span>
          </Link>
        </div>
      </motion.nav>
    </>
  );
}
