import { describe, it, expect, vi, beforeEach } from "vitest";
import { makeRequest } from "../helpers";

vi.mock("@/lib/prisma", () => ({
  default: {
    income: { findMany: vi.fn() },
    expense: { findMany: vi.fn() },
    branch: { findMany: vi.fn() },
  },
}));

vi.mock("@/lib/api-auth", () => ({ requireAdmin: vi.fn() }));

import { GET } from "@/app/api/admin/finance/route";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

describe("Admin Finance API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireAdmin).mockResolvedValue(null);
  });

  it("returns incomes, expenses and profit", async () => {
    vi.mocked(prisma.income.findMany).mockResolvedValue([{ amount: 5000 }, { amount: 3000 }] as any);
    vi.mocked(prisma.expense.findMany).mockResolvedValue([{ amount: 2000 }] as any);
    vi.mocked(prisma.branch.findMany).mockResolvedValue([]);

    const res = await GET(makeRequest("http://localhost:3000/api/admin/finance"));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.totalIncome).toBe(8000);
    expect(data.totalExpense).toBe(2000);
    expect(data.profit).toBe(6000);
  });

  it("filters by branchId when provided", async () => {
    vi.mocked(prisma.income.findMany).mockResolvedValue([]);
    vi.mocked(prisma.expense.findMany).mockResolvedValue([]);
    vi.mocked(prisma.branch.findMany).mockResolvedValue([]);

    await GET(makeRequest("http://localhost:3000/api/admin/finance?branchId=b1"));

    expect(prisma.income.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { branchId: "b1" },
    }));
  });

  it("returns 401 when unauthorized", async () => {
    const { NextResponse } = await import("next/server");
    vi.mocked(requireAdmin).mockResolvedValue(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
    const res = await GET(makeRequest("http://localhost:3000/api/admin/finance"));
    expect(res.status).toBe(401);
  });

  it("returns 500 on error", async () => {
    vi.mocked(prisma.income.findMany).mockRejectedValue(new Error("fail"));
    const res = await GET(makeRequest("http://localhost:3000/api/admin/finance"));
    expect(res.status).toBe(500);
  });
});
