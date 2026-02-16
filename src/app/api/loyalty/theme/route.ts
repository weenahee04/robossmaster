import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { defaultTheme } from "@/lib/theme-presets";

// GET — public endpoint: get theme for loyalty app by branch slug
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchSlug = searchParams.get("branch");
    if (!branchSlug) return NextResponse.json(defaultTheme);

    const branch = await prisma.branch.findUnique({
      where: { slug: branchSlug },
      include: { theme: true },
    });

    if (!branch || !branch.theme) {
      return NextResponse.json(defaultTheme);
    }

    return NextResponse.json(branch.theme);
  } catch (error) {
    console.error("Loyalty theme GET error:", error);
    return NextResponse.json(defaultTheme);
  }
}
