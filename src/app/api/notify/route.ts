import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// ─── Types ────────────────────────────────────────────────────────────────────
type NotifyPayload =
  | { type: "checkout"; buyerName: string; partnerName: string; templateId: string; price: number; proposalToken?: string }
  | { type: "custom_request"; name: string; email: string; phone?: string; description: string; budget?: string; urgency?: string }
  | { type: "feedback"; name: string; email: string; rating: number; comment: string };

// ─── Transporter factory (silent if creds missing) ───────────────────────────
function createTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASS;
  if (!user || !pass) return null;
  return nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
}

// ─── Email HTML builders ──────────────────────────────────────────────────────
function checkoutHtml(p: Extract<NotifyPayload, { type: "checkout" }>) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://purpose.site";
  return `
  <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
    <div style="background:linear-gradient(135deg,#e11d48 0%,#be185d 100%);padding:32px 40px;text-align:center">
      <h1 style="color:#fff;margin:0;font-size:24px;font-weight:800;letter-spacing:-0.5px">💍 New Premium Checkout</h1>
      <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px">Action required — verify & activate</p>
    </div>
    <div style="padding:32px 40px">
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:13px;width:40%">Buyer Name</td><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-weight:700;color:#0f172a">${p.buyerName}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:13px">Partner Name</td><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-weight:700;color:#0f172a">${p.partnerName}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:13px">Template ID</td><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-weight:700;color:#0f172a">${p.templateId}</td></tr>
        <tr><td style="padding:10px 0;color:#64748b;font-size:13px">Price Paid</td><td style="padding:10px 0;font-weight:800;color:#e11d48;font-size:18px">₹${p.price}</td></tr>
      </table>
      <div style="margin-top:28px;text-align:center">
        <a href="${appUrl}/admin" style="display:inline-block;background:linear-gradient(135deg,#e11d48,#be185d);color:#fff;text-decoration:none;padding:14px 36px;border-radius:50px;font-weight:800;font-size:15px;letter-spacing:0.3px">
          ✓ Go to Admin Panel
        </a>
      </div>
      ${p.proposalToken ? `<p style="margin-top:20px;text-align:center;font-size:12px;color:#94a3b8">Proposal Link: <a href="${appUrl}/secret/${p.proposalToken}" style="color:#e11d48">${appUrl}/secret/${p.proposalToken}</a></p>` : ""}
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
        <tr><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:13px;width:40%">Name</td><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-weight:700;color:#0f172a">${p.name}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:13px">Email</td><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-weight:700;color:#0f172a">${p.email}</td></tr>
        ${p.phone ? `<tr><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:13px">Phone</td><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-weight:700;color:#0f172a">${p.phone}</td></tr>` : ""}
        ${p.budget ? `<tr><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:13px">Budget</td><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-weight:700;color:#16a34a">${p.budget}</td></tr>` : ""}
        ${p.urgency ? `<tr><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:13px">Urgency</td><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-weight:700;color:#dc2626">${p.urgency}</td></tr>` : ""}
      </table>
      <div style="margin-top:20px;background:#f8fafc;border-left:4px solid #7c3aed;padding:16px 20px;border-radius:0 8px 8px 0">
        <p style="margin:0;font-size:13px;color:#374151;line-height:1.7;white-space:pre-wrap">${p.description}</p>
      </div>
    </div>
    <div style="background:#f8fafc;padding:16px 40px;text-align:center;font-size:11px;color:#94a3b8">Purpose Site • ${new Date().toLocaleString("en-IN")}</div>
  </div>`;
}

function feedbackHtml(p: Extract<NotifyPayload, { type: "feedback" }>) {
  const stars = "★".repeat(p.rating) + "☆".repeat(5 - p.rating);
  return `
  <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
    <div style="background:linear-gradient(135deg,#f59e0b 0%,#d97706 100%);padding:32px 40px;text-align:center">
      <h1 style="color:#fff;margin:0;font-size:24px;font-weight:800">⭐ New User Feedback</h1>
    </div>
    <div style="padding:32px 40px">
      <div style="text-align:center;margin-bottom:24px">
        <span style="font-size:32px;color:#f59e0b;letter-spacing:4px">${stars}</span>
        <p style="margin:8px 0 0;font-size:28px;font-weight:800;color:#0f172a">${p.rating}/5</p>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
        <tr><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:13px;width:40%">From</td><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-weight:700;color:#0f172a">${p.name}</td></tr>
        <tr><td style="padding:10px 0;color:#64748b;font-size:13px">Email</td><td style="padding:10px 0;font-weight:700;color:#0f172a">${p.email}</td></tr>
      </table>
      <div style="background:#fffbeb;border-left:4px solid #f59e0b;padding:16px 20px;border-radius:0 8px 8px 0">
        <p style="margin:0;font-size:14px;color:#374151;line-height:1.7;font-style:italic">"${p.comment}"</p>
      </div>
    </div>
    <div style="background:#f8fafc;padding:16px 40px;text-align:center;font-size:11px;color:#94a3b8">Purpose Site • ${new Date().toLocaleString("en-IN")}</div>
  </div>`;
}

// ─── Route Handler & Shared Helper ─────────────────────────────────────────────
export async function sendNotificationEmail(body: NotifyPayload) {
  const adminEmail = process.env.GMAIL_USER;

  // Silent no-op if credentials are not configured
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

export async function POST(req: Request) {
  try {
    const body: NotifyPayload = await req.json();
    const result = await sendNotificationEmail(body);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[notify] Email send failed:", message);
    // Never crash the caller — return 200 with error flag
    return NextResponse.json({ success: false, error: message });
  }
}
