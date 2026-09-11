const path = require("path");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

// Load .env.local and .env
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const connectionString = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED;

if (!connectionString) {
  console.error("❌ DATABASE_URL is missing in environment!");
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const username = "Purpose@Purpose";
  const plainPassword = "Lovepurpose2026";
  const email = "purpose@purpose.com";

  console.log("🔐 Starting Admin Creation & Bcrypt Verification...\n");
  console.log(`Username:       ${username}`);
  console.log(`Plain Password: ${plainPassword}`);

  // 1. Bcrypt Hash with 10 salt rounds
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(plainPassword, saltRounds);
  console.log(`\nGenerated Bcrypt Hash: ${passwordHash}`);

  // 2. Bcrypt Decrypt / Compare verification
  const isMatch = await bcrypt.compare(plainPassword, passwordHash);
  console.log(`Bcrypt Compare Test: ${isMatch ? "✅ PASSED" : "❌ FAILED"}`);

  if (!isMatch) {
    throw new Error("Bcrypt hash verification failed!");
  }

  // 3. Upsert to Neon PostgreSQL database
  console.log("\n📡 Pushing Admin record to Neon PostgreSQL...");
  const admin = await prisma.admin.upsert({
    where: { username },
    update: {
      passwordHash,
      email,
      isActive: true,
      role: "admin",
    },
    create: {
      username,
      email,
      passwordHash,
      isActive: true,
      role: "admin",
    },
  });

  console.log("✅ Admin record successfully saved in database!");
  console.log({
    id: admin.id,
    username: admin.username,
    email: admin.email,
    role: admin.role,
    isActive: admin.isActive,
    updatedAt: admin.updatedAt,
  });

  // 4. Verification from DB query
  const retrievedAdmin = await prisma.admin.findUnique({
    where: { username },
  });

  if (!retrievedAdmin) {
    throw new Error("Could not retrieve created admin from DB!");
  }

  const finalCheck = await bcrypt.compare(plainPassword, retrievedAdmin.passwordHash);
  console.log(`\n🔍 Live Database Verification:`);
  console.log(`   bcrypt.compare("${plainPassword}", dbHash) -> ${finalCheck ? "✅ 100% MATCH" : "❌ MISMATCH"}`);

  if (finalCheck) {
    console.log("\n🎉 Admin is READY and ACTIVE!");
    console.log(`   Login URL: http://localhost:3000/admin`);
    console.log(`   Username:  ${username}`);
    console.log(`   Password:  ${plainPassword}`);
  }
}

main()
  .catch((e) => {
    console.error("❌ Error creating admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
