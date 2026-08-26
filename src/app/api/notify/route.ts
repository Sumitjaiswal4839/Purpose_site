import { NextResponse, NextRequest } from "next/server";
import nodemailer from "nodemailer";

/**
 * Fixes applied:
 * - Issue #8: POST /api/notify now requires admin auth to prevent email spam/phishing
 * - Issue #14: Transporter is created via factory function (lazy), not at module load
 * - Issue #17: User-supplied values are HTML-escaped before insertion into email HTML
 */

// ─── HTML Escaping (XSS fix for email content) ────────────────────────────────
function escHtml(str: unknown): string {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ─── Types ────────────────────────────────────────────────────────────────────
export type NotifyPayload =
  | { type: "checkout"; buyerName: string; partnerName: string; templateId: string; price: number; proposalToken?: string }
  | { type: "custom_request"; name: string; email: string; phone?: string; description: string; budget?: string; urgency?: string }
  | { type: "feedback"; name: string; email: string; rating: number; comment: string };

// ─── Transporter factory (Issue #14 fix: lazy, not at module load) ────────────
function createTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASS;
  if (!user || !pass) return null;
  return nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
}

// ─── Email HTML builders (Issue #17 fix: all user values escaped) ─────────────
function checkoutHtml(p: Extract<NotifyPayload, { type: "checkout" }>) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://purpose.site";
  return `
  <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
    <div style="background:linear-gradient(135deg,#e11d48 0%,#be185d 100%);padding:32px 40px;text-align:center">
      <h1 style="color:#fff;margin:0;font-size:24px;font-weight:800">💍 New Premium Checkout</h1>
      <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px">Action required — verify &amp; activate</p>
    </div>
    <div style="padding:32px 40px">
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:13px;width:40%">Buyer Name</td><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-weight:700;color:#0f172a">${escHtml(p.buyerName)}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:13px">Partner Name</td><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-weight:700;color:#0f172a">${escHtml(p.partnerName)}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:13px">Template ID</td><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-weight:700;color:#0f172a">${escHtml(p.templateId)}</td></tr>
        <tr><td style="padding:10px 0;color:#64748b;font-size:13px">Price Paid</td><td style="padding:10px 0;font-weight:800;color:#e11d48;font-size:18px">₹${escHtml(String(p.price))}</td></tr>
      </table>
      <div style="margin-top:28px;text-align:center">
        <a href="${escHtml(appUrl)}/admin" style="display:inline-block;background:linear-gradient(135deg,#e11d48,#be185d);color:#fff;text-decoration:none;padding:14px 36px;border-radius:50px;font-weight:800;font-size:15px">
          ✓ Go to Admin Panel
        </a>
      </div>
      ${p.proposalToken ? `<p style="margin-top:20px;text-align:center;font-size:12px;color:#94a3b8">Proposal Token: <code>${escHtml(p.proposalToken)}</code></p>` : ""}
    </div>
    <div style="background:#f8fafc;padding:16px 40px;text-align:center;font-size:11px;color:#94a3b8">Purpose Site Admin Alert • ${new Date().toLocaleString("en-IN")}</div>
  </div>`;
}

function customRequestHtml(p: Extract<NotifyPayload, { type: "custom_request" }>) {
  return `
  <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
    <div style="background:linear-gradient(135deg,#7c3aed 0%,#4f46e5 100%);padding:32px 40px;text-align:center">
      <h1 style="color:#fff;margin:0;font-size:24px;font-weight:800">✨ New Custom Design Request</h1>
    </div>
    <div style="padding:32px 40px">
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:13px;width:40%">Name</td><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-weight:700;color:#0f172a">${escHtml(p.name)}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:13px">Email</td><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-weight:700;color:#0f172a">${escHtml(p.email)}</td></tr>
        ${p.phone  ? `<tr><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:13px">Phone</td><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-weight:700;color:#0f172a">${escHtml(p.phone)}</td></tr>` : ""}
        ${p.budget ? `<tr><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:13px">Budget</td><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-weight:700;color:#16a34a">${escHtml(p.budget)}</td></tr>` : ""}
        ${p.urgency ? `<tr><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:13px">Urgency</td><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-weight:700;color:#dc2626">${escHtml(p.urgency)}</td></tr>` : ""}
      </table>
      <div style="margin-top:20px;background:#f8fafc;border-left:4px solid #7c3aed;padding:16px 20px;border-radius:0 8px 8px 0">
        <p style="margin:0;font-size:13px;color:#374151;line-height:1.7;white-space:pre-wrap">${escHtml(p.description)}</p>
      </div>
    </div>
    <div style="background:#f8fafc;padding:16px 40px;text-align:center;font-size:11px;color:#94a3b8">Purpose Site • ${new Date().toLocaleString("en-IN")}</div>
  </div>`;
}

function feedbackHtml(p: Extract<NotifyPayload, { type: "feedback" }>) {
  const safeRating = Math.max(0, Math.min(5, Math.floor(p.rating)));
  const stars = "★".repeat(safeRating) + "☆".repeat(5 - safeRating);
  return `
  <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
    <div style="background:linear-gradient(135deg,#f59e0b 0%,#d97706 100%);padding:32px 40px;text-align:center">
      <h1 style="color:#fff;margin:0;font-size:24px;font-weight:800">⭐ New User Feedback</h1>
    </div>
    <div style="padding:32px 40px">
      <div style="text-align:center;margin-bottom:24px">
        <span style="font-size:32px;color:#f59e0b;letter-spacing:4px">${stars}</span>
        <p style="margin:8px 0 0;font-size:28px;font-weight:800;color:#0f172a">${safeRating}/5</p>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
        <tr><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:13px;width:40%">From</td><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-weight:700;color:#0f172a">${escHtml(p.name)}</td></tr>
        <tr><td style="padding:10px 0;color:#64748b;font-size:13px">Email</td><td style="padding:10px 0;font-weight:700;color:#0f172a">${escHtml(p.email)}</td></tr>
      </table>
      <div style="background:#fffbeb;border-left:4px solid #f59e0b;padding:16px 20px;border-radius:0 8px 8px 0">
        <p style="margin:0;font-size:14px;color:#374151;line-height:1.7;font-style:italic">"${escHtml(p.comment)}"</p>
      </div>
    </div>
    <div style="background:#f8fafc;padding:16px 40px;text-align:center;font-size:11px;color:#94a3b8">Purpose Site • ${new Date().toLocaleString("en-IN")}</div>
  </div>`;
}

// ─── Shared helper (called by other routes like custom-requests) ──────────────
export async function sendNotificationEmail(body: NotifyPayload) {
  const adminEmail = process.env.GMAIL_USER;

  // Issue #14 fix: lazy factory, not module-level init
  const transporter = createTransporter();
  if (!transporter || !adminEmail) {
    console.warn("[notify] Gmail credentials not configured — skipping email.");
    return { success: true, skipped: true };
  }

  let subject = "";
  let html = "";

  if (body.type === "checkout") {
    subject = `💍 New Checkout — ${body.buyerName} → ${body.partnerName} (₹${body.price})`;
    html = checkoutHtml(body);
  } else if (body.type === "custom_request") {
    subject = `✨ Custom Request — ${body.name} (${body.urgency || "Normal"})`;
    html = customRequestHtml(body);
  } else if (body.type === "feedback") {
    subject = `⭐ Feedback ${body.rating}/5 — ${body.name}`;
    html = feedbackHtml(body);
  } else {
    throw new Error("Unknown notification type");
  }

  await transporter.sendMail({ from: adminEmail, to: adminEmail, subject, html });
  return { success: true };
}

// ─── Route Handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Issue #8 fix: require admin auth — prevents spam/phishing of admin email
  const adminToken =
    req.headers.get("x-admin-token") || req.headers.get("authorization")?.replace("Bearer ", "");

  // Import here to avoid circular dependency
  const { verifyAdminToken } = await import("@/lib/adminAuth");
  if (!verifyAdminToken(adminToken ?? null)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: NotifyPayload = await req.json();
    const result = await sendNotificationEmail(body);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[notify] Email send failed:", message);
    // Return 200 so callers don't crash — but flag the error
    return NextResponse.json({ success: false, error: "Email delivery failed" });
  }
}
