import { describe, it, expect, vi, beforeEach } from "vitest";
import { makeRequest } from "../helpers";

vi.mock("@/lib/prisma", () => ({
  default: {
    income: { aggregate: vi.fn(), findMany: vi.fn() },
    expense: { aggregate: vi.fn(), findMany: vi.fn() },
    employee: { count: vi.fn() },
    washRecord: { findMany: vi.fn() },
  },
}));

vi.mock("@/lib/api-auth", () => ({ requireAuth: vi.fn() }));

import { GET } from "@/app/api/branch/dashboard/route";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

describe("Branch Dashboard API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireAuth).mockResolvedValue(null);
    vi.mocked(prisma.income.aggregate).mockResolvedValue({ _sum: { amount: 5000 } } as any);
    vi.mocked(prisma.expense.aggregate).mockResolvedValue({ _sum: { amount: 2000 } } as any);
    vi.mocked(prisma.employee.count).mockResolvedValue(3);
    vi.mocked(prisma.income.findMany).mockResolvedValue([]);
    vi.mocked(prisma.expense.findMany).mockResolvedValue([]);
    vi.mocked(prisma.washRecord.findMany).mockResolvedValue([]);
  });

  it("returns dashboard data for branch", async () => {
    const res = await GET(makeRequest("http://localhost:3000/api/branch/dashboard?branchId=b1"));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.totalEmployees).toBe(3);
    expect(data.weeklyData).toBeDefined();
    expect(data.todayWash).toBeDefined();
  });

  it("returns 400 when branchId missing", async () => {
    const res = await GET(makeRequest("http://localhost:3000/api/branch/dashboard"));
    expect(res.status).toBe(400);
  });

  it("returns 401 when unauthorized", async () => {
    const { NextResponse } = await import("next/server");
    vi.mocked(requireAuth).mockResolvedValue(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
    const res = await GET(makeRequest("http://localhost:3000/api/branch/dashboard?branchId=b1"));
    expect(res.status).toBe(401);
  });

  it("returns 500 on error", async () => {
    vi.mocked(prisma.income.aggregate).mockRejectedValue(new Error("fail"));
    const res = await GET(makeRequest("http://localhost:3000/api/branch/dashboard?branchId=b1"));
    expect(res.status).toBe(500);
  });
});
