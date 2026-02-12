import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "roboss-dev-secret-DO-NOT-USE-IN-PRODUCTION";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public routes - no auth needed
  if (
    pathname === "/" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/debug") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // NextAuth v5 uses "authjs.session-token" cookie name (with __Secure- prefix on HTTPS)
  const isSecure = req.nextUrl.protocol === "https:";
  const cookieName = isSecure ? "__Secure-authjs.session-token" : "authjs.session-token";
  const token = await getToken({ req, secret, cookieName });
  const role = token?.role as string | undefined;
  const branchSlug = token?.branchSlug as string | undefined;

  // Admin login page - redirect if already logged in as admin
  if (pathname === "/admin/login") {
    if (role === "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Branch login pages - /branch/[slug]/login
  const branchLoginMatch = pathname.match(/^\/branch\/([^/]+)\/login$/);
  if (branchLoginMatch) {
    if (role === "BRANCH_ADMIN" && branchSlug) {
      return NextResponse.redirect(
        new URL(`/branch/${branchSlug}/dashboard`, req.url)
      );
    }
    return NextResponse.next();
  }

  // Investor login page
  if (pathname === "/investor/login") {
    if (role === "INVESTOR") {
      return NextResponse.redirect(new URL("/investor/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Protected investor routes
  if (pathname.startsWith("/investor")) {
    if (role !== "INVESTOR") {
      return NextResponse.redirect(new URL("/investor/login", req.url));
    }
    return NextResponse.next();
  }

  // Protected admin routes
  if (pathname.startsWith("/admin")) {
    if (role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.next();
  }

  // Protected branch routes - /branch/[slug]/*
  const branchMatch = pathname.match(/^\/branch\/([^/]+)\//);
  if (branchMatch) {
    if (role !== "BRANCH_ADMIN") {
      const slug = branchMatch[1];
      return NextResponse.redirect(
        new URL(`/branch/${slug}/login`, req.url)
      );
    }
    // Ensure branch admin can only access their own branch
    const requestedSlug = branchMatch[1];
    if (branchSlug !== requestedSlug) {
      return NextResponse.redirect(
        new URL(`/branch/${branchSlug}/dashboard`, req.url)
      );
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
