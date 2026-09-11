import { prisma } from "@/lib/prisma";

export async function logAdminAction(
  adminUsername: string,
  action: string,
  targetId?: string,
  details?: string,
  ipAddress?: string
) {
  try {
    const admin = await prisma.admin.findUnique({
      where: { username: adminUsername },
    });

    if (!admin) {
      console.error(`[auditLog] Admin not found for username: ${adminUsername}`);
      return;
    }

    await prisma.adminActionLog.create({
      data: {
        adminId: admin.id,
        action,
        targetId,
        details,
        ipAddress,
      },
    });
  } catch (error) {
    console.error("[auditLog] Error saving action log:", error);
  }
}
