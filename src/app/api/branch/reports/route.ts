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

    const now = new Date();

    // Monthly data (last 6 months)
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const monthName = start.toLocaleDateString("th-TH", { month: "short" });

      const [inc, exp] = await Promise.all([
        prisma.income.aggregate({ _sum: { amount: true }, where: { branchId, date: { gte: start, lt: end } } }),
        prisma.expense.aggregate({ _sum: { amount: true }, where: { branchId, date: { gte: start, lt: end } } }),
      ]);

      const income = inc._sum.amount || 0;
      const expense = exp._sum.amount || 0;
      monthlyData.push({ month: monthName, income, expense, profit: income - expense });
    }

    // Category breakdown
    const incomes = await prisma.income.findMany({
      where: { branchId },
      include: { category: { select: { name: true } } },
    });
    const expenses = await prisma.expense.findMany({
      where: { branchId },
      include: { category: { select: { name: true } } },
    });

    const incomeByCategory: Record<string, number> = {};
    incomes.forEach((i) => {
      const name = i.category?.name || "อื่นๆ";
      incomeByCategory[name] = (incomeByCategory[name] || 0) + i.amount;
    });

    const expenseByCategory: Record<string, number> = {};
    expenses.forEach((e) => {
      const name = e.category?.name || "อื่นๆ";
      expenseByCategory[name] = (expenseByCategory[name] || 0) + e.amount;
    });

    const categoryIncome = Object.entries(incomeByCategory).map(([name, total]) => ({ name, total }));
    const categoryExpense = Object.entries(expenseByCategory).map(([name, total]) => ({ name, total }));

    const totalIncome = incomes.reduce((s: number, i) => s + i.amount, 0);
    const totalExpense = expenses.reduce((s: number, e) => s + e.amount, 0);

    return NextResponse.json({ monthlyData, categoryIncome, categoryExpense, totalIncome, totalExpense });
  } catch (error) {
    console.error("Reports error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
