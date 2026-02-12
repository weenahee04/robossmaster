import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all"); // admin sees all, branch sees published only

    const sops = await prisma.sopDocument.findMany({
      where: all === "true" ? {} : { isPublished: true },
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    });
    return NextResponse.json(sops);
  } catch (error) {
    console.error("SOP GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;
  try {
    const body = await request.json();
    const { title, category, content, videoUrl, sortOrder, createdById } = body;

    const sop = await prisma.sopDocument.create({
      data: { title, category, content, videoUrl: videoUrl || null, sortOrder: sortOrder || 0, createdById },
    });
    return NextResponse.json(sop);
  } catch (error) {
    console.error("SOP POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;
  try {
    const body = await request.json();
    const { id, title, category, content, videoUrl, sortOrder, isPublished } = body;

    const sop = await prisma.sopDocument.update({
      where: { id },
      data: { title, category, content, videoUrl: videoUrl || null, sortOrder, isPublished },
    });
    return NextResponse.json(sop);
  } catch (error) {
    console.error("SOP PATCH error:", error);
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

    await prisma.sopDocument.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("SOP DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
