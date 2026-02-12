import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get("branchId");

    const manuals = await prisma.machineManual.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        maintenanceSchedules: branchId
          ? { where: { branchId }, orderBy: { nextDueAt: "asc" } }
          : false,
      },
    });

    return NextResponse.json(manuals);
  } catch (error) {
    console.error("Manuals GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;
  try {
    const body = await request.json();
    const { title, machineModel, content, videoUrl, checklist, createdById } = body;

    const manual = await prisma.machineManual.create({
      data: {
        title,
        machineModel,
        content,
        videoUrl: videoUrl || null,
        checklist: checklist ? JSON.stringify(checklist) : null,
        createdById,
      },
    });
    return NextResponse.json(manual);
  } catch (error) {
    console.error("Manuals POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;
  try {
    const body = await request.json();
    const { id, title, machineModel, content, videoUrl, checklist } = body;

    const manual = await prisma.machineManual.update({
      where: { id },
      data: {
        title,
        machineModel,
        content,
        videoUrl: videoUrl || null,
        checklist: checklist ? JSON.stringify(checklist) : null,
      },
    });
    return NextResponse.json(manual);
  } catch (error) {
    console.error("Manuals PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await prisma.machineManual.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Manuals DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
