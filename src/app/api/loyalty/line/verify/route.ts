import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";

export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { channelId, channelSecret } = await request.json();

    if (!channelId || !channelSecret) {
      return NextResponse.json({ valid: false, error: "Missing credentials" }, { status: 400 });
    }

    // Issue a short-lived channel access token to verify credentials
    const tokenRes = await fetch("https://api.line.me/oauth2/v2.1/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: channelId,
        client_secret: channelSecret,
      }),
    });

    if (!tokenRes.ok) {
      const errData = await tokenRes.json().catch(() => ({}));
      return NextResponse.json({
        valid: false,
        error: errData.error_description || "Invalid credentials",
      });
    }

    const tokenData = await tokenRes.json();

    // Revoke the token immediately (cleanup)
    if (tokenData.access_token) {
      await fetch("https://api.line.me/oauth2/v2.1/revoke", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          access_token: tokenData.access_token,
          client_id: channelId,
          client_secret: channelSecret,
        }),
      }).catch(() => {});
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error("LINE verify error:", error);
    return NextResponse.json({ valid: false, error: "Server error" }, { status: 500 });
  }
}
