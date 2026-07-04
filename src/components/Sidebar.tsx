"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, Sparkles, Cake, CalendarHeart, 
  Menu, X, Home, LayoutDashboard, Settings, Coffee
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Totally hide on any preview route
  if (pathname.startsWith('/preview')) return null;

  const links = [
    { name: "Dashboard", path: "/", icon: <Home className="w-5 h-5" /> },
    { name: "Create New", path: "/create", icon: <Sparkles className="w-5 h-5" /> },
    { name: "All Templates", path: "/templates", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Admin Portal", path: "/admin", icon: <Settings className="w-5 h-5" /> },
  ];

  const occasions = [
    { name: "Proposals", path: "/templates?category=propose", icon: <Heart className="w-4 h-4 text-rose-500" /> },
    { name: "Happy Birthday", path: "/templates?category=birthday", icon: <Cake className="w-4 h-4 text-blue-500" /> },
    { name: "Anniversary", path: "/templates?category=anniversary", icon: <CalendarHeart className="w-4 h-4 text-amber-500" /> },
    { name: "Apology (Sorry)", path: "/templates?category=apology", icon: <Coffee className="w-4 h-4 text-stone-500" /> },
  ];

  return (
    <>
      {/* Mobile Hamburger Header (Visible only on small screens) */}
      <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-white/90 backdrop-blur-md border-b border-gray-100 z-40 flex items-center px-4 shadow-sm">
        <button onClick={() => setIsOpen(true)} className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <span className="ml-4 font-bold text-gray-800 flex items-center gap-2 text-lg">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" /> Purpose
        </span>
      </div>

      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* ACTUAL SIDEBAR (GFG Style) */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-100 z-50 flex flex-col transition-transform duration-300 shadow-[4px_0_24px_rgba(0,0,0,0.02)]
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0`}
      >
        <div className="h-20 flex items-center justify-between px-8 border-b border-gray-50/50 bg-gradient-to-b from-rose-50/50 to-transparent">
           <Link href="/" className="font-bold text-2xl text-gray-900 flex items-center gap-3" onClick={() => setIsOpen(false)}>
             <div className="bg-rose-500 p-2 rounded-xl shadow-lg shadow-rose-500/20">
               <Heart className="w-5 h-5 text-white fill-white" />
             </div>
             Purpose
           </Link>
           <button onClick={() => setIsOpen(false)} className="md:hidden p-2 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-full">
             <X className="w-5 h-5" />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-8 custom-scrollbar">
           
           <div className="mb-10">
             <p className="px-4 text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Core Platform</p>
             <div className="space-y-1.5">
               {links.map((link) => (
                 <Link 
                   key={link.name} 
                   href={link.path}
                   onClick={() => setIsOpen(false)}
                   className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${pathname === link.path ? 'bg-rose-50 text-rose-600 font-bold shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                 >
                   {link.icon}
                   <span className="text-sm">{link.name}</span>
                   {pathname === link.path && <motion.div layoutId="activeInd" className="ml-auto w-1.5 h-5 bg-rose-500 rounded-full" />}
                 </Link>
               ))}
             </div>
           </div>

           <div className="mb-8">
             <p className="px-4 text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Occasions & Themes</p>
             <div className="space-y-1.5">
               {occasions.map((occ) => (
                 <Link 
                   key={occ.name} 
                   href={occ.path}
                   onClick={() => setIsOpen(false)}
                   className="flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all duration-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 group"
                 >
                   <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all group-hover:scale-110">
                     {occ.icon}
                   </div>
                   <span className="text-sm font-medium">{occ.name}</span>
                 </Link>
               ))}
             </div>
           </div>

           {/* Promotional Ad area in sidebar */}
           <div className="mt-8 mx-4 p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl border border-indigo-100/50">
              <Sparkles className="w-6 h-6 text-indigo-500 mb-3" />
              <h4 className="text-sm font-bold text-indigo-900 mb-1">Upgrade to Pro</h4>
              <p className="text-xs text-indigo-700/80 mb-4 leading-relaxed">Unlock unlimited edits, invisible links, and full premium themes.</p>
              <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold py-2 rounded-xl transition-colors shadow-sm">
                View Plans
              </button>
           </div>
        </div>
      </aside>
    </>
  );
}
