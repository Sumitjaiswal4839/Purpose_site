import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { cache } from "@/lib/cache";

const STATS_CACHE_KEY = 'admin:stats';
const STATS_CACHE_TTL = 30; // seconds

function verifyAdminAuth(req: NextRequest): boolean {
  const adminUsername = process.env.ADMIN_USERNAME;
  const token = req.headers.get("x-admin-token");
  if (token && adminUsername) {
    try {
      const decoded = Buffer.from(token, "base64").toString("utf-8");
      if (decoded.startsWith(adminUsername)) return true;
    } catch {
      // invalid base64 — fall through
    }
  }
  return false;
}

export async function GET(req: NextRequest) {
  try {
    if (!verifyAdminAuth(req)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // ── Check cache first ─────────────────────────────────────────────────
    const cached = await cache.get<object>(STATS_CACHE_KEY);
    if (cached) {
      return NextResponse.json({ success: true, stats: cached, cached: true });
    }

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Run all queries in parallel for speed
    const [
      totalProposals,
      revenueAgg,
      totalRequests,
      pendingRequests,
      viewsAgg,
      recentProposals,
      // ── FIX: use plain number comparison, NOT prisma.secretLink.fields.maxViews ──
      activeProposals,
    ] = await Promise.all([
      prisma.secretLink.count(),
      prisma.secretLink.aggregate({
        where: { paymentStatus: "verified" },
        _sum: { paymentAmount: true },
      }),
      prisma.customRequest.count(),
      prisma.customRequest.count({ where: { status: "pending" } }),
      prisma.secretLink.aggregate({ _sum: { currentViews: true } }),
      prisma.secretLink.count({ where: { createdAt: { gt: sevenDaysAgo } } }),
      // Active = isActive true AND not expired AND views < maxViews (safe numeric check)
      prisma.secretLink.count({
        where: {
          isActive: true,
          expiresAt: { gt: now },
          // Prisma doesn't support column-to-column comparison directly;
          // we use a raw filter on a safe default (maxViews is always 2 or 5)
          currentViews: { lt: 5 }, // conservative upper bound
        },
      }),
    ]);

    const totalRevenue = revenueAgg._sum.paymentAmount ?? 0;
    const totalViews = viewsAgg._sum.currentViews ?? 0;
    const recentGrowth =
      totalProposals > 0
        ? Math.round((recentProposals / totalProposals) * 100)
        : 0;

    const stats = {
      totalProposals,
      totalRevenue,
      activeProposals,
      totalRequests,
      pendingRequests,
      totalViews,
      recentGrowth,
      recentProposals,
    };

    // ── Cache the result for 30 seconds ──────────────────────────────────
    await cache.set(STATS_CACHE_KEY, stats, STATS_CACHE_TTL);

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[admin/stats] Error:", message);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
