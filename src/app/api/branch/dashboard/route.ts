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
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [
      todayIncome,
      monthlyIncome,
      monthlyExpense,
      totalEmployees,
      recentIncomes,
      recentExpenses,
      todayWashRecords,
      monthExpenses,
    ] = await Promise.all([
      prisma.income.aggregate({ _sum: { amount: true }, where: { branchId, date: { gte: startOfDay } } }),
      prisma.income.aggregate({ _sum: { amount: true }, where: { branchId, date: { gte: startOfMonth } } }),
      prisma.expense.aggregate({ _sum: { amount: true }, where: { branchId, date: { gte: startOfMonth } } }),
      prisma.employee.count({ where: { branchId, status: "ACTIVE" } }),
      prisma.income.findMany({ where: { branchId }, orderBy: { date: "desc" }, take: 5, include: { category: { select: { name: true } } } }),
      prisma.expense.findMany({ where: { branchId }, orderBy: { date: "desc" }, take: 5, include: { category: { select: { name: true } } } }),
      prisma.washRecord.findMany({ where: { branchId, date: { gte: startOfDay } } }),
      prisma.expense.findMany({ where: { branchId, date: { gte: startOfMonth } }, include: { category: { select: { name: true } } } }),
    ]);

    // Wash counts today
    const todayWash = { CAR: 0, BIKE: 0, HELMET: 0, total: 0 };
    let todayWashRevenue = 0;
    todayWashRecords.forEach((r: { vehicleType: string; amount: number }) => {
      if (r.vehicleType in todayWash) todayWash[r.vehicleType as keyof typeof todayWash]++;
      todayWash.total++;
      todayWashRevenue += r.amount;
    });

    // Top expense categories
    const expByCat: Record<string, number> = {};
    monthExpenses.forEach((e: { amount: number; category: { name: string } | null }) => {
      const name = e.category?.name || "อื่นๆ";
      expByCat[name] = (expByCat[name] || 0) + e.amount;
    });
    const topExpenseCategories = Object.entries(expByCat)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    const mIncome = monthlyIncome._sum.amount || 0;
    const mExpense = monthlyExpense._sum.amount || 0;

    // Weekly data for chart
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(day.getDate() - i);
      const start = new Date(day.getFullYear(), day.getMonth(), day.getDate());
      const end = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1);
      const dayName = start.toLocaleDateString("th-TH", { weekday: "short" });

      const [inc, exp] = await Promise.all([
        prisma.income.aggregate({ _sum: { amount: true }, where: { branchId, date: { gte: start, lt: end } } }),
        prisma.expense.aggregate({ _sum: { amount: true }, where: { branchId, date: { gte: start, lt: end } } }),
      ]);

      weeklyData.push({ day: dayName, income: inc._sum.amount || 0, expense: exp._sum.amount || 0 });
    }

    return NextResponse.json({
      todayIncome: todayIncome._sum.amount || 0,
      monthlyIncome: mIncome,
      monthlyExpense: mExpense,
      monthProfit: mIncome - mExpense,
      totalEmployees,
      todayWash,
      todayWashRevenue,
      topExpenseCategories,
      recentIncomes,
      recentExpenses,
      weeklyData,
    });
  } catch (error) {
    console.error("Branch dashboard error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
