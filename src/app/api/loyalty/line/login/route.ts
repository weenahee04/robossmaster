import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchSlug = searchParams.get("branch");

    if (!branchSlug) {
      return NextResponse.json({ error: "Missing branch parameter" }, { status: 400 });
    }

    const branch = await prisma.branch.findUnique({
      where: { slug: branchSlug },
      select: { lineChannelId: true, isActive: true },
    });

    if (!branch || !branch.isActive) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    if (!branch.lineChannelId) {
      return NextResponse.json({ error: "LINE Login not configured for this branch" }, { status: 400 });
    }

    const baseUrl = process.env.NEXTAUTH_URL || `https://${request.headers.get("host")}`;
    const callbackUrl = `${baseUrl}/api/loyalty/line/callback`;

    // Generate nonce for CSRF protection
    const nonce = crypto.randomBytes(16).toString("hex");

    const lineAuthUrl = new URL("https://access.line.me/oauth2/v2.1/authorize");
    lineAuthUrl.searchParams.set("response_type", "code");
    lineAuthUrl.searchParams.set("client_id", branch.lineChannelId);
    lineAuthUrl.searchParams.set("redirect_uri", callbackUrl);
    lineAuthUrl.searchParams.set("state", `${branchSlug}:${nonce}`);
    lineAuthUrl.searchParams.set("scope", "profile openid");

    const response = NextResponse.redirect(lineAuthUrl.toString());

    // Store nonce in cookie for validation in callback
    response.cookies.set("line_oauth_nonce", nonce, {
      httpOnly: true,
      secure: baseUrl.startsWith("https"),
      sameSite: "lax",
      path: "/",
      maxAge: 300, // 5 minutes
    });

    return response;
  } catch (error) {
    console.error("LINE login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
