import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token: string | undefined = body?.token;

    if (!token || typeof token !== "string" || token.trim() === "") {
      return NextResponse.json(
        { allowed: false, expired: false, reason: "invalid-token" },
        { status: 400 }
      );
    }

    // ── Fetch link from Prisma (PostgreSQL only — no MongoDB) ──────────────
    const link = await prisma.secretLink.findUnique({
      where: { token: token.trim() },
    });

    // ── Not found ──────────────────────────────────────────────────────────
    if (!link) {
      return NextResponse.json(
        { allowed: false, expired: false, reason: "not-found" },
        { status: 404 }
      );
    }

    // ── Payment not verified ───────────────────────────────────────────────
    // Temporarily bypassed for demo/prototype — uncomment for production:
    /*
    if (link.paymentStatus !== "verified" || !link.isActive) {
      return NextResponse.json(
        { allowed: false, expired: false, reason: "not-verified" },
        { status: 403 }
      );
    }
    */

    // ── Expired by date ────────────────────────────────────────────────────
    if (new Date() > new Date(link.expiresAt)) {
      // Mark inactive atomically
      await prisma.secretLink.updateMany({
        where: { id: link.id, isActive: true },
        data: { isActive: false },
      });
      return NextResponse.json(
        { allowed: false, expired: true, reason: "expired" },
        { status: 403 }
      );
    }

    // ── View limit reached (maxViews defaults to 2) ────────────────────────
    if (link.currentViews >= link.maxViews) {
      await prisma.secretLink.updateMany({
        where: { id: link.id, isActive: true },
        data: { isActive: false },
      });
      return NextResponse.json(
        { allowed: false, expired: true, reason: "limit_reached" },
        { status: 403 }
      );
    }

    // ── Collect request metadata ───────────────────────────────────────────
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    // ── Atomic increment + access log ─────────────────────────────────────
    const updated = await prisma.secretLink.update({
      where: { id: link.id },
      data: {
        currentViews: { increment: 1 },
        accessLog: {
          create: {
            ipAddress: ip.substring(0, 45),
            userAgent: userAgent.substring(0, 500),
            viewNumber: link.currentViews + 1,
          },
        },
      },
    });

    const viewsRemaining = updated.maxViews - updated.currentViews;

    // ── Return full proposal payload for the frontend renderer ────────────
    return NextResponse.json({
      allowed: true,
      expired: false,
      data: {
        id: updated.id,
        token: updated.token,
        partnerName: updated.partnerName,
        yourName: updated.yourName,
        question: updated.question,
        mediaUrls: updated.mediaUrls,
        musicTrack: updated.musicTrack,
        effectType: updated.effectType,
        filterType: updated.filterType,
        fontStyle: updated.fontStyle,
        currentViews: updated.currentViews,
        maxViews: updated.maxViews,
        expiresAt: updated.expiresAt,
        planType: updated.planType,
        isActive: updated.isActive,
      },
      remaining: viewsRemaining,
      isLastView: viewsRemaining === 0,
      currentView: updated.currentViews,
      maxViews: updated.maxViews,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[links/verify] Error:", message);
    return NextResponse.json(
      { allowed: false, expired: false, reason: "error", error: message },
      { status: 500 }
    );
  }
}
