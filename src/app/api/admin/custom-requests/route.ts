import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/adminAuth";

/**
 * GET/PATCH /api/admin/custom-requests
 *
 * Fixes applied:
 * - Issue #1 / #9: Uses isAdminRequest() — signed HMAC token verification
 */

export async function GET(req: NextRequest) {
  try {
    if (!isAdminRequest(req)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const dbRequests = await prisma.customRequest.findMany({
      orderBy: { createdAt: "desc" },
    });

    const requests = dbRequests.map((r) => {
      let extra: Record<string, string> = {
        forWhom: "",
        theme: "",
        special: "",
        urgency: "",
        originalBudget: "",
      };
      if (r.notes) {
        try {
          extra = { ...extra, ...JSON.parse(r.notes) };
        } catch {
          r.description.split("\n").forEach((line) => {
            if (line.startsWith("For: "))     extra.forWhom = line.slice(5);
            if (line.startsWith("Theme: "))   extra.theme   = line.slice(7);
            if (line.startsWith("Special: ")) extra.special = line.slice(9);
            if (line.startsWith("Urgency: ")) extra.urgency = line.slice(9);
          });
        }
      }

      return {
        id:          r.id,
        createdAt:   r.createdAt,
        name:        r.customerName,
        email:       r.customerEmail,
        phone:       r.phoneNumber ?? "",
        requestType: r.requestType,
        rating:      r.rating ?? 0,
        description: r.description,
        forWhom:     extra.forWhom,
        theme:       extra.theme,
        special:     extra.special,
        urgency:     extra.urgency,
        budget:      extra.originalBudget || (r.budget ? `₹${r.budget}` : ""),
        status:      r.status === "completed" ? "completed" : "pending",
      };
    });

    return NextResponse.json({ success: true, requests });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[admin/custom-requests GET]", message);
    return NextResponse.json({ success: false, error: "Failed to fetch requests" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    if (!isAdminRequest(req)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id, status } = await req.json();

    if (!id || typeof id !== "string") {
      return NextResponse.json({ success: false, error: "id is required" }, { status: 400 });
    }

    const allowedStatuses = ["pending", "in-progress", "completed", "rejected"];
    if (!status || !allowedStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: `status must be one of: ${allowedStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    await prisma.customRequest.update({ where: { id }, data: { status } });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[admin/custom-requests PATCH]", message);
    return NextResponse.json({ success: false, error: "Failed to update status" }, { status: 500 });
  }
}
