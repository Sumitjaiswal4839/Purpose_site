"use client";

import React, { useEffect, useState } from "react";
import { 
  MessageCircle, 
  CheckCircle2, 
  Clock, 
  History, 
  AlertCircle, 
  Star, 
  Lightbulb, 
  CreditCard,
  Mail,
  Phone
} from "lucide-react";

export default function CustomRequestsList() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");
  const [typeFilter, setTypeFilter] = useState<"all" | "order" | "feedback" | "idea">("all");

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("/api/admin/custom-requests", {
        headers: {
          "x-admin-token": token || ""
        }
      });
      const data = await res.json();
      if (data.success) {
        setRequests(data.requests);
      }
    } catch (error) {
      console.error("Fetch errors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("/api/admin/custom-requests", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token || ""
        },
        body: JSON.stringify({ id, status: newStatus })
      });
      
      if (res.ok) {
        setRequests(prev => prev.map(req => 
          req.id === id ? { ...req, status: newStatus } : req
        ));
      }
    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  // Filter requests based on both status (pending/completed) and requestType (all/order/feedback/idea)
  const filteredRequests = requests.filter(req => {
    const isCompleted = req.status === "completed";
    const matchesStatus = activeTab === "pending" ? !isCompleted : isCompleted;
    const matchesType = typeFilter === "all" ? true : req.requestType === typeFilter;
    return matchesStatus && matchesType;
  });

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4 border-b border-gray-50 pb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">User Submissions</h3>
          <p className="text-sm text-gray-500 font-medium mt-1">Manage custom orders, user feedback, and innovative ideas.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
            <button 
              onClick={() => setActiveTab("pending")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === "pending" 
                  ? "bg-white text-rose-600 shadow-sm" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Clock className="w-4 h-4" /> Pending
              {requests.filter(r => r.status !== "completed").length > 0 && (
                <span className="bg-rose-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black">
                  {requests.filter(r => r.status !== "completed").length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab("completed")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === "completed" 
                  ? "bg-white text-emerald-600 shadow-sm" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <History className="w-4 h-4" /> Solved
            </button>
          </div>
        </div>
      </div>

      {/* Type Filters */}
      <div className="flex flex-wrap gap-2 mb-8 bg-gray-50/50 p-2 rounded-2xl border border-gray-100">
        {(["all", "order", "feedback", "idea"] as const).map((type) => {
          const count = requests.filter(r => {
            const isComp = r.status === "completed";
            const matchStat = activeTab === "pending" ? !isComp : isComp;
            return matchStat && (type === "all" ? true : r.requestType === type);
          }).length;

          return (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                typeFilter === type
                  ? "bg-gray-900 text-white shadow-md shadow-gray-900/10"
                  : "bg-white hover:bg-gray-100 text-gray-600 border border-gray-200"
              }`}
            >
              {type === "all" && "✨ All Types"}
              {type === "order" && "🛒 Orders"}
              {type === "feedback" && "⭐ Feedback"}
              {type === "idea" && "💡 Ideas"}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${typeFilter === type ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
      
      {/* Content Section */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
          <div className="w-10 h-10 border-4 border-rose-100 border-t-rose-500 rounded-full animate-spin"></div>
          <p className="text-sm font-bold uppercase tracking-wider">Fetching submissions...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-100 rounded-[2.5rem] bg-gray-50/30">
          <AlertCircle className="w-12 h-12 text-gray-300 mb-4" />
          <p className="text-gray-400 font-bold text-lg">No {typeFilter !== 'all' ? typeFilter : ''} submissions found</p>
          <p className="text-gray-400 text-sm mt-1">There are no {activeTab} items matching this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((req) => {
            const isPending = req.status !== "completed";
            const formattedDate = new Date(req.createdAt).toLocaleDateString("en-US", { 
              month: "short", 
              day: "numeric", 
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            });

            return (
              <div 
                key={req.id} 
                className={`border border-gray-100 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all group relative flex flex-col justify-between ${
                  !isPending ? 'bg-gray-50/50 opacity-75' : 'bg-white'
                }`}
              >
                <div>
                  {/* Top Header Card Info */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-extrabold text-gray-800 text-lg leading-snug">{req.name}</h4>
                      <p className="text-[10px] text-gray-400 flex items-center gap-1 uppercase font-bold tracking-widest mt-1">
                        {formattedDate}
                      </p>
                    </div>
                    
                    {/* Badge showing type */}
                    <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-wider border shadow-sm ${
                      req.requestType === 'feedback' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                      req.requestType === 'idea' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 
                      'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                      {req.requestType === 'feedback' && '⭐ Feedback'}
                      {req.requestType === 'idea' && '💡 Idea'}
                      {req.requestType === 'order' && '🛒 Order'}
                    </span>
                  </div>

                  {/* Body Content depending on Request Type */}
                  <div className="space-y-4 mb-6">
                    {/* Order Details */}
                    {req.requestType === 'order' && (
                      <>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-gray-50 p-2 rounded-xl border border-gray-100">
                            <p className="text-gray-400 mb-0.5">For Whom</p>
                            <p className="font-bold text-gray-800 truncate">{req.forWhom || "Not specified"}</p>
                          </div>
                          <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-100/50">
                            <p className="text-emerald-400 mb-0.5">Budget</p>
                            <p className="font-bold text-emerald-600 truncate">{req.budget || "Not specified"}</p>
                          </div>
                        </div>

                        {req.urgency && (
                          <div className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-xl font-bold border border-red-100/50 w-fit">
                            ⏳ Urgency: {req.urgency}
                          </div>
                        )}

                        <div>
                          <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 block">Theme & Vibe</span>
                          <p className="text-gray-700 bg-gray-50 p-3 rounded-2xl border border-gray-100 group-hover:border-rose-100 transition-colors text-sm italic leading-relaxed">
                            "{req.theme || req.description}"
                          </p>
                        </div>
                        
                        {req.special && (
                          <div>
                            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1 block">Special Requests</span>
                            <p className="text-gray-600 text-sm pl-2.5 border-l-2 border-rose-300 italic">
                              {req.special}
                            </p>
                          </div>
                        )}
                      </>
                    )}

                    {/* Feedback Details */}
                    {req.requestType === 'feedback' && (
                      <div className="space-y-3">
                        <div className="flex gap-1 bg-amber-50/50 border border-amber-100/30 p-2 rounded-xl w-fit">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-5 h-5 ${
                                star <= (req.rating || 0) 
                                  ? "text-amber-400 fill-current drop-shadow-[0_0_2px_rgba(245,158,11,0.3)]" 
                                  : "text-gray-200"
                              }`} 
                            />
                          ))}
                        </div>
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                          {req.description}
                        </div>
                      </div>
                    )}

                    {/* Idea Details */}
                    {req.requestType === 'idea' && (
                      <div className="space-y-3">
                        <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                          {req.description}
                        </div>
                      </div>
                    )}

                    {/* Contact Details */}
                    <div className="border-t border-gray-50 pt-4 space-y-1 text-xs text-gray-500 font-medium">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <span className="truncate">{req.email}</span>
                      </div>
                      {req.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          <span>{req.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex gap-2 border-t border-gray-50 pt-4 mt-auto">
                  {req.requestType === 'order' && req.phone && (
                    <a 
                      href={`https://wa.me/91${req.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${req.name}! Humne aapka custom order request dekha for "${req.forWhom || 'proposal'}". We'd love to build it!`)}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-3 rounded-2xl hover:bg-green-600 transition-all shadow-lg shadow-green-200 active:scale-95 text-sm"
                    >
                      <MessageCircle className="w-4 h-4" /> WhatsApp
                    </a>
                  )}
                  
                  {isPending ? (
                    <button 
                      onClick={() => handleStatusUpdate(req.id, "completed")}
                      className={`flex items-center justify-center font-bold py-3 px-4 rounded-2xl transition-all active:scale-95 text-sm gap-2 ${
                        req.requestType === 'order' && req.phone
                          ? "bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600"
                          : "flex-1 bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-200"
                      }`}
                      title="Mark as Done"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Mark Solved
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleStatusUpdate(req.id, "pending")}
                      className="flex-1 flex items-center justify-center font-bold py-3 px-4 bg-gray-100 text-gray-500 hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-all active:scale-95 text-sm gap-2"
                      title="Move back to Pending"
                    >
                      <Clock className="w-4 h-4" /> Re-open Request
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
