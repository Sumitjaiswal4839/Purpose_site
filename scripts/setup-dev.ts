import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const ROOT = path.resolve(__dirname, "..");

function run(cmd: string) {
  console.log(`\n▶ ${cmd}`);
  execSync(cmd, { stdio: "inherit", cwd: ROOT });
}

console.log("🚀 Purpose Site — One-Click Dev Setup\n");

// 1. Copy .env.example -> .env.local if not exists
const envPath = path.join(ROOT, ".env.local");
if (!fs.existsSync(envPath)) {
  fs.copyFileSync(path.join(ROOT, ".env.example"), envPath);
  console.log("✅ Created .env.local from .env.example");
} else {
  console.log("ℹ️  .env.local already exists, skipping");
}

// 2. Ensure database folder exists
const dbDir = path.join(ROOT, "database");
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir);

// 3. Push Prisma schema (creates SQLite file + tables)
run("npx prisma generate");
run("npx prisma db push");

console.log("\n✅ Setup complete! Run `npm run dev` to start.");
