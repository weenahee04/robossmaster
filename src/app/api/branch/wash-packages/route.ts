import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

// GET — get branch-specific wash packages
export async function GET(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get("branchId");
    if (!branchId) return NextResponse.json({ error: "Missing branchId" }, { status: 400 });

    const packages = await prisma.washPackage.findMany({
      where: { branchId },
      orderBy: [{ type: "asc" }, { name: "asc" }],
    });
    return NextResponse.json(packages);
  } catch (error) {
    console.error("Branch wash-packages GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST — create branch-specific wash package
export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;
  try {
    const body = await request.json();
    const { branchId, name, type, price } = body;

    if (!branchId || !name || !type || price === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const pkg = await prisma.washPackage.create({
      data: { branchId, name, type, price: parseFloat(price) },
    });
    return NextResponse.json(pkg);
  } catch (error) {
    console.error("Branch wash-packages POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH — update branch-specific wash package
export async function PATCH(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;
  try {
    const body = await request.json();
    const { id, name, type, price, isActive } = body;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const pkg = await prisma.washPackage.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(type !== undefined && { type }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(isActive !== undefined && { isActive }),
      },
    });
    return NextResponse.json(pkg);
  } catch (error) {
    console.error("Branch wash-packages PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE — delete branch-specific wash package
export async function DELETE(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await prisma.washPackage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Branch wash-packages DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
