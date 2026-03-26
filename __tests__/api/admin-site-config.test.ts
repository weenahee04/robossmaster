import { describe, it, expect, vi, beforeEach } from "vitest";
import { makeRequest } from "../helpers";

vi.mock("@/lib/prisma", () => ({
  default: {
    siteConfig: { findFirst: vi.fn(), create: vi.fn(), update: vi.fn() },
  },
}));

vi.mock("@/lib/api-auth", () => ({ requireAdmin: vi.fn() }));

import { GET, PATCH } from "@/app/api/admin/site-config/route";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

describe("Admin Site Config API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireAdmin).mockResolvedValue(null);
  });

  it("GET returns existing config", async () => {
    vi.mocked(prisma.siteConfig.findFirst).mockResolvedValue({ id: "s1", brandName: "Roboss" } as any);
    const res = await GET(makeRequest("http://localhost:3000/api/admin/site-config"));
    expect(res.status).toBe(200);
    expect((await res.json()).brandName).toBe("Roboss");
  });

  it("GET creates default config if none exists", async () => {
    vi.mocked(prisma.siteConfig.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.siteConfig.create).mockResolvedValue({ id: "s1", brandName: "Roboss" } as any);
    const res = await GET(makeRequest("http://localhost:3000/api/admin/site-config"));
    expect(res.status).toBe(200);
    expect(prisma.siteConfig.create).toHaveBeenCalledWith({ data: { brandName: "Roboss" } });
  });

  it("PATCH updates brand name and logo", async () => {
    vi.mocked(prisma.siteConfig.findFirst).mockResolvedValue({ id: "s1" } as any);
    vi.mocked(prisma.siteConfig.update).mockResolvedValue({ id: "s1", brandName: "NewBrand" } as any);

    const res = await PATCH(makeRequest("http://localhost:3000/api/admin/site-config", {
      method: "PATCH", body: JSON.stringify({ brandName: "NewBrand", logoUrl: "https://img.com/logo.png" }),
    }));
    expect(res.status).toBe(200);
    expect(prisma.siteConfig.update).toHaveBeenCalledWith({
      where: { id: "s1" },
      data: expect.objectContaining({ brandName: "NewBrand", logoUrl: "https://img.com/logo.png" }),
    });
  });
});
