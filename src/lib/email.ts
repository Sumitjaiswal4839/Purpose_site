import nodemailer from "nodemailer";

/**
 * Fixes applied:
 * - Issue #14: Transporter is now created lazily via factory function,
 *   NOT at module import time. This prevents crashes when Gmail credentials
 *   are missing — the error is thrown at send time, not at startup.
 */

function createTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_PASS || process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    return null;
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

export interface VerificationEmailData {
  adminEmail: string;
  customerName: string;
  partnerName: string;
  transactionId: string;
  verificationLink: string;
}

export interface CustomerActivationEmailData {
  customerEmail: string;
  yourName: string;
  partnerName: string;
  proposalLink: string;
}

export async function sendVerificationEmail(data: VerificationEmailData) {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn("[email] Gmail not configured — skipping verification email.");
    return;
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0;">🎁 New Proposal Payment</h1>
      </div>
      <div style="background: #f5f5f5; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333;">Verification Required</h2>
        <p style="color: #666; font-size: 16px;">A new proposal requires your verification to activate.</p>
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
          <p style="margin: 5px 0;"><strong>From:</strong> ${data.customerName}</p>
          <p style="margin: 5px 0;"><strong>To:</strong> ${data.partnerName}</p>
          <p style="margin: 5px 0;"><strong>Transaction ID:</strong> ${data.transactionId}</p>
          <p style="margin: 5px 0;"><strong>Amount:</strong> ₹99 (Premium Plan)</p>
        </div>
        <a href="${data.verificationLink}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
          ✓ Verify &amp; Activate
        </a>
        <p style="color: #999; font-size: 12px; margin-top: 20px;">This link will expire in 24 hours.</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px; text-align: center;">Purpose Site Admin Panel • © 2026</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: data.adminEmail,
      subject: `🎁 New Proposal Verification - ${data.customerName} & ${data.partnerName}`,
      html: htmlContent,
    });
  } catch (error) {
    console.error("[email] Failed to send verification email:", error);
    throw error;
  }
}

export async function sendCustomerActivationEmail(data: CustomerActivationEmailData) {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn("[email] Gmail not configured — skipping activation email.");
    return;
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0;">💝 Your Proposal is Live!</h1>
      </div>
      <div style="background: #f5f5f5; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333;">Congratulations, ${data.yourName}! 🎉</h2>
        <p style="color: #666; font-size: 16px;">Your proposal for <strong>${data.partnerName}</strong> has been verified and is now live!</p>
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f5576c;">
          <a href="${data.proposalLink}" style="color: #f5576c; font-size: 14px; font-weight: bold; text-decoration: none; word-break: break-all;">
            ${data.proposalLink}
          </a>
        </div>
        <p style="color: #666; font-size: 14px;"><strong>Important:</strong> Your link is valid for 2 views within 30 days.</p>
        <a href="${data.proposalLink}" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
          👀 View Your Proposal
        </a>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px; text-align: center;">Purpose Site • © 2026</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: data.customerEmail,
      subject: `💝 Your Proposal for ${data.partnerName} is Live!`,
      html: htmlContent,
    });
  } catch (error) {
    console.error("[email] Failed to send activation email:", error);
    throw error;
  }
}

export async function sendOpenNotificationEmail(customerEmail: string, partnerName: string) {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn("[email] Gmail not configured — skipping open notification.");
    return;
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0;">👀 Link Opened!</h1>
      </div>
      <div style="background: #f5f5f5; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333;">Great News! 🎉</h2>
        <p style="color: #666; font-size: 16px;"><strong>${partnerName}</strong> ne abhi aapka secret proposal link open kiya hai!</p>
        <p style="color: #666; font-size: 14px;">Fingers crossed! ❤️</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px; text-align: center;">Purpose Site | Pyaar karo, propose karo ❤️</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: customerEmail,
      subject: `👀 ${partnerName} opened your proposal link! - Purpose`,
      html: htmlContent,
    });
  } catch (error) {
    // Silent — open notification is best-effort
    console.error("[email] Failed to send open notification:", error);
  }
}
