import React from 'react';

export default function PrivacyPolicy() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-24 text-slate-300 min-h-screen">
      <h1 className="text-4xl font-black text-gray-900 mb-6 font-serif">Privacy Policy</h1>
      <p className="mb-8 opacity-60 text-gray-500">Last updated: September 2026</p>
      <section className="space-y-6 text-base leading-relaxed text-gray-700">
        <div>
          <h2 className="text-2xl font-bold text-rose-500 mt-6 mb-2">1. Information We Collect</h2>
          <p>We collect names, personal messages, and media uploads provided during proposal creation to render your personalized pages.</p>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-rose-500 mt-6 mb-2">2. Data Security</h2>
          <p>All data is securely stored in encrypted database clusters. We do not sell or share your personal information with third parties. Links automatically expire or lock after maximum views.</p>
        </div>
      </section>
    </main>
  );
}
