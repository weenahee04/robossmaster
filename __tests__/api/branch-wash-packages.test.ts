import { describe, it, expect, vi, beforeEach } from "vitest";
import { makeRequest } from "../helpers";

vi.mock("@/lib/prisma", () => ({
  default: {
    washPackage: { findMany: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
  },
}));

vi.mock("@/lib/api-auth", () => ({ requireAuth: vi.fn() }));

import { GET, POST, PATCH, DELETE } from "@/app/api/branch/wash-packages/route";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

describe("Branch Wash Packages API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireAuth).mockResolvedValue(null);
  });

  it("GET returns branch packages", async () => {
    vi.mocked(prisma.washPackage.findMany).mockResolvedValue([{ id: "wp1" }] as any);
    const res = await GET(makeRequest("http://localhost:3000/api/branch/wash-packages?branchId=b1"));
    expect(res.status).toBe(200);
    expect(await res.json()).toHaveLength(1);
  });

  it("GET returns 400 when branchId missing", async () => {
    const res = await GET(makeRequest("http://localhost:3000/api/branch/wash-packages"));
    expect(res.status).toBe(400);
  });

  it("POST creates branch wash package", async () => {
    vi.mocked(prisma.washPackage.create).mockResolvedValue({ id: "wp2" } as any);
    const res = await POST(makeRequest("http://localhost:3000/api/branch/wash-packages", {
      method: "POST",
      body: JSON.stringify({ branchId: "b1", name: "Deluxe", type: "CAR", price: "299" }),
    }));
    expect(res.status).toBe(200);
    expect(prisma.washPackage.create).toHaveBeenCalledWith({
      data: { branchId: "b1", name: "Deluxe", type: "CAR", price: 299 },
    });
  });

  it("POST returns 400 when required fields missing", async () => {
    const res = await POST(makeRequest("http://localhost:3000/api/branch/wash-packages", {
      method: "POST", body: JSON.stringify({ branchId: "b1" }),
    }));
    expect(res.status).toBe(400);
  });

  it("PATCH updates package", async () => {
    vi.mocked(prisma.washPackage.update).mockResolvedValue({ id: "wp1" } as any);
    const res = await PATCH(makeRequest("http://localhost:3000/api/branch/wash-packages", {
      method: "PATCH", body: JSON.stringify({ id: "wp1", name: "Updated", price: "350" }),
    }));
    expect(res.status).toBe(200);
  });

  it("PATCH returns 400 when id missing", async () => {
    const res = await PATCH(makeRequest("http://localhost:3000/api/branch/wash-packages", {
      method: "PATCH", body: JSON.stringify({ name: "No ID" }),
    }));
    expect(res.status).toBe(400);
  });

  it("DELETE removes package", async () => {
    vi.mocked(prisma.washPackage.delete).mockResolvedValue({} as any);
    const res = await DELETE(makeRequest("http://localhost:3000/api/branch/wash-packages?id=wp1", { method: "DELETE" }));
    expect((await res.json()).success).toBe(true);
  });

  it("DELETE returns 400 when id missing", async () => {
    const res = await DELETE(makeRequest("http://localhost:3000/api/branch/wash-packages", { method: "DELETE" }));
    expect(res.status).toBe(400);
  });
});
