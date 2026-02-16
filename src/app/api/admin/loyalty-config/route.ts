import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET — get global loyalty config + app config
export async function GET() {
  try {
    let config = await prisma.loyaltyConfig.findFirst({ where: { branchId: null } });
    const appConfig = await prisma.loyaltyAppConfig.findFirst();
    return NextResponse.json({ config, appConfig });
  } catch (error) {
    console.error("Admin loyalty-config GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST — upsert loyalty config + app config
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pointsPerBaht, pointsExpireDays, goldThreshold, platinumThreshold, goldMultiplier, platinumMultiplier, stampsForFreeWash, heroImageUrl, heroTitle, heroSubtitle, heroButtonText } = body;

    // Upsert LoyaltyConfig (global)
    let existing = await prisma.loyaltyConfig.findFirst({ where: { branchId: null } });
    if (existing) {
      await prisma.loyaltyConfig.update({
        where: { id: existing.id },
        data: {
          ...(pointsPerBaht !== undefined && { pointsPerBaht: parseFloat(pointsPerBaht) }),
          ...(pointsExpireDays !== undefined && { pointsExpireDays: parseInt(pointsExpireDays) }),
          ...(goldThreshold !== undefined && { goldThreshold: parseInt(goldThreshold) }),
          ...(platinumThreshold !== undefined && { platinumThreshold: parseInt(platinumThreshold) }),
          ...(goldMultiplier !== undefined && { goldMultiplier: parseFloat(goldMultiplier) }),
          ...(platinumMultiplier !== undefined && { platinumMultiplier: parseFloat(platinumMultiplier) }),
          ...(stampsForFreeWash !== undefined && { stampsForFreeWash: parseInt(stampsForFreeWash) }),
        },
      });
    } else {
      await prisma.loyaltyConfig.create({
        data: {
          pointsPerBaht: pointsPerBaht ? parseFloat(pointsPerBaht) : 10,
          pointsExpireDays: pointsExpireDays ? parseInt(pointsExpireDays) : 365,
          goldThreshold: goldThreshold ? parseInt(goldThreshold) : 100,
          platinumThreshold: platinumThreshold ? parseInt(platinumThreshold) : 500,
          goldMultiplier: goldMultiplier ? parseFloat(goldMultiplier) : 1.5,
          platinumMultiplier: platinumMultiplier ? parseFloat(platinumMultiplier) : 2.0,
          stampsForFreeWash: stampsForFreeWash ? parseInt(stampsForFreeWash) : 10,
        },
      });
    }

    // Upsert LoyaltyAppConfig
    if (heroImageUrl !== undefined || heroTitle !== undefined || heroSubtitle !== undefined || heroButtonText !== undefined) {
      let appConfig = await prisma.loyaltyAppConfig.findFirst();
      if (appConfig) {
        await prisma.loyaltyAppConfig.update({
          where: { id: appConfig.id },
          data: {
            ...(heroImageUrl !== undefined && { heroImageUrl }),
            ...(heroTitle !== undefined && { heroTitle }),
            ...(heroSubtitle !== undefined && { heroSubtitle }),
            ...(heroButtonText !== undefined && { heroButtonText }),
          },
        });
      } else {
        await prisma.loyaltyAppConfig.create({
          data: { heroImageUrl, heroTitle, heroSubtitle, heroButtonText },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin loyalty-config POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
