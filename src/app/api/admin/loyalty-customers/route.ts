import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET — list all loyalty customers with their points
export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        points: {
          include: { branch: { select: { name: true, slug: true } } },
        },
        vehicles: true,
        _count: { select: { coupons: true, pointTransactions: true } },
      },
    });
    return NextResponse.json(customers);
  } catch (error) {
    console.error("Admin loyalty-customers GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
