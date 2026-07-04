
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const dataDir = path.join(process.cwd(), "data");
  const filePath = path.join(dataDir, "custom-requests.json");

  if (!fs.existsSync(filePath)) {
    console.log("No JSON data found to migrate.");
    return;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const requests = JSON.parse(fileContent);

  console.log(`Found ${requests.length} requests in JSON. Starting migration...`);

  for (const req of requests) {
    try {
      // Check if already exists by timestamp/name fallback (or just migrate all)
      await prisma.customRequest.create({
        data: {
          customerName: req.name || "Anonymous",
          customerEmail: "no-email@provided.com",
          phoneNumber: req.phone || "",
          description: `Migration: For: ${req.forWhom}\nTheme: ${req.theme}\nSpecial: ${req.special}\nUrgency: ${req.urgency}`,
          budget: parseFloat(req.budget?.replace(/[^0-9.]/g, "")) || 0,
          status: req.status === "completed" ? "completed" : "pending",
          createdAt: new Date(req.createdAt),
          notes: JSON.stringify({
            forWhom: req.forWhom,
            theme: req.theme,
            special: req.special,
            urgency: req.urgency,
            originalBudget: req.budget
          })
        }
      });
      console.log(`✅ Migrated: ${req.name}`);
    } catch (e: any) {
      console.error(`❌ Failed to migrate ${req.name}:`, e.message);
    }
  }

  console.log("Migration complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
