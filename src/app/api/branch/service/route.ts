import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { validate, createServiceTicketSchema, updateServiceTicketSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get("branchId");
    if (!branchId) return NextResponse.json({ error: "Missing branchId" }, { status: 400 });

    const tickets = await prisma.serviceTicket.findMany({
      where: { branchId },
      orderBy: { createdAt: "desc" },
      include: { comments: { include: { user: { select: { name: true } } }, orderBy: { createdAt: "asc" } } },
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Service GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;
  try {
    const body = await request.json();
    const v = validate(createServiceTicketSchema, body);
    if (!v.success) return NextResponse.json({ error: v.error }, { status: 400 });
    const { branchId, title, description, category, priority, machineModel, images } = v.data;

    const ticket = await prisma.serviceTicket.create({
      data: { branchId, title, description: description ?? "", category: category ?? "", priority: priority || "MEDIUM", machineModel, images },
    });

    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Service POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;
  try {
    const body = await request.json();
    const v = validate(updateServiceTicketSchema, body);
    if (!v.success) return NextResponse.json({ error: v.error }, { status: 400 });
    const { id, status, comment, userId } = v.data;

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
    console.error("Service PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
