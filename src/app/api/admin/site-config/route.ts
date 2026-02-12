import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

// GET — return site config (singleton, auto-create if missing)
export async function GET(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;
  try {
    let config = await prisma.siteConfig.findFirst();
    if (!config) {
      config = await prisma.siteConfig.create({ data: { brandName: "Roboss" } });
    }
    return NextResponse.json(config);
  } catch (error) {
    console.error("SiteConfig GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH — update logo / brandName
export async function PATCH(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  try {
    const body = await request.json();
    const { logoUrl, brandName } = body;

    let config = await prisma.siteConfig.findFirst();
    if (!config) {
      config = await prisma.siteConfig.create({ data: { brandName: "Roboss" } });
    }

    const updated = await prisma.siteConfig.update({
      where: { id: config.id },
      data: {
        ...(logoUrl !== undefined && { logoUrl }),
        ...(brandName !== undefined && { brandName }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("SiteConfig PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
