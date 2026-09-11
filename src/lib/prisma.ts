import { PrismaClient } from "@prisma/client";

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED;
  
  if (!connectionString) {
    return new PrismaClient({});
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  
  return new PrismaClient({ adapter }) as PrismaClient;
}

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
