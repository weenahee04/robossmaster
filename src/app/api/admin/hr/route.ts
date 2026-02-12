import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get("branchId");

    const where = branchId ? { branchId } : {};

    const employees = await prisma.employee.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { branch: { select: { name: true } } },
    });

    const totalActive = employees.filter((e) => e.status === "ACTIVE").length;
    const totalResigned = employees.filter((e) => e.status === "RESIGNED").length;

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const attendance = await prisma.attendance.findMany({
      where: {
        ...where,
        date: { gte: monthStart, lte: monthEnd },
      },
      include: {
        employee: { select: { name: true } },
        branch: { select: { name: true } },
      },
      orderBy: { date: "desc" },
      take: 50,
    });

    const presentCount = attendance.filter((a) => a.status === "PRESENT").length;
    const lateCount = attendance.filter((a) => a.status === "LATE").length;
    const absentCount = attendance.filter((a) => a.status === "ABSENT").length;

    const payroll = await prisma.payroll.findMany({
      where,
      orderBy: [{ year: "desc" }, { month: "desc" }],
      include: {
        employee: { select: { name: true } },
        branch: { select: { name: true } },
      },
      take: 50,
    });

    const totalPayrollThisMonth = payroll
      .filter((p) => p.month === now.getMonth() + 1 && p.year === now.getFullYear())
      .reduce((sum, p) => sum + p.totalPay, 0);

    const branches = await prisma.branch.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      employees,
      totalActive,
      totalResigned,
      attendance,
      presentCount,
      lateCount,
      absentCount,
      payroll,
      totalPayrollThisMonth,
      branches,
    });
  } catch (error) {
    console.error("Admin HR GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
