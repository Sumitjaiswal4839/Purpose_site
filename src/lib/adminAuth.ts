import crypto from "crypto";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
  throw new Error("JWT_SECRET must be set. Refusing to start without it.");
}

const SIGNING_SECRET = SECRET;
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

// In-memory cache for validated active admin usernames (60s TTL)
const adminCache = new Map<string, { isActive: boolean; cachedAt: number }>();
const ADMIN_CACHE_TTL_MS = 60 * 1000; // 60 seconds

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

/** Verifies a signed admin token: checks signature, expiry, and db existence */
export async function verifyAdminToken(token: string | null): Promise<boolean> {
  if (!token) return false;

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
  if (Date.now() > Number(expiryStr)) return false; // expired

  // In-memory cache to reduce redundant DB lookups during concurrent dashboard requests
  const cached = adminCache.get(username);
  if (cached && Date.now() - cached.cachedAt < ADMIN_CACHE_TTL_MS) {
    return cached.isActive;
  }

  // Ensure admin still exists and is active in DB
  try {
    const adminUser = await prisma.admin.findUnique({
      where: { username },
    });
    const isActive = Boolean(adminUser && adminUser.isActive);
    adminCache.set(username, { isActive, cachedAt: Date.now() });
    return isActive;
  } catch (err) {
    console.error("verifyAdminToken db error:", err);
    return false; // Fail safe
  }
}

export async function getAdminUsernameFromToken(token: string | null): Promise<string | null> {
  const isValid = await verifyAdminToken(token);
  if (!isValid) return null;
  const [payloadB64] = token!.split(".");
  const payload = Buffer.from(payloadB64, "base64url").toString("utf8");
  const [username] = payload.split(":");
  return username;
}

/** Helper to extract + verify token from a Next.js request */
export async function isAdminRequest(req: NextRequest): Promise<boolean> {
  const authHeader = req.headers.get("x-admin-token") || req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
  return await verifyAdminToken(token);
}
