"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutDashboard, Settings, Heart, Lightbulb, Mail, Wand2, User } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

export default function Navbar() {
  const [isHidden, setIsHidden] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { t } = useLanguage();

  const scrollY = useScroll().scrollY;
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const adminActive = !!localStorage.getItem("adminToken");
      const clientCookie = document.cookie.includes("purpose_logged_in=true");
      setIsAdmin(adminActive);

      if (adminActive || clientCookie) {
        setIsLoggedIn(true);
      }

      // Check server session state
      fetch("/api/auth/me")
        .then((res) => res.json())
        .then((data) => {
          if (data?.authenticated) {
            setIsLoggedIn(true);
          } else if (!adminActive && !clientCookie) {
            setIsLoggedIn(false);
          }
        })
        .catch(() => {});
    }
  }, [pathname]);

  // Hide navbar on scroll down
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
  });

  if (pathname === "/preview") return null;

  const navLinks = [
    { name: t("nav_home"), path: "/", icon: <Home className="w-4 h-4" /> },
    { name: t("nav_templates"), path: "/templates", icon: <LayoutDashboard className="w-4 h-4" /> },
    ...(isLoggedIn ? [{ name: "Dashboard", path: "/dashboard", icon: <User className="w-4 h-4" /> }] : []),
    { name: t("nav_ideas"), path: "/ideas", icon: <Lightbulb className="w-4 h-4" /> },
    { name: t("nav_custom"), path: "/custom-request", icon: <Mail className="w-4 h-4" /> },
    ...(isAdmin ? [{ name: t("nav_admin"), path: "/admin", icon: <Settings className="w-4 h-4" /> }] : []),
  ];

  return (
    <>
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

          {/* Language Toggle & Actions */}
          <div className="ml-2 flex items-center gap-2">
            <LanguageToggle />
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  pathname === "/dashboard"
                    ? "bg-rose-100 text-rose-700"
                    : "text-gray-700 hover:text-rose-600 hover:bg-rose-50"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  pathname === "/login"
                    ? "bg-rose-100 text-rose-700"
                    : "text-gray-600 hover:text-rose-600 hover:bg-rose-50"
                }`}
              >
                Login
              </Link>
            )}
            <Link
              href="/create"
              className="flex items-center gap-1.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-1.5 rounded-full font-bold text-sm shadow-md shadow-rose-300/40 hover:shadow-rose-400/50 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <Wand2 className="w-3.5 h-3.5" />
              {t("cta_create")}
            </Link>
          </div>
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
