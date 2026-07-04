import React from 'react';
import Link from 'next/link';

interface ActionBarProps {
  templateId: string;
  previewPath: string;
}

export default function TemplateActionBar({ templateId, previewPath }: ActionBarProps) {
  return (
    <div className="w-full flex gap-3 mt-3">
      <a 
        href={previewPath} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-1.5"
      >
        <span>👁</span> Preview
      </a>
      <Link 
        href={`/editor?template=${templateId}`}
        className="flex-1 text-center bg-gray-900 border border-gray-900 hover:bg-black text-white py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
      >
        <span>✏️</span> Customize
      </Link>
    </div>
  );
}
