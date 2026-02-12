import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const testLogin = url.searchParams.get("testLogin");

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

    // Test 4: Try actual signIn flow
    let signInResult = null;
    if (testLogin === "1") {
      try {
        // Test CSRF endpoint
        const csrfRes = await fetch(new URL("/api/auth/csrf", url.origin).toString());
        const csrfData = await csrfRes.json();

        // Test callback endpoint
        const callbackRes = await fetch(new URL("/api/auth/callback/credentials", url.origin).toString(), {
          method: "POST",
          headers: { 
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": csrfRes.headers.get("set-cookie") || "",
          },
          body: new URLSearchParams({
            csrfToken: csrfData.csrfToken,
            email: "admin@roboss.com",
            password: "Roboss2026!",
            callbackUrl: "/admin/dashboard",
          }),
          redirect: "manual",
        });

        signInResult = {
          status: callbackRes.status,
          statusText: callbackRes.statusText,
          redirectUrl: callbackRes.headers.get("location"),
          setCookie: callbackRes.headers.get("set-cookie")?.substring(0, 200),
          type: callbackRes.type,
        };
      } catch (e: any) {
        signInResult = { error: e.message };
      }
    }

    return NextResponse.json({
      dbConnected: true,
      userCount,
      adminFound: !!admin,
      adminRole: admin?.role,
      passwordMatch,
      nodeEnv: process.env.NODE_ENV,
      hasSecret: !!process.env.NEXTAUTH_SECRET,
      secretLength: process.env.NEXTAUTH_SECRET?.length,
      nextauthUrl: process.env.NEXTAUTH_URL,
      authSecret: process.env.AUTH_SECRET ? "set" : "not set",
      signInResult,
    });
  } catch (error: any) {
    return NextResponse.json({
      dbConnected: false,
      error: error.message,
      stack: error.stack?.substring(0, 500),
    }, { status: 500 });
  }
}
