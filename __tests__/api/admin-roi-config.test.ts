import { describe, it, expect, vi, beforeEach } from "vitest";
import { makeRequest } from "../helpers";

vi.mock("@/lib/prisma", () => ({
  default: {
    roiConfig: { findFirst: vi.fn(), create: vi.fn(), update: vi.fn() },
  },
}));

vi.mock("@/lib/api-auth", () => ({ requireAdmin: vi.fn() }));

import { GET, PATCH } from "@/app/api/admin/roi-config/route";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

describe("Admin ROI Config API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireAdmin).mockResolvedValue(null);
  });

  it("GET returns existing config", async () => {
    vi.mocked(prisma.roiConfig.findFirst).mockResolvedValue({ id: "rc1", depreciationRate: 10 } as any);
    const res = await GET(makeRequest("http://localhost:3000/api/admin/roi-config"));
    expect(res.status).toBe(200);
    expect((await res.json()).depreciationRate).toBe(10);
  });

  it("GET creates default config if none exists", async () => {
    vi.mocked(prisma.roiConfig.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.roiConfig.create).mockResolvedValue({ id: "rc1" } as any);
    const res = await GET(makeRequest("http://localhost:3000/api/admin/roi-config"));
    expect(res.status).toBe(200);
    expect(prisma.roiConfig.create).toHaveBeenCalledWith({ data: {} });
  });

  it("PATCH updates existing config", async () => {
    vi.mocked(prisma.roiConfig.findFirst).mockResolvedValue({ id: "rc1" } as any);
    vi.mocked(prisma.roiConfig.update).mockResolvedValue({ id: "rc1", depreciationRate: 15 } as any);

    const res = await PATCH(makeRequest("http://localhost:3000/api/admin/roi-config", {
      method: "PATCH", body: JSON.stringify({ depreciationRate: 15, adminFeePercent: 5 }),
    }));
    expect(res.status).toBe(200);
    expect(prisma.roiConfig.update).toHaveBeenCalled();
  });

  it("PATCH creates config if none exists", async () => {
    vi.mocked(prisma.roiConfig.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.roiConfig.create).mockResolvedValue({ id: "rc1" } as any);

    const res = await PATCH(makeRequest("http://localhost:3000/api/admin/roi-config", {
      method: "PATCH", body: JSON.stringify({ depreciationRate: 10 }),
    }));
    expect(res.status).toBe(200);
    expect(prisma.roiConfig.create).toHaveBeenCalled();
  });
});
