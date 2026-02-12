import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;
  try {
    const packages = await prisma.globalWashPackage.findMany({
      orderBy: [{ type: "asc" }, { name: "asc" }],
    });
    return NextResponse.json(packages);
  } catch (error) {
    console.error("GlobalWashPackage GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  try {
    const body = await request.json();
    const { name, type, price } = body;

    const pkg = await prisma.globalWashPackage.create({
      data: { name, type, price: parseFloat(price) },
    });
    return NextResponse.json(pkg);
  } catch (error) {
    console.error("GlobalWashPackage POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  try {
    const body = await request.json();
    const { id, name, type, price, isActive } = body;

    const pkg = await prisma.globalWashPackage.update({
      where: { id },
      data: { name, type, price: price !== undefined ? parseFloat(price) : undefined, isActive },
    });
    return NextResponse.json(pkg);
  } catch (error) {
    console.error("GlobalWashPackage PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await prisma.globalWashPackage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("GlobalWashPackage DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
