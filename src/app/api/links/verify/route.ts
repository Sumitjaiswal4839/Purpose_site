import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/links/verify
 *
 * Fixes applied:
 * - Issue #2: Payment gate RESTORED — links with paymentStatus !== "verified"
 *   or isActive === false are blocked. The commented-out block has been reinstated.
 * - Issue #19 (partial): View counter is incremented here. The SSR bypass is fixed
 *   in src/app/secret/[token]/page.tsx (proposalData now always passed as null).
 */
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

    const link = await prisma.secretLink.findUnique({
      where: { token: token.trim() },
    });

    if (!link) {
      return NextResponse.json(
        { allowed: false, expired: false, reason: "not-found" },
        { status: 404 }
      );
    }

    // ── Issue #2 Fix: Payment gate RESTORED ───────────────────────────────
    if (link.paymentStatus !== "verified" || !link.isActive) {
      return NextResponse.json(
        { allowed: false, expired: false, reason: "not-verified" },
        { status: 403 }
      );
    }

    // ── Expired by date ───────────────────────────────────────────────────
    if (new Date() > new Date(link.expiresAt)) {
      await prisma.secretLink.updateMany({
        where: { id: link.id, isActive: true },
        data: { isActive: false },
      });
      return NextResponse.json(
        { allowed: false, expired: true, reason: "expired" },
        { status: 403 }
      );
    }

    // ── Atomic check and increment ───────────────────────────────────────
    const updatedCount = await prisma.secretLink.updateMany({
      where: { 
        id: link.id,
        currentViews: { lt: link.maxViews }
      },
      data: {
        currentViews: { increment: 1 },
      },
    });

    if (updatedCount.count === 0) {
      await prisma.secretLink.updateMany({
        where: { id: link.id, isActive: true },
        data: { isActive: false },
      });
      return NextResponse.json(
        { allowed: false, expired: true, reason: "limit_reached" },
        { status: 403 }
      );
    }

    // Fetch the updated link state to return correct data
    const updated = await prisma.secretLink.findUnique({
      where: { id: link.id }
    });

    if (!updated) {
      return NextResponse.json(
        { allowed: false, expired: false, reason: "not-found" },
        { status: 404 }
      );
    }

    // ── Collect request metadata ──────────────────────────────────────────
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    // ── Access log ───────────────────────────────────────────────────────
    await prisma.accessLog.create({
      data: {
        secretLinkId: updated.id,
        ipAddress: ip.substring(0, 45),
        userAgent: userAgent.substring(0, 500),
        viewNumber: updated.currentViews,
      },
    });

    // ── Email notification on first view ─────────────────────────────────
    if (link.currentViews === 0 && link.customerEmail) {
      try {
        const { sendOpenNotificationEmail } = await import("@/lib/email");
        sendOpenNotificationEmail(link.customerEmail, link.partnerName).catch((e) => {
          console.error("[links/verify] Async email notification failed:", e);
        });
      } catch (emailErr) {
        console.error("[links/verify] Failed to load email module:", emailErr);
      }
    }

    const viewsRemaining = updated.maxViews - updated.currentViews;

    return NextResponse.json({
      allowed: true,
      expired: false,
      data: {
        id:           updated.id,
        token:        updated.token,
        partnerName:  updated.partnerName,
        yourName:     updated.yourName,
        question:     updated.question,
        mediaUrls:    updated.mediaUrls,
        musicTrack:   updated.musicTrack,
        effectType:   updated.effectType,
        filterType:   updated.filterType,
        fontStyle:    updated.fontStyle,
        currentViews: updated.currentViews,
        maxViews:     updated.maxViews,
        expiresAt:    updated.expiresAt,
        unlocksAt:    (updated as any).unlocksAt,
        planType:     updated.planType,
        isActive:     updated.isActive,
      },
      remaining:    viewsRemaining,
      isLastView:   viewsRemaining === 0,
      currentView:  updated.currentViews,
      maxViews:     updated.maxViews,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[links/verify]", message);
    return NextResponse.json(
      { allowed: false, expired: false, reason: "error" },
      { status: 500 }
    );
  }
}
