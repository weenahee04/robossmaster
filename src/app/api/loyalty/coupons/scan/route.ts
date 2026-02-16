import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST — scan/use a coupon (called by branch staff)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });

    const coupon = await prisma.customerCoupon.findUnique({
      where: { code },
      include: {
        couponTemplate: true,
        customer: { select: { name: true, phone: true } },
        branch: { select: { name: true } },
      },
    });

    if (!coupon) return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    if (coupon.status === "USED") return NextResponse.json({ error: "Coupon already used" }, { status: 400 });
    if (coupon.status === "EXPIRED" || new Date() > coupon.expiresAt) {
      return NextResponse.json({ error: "Coupon expired" }, { status: 400 });
    }

    // Mark as used
    const updated = await prisma.customerCoupon.update({
      where: { code },
      data: { status: "USED", usedAt: new Date() },
      include: {
        couponTemplate: true,
        customer: { select: { name: true, phone: true } },
      },
    });

    return NextResponse.json({
      success: true,
      coupon: updated,
      discount: {
        type: updated.couponTemplate.type,
        value: updated.couponTemplate.value,
        name: updated.couponTemplate.name,
      },
    });
  } catch (error) {
    console.error("Coupon scan error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
