import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET — public endpoint: returns site config + active banners
export async function GET() {
  try {
    let config = await prisma.siteConfig.findFirst();
    if (!config) {
      config = await prisma.siteConfig.create({ data: { brandName: "Roboss" } });
    }

    const banners = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ config, banners });
  } catch (error) {
    console.error("Public SiteConfig GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
