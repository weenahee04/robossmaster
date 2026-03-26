import { describe, it, expect, vi, beforeEach } from "vitest";
import { makeRequest } from "../helpers";

vi.mock("@/lib/prisma", () => ({
  default: {
    payroll: { findMany: vi.fn(), create: vi.fn(), update: vi.fn() },
    employee: { findMany: vi.fn() },
  },
}));

vi.mock("@/lib/api-auth", () => ({ requireAuth: vi.fn() }));

import { GET, POST, PATCH } from "@/app/api/branch/payroll/route";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

describe("Branch Payroll API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireAuth).mockResolvedValue(null);
  });

  it("GET returns payrolls and employees", async () => {
    vi.mocked(prisma.payroll.findMany).mockResolvedValue([{ id: "p1" }] as any);
    vi.mocked(prisma.employee.findMany).mockResolvedValue([{ id: "e1" }] as any);

    const res = await GET(makeRequest("http://localhost:3000/api/branch/payroll?branchId=b1"));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.payrolls).toHaveLength(1);
    expect(data.employees).toHaveLength(1);
  });

  it("GET returns 400 when branchId missing", async () => {
    const res = await GET(makeRequest("http://localhost:3000/api/branch/payroll"));
    expect(res.status).toBe(400);
  });

  it("POST creates payroll with totalPay calculation", async () => {
    vi.mocked(prisma.payroll.create).mockResolvedValue({ id: "p2", totalPay: 16500 } as any);

    const res = await POST(makeRequest("http://localhost:3000/api/branch/payroll", {
      method: "POST",
      body: JSON.stringify({
        branchId: "b1", employeeId: "e1", month: "1", year: "2024",
        baseSalary: "15000", overtimePay: "2000", deductions: "500",
      }),
    }));
    expect(res.status).toBe(200);
    expect(prisma.payroll.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        baseSalary: 15000, overtimePay: 2000, deductions: 500,
        totalPay: 16500, status: "PENDING",
      }),
    });
  });

  it("PATCH updates payroll status", async () => {
    vi.mocked(prisma.payroll.update).mockResolvedValue({ id: "p1", status: "PAID" } as any);
    const res = await PATCH(makeRequest("http://localhost:3000/api/branch/payroll", {
      method: "PATCH",
      body: JSON.stringify({ id: "p1", status: "PAID" }),
    }));
    expect(res.status).toBe(200);
    expect(prisma.payroll.update).toHaveBeenCalledWith({
      where: { id: "p1" },
      data: expect.objectContaining({ status: "PAID", paidAt: expect.any(Date) }),
    });
  });

  it("PATCH PENDING status does not set paidAt", async () => {
    vi.mocked(prisma.payroll.update).mockResolvedValue({ id: "p1" } as any);
    await PATCH(makeRequest("http://localhost:3000/api/branch/payroll", {
      method: "PATCH",
      body: JSON.stringify({ id: "p1", status: "PENDING" }),
    }));
    expect(prisma.payroll.update).toHaveBeenCalledWith({
      where: { id: "p1" },
      data: { status: "PENDING" },
    });
  });
});
