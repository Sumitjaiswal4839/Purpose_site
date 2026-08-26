import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/adminAuth";

/**
 * GET/POST /api/admin/proposals
 *
 * Fixes applied:
 * - Issue #10: Now uses the same isAdminRequest() as all other admin routes.
 *   Previously used base64(username:password) which was incompatible with the
 *   token returned by /api/admin/auth (base64 timestamp token). Now unified.
 * - Issue #1 / #9: Signed HMAC token verification via isAdminRequest()
 */

export async function GET(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "all";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = 10;
    const skip = (page - 1) * limit;

    const allowedStatuses = ["pending", "verified", "failed"];
    const filter: Record<string, string> = {};
    if (allowedStatuses.includes(status)) {
      filter.paymentStatus = status;
    }

    const [proposals, total] = await Promise.all([
      prisma.secretLink.findMany({
        where: filter,
        select: {
          id: true,
          token: true,
          transactionId: true,
          yourName: true,
          partnerName: true,
          customerEmail: true,
          paymentStatus: true,
          paymentAmount: true,
          maxViews: true,
          currentViews: true,
          isActive: true,
          expiresAt: true,
          verifiedAt: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.secretLink.count({ where: filter }),
    ]);

    const statsAgg = await prisma.secretLink.aggregate({
      where: { paymentStatus: "verified" },
      _sum: { paymentAmount: true },
    });

    return NextResponse.json({
      success: true,
      data: proposals,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats: {
        totalProposals:      await prisma.secretLink.count(),
        pendingVerification: await prisma.secretLink.count({ where: { paymentStatus: "pending" } }),
        verifiedProposals:   await prisma.secretLink.count({ where: { paymentStatus: "verified" } }),
        totalRevenue:        statsAgg._sum.paymentAmount ?? 0,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[admin/proposals GET]", message);
    return NextResponse.json({ error: "Failed to fetch proposals" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { transactionId } = body ?? {};

    if (!transactionId || typeof transactionId !== "string") {
      return NextResponse.json({ error: "transactionId is required" }, { status: 400 });
    }

    const proposal = await prisma.secretLink.update({
      where: { transactionId },
      data: {
        isActive: true,
        paymentStatus: "verified",
        verifiedAt: new Date(),
        verifiedBy: "manual-admin",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Proposal verified successfully",
      data: proposal,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[admin/proposals POST]", message);
    return NextResponse.json({ error: "Failed to verify proposal" }, { status: 500 });
  }
}
