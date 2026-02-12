import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "roboss-dev-secret-DO-NOT-USE-IN-PRODUCTION";

function getTokenOptions(req: NextRequest) {
  const secureCookie = req.nextUrl.protocol === "https:";
  return { req, secret, secureCookie };
}

export async function requireAdmin(req: NextRequest) {
  const token = await getToken(getTokenOptions(req));
  if (!token || token.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null; // authorized
}

export async function requireBranch(req: NextRequest) {
  const token = await getToken(getTokenOptions(req));
  if (!token || token.role !== "BRANCH_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function requireAuth(req: NextRequest) {
  const token = await getToken(getTokenOptions(req));
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
