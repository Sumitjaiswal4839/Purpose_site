import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { generateAdminToken } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import { logAdminAction } from "@/lib/auditLog";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body ?? {};

    if (typeof username !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { success: false, message: "Invalid request body" },
        { status: 400 }
      );
    }

    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin || !admin.isActive) {
      return NextResponse.json(
        { success: false, message: "Invalid username or password" },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, admin.passwordHash);

    if (passwordMatch) {
      // Update last login
      await prisma.admin.update({
        where: { id: admin.id },
        data: { lastLogin: new Date() },
      });

      // Log the login action
      await logAdminAction(admin.username, "LOGIN", undefined, "Admin logged in");

      const token = generateAdminToken(username);
      return NextResponse.json(
        { success: true, message: "Authentication successful", token },
        { status: 200 }
      );
    }

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
