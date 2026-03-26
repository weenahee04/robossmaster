import { describe, it, expect, vi, beforeEach } from "vitest";
import { makeRequest } from "../helpers";

vi.mock("@/lib/prisma", () => ({
  default: {
    branch: { count: vi.fn(), findMany: vi.fn() },
    income: { aggregate: vi.fn() },
    expense: { aggregate: vi.fn() },
    employee: { count: vi.fn() },
  },
}));

vi.mock("@/lib/api-auth", () => ({ requireAdmin: vi.fn() }));

import { GET } from "@/app/api/admin/dashboard/route";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

describe("Admin Dashboard API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireAdmin).mockResolvedValue(null);
    vi.mocked(prisma.branch.count).mockResolvedValue(5);
    vi.mocked(prisma.income.aggregate).mockResolvedValue({ _sum: { amount: 10000 } } as any);
    vi.mocked(prisma.expense.aggregate).mockResolvedValue({ _sum: { amount: 3000 } } as any);
    vi.mocked(prisma.employee.count).mockResolvedValue(10);
    vi.mocked(prisma.branch.findMany).mockResolvedValue([]);
  });

  it("returns dashboard stats", async () => {
    const res = await GET(makeRequest("http://localhost:3000/api/admin/dashboard"));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.totalBranches).toBe(5);
    expect(data.totalEmployees).toBe(10);
    expect(data.monthlyData).toBeDefined();
  });

  it("returns 401 when unauthorized", async () => {
    const { NextResponse } = await import("next/server");
    vi.mocked(requireAdmin).mockResolvedValue(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));

    const res = await GET(makeRequest("http://localhost:3000/api/admin/dashboard"));
    expect(res.status).toBe(401);
  });

  it("returns 500 on error", async () => {
    vi.mocked(prisma.branch.count).mockRejectedValue(new Error("fail"));
    const res = await GET(makeRequest("http://localhost:3000/api/admin/dashboard"));
    expect(res.status).toBe(500);
  });
});
