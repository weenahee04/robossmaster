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

    const [attendances, employees] = await Promise.all([
      prisma.attendance.findMany({
        where: { branchId },
        orderBy: { date: "desc" },
        take: 100,
        include: { employee: { select: { name: true, position: true } } },
      }),
      prisma.employee.findMany({
        where: { branchId, status: "ACTIVE" },
        select: { id: true, name: true, position: true },
      }),
    ]);

    return NextResponse.json({ attendances, employees });
  } catch (error) {
    console.error("Attendance GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;
  try {
    const body = await request.json();
    const { branchId, employeeId, date, checkIn, checkOut, status } = body;

    const checkInDate = checkIn ? new Date(`${date}T${checkIn}`) : null;
    const checkOutDate = checkOut ? new Date(`${date}T${checkOut}`) : null;

    let hoursWorked = null;
    let overtimeHours = null;
    if (checkInDate && checkOutDate) {
      hoursWorked = (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60);
      overtimeHours = hoursWorked > 8 ? hoursWorked - 8 : 0;
      hoursWorked = Math.round(hoursWorked * 100) / 100;
      overtimeHours = Math.round(overtimeHours * 100) / 100;
    }

    const attendance = await prisma.attendance.create({
      data: {
        branchId,
        employeeId,
        date: new Date(date),
        checkIn: checkInDate,
        checkOut: checkOutDate,
        status: status || "PRESENT",
        hoursWorked,
        overtimeHours,
      },
    });

    return NextResponse.json(attendance);
  } catch (error) {
    console.error("Attendance POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
