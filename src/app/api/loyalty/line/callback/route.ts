import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const rawState = searchParams.get("state") || "";
    const error = searchParams.get("error");

    // state = "branchSlug:nonce"
    const [branchSlug, nonce] = rawState.split(":");

    const baseUrl = process.env.NEXTAUTH_URL || `https://${request.headers.get("host")}`;

    if (error || !code || !branchSlug) {
      return NextResponse.redirect(`${baseUrl}/loyalty/${branchSlug || "unknown"}/login?error=line_denied`);
    }

    // Validate nonce from cookie
    const storedNonce = request.cookies.get("line_oauth_nonce")?.value;
    if (!nonce || nonce !== storedNonce) {
      console.error("LINE OAuth nonce mismatch", { nonce, storedNonce });
      return NextResponse.redirect(`${baseUrl}/loyalty/${branchSlug}/login?error=line_invalid_state`);
    }

    // 1. Get branch with LINE credentials
    const branch = await prisma.branch.findUnique({
      where: { slug: branchSlug },
      select: { id: true, slug: true, lineChannelId: true, lineChannelSecret: true },
    });

    if (!branch || !branch.lineChannelId || !branch.lineChannelSecret) {
      return NextResponse.redirect(`${baseUrl}/loyalty/${branchSlug}/login?error=line_not_configured`);
    }

    // 2. Exchange code for access token
    const callbackUrl = `${baseUrl}/api/loyalty/line/callback`;
    const tokenRes = await fetch("https://api.line.me/oauth2/v2.1/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: callbackUrl,
        client_id: branch.lineChannelId,
        client_secret: decrypt(branch.lineChannelSecret),
      }),
    });

    if (!tokenRes.ok) {
      console.error("LINE token exchange failed:", await tokenRes.text());
      return NextResponse.redirect(`${baseUrl}/loyalty/${branchSlug}/login?error=line_token_failed`);
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 3. Get LINE profile
    const profileRes = await fetch("https://api.line.me/v2/profile", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!profileRes.ok) {
      console.error("LINE profile fetch failed:", await profileRes.text());
      return NextResponse.redirect(`${baseUrl}/loyalty/${branchSlug}/login?error=line_profile_failed`);
    }

    const profile = await profileRes.json();
    const lineUserId = profile.userId;
    const displayName = profile.displayName || "LINE User";
    const pictureUrl = profile.pictureUrl || null;

    // 4. Find or create customer via CustomerLineAccount
    let customerLineAccount = await prisma.customerLineAccount.findUnique({
      where: { branchId_lineUserId: { branchId: branch.id, lineUserId } },
      include: { customer: true },
    });

    let customer;

    if (customerLineAccount) {
      // Existing mapping — update profile if changed
      customer = customerLineAccount.customer;
      if (pictureUrl && customer.profileImage !== pictureUrl) {
        customer = await prisma.customer.update({
          where: { id: customer.id },
          data: { profileImage: pictureUrl, name: displayName },
        });
      }
    } else {
      // No mapping for this branch — check if this LINE user already has a Customer via another branch
      const existingMapping = await prisma.customerLineAccount.findFirst({
        where: { lineUserId },
        include: { customer: true },
      });

      if (existingMapping) {
        // Same person, different branch — reuse existing Customer, create new mapping
        customer = existingMapping.customer;
        await prisma.customerLineAccount.create({
          data: { customerId: customer.id, branchId: branch.id, lineUserId },
        });
        // Update profile
        if (pictureUrl && customer.profileImage !== pictureUrl) {
          customer = await prisma.customer.update({
            where: { id: customer.id },
            data: { profileImage: pictureUrl },
          });
        }
      } else {
        // Completely new customer
        customer = await prisma.customer.create({
          data: {
            phone: `line_${lineUserId}`,
            name: displayName,
            lineId: lineUserId,
            profileImage: pictureUrl,
            lineAccounts: {
              create: { branchId: branch.id, lineUserId },
            },
          },
        });
      }
    }

    // 5. Ensure CustomerPoint exists for this branch
    await prisma.customerPoint.upsert({
      where: { customerId_branchId: { customerId: customer.id, branchId: branch.id } },
      update: {},
      create: {
        customerId: customer.id,
        branchId: branch.id,
        balance: 0,
        totalEarned: 0,
        tier: "SILVER",
        stamps: 0,
      },
    });

    // 6. Redirect with customer data in httpOnly cookie (not URL param)
    const customerPayload = JSON.stringify({
      id: customer.id,
      phone: customer.phone,
      name: customer.name,
      lineId: customer.lineId,
      profileImage: customer.profileImage,
    });

    const redirectUrl = `${baseUrl}/loyalty/${branchSlug}?lineLogin=1`;
    const response = NextResponse.redirect(redirectUrl);

    // Set customer data in httpOnly cookie (expires in 60 seconds, consumed on client)
    response.cookies.set("line_customer_data", customerPayload, {
      httpOnly: false, // client JS needs to read this
      secure: baseUrl.startsWith("https"),
      sameSite: "lax",
      path: `/loyalty/${branchSlug}`,
      maxAge: 60,
    });

    // Clear nonce cookie
    response.cookies.delete("line_oauth_nonce");

    return response;
  } catch (error) {
    console.error("LINE callback error:", error);
    const baseUrl = process.env.NEXTAUTH_URL || `https://${request.headers.get("host")}`;
    return NextResponse.redirect(`${baseUrl}/loyalty/unknown/login?error=line_server_error`);
  }
}
