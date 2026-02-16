import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET — list all coupon templates
export async function GET() {
  try {
    const templates = await prisma.couponTemplate.findMany({
      orderBy: { createdAt: "desc" },
      include: { branch: { select: { name: true, slug: true } } },
    });
    return NextResponse.json(templates);
  } catch (error) {
    console.error("Admin loyalty-coupons GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST — create coupon template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, imageUrl, type, value, pointsCost, maxRedemptions, validDays, branchId, expiresAt } = body;

    if (!name || !type || value === undefined || pointsCost === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const template = await prisma.couponTemplate.create({
      data: {
        name,
        description: description || null,
        imageUrl: imageUrl || null,
        type,
        value: parseFloat(value),
        pointsCost: parseInt(pointsCost),
        maxRedemptions: maxRedemptions ? parseInt(maxRedemptions) : null,
        validDays: validDays ? parseInt(validDays) : 30,
        branchId: branchId || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return NextResponse.json(template);
  } catch (error) {
    console.error("Admin loyalty-coupons POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH — update coupon template
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.value !== undefined) updateData.value = parseFloat(data.value);
    if (data.pointsCost !== undefined) updateData.pointsCost = parseInt(data.pointsCost);
    if (data.maxRedemptions !== undefined) updateData.maxRedemptions = data.maxRedemptions ? parseInt(data.maxRedemptions) : null;
    if (data.validDays !== undefined) updateData.validDays = parseInt(data.validDays);
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.expiresAt !== undefined) updateData.expiresAt = data.expiresAt ? new Date(data.expiresAt) : null;

    const template = await prisma.couponTemplate.update({ where: { id }, data: updateData });
    return NextResponse.json(template);
  } catch (error) {
    console.error("Admin loyalty-coupons PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE — delete coupon template
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await prisma.couponTemplate.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin loyalty-coupons DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
