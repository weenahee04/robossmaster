import { describe, it, expect, vi, beforeEach } from "vitest";
import { makeRequest } from "../helpers";

vi.mock("@/lib/prisma", () => ({
  default: {
    loyaltyConfig: { findFirst: vi.fn(), create: vi.fn(), update: vi.fn() },
    loyaltyAppConfig: { findFirst: vi.fn(), create: vi.fn(), update: vi.fn() },
  },
}));

import { GET, POST } from "@/app/api/admin/loyalty-config/route";
import prisma from "@/lib/prisma";

describe("Admin Loyalty Config API", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("GET returns config and appConfig", async () => {
    vi.mocked(prisma.loyaltyConfig.findFirst).mockResolvedValue({ id: "lc1", pointsPerBaht: 10 } as any);
    vi.mocked(prisma.loyaltyAppConfig.findFirst).mockResolvedValue({ id: "ac1", heroTitle: "Welcome" } as any);

    const res = await GET();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.config.pointsPerBaht).toBe(10);
    expect(data.appConfig.heroTitle).toBe("Welcome");
  });

  it("POST updates existing loyalty config", async () => {
    vi.mocked(prisma.loyaltyConfig.findFirst).mockResolvedValue({ id: "lc1" } as any);
    vi.mocked(prisma.loyaltyConfig.update).mockResolvedValue({} as any);

    const res = await POST(makeRequest("http://localhost:3000/api/admin/loyalty-config", {
      method: "POST", body: JSON.stringify({ pointsPerBaht: "15", stampsForFreeWash: "8" }),
    }));
    expect(res.status).toBe(200);
    expect(prisma.loyaltyConfig.update).toHaveBeenCalled();
  });

  it("POST creates loyalty config if none exists", async () => {
    vi.mocked(prisma.loyaltyConfig.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.loyaltyConfig.create).mockResolvedValue({} as any);

    const res = await POST(makeRequest("http://localhost:3000/api/admin/loyalty-config", {
      method: "POST", body: JSON.stringify({ pointsPerBaht: "10" }),
    }));
    expect(res.status).toBe(200);
    expect(prisma.loyaltyConfig.create).toHaveBeenCalled();
  });

  it("POST upserts app config when hero fields provided", async () => {
    vi.mocked(prisma.loyaltyConfig.findFirst).mockResolvedValue({ id: "lc1" } as any);
    vi.mocked(prisma.loyaltyConfig.update).mockResolvedValue({} as any);
    vi.mocked(prisma.loyaltyAppConfig.findFirst).mockResolvedValue({ id: "ac1" } as any);
    vi.mocked(prisma.loyaltyAppConfig.update).mockResolvedValue({} as any);

    const res = await POST(makeRequest("http://localhost:3000/api/admin/loyalty-config", {
      method: "POST", body: JSON.stringify({ heroTitle: "New Hero" }),
    }));
    expect(res.status).toBe(200);
    expect(prisma.loyaltyAppConfig.update).toHaveBeenCalled();
  });

  it("returns 500 on error", async () => {
    vi.mocked(prisma.loyaltyConfig.findFirst).mockRejectedValue(new Error("fail"));
    const res = await GET();
    expect(res.status).toBe(500);
  });
});
