import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSecureToken, generateVerificationToken } from "@/lib/encryption";
import { sendVerificationEmail } from "@/lib/email";
import { sanitizeString, sanitizeEmail } from "@/lib/sanitize";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // ── Sanitize inputs ───────────────────────────────────────────────────
    const sanitizedYourName = sanitizeString(body.yourName, 100);
    const sanitizedPartnerName = sanitizeString(body.partnerName, 100);
    const sanitizedEmail = sanitizeEmail(body.customerEmail);
    const sanitizedQuestion = sanitizeString(body.question, 300);

    // Override body fields with sanitized values
    body.yourName = sanitizedYourName;
    body.partnerName = sanitizedPartnerName;
    body.customerEmail = sanitizedEmail ?? body.customerEmail;
    body.question = sanitizedQuestion;

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
    } = body;

    if (!yourName || !partnerName || !customerEmail) {
      return NextResponse.json(
        { success: false, error: "yourName, partnerName, customerEmail are required" },
        { status: 400 }
      );
    }

    const token = generateSecureToken();
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    // ── Create proposal — let Prisma manage createdAt/updatedAt ──────────
    const proposal = await prisma.secretLink.create({
      data: {
        token,
        transactionId,
        partnerName,
        yourName,
        customerEmail,
        userEmail: customerEmail,
        question: question || "Will you marry me?",
        mediaUrls: mediaUrls || [],
        musicTrack: musicTrack || null,
        effectType: effectType || null,
        filterType: filterType || null,
        fontStyle: fontStyle || null,
        maxViews: 2,
        currentViews: 0,
        isActive: false,
        expiresAt,
        paymentStatus: "pending",
        planType: "premium",
        paymentAmount: 99,
      },
    });

    // ── Generate verification token for admin email ───────────────────────
    const {
      token: verificationToken,
      hash: verificationHash,
      expiresAt: tokenExpiresAt,
    } = generateVerificationToken();

    const updatedProposal = await prisma.secretLink.update({
      where: { id: proposal.id },
      data: { verificationToken, verificationHash, tokenExpiresAt },
    });

    // ── Send admin verification email (non-blocking) ──────────────────────
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://purpose.site";
    sendVerificationEmail({
      adminEmail: process.env.GMAIL_USER || "admin@purpose.site",
      customerName: yourName,
      partnerName,
      transactionId: updatedProposal.transactionId,
      verificationLink: `${appUrl}/api/payment/verify-manual?token=${verificationToken}&transactionId=${updatedProposal.transactionId}`,
    }).catch((e) => console.warn("[proposals/save] Verification email failed:", e));

    return NextResponse.json({
      success: true,
      proposal: {
        id: updatedProposal.id,
        token: updatedProposal.token,
        transactionId: updatedProposal.transactionId,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[proposals/save] Error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
