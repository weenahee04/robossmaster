import { describe, it, expect, vi, beforeEach } from "vitest";
import { makeRequest } from "../helpers";

vi.mock("@/lib/prisma", () => ({
  default: {
    income: { findMany: vi.fn(), create: vi.fn() },
    expense: { findMany: vi.fn(), create: vi.fn() },
    category: { findMany: vi.fn() },
  },
}));

vi.mock("@/lib/api-auth", () => ({ requireAuth: vi.fn() }));

import * as incomeRoute from "@/app/api/branch/income/route";
import * as expenseRoute from "@/app/api/branch/expense/route";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

describe("Branch Income API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireAuth).mockResolvedValue(null);
  });

  it("GET returns incomes and categories", async () => {
    vi.mocked(prisma.income.findMany).mockResolvedValue([{ id: "i1", amount: 500 }] as any);
    vi.mocked(prisma.category.findMany).mockResolvedValue([{ id: "c1", name: "Wash" }] as any);

    const res = await incomeRoute.GET(makeRequest("http://localhost:3000/api/branch/income?branchId=b1"));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.incomes).toHaveLength(1);
    expect(data.categories).toHaveLength(1);
  });

  it("GET returns 400 when branchId missing", async () => {
    const res = await incomeRoute.GET(makeRequest("http://localhost:3000/api/branch/income"));
    expect(res.status).toBe(400);
  });

  it("POST creates income record", async () => {
    vi.mocked(prisma.income.create).mockResolvedValue({ id: "i2", amount: 1000 } as any);
    const res = await incomeRoute.POST(makeRequest("http://localhost:3000/api/branch/income", {
      method: "POST",
      body: JSON.stringify({ branchId: "b1", amount: "1000", description: "Wash", date: "2024-01-15", createdById: "u1" }),
    }));
    expect(res.status).toBe(200);
    expect(prisma.income.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ branchId: "b1", amount: 1000 }),
    });
  });
});

describe("Branch Expense API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireAuth).mockResolvedValue(null);
  });

  it("GET returns expenses and categories", async () => {
    vi.mocked(prisma.expense.findMany).mockResolvedValue([{ id: "e1", amount: 200 }] as any);
    vi.mocked(prisma.category.findMany).mockResolvedValue([{ id: "c2", name: "Supplies" }] as any);

    const res = await expenseRoute.GET(makeRequest("http://localhost:3000/api/branch/expense?branchId=b1"));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.expenses).toHaveLength(1);
  });

  it("GET returns 400 when branchId missing", async () => {
    const res = await expenseRoute.GET(makeRequest("http://localhost:3000/api/branch/expense"));
    expect(res.status).toBe(400);
  });

  it("POST creates expense record", async () => {
    vi.mocked(prisma.expense.create).mockResolvedValue({ id: "e2", amount: 300 } as any);
    const res = await expenseRoute.POST(makeRequest("http://localhost:3000/api/branch/expense", {
      method: "POST",
      body: JSON.stringify({ branchId: "b1", amount: "300", description: "Soap", date: "2024-01-15", createdById: "u1" }),
    }));
    expect(res.status).toBe(200);
    expect(prisma.expense.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ branchId: "b1", amount: 300 }),
    });
  });
});
