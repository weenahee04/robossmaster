import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET — lookup customer by phone (public, used by loyalty app)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");
    const branchSlug = searchParams.get("branch");

    if (!phone) return NextResponse.json({ error: "Missing phone" }, { status: 400 });

    const customer = await prisma.customer.findUnique({
      where: { phone },
      include: {
        vehicles: true,
        points: branchSlug
          ? {
              where: { branch: { slug: branchSlug } },
              include: { branch: { select: { name: true, slug: true } } },
            }
          : { include: { branch: { select: { name: true, slug: true } } } },
      },
    });

    if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Loyalty customers GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST — register new customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, name, lineId } = body;

    if (!phone) return NextResponse.json({ error: "Missing phone" }, { status: 400 });

    const existing = await prisma.customer.findUnique({ where: { phone } });
    if (existing) return NextResponse.json({ error: "Phone already registered", customer: existing }, { status: 409 });

    const customer = await prisma.customer.create({
      data: { phone, name: name || null, lineId: lineId || null },
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Loyalty customers POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH — update customer profile
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, profileImage } = body;

    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(profileImage !== undefined && { profileImage }),
      },
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Loyalty customers PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
