import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET — list all branches
export async function GET() {
  try {
    const branches = await prisma.branch.findMany({
      select: { id: true, name: true, slug: true, isActive: true, address: true, phone: true, latitude: true, longitude: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(branches);
  } catch (error) {
    console.error("Branches list GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
