import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET — get loyalty config + app config (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchSlug = searchParams.get("branch");

    let branchId: string | null = null;
    if (branchSlug) {
      const branch = await prisma.branch.findUnique({ where: { slug: branchSlug } });
      branchId = branch?.id || null;
    }

    // Get config (branch-specific or global fallback)
    const config = await prisma.loyaltyConfig.findFirst({
      where: branchId ? { OR: [{ branchId }, { branchId: null }] } : { branchId: null },
      orderBy: { branchId: { sort: "asc", nulls: "last" } },
    });

    const appConfig = await prisma.loyaltyAppConfig.findFirst();

    // Get packages with images
    const packages = await prisma.globalWashPackage.findMany({
      where: { isActive: true },
      orderBy: [{ type: "asc" }, { price: "asc" }],
    });

    return NextResponse.json({ config, appConfig, packages });
  } catch (error) {
    console.error("Loyalty config GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
