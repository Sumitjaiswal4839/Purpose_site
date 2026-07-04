import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSecureToken } from "@/lib/encryption";

/**
 * POST /api/links/create
 *
 * Admin-only manual link creation (for offline/cash payments).
 * Requires x-admin-token header.
 * Uses Prisma/PostgreSQL — no MongoDB.
 */
export async function POST(req: Request) {
  try {
    const adminToken = (req as any).headers?.get?.("x-admin-token") ?? "";
    const adminUsername = process.env.ADMIN_USERNAME ?? "";
    if (adminUsername) {
      try {
        const decoded = Buffer.from(adminToken, "base64").toString("utf-8");
        if (!decoded.startsWith(adminUsername)) {
          return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }
      } catch {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
      }
    }

    const body = await req.json();
    const {
      yourName,
      partnerName,
      customerEmail,
      question,
      mediaUrls,
      musicTrack,
      effectType,
      filterType,
      fontStyle,
      maxViews = 2,
      planType = "premium",
      paymentAmount = 99,
    } = body;

    if (!yourName || !partnerName || !customerEmail) {
      return NextResponse.json(
        { success: false, error: "yourName, partnerName, customerEmail are required" },
        { status: 400 }
      );
    }

    const token = generateSecureToken();
    const transactionId = `MANUAL_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const link = await prisma.secretLink.create({
      data: {
        token,
        transactionId,
        yourName,
        partnerName,
        customerEmail,
        userEmail: customerEmail,
        question: question || "Will you marry me?",
        mediaUrls: mediaUrls || [],
        musicTrack,
        effectType,
        filterType,
        fontStyle,
        maxViews,
        currentViews: 0,
        isActive: true, // Manual links are immediately active
        paymentStatus: "verified",
        paymentAmount,
        planType,
        expiresAt,
        verifiedAt: new Date(),
        verifiedBy: "manual-admin",
      },
    });

    return NextResponse.json({
      success: true,
      link: {
        id: link.id,
        token: link.token,
        transactionId: link.transactionId,
        secretUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://purpose.site"}/secret/${link.token}`,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[links/create] Error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
