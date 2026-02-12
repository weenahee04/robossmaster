import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const branch = await prisma.branch.findUnique({
      where: { slug },
      select: { id: true, name: true, slug: true, isActive: true },
    });

    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    return NextResponse.json(branch);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
