import { describe, it, expect, vi, beforeEach } from "vitest";
import { makeRequest } from "../helpers";

vi.mock("@/lib/prisma", () => ({
  default: {
    loyaltyBanner: { findMany: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
  },
}));

vi.mock("@/lib/api-auth", () => ({ requireAuth: vi.fn() }));

import { GET, POST, PATCH, DELETE } from "@/app/api/branch/loyalty-banners/route";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

describe("Branch Loyalty Banners API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireAuth).mockResolvedValue(null);
  });

  it("GET returns banners for branch", async () => {
    vi.mocked(prisma.loyaltyBanner.findMany).mockResolvedValue([{ id: "lb1" }] as any);
    const res = await GET(makeRequest("http://localhost:3000/api/branch/loyalty-banners?branchId=b1"));
    expect(res.status).toBe(200);
    expect(await res.json()).toHaveLength(1);
  });

  it("GET returns 400 when branchId missing", async () => {
    const res = await GET(makeRequest("http://localhost:3000/api/branch/loyalty-banners"));
    expect(res.status).toBe(400);
  });

  it("POST creates loyalty banner", async () => {
    vi.mocked(prisma.loyaltyBanner.create).mockResolvedValue({ id: "lb2" } as any);
    const res = await POST(makeRequest("http://localhost:3000/api/branch/loyalty-banners", {
      method: "POST",
      body: JSON.stringify({ branchId: "b1", title: "Sale", imageUrl: "https://img.com/1.jpg" }),
    }));
    expect(res.status).toBe(200);
  });

  it("POST returns 400 when required fields missing", async () => {
    const res = await POST(makeRequest("http://localhost:3000/api/branch/loyalty-banners", {
      method: "POST", body: JSON.stringify({ branchId: "b1" }),
    }));
    expect(res.status).toBe(400);
  });

  it("PATCH updates loyalty banner", async () => {
    vi.mocked(prisma.loyaltyBanner.update).mockResolvedValue({ id: "lb1" } as any);
    const res = await PATCH(makeRequest("http://localhost:3000/api/branch/loyalty-banners", {
      method: "PATCH", body: JSON.stringify({ id: "lb1", title: "Updated" }),
    }));
    expect(res.status).toBe(200);
  });

  it("PATCH returns 400 when id missing", async () => {
    const res = await PATCH(makeRequest("http://localhost:3000/api/branch/loyalty-banners", {
      method: "PATCH", body: JSON.stringify({ title: "No ID" }),
    }));
    expect(res.status).toBe(400);
  });

  it("DELETE removes loyalty banner", async () => {
    vi.mocked(prisma.loyaltyBanner.delete).mockResolvedValue({} as any);
    const res = await DELETE(makeRequest("http://localhost:3000/api/branch/loyalty-banners?id=lb1", { method: "DELETE" }));
    expect((await res.json()).success).toBe(true);
  });

  it("DELETE returns 400 when id missing", async () => {
    const res = await DELETE(makeRequest("http://localhost:3000/api/branch/loyalty-banners", { method: "DELETE" }));
    expect(res.status).toBe(400);
  });
});
