import { NextResponse, NextRequest } from "next/server";
import { verifySHA256 } from "@/lib/encryption";
import { prisma } from "@/lib/prisma";
import { sendCustomerActivationEmail } from "@/lib/email";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const token = searchParams.get("token");
    const transactionId = searchParams.get("transactionId");

    if (!token || !transactionId) {
      return NextResponse.json(
        { error: "Missing verification parameters" },
        { status: 400 }
      );
    }

    // Find the link with this transaction ID
    const secretLink = await prisma.secretLink.findUnique({
      where: { transactionId },
    });

    if (!secretLink) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Verify the token
    if (!secretLink.verificationHash || !verifySHA256(token, secretLink.verificationHash)) {
      return NextResponse.json(
        { error: "Invalid verification token" },
        { status: 401 }
      );
    }

    // Check if expired
    if (secretLink.tokenExpiresAt && new Date() > secretLink.tokenExpiresAt) {
      return NextResponse.json(
        { error: "Verification link has expired" },
        { status: 400 }
      );
    }

    // Activate the link
    const updatedLink = await prisma.secretLink.update({
      where: { id: secretLink.id },
      data: {
        isActive: true,
        paymentStatus: 'verified',
        verifiedAt: new Date(),
        verifiedBy: 'manual-admin',
      },
    });

    // Send customer activation email
    try {
      await sendCustomerActivationEmail({
        customerEmail: updatedLink.userEmail,
        yourName: updatedLink.yourName,
        partnerName: updatedLink.partnerName,
        proposalLink: `${process.env.NEXT_PUBLIC_APP_URL}/secret/${updatedLink.token}`,
      });
    } catch (emailError) {
      console.error('Failed to send activation email:', emailError);
      // Continue anyway, don't fail the verification
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified! Link activated successfully.",
      linkToken: updatedLink.token,
      redirectUrl: `/secret/${updatedLink.token}`,
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Manual verification error:", errorMessage);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
