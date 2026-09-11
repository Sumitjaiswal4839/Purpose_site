import React from 'react';

export default function TermsOfService() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-24 text-slate-300 min-h-screen">
      <h1 className="text-4xl font-black text-gray-900 mb-6 font-serif">Terms of Service</h1>
      <p className="mb-8 opacity-60 text-gray-500">Last updated: September 2026</p>
      <section className="space-y-6 text-base leading-relaxed text-gray-700">
        <div>
          <h2 className="text-2xl font-bold text-rose-500 mt-6 mb-2">1. Acceptance of Terms</h2>
          <p>By using Purpose Site, you agree to comply with these terms and applicable local laws including data privacy standards.</p>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-rose-500 mt-6 mb-2">2. Content Guidelines</h2>
          <p>Users are strictly prohibited from generating abusive, harassing, or malicious content using this platform.</p>
        </div>
      </section>
    </main>
  );
}
