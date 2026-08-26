import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { cache } from "@/lib/cache";
import { isAdminRequest } from "@/lib/adminAuth";

/**
 * GET /api/admin/stats
 *
 * Fixes applied:
 * - Issue #1 / #9: Uses isAdminRequest() — signed HMAC token verification
 */

const STATS_CACHE_KEY = "admin:stats";
const STATS_CACHE_TTL = 30; // seconds

export async function GET(req: NextRequest) {
  try {
    if (!isAdminRequest(req)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Check cache first
    const cached = await cache.get<object>(STATS_CACHE_KEY);
    if (cached) {
      return NextResponse.json({ success: true, stats: cached, cached: true });
    }

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalProposals,
      revenueAgg,
      totalRequests,
      pendingRequests,
      viewsAgg,
      recentProposals,
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
      prisma.secretLink.count({
        where: {
          isActive: true,
          expiresAt: { gt: now },
          currentViews: { lt: 5 },
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

    await cache.set(STATS_CACHE_KEY, stats, STATS_CACHE_TTL);

    return NextResponse.json({ success: true, stats });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[admin/stats]", message);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
