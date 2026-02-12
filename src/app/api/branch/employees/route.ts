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

    const employees = await prisma.employee.findMany({
      where: { branchId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(employees);
  } catch (error) {
    console.error("Employees GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;
  try {
    const body = await request.json();
    const { branchId, name, position, phone, email, salary, startDate } = body;

    const employee = await prisma.employee.create({
      data: {
        branchId,
        name,
        position,
        phone,
        email,
        salary: parseFloat(salary) || 0,
        startDate: startDate ? new Date(startDate) : null,
      },
    });
    return NextResponse.json(employee);
  } catch (error) {
    console.error("Employee POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
