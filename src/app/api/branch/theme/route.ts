import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

// GET — get branch theme
export async function GET(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get("branchId");
    if (!branchId) return NextResponse.json({ error: "Missing branchId" }, { status: 400 });

    const theme = await prisma.branchTheme.findUnique({ where: { branchId } });
    return NextResponse.json(theme);
  } catch (error) {
    console.error("Branch theme GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH — create or update branch theme
export async function PATCH(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;
  try {
    const body = await request.json();
    const { branchId, ...data } = body;
    if (!branchId) return NextResponse.json({ error: "Missing branchId" }, { status: 400 });

    const theme = await prisma.branchTheme.upsert({
      where: { branchId },
      update: data,
      create: { branchId, ...data },
    });
    return NextResponse.json(theme);
  } catch (error) {
    console.error("Branch theme PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE — reset to default (delete theme record)
export async function DELETE(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get("branchId");
    if (!branchId) return NextResponse.json({ error: "Missing branchId" }, { status: 400 });

    await prisma.branchTheme.deleteMany({ where: { branchId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Branch theme DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
