import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planType, customerEmail, yourName, partnerName } = await req.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Payment is successful and verified
      const token = crypto.randomBytes(8).toString("hex");
      const maxViews = planType === 'premium' ? 2 : planType === 'ultimate' ? 5 : 1;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      // Create link directly in Prisma
      const newLink = await prisma.secretLink.create({
        data: {
          token,
          userEmail: customerEmail || "razorpay-customer@purpose.site",
          customerEmail: customerEmail || "razorpay-customer@purpose.site",
          yourName: yourName || "Customer",
          partnerName: partnerName || "Partner",
          maxViews,
          currentViews: 0,
          planType: planType || 'premium',
          expiresAt,
          isActive: true,
          paymentStatus: 'verified',
          transactionId: razorpay_payment_id
        },
      });

      return NextResponse.json({
        success: true,
        secretUrl: `/secret/${newLink.token}`,
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid signature" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Payment Verification Error:", error);
    return NextResponse.json(
      { success: false, error: "Verification failed in Prisma" },
      { status: 500 }
    );
  }
}

