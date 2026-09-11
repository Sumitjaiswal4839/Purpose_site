import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/payment/create-order
 *
 * Called after the user clicks "Payment Completed" in the modal.
 * Looks up the already-saved proposal by proposalId or transactionId,
 * sends an admin notification email, and returns success.
 *
 * NOTE: This route no longer uses MongoDB/Mongoose — Prisma only.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      amount,
      customerName,
      customerEmail,
      partnerName,
      transactionId,
      proposalId,
    } = body;

    if (!customerEmail || !amount) {
      return NextResponse.json(
        { success: false, error: "amount and customerEmail are required" },
        { status: 400 }
      );
    }

    // ── Find the proposal that was already saved by /api/proposals/save ──
    let proposal = null;
    if (proposalId) {
      proposal = await prisma.secretLink.findUnique({ where: { id: proposalId } });
    }
    if (!proposal && transactionId) {
      proposal = await prisma.secretLink.findUnique({ where: { transactionId } });
    }

    if (!proposal) {
      return NextResponse.json(
        { success: false, error: "Proposal not found. Please save first." },
        { status: 404 }
      );
    }

    let razorpayOrderId = null;
    let razorpayEnabled = false;

    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const Razorpay = require("razorpay");
        const rzp = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
        const order = await rzp.orders.create({
          amount: amount * 100,
          currency: "INR",
          receipt: proposal.transactionId,
        });
        razorpayOrderId = order.id;
        razorpayEnabled = true;
      } catch (err) {
        console.warn("[create-order] Razorpay error, falling back to mock:", err);
      }
    }

    // ── Fire admin notification (non-blocking — never crash on email failure) ──
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://purpose.site";
    fetch(`${appUrl}/api/notify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "checkout",
        buyerName: customerName || proposal.yourName,
        partnerName: partnerName || proposal.partnerName,
        templateId: proposal.templateType || "default",
        price: amount,
        proposalToken: proposal.token,
      }),
    }).catch((e) => console.warn("[create-order] Notify failed silently:", e));

    return NextResponse.json({
      success: true,
      message: "Payment request logged.",
      transactionId: proposal.transactionId,
      proposalToken: proposal.token,
      razorpayOrderId,
      razorpayEnabled,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[payment/create-order] Error:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
