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

    const [incomes, expenses, branches] = await Promise.all([
      prisma.income.findMany({
        where,
        orderBy: { date: "desc" },
        take: 100,
        include: {
          branch: { select: { name: true } },
          category: { select: { name: true } },
        },
      }),
      prisma.expense.findMany({
        where,
        orderBy: { date: "desc" },
        take: 100,
        include: {
          branch: { select: { name: true } },
          category: { select: { name: true } },
        },
      }),
      prisma.branch.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
    ]);

    const totalIncome = incomes.reduce((sum: number, i: { amount: number }) => sum + i.amount, 0);
    const totalExpense = expenses.reduce((sum: number, e: { amount: number }) => sum + e.amount, 0);

    return NextResponse.json({
      incomes,
      expenses,
      branches,
      totalIncome,
      totalExpense,
      profit: totalIncome - totalExpense,
    });
  } catch (error) {
    console.error("Finance GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
