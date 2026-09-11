"use client";

import { useState } from "react";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    
    try {
      const res = await fetch("/api/auth/send-magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed to send link");
      }
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl border border-gray-100 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-gray-600" />
        </div>
        
        <h1 className="text-3xl font-black mb-2 text-gray-800">Sender Login</h1>
        <p className="text-gray-500 mb-8 font-medium">Enter your email to view your dashboard.</p>

        {status === "success" ? (
          <div className="bg-emerald-50 text-emerald-700 p-6 rounded-2xl flex flex-col items-center gap-3">
            <CheckCircle2 className="w-10 h-10" />
            <p className="font-bold text-lg">Check your inbox!</p>
            <p className="text-sm">We've sent a magic link to <strong>{email}</strong>.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-gray-50 border border-gray-200 px-6 py-4 rounded-xl font-medium focus:ring-2 focus:ring-gray-900 outline-none transition-all"
              required
            />
            
            {status === "error" && (
              <div className="flex items-center gap-2 text-red-500 text-sm font-medium justify-center bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" /> {message}
              </div>
            )}

            <button 
              type="submit" 
              disabled={status === "loading"}
              className="bg-gray-900 text-white font-black py-4 rounded-xl hover:bg-black transition-all shadow-lg shadow-gray-900/20 disabled:opacity-50"
            >
              {status === "loading" ? "Sending..." : "Send Magic Link ✨"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
