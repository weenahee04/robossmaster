import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const checks: Record<string, any> = {};

  // Check env vars
  checks.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET ? "SET (" + process.env.NEXTAUTH_SECRET.length + " chars)" : "MISSING";
  checks.AUTH_SECRET = process.env.AUTH_SECRET ? "SET (" + process.env.AUTH_SECRET.length + " chars)" : "MISSING";
  checks.NEXTAUTH_URL = process.env.NEXTAUTH_URL || "MISSING";
  checks.DATABASE_URL = process.env.DATABASE_URL ? "SET (" + process.env.DATABASE_URL.substring(0, 30) + "...)" : "MISSING";
  checks.NODE_ENV = process.env.NODE_ENV;

  // Check DB connection
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = "CONNECTED";
  } catch (e: any) {
    checks.database = "FAILED: " + e.message;
  }

  return NextResponse.json(checks);
}
