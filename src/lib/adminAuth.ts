import crypto from "crypto";
import { NextRequest } from "next/server";

const SECRET = process.env.JWT_SECRET;

if (!SECRET && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET must be set in production");
}

const SIGNING_SECRET = SECRET || "dev-only-fallback-do-not-use-in-prod";
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

function sign(payload: string): string {
  return crypto.createHmac("sha256", SIGNING_SECRET).update(payload).digest("hex");
}

/** Generates a signed, expiring admin token */
export function generateAdminToken(username: string): string {
  const payload = `${username}:${Date.now() + TOKEN_TTL_MS}`;
  const payloadB64 = Buffer.from(payload).toString("base64url");
  const signature = sign(payload);
  return `${payloadB64}.${signature}`;
}

/** Verifies a signed admin token: checks signature + expiry + exact username match */
export function verifyAdminToken(token: string | null): boolean {
  if (!token) return false;
  const adminUsername = process.env.ADMIN_USERNAME;
  if (!adminUsername) return false;

  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return false;

  let payload: string;
  try {
    payload = Buffer.from(payloadB64, "base64url").toString("utf8");
  } catch {
    return false;
  }

  const expectedSig = sign(payload);
  // timing-safe comparison
  const sigMatch =
    signature.length === expectedSig.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig));
  if (!sigMatch) return false;

  const [username, expiryStr] = payload.split(":");
  if (username !== adminUsername) return false; // exact match, not startsWith/includes
  if (Date.now() > Number(expiryStr)) return false; // expired

  return true;
}

/** Helper to extract + verify token from a Next.js request */
export function isAdminRequest(req: NextRequest): boolean {
  const authHeader = req.headers.get("x-admin-token") || req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
  return verifyAdminToken(token);
}
