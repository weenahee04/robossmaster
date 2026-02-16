import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

// GET — get loyalty banners for current branch
export async function GET(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get("branchId");
    if (!branchId) return NextResponse.json({ error: "Missing branchId" }, { status: 400 });

    const banners = await prisma.loyaltyBanner.findMany({
      where: { branchId },
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(banners);
  } catch (error) {
    console.error("Branch loyalty-banners GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST — create loyalty banner
export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;
  try {
    const body = await request.json();
    const { branchId, title, subtitle, imageUrl, linkUrl, tag } = body;

    if (!branchId || !title || !imageUrl) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    const banner = await prisma.loyaltyBanner.create({
      data: {
        branchId,
        title,
        subtitle: subtitle || null,
        imageUrl,
        linkUrl: linkUrl || null,
        tag: tag || null,
      },
    });
    return NextResponse.json(banner);
  } catch (error) {
    console.error("Branch loyalty-banners POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH — update loyalty banner
export async function PATCH(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;
  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.subtitle !== undefined) updateData.subtitle = data.subtitle;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    if (data.linkUrl !== undefined) updateData.linkUrl = data.linkUrl;
    if (data.tag !== undefined) updateData.tag = data.tag;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;

    const banner = await prisma.loyaltyBanner.update({ where: { id }, data: updateData });
    return NextResponse.json(banner);
  } catch (error) {
    console.error("Branch loyalty-banners PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE — delete loyalty banner
export async function DELETE(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await prisma.loyaltyBanner.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Branch loyalty-banners DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
