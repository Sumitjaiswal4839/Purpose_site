import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/payment/verify
 *
 * Fixes applied:
 * - Issue #13: RAZORPAY_KEY_SECRET || "" replaced — if key is missing, we
 *   immediately return 503 instead of silently using an empty secret which
 *   would make signature verification trivially bypassable.
 * - Issue #12: Razorpay link now saves yourName/partnerName/customerEmail
 *   from the request body instead of falling back to placeholder strings.
 *   Also uses crypto.timingSafeEqual for signature comparison.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planType,
      customerEmail,
      yourName,
      partnerName,
    } = body ?? {};

    // Validate required Razorpay fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Missing Razorpay payment fields" },
        { status: 400 }
      );
    }

    // Issue #13 fix: fail loudly if Razorpay is not configured
    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!razorpaySecret) {
      console.error("[payment/verify] RAZORPAY_KEY_SECRET is not configured.");
      return NextResponse.json(
        { success: false, error: "Payment gateway not configured on server." },
        { status: 503 }
      );
    }

    // Build expected signature
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", razorpaySecret)
      .update(payload)
      .digest("hex");

    // Issue #13 fix: timing-safe comparison instead of plain ===
    const sigBuffer = Buffer.from(razorpay_signature ?? "", "hex");
    const expectedBuffer = Buffer.from(expectedSignature, "hex");

    const isAuthentic =
      sigBuffer.length === expectedBuffer.length &&
      crypto.timingSafeEqual(sigBuffer, expectedBuffer);

    if (!isAuthentic) {
      console.warn("[payment/verify] Signature mismatch for payment:", razorpay_payment_id);
      return NextResponse.json(
        { success: false, error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Signature valid — create the verified link
    const token = crypto.randomBytes(16).toString("hex");
    const maxViews = planType === "ultimate" ? 5 : planType === "premium" ? 2 : 1;
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Issue #12 fix: use actual customer data, not placeholder strings
    const newLink = await prisma.secretLink.create({
      data: {
        token,
        userEmail:     customerEmail || "",
        customerEmail: customerEmail || "",
        yourName:      yourName      || "",
        partnerName:   partnerName   || "",
        maxViews,
        currentViews:  0,
        planType:      planType || "premium",
        expiresAt,
        isActive:      true,
        paymentStatus: "verified",
        transactionId: razorpay_payment_id,
        verifiedAt:    new Date(),
        verifiedBy:    "razorpay",
      },
    });

    return NextResponse.json({
      success: true,
      secretUrl: `/secret/${newLink.token}`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[payment/verify] Error:", message);
    return NextResponse.json(
      { success: false, error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
