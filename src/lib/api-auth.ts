import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET || "roboss-dev-secret-change-in-production";

export async function requireAdmin(req: NextRequest) {
  const token = await getToken({ req, secret });
  if (!token || token.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null; // authorized
}

export async function requireBranch(req: NextRequest) {
  const token = await getToken({ req, secret });
  if (!token || token.role !== "BRANCH_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function requireAuth(req: NextRequest) {
  const token = await getToken({ req, secret });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
