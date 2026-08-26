import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSecureToken } from "@/lib/encryption";
import { isAdminRequest } from "@/lib/adminAuth";

/**
 * POST /api/admin/generate-link
 *
 * Fixes applied:
 * - Issue #1 / #9: Uses isAdminRequest() — signed HMAC token verification
 */
export async function POST(req: NextRequest) {
  try {
    if (!isAdminRequest(req)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      yourName,
      partnerName,
      customerEmail,
      question,
      maxViews = 2,
      paymentAmount = 99,
      planType = "premium",
    } = body ?? {};

    if (!yourName || !partnerName || !customerEmail) {
      return NextResponse.json(
        { success: false, error: "yourName, partnerName, customerEmail are required" },
        { status: 400 }
      );
    }

    if (typeof maxViews !== "number" || maxViews < 1 || maxViews > 10) {
      return NextResponse.json(
        { success: false, error: "maxViews must be a number between 1 and 10" },
        { status: 400 }
      );
    }

    const token = generateSecureToken();
    const transactionId = `MANUAL_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const link = await prisma.secretLink.create({
      data: {
        token,
        transactionId,
        yourName,
        partnerName,
        customerEmail,
        userEmail: customerEmail,
        question: question || "Will you marry me?",
        mediaUrls: [],
        maxViews,
        currentViews: 0,
        isActive: true,
        paymentStatus: "verified",
        paymentAmount,
        planType,
        expiresAt,
        verifiedAt: new Date(),
        verifiedBy: "manual-admin",
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://purpose.site";

    return NextResponse.json({
      success: true,
      link: {
        id: link.id,
        token: link.token,
        transactionId: link.transactionId,
        secretUrl: `${appUrl}/secret/${link.token}`,
        expiresAt: link.expiresAt,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[admin/generate-link]", message);
    return NextResponse.json({ success: false, error: "Failed to generate link" }, { status: 500 });
  }
}
