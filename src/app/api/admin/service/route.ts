import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;
  try {
    const tickets = await prisma.serviceTicket.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        branch: { select: { name: true } },
        comments: { include: { user: { select: { name: true } } }, orderBy: { createdAt: "asc" } },
      },
    });
    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Admin service GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  try {
    const body = await request.json();
    const { id, status, comment, userId } = body;

    if (status) {
      await prisma.serviceTicket.update({
        where: { id },
        data: { status, resolvedAt: status === "FIXED" || status === "CLOSED" ? new Date() : undefined },
      });
    }

    if (comment && userId) {
      await prisma.ticketComment.create({
        data: { ticketId: id, userId, message: comment },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin service PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
