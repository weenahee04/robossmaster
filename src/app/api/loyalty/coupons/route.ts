import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

// GET — get available coupons for a branch + customer's redeemed coupons
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchSlug = searchParams.get("branch");
    const customerId = searchParams.get("customerId");

    if (!branchSlug) return NextResponse.json({ error: "Missing branch" }, { status: 400 });

    const branch = await prisma.branch.findUnique({ where: { slug: branchSlug } });
    if (!branch) return NextResponse.json({ error: "Branch not found" }, { status: 404 });

    // Available coupon templates (global or this branch)
    const templates = await prisma.couponTemplate.findMany({
      where: {
        isActive: true,
        OR: [{ branchId: null }, { branchId: branch.id }],
      },
      orderBy: { pointsCost: "asc" },
    });

    // Customer's redeemed coupons
    let myCoupons: any[] = [];
    if (customerId) {
      myCoupons = await prisma.customerCoupon.findMany({
        where: { customerId, branchId: branch.id },
        include: { couponTemplate: true },
        orderBy: { redeemedAt: "desc" },
      });
    }

    return NextResponse.json({ templates, myCoupons });
  } catch (error) {
    console.error("Loyalty coupons GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST — redeem a coupon (customer exchanges points for coupon)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, couponTemplateId, branchSlug } = body;

    if (!customerId || !couponTemplateId || !branchSlug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const branch = await prisma.branch.findUnique({ where: { slug: branchSlug } });
    if (!branch) return NextResponse.json({ error: "Branch not found" }, { status: 404 });

    const template = await prisma.couponTemplate.findUnique({ where: { id: couponTemplateId } });
    if (!template || !template.isActive) {
      return NextResponse.json({ error: "Coupon not available" }, { status: 400 });
    }

    // Check max redemptions
    if (template.maxRedemptions && template.currentRedemptions >= template.maxRedemptions) {
      return NextResponse.json({ error: "Coupon fully redeemed" }, { status: 400 });
    }

    // Check expiry
    if (template.expiresAt && new Date() > template.expiresAt) {
      return NextResponse.json({ error: "Coupon expired" }, { status: 400 });
    }

    // Check customer points
    const point = await prisma.customerPoint.findUnique({
      where: { customerId_branchId: { customerId, branchId: branch.id } },
    });

    if (!point || point.balance < template.pointsCost) {
      return NextResponse.json({ error: "Not enough points" }, { status: 400 });
    }

    // Generate unique code
    const code = `ROBOSS-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + template.validDays);

    // Transaction: deduct points + create coupon + log transaction + increment redemptions
    const [coupon] = await prisma.$transaction([
      prisma.customerCoupon.create({
        data: {
          customerId,
          couponTemplateId,
          branchId: branch.id,
          code,
          expiresAt,
        },
      }),
      prisma.customerPoint.update({
        where: { customerId_branchId: { customerId, branchId: branch.id } },
        data: { balance: { decrement: template.pointsCost } },
      }),
      prisma.pointTransaction.create({
        data: {
          customerId,
          branchId: branch.id,
          type: "REDEEM",
          amount: -template.pointsCost,
          description: `แลกคูปอง: ${template.name}`,
        },
      }),
      prisma.couponTemplate.update({
        where: { id: couponTemplateId },
        data: { currentRedemptions: { increment: 1 } },
      }),
    ]);

    return NextResponse.json({ coupon, code });
  } catch (error) {
    console.error("Loyalty coupons POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
