"use client";

import React, { useEffect, useState } from "react";
import { RefreshCw, ExternalLink, CheckCircle2, XCircle, Clock, RotateCcw } from "lucide-react";

export default function LinksTable() {
  const [links, setLinks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchLinks = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("/api/admin/links", {
        headers: { "x-admin-token": token || "" },
      });
      const data = await res.json();
      if (data.success) {
        setLinks(data.links);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleAction = async (token: string, action: "expire" | "reset" | "extend") => {
    setActionLoading(`${token}-${action}`);
    try {
      const adminToken = localStorage.getItem("adminToken");
      const res = await fetch(`/api/admin/links/${token}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": adminToken || "",
        },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        fetchLinks();
      }
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const totalLinks   = links.length;
  const activeLinks  = links.filter((l) => l.isActive).length;
  const totalRevenue = links.reduce((sum, l) => {
    return sum + (Number(l.paymentAmount) || 0);
  }, 0);

  // Status badge helper
  const getStatusBadge = (link: any) => {
    const isExpired =
      !link.isActive ||
      new Date() > new Date(link.expiresAt) ||
      link.currentViews >= link.maxViews;

    if (link.paymentStatus === "pending") {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100">
          <Clock className="w-3 h-3" /> Pending
        </span>
      );
    }
    if (isExpired) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full bg-red-50 text-red-500 border border-red-100">
          <XCircle className="w-3 h-3" /> Expired
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
        <CheckCircle2 className="w-3 h-3" /> Active
      </span>
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mt-8 overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">All Secret Links</h3>
          <p className="text-xs text-gray-400 mt-0.5">Full link registry — manage and override</p>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex gap-3 text-sm">
            <span className="text-gray-400">Total: <strong className="text-gray-700">{totalLinks}</strong></span>
            <span className="text-gray-400">Active: <strong className="text-emerald-600">{activeLinks}</strong></span>
            <span className="text-gray-400">Revenue: <strong className="text-rose-500">₹{totalRevenue}</strong></span>
          </div>
          <button
            onClick={fetchLinks}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl transition-all hover:bg-gray-100 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
          <div className="w-7 h-7 border-4 border-rose-100 border-t-rose-400 rounded-full animate-spin" />
          <span className="text-sm font-bold uppercase tracking-wider">Loading links...</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="text-gray-400 text-[11px] uppercase tracking-wider border-b border-gray-100">
                <th className="pb-3 px-3 font-semibold">Token</th>
                <th className="pb-3 px-3 font-semibold">Partners</th>
                <th className="pb-3 px-3 font-semibold">Plan</th>
                <th className="pb-3 px-3 font-semibold">Views</th>
                <th className="pb-3 px-3 font-semibold">Expires</th>
                <th className="pb-3 px-3 font-semibold">Status</th>
                <th className="pb-3 px-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {links.map((link) => {
                const isExpired =
                  !link.isActive ||
                  new Date() > new Date(link.expiresAt) ||
                  link.currentViews >= link.maxViews;
                return (
                  // ✅ Fixed: use link.id (Prisma) not link._id (MongoDB)
                  <tr
                    key={link.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-indigo-600 font-bold">
                          #{link.token.substring(0, 10)}…
                        </span>
                        <a
                          href={`/secret/${link.token}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ExternalLink className="w-3 h-3 text-gray-400 hover:text-indigo-500" />
                        </a>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div>
                        <p className="text-xs font-bold text-gray-800">
                          {link.yourName} & {link.partnerName}
                        </p>
                        <p className="text-[10px] text-gray-400 truncate max-w-[140px]">
                          {link.customerEmail}
                        </p>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-xs font-bold capitalize text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">
                        {link.planType || "standard"}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-rose-400 rounded-full"
                            style={{ width: `${Math.min((link.currentViews / link.maxViews) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-600">
                          {link.currentViews}/{link.maxViews}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-xs text-gray-500">
                      {new Date(link.expiresAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 px-3">{getStatusBadge(link)}</td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex justify-end gap-1.5 text-[11px]">
                        <button
                          onClick={() => handleAction(link.token, "extend")}
                          disabled={actionLoading === `${link.token}-extend`}
                          className="bg-blue-50 text-blue-600 px-2.5 py-1.5 rounded-lg hover:bg-blue-100 font-bold transition-colors disabled:opacity-40 flex items-center gap-1"
                        >
                          +7d
                        </button>
                        <button
                          onClick={() => handleAction(link.token, "reset")}
                          disabled={actionLoading === `${link.token}-reset`}
                          className="bg-indigo-50 text-indigo-600 px-2.5 py-1.5 rounded-lg hover:bg-indigo-100 font-bold transition-colors disabled:opacity-40 flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" /> Reset
                        </button>
                        {!isExpired && (
                          <button
                            onClick={() => handleAction(link.token, "expire")}
                            disabled={actionLoading === `${link.token}-expire`}
                            className="bg-red-50 text-red-500 px-2.5 py-1.5 rounded-lg hover:bg-red-100 font-bold transition-colors disabled:opacity-40 flex items-center gap-1"
                          >
                            <XCircle className="w-3 h-3" /> Expire
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {links.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-sm text-gray-400 italic">
                    No secret links found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
