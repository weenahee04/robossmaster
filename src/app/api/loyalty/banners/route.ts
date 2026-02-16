import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET — get loyalty banners for a branch (public, used by loyalty app)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchSlug = searchParams.get("branch");

    if (!branchSlug) return NextResponse.json({ error: "Missing branch" }, { status: 400 });

    const branch = await prisma.branch.findUnique({ where: { slug: branchSlug } });
    if (!branch) return NextResponse.json({ error: "Branch not found" }, { status: 404 });

    const banners = await prisma.loyaltyBanner.findMany({
      where: { branchId: branch.id, isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json(banners);
  } catch (error) {
    console.error("Loyalty banners GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
