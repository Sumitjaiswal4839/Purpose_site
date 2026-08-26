"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <button
      onClick={() => setLocale(locale === "en" ? "hi" : "en")}
      className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-pink-50 text-pink-600 text-xs font-bold hover:bg-pink-100 transition-colors cursor-pointer border border-pink-100 shadow-sm"
    >
      {locale === "en" ? "🇮🇳 हिंदी" : "🇬🇧 English"}
    </button>
  );
}
