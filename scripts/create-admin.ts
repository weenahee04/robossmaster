import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "superadmin@roboss.com";
  const password = "Roboss@2025";
  const hash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash: hash, name: "Super Admin", role: "SUPER_ADMIN" },
    create: { email, passwordHash: hash, name: "Super Admin", role: "SUPER_ADMIN" },
  });

  console.log("✅ Admin created successfully!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`Email:    ${user.email}`);
  console.log(`Password: ${password}`);
  console.log(`Role:     ${user.role}`);
  console.log(`ID:       ${user.id}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
