import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET — get vehicles for a customer
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId");
    if (!customerId) return NextResponse.json({ error: "Missing customerId" }, { status: 400 });

    const vehicles = await prisma.vehicle.findMany({
      where: { customerId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(vehicles);
  } catch (error) {
    console.error("Vehicles GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST — add a vehicle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, make, model, licensePlate } = body;

    if (!customerId || !make || !licensePlate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const vehicle = await prisma.vehicle.create({
      data: { customerId, make, model: model || null, licensePlate },
    });

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error("Vehicles POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE — remove a vehicle
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
