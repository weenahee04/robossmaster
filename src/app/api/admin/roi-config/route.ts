import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;
  try {
    let config = await prisma.roiConfig.findFirst();
    if (!config) {
      config = await prisma.roiConfig.create({ data: {} });
    }
    return NextResponse.json(config);
  } catch (error) {
    console.error("RoiConfig GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  try {
    const body = await request.json();
    const { depreciationRate, adminFeePercent, targetRoiPercent, targetPaybackMonths, includePayrollInCost } = body;

    let config = await prisma.roiConfig.findFirst();
    if (!config) {
      config = await prisma.roiConfig.create({
        data: { depreciationRate, adminFeePercent, targetRoiPercent, targetPaybackMonths, includePayrollInCost },
      });
    } else {
      config = await prisma.roiConfig.update({
        where: { id: config.id },
        data: { depreciationRate, adminFeePercent, targetRoiPercent, targetPaybackMonths, includePayrollInCost },
      });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error("RoiConfig PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
