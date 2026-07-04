import Link from "next/link";
import { Heart, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-rose-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
        <Heart className="w-12 h-12 text-rose-400" strokeWidth={1.5} />
      </div>
      <h1 className="text-6xl font-black text-gray-900 mb-4 tracking-tighter">404</h1>
      <h2 className="text-2xl font-bold text-gray-700 mb-4 font-serif">Page Not Found</h2>
      <p className="text-gray-500 max-w-sm mb-10 leading-relaxed">
        This page doesn&apos;t exist or the link may have expired. Check the URL or go back home.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-black transition-all hover:scale-105 active:scale-95 shadow-xl"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
    </div>
  );
}
