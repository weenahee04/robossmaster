import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { branch: { select: { name: true } } },
    });
    const branches = await prisma.branch.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ notifications, branches });
  } catch (error) {
    console.error("Admin Notifications GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  try {
    const body = await request.json();
    const { branchId, type, title, message } = body;

    if (branchId === "ALL") {
      const branches = await prisma.branch.findMany({ where: { isActive: true }, select: { id: true } });
      const data = branches.map((b: { id: string }) => ({
        branchId: b.id,
        type: type || "GENERAL",
        title,
        message,
      }));
      await prisma.notification.createMany({ data });
      return NextResponse.json({ success: true, count: data.length });
    } else {
      const notification = await prisma.notification.create({
        data: { branchId, type: type || "GENERAL", title, message },
      });
      return NextResponse.json(notification);
    }
  } catch (error) {
    console.error("Admin Notifications POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
