import { NextResponse } from "next/server";
import crypto from "crypto";
import { generateAdminToken } from "@/lib/adminAuth";

/**
 * POST /api/admin/auth
 *
 * Fixes applied:
 * - Issue #1: Token is now a signed HMAC token with expiry (via adminAuth.ts)
 * - Issue #9: timingSafeEqual used for password comparison
 * - Issue #6: Rate limiting is handled by middleware.ts (proxy.ts)
 */

function timingSafeCompare(a: string, b: string): boolean {
  // Must be same length before timingSafeEqual to avoid length oracle
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body ?? {};

    // Validate input types
    if (typeof username !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { success: false, message: "Invalid request body" },
        { status: 400 }
      );
    }

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      return NextResponse.json(
        { success: false, message: "Admin credentials not configured on server" },
        { status: 500 }
      );
    }

    const usernameMatch = username === adminUsername;
    // timingSafeCompare requires same length — pad to avoid early exit leaking length
    const passwordMatch =
      username.length > 0 &&
      password.length > 0 &&
      timingSafeCompare(
        password.padEnd(adminPassword.length, '\0'),
        adminPassword.padEnd(password.length, '\0')
      ) &&
      password === adminPassword; // exact match after timing-safe gate

    if (usernameMatch && passwordMatch) {
      // generateAdminToken produces a signed, expiring token (see src/lib/adminAuth.ts)
      const token = generateAdminToken(username);
      return NextResponse.json(
        { success: true, message: "Authentication successful", token },
        { status: 200 }
      );
    }

    // Generic message — don't reveal which field was wrong
    return NextResponse.json(
      { success: false, message: "Invalid username or password" },
      { status: 401 }
    );
  } catch (error) {
    console.error("[admin/auth] Error:", error);
    return NextResponse.json(
      { success: false, message: "Authentication failed" },
      { status: 500 }
    );
  }
}
