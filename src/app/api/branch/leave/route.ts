import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get("branchId");
    if (!branchId) return NextResponse.json({ error: "Missing branchId" }, { status: 400 });

    const [leaveRequests, employees] = await Promise.all([
      prisma.leaveRequest.findMany({
        where: { branchId },
        orderBy: { createdAt: "desc" },
        include: { employee: { select: { name: true, position: true } } },
      }),
      prisma.employee.findMany({
        where: { branchId, status: "ACTIVE" },
        select: { id: true, name: true },
      }),
    ]);

    return NextResponse.json({ leaveRequests, employees });
  } catch (error) {
    console.error("Leave GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;
  try {
    const body = await request.json();
    const { branchId, employeeId, type, startDate, endDate, reason } = body;

    const leave = await prisma.leaveRequest.create({
      data: {
        branchId,
        employeeId,
        type,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
      },
    });

    return NextResponse.json(leave);
  } catch (error) {
    console.error("Leave POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;
  try {
    const body = await request.json();
    const { id, status, approvedById } = body;

    const leave = await prisma.leaveRequest.update({
      where: { id },
      data: { status, approvedById },
    });

    return NextResponse.json(leave);
  } catch (error) {
    console.error("Leave PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
