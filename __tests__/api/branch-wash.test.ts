import { describe, it, expect, vi, beforeEach } from "vitest";
import { makeRequest } from "../helpers";

vi.mock("@/lib/prisma", () => ({
  default: {
    washRecord: { findMany: vi.fn(), create: vi.fn() },
    globalWashPackage: { findMany: vi.fn() },
    washPackage: { findMany: vi.fn() },
  },
}));

vi.mock("@/lib/api-auth", () => ({ requireAuth: vi.fn() }));

import { GET, POST } from "@/app/api/branch/wash/route";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

describe("Branch Wash API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireAuth).mockResolvedValue(null);
  });

  it("GET returns records, packages, and stats", async () => {
    vi.mocked(prisma.washRecord.findMany).mockResolvedValue([]);
    vi.mocked(prisma.globalWashPackage.findMany).mockResolvedValue([{ id: "g1", name: "Basic" }] as any);
    vi.mocked(prisma.washPackage.findMany).mockResolvedValue([]);

    const res = await GET(makeRequest("http://localhost:3000/api/branch/wash?branchId=b1"));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.packages).toHaveLength(1);
    expect(data.todayCount).toBeDefined();
    expect(data.monthCount).toBeDefined();
  });

  it("GET returns 400 when branchId missing", async () => {
    const res = await GET(makeRequest("http://localhost:3000/api/branch/wash"));
    expect(res.status).toBe(400);
  });

  it("POST creates wash record", async () => {
    vi.mocked(prisma.washRecord.create).mockResolvedValue({ id: "w1" } as any);

    const res = await POST(makeRequest("http://localhost:3000/api/branch/wash", {
      method: "POST",
      body: JSON.stringify({
        branchId: "b1", packageId: "g1", vehicleType: "CAR",
        amount: "199", note: "Sedan", createdById: "u1", packageName: "Basic",
      }),
    }));
    expect(res.status).toBe(200);
    expect(prisma.washRecord.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ branchId: "b1", vehicleType: "CAR", amount: 199 }),
    });
  });
});
