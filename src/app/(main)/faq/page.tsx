"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChevronDown, HelpCircle, Sparkles, Send, ShieldCheck, Clock, Music } from "lucide-react";
import Link from "next/link";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
  icon: React.ReactNode;
}

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      category: "General",
      icon: <Sparkles className="w-5 h-5 text-rose-500" />,
      question: "Purpose platform kya hai?",
      answer: "Purpose ek unique cinematic proposal platform hai jahan aap apne partner ke liye personalized interactive proposal pages (Surprise Links) create kar sakte hain. Isme aap photos, background music, floating effects, and romantic questionnaires custom design karwa sakte hain."
    },
    {
      category: "Privacy & Security",
      icon: <ShieldCheck className="w-5 h-5 text-indigo-500" />,
      question: "Kya mere surprise links private aur secure hain?",
      answer: "Haan, absolutely! Har proposal link ke sath unique verification tokens linked hote hain. Saath hi humne 2-view protection link system add kiya hai taaki links public forward hone se pehle locked ho jayein. Hum privacy ka poora dhyan rakhte hain."
    },
    {
      category: "Customization",
      icon: <Music className="w-5 h-5 text-pink-500" />,
      question: "Kya main apni pasand ke gaane aur photos add kar sakta hoon?",
      answer: "Yes! Proposal builder me create karte waqt aap apne images choose kar sakte hain, custom music loop configure kar sakte hain, aur specific background vibes (like heart float, rose petals falling) choose kar sakte hain. Agar kuch special feature chahiye, toh aap hamari 'Custom Order' service use kar sakte hain."
    },
    {
      category: "General",
      icon: <Clock className="w-5 h-5 text-rose-500" />,
      question: "Proposal link ki validity kitne din tak rehti hai?",
      answer: "By default, free plans me links 7 days tak active rehte hain. Premium links ya custom order templates par links life-time active rehte hain ya jab tak aap admin panel se unhe delete na kar dein."
    },
    {
      category: "Delivery",
      icon: <Send className="w-5 h-5 text-emerald-500" />,
      question: "Custom Order request send karne ke baad kya hota hai?",
      answer: "Jab aap Custom Order request submit karte hain, hamari team 2-3 ghante ke andar aapke WhatsApp ya email par aapse directly contact karegi. Hum aapse details aur references collect karke 24 hours me aapka dream proposal page live kar denge."
    },
    {
      category: "Payment",
      icon: <HelpCircle className="w-5 h-5 text-amber-500" />,
      question: "Kya free templates available hain?",
      answer: "Yes, our basic standard templates are completely free! Humare paas premium templates bhi hain jo unique interactive features support karte hain. Unhe select karne par aap direct manual UPI verification se checkout kar sakte hain."
    }
  ];

  return (
    <div className="min-h-screen bg-rose-50/30 pt-32 pb-24 px-4 sm:px-6 page-fade-in">
      <div className="max-w-4xl mx-auto">
        
        {/* Header section */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500 shadow-lg shadow-rose-100"
          >
            <HelpCircle className="w-8 h-8" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black mb-4 font-serif bg-gradient-to-r from-rose-600 to-indigo-600 bg-clip-text text-transparent leading-tight"
          >
            Kuch Sawaal Hain? Hame Pata Hai!
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-lg max-w-lg mx-auto font-medium"
          >
            Frequently Asked Questions — Yahan aapko apne surprise links aur templates se jude saare answers milenge.
          </motion.p>
        </div>

        {/* FAQs Accordion Grid */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;
            return (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-3xl border border-rose-100/60 shadow-lg shadow-rose-100/10 overflow-hidden"
              >
                <button
                  onClick={() => setActiveIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 sm:p-8 text-left transition-colors hover:bg-rose-50/10 focus:outline-none"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-rose-50 transition-colors">
                      {faq.icon}
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-rose-500/60 tracking-wider mb-1 block">
                        {faq.category}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-slate-800 leading-snug">
                        {faq.question}
                      </h3>
                    </div>
                  </div>
                  
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 ml-4"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-8 pl-[64px] pr-8 text-slate-600 text-sm leading-relaxed border-t border-slate-50 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Support Prompt */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16 p-8 rounded-[2rem] bg-gradient-to-br from-rose-500/5 to-indigo-500/5 border border-rose-100/40"
        >
          <h4 className="text-lg font-bold text-slate-800 mb-2">Abhi bhi koi confusion hai?</h4>
          <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
            Humein directly message karein ya custom design order send karein, hum turant madad karenge!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/custom-request" className="bg-rose-600 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md hover:bg-rose-700 transition-all">Custom Order Request</Link>
            <a href="https://wa.me/91XXXXXXXXXX" target="_blank" className="bg-emerald-500 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md hover:bg-emerald-600 transition-all">WhatsApp Directly</a>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
