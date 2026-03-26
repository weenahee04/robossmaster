import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock next-auth/jwt
const mockGetToken = vi.fn();
vi.mock("next-auth/jwt", () => ({
  getToken: (...args: any[]) => mockGetToken(...args),
}));

import { middleware } from "@/middleware";

function makeReq(path: string): NextRequest {
  return new NextRequest(new URL(path, "http://localhost:3000"));
}

describe("Middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetToken.mockResolvedValue(null); // default: no auth
  });

  // ── Public routes ──
  describe("Public routes", () => {
    const publicPaths = [
      "/",
      "/api/auth/callback",
      "/api/auth/csrf",
      "/api/debug",
      "/api/loyalty/customers",
      "/api/loyalty/line/login",
      "/loyalty/mybranch/login",
      "/loyalty/mybranch",
      "/_next/static/chunk.js",
      "/favicon.ico",
    ];

    publicPaths.forEach((path) => {
      it(`passes through ${path}`, async () => {
        const res = await middleware(makeReq(path));
        // Should not redirect — status undefined or 200 means pass-through
        expect(res.status).not.toBe(307);
        expect(res.status).not.toBe(308);
      });
    });
  });

  // ── Admin routes ──
  describe("Admin routes", () => {
    it("redirects unauthenticated user to /admin/login", async () => {
      const res = await middleware(makeReq("/admin/dashboard"));
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toContain("/admin/login");
    });

    it("allows SUPER_ADMIN to access /admin/dashboard", async () => {
      mockGetToken.mockResolvedValue({ role: "SUPER_ADMIN" });
      const res = await middleware(makeReq("/admin/dashboard"));
      expect(res.status).not.toBe(307);
    });

    it("redirects BRANCH_ADMIN from /admin to /admin/login", async () => {
      mockGetToken.mockResolvedValue({ role: "BRANCH_ADMIN", branchSlug: "branch1" });
      const res = await middleware(makeReq("/admin/dashboard"));
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toContain("/admin/login");
    });

    it("redirects SUPER_ADMIN from /admin/login to /admin/dashboard", async () => {
      mockGetToken.mockResolvedValue({ role: "SUPER_ADMIN" });
      const res = await middleware(makeReq("/admin/login"));
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toContain("/admin/dashboard");
    });

    it("allows unauthenticated user to view /admin/login", async () => {
      const res = await middleware(makeReq("/admin/login"));
      expect(res.status).not.toBe(307);
    });
  });

  // ── Branch routes ──
  describe("Branch routes", () => {
    it("redirects unauthenticated user to branch login", async () => {
      const res = await middleware(makeReq("/branch/test-branch/dashboard"));
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toContain("/branch/test-branch/login");
    });

    it("allows BRANCH_ADMIN to access their own branch", async () => {
      mockGetToken.mockResolvedValue({ role: "BRANCH_ADMIN", branchSlug: "mybranch" });
      const res = await middleware(makeReq("/branch/mybranch/dashboard"));
      expect(res.status).not.toBe(307);
    });

    it("redirects BRANCH_ADMIN to own branch if accessing different branch", async () => {
      mockGetToken.mockResolvedValue({ role: "BRANCH_ADMIN", branchSlug: "mybranch" });
      const res = await middleware(makeReq("/branch/otherbranch/dashboard"));
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toContain("/branch/mybranch/dashboard");
    });

    it("redirects BRANCH_ADMIN from branch login to their dashboard", async () => {
      mockGetToken.mockResolvedValue({ role: "BRANCH_ADMIN", branchSlug: "mybranch" });
      const res = await middleware(makeReq("/branch/mybranch/login"));
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toContain("/branch/mybranch/dashboard");
    });

    it("allows unauthenticated user to view branch login page", async () => {
      const res = await middleware(makeReq("/branch/test-branch/login"));
      expect(res.status).not.toBe(307);
    });
  });

  // ── Investor routes ──
  describe("Investor routes", () => {
    it("redirects unauthenticated user to /investor/login", async () => {
      const res = await middleware(makeReq("/investor/dashboard"));
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toContain("/investor/login");
    });

    it("allows INVESTOR to access /investor/dashboard", async () => {
      mockGetToken.mockResolvedValue({ role: "INVESTOR" });
      const res = await middleware(makeReq("/investor/dashboard"));
      expect(res.status).not.toBe(307);
    });

    it("redirects SUPER_ADMIN from /investor to /investor/login", async () => {
      mockGetToken.mockResolvedValue({ role: "SUPER_ADMIN" });
      const res = await middleware(makeReq("/investor/dashboard"));
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toContain("/investor/login");
    });

    it("redirects INVESTOR from /investor/login to /investor/dashboard", async () => {
      mockGetToken.mockResolvedValue({ role: "INVESTOR" });
      const res = await middleware(makeReq("/investor/login"));
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toContain("/investor/dashboard");
    });

    it("allows unauthenticated user to view /investor/login", async () => {
      const res = await middleware(makeReq("/investor/login"));
      expect(res.status).not.toBe(307);
    });
  });

  // ── Other routes ──
  describe("Other routes", () => {
    it("passes through unknown routes when not authenticated", async () => {
      const res = await middleware(makeReq("/some/random/page"));
      // The middleware falls through to NextResponse.next()
      expect(res.status).not.toBe(307);
    });
  });
});
