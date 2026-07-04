"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-red-100 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8">
        <AlertCircle className="w-10 h-10 text-red-500" />
      </div>
      <h1 className="text-3xl font-black text-gray-900 mb-3">Something went wrong</h1>
      <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
        An unexpected error occurred. Please try refreshing the page.
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full font-bold hover:bg-black transition-all"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-full font-bold hover:bg-gray-50 transition-all"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
