import { describe, it, expect, vi, beforeEach } from "vitest";
import { makeRequest } from "../helpers";

vi.mock("@/lib/prisma", () => ({
  default: {
    globalWashPackage: { findMany: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
  },
}));

vi.mock("@/lib/api-auth", () => ({ requireAdmin: vi.fn() }));

import { GET, POST, PATCH, DELETE } from "@/app/api/admin/wash-packages/route";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

describe("Admin Wash Packages API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireAdmin).mockResolvedValue(null);
  });

  it("GET returns packages", async () => {
    vi.mocked(prisma.globalWashPackage.findMany).mockResolvedValue([{ id: "p1", name: "Basic" }] as any);
    const res = await GET(makeRequest("http://localhost:3000/api/admin/wash-packages"));
    expect(res.status).toBe(200);
    expect(await res.json()).toHaveLength(1);
  });

  it("POST creates package", async () => {
    vi.mocked(prisma.globalWashPackage.create).mockResolvedValue({ id: "p2", name: "Premium", price: 199 } as any);
    const res = await POST(makeRequest("http://localhost:3000/api/admin/wash-packages", {
      method: "POST", body: JSON.stringify({ name: "Premium", type: "CAR", price: "199" }),
    }));
    expect(res.status).toBe(200);
    expect(prisma.globalWashPackage.create).toHaveBeenCalledWith({
      data: { name: "Premium", type: "CAR", price: 199 },
    });
  });

  it("PATCH updates package", async () => {
    vi.mocked(prisma.globalWashPackage.update).mockResolvedValue({ id: "p1" } as any);
    const res = await PATCH(makeRequest("http://localhost:3000/api/admin/wash-packages", {
      method: "PATCH", body: JSON.stringify({ id: "p1", name: "Updated", price: "250", isActive: false }),
    }));
    expect(res.status).toBe(200);
  });

  it("DELETE removes package", async () => {
    vi.mocked(prisma.globalWashPackage.delete).mockResolvedValue({} as any);
    const res = await DELETE(makeRequest("http://localhost:3000/api/admin/wash-packages?id=p1", { method: "DELETE" }));
    expect((await res.json()).success).toBe(true);
  });

  it("DELETE returns 400 when id missing", async () => {
    const res = await DELETE(makeRequest("http://localhost:3000/api/admin/wash-packages", { method: "DELETE" }));
    expect(res.status).toBe(400);
  });
});
