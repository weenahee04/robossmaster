import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const branches = [
  // CAR
  { name: "Rama9 (Own)", slug: "rama9" },
  { name: "Satun (Franchise)", slug: "satun" },
  { name: "Rangsit Pathum (In Process)", slug: "rangsit-pathum" },
  { name: "Nakhon Sawan (In Process)", slug: "nakhon-sawan" },
  { name: "Ramintra 109 (Own)", slug: "ramintra-109" },
  { name: "Nakhon Si (In Process)", slug: "nakhon-si" },
  { name: "Phuket (In Process)", slug: "phuket" },
  { name: "Lampang (In Process)", slug: "lampang" },
  { name: "Krungthep Kreetha (In Process)", slug: "krungthep-kreetha" },
  { name: "Uthai Thani (In Process)", slug: "uthai-thani" },
  { name: "Rayong (In Process)", slug: "rayong" },
  // BIKE
  { name: "Bike Rama9 (Own)", slug: "bike-rama9" },
  { name: "Bike Chonburi (Franchise)", slug: "bike-chonburi" },
  { name: "Bike Yamaha Thailand (In Warehouse)", slug: "bike-yamaha-thailand" },
  { name: "Bike Thapra (Half)", slug: "bike-thapra" },
  { name: "Bike Pho Kaew (Franchise)", slug: "bike-pho-kaew" },
  { name: "Bike Songkhla (Franchise)", slug: "bike-songkhla" },
  { name: "Bike PTT Rama 4 (Own)", slug: "bike-ptt-rama4" },
  { name: "Bike Maesot (Franchise)", slug: "bike-maesot" },
  { name: "Bike Nakhon Si (In Process)", slug: "bike-nakhon-si" },
  { name: "Bike Nakhon Sawan (In Process)", slug: "bike-nakhon-sawan" },
  { name: "Bike Phuket (In Process)", slug: "bike-phuket" },
  { name: "Bike Phuket Bang Tao (Franchise)", slug: "bike-phuket-bang-tao" },
];

async function main() {
  console.log("Adding 23 branches...");
  const hash = await bcrypt.hash("roboss1234", 12);

  for (const b of branches) {
    const exists = await prisma.branch.findUnique({ where: { slug: b.slug } });
    if (exists) { console.log(`  SKIP ${b.name} (exists)`); continue; }

    const branch = await prisma.branch.create({
      data: { name: b.name, slug: b.slug, isActive: true },
    });
    await prisma.bankAccount.create({
      data: { branchId: branch.id, bankName: "", bankBranch: "", accountName: "", accountNumber: "", promptPay: "" },
    });
    const email = `${b.slug}@roboss.com`;
    await prisma.user.create({
      data: { email, passwordHash: hash, name: `Admin ${b.name}`, role: "BRANCH_ADMIN", branchId: branch.id },
    });
    console.log(`  ✅ ${b.name} | login: ${email} / roboss1234`);
  }
  console.log("\nDone!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
