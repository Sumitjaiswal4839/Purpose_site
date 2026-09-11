import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const username = process.env.ADMIN_USERNAME || "admin@purpose";
  const password = process.env.ADMIN_PASSWORD || "admin123"; // default fallback

  console.log(`Seeding initial admin user: ${username}`);

  const existingAdmin = await prisma.admin.findUnique({
    where: { username },
  });

  if (existingAdmin) {
    console.log("Admin already exists!");
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  await prisma.admin.create({
    data: {
      username,
      email: username,
      passwordHash,
      role: "admin",
      isActive: true,
    },
  });

  console.log("Admin user created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
