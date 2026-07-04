import path from "path";
import { defineConfig } from "prisma/config";
import { config } from "dotenv";

// Load env files so DATABASE_URL is available during prisma CLI commands
config({ path: path.resolve(process.cwd(), ".env.local"), override: false });
config({ path: path.resolve(process.cwd(), ".env"), override: false });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
