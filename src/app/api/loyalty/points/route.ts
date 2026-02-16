import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET — get points + transactions for a customer at a branch
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId");
    const branchSlug = searchParams.get("branch");

    if (!customerId || !branchSlug) {
      return NextResponse.json({ error: "Missing customerId or branch" }, { status: 400 });
    }

    const branch = await prisma.branch.findUnique({ where: { slug: branchSlug } });
    if (!branch) return NextResponse.json({ error: "Branch not found" }, { status: 404 });

    const [point, transactions] = await Promise.all([
      prisma.customerPoint.findUnique({
        where: { customerId_branchId: { customerId, branchId: branch.id } },
      }),
      prisma.pointTransaction.findMany({
        where: { customerId, branchId: branch.id },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
    ]);

    return NextResponse.json({
      balance: point?.balance || 0,
      totalEarned: point?.totalEarned || 0,
      tier: point?.tier || "SILVER",
      stamps: point?.stamps || 0,
      transactions,
    });
  } catch (error) {
    console.error("Loyalty points GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST — earn points (called when wash is recorded with customer phone)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, branchId, amount, washRecordId, description } = body;

    if (!customerId || !branchId || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get loyalty config
    const config = await prisma.loyaltyConfig.findFirst({
      where: { OR: [{ branchId }, { branchId: null }] },
      orderBy: { branchId: { sort: "asc", nulls: "last" } },
    });

    const pointsPerBaht = config?.pointsPerBaht || 10;

    // Get current point record
    let point = await prisma.customerPoint.findUnique({
      where: { customerId_branchId: { customerId, branchId } },
    });

    // Calculate multiplier based on tier
    let multiplier = 1;
    const tier = point?.tier || "SILVER";
    if (tier === "GOLD") multiplier = config?.goldMultiplier || 1.5;
    if (tier === "PLATINUM") multiplier = config?.platinumMultiplier || 2;

    const earnedPoints = Math.floor((amount / pointsPerBaht) * multiplier);
    if (earnedPoints <= 0) return NextResponse.json({ earned: 0 });

    // Upsert point record
    const newBalance = (point?.balance || 0) + earnedPoints;
    const newTotalEarned = (point?.totalEarned || 0) + earnedPoints;
    const newStamps = ((point?.stamps || 0) + 1) % (config?.stampsForFreeWash || 10);

    // Determine new tier
    const goldThreshold = config?.goldThreshold || 100;
    const platinumThreshold = config?.platinumThreshold || 500;
    let newTier = "SILVER";
    if (newTotalEarned >= platinumThreshold) newTier = "PLATINUM";
    else if (newTotalEarned >= goldThreshold) newTier = "GOLD";

    const updatedPoint = await prisma.customerPoint.upsert({
      where: { customerId_branchId: { customerId, branchId } },
      create: {
        customerId,
        branchId,
        balance: earnedPoints,
        totalEarned: earnedPoints,
        tier: newTier,
        stamps: 1,
      },
      update: {
        balance: newBalance,
        totalEarned: newTotalEarned,
        tier: newTier,
        stamps: newStamps,
      },
    });

    // Create transaction
    await prisma.pointTransaction.create({
      data: {
        customerId,
        branchId,
        type: "EARN",
        amount: earnedPoints,
        description: description || `ได้รับ ${earnedPoints} แต้มจากการล้างรถ`,
        washRecordId: washRecordId || null,
      },
    });

    return NextResponse.json({
      earned: earnedPoints,
      balance: updatedPoint.balance,
      tier: updatedPoint.tier,
      stamps: updatedPoint.stamps,
      multiplier,
    });
  } catch (error) {
    console.error("Loyalty points POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
