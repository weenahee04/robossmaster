import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get("branchId");
    if (!branchId) return NextResponse.json({ error: "Missing branchId" }, { status: 400 });

    const [records, globalPackages, branchPackages] = await Promise.all([
      prisma.washRecord.findMany({
        where: { branchId },
        orderBy: { date: "desc" },
        take: 200,
        include: {
          package: { select: { name: true, type: true, price: true } },
          globalPackage: { select: { name: true, type: true, price: true } },
        },
      }),
      prisma.globalWashPackage.findMany({
        where: { isActive: true },
        orderBy: [{ type: "asc" }, { name: "asc" }],
      }),
      prisma.washPackage.findMany({
        where: { branchId, isActive: true },
        orderBy: [{ type: "asc" }, { name: "asc" }],
      }),
    ]);

    // Merge global + branch-specific packages
    const packages = [
      ...globalPackages.map((p) => ({ ...p, source: "global" as const })),
      ...branchPackages.map((p) => ({ ...p, source: "branch" as const })),
    ];

    // Summary stats
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const todayRecords = records.filter((r) => new Date(r.date) >= startOfDay);
    const monthRecords = records.filter((r) => new Date(r.date) >= startOfMonth);

    const todayCount = { CAR: 0, BIKE: 0, HELMET: 0, total: 0 };
    const monthCount = { CAR: 0, BIKE: 0, HELMET: 0, total: 0 };

    todayRecords.forEach((r) => {
      todayCount[r.vehicleType as keyof typeof todayCount]++;
      todayCount.total++;
    });
    monthRecords.forEach((r) => {
      monthCount[r.vehicleType as keyof typeof monthCount]++;
      monthCount.total++;
    });

    const todayRevenue = todayRecords.reduce((s: number, r) => s + r.amount, 0);
    const monthRevenue = monthRecords.reduce((s: number, r) => s + r.amount, 0);

    // Revenue by package
    const packageRevenue: Record<string, { name: string; count: number; revenue: number }> = {};
    monthRecords.forEach((r) => {
      const key = r.packageName || r.globalPackage?.name || r.package?.name || "Unknown";
      if (!packageRevenue[key]) packageRevenue[key] = { name: key, count: 0, revenue: 0 };
      packageRevenue[key].count++;
      packageRevenue[key].revenue += r.amount;
    });

    return NextResponse.json({
      records,
      packages,
      todayCount,
      monthCount,
      todayRevenue,
      monthRevenue,
      packageRevenue: Object.values(packageRevenue),
    });
  } catch (error) {
    console.error("Wash GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;
  try {
    const body = await request.json();
    const { branchId, packageId, vehicleType, amount, note, createdById, packageName } = body;

    const record = await prisma.washRecord.create({
      data: {
        branchId,
        globalPackageId: packageId,
        vehicleType,
        packageName: packageName || null,
        amount: parseFloat(amount),
        note,
        createdById,
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error("Wash POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
