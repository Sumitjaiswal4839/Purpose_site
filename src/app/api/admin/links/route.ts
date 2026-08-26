import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/adminAuth";

/**
 * GET /api/admin/links
 *
 * Fixes applied:
 * - Issue #1 / #9: Uses isAdminRequest() — signed HMAC token verification
 * - Issue #9: No longer skips auth when ADMIN_USERNAME is unset (isAdminRequest handles that)
 */
export async function GET(req: NextRequest) {
  try {
    if (!isAdminRequest(req)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const links = await prisma.secretLink.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { accessLog: true },
        },
      },
    });

    return NextResponse.json({ success: true, links });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[admin/links GET]", message);
    // Issue #30: Don't expose raw Prisma error details to client
    return NextResponse.json(
      { success: false, error: "Failed to fetch data from database" },
      { status: 500 }
    );
  }
}
