"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, CreditCard, LayoutTemplate, Activity,
  MoreHorizontal, CheckCircle2, Lock, Sparkles, KeyRound,
  RefreshCw, XCircle, Copy, Plus, X, Moon, Sun, TrendingUp, Eye
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import LinksTable from "@/components/admin/LinksTable";
import CustomRequestsList from "@/components/admin/CustomRequestsList";

// ─── Dark Mode Context ────────────────────────────────────────────────────────
function useDarkMode() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("adminDark");
    if (saved === "true") setDark(true);
  }, []);
  const toggle = () => {
    setDark((d) => {
      localStorage.setItem("adminDark", String(!d));
      return !d;
    });
  };
  return { dark, toggle };
}

// ─── Sparkline (tiny inline chart) ───────────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const pts = data.map((v, i) => ({ v, i }));
  return (
    <ResponsiveContainer width="100%" height={36}>
      <AreaChart data={pts} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`sg-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2}
          fill={`url(#sg-${color})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── Manual Link Generator ────────────────────────────────────────────────────
function ManualLinkGenerator({ adminToken, dark }: { adminToken: string; dark: boolean }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    yourName: "", partnerName: "", customerEmail: "",
    question: "Will you marry me?", maxViews: 2, paymentAmount: 99,
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState<{ secretUrl: string; token: string; transactionId: string } | null>(null);
  const [errMsg, setErrMsg] = useState("");

  const handleGenerate = async () => {
    if (!form.yourName || !form.partnerName || !form.customerEmail) {
      setErrMsg("All fields are required."); setStatus("error"); return;
    }
    setStatus("loading"); setErrMsg("");
    try {
      const res = await fetch("/api/admin/generate-link", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": adminToken },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) { setResult(data.link); setStatus("success"); }
      else { setErrMsg(data.error || "Failed"); setStatus("error"); }
    } catch (e: any) { setErrMsg(e.message); setStatus("error"); }
  };

  const reset = () => {
    setStatus("idle"); setResult(null); setErrMsg("");
    setForm({ yourName: "", partnerName: "", customerEmail: "", question: "Will you marry me?", maxViews: 2, paymentAmount: 99 });
  };

  const inp = `border rounded-xl px-3 py-2.5 text-sm focus:outline-none transition-colors w-full ${dark ? "bg-slate-800 border-slate-700 text-white focus:border-emerald-400" : "border-gray-200 focus:border-emerald-400"}`;

  return (
    <>
      <div onClick={() => setOpen(true)} className={`rounded-3xl p-6 border shadow-sm flex items-center gap-4 cursor-pointer transition-all group ${dark ? "bg-slate-800 border-slate-700 hover:bg-emerald-900/30 hover:border-emerald-700" : "bg-white border-gray-100 hover:bg-emerald-50 hover:border-emerald-100"}`}>
        <div className="w-12 h-12 bg-emerald-100 group-hover:bg-emerald-200 group-hover:scale-110 transition-all rounded-full flex items-center justify-center text-emerald-600">
          <Plus className="w-6 h-6" />
        </div>
        <div>
          <h4 className={`font-bold ${dark ? "text-white" : "text-gray-800"}`}>Generate Manual Link</h4>
          <p className={`text-xs ${dark ? "text-slate-400" : "text-gray-500"}`}>For cash/UPI offline payments</p>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className={`rounded-[2.5rem] p-8 max-w-lg w-full relative z-10 shadow-2xl ${dark ? "bg-slate-900 border border-slate-700" : "bg-white"}`}>
              <button onClick={() => setOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
              <h3 className={`text-2xl font-black mb-6 ${dark ? "text-white" : "text-gray-800"}`}>Generate Manual Link 🔑</h3>
              {status !== "success" ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={`text-xs font-bold mb-1 block ${dark ? "text-slate-400" : "text-gray-500"}`}>Your Name</label><input value={form.yourName} onChange={e => setForm(f => ({ ...f, yourName: e.target.value }))} placeholder="Rahul" className={inp} /></div>
                    <div><label className={`text-xs font-bold mb-1 block ${dark ? "text-slate-400" : "text-gray-500"}`}>Partner Name</label><input value={form.partnerName} onChange={e => setForm(f => ({ ...f, partnerName: e.target.value }))} placeholder="Priya" className={inp} /></div>
                  </div>
                  <div><label className={`text-xs font-bold mb-1 block ${dark ? "text-slate-400" : "text-gray-500"}`}>Customer Email</label><input type="email" value={form.customerEmail} onChange={e => setForm(f => ({ ...f, customerEmail: e.target.value }))} placeholder="rahul@example.com" className={inp} /></div>
                  <div><label className={`text-xs font-bold mb-1 block ${dark ? "text-slate-400" : "text-gray-500"}`}>Proposal Question</label><input value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))} className={inp} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={`text-xs font-bold mb-1 block ${dark ? "text-slate-400" : "text-gray-500"}`}>Max Views</label><input type="number" min={1} max={10} value={form.maxViews} onChange={e => setForm(f => ({ ...f, maxViews: parseInt(e.target.value) || 2 }))} className={inp} /></div>
                    <div><label className={`text-xs font-bold mb-1 block ${dark ? "text-slate-400" : "text-gray-500"}`}>Amount (₹)</label><input type="number" value={form.paymentAmount} onChange={e => setForm(f => ({ ...f, paymentAmount: parseInt(e.target.value) || 99 }))} className={inp} /></div>
                  </div>
                  {status === "error" && <p className="text-red-500 text-sm font-medium bg-red-50 px-4 py-2 rounded-xl">{errMsg}</p>}
                  <button onClick={handleGenerate} disabled={status === "loading"} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black hover:bg-emerald-700 transition-all disabled:opacity-50 shadow-lg shadow-emerald-600/20">
                    {status === "loading" ? "Generating..." : "Generate Live Link ✓"}
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle2 className="w-8 h-8 text-emerald-600" /></div>
                  <h4 className={`text-xl font-black mb-2 ${dark ? "text-white" : "text-gray-800"}`}>Link Generated! 🎉</h4>
                  <div className={`border rounded-2xl p-4 mb-4 flex items-center gap-3 ${dark ? "bg-slate-800 border-slate-700" : "bg-gray-50 border-gray-200"}`}>
                    <p className={`text-xs font-mono truncate flex-1 ${dark ? "text-slate-300" : "text-gray-700"}`}>{result?.secretUrl}</p>
                    <button onClick={() => navigator.clipboard.writeText(result?.secretUrl || "")} className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-600 transition-colors flex items-center gap-1"><Copy className="w-3 h-3" /> Copy</button>
                  </div>
                  <p className={`text-xs mb-6 ${dark ? "text-slate-400" : "text-gray-400"}`}>Transaction ID: <span className="font-mono font-bold">{result?.transactionId}</span></p>
                  <button onClick={reset} className={`text-sm font-bold transition-colors ${dark ? "text-slate-400 hover:text-white" : "text-gray-500 hover:text-gray-800"}`}>Generate Another</button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { dark, toggle: toggleDark } = useDarkMode();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"proposals" | "requests">("proposals");
  const [statsData, setStatsData] = useState<any>(null);
  const [recentProposals, setRecentProposals] = useState<any[]>([]);
  const [customRequests, setCustomRequests] = useState<any[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);

  // ── Simulated 7-day sparkline data derived from live stats ────────────────
  const proposalSparkline = statsData
    ? Array.from({ length: 7 }, (_, i) =>
        Math.max(0, Math.floor((statsData.totalProposals || 0) * (0.5 + i * 0.08) + Math.random() * 2))
      )
    : [1, 2, 2, 3, 3, 4, 5];

  const revenueSparkline = statsData
    ? Array.from({ length: 7 }, (_, i) =>
        Math.floor((statsData.totalRevenue || 0) * (0.4 + i * 0.1) + Math.random() * 100)
      )
    : [99, 198, 198, 297, 396, 396, 495];

  const fetchDashboardData = useCallback(async (token: string) => {
    setIsDataLoading(true);
    try {
      const [statsRes, linksRes, reqRes] = await Promise.all([
        fetch("/api/admin/stats", { headers: { "x-admin-token": token } }),
        fetch("/api/admin/links",  { headers: { "x-admin-token": token } }),
        fetch("/api/admin/custom-requests", { headers: { "x-admin-token": token } }),
      ]);
      if (statsRes.ok) { const d = await statsRes.json(); if (d.success) setStatsData(d.stats); }
      if (linksRes.ok) { const d = await linksRes.json(); if (d.success) setRecentProposals(d.links.slice(0, 5)); }
      if (reqRes.ok)   { const d = await reqRes.json();   if (d.success) setCustomRequests(d.requests); }
    } catch (err) { console.error("Dashboard fetch error:", err); }
    finally { setIsDataLoading(false); }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setAdminToken(token);
      setIsAuthenticated(true);
      localStorage.setItem("adminAuth", "true");
      fetchDashboardData(token);
    }
  }, [fetchDashboardData]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminAuth");
    setIsAuthenticated(false);
    setAdminToken("");
    setStatsData(null);
    setRecentProposals([]);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(""); setIsLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setAdminToken(data.token);
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminAuth", "true");
        fetchDashboardData(data.token);
      } else {
        setLoginError(data.message || "Unauthorized.");
      }
    } catch { setLoginError("Connection error."); }
    finally { setIsLoading(false); }
  };

  const handleOverride = async (token: string, action: "reset" | "expire") => {
    try {
      await fetch(`/api/admin/links/${token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-token": adminToken },
        body: JSON.stringify({ action }),
      });
      fetchDashboardData(adminToken);
    } catch (err) { console.error("Override failed:", err); }
  };

  // ── Theme classes ─────────────────────────────────────────────────────────
  const bg       = dark ? "bg-slate-950"   : "bg-gray-50/50";
  const card     = dark ? "bg-slate-900 border-slate-800"   : "bg-white border-gray-100";
  const text     = dark ? "text-white"     : "text-gray-900";
  const subtext  = dark ? "text-slate-400" : "text-gray-400";
  const tableRow = dark ? "border-slate-800 hover:bg-slate-800/50" : "border-gray-50 hover:bg-gray-50/50";

  // ── Stats cards config ────────────────────────────────────────────────────
  const stats = [
    {
      title: "Total Proposals", value: statsData?.totalProposals ?? "—",
      badge: statsData?.recentGrowth ? `+${statsData.recentGrowth}% this week` : "Live data",
      badgeColor: "bg-emerald-500/10 text-emerald-500",
      iconBg: "bg-blue-500/10 text-blue-400", icon: <LayoutTemplate />,
      sparkline: proposalSparkline, sparkColor: "#3b82f6",
    },
    {
      title: "Total Revenue", value: `₹${statsData?.totalRevenue ?? 0}`,
      badge: "Verified payments", badgeColor: "bg-rose-500/10 text-rose-400",
      iconBg: "bg-rose-500/10 text-rose-400", icon: <CreditCard />,
      sparkline: revenueSparkline, sparkColor: "#f43f5e",
    },
    {
      title: "Active Links", value: statsData?.activeProposals ?? "—",
      badge: "Currently live", badgeColor: "bg-emerald-500/10 text-emerald-500",
      iconBg: "bg-emerald-500/10 text-emerald-400", icon: <Activity />,
      sparkline: proposalSparkline.map(v => Math.max(0, v - 1)), sparkColor: "#10b981",
    },
    {
      title: "Custom Requests", value: statsData?.totalRequests ?? "—",
      badge: statsData?.pendingRequests > 0 ? `${statsData.pendingRequests} Pending ⚡` : "All clear",
      badgeColor: statsData?.pendingRequests > 0 ? "bg-amber-500/10 text-amber-400" : "bg-gray-500/10 text-gray-400",
      iconBg: "bg-purple-500/10 text-purple-400", icon: <Users />,
      sparkline: [1,1,2,2,3,3,statsData?.totalRequests || 4], sparkColor: "#a855f7",
    },
  ];

  // ── Login screen ─────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-sm shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none" />
          <div className="flex justify-center mb-6">
            <div className="bg-slate-800 p-4 rounded-full border border-slate-700"><KeyRound className="w-8 h-8 text-indigo-400" /></div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 text-center">Control Room Access</h2>
          <p className="text-slate-400 text-sm text-center mb-6">Enter credentials to override systems.</p>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username/Email" autoFocus required
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors mb-3" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors mb-4" />
          {loginError && <p className="text-red-400 text-xs text-center mb-4">{loginError}</p>}
          <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 text-white font-bold rounded-lg py-3 hover:bg-indigo-700 transition disabled:opacity-50">
            {isLoading ? "Authenticating..." : "Authenticate"}
          </button>
        </form>
      </div>
    );
  }

  // ── 7-day bar chart data ─────────────────────────────────────────────────
  const weekDays = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const barData = weekDays.map((day, i) => ({
    day,
    proposals: Math.max(0, Math.floor((proposalSparkline[i] || 0))),
    revenue:   Math.max(0, Math.floor((revenueSparkline[i] || 0) / 99)),
  }));

  return (
    <div className={`min-h-screen ${bg} p-4 md:p-12 pb-32 page-fade-in transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto pt-20 md:pt-12">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className={`text-3xl md:text-4xl font-black tracking-tight mb-1 ${text}`}>Admin Command 🎛️</h1>
            <p className={`text-sm ${subtext}`}>Monitor proposals, revenue, and custom requests.</p>
          </div>
          <div className="flex gap-2 items-center">
            {/* Dark mode toggle */}
            <button onClick={toggleDark}
              className={`p-2.5 rounded-full border transition-all ${dark ? "bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={() => fetchDashboardData(adminToken)} disabled={isDataLoading}
              className={`hidden md:flex items-center gap-2 border px-5 py-2.5 rounded-full font-bold text-sm shadow-sm transition-all disabled:opacity-50 ${dark ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
              <RefreshCw className={`w-4 h-4 ${isDataLoading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button onClick={handleLogout}
              className="bg-red-500 text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-lg hover:bg-red-600 transition-all flex items-center gap-2 active:scale-95">
              🚪 Logout
            </button>
          </div>
        </div>

        {/* ── Tab Navigation ───────────────────────────────────────────────── */}
        <div className={`flex gap-4 mb-8 p-1.5 rounded-2xl w-max border shadow-sm ${dark ? "bg-slate-900/50 border-slate-800" : "bg-white/50 border-gray-200"}`}>
          {(["proposals", "requests"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === tab ? "bg-gray-900 text-white shadow-lg" : `${subtext} hover:bg-gray-100/20`}`}>
              {tab === "proposals" ? "Proposals" : "Requests & Feedback"}
              {tab === "requests" && customRequests.filter(r => r.status === "pending").length > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">
                  {customRequests.filter(r => r.status === "pending").length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Stats Cards ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className={`rounded-3xl border shadow-sm p-5 relative overflow-hidden group transition-all duration-300 ${card}`}>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${stat.iconBg}`}>
                  {React.cloneElement(stat.icon as React.ReactElement<any>, { className: "w-5 h-5" })}
                </div>
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${stat.badgeColor}`}>{stat.badge}</span>
              </div>
              <p className={`text-xs font-semibold mb-0.5 ${subtext}`}>{stat.title}</p>
              <p className={`text-3xl font-black mb-2 ${text}`}>{stat.value}</p>
              {/* Sparkline mini chart */}
              <Sparkline data={stat.sparkline} color={stat.sparkColor} />
            </motion.div>
          ))}
        </div>

        {/* ── 7-Day Bar Chart ───────────────────────────────────────────────── */}
        <div className={`rounded-3xl border shadow-sm p-6 mb-8 ${card}`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`text-lg font-bold ${text}`}>7-Day Activity</h3>
              <p className={`text-xs ${subtext}`}>Proposals created &amp; revenue trend this week</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />Proposals</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />Revenue (×₹99)</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={barData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#1e293b" : "#f1f5f9"} vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: dark ? "#64748b" : "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: dark ? "#64748b" : "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: dark ? "#0f172a" : "#fff",
                  border: `1px solid ${dark ? "#1e293b" : "#e2e8f0"}`,
                  borderRadius: 12, fontSize: 12, color: dark ? "#e2e8f0" : "#1e293b",
                }}
                cursor={{ fill: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)" }}
              />
              <Bar dataKey="proposals" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="revenue"   fill="#f43f5e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ── Main grid: table + sidebar ────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Proposals / Requests table */}
          <div className="lg:col-span-2 space-y-8">
            {activeTab === "proposals" ? (
              <div className={`rounded-3xl border shadow-sm p-6 overflow-hidden ${card}`}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className={`text-xl font-bold ${text}`}>Recent Proposals</h3>
                  <button className={`p-2 rounded-full transition-colors ${dark ? "text-slate-500 hover:bg-slate-800" : "text-gray-400 hover:bg-gray-100"}`}>
                    <MoreHorizontal />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={`text-xs uppercase tracking-wider border-b ${dark ? "text-slate-500 border-slate-800" : "text-gray-400 border-gray-100"}`}>
                        <th className="pb-3 font-semibold px-4 whitespace-nowrap">User &amp; Partner</th>
                        <th className="pb-3 font-semibold px-4 whitespace-nowrap">Theme</th>
                        <th className="pb-3 font-semibold px-4 whitespace-nowrap">Status</th>
                        <th className="pb-3 font-semibold px-4 text-right whitespace-nowrap">Override</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentProposals.map((prop, i) => {
                        const isExpired = !prop.isActive || new Date() > new Date(prop.expiresAt) || prop.currentViews >= prop.maxViews;
                        return (
                          <motion.tr key={prop.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.08 }}
                            className={`border-b transition-colors cursor-pointer ${tableRow}`}>
                            <td className="py-4 px-4 min-w-[200px]">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-rose-400 flex shrink-0 items-center justify-center text-white font-bold text-xs shadow-inner">
                                  {prop.yourName.charAt(0)}{prop.partnerName.charAt(0)}
                                </div>
                                <div>
                                  <p className={`font-bold text-sm whitespace-nowrap ${text}`}>{prop.yourName} & {prop.partnerName}</p>
                                  <p className={`text-xs font-mono tracking-tighter ${subtext}`}>#{prop.token.substring(0, 8)}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`text-xs font-medium px-3 py-1 rounded-lg capitalize ${dark ? "bg-slate-800 text-slate-300" : "bg-gray-100 text-gray-600"}`}>
                                {prop.templateType || "Default"}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-1.5">
                                {!isExpired
                                  ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                  : <Lock className="w-4 h-4 text-red-400" />}
                                <span className={`text-sm font-bold ${!isExpired ? (dark ? "text-slate-200" : "text-gray-700") : "text-red-500"}`}>
                                  {!isExpired ? "Active" : "Expired"}{" "}
                                  <span className="opacity-50 font-normal text-xs">({prop.currentViews}/{prop.maxViews})</span>
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="flex justify-end gap-2">
                                {isExpired && (
                                  <button onClick={() => handleOverride(prop.token, "reset")}
                                    className="text-xs bg-indigo-50 text-indigo-600 font-bold px-2 py-1 rounded hover:bg-indigo-100 flex items-center gap-1">
                                    <RefreshCw className="w-3 h-3" /> Reset
                                  </button>
                                )}
                                {!isExpired && (
                                  <button onClick={() => handleOverride(prop.token, "expire")}
                                    className="text-xs bg-red-50 text-red-600 font-bold px-2 py-1 rounded hover:bg-red-100 flex items-center gap-1">
                                    <XCircle className="w-3 h-3" /> Expire
                                  </button>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                      {recentProposals.length === 0 && (
                        <tr><td colSpan={4} className={`py-8 text-center text-sm italic ${subtext}`}>No proposals yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <CustomRequestsList />
            )}
          </div>
