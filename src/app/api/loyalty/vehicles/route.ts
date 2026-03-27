import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId");
    if (!customerId) return NextResponse.json({ error: "Missing customerId" }, { status: 400 });

    const vehicles = await prisma.vehicle.findMany({
      where: { customerId },
      orderBy: [{ isPrimary: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(vehicles);
  } catch (error) {
    console.error("Vehicles GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, make, model, color, year, licensePlate, isPrimary } = body;

    if (!customerId || !make || !licensePlate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (isPrimary) {
      await prisma.vehicle.updateMany({
        where: { customerId },
        data: { isPrimary: false },
      });
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        customerId,
        make,
        model: model || null,
        color: color || null,
        year: year || null,
        licensePlate,
        isPrimary: isPrimary ?? false,
      },
    });

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error("Vehicles POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, make, model, color, year, licensePlate, isPrimary } = body;

    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    if (isPrimary) {
      const existing = await prisma.vehicle.findUnique({ where: { id } });
      if (!existing) return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
      await prisma.vehicle.updateMany({
        where: { customerId: existing.customerId },
        data: { isPrimary: false },
      });
    }

    const data: Record<string, unknown> = {};
    if (make !== undefined) data.make = make;
    if (model !== undefined) data.model = model;
    if (color !== undefined) data.color = color;
    if (year !== undefined) data.year = year;
    if (licensePlate !== undefined) data.licensePlate = licensePlate;
    if (isPrimary !== undefined) data.isPrimary = isPrimary;

    const vehicle = await prisma.vehicle.update({ where: { id }, data });
    return NextResponse.json(vehicle);
  } catch (error) {
    console.error("Vehicles PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await prisma.vehicle.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Vehicles DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
