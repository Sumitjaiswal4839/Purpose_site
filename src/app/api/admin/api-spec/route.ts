import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { getApiDocs } from "@/lib/swagger";

/**
 * @swagger
 * /api/admin/api-spec:
 *   get:
 *     summary: Get the OpenAPI spec (admin only)
 *     description: Returns the generated Swagger/OpenAPI spec. Requires a valid admin token.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: OpenAPI spec JSON
 *       401:
 *         description: Not authenticated
 */
export async function GET(req: NextRequest) {
  const authorized = await isAdminRequest(req);
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const spec = await getApiDocs();
  return NextResponse.json(spec);
}
