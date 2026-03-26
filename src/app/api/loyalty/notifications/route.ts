import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET — get notifications for a branch (public, used by loyalty app)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchSlug = searchParams.get("branch");

    if (!branchSlug) return NextResponse.json({ error: "Missing branch" }, { status: 400 });

    const branch = await prisma.branch.findUnique({ where: { slug: branchSlug } });
    if (!branch) return NextResponse.json({ error: "Branch not found" }, { status: 404 });

    const notifications = await prisma.notification.findMany({
      where: { branchId: branch.id },
      orderBy: { createdAt: "desc" },
      take: 30,
      select: {
        id: true,
        type: true,
        title: true,
        message: true,
        createdAt: true,
      },
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Loyalty notifications GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
