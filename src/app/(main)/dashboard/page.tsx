import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Heart, Activity, CheckCircle, Clock } from 'lucide-react';
import LogoutButton from '@/components/auth/LogoutButton';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('purpose_session')?.value;

  if (!sessionToken) {
    redirect('/login');
  }

  let userEmail = '';
  try {
    const decoded = jwt.verify(sessionToken, process.env.JWT_SECRET || 'fallback-secret-for-dev') as { email: string };
    userEmail = decoded.email;
  } catch {
    redirect('/login');
  }

  // Fetch all proposals by this email
  const proposals = await prisma.secretLink.findMany({
    where: { userEmail },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-900 font-serif">Your Dashboard 💌</h1>
            <p className="text-gray-500 font-medium">Logged in as {userEmail}</p>
          </div>
          <div className="flex items-center gap-3">
            <LogoutButton />
            <Link href="/create" className="bg-rose-600 text-white px-6 py-3 rounded-full font-black text-sm hover:bg-rose-700 transition-all shadow-lg shadow-rose-200">
              Create New Proposal
            </Link>
          </div>
        </div>

        {proposals.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center">
            <Heart className="w-16 h-16 text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Proposals Yet</h2>
            <p className="text-gray-500 mb-8">You haven't created any secret links yet.</p>
            <Link href="/create" className="bg-gray-900 text-white px-8 py-4 rounded-full font-black hover:bg-black">
              Start Your First One 🚀
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proposals.map((p: any) => (
              <div key={p.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col relative overflow-hidden group">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {p.partnerName}
                  </div>
                  {p.partnerResponse?.toLowerCase() === 'yes' ? (
                    <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full text-xs font-bold">
                      <CheckCircle className="w-3 h-3" /> YES!
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-1 rounded-full text-xs font-bold">
                      <Clock className="w-3 h-3" /> Pending
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{p.question}</h3>
                
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 bg-gray-50 rounded-xl p-3">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Views</p>
                    <p className="font-black text-gray-800 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-rose-500" /> {p.currentViews}/{p.maxViews}
                    </p>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-xl p-3">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Status</p>
                    <p className="font-black text-gray-800 text-sm truncate">
                      {p.isActive ? 'Active' : 'Locked'}
                    </p>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                  <p className="text-xs text-gray-400 font-mono truncate max-w-[150px]">
                    purpose.site/secret/{p.token}
                  </p>
                  <a href={`/secret/${p.token}`} target="_blank" className="text-rose-600 font-bold text-xs hover:underline">
                    View Link
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
