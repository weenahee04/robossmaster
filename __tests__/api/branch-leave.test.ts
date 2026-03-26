import { describe, it, expect, vi, beforeEach } from "vitest";
import { makeRequest } from "../helpers";

vi.mock("@/lib/prisma", () => ({
  default: {
    leaveRequest: { findMany: vi.fn(), create: vi.fn(), update: vi.fn() },
    employee: { findMany: vi.fn() },
  },
}));

vi.mock("@/lib/api-auth", () => ({ requireAuth: vi.fn() }));

import { GET, POST, PATCH } from "@/app/api/branch/leave/route";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

describe("Branch Leave API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireAuth).mockResolvedValue(null);
  });

  it("GET returns leave requests and employees", async () => {
    vi.mocked(prisma.leaveRequest.findMany).mockResolvedValue([{ id: "l1" }] as any);
    vi.mocked(prisma.employee.findMany).mockResolvedValue([{ id: "e1" }] as any);

    const res = await GET(makeRequest("http://localhost:3000/api/branch/leave?branchId=b1"));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.leaveRequests).toHaveLength(1);
    expect(data.employees).toHaveLength(1);
  });

  it("GET returns 400 when branchId missing", async () => {
    const res = await GET(makeRequest("http://localhost:3000/api/branch/leave"));
    expect(res.status).toBe(400);
  });

  it("POST creates leave request", async () => {
    vi.mocked(prisma.leaveRequest.create).mockResolvedValue({ id: "l2" } as any);
    const res = await POST(makeRequest("http://localhost:3000/api/branch/leave", {
      method: "POST",
      body: JSON.stringify({ branchId: "b1", employeeId: "e1", type: "SICK", startDate: "2024-01-15", endDate: "2024-01-16", reason: "Sick" }),
    }));
    expect(res.status).toBe(200);
    expect(prisma.leaveRequest.create).toHaveBeenCalled();
  });

  it("PATCH approves/rejects leave", async () => {
    vi.mocked(prisma.leaveRequest.update).mockResolvedValue({ id: "l1", status: "APPROVED" } as any);
    const res = await PATCH(makeRequest("http://localhost:3000/api/branch/leave", {
      method: "PATCH",
      body: JSON.stringify({ id: "l1", status: "APPROVED", approvedById: "u1" }),
    }));
    expect(res.status).toBe(200);
    expect(prisma.leaveRequest.update).toHaveBeenCalledWith({
      where: { id: "l1" },
      data: { status: "APPROVED", approvedById: "u1" },
    });
  });
});
