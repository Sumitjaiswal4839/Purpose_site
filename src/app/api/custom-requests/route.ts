import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitizeString, sanitizeEmail } from "@/lib/sanitize";
import { isAdminRequest } from "@/lib/adminAuth";
import { sendNotificationEmail } from "../notify/route";

/**
 * Fixes applied:
 * - Issue #7: GET now requires admin authentication — was fully public, exposing PII
 * - POST remains public (user-facing form submission) but has sanitization
 */

export async function GET(request: NextRequest) {
  // Issue #7 fix: this endpoint returns PII (names, emails, phones). Auth required.
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "all";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = 10;
    const skip = (page - 1) * limit;

    const allowedStatuses = ["pending", "in-progress", "completed", "rejected"];
    const where = status !== "all" && allowedStatuses.includes(status) ? { status } : {};

    const [requests, total] = await Promise.all([
      prisma.customRequest.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.customRequest.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: requests,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[custom-requests GET]", message);
    return NextResponse.json({ success: false, error: "Failed to fetch requests" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // ── Sanitize inputs ───────────────────────────────────────────────────
    const rawName        = body.customerName || body.name;
    const rawEmail       = body.customerEmail || body.email;
    const rawDescription = body.description;
    const rawRequestType = body.requestType;

    if (rawName       !== undefined) body.customerName = sanitizeString(rawName, 100);
    if (rawEmail      !== undefined) body.customerEmail = sanitizeEmail(rawEmail) ?? rawEmail;
    if (rawDescription !== undefined) body.description = sanitizeString(rawDescription, 2000);
    if (rawRequestType !== undefined) {
      const allowed = ["order", "feedback", "idea"] as const;
      body.requestType = allowed.includes(rawRequestType) ? rawRequestType : "order";
    }

    const customerName: string = body.customerName || body.name || "";
    const customerEmail: string = body.customerEmail || body.email || "";
    const phoneNumber: string | undefined = body.phoneNumber || body.phone;
    const requestType: string = body.requestType || "order";
    const rating: number | undefined =
      body.rating != null ? parseInt(String(body.rating)) : undefined;

    if (!customerName.trim()) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    }

    if (!customerEmail.trim()) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    const description: string =
      body.description ||
      [
        body.forWhom  ? `For: ${body.forWhom}`   : "",
        body.theme    ? `Theme: ${body.theme}`   : "",
        body.special  ? `Special: ${body.special}` : "",
        body.urgency  ? `Urgency: ${body.urgency}` : "",
      ]
        .filter(Boolean)
        .join("\n") ||
      "No description provided";

    const budget: number | undefined =
      body.budget != null
        ? typeof body.budget === "number"
          ? body.budget
          : parseFloat(String(body.budget).replace(/[^0-9.]/g, "")) || undefined
        : undefined;

    const notes =
      body.forWhom || body.theme || body.special || body.urgency
        ? JSON.stringify({
            forWhom:       body.forWhom       || "",
            theme:         body.theme         || "",
            special:       body.special       || "",
            urgency:       body.urgency       || "",
            originalBudget: body.budget       || "",
          })
        : undefined;

    const customRequest = await prisma.customRequest.create({
      data: {
        customerName,
        customerEmail,
        phoneNumber,
        requestType,
        description,
        referenceImages: [],
        budget,
        rating,
        status: "pending",
        notes,
      },
    });

    // Non-blocking notification
    sendNotificationEmail(
      requestType === "feedback"
        ? {
            type: "feedback",
            name: customerName,
            email: customerEmail,
            rating: rating ?? 0,
            comment: description,
          }
        : {
            type: "custom_request",
            name: customerName,
            email: customerEmail,
            phone: phoneNumber,
            description,
            budget: body.budget ? String(body.budget) : undefined,
            urgency: body.urgency,
          }
    ).catch((e) => console.warn("[custom-requests] notify failed:", e));

    return NextResponse.json({
      success: true,
      message: "Submitted successfully",
      data: { id: customRequest.id },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[custom-requests POST]", message);
    return NextResponse.json({ success: false, error: "Failed to submit request" }, { status: 500 });
  }
}
