import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    // Test 1: DB connection
    const userCount = await prisma.user.count();
    
    // Test 2: Find admin user
    const admin = await prisma.user.findUnique({
      where: { email: "admin@roboss.com" },
      select: { id: true, email: true, role: true, passwordHash: true },
    });

    // Test 3: Password verify
    let passwordMatch = false;
    if (admin) {
      passwordMatch = await bcrypt.compare("Roboss2026!", admin.passwordHash);
    }

    return NextResponse.json({
      dbConnected: true,
      userCount,
      adminFound: !!admin,
      adminRole: admin?.role,
      passwordMatch,
      nodeEnv: process.env.NODE_ENV,
      hasSecret: !!process.env.NEXTAUTH_SECRET,
      nextauthUrl: process.env.NEXTAUTH_URL,
    });
  } catch (error: any) {
    return NextResponse.json({
      dbConnected: false,
      error: error.message,
      stack: error.stack?.substring(0, 500),
    }, { status: 500 });
  }
}
