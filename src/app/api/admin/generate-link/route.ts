import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSecureToken } from "@/lib/encryption";

function verifyAdminAuth(req: NextRequest): boolean {
  const adminUsername = process.env.ADMIN_USERNAME;
  const token = req.headers.get("x-admin-token");
  if (token && adminUsername) {
    try {
      const decoded = Buffer.from(token, "base64").toString("utf-8");
      if (decoded.startsWith(adminUsername)) return true;
    } catch { /* invalid base64 */ }
  }
  return false;
}

/**
 * POST /api/admin/generate-link
 * Admin manually generates a pre-paid live link (for cash/UPI offline payments).
 */
export async function POST(req: NextRequest) {
  try {
    if (!verifyAdminAuth(req)) {
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
    } = body;

    if (!yourName || !partnerName || !customerEmail) {
      return NextResponse.json(
        { success: false, error: "yourName, partnerName, customerEmail are required" },
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
    console.error("[admin/generate-link] Error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
