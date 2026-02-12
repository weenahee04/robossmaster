import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalBranches,
      activeBranches,
      monthlyIncome,
      monthlyExpense,
      totalEmployees,
      recentBranches,
    ] = await Promise.all([
      prisma.branch.count(),
      prisma.branch.count({ where: { isActive: true } }),
      prisma.income.aggregate({
        _sum: { amount: true },
        where: { date: { gte: startOfMonth } },
      }),
      prisma.expense.aggregate({
        _sum: { amount: true },
        where: { date: { gte: startOfMonth } },
      }),
      prisma.employee.count({ where: { status: "ACTIVE" } }),
      prisma.branch.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          _count: { select: { incomes: true, employees: true } },
        },
      }),
    ]);

    // Monthly data for chart (last 6 months)
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const monthName = start.toLocaleDateString("th-TH", { month: "short" });

      const [inc, exp] = await Promise.all([
        prisma.income.aggregate({
          _sum: { amount: true },
          where: { date: { gte: start, lt: end } },
        }),
        prisma.expense.aggregate({
          _sum: { amount: true },
          where: { date: { gte: start, lt: end } },
        }),
      ]);

      monthlyData.push({
        month: monthName,
        income: inc._sum.amount || 0,
        expense: exp._sum.amount || 0,
      });
    }

    return NextResponse.json({
      totalBranches,
      activeBranches,
      totalIncome: monthlyIncome._sum.amount || 0,
      totalExpense: monthlyExpense._sum.amount || 0,
      totalEmployees,
      recentBranches,
      monthlyData,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
