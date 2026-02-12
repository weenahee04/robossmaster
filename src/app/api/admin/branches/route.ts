import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { generateSlug, generatePassword } from "@/lib/utils";
import { requireAdmin } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;
  try {
    const branches = await prisma.branch.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        bankAccount: true,
        _count: { select: { users: true, employees: true, incomes: true, expenses: true } },
      },
    });
    return NextResponse.json(branches);
  } catch (error) {
    console.error("Branches GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  try {
    const body = await request.json();
    const {
      name,
      address,
      phone,
      ownerName,
      ownerEmail,
      ownerPhone,
      bankName,
      bankBranch,
      accountName,
      accountNumber,
      promptPay,
      latitude,
      longitude,
      initialInvestment,
      openDate,
    } = body;

    // Generate slug
    let slug = generateSlug(name);
    const existing = await prisma.branch.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    // Generate password for branch admin
    const password = generatePassword();
    const passwordHash = await bcrypt.hash(password, 12);

    // Create branch + bank account + branch admin in transaction
    const result = await prisma.$transaction(async (tx) => {
      const branch = await tx.branch.create({
        data: {
          name,
          slug,
          address,
          phone,
          email: ownerEmail,
          latitude: latitude ? parseFloat(latitude) : null,
          longitude: longitude ? parseFloat(longitude) : null,
          initialInvestment: initialInvestment ? parseFloat(initialInvestment) : null,
          openDate: openDate ? new Date(openDate) : null,
        },
      });

      await tx.bankAccount.create({
        data: {
          branchId: branch.id,
          bankName: bankName || "",
          bankBranch: bankBranch || "",
          accountName: accountName || "",
          accountNumber: accountNumber || "",
          promptPay: promptPay || "",
        },
      });

      const user = await tx.user.create({
        data: {
          email: ownerEmail,
          passwordHash,
          name: ownerName,
          phone: ownerPhone,
          role: "BRANCH_ADMIN",
          branchId: branch.id,
        },
      });

      return { branch, user };
    });

    return NextResponse.json({
      branch: result.branch,
      credentials: {
        email: ownerEmail,
        password,
        loginUrl: `/branch/${slug}/login`,
      },
    });
  } catch (error: any) {
    console.error("Branch POST error:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "อีเมลนี้ถูกใช้งานแล้ว" },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  try {
    const body = await request.json();
    const { id, isActive } = body;

    const branch = await prisma.branch.update({
      where: { id },
      data: { isActive },
    });

    return NextResponse.json(branch);
  } catch (error) {
    console.error("Branch PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await prisma.bankAccount.deleteMany({ where: { branchId: id } });
    await prisma.user.deleteMany({ where: { branchId: id } });
    await prisma.branch.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Branch DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
