import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// Helper function to verify admin credentials
function verifyAdminAuth(req: NextRequest): boolean {
  const adminUsername = process.env.ADMIN_USERNAME;
  
  // Check for admin token or authorization header
  const token = req.headers.get("x-admin-token");
  const authHeader = req.headers.get("authorization");
  
  if (token && adminUsername) {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    if (decoded.startsWith(adminUsername)) {
      return true;
    }
  }

  // Fallback: check basic auth header
  if (authHeader && authHeader.startsWith("Bearer ") && adminUsername) {
    return authHeader.includes(adminUsername);
  }

  return false;
}

export async function GET(req: NextRequest) {
  try {
    // Verify admin authentication
    if (!verifyAdminAuth(req)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      );
    }

    // Fetch all secret links from Postgres using Prisma
    // Include accessLog count for the dashboard
    const links = await prisma.secretLink.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { accessLog: true }
        }
      }
    });
    
    return NextResponse.json({ success: true, links });
  } catch (error: any) {
    console.error("Failed to fetch links from Prisma:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch data from database" },
      { status: 500 }
    );
  }
}

