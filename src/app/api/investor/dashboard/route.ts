import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [
      totalBranches,
      activeBranches,
      todayRevenue,
      monthRevenue,
      prevMonthRevenue,
      yearRevenue,
      branches,
    ] = await Promise.all([
      prisma.branch.count(),
      prisma.branch.count({ where: { isActive: true } }),
      prisma.income.aggregate({ _sum: { amount: true }, where: { date: { gte: startOfDay } } }),
      prisma.income.aggregate({ _sum: { amount: true }, where: { date: { gte: startOfMonth } } }),
      prisma.income.aggregate({ _sum: { amount: true }, where: { date: { gte: startOfPrevMonth, lt: startOfMonth } } }),
      prisma.income.aggregate({ _sum: { amount: true }, where: { date: { gte: new Date(now.getFullYear(), 0, 1) } } }),
      prisma.branch.findMany({
        where: { isActive: true },
        select: { id: true, name: true, slug: true },
      }),
    ]);

    const mRevenue = monthRevenue._sum.amount || 0;
    const pmRevenue = prevMonthRevenue._sum.amount || 0;
    const growthRate = pmRevenue > 0 ? ((mRevenue - pmRevenue) / pmRevenue) * 100 : 0;
    const avgRevenuePerBranch = activeBranches > 0 ? mRevenue / activeBranches : 0;

    // Top 10 branches by revenue this month
    const branchRevenues = [];
    for (const branch of branches) {
      const rev = await prisma.income.aggregate({
        _sum: { amount: true },
        where: { branchId: branch.id, date: { gte: startOfMonth } },
      });
      branchRevenues.push({ name: branch.name, revenue: rev._sum.amount || 0 });
    }
    branchRevenues.sort((a, b) => b.revenue - a.revenue);
    const top10 = branchRevenues.slice(0, 10);

    // Monthly revenue trend (last 12 months)
    const monthlyTrend = [];
    for (let i = 11; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const monthName = start.toLocaleDateString("th-TH", { month: "short", year: "2-digit" });
      const rev = await prisma.income.aggregate({ _sum: { amount: true }, where: { date: { gte: start, lt: end } } });
      monthlyTrend.push({ month: monthName, revenue: rev._sum.amount || 0 });
    }

    return NextResponse.json({
      totalBranches,
      activeBranches,
      todayRevenue: todayRevenue._sum.amount || 0,
      monthRevenue: mRevenue,
      yearRevenue: yearRevenue._sum.amount || 0,
      growthRate: Math.round(growthRate * 100) / 100,
      avgRevenuePerBranch: Math.round(avgRevenuePerBranch),
      top10Branches: top10,
      monthlyTrend,
    });
  } catch (error) {
    console.error("Investor dashboard error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
