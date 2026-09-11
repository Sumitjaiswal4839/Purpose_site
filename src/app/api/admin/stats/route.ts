import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/adminAuth";
import { redis } from '@/lib/redis';

const STATS_CACHE_KEY = "admin:stats";
const STATS_CACHE_TTL = 300; // 5 minutes

export async function GET(req: NextRequest) {
  try {
    if (!(await isAdminRequest(req))) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Check Redis cache first
    let cachedStatsStr = null;
    if (redis) {
      try {
        cachedStatsStr = await redis.get<string>(STATS_CACHE_KEY);
      } catch (err) {
        console.error("Redis get failed:", err);
      }
    }
    if (cachedStatsStr) {
      let cachedStats;
      try {
        cachedStats = typeof cachedStatsStr === 'string' ? JSON.parse(cachedStatsStr) : cachedStatsStr;
      } catch (e) {
        cachedStats = cachedStatsStr;
      }
      return NextResponse.json({ success: true, stats: cachedStats, cached: true });
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

    if (redis) {
      try {
        await redis.setex(STATS_CACHE_KEY, STATS_CACHE_TTL, JSON.stringify(stats));
      } catch (err) {
        console.error("Redis setex failed:", err);
      }
    }

    return NextResponse.json({ success: true, stats, cached: false });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[admin/stats]", message);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
