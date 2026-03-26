import { describe, it, expect, vi, beforeEach } from "vitest";
import { makeRequest } from "../helpers";

vi.mock("@/lib/prisma", () => ({
  default: {
    couponTemplate: { findMany: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
  },
}));

import { GET, POST, PATCH, DELETE } from "@/app/api/admin/loyalty-coupons/route";
import prisma from "@/lib/prisma";

describe("Admin Loyalty Coupons API", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("GET returns coupon templates", async () => {
    vi.mocked(prisma.couponTemplate.findMany).mockResolvedValue([{ id: "ct1", name: "Free Wash" }] as any);
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toHaveLength(1);
  });

  it("POST creates coupon template", async () => {
    vi.mocked(prisma.couponTemplate.create).mockResolvedValue({ id: "ct2" } as any);
    const res = await POST(makeRequest("http://localhost:3000/api/admin/loyalty-coupons", {
      method: "POST",
      body: JSON.stringify({ name: "10% Off", type: "PERCENT", value: "10", pointsCost: "50" }),
    }));
    expect(res.status).toBe(200);
    expect(prisma.couponTemplate.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ name: "10% Off", type: "PERCENT", value: 10, pointsCost: 50 }),
    });
  });

  it("POST returns 400 when required fields missing", async () => {
    const res = await POST(makeRequest("http://localhost:3000/api/admin/loyalty-coupons", {
      method: "POST", body: JSON.stringify({ name: "Missing" }),
    }));
    expect(res.status).toBe(400);
  });

  it("PATCH updates coupon template", async () => {
    vi.mocked(prisma.couponTemplate.update).mockResolvedValue({ id: "ct1" } as any);
    const res = await PATCH(makeRequest("http://localhost:3000/api/admin/loyalty-coupons", {
      method: "PATCH", body: JSON.stringify({ id: "ct1", name: "Updated", isActive: false }),
    }));
    expect(res.status).toBe(200);
  });

  it("PATCH returns 400 when id missing", async () => {
    const res = await PATCH(makeRequest("http://localhost:3000/api/admin/loyalty-coupons", {
      method: "PATCH", body: JSON.stringify({ name: "No ID" }),
    }));
    expect(res.status).toBe(400);
  });

  it("DELETE removes coupon template", async () => {
    vi.mocked(prisma.couponTemplate.delete).mockResolvedValue({} as any);
    const res = await DELETE(makeRequest("http://localhost:3000/api/admin/loyalty-coupons?id=ct1", { method: "DELETE" }));
    expect((await res.json()).success).toBe(true);
  });

  it("DELETE returns 400 when id missing", async () => {
    const res = await DELETE(makeRequest("http://localhost:3000/api/admin/loyalty-coupons", { method: "DELETE" }));
    expect(res.status).toBe(400);
  });
});
