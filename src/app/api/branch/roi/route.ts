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

    const branch = await prisma.branch.findUnique({ where: { id: branchId } });
    if (!branch) return NextResponse.json({ error: "Branch not found" }, { status: 404 });

    // Load ROI config from admin
    let roiConfig = await prisma.roiConfig.findFirst();
    if (!roiConfig) {
      roiConfig = await prisma.roiConfig.create({ data: {} });
    }

    const initialInvestment = branch.initialInvestment || 0;
    const openDate = branch.openDate || branch.createdAt;

    // Total income & expense since opening
    const [totalIncome, totalExpense] = await Promise.all([
      prisma.income.aggregate({ _sum: { amount: true }, where: { branchId } }),
      prisma.expense.aggregate({ _sum: { amount: true }, where: { branchId } }),
    ]);

    const cumulativeIncome = totalIncome._sum.amount || 0;
    const cumulativeExpense = totalExpense._sum.amount || 0;

    // Admin fee deduction
    const adminFee = cumulativeIncome * (roiConfig.adminFeePercent / 100);

    // Payroll cost (if configured)
    let payrollCost = 0;
    if (roiConfig.includePayrollInCost) {
      const payrollSum = await prisma.payroll.aggregate({
        _sum: { totalPay: true },
        where: { branchId },
      });
      payrollCost = payrollSum._sum.totalPay || 0;
    }

    // Depreciation
    const now = new Date();
    const monthsSinceOpen = Math.max(1, Math.round((now.getTime() - new Date(openDate).getTime()) / (1000 * 60 * 60 * 24 * 30)));
    const yearsSinceOpen = monthsSinceOpen / 12;
    const depreciation = initialInvestment * (roiConfig.depreciationRate / 100) * yearsSinceOpen;

    // Net profit = income - expense - admin fee - payroll (if included)
    const cumulativeProfit = cumulativeIncome - cumulativeExpense - adminFee - payrollCost;

    // Average monthly profit
    const avgMonthlyProfit = cumulativeProfit / monthsSinceOpen;

    // Payback month calculation
    let paybackMonth: number | null = null;
    if (avgMonthlyProfit > 0 && initialInvestment > 0) {
      paybackMonth = Math.ceil(initialInvestment / avgMonthlyProfit);
    }

    // ROI % per year (after depreciation)
    let roiPerYear = 0;
    if (initialInvestment > 0) {
      const annualProfit = avgMonthlyProfit * 12;
      const annualDepreciation = initialInvestment * (roiConfig.depreciationRate / 100);
      roiPerYear = ((annualProfit - annualDepreciation) / initialInvestment) * 100;
    }

    // Progress to payback
    let paybackProgress = 0;
    if (initialInvestment > 0) {
      paybackProgress = Math.min(100, (cumulativeProfit / initialInvestment) * 100);
    }

    // Monthly profit trend (last 6 months)
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const monthName = start.toLocaleDateString("th-TH", { month: "short" });

      const [inc, exp] = await Promise.all([
        prisma.income.aggregate({ _sum: { amount: true }, where: { branchId, date: { gte: start, lt: end } } }),
        prisma.expense.aggregate({ _sum: { amount: true }, where: { branchId, date: { gte: start, lt: end } } }),
      ]);

      const mIncome = inc._sum.amount || 0;
      const mExpense = exp._sum.amount || 0;
      const mAdminFee = mIncome * (roiConfig.adminFeePercent / 100);
      monthlyTrend.push({ month: monthName, income: mIncome, expense: mExpense, profit: mIncome - mExpense - mAdminFee });
    }

    return NextResponse.json({
      initialInvestment,
      openDate,
      cumulativeIncome,
      cumulativeExpense,
      cumulativeProfit,
      adminFee,
      payrollCost,
      depreciation,
      monthsSinceOpen,
      avgMonthlyProfit,
      paybackMonth,
      roiPerYear: Math.round(roiPerYear * 100) / 100,
      paybackProgress: Math.round(paybackProgress * 100) / 100,
      monthlyTrend,
      config: {
        depreciationRate: roiConfig.depreciationRate,
        adminFeePercent: roiConfig.adminFeePercent,
        targetRoiPercent: roiConfig.targetRoiPercent,
        targetPaybackMonths: roiConfig.targetPaybackMonths,
        includePayrollInCost: roiConfig.includePayrollInCost,
      },
    });
  } catch (error) {
    console.error("ROI error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
