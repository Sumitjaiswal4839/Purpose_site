import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// Helper function to verify admin credentials
function verifyAdminAuth(req: NextRequest): boolean {
  const adminUsername = process.env.ADMIN_USERNAME;
  const token = req.headers.get("x-admin-token");
  const authHeader = req.headers.get("authorization");
  
  if (token && adminUsername) {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    if (decoded.startsWith(adminUsername)) return true;
  }
  if (authHeader && authHeader.startsWith("Bearer ") && adminUsername) {
    return authHeader.includes(adminUsername);
  }
  return false;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    if (!verifyAdminAuth(req)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { token } = await params;
    const body = await req.json();
    const { action } = body;

    const link = await prisma.secretLink.findUnique({ where: { token } });
    if (!link) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    let updateData: any = {};

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
      data: updateData
    });

    return NextResponse.json({ success: true, link: updatedLink });
  } catch (error: any) {
    console.error("Failed to update link in Prisma:", error);
    return NextResponse.json({ success: false, error: "Failed to update" }, { status: 500 });
  }
}

