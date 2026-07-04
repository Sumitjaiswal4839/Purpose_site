"use client";

import React from 'react';
import Link from 'next/link';
import { Eye, Edit2 } from 'lucide-react';

export const TemplateCard = ({ template }: { template: any }) => {
  return (
    <div className="border border-gray-100 bg-white shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl p-5 flex flex-col gap-4 group h-full">
      <div className="flex justify-between items-start">
         <h4 className="font-bold text-gray-800 text-lg group-hover:text-pink-600 transition-colors">{template.title}</h4>
         <span className={`text-xs font-bold px-2 py-1 rounded-md ${template.price === 'Free' ? 'bg-emerald-100 text-emerald-700' : 'bg-pink-100 text-pink-700'}`}>
            {template.price}
         </span>
      </div>
      
      <p className="text-sm text-gray-500 line-clamp-3">{template.desc}</p>
      
      <div className="mt-auto pt-4 flex gap-3">
        <Link 
          href={template.previewPath} 
          className="flex-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 flex items-center justify-center gap-2 text-sm font-bold py-2.5 rounded-xl transition-all"
        >
          <Eye className="w-4 h-4" /> Preview
        </Link>
        <Link 
          href={template.editPath} 
          className="flex-1 bg-gray-900 hover:bg-gray-800 text-white flex items-center justify-center gap-2 text-sm font-bold py-2.5 rounded-xl transition-all shadow-md shadow-gray-900/20 hover:scale-105 active:scale-95"
        >
          <Edit2 className="w-4 h-4" /> Edit
        </Link>
      </div>
    </div>
  );
};
