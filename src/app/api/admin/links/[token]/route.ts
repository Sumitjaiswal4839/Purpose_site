import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/adminAuth";

/**
 * PATCH /api/admin/links/[token]
 *
 * Fixes applied:
 * - Issue #1 / #9: Uses isAdminRequest() — signed HMAC token verification
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    if (!(await isAdminRequest(req))) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { token } = await params;
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON format in request body" },
        { status: 400 }
      );
    }
    const { action } = body ?? {};

    if (!action || !["expire", "reset", "extend"].includes(action)) {
      return NextResponse.json(
        { success: false, error: "Invalid action. Must be: expire | reset | extend" },
        { status: 400 }
      );
    }

    const link = await prisma.secretLink.findUnique({ where: { token } });
    if (!link) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    let updateData: Record<string, unknown> = {};

    if (action === "expire") {
      updateData = { isActive: false };
    } else if (action === "reset") {
      updateData = { currentViews: 0, isActive: true };
    } else if (action === "extend") {
      const newDate = new Date(link.expiresAt);
      newDate.setDate(newDate.getDate() + 7);
      updateData = { expiresAt: newDate, isActive: true };
    }

    const updatedLink = await prisma.secretLink.update({
      where: { token },
      data: updateData,
    });

    return NextResponse.json({ success: true, link: updatedLink });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[admin/links/[token] PATCH]", message);
    return NextResponse.json({ success: false, error: "Failed to update link" }, { status: 500 });
  }
}
