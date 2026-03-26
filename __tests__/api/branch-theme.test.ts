import { describe, it, expect, vi, beforeEach } from "vitest";
import { makeRequest } from "../helpers";

vi.mock("@/lib/prisma", () => ({
  default: {
    branchTheme: { findUnique: vi.fn(), upsert: vi.fn(), deleteMany: vi.fn() },
  },
}));

vi.mock("@/lib/api-auth", () => ({ requireAuth: vi.fn() }));

import { GET, PATCH, DELETE } from "@/app/api/branch/theme/route";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

describe("Branch Theme API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireAuth).mockResolvedValue(null);
  });

  it("GET returns theme for branch", async () => {
    vi.mocked(prisma.branchTheme.findUnique).mockResolvedValue({ branchId: "b1", primaryColor: "#FF0000" } as any);
    const res = await GET(makeRequest("http://localhost:3000/api/branch/theme?branchId=b1"));
    expect(res.status).toBe(200);
    expect((await res.json()).primaryColor).toBe("#FF0000");
  });

  it("GET returns 400 when branchId missing", async () => {
    const res = await GET(makeRequest("http://localhost:3000/api/branch/theme"));
    expect(res.status).toBe(400);
  });

  it("PATCH upserts theme", async () => {
    vi.mocked(prisma.branchTheme.upsert).mockResolvedValue({ branchId: "b1" } as any);
    const res = await PATCH(makeRequest("http://localhost:3000/api/branch/theme", {
      method: "PATCH", body: JSON.stringify({ branchId: "b1", primaryColor: "#00FF00" }),
    }));
    expect(res.status).toBe(200);
    expect(prisma.branchTheme.upsert).toHaveBeenCalledWith({
      where: { branchId: "b1" },
      update: { primaryColor: "#00FF00" },
      create: { branchId: "b1", primaryColor: "#00FF00" },
    });
  });

  it("PATCH returns 400 when branchId missing", async () => {
    const res = await PATCH(makeRequest("http://localhost:3000/api/branch/theme", {
      method: "PATCH", body: JSON.stringify({ primaryColor: "#00FF00" }),
    }));
    expect(res.status).toBe(400);
  });

  it("DELETE resets theme", async () => {
    vi.mocked(prisma.branchTheme.deleteMany).mockResolvedValue({ count: 1 } as any);
    const res = await DELETE(makeRequest("http://localhost:3000/api/branch/theme?branchId=b1", { method: "DELETE" }));
    expect((await res.json()).success).toBe(true);
  });

  it("DELETE returns 400 when branchId missing", async () => {
    const res = await DELETE(makeRequest("http://localhost:3000/api/branch/theme", { method: "DELETE" }));
    expect(res.status).toBe(400);
  });
});
