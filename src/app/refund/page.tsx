import React from 'react';
import Link from 'next/link';

export default function RefundPolicy() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-24 text-slate-300 min-h-screen">
      <h1 className="text-4xl font-black text-gray-900 mb-6 font-serif">Refund Policy</h1>
      <p className="mb-8 opacity-60 text-gray-500">Last updated: September 2026</p>
      
      <section className="space-y-6 text-base leading-relaxed text-gray-700">
        <div>
          <h2 className="text-2xl font-bold text-rose-500 mt-6 mb-2">1. Digital Goods</h2>
          <p>Since Purpose Site provides a personalized, instantly accessible digital service (the Proposal Link), all sales are final and non-refundable once the link is generated and paid for.</p>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-rose-500 mt-6 mb-2">2. Link Expiry and Limitations</h2>
          <p>Please note that links are governed by view limits (e.g., 2 views for Basic, 10 views for Premium) and time limits. We do not provide refunds if your intended recipient fails to view the link before it expires or hits the view limit.</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-rose-500 mt-6 mb-2">3. Exceptions</h2>
          <p>If you experience a technical failure that completely prevents the link from being generated after a successful charge, please contact our support team. Verified technical failures will be fully refunded.</p>
        </div>
      </section>

      <div className="mt-12 pt-8 border-t border-gray-200">
         <Link href="/" className="text-rose-500 font-bold hover:underline">← Back to Home</Link>
      </div>
    </main>
  );
}
