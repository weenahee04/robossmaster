import { describe, it, expect, vi, beforeEach } from "vitest";
import { makeRequest } from "../helpers";

// Mock prisma
vi.mock("@/lib/prisma", () => ({
  default: {
    branch: { findUnique: vi.fn() },
    customer: { create: vi.fn(), update: vi.fn() },
    customerLineAccount: { findUnique: vi.fn(), findFirst: vi.fn(), create: vi.fn() },
    customerPoint: { upsert: vi.fn() },
  },
}));

vi.mock("@/lib/encryption", () => ({
  decrypt: vi.fn((text: string) => text.startsWith("encrypted:") ? text.replace("encrypted:", "") : text),
}));

vi.mock("@/lib/api-auth", () => ({
  requireAdmin: vi.fn(),
}));

import prisma from "@/lib/prisma";

describe("LINE Login API - /api/loyalty/line/login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to LINE OAuth with correct params", async () => {
    vi.mocked(prisma.branch.findUnique).mockResolvedValue({
      lineChannelId: "channel-123",
      isActive: true,
    } as any);

    // Import dynamically to get fresh module
    const { GET } = await import("@/app/api/loyalty/line/login/route");
    const req = makeRequest("http://localhost:3000/api/loyalty/line/login?branch=test-branch");
    const res = await GET(req);

    expect(res.status).toBe(307); // redirect
    const location = res.headers.get("location") || "";
    expect(location).toContain("access.line.me/oauth2/v2.1/authorize");
    expect(location).toContain("client_id=channel-123");
    expect(location).toContain("state=test-branch%3A"); // branchSlug:nonce
    expect(location).toContain("scope=profile+openid");
  });

  it("sets nonce cookie on redirect", async () => {
    vi.mocked(prisma.branch.findUnique).mockResolvedValue({
      lineChannelId: "channel-123",
      isActive: true,
    } as any);

    const { GET } = await import("@/app/api/loyalty/line/login/route");
    const req = makeRequest("http://localhost:3000/api/loyalty/line/login?branch=test-branch");
    const res = await GET(req);

    const setCookie = res.headers.getSetCookie?.() || [];
    const nonceCookie = setCookie.find((c: string) => c.includes("line_oauth_nonce"));
    expect(nonceCookie).toBeDefined();
    expect(nonceCookie).toContain("HttpOnly");
    expect(nonceCookie).toContain("Max-Age=300");
  });

  it("returns 400 when branch param is missing", async () => {
    const { GET } = await import("@/app/api/loyalty/line/login/route");
    const req = makeRequest("http://localhost:3000/api/loyalty/line/login");
    const res = await GET(req);

    expect(res.status).toBe(400);
  });

  it("returns 404 when branch not found or inactive", async () => {
    vi.mocked(prisma.branch.findUnique).mockResolvedValue(null);

    const { GET } = await import("@/app/api/loyalty/line/login/route");
    const req = makeRequest("http://localhost:3000/api/loyalty/line/login?branch=nonexistent");
    const res = await GET(req);

    expect(res.status).toBe(404);
  });

  it("returns 400 when LINE not configured", async () => {
    vi.mocked(prisma.branch.findUnique).mockResolvedValue({
      lineChannelId: null,
      isActive: true,
    } as any);

    const { GET } = await import("@/app/api/loyalty/line/login/route");
    const req = makeRequest("http://localhost:3000/api/loyalty/line/login?branch=no-line");
    const res = await GET(req);

    expect(res.status).toBe(400);
  });
});

describe("LINE Callback API - /api/loyalty/line/callback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock global fetch for LINE API calls
    vi.stubGlobal("fetch", vi.fn());
  });

  it("redirects with error when nonce mismatch", async () => {
    const { GET } = await import("@/app/api/loyalty/line/callback/route");
    const req = makeRequest(
      "http://localhost:3000/api/loyalty/line/callback?code=abc&state=mybranch:wrong-nonce",
      { cookies: { line_oauth_nonce: "correct-nonce" } }
    );
    const res = await GET(req);

    expect(res.status).toBe(307);
    const location = res.headers.get("location") || "";
    expect(location).toContain("error=line_invalid_state");
  });

  it("redirects with error when code is missing", async () => {
    const { GET } = await import("@/app/api/loyalty/line/callback/route");
    const req = makeRequest("http://localhost:3000/api/loyalty/line/callback?state=mybranch:nonce");
    const res = await GET(req);

    expect(res.status).toBe(307);
    const location = res.headers.get("location") || "";
    expect(location).toContain("error=line_denied");
  });

  it("redirects with error when LINE returns error param", async () => {
    const { GET } = await import("@/app/api/loyalty/line/callback/route");
    const req = makeRequest(
      "http://localhost:3000/api/loyalty/line/callback?error=access_denied&state=mybranch:nonce"
    );
    const res = await GET(req);

    expect(res.status).toBe(307);
    const location = res.headers.get("location") || "";
    expect(location).toContain("login");
  });

  it("creates new customer and redirects on success", async () => {
    const nonce = "valid-nonce-123";
    vi.mocked(prisma.branch.findUnique).mockResolvedValue({
      id: "b1",
      slug: "testbranch",
      lineChannelId: "ch-id",
      lineChannelSecret: "ch-secret",
    } as any);
    vi.mocked(prisma.customerLineAccount.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.customerLineAccount.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.customer.create).mockResolvedValue({
      id: "c1",
      phone: "line_U123",
      name: "LINE User",
      lineId: "U123",
      profileImage: null,
    } as any);
    vi.mocked(prisma.customerPoint.upsert).mockResolvedValue({} as any);

    // Mock fetch: token exchange + profile
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: "at-123" }),
      } as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ userId: "U123", displayName: "LINE User", pictureUrl: null }),
      } as any);

    const { GET } = await import("@/app/api/loyalty/line/callback/route");
    const req = makeRequest(
      `http://localhost:3000/api/loyalty/line/callback?code=authcode&state=testbranch:${nonce}`,
      { cookies: { line_oauth_nonce: nonce } }
    );
    const res = await GET(req);

    expect(res.status).toBe(307);
    const location = res.headers.get("location") || "";
    expect(location).toContain("/loyalty/testbranch?lineLogin=1");
    expect(prisma.customer.create).toHaveBeenCalled();
    expect(prisma.customerPoint.upsert).toHaveBeenCalled();
  });

  it("reuses existing customer from another branch", async () => {
    const nonce = "nonce-reuse";
    vi.mocked(prisma.branch.findUnique).mockResolvedValue({
      id: "b2",
      slug: "branch2",
      lineChannelId: "ch2",
      lineChannelSecret: "secret2",
    } as any);
    vi.mocked(prisma.customerLineAccount.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.customerLineAccount.findFirst).mockResolvedValue({
      customer: { id: "existing-c1", phone: "line_U999", name: "Existing", lineId: "U999", profileImage: null },
    } as any);
    vi.mocked(prisma.customerLineAccount.create).mockResolvedValue({} as any);
    vi.mocked(prisma.customerPoint.upsert).mockResolvedValue({} as any);

    vi.mocked(fetch)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ access_token: "at-x" }) } as any)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ userId: "U999", displayName: "Existing", pictureUrl: null }) } as any);

    const { GET } = await import("@/app/api/loyalty/line/callback/route");
    const req = makeRequest(
      `http://localhost:3000/api/loyalty/line/callback?code=code2&state=branch2:${nonce}`,
      { cookies: { line_oauth_nonce: nonce } }
    );
    const res = await GET(req);

    expect(res.status).toBe(307);
    // Should create new mapping, not new customer
    expect(prisma.customerLineAccount.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ branchId: "b2", lineUserId: "U999" }),
    });
    expect(prisma.customer.create).not.toHaveBeenCalled();
  });
});

describe("LINE Verify API - /api/loyalty/line/verify", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("returns valid:true when credentials are correct", async () => {
    const { requireAdmin } = await import("@/lib/api-auth");
    vi.mocked(requireAdmin).mockResolvedValue(null);

    vi.mocked(fetch)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ access_token: "temp-token" }) } as any)
      .mockResolvedValueOnce({ ok: true } as any); // revoke

    const { POST } = await import("@/app/api/loyalty/line/verify/route");
    const req = makeRequest("http://localhost:3000/api/loyalty/line/verify", {
      method: "POST",
      body: JSON.stringify({ channelId: "ch1", channelSecret: "sec1" }),
    });
    const res = await POST(req);
    const data = await res.json();

    expect(data.valid).toBe(true);
  });

  it("returns valid:false when credentials are invalid", async () => {
    const { requireAdmin } = await import("@/lib/api-auth");
    vi.mocked(requireAdmin).mockResolvedValue(null);

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error_description: "Invalid client" }),
    } as any);

    const { POST } = await import("@/app/api/loyalty/line/verify/route");
    const req = makeRequest("http://localhost:3000/api/loyalty/line/verify", {
      method: "POST",
      body: JSON.stringify({ channelId: "bad", channelSecret: "bad" }),
    });
    const res = await POST(req);
    const data = await res.json();

    expect(data.valid).toBe(false);
    expect(data.error).toBe("Invalid client");
  });

  it("returns 400 when credentials missing", async () => {
    const { requireAdmin } = await import("@/lib/api-auth");
    vi.mocked(requireAdmin).mockResolvedValue(null);

    const { POST } = await import("@/app/api/loyalty/line/verify/route");
    const req = makeRequest("http://localhost:3000/api/loyalty/line/verify", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const res = await POST(req);

    expect(res.status).toBe(400);
  });
});
