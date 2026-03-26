import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { validate, createPayrollSchema, updatePayrollSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get("branchId");
    if (!branchId) return NextResponse.json({ error: "Missing branchId" }, { status: 400 });

    const payrolls = await prisma.payroll.findMany({
      where: { branchId },
      orderBy: [{ year: "desc" }, { month: "desc" }],
      include: { employee: { select: { name: true, position: true } } },
    });

    const employees = await prisma.employee.findMany({
      where: { branchId, status: "ACTIVE" },
      select: { id: true, name: true, position: true, salary: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ payrolls, employees });
  } catch (error) {
    console.error("Payroll GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;
  try {
    const body = await request.json();
    const v = validate(createPayrollSchema, body);
    if (!v.success) return NextResponse.json({ error: v.error }, { status: 400 });
    const { branchId, employeeId, month, year, baseSalary, overtimePay, deductions } = v.data;

    const totalPay = parseFloat(String(baseSalary || 0)) + parseFloat(String(overtimePay || 0)) - parseFloat(String(deductions || 0));

    const payroll = await prisma.payroll.create({
      data: {
        branchId,
        employeeId,
        month: parseInt(String(month)),
        year: parseInt(String(year)),
        baseSalary: parseFloat(String(baseSalary || 0)),
        overtimePay: parseFloat(String(overtimePay || 0)),
        deductions: parseFloat(String(deductions || 0)),
        totalPay,
        status: "PENDING",
      },
    });

    return NextResponse.json(payroll);
  } catch (error) {
    console.error("Payroll POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;
  try {
    const body = await request.json();
    const v = validate(updatePayrollSchema, body);
    if (!v.success) return NextResponse.json({ error: v.error }, { status: 400 });
    const { id, status } = v.data;

    const data: Record<string, unknown> = { status };
    if (status === "PAID") {
      data.paidAt = new Date();
    }

    const payroll = await prisma.payroll.update({ where: { id }, data });
    return NextResponse.json(payroll);
  } catch (error) {
    console.error("Payroll PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
