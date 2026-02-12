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

    const [expenses, categories] = await Promise.all([
      prisma.expense.findMany({
        where: { branchId },
        orderBy: { date: "desc" },
        include: { category: { select: { name: true } } },
      }),
      prisma.category.findMany({ where: { type: "EXPENSE" } }),
    ]);

    return NextResponse.json({ expenses, categories });
  } catch (error) {
    console.error("Expense GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;
  try {
    const body = await request.json();
    const { branchId, amount, categoryId, description, date, createdById } = body;

    const expense = await prisma.expense.create({
      data: {
        branchId,
        amount: parseFloat(amount),
        categoryId: categoryId || null,
        description,
        date: new Date(date),
        createdById,
      },
    });

    return NextResponse.json(expense);
  } catch (error) {
    console.error("Expense POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
